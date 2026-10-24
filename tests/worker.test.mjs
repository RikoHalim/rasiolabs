import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Miniflare, Log, LogLevel, convertV4MiniflareOptions } from 'miniflare';
import { dispatchEmail, resendActivation } from '../server/client-auth.mjs';
import { defaultsFor, fieldsFor } from '../server/model.mjs';
import {profilePages,profileBase,profileAsset} from '../server/profile-pages.mjs';

const repo = fileURLToPath(new URL('../', import.meta.url));
const origin = 'http://localhost';
const clientSecret = 'S'.repeat(43);
const fixturePassword = 'Local-client-password-2026!';
const adminCode = 'A'.repeat(43); // Isolated local fixture; never an environment credential.
const previewCode = 'B'.repeat(43); // Separate isolated client trial fixture.
const hash = value => createHash('sha256').update(value).digest('hex');
let mf, db, ipCounter = 1;
// Historical approved-contract fixtures keep auth/CMS/idempotency coverage isolated
// from the closed v4 production gate. No override is emitted into a deploy artifact.
async function approvedFixtureModule(file) {
  let contents=await readFile(path.join(repo,'server',file),'utf8');
  if(file==='worker.mjs')contents=contents.replaceAll("requireProductionApproval('checkout')", "if(request.headers.get('X-Test-Unapproved-Policy')!=='1'){}else requireProductionApproval('checkout')");
  if(file==='model.mjs')contents=contents.replace('renewalMonthly:null','renewalMonthly:87200');
  if(file==='domains.mjs')contents=contents.replace('if (duration !== 1) return null;','if (duration !== 1) return 0;');
  return {type:'ESModule',path:path.join(repo,'server',file),contents};
}
const approvedFixtureModules=await Promise.all(['worker.mjs','model.mjs','policy-v4.mjs','client-auth.mjs','domains.mjs','profile-templates.mjs','profile-renderer.mjs','profile-pages.mjs','templates/index.mjs','template-catalog.mjs','templates/padel-data.mjs','templates/legacy-expansion.mjs'].map(approvedFixtureModule));


before(async () => {
  mf = new Miniflare(convertV4MiniflareOptions({ workers: [{
    name: 'rasio-tests',
    modules: approvedFixtureModules, modulesRoot: repo,
    compatibilityDate: '2026-09-01',
    bindings: { PUBLIC_ORIGIN: origin, ADMIN_ACCESS_HASH: hash(adminCode), CMS_PREVIEW_ACCESS_HASH: hash(previewCode), CLIENT_AUTH_SECRET: clientSecret },
    d1Databases: ['DB'], r2Buckets: ['BUCKET'],
    assets: { directory: path.join(repo, 'dist'), binding: 'ASSETS', run_worker_first: true, routerConfig: { has_user_worker: true } },
  }], log: new Log(LogLevel.ERROR) }));
  db = await mf.getD1Database('DB');
  const migrations = (await readdir(path.join(repo, 'drizzle'))).filter(name => name.endsWith('.sql')).sort();
  assert.ok(migrations.length, 'Generate the initial Drizzle migration before running tests.');
  for (const migration of migrations) {
    const sql = await readFile(path.join(repo, 'drizzle', migration), 'utf8');
    for (const statement of sql.split('--> statement-breakpoint')) {
      if (statement.trim()) await db.exec(statement.replace(/\r?\n/g, ' ').trim());
    }
  }
});

after(async () => { if (mf) await mf.dispose(); });

test('verifikasi pembayaran membuat satu akun otomatis, tetapi checkout tidak bisa melewati password pertama',async()=>{
  const admin=await login(),a=await createOrder();
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM client_accounts WHERE order_id = ?').bind(a.order.id).first()).n,0);
  const patch={status:'review',paymentStatus:'verified',paymentReference:'LOCAL-TEST',domainStatus:'confirmed'};
  const results=await Promise.all([0,1].map(()=>request(`/api/admin/orders/${a.order.id}`,{method:'PATCH',session:admin,json:patch})));
  for(const r of results){const data=await jsonResponse(r,200);assert.ok(data.account.username);assert.equal(data.account.emailStatus,'waiting_setup');assert.equal(data.account.activated,false);}
  const account=await db.prepare('SELECT * FROM client_accounts WHERE order_id = ?').bind(a.order.id).first();
  assert.equal(account.password_hash,null);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM client_accounts WHERE order_id = ?').bind(a.order.id).first()).n,1);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM email_outbox WHERE account_id = ?').bind(account.id).first()).n,1);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM password_resets WHERE account_id = ?').bind(account.id).first()).n,1);
  const locked=await clientContent(a);assert.equal(locked.activationRequired,true);assert.equal(locked.content,null);
  assert.equal((await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:1,content:{}}})).status,403);
  await jsonResponse(await request(`/api/admin/orders/${a.order.id}/publish`,{method:'POST',session:admin,json:{revision:1}}),200);
  assert.equal((await request('/api/client/publish',{method:'POST',session:a.session,json:{revision:1}})).status,403);
  assert.equal((await request(`/preview/${a.order.slug}`,{session:a.session})).status,403);
  const png=Uint8Array.from([137,80,78,71,13,10,26,10,...new Array(24).fill(0)]);
  const upload=await jsonResponse(await request(`/api/admin/orders/${a.order.id}/media`,{method:'POST',session:admin,body:png,headers:{'Content-Type':'image/png'}}),201);
  assert.equal((await request(upload.url,{session:a.session})).status,403);
  const info=await jsonResponse(await request(`/api/admin/orders/${a.order.id}/activation-link`,{session:admin}),200);
  const token=new URLSearchParams(new URL(info.url).hash.slice(1)).get('reset');
  const outbox=await db.prepare('SELECT payload FROM email_outbox WHERE account_id = ?').bind(account.id).first();
  assert.ok(!outbox.payload.includes(token),'Activation link encrypted at rest');
  assert.equal((await request('/api/access',{method:'POST',json:{code:token}})).status,401,'Activation is not a CMS session shortcut');
  const r=await jsonResponse(await request('/api/auth/reset-info',{method:'POST',json:{token}}),200);assert.equal(r.username,account.username);
  assert.equal((await request('/api/auth/reset',{method:'POST',json:{token,password:'short',confirmPassword:'short'}})).status,400);
  const resets=await Promise.all([0,1].map(()=>request('/api/auth/reset',{method:'POST',json:{token,password:fixturePassword,confirmPassword:fixturePassword}})));
  assert.deepEqual(resets.map(r=>r.status).sort(),[200,400]);
  const stored=await db.prepare('SELECT * FROM client_accounts WHERE id = ?').bind(account.id).first();assert.equal(stored.version,2);assert.ok(stored.password_hash);assert.notEqual(stored.password_hash,fixturePassword);
  a.session=await passwordLogin(account.username.toUpperCase());assert.ok((await clientContent(a)).content);
  assert.equal((await request('/api/auth/reset-info',{method:'POST',json:{token}})).status,400);
  assert.equal((await request('/api/auth/login',{method:'POST',json:{username:account.username,password:'incorrect-password'}})).status,401);
});

