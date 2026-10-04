export class AuthError extends Error { constructor(status,message){super(message);this.status=status;} }
const DAY=86400000;
const q=(env,sql,...args)=>env.DB.prepare(sql).bind(...args);
const bytes=n=>crypto.getRandomValues(new Uint8Array(n));
const base64=a=>btoa(String.fromCharCode(...a)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const decode=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
const token=()=>base64(bytes(32));
const utf8=s=>new TextEncoder().encode(s);
const sha=async s=>base64(new Uint8Array(await crypto.subtle.digest('SHA-256',utf8(s))));
const emailValid=s=>typeof s==='string'&&s.length<=150&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
function requireSecret(env){if(!env.CLIENT_AUTH_SECRET||env.CLIENT_AUTH_SECRET.length<43)throw new AuthError(503,'Login klien sedang disiapkan. Coba lagi nanti.');}
async function encryptionKey(env){requireSecret(env);return crypto.subtle.importKey('raw',await crypto.subtle.digest('SHA-256',utf8(env.CLIENT_AUTH_SECRET)),{name:'AES-GCM'},false,['encrypt','decrypt']);}
async function encrypt(env,value){const iv=bytes(12),key=await encryptionKey(env);const result=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,utf8(JSON.stringify(value)));return base64(iv)+'.'+base64(new Uint8Array(result));}
async function decrypt(env,value){const [iv,data]=value.split('.');const result=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(iv)},await encryptionKey(env),decode(data));return JSON.parse(new TextDecoder().decode(result));}
async function passwordHash(env,password,salt){
  requireSecret(env);
  const pepper=await crypto.subtle.importKey('raw',utf8(env.CLIENT_AUTH_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const material=await crypto.subtle.sign('HMAC',pepper,utf8('rasio-password:'+password));
  const key=await crypto.subtle.importKey('raw',material,'PBKDF2',false,['deriveBits']);
  // Workers' native PBKDF2 limit is 100k; a separate server secret peppers every password.
  return base64(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:decode(salt),iterations:100000,hash:'SHA-256'},key,256)));
}
function equal(a,b){if(a.length!==b.length)return false;let different=0;for(let i=0;i<a.length;i++)different|=a.charCodeAt(i)^b.charCodeAt(i);return different===0;}
async function account(env,id){return q(env,'SELECT * FROM client_accounts WHERE order_id = ?',id).first();}
export async function accountInfo(env,id){const a=await account(env,id);if(!a)return null;const mail=await q(env,'SELECT status,error,sent_at FROM email_outbox WHERE account_id = ? ORDER BY created_at DESC LIMIT 1',a.id).first();return {username:a.username,email:a.email,activated:Boolean(a.activated_at),enabled:a.enabled===1,emailStatus:mail?.status||'not_created',emailError:mail?.error||'',emailSentAt:mail?.sent_at||null};}
export async function provisionAccount(env,o,{sendEmail=true}={}){
  if(o.is_preview||o.payment_status!=='verified'||o.status==='cancelled')throw new AuthError(409,'Verifikasi pembayaran sebelum menyiapkan akun klien.');
  if(!emailValid(o.email))throw new AuthError(400,'Isi email kontak klien untuk mengirim akses login.');
  requireSecret(env);let a=await account(env,o.id);
  if(!a){const now=Date.now();const username=(o.domain.split('.')[0].slice(0,20)+'-'+o.id.replace(/-/g,'').slice(0,8)).toLowerCase();await q(env,'INSERT OR IGNORE INTO client_accounts (id,order_id,username,email,version,enabled,created_at) VALUES (?,?,?,?,1,1,?)',crypto.randomUUID(),o.id,username,o.email,now).run();a=await account(env,o.id);}
  if(!a)throw new AuthError(503,'Akun klien belum dapat disiapkan. Coba lagi.');
  if(!a.password_hash&&a.enabled){let existing=await q(env,'SELECT id FROM email_outbox WHERE account_id = ? ORDER BY created_at DESC LIMIT 1',a.id).first();if(!existing){const raw=token(),hash=await sha(raw),now=Date.now(),id='initial-'+a.id,payload=await encrypt(env,{to:a.email,username:a.username,url:env.PUBLIC_ORIGIN+'/cms#reset='+raw,purpose:'activation',expiresAt:now+DAY});await env.DB.batch([q(env,"INSERT OR IGNORE INTO email_outbox (id,account_id,token_hash,payload,status,created_at) VALUES (?,?,?,?,'pending',?)",id,a.id,hash,payload,now),q(env,'INSERT OR IGNORE INTO password_resets (token_hash,account_id,purpose,expires_at,created_at) SELECT ?,?,?,?,? WHERE EXISTS (SELECT 1 FROM email_outbox WHERE id = ? AND token_hash = ?)',hash,a.id,'activation',now+DAY,now,id,hash)]);existing={id};}if(sendEmail)await dispatchEmail(env,existing.id);}
  return accountInfo(env,o.id);
}
export async function makeReset(env,a,purpose){
  const raw=token(),hash=await sha(raw),now=Date.now(),id=crypto.randomUUID(),expiresAt=now+(purpose==='activation'?DAY:3600000);
  const url=env.PUBLIC_ORIGIN+'/cms#reset='+raw;
  const payload=await encrypt(env,{to:a.email,username:a.username,url,purpose,expiresAt});
  await env.DB.batch([q(env,'UPDATE password_resets SET used_at = ? WHERE account_id = ? AND used_at IS NULL',now,a.id),q(env,"UPDATE email_outbox SET status = 'superseded', payload = '', error = '' WHERE account_id = ? AND status <> 'sent'",a.id),q(env,'INSERT INTO password_resets (token_hash,account_id,purpose,expires_at,created_at) VALUES (?,?,?,?,?)',hash,a.id,purpose,expiresAt,now),q(env,"INSERT INTO email_outbox (id,account_id,token_hash,payload,status,created_at) VALUES (?,?,?,?,'pending',?)",id,a.id,hash,payload,now)]);
  return {url,jobId:id,expiresAt};
}
export async function dispatchEmail(env,id){
  const job=await q(env,'SELECT email_outbox.*,password_resets.expires_at,password_resets.used_at,client_accounts.enabled,orders.payment_status,orders.status AS order_status FROM email_outbox JOIN password_resets ON password_resets.token_hash = email_outbox.token_hash JOIN client_accounts ON client_accounts.id = email_outbox.account_id JOIN orders ON orders.id = client_accounts.order_id WHERE email_outbox.id = ?',id).first();
  if(!job||job.status==='sent'||job.status==='superseded'||job.used_at||job.expires_at<Date.now()||!job.enabled||job.payment_status!=='verified'||job.order_status==='cancelled')return;
  if(!env.RESEND_API_KEY||!env.EMAIL_FROM){await q(env,"UPDATE email_outbox SET status = 'waiting_setup', error = 'Layanan email pengirim belum terhubung.' WHERE id = ? AND status <> 'sent'",id).run();return;}
  const claim=await q(env,"UPDATE email_outbox SET status = 'sending', attempts = attempts + 1 WHERE id = ? AND status IN ('pending','waiting_setup','failed')",id).run();if(!claim.meta.changes)return;
  try{
    const p=await decrypt(env,job.payload),activation=p.purpose==='activation';
    const message={from:env.EMAIL_FROM,to:[p.to],subject:activation?'Akun Rasio Labs Anda siap diaktifkan':'Atur ulang password Rasio Labs',text:`${activation?'Pembayaran Anda sudah diverifikasi. Akun website Anda sudah disiapkan.':'Kami menerima permintaan untuk mengatur ulang password Anda.'}\n\nUsername: ${p.username}\n${activation?'Buat password pertama Anda':'Atur ulang password'}: ${p.url}\n\n${activation?'Tautan berlaku 24 jam.':'Tautan berlaku 1 jam.'} Setelah membuat password, masuk melalui ${env.PUBLIC_ORIGIN}/cms.\n\nJika Anda tidak meminta perubahan ini, abaikan email ini.\nRasio Labs`};
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'rasio-'+id},body:JSON.stringify(message),signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw new Error('Email provider rejected request');const data=await response.json();if(!data.id)throw new Error('Email provider missing confirmation');
    await q(env,"UPDATE email_outbox SET status = 'sent', provider_id = ?, sent_at = ?, error = '', payload = '' WHERE id = ? AND status = 'sending'",String(data.id).slice(0,150),Date.now(),id).run();
  }catch{await q(env,"UPDATE email_outbox SET status = 'failed', error = 'Email belum terkirim. Coba kirim ulang dari admin.' WHERE id = ? AND status = 'sending'",id).run();}
}
export async function resendActivation(env,o){
  let a=await account(env,o.id);if(!a){await provisionAccount(env,o,{sendEmail:false});a=await account(env,o.id);}
  if(!a||o.is_preview||o.payment_status!=='verified'||o.status==='cancelled')throw new AuthError(409,'Akun klien belum dapat diaktifkan.');
  if(!a.enabled){await q(env,'UPDATE client_accounts SET enabled = 1,password_hash = NULL,password_salt = NULL,activated_at = NULL,version = version + 1 WHERE id = ?',a.id).run();a.password_hash=null;}a.enabled=1;
  const r=await makeReset(env,a,a.password_hash?'reset':'activation');await dispatchEmail(env,r.jobId);return {...r,account:await accountInfo(env,o.id)};
}
export async function activationLink(env,o){const a=await account(env,o.id);if(!a||!a.enabled||o.payment_status!=='verified'||o.status==='cancelled'||o.is_preview)throw new AuthError(409,'Akun klien belum tersedia.');const row=await q(env,'SELECT payload FROM email_outbox JOIN password_resets ON password_resets.token_hash = email_outbox.token_hash WHERE email_outbox.account_id = ? AND password_resets.used_at IS NULL AND password_resets.expires_at > ? AND email_outbox.payload <> ? ORDER BY email_outbox.created_at DESC LIMIT 1',a.id,Date.now(),'').first();if(!row)throw new AuthError(409,'Buat tautan aktivasi baru.');const p=await decrypt(env,row.payload);return {url:p.url,expiresAt:p.expiresAt};}
async function resetAccount(env,raw){if(typeof raw!=='string'||!/^[\w-]{43}$/.test(raw))throw new AuthError(400,'Tautan tidak valid atau kedaluwarsa.');const row=await q(env,'SELECT password_resets.*,client_accounts.username,client_accounts.order_id,client_accounts.enabled,orders.payment_status,orders.status FROM password_resets JOIN client_accounts ON client_accounts.id = password_resets.account_id JOIN orders ON orders.id = client_accounts.order_id WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?',await sha(raw),Date.now()).first();if(!row||!row.enabled||row.payment_status!=='verified'||row.status==='cancelled')throw new AuthError(400,'Tautan tidak valid atau kedaluwarsa.');return row;}
export async function resetInfo(env,raw){const a=await resetAccount(env,raw);return {username:a.username,purpose:a.purpose};}
export async function completeReset(env,b){
  const a=await resetAccount(env,b.token);if(typeof b.password!=='string'||b.password.length<12||b.password.length>128||b.password!==b.confirmPassword)throw new AuthError(400,'Gunakan password 12–128 karakter dan pastikan konfirmasinya sama.');
  const salt=base64(bytes(16)),hashed=await passwordHash(env,b.password,salt),now=Date.now(),stamp=crypto.randomUUID();
  // Claim the one-use token and update the password in the same D1 transaction.
  const r=await env.DB.batch([q(env,'UPDATE password_resets SET used_at = ?,claim_id = ? WHERE token_hash = ? AND used_at IS NULL AND expires_at > ? AND EXISTS (SELECT 1 FROM client_accounts JOIN orders ON orders.id = client_accounts.order_id WHERE client_accounts.id = password_resets.account_id AND enabled = 1 AND payment_status = ? AND status <> ?)',now,stamp,a.token_hash,now,'verified','cancelled'),q(env,'UPDATE client_accounts SET password_hash = ?,password_salt = ?,version = version + 1,activated_at = COALESCE(activated_at,?) WHERE id = ? AND EXISTS (SELECT 1 FROM password_resets WHERE token_hash = ? AND claim_id = ?)',hashed,salt,now,a.account_id,a.token_hash,stamp),q(env,'DELETE FROM sessions WHERE order_id = ? AND EXISTS (SELECT 1 FROM password_resets WHERE token_hash = ? AND claim_id = ?)',a.order_id,a.token_hash,stamp),q(env,'UPDATE password_resets SET used_at = ? WHERE account_id = ? AND used_at IS NULL AND EXISTS (SELECT 1 FROM password_resets WHERE token_hash = ? AND claim_id = ?)',now,a.account_id,a.token_hash,stamp),q(env,"UPDATE email_outbox SET payload = '', status = CASE WHEN status = 'sent' THEN status ELSE 'superseded' END WHERE account_id = ? AND EXISTS (SELECT 1 FROM password_resets WHERE token_hash = ? AND claim_id = ?)",a.account_id,a.token_hash,stamp),q(env,'INSERT INTO audit (id,order_id,actor,action,detail,created_at) SELECT ?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM password_resets WHERE token_hash = ? AND claim_id = ?)',stamp,a.order_id,'client','password_set','Password klien diperbarui',now,a.token_hash,stamp)]);
  if(!r[0].meta.changes)throw new AuthError(400,'Tautan sudah dipakai. Minta tautan baru.');return {ok:true,username:a.username};
}
export async function clientLogin(env,b){
  requireSecret(env);const username=typeof b.username==='string'?b.username.trim().toLowerCase().slice(0,100):'',password=typeof b.password==='string'?b.password:'';
  if(!username||!password||password.length>128)throw new AuthError(401,'Username atau password tidak sesuai.');
  const key=await sha(env.CLIENT_AUTH_SECRET+':login:'+username+':'+Math.floor(Date.now()/900000));const count=await q(env,'INSERT INTO rate_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count',key,Date.now()+900000).first();if(count.count>30)throw new AuthError(429,'Terlalu banyak percobaan. Coba lagi nanti.');
  const a=await q(env,'SELECT client_accounts.*,orders.payment_status,orders.status FROM client_accounts JOIN orders ON orders.id = client_accounts.order_id WHERE username = ?',username).first();const actual=await passwordHash(env,password,a?.password_salt||'AAAAAAAAAAAAAAAAAAAAAA');
  if(!a?.password_hash||!equal(actual,a.password_hash)||!a.enabled||a.payment_status!=='verified'||a.status==='cancelled')throw new AuthError(401,'Username atau password tidak sesuai.');return a;
}
export async function forgotPassword(env,b){const name=typeof b.username==='string'?b.username.trim().toLowerCase().slice(0,100):'';const a=await q(env,"SELECT client_accounts.* FROM client_accounts JOIN orders ON orders.id = client_accounts.order_id WHERE username = ? AND enabled = 1 AND payment_status = 'verified' AND status <> 'cancelled'",name).first();let jobId=null;if(a){const last=await q(env,'SELECT created_at FROM password_resets WHERE account_id = ? ORDER BY created_at DESC LIMIT 1',a.id).first();if(!last||last.created_at<Date.now()-60000){const r=await makeReset(env,a,a.password_hash?'reset':'activation');jobId=r.jobId;}}return {ok:true,message:'Jika username terdaftar, tautan akan dikirim ke email akun Anda.',jobId};}
export async function revokeAccount(env,id){await env.DB.batch([q(env,'UPDATE client_accounts SET enabled = 0,version = version + 1 WHERE order_id = ?',id),q(env,'UPDATE password_resets SET used_at = ? WHERE account_id IN (SELECT id FROM client_accounts WHERE order_id = ?) AND used_at IS NULL',Date.now(),id),q(env,"UPDATE email_outbox SET payload = '', status = 'superseded' WHERE account_id IN (SELECT id FROM client_accounts WHERE order_id = ?) AND status <> 'sent'",id)]);}
