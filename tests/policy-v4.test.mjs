import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {profilePlans,storePlans,storeScope,getPlan,policyDecisions,productionGate,requireProductionApproval,makeRevision,revisionStatuses,renewalNotification} from '../server/policy-v4.mjs';
test('Bab 85: harga eksplisit, total di muka, dan domain mengikuti durasi',()=>{
  assert.deepEqual(profilePlans.map(p=>[p.months,p.monthlyEquivalent,p.totalPrice,p.freeDomainFirstYear]),[[1,109000,109000,false],[12,54500,654000,true],[24,32000,768000,true],[48,27750,1332000,true]]);
  for(const p of profilePlans)assert.equal(p.totalPrice,p.months*p.monthlyEquivalent);
  for(const invalid of [0,2,36,'24',null,NaN])assert.throws(()=>getPlan('profile',invalid));
  assert.throws(()=>getPlan('__proto__',24));
  assert.equal(getPlan('store',48).monthlyEquivalent,129000);
  assert.equal(getPlan('store',48).status,'CONFIRMED');
});
test('tarif Store, domain, badge, dan cakupan mengikuti keputusan final pemilik',()=>{
  assert.deepEqual(storePlans.map(p=>[p.months,p.monthlyEquivalent,p.totalPrice,p.freeDomainFirstYear,p.badge||'']),[[1,299000,299000,false,''],[12,179000,2148000,true,''],[24,149000,3576000,true,'Paling Populer'],[48,129000,6192000,true,'Harga Terbaik']]);
  for(const p of storePlans){assert.equal(p.totalPrice,p.months*p.monthlyEquivalent);assert.equal(getPlan('store',p.months).normalMonthly,299000);}
  assert.equal(storeScope.activeProducts,null);
  assert.equal(storeScope.initialProductAssistance,20);
  assert.equal(storeScope.rasioTransactionFeePercent,0);
  assert.equal(storeScope.thirdPartyFeesIncluded,false);
  assert.equal(storeScope.productionReady,false);
});
test('tidak ada approval yang diada-adakan atau operasi finansial aktif',()=>{
  for(const action of ['checkout','refund','domainTransfer','recurringCharges','dataDeletion','unknown'])assert.throws(()=>requireProductionApproval(action),{code:'POLICY_REVIEW_REQUIRED'});
  assert.equal(productionGate.checkout,false);
  assert.equal(policyDecisions.find(d=>d.id==='refund').status,'DRAFT_POLICY_PENDING_LEGAL_REVIEW');
  assert.equal(policyDecisions.find(d=>d.id==='grace').status,'PROPOSED');
  assert.equal(policyDecisions.find(d=>d.id==='domain-program').status,'PENDING');
});
test('revisi tidak membatasi jumlah; perubahan besar masuk penawaran',()=>{
  const input={type:'minor',page:'Kontak',before:'Nomor lama',after:'Nomor baru'};
  for(let n=0;n<150;n++)assert.equal(makeRevision(input).revision_status,'submitted');
  assert.equal(makeRevision({...input,type:'major'}).revision_status,'needs_quote');
  assert.equal(makeRevision({...input,type:'incident'}).revision_type,'incident');
  assert.deepEqual(revisionStatuses,['submitted','triaged','awaiting_material','queued','in_progress','completed','needs_quote']);
  for(const change of [{page:''},{before:''},{after:''},{type:'free'},{after:'x'.repeat(2001)}])assert.throws(()=>makeRevision({...input,...change}));
  assert.equal(Object.hasOwn(makeRevision(input),'remaining'),false);
});
test('halaman kebijakan lengkap dan semua link sebelum pembayaran tersedia',async()=>{
  const files=['terms','domain-policy','cancellation-policy','renewal-policy','ownership-policy','policy-review','checkout-v4','account-v4','help-v4'];
  for(const f of files){const html=await readFile(new URL('../dist/'+f+'.html',import.meta.url),'utf8');const internal=['policy-review','checkout-v4','account-v4','help-v4'].includes(f);if(internal)assert.match(html,/Draf untuk review bisnis & hukum/);for(const link of ['terms','domain-policy','cancellation-policy','renewal-policy','ownership-policy'])assert(html.includes(`href="${link}.html"`));}
  const js=await readFile(new URL('../dist/policy-flow.js',import.meta.url),'utf8');
  const checkoutJs=await readFile(new URL('../dist/checkout-selection.js',import.meta.url),'utf8');
  assert(!/\bfetch\s*\(/.test(js),'Simulasi tidak mengirim transaksi');
  assert(!/<input[^>]+checked/.test(js),'Persetujuan tidak dipilih otomatis');
  assert(!/\bfetch\s*\(/.test(checkoutJs),'Ringkasan tidak mengirim transaksi');
  assert.match(checkoutJs,/consent.checked=false/);
  assert.match(checkoutJs,/Pembayaran belum tersedia/);
});
test('server menolak transaksi baru sementara kebijakan belum disetujui',async()=>{
  const worker=await readFile(new URL('../server/worker.mjs',import.meta.url),'utf8');
  const start=worker.indexOf("if(path==='/api/orders'&&request.method==='POST')");
  const gate=worker.indexOf("requireProductionApproval('checkout')",start);
  const insert=worker.indexOf("INSERT INTO orders",start);
  assert(gate>start&&gate<insert);
});
test('pengingat domain dan kontrak terpisah, tidak mengirim atau mengarang tarif',()=>{
  const domain=renewalNotification('domain',{expiry:'2027-10-15',actionUrl:'account-v4.html#domain'});
  const website=renewalNotification('subscription',{expiry:'2030-10-15',actionUrl:'account-v4.html#subscription'});
  assert.notEqual(domain.subject,website.subject);assert.notEqual(domain.expiry,website.expiry);
  assert.equal(domain.price,null);assert.equal(domain.delivery,'preview_only');
  assert.throws(()=>renewalNotification('domain',{expiry:'bad',actionUrl:'https://example.com'}));
});