test('lupa password memakai respons generik dan reset membatalkan password serta sesi lama',async()=>{
  const admin=await login(),a=await createOrder();await verify(a,admin);const account=(await clientContent(a)).account;
  await db.prepare('UPDATE password_resets SET created_at = 0 WHERE account_id = (SELECT id FROM client_accounts WHERE order_id = ?)').bind(a.order.id).run();
  const known=await jsonResponse(await request('/api/auth/forgot',{method:'POST',json:{username:account.username}}),200);
  const unknown=await jsonResponse(await request('/api/auth/forgot',{method:'POST',json:{username:'unknown-client'}}),200);
  assert.deepEqual(known,unknown);assert.equal(Object.hasOwn(known,'jobId'),false);
  assert.equal((await request('/api/client/order',{session:a.session})).status,200,'Request alone does not invalidate login');
  const link=await jsonResponse(await request(`/api/admin/orders/${a.order.id}/activation-link`,{session:admin}),200),token=new URLSearchParams(new URL(link.url).hash.slice(1)).get('reset'),nextPassword='Replacement-password-2026!';
  await jsonResponse(await request('/api/auth/reset',{method:'POST',json:{token,password:nextPassword,confirmPassword:nextPassword}}),200);
  assert.equal((await request('/api/client/order',{session:a.session})).status,401);
  assert.equal((await request('/api/auth/login',{method:'POST',json:{username:account.username,password:fixturePassword}})).status,401);
  a.session=await passwordLogin(account.username,nextPassword);assert.equal((await request('/api/client/order',{session:a.session})).status,200);
  for(let n=0;n<5;n++)assert.equal((await request('/api/auth/forgot',{method:'POST',json:{username:'unknown'},ip:'192.0.2.252'})).status,200);
  assert.equal((await request('/api/auth/forgot',{method:'POST',json:{username:'unknown'},ip:'192.0.2.252'})).status,429);
});

test('email belum dikirim tanpa konfigurasi; adapter memakai idempotensi dan mencatat kegagalan tanpa membatalkan pembayaran',async()=>{
  const admin=await login(),a=await createOrder();const result=await verify(a,admin,false);assert.equal(result.account.emailStatus,'waiting_setup');
  const job=await db.prepare('SELECT email_outbox.* FROM email_outbox JOIN client_accounts ON client_accounts.id = email_outbox.account_id WHERE order_id = ?').bind(a.order.id).first();
  const savedFetch=globalThis.fetch;let calls=0;
  try{
    globalThis.fetch=async (url,options)=>{calls++;assert.equal(url,'https://api.resend.com/emails');assert.equal(options.headers['Idempotency-Key'],'rasio-'+job.id);const mail=JSON.parse(options.body);assert.deepEqual(mail.to,['owner@example.test']);assert.match(mail.text,/Username:/);assert.match(mail.text,/#reset=/);assert.ok(!mail.text.includes(fixturePassword));return calls===1?Response.json({error:'failure'},{status:503}):Response.json({id:'fixture-mail-accepted'});};
    const env={DB:db,CLIENT_AUTH_SECRET:clientSecret,RESEND_API_KEY:'test-only',EMAIL_FROM:'Rasio Labs <no-reply@example.test>'};
    await dispatchEmail(env,job.id);assert.equal((await db.prepare('SELECT status FROM email_outbox WHERE id = ?').bind(job.id).first()).status,'failed');
    await dispatchEmail(env,job.id);await dispatchEmail(env,job.id);assert.equal(calls,2);
    const sent=await db.prepare('SELECT * FROM email_outbox WHERE id = ?').bind(job.id).first();assert.equal(sent.status,'sent');assert.equal(sent.payload,'');assert.equal(sent.provider_id,'fixture-mail-accepted');
    assert.equal((await clientContent(a)).order.paymentStatus,'verified');
  }finally{globalThis.fetch=savedFetch;}
});

test('aktivasi pesanan lama tanpa akun hanya mengirim satu email yang masih berlaku',async()=>{
  const a=await createOrder();
  await db.prepare("UPDATE orders SET payment_status = 'verified' WHERE id = ?").bind(a.order.id).run();
  const order=await db.prepare('SELECT * FROM orders WHERE id = ?').bind(a.order.id).first();
  const savedFetch=globalThis.fetch;let calls=0,mail;
  try{
    globalThis.fetch=async(url,options)=>{calls++;mail=JSON.parse(options.body);return Response.json({id:'legacy-fixture-mail'});};
    const result=await resendActivation({DB:db,CLIENT_AUTH_SECRET:clientSecret,PUBLIC_ORIGIN:origin,RESEND_API_KEY:'test-only',EMAIL_FROM:'Rasio Labs <no-reply@example.test>'},order);
    assert.equal(calls,1);assert.ok(mail.text.includes(result.url));assert.equal(result.account.emailStatus,'sent');
    const active=await db.prepare('SELECT COUNT(*) AS n FROM password_resets WHERE account_id = (SELECT id FROM client_accounts WHERE order_id = ?) AND used_at IS NULL').bind(order.id).first();
    assert.equal(active.n,1);
  }finally{globalThis.fetch=savedFetch;}
});

test('navbar tersimpan, terisolasi antara draft dan publik, serta tetap aman untuk konten lama',async()=>{
  const admin=await login(),a=await createOrder();await verify(a,admin);
  const initial=await clientContent(a),legacy={...initial.content.draft};
  for(const key of Object.keys(legacy))if(key.startsWith('nav'))delete legacy[key];
  await db.prepare('UPDATE contents SET draft = ? WHERE order_id = ?').bind(JSON.stringify(legacy),a.order.id).run();
  const restored=await clientContent(a);assert.equal(restored.content.draft.nav2Visible,true);assert.equal(restored.content.draft.nav1Target,'studio');
  await jsonResponse(await request(`/api/admin/orders/${a.order.id}/publish`,{method:'POST',session:admin,json:{revision:restored.content.revision}}),200);
  const publicUrl=`/website/${a.order.slug}`;
  assert.match(await (await request(publicUrl)).text(),/data-cms-menu="1" href="[^"]+\/club">The club/);
  const content={...restored.content.draft,nav1Label:'<b>Portfolio</b>',nav1Target:'studio',nav2Visible:false,navCtaLabel:'Chat WhatsApp',whatsapp:'+60142317052',extra1Title:'<b>Planning your home</b>'};
  assert.equal((await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:restored.content.revision,content:{...content,nav1Target:'javascript:alert(1)'}}})).status,400);
  const saved=await jsonResponse(await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:restored.content.revision,content}}),200);
  const reopened=await clientContent(a);assert.equal(reopened.content.draft.nav2Visible,false);assert.equal(reopened.content.draft.nav1Target,'studio');
  const preview=await (await request(`/preview/${a.order.slug}`,{session:a.session})).text();
  assert.match(preview,/data-cms-menu="1" href="[^"]+\/club">&lt;b&gt;Portfolio&lt;\/b&gt;/);assert.doesNotMatch(preview,/data-cms-menu="2"/);assert.match(preview,/id="studio"/);
  assert.match(preview,/data-cms-nav-cta[^>]*href="https:\/\/wa.me\/60142317052">Chat WhatsApp<\/a>/);
  assert.match(preview,/data-cms-field="extra1Title"[^>]*>&lt;b&gt;Planning your home&lt;\/b&gt;/);
  assert.match(await (await request(publicUrl)).text(),/data-cms-menu="1" href="[^"]+\/club">The club/);
  await jsonResponse(await request('/api/client/publish',{method:'POST',session:a.session,json:{revision:saved.revision}}),200);
  assert.doesNotMatch(await (await request(publicUrl)).text(),/data-cms-menu="2"/);
  const empty={...reopened.content.draft,navCtaVisible:false};for(const n of [1,2,3,4])empty[`nav${n}Visible`]=false;
  await jsonResponse(await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:saved.revision,content:empty}}),200);
  const hidden=await (await request(`/preview/${a.order.slug}`,{session:a.session})).text();
  assert.match(hidden,/<button class="studio-menu"[^>]*hidden/);assert.match(hidden,/<nav id="studio-nav"[^>]*hidden/);assert.doesNotMatch(hidden,/data-cms-menu=/);assert.doesNotMatch(hidden,/data-cms-nav-cta/);
});

