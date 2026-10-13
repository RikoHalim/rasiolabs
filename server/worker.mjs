import {pricing,validateOrder,validateContent,defaults,defaultsFor,contentWithDefaults,fields,fieldsFor,statuses,statusLabels,imageMime} from './model.mjs';
import {profileTemplates} from './profile-templates.mjs';
import {renderProfileTemplate,rewriteProfileLinks} from './profile-renderer.mjs';
import {hasProfilePage,profileAsset,profilePages,navigationHref} from './profile-pages.mjs';
import {domainPrices,domainFee,quotedDomainFee} from './domains.mjs';
import {AuthError,accountInfo,provisionAccount,resendActivation,activationLink,clientLogin,resetInfo,completeReset,forgotPassword,revokeAccount,dispatchEmail} from './client-auth.mjs';
const HOUR=3600000, DAY=24*HOUR;
class ApiError extends Error { constructor(status,message){super(message);this.status=status;} }
const random=()=>{const a=crypto.getRandomValues(new Uint8Array(32));return btoa(String.fromCharCode(...a)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');};
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(v=>v.toString(16).padStart(2,'0')).join('');
const q=(env,sql,...args)=>env.DB.prepare(sql).bind(...args);
const json=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff',...headers}});
function origin(request,env){if(!env.PUBLIC_ORIGIN||request.headers.get('Origin')!==env.PUBLIC_ORIGIN||request.headers.get('Sec-Fetch-Site')==='cross-site')throw new ApiError(403,'Verifikasi keamanan gagal. Muat ulang halaman.');}
async function body(request){if(!request.headers.get('Content-Type')?.startsWith('application/json'))throw new ApiError(415,'Format permintaan tidak valid.');const text=await request.text();if(text.length>64000)throw new ApiError(413,'Data terlalu besar.');try{return JSON.parse(text);}catch{throw new ApiError(400,'Data tidak valid.');}}
function cookie(env,token,ttl){const secure=env.PUBLIC_ORIGIN?.startsWith('https:');return `${secure?'__Host-rasio_session':'rasio_local_session'}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${ttl}${secure?'; Secure':''}`;}
async function auth(request,env,role){
  const name=env.PUBLIC_ORIGIN?.startsWith('https:')?'__Host-rasio_session':'rasio_local_session';
  const raw=request.headers.get('Cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(name+'='))?.slice(name.length+1);
  if(!raw||!/^[\w-]{43}$/.test(raw))throw new ApiError(401,'Masuk untuk melanjutkan.');
  const session=await q(env,'SELECT * FROM sessions WHERE token_hash = ? AND expires_at > ?',await sha(raw),Date.now()).first();
  if(!session||(session.role==='admin'&&session.generation!==env.ADMIN_ACCESS_HASH))throw new ApiError(401,'Akses berakhir. Silakan masuk kembali.');
  if(session.role==='client'){const trial=await q(env,'SELECT is_preview FROM orders WHERE id = ?',session.order_id).first();if(trial?.is_preview===1){if(!session.generation||session.generation!==env.CMS_PREVIEW_ACCESS_HASH)throw new ApiError(401,'Akses percobaan berakhir. Silakan masuk kembali.');}else{const a=await q(env,'SELECT version,enabled,password_hash FROM client_accounts WHERE order_id = ?',session.order_id).first();if(a&&(!a.enabled||a.password_hash&&session.generation!==`account:${a.version}`)||!a&&session.generation)throw new ApiError(401,'Akses berakhir. Silakan masuk kembali.');}}
  if(role&&session.role!==role)throw new ApiError(403,'Akses tidak diizinkan.');
  if(request.method!=='GET'&&request.method!=='HEAD'&&request.headers.get('X-CSRF-Token')!==session.csrf)throw new ApiError(403,'Verifikasi keamanan gagal. Muat ulang halaman.');
  return session;
}
async function sessionData(env,role,orderId=null,generation=''){const token=random(),csrf=random(),ttl=role==='admin'?8*3600:7*86400;return {token,csrf,ttl,hash:await sha(token),sql:q(env,'INSERT INTO sessions (token_hash,role,order_id,csrf,generation,expires_at,created_at) VALUES (?,?,?,?,?,?,?)',await sha(token),role,orderId,csrf,role==='admin'?env.ADMIN_ACCESS_HASH:generation,Date.now()+ttl*1000,Date.now())};}
async function previewSession(env){
  const id=crypto.randomUUID(),now=Date.now();
  await q(env,"INSERT OR IGNORE INTO orders (id,reference,is_preview,idempotency_hash,payload_hash,business_name,customer_name,whatsapp,email,domain,template,duration,monthly,total,renewal_monthly,status,payment_status,slug,created_at,updated_at) VALUES (?,?,1,?,?,?,?,?,?,?,?,0,0,0,0,'preview','not_required',?,?,?)",id,'CMS-PREVIEW',await sha('__internal_cms_preview__'),await sha('internal_preview'),'Rasio Labs','Pemilik Rasio Labs','+60142317052','','rasio-preview.local','Architecture',`rasio-cms-preview-${id.slice(0,8)}`,now,now).run();
  const o=await q(env,"SELECT * FROM orders WHERE reference = 'CMS-PREVIEW' AND is_preview = 1").first();if(!o)throw new ApiError(503,'Ruang percobaan belum dapat disiapkan.');
  await q(env,'INSERT OR IGNORE INTO contents (order_id,draft,revision,updated_at) VALUES (?,?,1,?)',o.id,JSON.stringify({...defaults,businessName:'Rasio Labs',whatsapp:'+60142317052'}),now).run();
  const s=await sessionData(env,'client',o.id,env.CMS_PREVIEW_ACCESS_HASH);await s.sql.run();return json({role:'client',csrf:s.csrf},200,{'Set-Cookie':cookie(env,s.token,s.ttl)});
}
async function retryOrder(request,env,o,payloadHash){
  if(o.payload_hash!==payloadHash)throw new ApiError(409,'Pilihan pesanan berubah. Muat ulang untuk membuat pesanan baru.');
  await limit(request,env,'order-retry',12);const s=await sessionData(env,'client',o.id);
  const result=await q(env,"INSERT INTO sessions (token_hash,role,order_id,csrf,generation,expires_at,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM orders WHERE id = ? AND status <> 'cancelled') AND NOT EXISTS (SELECT 1 FROM audit WHERE order_id = ? AND action = 'access_revoked')",s.hash,'client',o.id,s.csrf,'',Date.now()+s.ttl*1000,Date.now(),o.id,o.id).run();
  if(!result.meta.changes)throw new ApiError(401,'Akses pesanan sudah dicabut. Hubungi tim Rasio Labs untuk tautan baru.');
  return json({order:publicOrder(o),csrf:s.csrf},200,{'Set-Cookie':cookie(env,s.token,s.ttl)});
}
async function limit(request,env,action,max,window=HOUR){
  const now=Date.now(), key=await sha(`${env.ADMIN_ACCESS_HASH}:${action}:${request.headers.get('CF-Connecting-IP')||'local'}:${Math.floor(now/window)}`);
  const row=await q(env,'INSERT INTO rate_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count',key,now+window).first();
  if(row.count>max)throw new ApiError(429,'Terlalu banyak percobaan. Coba lagi nanti.');
}
function log(env,id,actor,action,detail){return q(env,'INSERT INTO audit (id,order_id,actor,action,detail,created_at) VALUES (?,?,?,?,?,?)',crypto.randomUUID(),id,actor,action,detail,Date.now());}
async function order(env,id){const row=await q(env,'SELECT * FROM orders WHERE id = ?',id).first();if(!row)throw new ApiError(404,'Pesanan tidak ditemukan.');return row;}
function publicOrder(o){return {id:o.id,reference:o.reference,template:o.template,isPreview:o.is_preview===1,businessName:o.business_name,customerName:o.customer_name,whatsapp:o.whatsapp,email:o.email,domain:o.domain,domainStatus:o.domain_status,duration:o.duration,domainIncluded:o.domain_included!==0,domainFee:o.domain_fee,packageTotal:o.total-(o.domain_fee??0),total:o.domain_included===0&&o.domain_fee===null?null:o.total,monthly:o.monthly,renewalMonthly:o.renewal_monthly,status:o.status,statusLabel:o.is_preview===1?'Percobaan CMS':statusLabels[o.status],paymentStatus:o.payment_status,slug:o.slug,createdAt:o.created_at,updatedAt:o.updated_at};}
async function getContent(env,id){const c=await q(env,'SELECT contents.*,orders.template FROM contents JOIN orders ON orders.id = contents.order_id WHERE contents.order_id = ?',id).first();return {draft:contentWithDefaults(JSON.parse(c.draft),c.template||'Architecture'),revision:c.revision,publishedRevision:c.published_revision,updatedAt:c.updated_at};}
async function validateMedia(env,id,content,template){for(const f of fieldsFor(template).flatMap(g=>g.items).filter(f=>f.type==='image')){const path=content[f.key];if(path.startsWith('/media/')){const item=await q(env,'SELECT id FROM media WHERE id = ? AND order_id = ?',path.slice(7),id).first();if(!item)throw new ApiError(400,'Foto tidak ditemukan atau bukan milik website ini.');}}}
async function editable(env,s,id){const o=await order(env,id);if(s.role==='client'&&!o.is_preview){const a=await q(env,'SELECT version,enabled,password_hash FROM client_accounts WHERE order_id = ?',id).first();if(o.payment_status!=='verified'||o.status==='cancelled'||!a?.password_hash||!a.enabled||s.generation!==`account:${a.version}`)throw new ApiError(403,'Aktifkan akun dan masuk dengan username serta password untuk membuka CMS.');}return o;}
async function saveContent(request,env,s,id){const o=await editable(env,s,id);const b=await body(request);if(!Number.isInteger(b.revision)||b.revision<1)throw new ApiError(400,'Versi konten tidak valid.');let content;try{content=validateContent(b.content,o.template||'Architecture');}catch(e){throw new ApiError(400,e.message);}await validateMedia(env,id,content,o.template||'Architecture');
  const result=await q(env,'UPDATE contents SET draft = ?, revision = revision + 1, updated_at = ? WHERE order_id = ? AND revision = ?',JSON.stringify(content),Date.now(),id,b.revision).run();
  if(!result.meta.changes)throw new ApiError(409,'Konten berubah di sesi lain. Salin perubahan Anda, lalu muat versi terbaru.');
  await log(env,id,s.role,'content_saved',`Revisi ${b.revision+1}`).run();return json({content,revision:b.revision+1});
}
async function publish(request,env,s,id){const o=await order(env,id);const b=await body(request);if(o.is_preview)throw new ApiError(409,'Website percobaan tersedia melalui pratinjau saja.');if(o.payment_status!=='verified'||o.status==='cancelled')throw new ApiError(409,'Pembayaran perlu diverifikasi sebelum website diterbitkan.');if(o.domain_status!=='confirmed')throw new ApiError(409,'Konfirmasikan pengaturan domain sebelum menerbitkan website.');if(s.role==='client'&&o.status!=='active')throw new ApiError(409,'Tim Rasio Labs akan menerbitkan website setelah setup selesai.');
  if(s.role==='client')await editable(env,s,id);const c=await getContent(env,id);if(b.revision!==c.revision)throw new ApiError(409,'Simpan dan periksa versi konten terbaru dahulu.');
  const eligible="EXISTS (SELECT 1 FROM orders WHERE id = contents.order_id AND payment_status = 'verified' AND domain_status = 'confirmed' AND status <> 'cancelled' AND (? = 'admin' OR status = 'active'))";
  const published=`EXISTS (SELECT 1 FROM contents WHERE order_id = ? AND revision = ? AND published_revision = ? AND ${eligible})`;
  const statements=[q(env,`UPDATE contents SET published = draft, published_revision = revision WHERE order_id = ? AND revision = ? AND ${eligible}`,id,b.revision,s.role),q(env,`UPDATE media SET is_public = CASE WHEN EXISTS (SELECT 1 FROM contents WHERE order_id = ? AND instr(published,'/media/' || media.id) > 0) THEN 1 ELSE 0 END WHERE order_id = ? AND ${published}`,id,id,id,b.revision,b.revision,s.role),q(env,`INSERT INTO audit (id,order_id,actor,action,detail,created_at) SELECT ?,?,?,?,?,? WHERE ${published}`,crypto.randomUUID(),id,s.role,'published',`Revisi ${b.revision}`,Date.now(),id,b.revision,b.revision,s.role)];
  if(s.role==='admin')statements.push(q(env,`UPDATE orders SET status = 'active', updated_at = ? WHERE id = ? AND ${published}`,Date.now(),id,id,b.revision,b.revision,s.role));
  const r=await env.DB.batch(statements);if(!r[0].meta.changes)throw new ApiError(409,'Konten berubah. Muat versi terbaru.');return json({url:`/website/${o.slug}`,publishedRevision:b.revision});
}
async function upload(request,env,s,id){await editable(env,s,id);if(!env.BUCKET)throw new ApiError(503,'Unggahan belum tersedia.');const mime=request.headers.get('Content-Type');if(!['image/jpeg','image/png','image/webp'].includes(mime))throw new ApiError(415,'Gunakan foto JPG, PNG, atau WebP.');
  const size=Number(request.headers.get('Content-Length'));if(size>4*1024*1024)throw new ApiError(413,'Ukuran foto maksimal 4 MB.');
  const reader=request.body?.getReader();if(!reader)throw new ApiError(400,'Pilih foto untuk diunggah.');let length=0,chunks=[];for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>4*1024*1024){await reader.cancel();throw new ApiError(413,'Ukuran foto maksimal 4 MB.');}chunks.push(value);}if(length<16)throw new ApiError(400,'File gambar tidak valid.');
  const bytes=new Uint8Array(length);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}if(imageMime(bytes)!==mime)throw new ApiError(415,'Isi file tidak sesuai format gambar.');
  const usage=await q(env,'SELECT COUNT(*) AS count, COALESCE(SUM(size),0) AS total FROM media WHERE order_id = ?',id).first();if(usage.count>=40||usage.total+length>50*1024*1024)throw new ApiError(409,'Penyimpanan gambar penuh. Hubungi tim Rasio Labs.');
  const mediaId=crypto.randomUUID(),key=`orders/${id}/${mediaId}`;await env.BUCKET.put(key,bytes,{httpMetadata:{contentType:mime}});
  try{await q(env,'INSERT INTO media (id,order_id,key,mime,size,is_public,created_at) VALUES (?,?,?,?,?,0,?)',mediaId,id,key,mime,length,Date.now()).run();}catch(e){await env.BUCKET.delete(key);throw e;}
  return json({url:`/media/${mediaId}`},201);
}
async function mediaResponse(request,env,id){const m=await q(env,'SELECT media.*, orders.status, orders.payment_status, orders.is_preview FROM media JOIN orders ON orders.id = media.order_id WHERE media.id = ?',id).first();if(!m)throw new ApiError(404,'Gambar tidak ditemukan.');
  let isPublic=m.is_preview===0&&m.is_public===1&&m.status==='active'&&m.payment_status==='verified';if(!isPublic){const s=await auth(request,env);if(s.role!=='admin'&&s.order_id!==m.order_id)throw new ApiError(404,'Gambar tidak ditemukan.');if(s.role==='client')await editable(env,s,m.order_id);}
  const obj=await env.BUCKET.get(m.key);if(!obj)throw new ApiError(404,'Gambar tidak ditemukan.');return new Response(obj.body,{headers:{'Content-Type':m.mime,'X-Content-Type-Options':'nosniff','Cache-Control':isPublic?'public, max-age=3600':'private, no-store'}});
}
async function renderSite(request,env,slug,preview,page=''){const o=await q(env,'SELECT orders.*,contents.draft,contents.published FROM orders JOIN contents ON orders.id = contents.order_id WHERE slug = ?',slug).first();if(!o)throw new ApiError(404,'Website tidak ditemukan.');
  if(preview){const s=await auth(request,env);if(s.role!=='admin'&&s.order_id!==o.id)throw new ApiError(404,'Website tidak ditemukan.');await editable(env,s,o.id);}else if(o.is_preview||o.status!=='active'||o.payment_status!=='verified'||!o.published)throw new ApiError(404,'Website belum terbit.');
  const template=o.template||'Architecture';
  const definition=profileTemplates[template];if(!definition||!hasProfilePage(template,page))throw new ApiError(404,'Halaman tidak ditemukan.');
  const context={template,base:'/'+(preview?'preview':'website')+'/'+slug,page};
  const data=contentWithDefaults(JSON.parse(preview?o.draft:o.published),template);
  const assetUrl=new URL(profileAsset(template,page),request.url);const source=await env.ASSETS.fetch(new Request(assetUrl));
  if(template!=='Architecture'||page) {
    const rendered=renderProfileTemplate(source,data,context);const headers=new Headers(rendered.headers);headers.set('Cache-Control','private, no-store');if(preview)headers.set('X-Robots-Tag','noindex, nofollow');return new Response(rendered.body,{headers});
  }
  const selectors={businessName:'.footer-top > p',tagline:'.hero-top .overline',heroTitle:'#hero-title',heroDescription:'.hero-aside > p',heroNote:'.hero-photo-note > span:first-child',aboutTitle:'#studio-title',aboutLead:'.intro-copy > p:first-child',aboutBody:'.intro-copy > p:nth-child(2)',workTitle:'#work-title',workDescription:'.work-section .section-title > p',work1Title:'.work-card:first-child .work-caption h3',work1Category:'.work-card:first-child .work-caption p',work2Title:'.work-card:nth-child(2) .work-caption h3',work2Category:'.work-card:nth-child(2) .work-caption p',servicesTitle:'#services-title',servicesDescription:'.services-heading > p:nth-child(3)',processTitle:'#process-title',processDescription:'.process-section .section-title > p',contactTitle:'#contact-title'};
  let html=new HTMLRewriter().on('.demo-bar',{element:e=>e.remove()}).on('title',{element:e=>e.setInnerContent(data.businessName)}).on('meta[name="description"]',{element:e=>e.setAttribute('content',data.heroDescription)}).on('.footer-top > a[href^="/order"]',{element:e=>e.remove()});
  for(const [key,selector]of Object.entries(selectors))html=html.on(selector,{element:e=>{e.setInnerContent(data[key]);if(key.endsWith('Title'))e.setAttribute('style','white-space:pre-line');}});
  for(let n=1;n<=3;n++)for(const [key,selector]of [[`service${n}Title`,`.service-accordion details:nth-child(${n}) h3`],[`service${n}Description`,`.service-accordion details:nth-child(${n}) > div > p`],[`service${n}Detail`,`.service-accordion details:nth-child(${n}) > div > span`],[`process${n}Title`,`.process-grid li:nth-child(${n}) h3`],[`process${n}Description`,`.process-grid li:nth-child(${n}) p`]])html=html.on(selector,{element:e=>e.setInnerContent(data[key])});
  const images={'.studio-logo img':'logo','.footer-top > a img':'logo','.hero-photo img':'heroImage','.work-card:first-child img':'work1Image','.work-card:nth-child(2) img':'work2Image'};
  for(const [selector,key]of Object.entries(images))html=html.on(selector,{element:e=>{e.setAttribute('src',data[key]);e.setAttribute('alt',key==='logo'?data.businessName:data[key==='heroImage'?'heroTitle':key==='work1Image'?'work1Title':'work2Title']);}});
  for(const [n,project]of [[1,'living'],[2,'detail']])html=html.on(`[data-project="${project}"]`,{element:e=>{e.setAttribute('data-title',data[`work${n}Title`]);e.setAttribute('data-description',data[`work${n}Description`]);e.setAttribute('data-image',data[`work${n}Image`]);e.setAttribute('aria-label',data[`work${n}Title`]);}});
  const number=data.whatsapp.replace(/\D/g,'');
  for(const n of [1,2,3,4])html=html.on(`[data-cms-menu="${n}"]`,{element:e=>{if(!data[`nav${n}Visible`]){e.remove();return;}e.setInnerContent(data[`nav${n}Label`]);e.setAttribute('href',navigationHref(template,context.base,data['nav'+n+'Target']));}});
  html=html.on('[data-cms-nav-cta]',{element:e=>{if(!data.navCtaVisible){e.remove();return;}e.setInnerContent(data.navCtaLabel);e.append(' <span aria-hidden="true">↗</span>',{html:true});e.setAttribute('href',number?`https://wa.me/${number}`:'#contact');if(number){e.setAttribute('target','_blank');e.setAttribute('rel','noopener');}}});
  if(!data.navCtaVisible&&![1,2,3,4].some(n=>data[`nav${n}Visible`]))for(const selector of ['.studio-menu','.studio-nav'])html=html.on(selector,{element:e=>e.setAttribute('hidden','')});
  html=html.on('.contact-button',{element:e=>{e.setInnerContent(data.contactLabel||'Hubungi kami');e.setAttribute('href',number?`https://wa.me/${number}`:data.email?`mailto:${data.email}`:'#contact');}}).on('.footer-whatsapp',{element:e=>{if(!number&&!data.email)e.remove();else{e.setInnerContent(number?data.whatsapp:data.email);e.setAttribute('href',number?`https://wa.me/${number}`:`mailto:${data.email}`);}}}).on('.footer-bottom > span',{element:e=>e.setInnerContent(`© ${new Date().getUTCFullYear()} ${data.businessName}`)}).on('head',{element:e=>e.append('<style>.studio-header{top:0}.studio-hero{padding-top:0}</style>',{html:true})});
  const rendered=renderProfileTemplate(html.transform(source),data,context);const headers=new Headers(rendered.headers);headers.set('Cache-Control','private, no-store');if(preview)headers.set('X-Robots-Tag','noindex, nofollow');return new Response(rendered.body,{headers});
}
async function api(request,env,url,ctx){
  const path=url.pathname;
  if(!env.DB)throw new ApiError(503,'Layanan sedang disiapkan. Coba lagi nanti.');
  if(!['GET','HEAD'].includes(request.method))origin(request,env);
  if(path==='/api/health'&&request.method==='GET'){await q(env,'SELECT 1 FROM orders LIMIT 1').first();return json({ok:true,database:true,storage:Boolean(env.BUCKET),paymentGateway:false});}
  if(path==='/api/access'&&request.method==='POST'){
    await limit(request,env,'access',12,15*60000);const b=await body(request);if(typeof b.code!=='string'||!/^[\w-]{43}$/.test(b.code))throw new ApiError(401,'Kode akses tidak valid.');const hash=await sha(b.code);
    if(hash===env.ADMIN_ACCESS_HASH){const s=await sessionData(env,'admin');await s.sql.run();return json({role:'admin',csrf:s.csrf},200,{'Set-Cookie':cookie(env,s.token,s.ttl)});}
    if(env.CMS_PREVIEW_ACCESS_HASH&&hash===env.CMS_PREVIEW_ACCESS_HASH)return previewSession(env);
    throw new ApiError(401,'Masuk dengan username dan password klien.');
  }
  if(path==='/api/auth/login'&&request.method==='POST'){
    await limit(request,env,'client-login',12,900000);const b=await body(request);
    if(typeof b?.username==='string'&&b.username.trim().toLowerCase()==='rasio-preview'){
      if(!env.CMS_PREVIEW_ACCESS_HASH||typeof b.password!=='string'||!/^[\w-]{43}$/.test(b.password)||await sha(b.password)!==env.CMS_PREVIEW_ACCESS_HASH)throw new ApiError(401,'Username atau password tidak sesuai.');
      return previewSession(env);
    }
    const a=await clientLogin(env,b||{}),s=await sessionData(env,'client',a.order_id,`account:${a.version}`);await s.sql.run();return json({role:'client',csrf:s.csrf},200,{'Set-Cookie':cookie(env,s.token,s.ttl)});
  }
  if(path==='/api/auth/reset-info'&&request.method==='POST'){await limit(request,env,'reset-info',30,900000);const b=await body(request);return json(await resetInfo(env,b.token));}
  if(path==='/api/auth/reset'&&request.method==='POST'){await limit(request,env,'reset-password',12,900000);return json(await completeReset(env,await body(request)),200,{'Set-Cookie':cookie(env,'',0)});}
  if(path==='/api/auth/forgot'&&request.method==='POST'){await limit(request,env,'forgot-password',5,900000);const {jobId,...result}=await forgotPassword(env,await body(request));if(jobId)ctx.waitUntil(dispatchEmail(env,jobId));return json(result);}
  if(path==='/api/domains/prices'&&request.method==='GET')return json({prices:domainPrices(env.DOMAIN_PRICES_IDR),currency:'IDR',periodMonths:12});
  if(path==='/api/session'&&request.method==='GET'){const s=await auth(request,env);return json({role:s.role,csrf:s.csrf,orderId:s.order_id});}
  if(path==='/api/logout'&&request.method==='POST'){const s=await auth(request,env);await q(env,'DELETE FROM sessions WHERE token_hash = ?',s.token_hash).run();return json({ok:true},200,{'Set-Cookie':cookie(env,'',0)});}
  if(path==='/api/orders'&&request.method==='POST'){
    const key=request.headers.get('Idempotency-Key');if(!key||!/^[\w-]{36,64}$/.test(key))throw new ApiError(400,'Permintaan pesanan tidak valid.');const b=await body(request);let data;try{data=validateOrder(b);}catch(e){throw new ApiError(400,e.message);}const idHash=await sha(key),payloadHash=await sha(JSON.stringify(data));
    const existing=await q(env,'SELECT * FROM orders WHERE idempotency_hash = ?',idHash).first();if(existing)return retryOrder(request,env,existing,payloadHash);
    await limit(request,env,'orders',5);const id=crypto.randomUUID(),ref=`RAS-${new Date().getUTCFullYear()}-${id.slice(0,8).toUpperCase()}`,slug=`${data.domain.split('.')[0]}-${id.slice(0,8)}`,now=Date.now();const cost=pricing(data.duration),fee=domainFee(data.duration,data.domain,env.DOMAIN_PRICES_IDR);if(b.domainFeeExpected!==undefined&&b.domainFeeExpected!==fee)throw new ApiError(409,'Harga domain berubah. Periksa kembali pilihan domain sebelum membuat pesanan.');const s=await sessionData(env,'client',id);const content={...defaultsFor(data.template),businessName:data.businessName,whatsapp:data.whatsapp,email:data.email};
    try{await env.DB.batch([q(env,'INSERT INTO orders (id,reference,idempotency_hash,payload_hash,business_name,customer_name,whatsapp,email,domain,template,duration,monthly,total,renewal_monthly,domain_included,domain_fee,slug,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',id,ref,idHash,payloadHash,data.businessName,data.customerName,data.whatsapp,data.email,data.domain,data.template,data.duration,cost.monthly,cost.total+(fee??0),cost.renewalMonthly,data.duration===1?0:1,fee,slug,now,now),q(env,'INSERT INTO contents (order_id,draft,revision,updated_at) VALUES (?,?,1,?)',id,JSON.stringify(content),now),s.sql,log(env,id,'client','order_created',`${data.duration} bulan; Rp${cost.total}`)]);}catch(e){
      const duplicate=await q(env,'SELECT * FROM orders WHERE idempotency_hash = ?',idHash).first();if(!duplicate)throw e;return retryOrder(request,env,duplicate,payloadHash);
    }
    return json({order:publicOrder(await order(env,id)),csrf:s.csrf},201,{'Set-Cookie':cookie(env,s.token,s.ttl)});
  }
  if(path.startsWith('/api/client/')){const s=await auth(request,env,'client'),id=s.order_id;
    if(path==='/api/client/order'&&request.method==='GET'){const o=await order(env,id),a=await accountInfo(env,id),open=o.is_preview===1||o.payment_status==='verified'&&o.status!=='cancelled'&&a?.activated&&a.enabled&&s.generation.startsWith('account:');return json({order:publicOrder(o),account:a,activationRequired:!o.is_preview&&o.payment_status==='verified'&&!open,content:open?await getContent(env,id):null,fields:open?fieldsFor(o.template||'Architecture'):[],pages:open?profilePages[o.template||'Architecture']:{}});}
    if(path==='/api/client/content'&&request.method==='PUT')return saveContent(request,env,s,id);
    if(path==='/api/client/publish'&&request.method==='POST')return publish(request,env,s,id);
    if(path==='/api/client/media'&&request.method==='POST')return upload(request,env,s,id);
  }
  if(path.startsWith('/api/admin/')){const s=await auth(request,env,'admin');
    if(path==='/api/admin/orders'&&request.method==='GET'){
      const filter=url.searchParams.get('status')||'',term=(url.searchParams.get('q')||'').slice(0,100),offset=Math.min(Math.max(Number(url.searchParams.get('offset'))||0,0),10000);if(filter&&!statuses.includes(filter))throw new ApiError(400,'Status tidak valid.');
      const rows=await q(env,"SELECT * FROM orders WHERE is_preview = 0 AND (? = '' OR status = ?) AND (? = '' OR business_name LIKE ? OR reference LIKE ?) ORDER BY created_at DESC LIMIT 50 OFFSET ?",filter,filter,term,`%${term}%`,`%${term}%`,offset).all();
      const stats=await q(env,"SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active, SUM(CASE WHEN payment_status = 'pending' AND status <> 'cancelled' THEN 1 ELSE 0 END) AS pending FROM orders WHERE is_preview = 0").first();return json({orders:rows.results.map(publicOrder),stats,hasMore:rows.results.length===50});
    }
    const match=path.match(/^\/api\/admin\/orders\/([0-9a-f-]{36})(?:\/(content|publish|media|invite|revoke|activation|activation-link))?$/);if(match){const id=match[1],action=match[2],o=await order(env,id);
      if(o.is_preview&&['invite','revoke','activation','activation-link'].includes(action))throw new ApiError(409,'Akses percobaan dikelola melalui kode percobaan CMS.');
      if(!action&&request.method==='GET'){const logs=await q(env,'SELECT actor,action,detail,created_at FROM audit WHERE order_id = ? ORDER BY created_at DESC LIMIT 30',id).all();return json({order:{...publicOrder(o),notes:o.notes,paymentReference:o.payment_reference},content:await getContent(env,id),fields:fieldsFor(o.template||'Architecture'),pages:profilePages[o.template||'Architecture'],account:await accountInfo(env,id),audit:logs.results});}
      if(!action&&request.method==='PATCH'){if(o.is_preview)throw new ApiError(409,'Ruang percobaan tidak memiliki transaksi.');const b=await body(request);const status=b.status??o.status;if(!statuses.includes(status)||(status==='active'&&o.status!=='active'))throw new ApiError(400,'Gunakan tombol Terbitkan untuk mengaktifkan website.');const pay=b.paymentStatus??o.payment_status;if(!['pending','verified'].includes(pay))throw new ApiError(400,'Status pembayaran tidak valid.');if(o.domain_included===0&&o.payment_status==='verified'&&pay!=='verified')throw new ApiError(400,'Pembayaran yang sudah terverifikasi tidak dapat diubah menjadi belum dibayar.');const reference=String(b.paymentReference??o.payment_reference).trim().slice(0,200);if(pay==='verified'&&reference.length<4)throw new ApiError(400,'Isi referensi pembayaran yang sudah diperiksa.');if(b.domainFeePrevious!==undefined&&b.domainFeePrevious!==o.domain_fee)throw new ApiError(409,'Harga domain sudah berubah. Muat ulang rincian pesanan.');let fee;try{fee=quotedDomainFee(o,b.domainFee);}catch(e){throw new ApiError(400,e.message);}if(pay==='verified'&&o.domain_included===0&&fee===null)throw new ApiError(400,'Konfirmasi harga domain sebelum memverifikasi pembayaran.');const quotedTotal=o.domain_included===0?o.monthly*o.duration+(fee??0):o.total;const notes=String(b.notes??o.notes).slice(0,3000);const clientEmail=String(b.email??o.email).trim().toLowerCase();if(pay==='verified'&&(!clientEmail||clientEmail.length>150||!/^\S+@\S+\.\S+$/.test(clientEmail)))throw new ApiError(400,'Isi email kontak klien untuk mengirim akses login.');const existingAccount=await accountInfo(env,id);if(existingAccount&&clientEmail!==existingAccount.email)throw new ApiError(400,'Email akun yang sudah dibuat tidak dapat diubah dari formulir ini.');const domainStatus=b.domainStatus??o.domain_status;if(!['pending','confirmed'].includes(domainStatus))throw new ApiError(400,'Status domain tidak valid.');const changes=await env.DB.batch([q(env,"UPDATE orders SET status = ?, payment_status = ?, payment_reference = ?, notes = ?, domain_status = ?, email = ?, domain_fee = ?, total = ?, updated_at = ? WHERE id = ? AND ((payment_status = ? AND domain_fee IS ?) OR (payment_status = 'verified' AND domain_fee IS ? AND ? = 'verified'))",status,pay,reference,notes,domainStatus,clientEmail,fee,quotedTotal,Date.now(),id,o.payment_status,o.domain_fee,fee,pay),q(env,'INSERT INTO audit (id,order_id,actor,action,detail,created_at) SELECT ?,?,?,?,?,? WHERE changes() = 1',crypto.randomUUID(),id,'admin','order_updated',`${o.status} → ${status}; pembayaran ${pay}; domain ${domainStatus}`,Date.now())]);if(!changes[0].meta.changes)throw new ApiError(409,'Pesanan sudah berubah. Muat ulang sebelum menyimpan harga domain.');const updated=await order(env,id);if(pay==='verified'&&status!=='cancelled')await provisionAccount(env,updated);return json({order:publicOrder(updated),account:await accountInfo(env,id)});}
      if(action==='content'&&request.method==='PUT')return saveContent(request,env,s,id);
      if(action==='publish'&&request.method==='POST')return publish(request,env,s,id);
      if(action==='media'&&request.method==='POST')return upload(request,env,s,id);
      if(['invite','activation'].includes(action)&&request.method==='POST')return json(await resendActivation(env,o));
      if(action==='activation-link'&&request.method==='GET')return json(await activationLink(env,o));
      if(action==='revoke'&&request.method==='POST'){await revokeAccount(env,id);await env.DB.batch([q(env,'DELETE FROM sessions WHERE order_id = ?',id),q(env,'DELETE FROM invites WHERE order_id = ?',id),log(env,id,'admin','access_revoked','Akses klien dicabut')]);return json({ok:true});}
    }
  }
  throw new ApiError(404,'Halaman tidak ditemukan.');
}
export default {async fetch(request,env,ctx){const url=new URL(request.url);try{
  if(url.pathname.startsWith('/api/'))return await api(request,env,url,ctx);
  if(url.pathname.startsWith('/media/'))return await mediaResponse(request,env,url.pathname.slice(7));
  const site=url.pathname.match(/^\/(website|preview)\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?\/?$/);if(site)return await renderSite(request,env,site[2],site[1]==='preview',site[3]||'');
  if(/^\/(website|preview)\//.test(url.pathname))throw new ApiError(404,'Halaman tidak ditemukan.');
  if(!['GET','HEAD'].includes(request.method))return json({error:'Metode tidak diizinkan.'},405);
  let pathname=url.pathname;const templatePage=pathname.match(/^\/template-([a-z]+)\/([a-z0-9-]+)\/?$/);if(templatePage){const template=Object.keys(profileTemplates).find(key=>key.toLowerCase()===templatePage[1]);pathname=profileAsset(template,templatePage[2]);if(!pathname)throw new ApiError(404,'Halaman tidak ditemukan.');}else if(['/admin','/cms'].includes(pathname))pathname+='.html';else if(pathname==='/'||pathname==='')pathname='/index.html';else if(!pathname.split('/').at(-1).includes('.'))pathname+='.html';
  const target=new URL(pathname,url.origin);target.search=url.search;const response=await env.ASSETS.fetch(new Request(target,{method:request.method,headers:request.headers}));const h=new Headers(response.headers);h.set('X-Content-Type-Options','nosniff');h.set('Referrer-Policy','strict-origin-when-cross-origin');if(['/admin.html','/cms.html'].includes(pathname)){h.set('Cache-Control','private, no-store');h.set('X-Robots-Tag','noindex, nofollow');h.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' blob: data:; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; base-uri 'none'; form-action 'self'");}return new Response(response.body,{status:response.status,headers:h});
 }catch(e){if(!(e instanceof ApiError)&&!(e instanceof AuthError))console.error('Rasio Labs request failed:',e.name,e.message?.slice(0,160));return json({error:e instanceof ApiError||e instanceof AuthError?e.message:'Layanan sedang bermasalah. Data Anda belum diubah. Coba lagi.'},e instanceof ApiError||e instanceof AuthError?e.status:503);}}};
