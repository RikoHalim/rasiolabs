import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Miniflare, Log, LogLevel, convertV4MiniflareOptions } from 'miniflare';

const repo = fileURLToPath(new URL('../', import.meta.url));
const origin = 'http://localhost';
const adminCode = 'A'.repeat(43); // Isolated local fixture; never an environment credential.
const previewCode = 'B'.repeat(43); // Separate isolated client trial fixture.
const hash = value => createHash('sha256').update(value).digest('hex');
let mf, db, ipCounter = 1;

before(async () => {
  mf = new Miniflare(convertV4MiniflareOptions({ workers: [{
    name: 'rasio-tests',
    modules: [
      { type: 'ESModule', path: path.join(repo, 'server/worker.mjs') },
      { type: 'ESModule', path: path.join(repo, 'server/model.mjs') }
    ], modulesRoot: repo,
    compatibilityDate: '2026-09-01',
    bindings: { PUBLIC_ORIGIN: origin, ADMIN_ACCESS_HASH: hash(adminCode), CMS_PREVIEW_ACCESS_HASH: hash(previewCode) },
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
  service: 'profile', template: 'Architecture', duration: 24, consent: true,
  businessName: `Studio Test ${randomUUID().slice(0, 8)}`, customerName: 'Pemilik Test',
  whatsapp: '+6281234567890', email: '', domain: `studio-${randomUUID().slice(0, 8)}.com`
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

async function verify(order, admin) {
  return jsonResponse(await request(`/api/admin/orders/${order.order.id}`, {
    method: 'PATCH', session: admin,
    json: { status: 'review', paymentStatus: 'verified', paymentReference: 'LOCAL-TEST-RECEIPT', domainStatus: 'confirmed' }
  }), 200);
}

test('database dan storage lokal tersedia tanpa gateway pembayaran palsu', async () => {
  const data = await jsonResponse(await request('/api/health'), 200);
  assert.deepEqual(data, { ok: true, database: true, storage: true, paymentGateway: false });
});

test('portal dan template dikirim sebagai HTML, bukan loop redirect dari asset .html', async () => {
  for (const url of ['/admin', '/cms', '/template-architecture']) {
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
  assert.equal(first.order.total, 784800);
  assert.equal(first.order.monthly, 32700);
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
  assert.equal((await clientContent(again)).content.draft.businessName, first.body.businessName);
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

test('tautan CMS sekali pakai dan pencabutan memutus akses lama', async () => {
  const admin = await login(), a = await createOrder();
  await verify(a, admin);
  const invite = await jsonResponse(await request(`/api/admin/orders/${a.order.id}/invite`, { method: 'POST', session: admin }), 200);
  const url = new URL(invite.url);
  assert.equal(url.search, '');
  const code = new URLSearchParams(url.hash.slice(1)).get('akses');
  const invited = await login(code);
  assert.equal(invited.role, 'client');
  assert.equal((await jsonResponse(await request('/api/session', { session: invited }), 200)).orderId, a.order.id);
  assert.equal((await request('/api/access', { method: 'POST', json: { code } })).status, 401);
  await jsonResponse(await request(`/api/admin/orders/${a.order.id}/revoke`, { method: 'POST', session: admin }), 200);
  assert.equal((await request('/api/client/order', { session: invited })).status, 401);
  assert.equal((await request('/api/client/order', { session: a.session })).status, 401);
  assert.equal((await request('/api/session', { session: admin })).status, 200);
  assert.equal((await request('/api/orders', { method: 'POST', json: a.body, headers: { 'Idempotency-Key': a.key } })).status, 401, 'Retry pesanan tidak boleh memulihkan akses yang telah dicabut.');
});

test('sesi dan undangan yang kedaluwarsa tidak dapat digunakan', async () => {
  const admin = await login(), a = await createOrder();
  await verify(a, admin);
  await db.prepare('UPDATE sessions SET expires_at = 0 WHERE token_hash = ?').bind(hash(a.session.cookie.split('=')[1])).run();
  assert.equal((await request('/api/session', { session: a.session })).status, 401);
  const invite = await jsonResponse(await request(`/api/admin/orders/${a.order.id}/invite`, { method: 'POST', session: admin }), 200);
  const code = new URLSearchParams(new URL(invite.url).hash.slice(1)).get('akses');
  await db.prepare('UPDATE invites SET expires_at = 0 WHERE token_hash = ?').bind(hash(code)).run();
  assert.equal((await request('/api/access', { method: 'POST', json: { code } })).status, 401);
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
    assert.equal(client.content.draft.businessName, 'Rasio Agency');
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