test('username percobaan membuka CMS yang sama tanpa membuat akun pembayaran atau akses admin',async()=>{
  const before=await db.prepare('SELECT COUNT(*) AS n FROM client_accounts').first();
  const byCode=await login(previewCode),existing=await jsonResponse(await request('/api/client/order',{session:byCode}),200);
  const session=await passwordLogin(' RASIO-PREVIEW ',previewCode);
  const current=await jsonResponse(await request('/api/client/order',{session}),200);
  assert.equal(current.order.id,existing.order.id);assert.equal(current.order.isPreview,true);assert.deepEqual(current.content,existing.content);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM client_accounts').first()).n,before.n);
  assert.equal((await request('/api/admin/orders',{session})).status,403);
  assert.equal((await request('/api/client/publish',{method:'POST',session,json:{revision:current.content.revision}})).status,409);
  for(const password of [adminCode,'wrong-password',null,123])assert.equal((await request('/api/auth/login',{method:'POST',json:{username:'rasio-preview',password}})).status,401);
  assert.equal((await request('/api/auth/login',{method:'POST',json:null})).status,401);
  const ip='192.0.2.253';for(let n=0;n<12;n++)assert.equal((await request('/api/auth/login',{method:'POST',ip,json:{username:'rasio-preview',password:'wrong'}})).status,401);
  assert.equal((await request('/api/auth/login',{method:'POST',ip,json:{username:'rasio-preview',password:previewCode}})).status,429);
});

async function request(url, options = {}) {
  const method = options.method || 'GET';
  const headers = new Headers(options.headers);
  headers.set('CF-Connecting-IP', options.ip || `192.0.2.${(ipCounter++ % 250) + 1}`);
  if (method !== 'GET' && method !== 'HEAD' && !headers.has('Origin')) headers.set('Origin', origin);
  if (options.session) {
    headers.set('Cookie', options.session.cookie);
    if (options.csrf !== false) headers.set('X-CSRF-Token', options.session.csrf);
  }
  let body = options.body;
  if (options.json !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.json);
  }
  return mf.dispatchFetch(`${origin}${url}`, { method, headers, body, redirect: 'manual' });
}

async function jsonResponse(response, status) {
  const text = await response.text();
  assert.equal(response.status, status, text);
  return JSON.parse(text);
}

async function login(code = adminCode) {
  const response = await request('/api/access', { method: 'POST', json: { code } });
  const cookie = response.headers.get('set-cookie');
  const payload = await jsonResponse(response, 200);
  return { ...payload, cookie: cookie.split(';')[0], cookieAttributes: cookie };
}

const orderBody = () => ({
  service: 'profile', template: 'Padel', duration: 24, consent: true,
  businessName: `Studio Test ${randomUUID().slice(0, 8)}`, customerName: 'Pemilik Test',
  whatsapp: '+6281234567890', email: 'owner@example.test', domain: `studio-${randomUUID().slice(0, 8)}.com`
});

async function createOrder(body = orderBody(), key = randomUUID(), status = 201) {
  const response = await request('/api/orders', { method: 'POST', json: body, headers: { 'Idempotency-Key': key } });
  const cookie = response.headers.get('set-cookie');
  const payload = await jsonResponse(response, status);
  return { ...payload, key, body, session: { cookie: cookie.split(';')[0], csrf: payload.csrf } };
}

async function clientContent(order) {
  return jsonResponse(await request('/api/client/order', { session: order.session }), 200);
}

async function passwordLogin(username,password=fixturePassword) {
  const response=await request('/api/auth/login',{method:'POST',json:{username,password}});
  const payload=await jsonResponse(response,200);
  return {...payload,cookie:response.headers.get('set-cookie').split(';')[0]};
}
async function activation(order,admin) {
  const info=await jsonResponse(await request(`/api/admin/orders/${order.order.id}/activation-link`,{session:admin}),200);
  const token=new URLSearchParams(new URL(info.url).hash.slice(1)).get('reset');
  const ready=await jsonResponse(await request('/api/auth/reset',{method:'POST',json:{token,password:fixturePassword,confirmPassword:fixturePassword}}),200);
  order.session=await passwordLogin(ready.username);return ready;
}
async function verify(order,admin,activate=true) {
  const result=await jsonResponse(await request(`/api/admin/orders/${order.order.id}`,{
    method:'PATCH',session:admin,json:{status:'review',paymentStatus:'verified',paymentReference:'LOCAL-TEST-RECEIPT',domainStatus:'confirmed'}
  }),200);
  if(activate)await activation(order,admin);
  return result;
}

test('template baru tersambung dari pesanan sampai CMS dan publikasi dengan layout terpilih', async () => {
  const admin = await login();
  for (const template of ['Padel']) {
    const a = await createOrder({ ...orderBody(), template });
    assert.equal(a.order.template, template);
    assert.equal((await request(`/api/orders`, { method:'POST', json:{ ...a.body, duration:12 }, headers:{ 'Idempotency-Key':a.key } })).status, 409);
    assert.equal((await request(`/preview/${a.order.slug}`)).status, 401);
    await verify(a, admin);
    const initial = await clientContent(a);
    const expected = defaultsFor(template);
    assert.equal(initial.order.template, template);
    assert.equal(initial.content.draft.heroTitle, expected.heroTitle);
    assert.equal(initial.content.draft.heroImage, expected.heroImage);
    assert.equal(initial.content.draft.nav1Label, expected.nav1Label);
    const content = { ...initial.content.draft, heroTitle:'<strong>Konten klien</strong>', nav1Label:'Our business', nav1Target:'studio', whatsapp:'+6281234567890', contactLabel:'Talk to us', navCtaVisible:false };
    for (const n of [1,2,3,4]) content[`nav${n}Visible`] = false;
    const saved = await jsonResponse(await request('/api/client/content', { method:'PUT', session:a.session, json:{ revision:initial.content.revision, content } }), 200);
    const preview = await request(`/preview/${a.order.slug}`, { session:a.session });
    assert.match(preview.headers.get('x-robots-tag'), /noindex/);
    const html = await preview.text();
    assert.match(html, new RegExp(`theme-${template.toLowerCase()}`));
    assert.match(html, /&lt;strong&gt;Konten klien&lt;\/strong&gt;/);
    assert.doesNotMatch(html, /template-access|data-cms-menu="[1-4]"|data-cms-nav-cta/);
    assert.match(html, /class="studio-menu"[^>]*hidden/);
    assert.match(html, /class="studio-nav"[^>]*hidden/);
    assert.match(html, /href="https:\/\/wa.me\/6281234567890"/);
    assert.doesNotMatch(html, /wa.me\/60142317052/);
    assert.match(html, /data-cms-image="heroImage"/);
    assert.equal((html.match(/data-cms-image="logo"/g) || []).length, 2);
    assert.equal((await request(`/website/${a.order.slug}`)).status, 404);
    const published = await jsonResponse(await request(`/api/admin/orders/${a.order.id}/publish`, { method:'POST', session:admin, json:{ revision:saved.revision } }), 200);
    assert.match(await (await request(published.url)).text(), /&lt;strong&gt;Konten klien&lt;\/strong&gt;/);
    await jsonResponse(await request('/api/client/content', { method:'PUT', session:a.session, json:{ revision:saved.revision, content:{ ...content, heroTitle:'Draft terpisah' } } }), 200);
    assert.doesNotMatch(await (await request(published.url)).text(), /Draft terpisah/);
    assert.match(await (await request(`/preview/${a.order.slug}`, { session:a.session })).text(), /Draft terpisah/);
  }
});

test('statistik bisnis milik klien dapat disunting, diterbitkan, dan disembunyikan pada setiap template',async()=>{
  const admin=await login();
  for(const template of ['Padel']){
    const a=await createOrder({...orderBody(),template});await verify(a,admin);
    const initial=await clientContent(a);
    const content={...initial.content.draft,statisticsVisible:true,statisticsTitle:'Our business in numbers',stat1Value:'25+',stat1Label:'Completed projects'};
    const saved=await jsonResponse(await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:initial.content.revision,content}}),200);
    const published=await jsonResponse(await request(`/api/admin/orders/${a.order.id}/publish`,{method:'POST',session:admin,json:{revision:saved.revision}}),200);
    const visible=await (await request(published.url)).text();
    assert.match(visible,/Our business in numbers/);assert.match(visible,/Completed projects/);assert.match(visible,/>25\+</);
    const hidden=await jsonResponse(await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:saved.revision,content:{...content,statisticsVisible:false}}}),200);
    assert.doesNotMatch(await (await request(`/preview/${a.order.slug}`,{session:a.session})).text(),/data-business-statistics/);
    assert.match(await (await request(published.url)).text(),/data-business-statistics/);
    await jsonResponse(await request(`/api/admin/orders/${a.order.id}/publish`,{method:'POST',session:admin,json:{revision:hidden.revision}}),200);
    assert.doesNotMatch(await (await request(published.url)).text(),/data-business-statistics/);
  }
});

test('database dan storage lokal tersedia tanpa gateway pembayaran palsu', async () => {
  const data = await jsonResponse(await request('/api/health'), 200);
  assert.deepEqual(data, { ok: true, database: true, storage: true, paymentGateway: false });
});

test('portal dan template dikirim sebagai HTML, bukan loop redirect dari asset .html', async () => {
  for (const url of ['/admin', '/cms', '/template-padel']) {
    const response = await request(url);
    assert.equal(response.status, 200, `${url}: ${response.headers.get('location')}`);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(await response.text(), /<html/);
  }
});

test('sesi aman, origin dan CSRF wajib; klien tidak bisa membuka endpoint admin', async () => {
  assert.equal((await request('/api/session')).status, 401);
  assert.equal((await request('/api/access', { method: 'POST', json: { code: 'x'.repeat(43) } })).status, 401);
  assert.equal((await request('/api/access', { method: 'POST', json: { code: adminCode }, headers: { Origin: 'https://attacker.test' } })).status, 403);
  const admin = await login();
  assert.match(admin.cookieAttributes, /HttpOnly/);
  assert.match(admin.cookieAttributes, /SameSite=Strict/);
  const session = await jsonResponse(await request('/api/session', { session: admin }), 200);
  assert.equal(session.role, 'admin');
  assert.equal((await request('/api/logout', { method: 'POST', session: admin, csrf: false })).status, 403);
  assert.equal((await request('/api/logout', { method: 'POST', session: admin, headers: { Origin: 'https://attacker.test' } })).status, 403);
  const client = await createOrder();
  assert.equal((await request('/api/admin/orders', { session: client.session })).status, 403);
  await jsonResponse(await request('/api/logout', { method: 'POST', session: admin }), 200);
  assert.equal((await request('/api/session', { session: admin })).status, 401);
});

test('pesanan persisten, harga dihitung server dan retry tidak menciptakan pesanan kedua', async () => {
  const first = await createOrder({ ...orderBody(), total: 1, monthly: 1, paymentStatus: 'verified' });
  assert.equal(first.order.total, 768000);
  assert.equal(first.order.monthly, 32000);
  assert.equal(first.order.renewalMonthly, 87200);
  assert.equal(first.order.paymentStatus, 'pending');
  const again = await createOrder(first.body, first.key, 200);
  assert.equal(again.order.id, first.order.id);
  const count = await db.prepare('SELECT COUNT(*) AS count FROM orders WHERE id = ?').bind(first.order.id).first();
  assert.equal(count.count, 1);
  assert.equal((await request('/api/orders', { method: 'POST', json: { ...first.body, duration: 12 }, headers: { 'Idempotency-Key': first.key } })).status, 409);
  const client = await clientContent(again);
  assert.equal(client.order.id, first.order.id);
  assert.equal(client.content, null, 'CMS belum tersedia sebelum pembayaran diperiksa.');
  const admin = await login();
  await verify(first, admin);
  assert.equal((await clientContent(first)).content.draft.businessName, first.body.businessName);
  assert.equal((await request('/api/client/order',{session:again.session})).status,401,'Session checkout lama berakhir setelah password dibuat.');
});

test('dua checkout bersamaan dengan idempotency key sama menghasilkan satu pesanan', async () => {
  const key = randomUUID(), body = orderBody();
  const responses = await Promise.all([0, 1].map(() => request('/api/orders', { method: 'POST', json: body, headers: { 'Idempotency-Key': key } })));
  const payloads = [];
  for (const response of responses) {
    assert.ok([200, 201].includes(response.status), await response.clone().text());
    payloads.push(await response.json());
  }
  assert.equal(payloads[0].order.id, payloads[1].order.id);
  const count = await db.prepare('SELECT COUNT(*) AS count FROM orders WHERE idempotency_hash = ?').bind(hash(key)).first();
  assert.equal(count.count, 1);
});

test('halaman tiap sektor memakai route sendiri dan seluruh draft tetap privat',async()=>{
  const admin=await login(),other=await createOrder();await verify(other,admin);
  for(const template of Object.keys(profilePages)){
    const a=await createOrder({...orderBody(),template});await verify(a,admin);
    const initial=await clientContent(a);
    assert.deepEqual(initial.pages,profilePages[template]);
    for(const page of Object.keys(profilePages[template]).filter(Boolean)){
      const demo=await request(profileBase(template)+'/'+page);assert.equal(demo.status,200,template+'/'+page);
      assert.match(await demo.text(),/profile-pages.js/);
      assert.equal((await request('/preview/'+a.order.slug+'/'+page)).status,401);
      assert.equal((await request('/preview/'+a.order.slug+'/'+page,{session:other.session})).status,404);
      assert.equal((await request('/website/'+a.order.slug+'/'+page)).status,404);
      const preview=await request('/preview/'+a.order.slug+'/'+page,{session:a.session});
      assert.equal(preview.status,200);assert.match(preview.headers.get('x-robots-tag'),/noindex/);
      const html=await preview.text();
      assert.doesNotMatch(html,/template-access|href="\/template-(?:architecture|padel|creative|consulting)(?=[/." ])/);
      assert.match(html,new RegExp('href="/preview/'+a.order.slug));
    }
    assert.equal((await request('/preview/'+a.order.slug+'/not-a-page',{session:a.session})).status,404);
    await jsonResponse(await request('/api/admin/orders/'+a.order.id+'/publish',{method:'POST',session:admin,json:{revision:initial.content.revision}}),200);
    for(const page of Object.keys(profilePages[template]).filter(Boolean)){
      const response=await request('/website/'+a.order.slug+'/'+page);assert.equal(response.status,200);
      const html=await response.text();assert.doesNotMatch(html,/href="\/preview\/|href="\/template-(?:architecture|padel|creative|consulting)(?=[/." ])/);
      assert.match(html,new RegExp('href="/website/'+a.order.slug));
    }
    assert.equal((await request('/website/'+a.order.slug+'/not-a-page')).status,404);
  }
  assert.equal((await request('/template-padel/not-a-page')).status,404);
});

test('brief persiapan setiap sektor menuju formulir enquiry milik klien yang sama',async()=>{
  const admin=await login();
  const routes={Padel:['first-game','group-play','visit#enquiry']};
  for(const [template,[first,second,destination]] of Object.entries(routes)){
    const a=await createOrder({...orderBody(),template});await verify(a,admin);
    const initial=await clientContent(a);
    for(const page of [first,second]){
      const html=await (await request('/preview/'+a.order.slug+'/'+page,{session:a.session})).text();
      assert.match(html,/data-prep-builder/);assert.match(html,/data-prep-copy/);assert.match(html,/data-prep-download/);
      assert.ok(html.includes('href="/preview/'+a.order.slug+'/'+destination+'"'),template+'/'+page);
    }
    const enquiry=await (await request('/preview/'+a.order.slug+'/'+destination.split('#')[0],{session:a.session})).text();
    assert.match(enquiry,/data-enquiry/);assert.match(enquiry,/name="message"[^>]*maxlength="6000"/);
    await jsonResponse(await request('/api/admin/orders/'+a.order.id+'/publish',{method:'POST',session:admin,json:{revision:initial.content.revision}}),200);
    for(const page of [first,second]){
      const html=await (await request('/website/'+a.order.slug+'/'+page)).text();
      assert.ok(html.includes('href="/website/'+a.order.slug+'/'+destination+'"'),template+'/'+page);
      assert.doesNotMatch(html,/href="\/template-(?:architecture|padel|creative|consulting)(?=[/." ])/);
    }
  }
});

test('enquiry memakai kontak email klien ketika WhatsApp tidak diisi',async()=>{
  const admin=await login(),a=await createOrder({...orderBody(),template:'Padel'});await verify(a,admin);
  const initial=await clientContent(a);
  const saved=await jsonResponse(await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:initial.content.revision,content:{...initial.content.draft,whatsapp:'',email:'hello@example.test'}}}),200);
  const preview=await (await request('/preview/'+a.order.slug+'/visit',{session:a.session})).text();
  assert.match(preview,/data-whatsapp=""/);assert.match(preview,/data-contact-email="hello@example.test"/);
  assert.match(preview,/<button\b[^>]*type="submit">Review enquiry<\/button>/);assert.match(preview,/<a\b[^>]*class="footer-whatsapp"[^>]*href="mailto:hello%40example.test"/);assert.doesNotMatch(preview,/wa.me\/60142317052/);
  await jsonResponse(await request('/api/admin/orders/'+a.order.id+'/publish',{method:'POST',session:admin,json:{revision:saved.revision}}),200);
  const published=await (await request('/website/'+a.order.slug+'/visit')).text();
  assert.match(published,/data-contact-email="hello@example.test"/);assert.match(published,/<button\b[^>]*type="submit">Review enquiry<\/button>/);assert.match(published,/<a\b[^>]*class="footer-whatsapp"[^>]*href="mailto:hello%40example.test"/);
});

test('konten halaman tambahan aman, tersimpan, dan terpisah sampai diterbitkan',async()=>{
  const admin=await login(),a=await createOrder({...orderBody(),template:'Padel'});await verify(a,admin);
  const initial=await clientContent(a);
  assert.ok(initial.fields.some(g=>g.items.some(f=>f.key==='founder1Bio')));
  const legacy={...initial.content.draft};for(const key of ['founder1Bio','communityImage','locationLat','extra1Body1','home1Title','home2Item1Body'])delete legacy[key];
  await db.prepare('UPDATE contents SET draft = ? WHERE order_id = ?').bind(JSON.stringify(legacy),a.order.id).run();
  const restored=await clientContent(a);assert.ok(restored.content.draft.founder1Bio);assert.equal(restored.content.draft.locationLat,'-6.2088');
  assert.ok(restored.content.draft.home1Title);assert.ok(restored.content.draft.home2Item1Body);
  await jsonResponse(await request('/api/admin/orders/'+a.order.id+'/publish',{method:'POST',session:admin,json:{revision:restored.content.revision}}),200);
  const next={...restored.content.draft,founder1Bio:'<script>Edited founder</script>',founder2Bio:'/media/ is ordinary text in this biography.',locationName:'Our new venue',locationLat:'-6.3',locationLon:'106.8',extra1Title:'Prepare your first game',extra1Body1:'<b>Edited preparation guide</b>',nav4Target:'extra1',nav4Label:'First game'};
  assert.equal((await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:restored.content.revision,content:{...next,locationLat:'javascript:alert(1)'}}})).status,400);
  const stranger=await createOrder();await verify(stranger,admin);
  const png=Uint8Array.from([137,80,78,71,13,10,26,10,...new Array(24).fill(0)]);
  const foreign=await jsonResponse(await request('/api/client/media',{method:'POST',session:stranger.session,body:png,headers:{'Content-Type':'image/png'}}),201);
  assert.equal((await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:restored.content.revision,content:{...next,communityImage:foreign.url}}})).status,400);
  const own=await jsonResponse(await request('/api/client/media',{method:'POST',session:a.session,body:png,headers:{'Content-Type':'image/png'}}),201);
  assert.equal((await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:restored.content.revision,content:{...next,home1Image:foreign.url}}})).status,400);
  next.communityImage=own.url;next.home1Image=own.url;next.home1Title='<script>Updated home story</script>';next.home2Item1Body='Updated homepage answer';next.whatsapp='+6281234567890';
  const saved=await jsonResponse(await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:restored.content.revision,content:next}}),200);
  const draft=await (await request('/preview/'+a.order.slug+'/club',{session:a.session})).text();
  assert.match(draft,/&lt;script&gt;Edited founder&lt;\/script&gt;/);assert.ok(draft.includes(own.url));
  assert.match(draft,/\/media\/ is ordinary text in this biography\./);
  assert.doesNotMatch(await (await request('/website/'+a.order.slug+'/club')).text(),/Edited founder/);
  const visit=await (await request('/preview/'+a.order.slug+'/visit',{session:a.session})).text();
  assert.match(visit,/data-whatsapp="6281234567890"/);assert.match(visit,/marker=-6.3%2C106.8/);assert.match(visit,/Our new venue/);
  const guide=await (await request('/preview/'+a.order.slug+'/first-game',{session:a.session})).text();
  assert.match(guide,/<title>Prepare your first game/);
  assert.match(guide,/&lt;b&gt;Edited preparation guide&lt;\/b&gt;/);
  assert.ok(guide.includes('href="/preview/'+a.order.slug+'/first-game"'));
  assert.doesNotMatch(await (await request('/website/'+a.order.slug+'/first-game')).text(),/Edited preparation guide/);
  const homePreview=await (await request('/preview/'+a.order.slug,{session:a.session})).text();
  assert.match(homePreview,/&lt;script&gt;Updated home story&lt;\/script&gt;/);assert.match(homePreview,/Updated homepage answer/);
  assert.ok(homePreview.includes('data-cms-image="home1Image" src="'+own.url));
  assert.doesNotMatch(await (await request('/website/'+a.order.slug)).text(),/Updated home story|Updated homepage answer/);
  assert.equal((await request(own.url)).status,401);
  await jsonResponse(await request('/api/client/publish',{method:'POST',session:a.session,json:{revision:saved.revision}}),200);
  assert.match(await (await request('/website/'+a.order.slug+'/club')).text(),/Edited founder/);
  assert.match(await (await request('/website/'+a.order.slug)).text(),/Updated homepage answer/);
  assert.equal((await request(own.url)).status,200);
});

test('CMS menyimpan seluruh halaman panjang dalam batas tiap bidang',async()=>{
  const admin=await login(),a=await createOrder({...orderBody(),template:'Padel'});await verify(a,admin);
  const initial=await clientContent(a),content={...initial.content.draft};
  for(const group of fieldsFor('Padel'))for(const f of group.items){
    if(['text','textarea'].includes(f.type)&&!['email','whatsapp','locationLat','locationLon'].includes(f.key))content[f.key]='x'.repeat(Math.min(f.max,450));
  }
  const payload={revision:initial.content.revision,content};
  assert.ok(JSON.stringify(payload).length>32000);
  await jsonResponse(await request('/api/client/content',{method:'PUT',session:a.session,json:payload}),200);
  const reopened=await clientContent(a);assert.equal(reopened.content.draft.extra2Body3,content.extra2Body3);
  assert.equal((await request('/api/client/content',{method:'PUT',session:a.session,json:{revision:reopened.content.revision,content:{...content,extra1Body1:'x'.repeat(64000)}}})).status,413);
});

test('domain paket 1 bulan ditagih tahunan dan tidak boleh diverifikasi tanpa kutipan harga',async()=>{
  const prices=await jsonResponse(await request('/api/domains/prices'),200);
  assert.deepEqual(prices,{prices:{},currency:'IDR',periodMonths:12});
  const a=await createOrder({...orderBody(),duration:1,total:1,domainFee:1,domainFeeExpected:null});
  assert.equal(a.order.domainIncluded,false);assert.equal(a.order.domainFee,null);
  assert.equal(a.order.total,null);assert.equal(a.order.packageTotal,109000);
  const admin=await login(),url=`/api/admin/orders/${a.order.id}`;
  const payment={paymentStatus:'verified',paymentReference:'LOCAL-DOMAIN-TEST',domainStatus:'confirmed'};
  assert.equal((await request(url,{method:'PATCH',session:admin,json:payment})).status,400);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM client_accounts WHERE order_id = ?').bind(a.order.id).first()).n,0);
  for(const domainFee of [0,-1,1.25,'180000'])assert.equal((await request(url,{method:'PATCH',session:admin,json:{domainFee}})).status,400);
  const quote=await jsonResponse(await request(url,{method:'PATCH',session:admin,json:{domainFee:180000}}),200);
  assert.equal(quote.order.total,289000);assert.equal(quote.order.packageTotal,109000);
  assert.equal((await clientContent(a)).order.domainFee,180000);
  const logsBefore=(await db.prepare('SELECT COUNT(*) AS n FROM audit WHERE order_id = ?').bind(a.order.id).first()).n;
  assert.equal((await request(url,{method:'PATCH',session:admin,json:{domainFeePrevious:null,domainFee:150000,...payment}})).status,409);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM audit WHERE order_id = ?').bind(a.order.id).first()).n,logsBefore);
  const retry=await createOrder(a.body,a.key,200);assert.equal(retry.order.total,289000);
  const confirmed=await jsonResponse(await request(url,{method:'PATCH',session:admin,json:payment}),200);
  assert.ok(confirmed.account.username);assert.equal(confirmed.order.total,289000);
  assert.equal((await request(url,{method:'PATCH',session:admin,json:{domainFee:200000}})).status,400);
  assert.equal((await request(url,{method:'PATCH',session:admin,json:{paymentStatus:'pending'}})).status,400);
  assert.equal((await db.prepare('SELECT total FROM orders WHERE id = ?').bind(a.order.id).first()).total,289000);
});

test('domain tetap gratis untuk durasi tahunan dan harga yang berubah perlu ditinjau ulang',async()=>{
  const admin=await login();
  for(const duration of [12,24,48]){
    const a=await createOrder({...orderBody(),duration,domainFeeExpected:0});
    assert.equal(a.order.domainIncluded,true);assert.equal(a.order.domainFee,0);assert.equal(a.order.total,a.order.packageTotal);
    assert.equal((await request(`/api/admin/orders/${a.order.id}`,{method:'PATCH',session:admin,json:{domainFee:180000}})).status,400);
  }
  assert.equal((await request('/api/orders',{method:'POST',json:{...orderBody(),duration:1,domainFeeExpected:180000},headers:{'Idempotency-Key':randomUUID()}})).status,409);
});

test('tarif domain terkonfigurasi muncul di pencarian, dihitung server, dan tetap sama saat retry',async()=>{
  const priced=new Miniflare(convertV4MiniflareOptions({workers:[{
    name:'rasio-priced-test',modules:approvedFixtureModules,modulesRoot:repo,
    compatibilityDate:'2026-09-01',bindings:{PUBLIC_ORIGIN:origin,CLIENT_AUTH_SECRET:clientSecret,DOMAIN_PRICES_IDR:JSON.stringify({com:150000,'co.id':310000})},d1Databases:['DB'],r2Buckets:['BUCKET'],
  }],log:new Log(LogLevel.ERROR)}));
  try{
    const pricedDb=await priced.getD1Database('DB');
    for(const file of (await readdir(path.join(repo,'drizzle'))).filter(file=>file.endsWith('.sql')).sort()){
      for(const sql of (await readFile(path.join(repo,'drizzle',file),'utf8')).split('--> statement-breakpoint'))if(sql.trim())await pricedDb.exec(sql.replace(/\r?\n/g,' ').trim());
    }
    const rates=await jsonResponse(await priced.dispatchFetch(`${origin}/api/domains/prices`),200);
    assert.deepEqual(rates.prices,{com:150000,'co.id':310000});
    const key=randomUUID(),body={...orderBody(),duration:1,domain:'priced-studio.co.id',domainFee:1,total:1,domainFeeExpected:310000};
    const send=payload=>priced.dispatchFetch(`${origin}/api/orders`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','Idempotency-Key':key,'CF-Connecting-IP':'192.0.2.44'},body:JSON.stringify(payload)});
    const first=await jsonResponse(await send(body),201);
    assert.equal(first.order.domainFee,310000);assert.equal(first.order.packageTotal,109000);assert.equal(first.order.total,419000);
    const retry=await jsonResponse(await send({...body,domainFeeExpected:450000}),200);
    assert.equal(retry.order.id,first.order.id);assert.equal(retry.order.total,419000);
  }finally{await priced.dispose();}
});

test('draft dua klien terisolasi dan perubahan revision lama tidak menimpa draft baru', async () => {
  const admin = await login(), a = await createOrder(), b = await createOrder();
  await verify(a, admin); await verify(b, admin);
  const current = await clientContent(a);
  assert.equal((await request(`/preview/${b.order.slug}`, { session: a.session })).status, 404);
  assert.equal((await request(`/api/admin/orders/${b.order.id}/content`, { method: 'PUT', session: a.session, json: { content: current.content.draft, revision: 1 } })).status, 403);
  const changed = { ...current.content.draft, heroTitle: 'Konten untuk klien A saja' };
  const saved = await jsonResponse(await request('/api/client/content', { method: 'PUT', session: a.session, json: { content: changed, revision: 1 } }), 200);
  assert.equal(saved.revision, 2);
  assert.equal((await request('/api/client/content', { method: 'PUT', session: a.session, json: { content: { ...changed, heroTitle: 'Draft basi' }, revision: 1 } })).status, 409);
  assert.equal((await clientContent(a)).content.draft.heroTitle, changed.heroTitle);
  assert.notEqual((await clientContent(b)).content.draft.heroTitle, changed.heroTitle);
});

test('unggahan memeriksa isi, ukuran dan kepemilikan; gambar privat tidak bocor', async () => {
  const admin = await login(), a = await createOrder(), b = await createOrder();
  await verify(a, admin); await verify(b, admin);
  const png = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, ...new Array(24).fill(0)]);
  const wrong = new TextEncoder().encode('<svg onload="alert(1)">not a png</svg>');
  assert.equal((await request('/api/client/media', { method: 'POST', session: a.session, body: wrong, headers: { 'Content-Type': 'image/png' } })).status, 415);
  assert.equal((await request('/api/client/media', { method: 'POST', session: a.session, body: png, headers: { 'Content-Type': 'image/svg+xml' } })).status, 415);
  assert.equal((await request('/api/client/media', { method: 'POST', session: a.session, body: new Uint8Array(4 * 1024 * 1024 + 1), headers: { 'Content-Type': 'image/png' } })).status, 413);
  const uploaded = await jsonResponse(await request('/api/client/media', { method: 'POST', session: a.session, body: png, headers: { 'Content-Type': 'image/png' } }), 201);
  assert.equal((await request(uploaded.url)).status, 401);
  assert.equal((await request(uploaded.url, { session: b.session })).status, 404);
  const privateImage = await request(uploaded.url, { session: a.session });
  assert.equal(privateImage.status, 200);
  assert.equal(privateImage.headers.get('content-type'), 'image/png');
  assert.deepEqual(new Uint8Array(await privateImage.arrayBuffer()), png);
  const contentB = await clientContent(b);
  assert.equal((await request('/api/client/content', { method: 'PUT', session: b.session, json: { content: { ...contentB.content.draft, heroImage: uploaded.url }, revision: contentB.content.revision } })).status, 400);
});

test('pembayaran dan setup wajib sebelum terbit; konten HTML klien di-escape', async () => {
  const admin = await login(), a = await createOrder();
  const initial = await clientContent(a);
  assert.equal(initial.content, null);
  assert.equal((await request(`/website/${a.order.slug}`)).status, 404);
  assert.equal((await request(`/preview/${a.order.slug}`, { session: a.session })).status, 403);
  assert.equal((await request('/api/client/content', { method: 'PUT', session: a.session, json: { revision: 1, content: {} } })).status, 403);
  assert.equal((await request('/api/client/media', { method: 'POST', session: a.session, body: new Uint8Array(16), headers: { 'Content-Type': 'image/png' } })).status, 403);
  assert.equal((await request(`/api/admin/orders/${a.order.id}/invite`, { method: 'POST', session: admin })).status, 409);
  assert.equal((await request('/api/client/publish', { method: 'POST', session: a.session, json: { revision: 1 } })).status, 409);
  assert.equal((await request(`/api/admin/orders/${a.order.id}`, { method: 'PATCH', session: a.session, json: { paymentStatus: 'verified' } })).status, 403);
  assert.equal((await request(`/api/admin/orders/${a.order.id}`, { method: 'PATCH', session: admin, json: { paymentStatus: 'verified', paymentReference: '' } })).status, 400);
  await verify(a, admin);
  const client = await clientContent(a);
  assert.equal((await request('/api/client/publish', { method: 'POST', session: a.session, json: { revision: 1 } })).status, 409);
  const unsafe = '<script id="injected">alert(1)</script>';
  const content = { ...client.content.draft, businessName: 'Studio <b>Uji</b>', heroTitle: unsafe };
  const saved = await jsonResponse(await request('/api/client/content', { method: 'PUT', session: a.session, json: { revision: 1, content } }), 200);
  const preview = await request(`/preview/${a.order.slug}`, { session: a.session });
  assert.equal(preview.status, 200);
  assert.equal(preview.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  const previewHtml = await preview.text();
  assert.match(previewHtml, /&lt;script id="injected"&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(previewHtml, /<script id="injected">/);
  assert.equal((await request(`/api/admin/orders/${a.order.id}/publish`, { method: 'POST', session: admin, json: { revision: 1 } })).status, 409);
  const published = await jsonResponse(await request(`/api/admin/orders/${a.order.id}/publish`, { method: 'POST', session: admin, json: { revision: saved.revision } }), 200);
  const publicPage = await request(published.url);
  assert.equal(publicPage.status, 200);
  assert.match(await publicPage.text(), /&lt;script id="injected"/);
  assert.equal((await clientContent(a)).order.status, 'active');
  await jsonResponse(await request(`/api/admin/orders/${a.order.id}`, { method: 'PATCH', session: admin, json: { notes: 'Catatan setelah aktif' } }), 200);
  const latest = await clientContent(a);
  const newDraft = { ...latest.content.draft, heroTitle: 'Draft belum diterbitkan' };
  const newSaved = await jsonResponse(await request('/api/client/content', { method: 'PUT', session: a.session, json: { content: newDraft, revision: latest.content.revision } }), 200);
  assert.doesNotMatch(await (await request(published.url)).text(), /Draft belum diterbitkan/);
  await jsonResponse(await request('/api/client/publish', { method: 'POST', session: a.session, json: { revision: newSaved.revision } }), 200);
  assert.match(await (await request(published.url)).text(), /Draft belum diterbitkan/);
});

test('password klien dapat dipakai kembali; pencabutan memutus semua sesi dan aktivasi ulang wajib password baru',async()=>{
  const admin=await login(),a=await createOrder();await verify(a,admin);
  const account=(await clientContent(a)).account;
  const other=await passwordLogin(account.username);
  await jsonResponse(await request('/api/logout',{method:'POST',session:other}),200);
  assert.equal((await request('/api/session',{session:other})).status,401);
  await passwordLogin(account.username);
  await jsonResponse(await request(`/api/admin/orders/${a.order.id}/revoke`,{method:'POST',session:admin}),200);
  assert.equal((await request('/api/client/order',{session:a.session})).status,401);
  assert.equal((await request('/api/auth/login',{method:'POST',json:{username:account.username,password:fixturePassword}})).status,401);
  await jsonResponse(await request(`/api/admin/orders/${a.order.id}/activation`,{method:'POST',session:admin}),200);
  assert.equal((await request('/api/auth/login',{method:'POST',json:{username:account.username,password:fixturePassword}})).status,401,'Password lama tidak hidup lagi saat akses dipulihkan.');
  await activation(a,admin);
  assert.equal((await request('/api/client/order',{session:a.session})).status,200);
  assert.equal((await request('/api/orders',{method:'POST',json:a.body,headers:{'Idempotency-Key':a.key}})).status,401);
});
test('sesi dan tautan aktivasi kedaluwarsa tidak bisa dipakai',async()=>{
  const admin=await login(),a=await createOrder();await verify(a,admin);
  await db.prepare('UPDATE sessions SET expires_at = 0 WHERE token_hash = ?').bind(hash(a.session.cookie.split('=')[1])).run();
  assert.equal((await request('/api/session',{session:a.session})).status,401);
  const invite=await jsonResponse(await request(`/api/admin/orders/${a.order.id}/activation`,{method:'POST',session:admin}),200);
  const token=new URLSearchParams(new URL(invite.url).hash.slice(1)).get('reset');
  await db.prepare('UPDATE password_resets SET expires_at = 0 WHERE account_id = (SELECT id FROM client_accounts WHERE order_id = ?)').bind(a.order.id).run();
  assert.equal((await request('/api/auth/reset-info',{method:'POST',json:{token}})).status,400);
  assert.equal((await request('/api/auth/reset',{method:'POST',json:{token,password:fixturePassword,confirmPassword:fixturePassword}})).status,400);
});

test('D1 batch rollback tidak meninggalkan sebagian pesanan ketika pernyataan gagal', async () => {
  const a = await createOrder();
  await assert.rejects(db.batch([
    db.prepare('UPDATE orders SET notes = ? WHERE id = ?').bind('Tidak boleh tersimpan', a.order.id),
    db.prepare('INSERT INTO orders (id) VALUES (?)').bind(randomUUID())
  ]));
  assert.equal((await db.prepare('SELECT notes FROM orders WHERE id = ?').bind(a.order.id).first()).notes, '');
});

test('akses percobaan bersamaan membuat satu CMS persisten tanpa menambah pesanan atau statistik admin', async () => {
  const admin = await login();
  const before = await jsonResponse(await request('/api/admin/orders', { session: admin }), 200);
  const sessions = await Promise.all([0, 1, 2].map(() => login(previewCode)));
  const clients = await Promise.all(sessions.map(async session => jsonResponse(await request('/api/client/order', { session }), 200)));
  const id = clients[0].order.id;
  for (const client of clients) {
    assert.equal(client.order.id, id);
    assert.equal(client.order.isPreview, true);
    assert.equal(client.order.status, 'preview');
    assert.equal(client.order.paymentStatus, 'not_required');
    assert.ok(client.fields.length, 'Form CMS langsung tersedia untuk percobaan.');
    assert.equal(client.content.draft.businessName, 'Rasio Labs');
  }
  const count = await db.prepare('SELECT COUNT(*) AS count FROM orders WHERE is_preview = 1').first();
  assert.equal(count.count, 1);
  const current = clients[0].content;
  const title = `Konten percobaan tersimpan ${randomUUID().slice(0, 8)}`;
  const saved = await jsonResponse(await request('/api/client/content', {
    method: 'PUT', session: sessions[0], json: { revision: current.revision, content: { ...current.draft, heroTitle: title } }
  }), 200);
  await jsonResponse(await request('/api/logout', { method: 'POST', session: sessions[0] }), 200);
  const reopened = await jsonResponse(await request('/api/client/order', { session: await login(previewCode) }), 200);
  assert.equal(reopened.order.id, id);
  assert.equal(reopened.content.revision, saved.revision);
  assert.equal(reopened.content.draft.heroTitle, title);
  const after = await jsonResponse(await request('/api/admin/orders', { session: admin }), 200);
  assert.deepEqual(after.stats, before.stats);
  assert.deepEqual(after.orders, before.orders);
  assert.ok(after.orders.every(order => !order.isPreview));
});

test('pratinjau dan unggahan percobaan privat; klien biasa tidak dapat melihat atau memakai gambarnya', async () => {
  const admin = await login(), ordinary = await createOrder();
  await verify(ordinary, admin);
  const trial = await login(previewCode);
  const current = await jsonResponse(await request('/api/client/order', { session: trial }), 200);
  const png = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, ...new Array(24).fill(0)]);
  const uploaded = await jsonResponse(await request('/api/client/media', {
    method: 'POST', session: trial, body: png, headers: { 'Content-Type': 'image/png' }
  }), 201);
  assert.equal((await request(uploaded.url)).status, 401);
  assert.equal((await request(uploaded.url, { session: ordinary.session })).status, 404);
  assert.equal((await request(uploaded.url, { session: trial })).status, 200);
  const saved = await jsonResponse(await request('/api/client/content', {
    method: 'PUT', session: trial,
    json: { revision: current.content.revision, content: { ...current.content.draft, heroImage: uploaded.url } }
  }), 200);
  assert.equal(saved.revision, current.content.revision + 1);
  const previewUrl = `/preview/${current.order.slug}`;
  assert.equal((await request(previewUrl)).status, 401);
  assert.equal((await request(previewUrl, { session: ordinary.session })).status, 404);
  const preview = await request(previewUrl, { session: trial });
  assert.equal(preview.status, 200);
  assert.equal(preview.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.match(await preview.text(), new RegExp(uploaded.url));
  assert.equal((await request(`/website/${current.order.slug}`)).status, 404);
  const otherContent = await clientContent(ordinary);
  assert.equal((await request('/api/client/content', {
    method: 'PUT', session: ordinary.session,
    json: { revision: otherContent.content.revision, content: { ...otherContent.content.draft, heroImage: uploaded.url } }
  })).status, 400);
  assert.equal((await request(`/preview/${ordinary.order.slug}`, { session: trial })).status, 404);
  assert.equal((await request(`/api/admin/orders/${ordinary.order.id}`, { session: trial })).status, 403);
});

test('percobaan tidak dapat diterbitkan, diubah menjadi transaksi, diberi undangan, atau dicabut seperti pesanan biasa', async () => {
  const admin = await login(), trial = await login(previewCode);
  const current = await jsonResponse(await request('/api/client/order', { session: trial }), 200);
  const id = current.order.id;
  assert.equal((await request('/api/client/publish', {
    method: 'POST', session: trial, json: { revision: current.content.revision }
  })).status, 409);
  assert.equal((await request(`/api/admin/orders/${id}/publish`, {
    method: 'POST', session: admin, json: { revision: current.content.revision }
  })).status, 409);
  assert.equal((await request(`/api/admin/orders/${id}`, {
    method: 'PATCH', session: admin,
    json: { paymentStatus: 'verified', paymentReference: 'NOT-A-REAL-PAYMENT', status: 'review', isPreview: false }
  })).status, 409);
  for (const action of ['invite', 'revoke']) {
    assert.equal((await request(`/api/admin/orders/${id}/${action}`, { method: 'POST', session: admin })).status, 409, action);
  }
  const unchanged = await jsonResponse(await request('/api/client/order', { session: trial }), 200);
  assert.equal(unchanged.order.isPreview, true);
  assert.equal(unchanged.order.paymentStatus, 'not_required');
  assert.equal(unchanged.order.status, 'preview');
});

test('flag percobaan tetap menolak situs dan gambar publik meskipun status data berubah', async () => {
  const trial = await login(previewCode);
  const current = await jsonResponse(await request('/api/client/order', { session: trial }), 200);
  const id = current.order.id;
  const png = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, ...new Array(24).fill(0)]);
  const uploaded = await jsonResponse(await request('/api/client/media', {
    method: 'POST', session: trial, body: png, headers: { 'Content-Type': 'image/png' }
  }), 201);
  try {
    await db.batch([
      db.prepare("UPDATE orders SET status = 'active', payment_status = 'verified', domain_status = 'confirmed' WHERE id = ?").bind(id),
      db.prepare('UPDATE contents SET published = draft, published_revision = revision WHERE order_id = ?').bind(id),
      db.prepare('UPDATE media SET is_public = 1 WHERE order_id = ?').bind(id)
    ]);
    assert.equal((await request(`/website/${current.order.slug}`)).status, 404);
    assert.equal((await request(uploaded.url)).status, 401);
    const admin = await login();
    for (const action of ['invite', 'revoke', 'publish']) {
      assert.equal((await request(`/api/admin/orders/${id}/${action}`, {
        method: 'POST', session: admin, json: { revision: current.content.revision }
      })).status, 409, action);
    }
  } finally {
    await db.batch([
      db.prepare("UPDATE orders SET status = 'preview', payment_status = 'not_required', domain_status = 'pending' WHERE id = ?").bind(id),
      db.prepare('UPDATE contents SET published = NULL, published_revision = NULL WHERE order_id = ?').bind(id),
      db.prepare('UPDATE media SET is_public = 0 WHERE order_id = ?').bind(id)
    ]);
  }
});

test('sesi percobaan memerlukan generation saat ini dan input checkout tidak memberikan hak percobaan', async () => {
  for (const invalidGeneration of ['', hash('old-preview-code')]) {
    const trial = await login(previewCode);
    const token = trial.cookie.slice(trial.cookie.indexOf('=') + 1);
    await db.prepare('UPDATE sessions SET generation = ? WHERE token_hash = ?').bind(invalidGeneration, hash(token)).run();
    assert.equal((await request('/api/session', { session: trial })).status, 401);
    assert.equal((await request('/api/client/order', { session: trial })).status, 401);
    assert.equal((await request('/api/client/content', {
      method: 'PUT', session: trial, json: { revision: 1, content: {} }
    })).status, 401);
  }
  const ordinary = await createOrder({ ...orderBody(), is_preview: 1, isPreview: true, status: 'preview', paymentStatus: 'not_required' });
  assert.equal(ordinary.order.isPreview, false);
  assert.equal(ordinary.order.paymentStatus, 'pending');
  assert.equal((await clientContent(ordinary)).content, null);
  const row = await db.prepare('SELECT is_preview FROM orders WHERE id = ?').bind(ordinary.order.id).first();
  assert.equal(row.is_preview, 0);
  const token = ordinary.session.cookie.slice(ordinary.session.cookie.indexOf('=') + 1);
  await db.prepare('UPDATE sessions SET generation = ? WHERE token_hash = ?').bind(hash(previewCode), hash(token)).run();
  assert.equal((await request('/api/session', { session: ordinary.session })).status, 401);
  const restored = await login(previewCode);
  assert.equal((await request('/api/session', { session: restored })).status, 200);
});

test('v4 non-approved checkout stops before inserting an order',async()=>{const before=await db.prepare('SELECT COUNT(*) AS n FROM orders').first();const response=await request('/api/orders',{method:'POST',json:orderBody(),headers:{'Idempotency-Key':randomUUID(),'X-Test-Unapproved-Policy':'1'}});assert.equal(response.status,409);assert.match((await response.json()).error,/kebijakan|Kebijakan/);const after=await db.prepare('SELECT COUNT(*) AS n FROM orders').first();assert.equal(after.n,before.n);});
