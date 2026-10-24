export const policyVersion = 'chapter-85-v4-pricing-2026-10-19';
export const profilePlans = Object.freeze([
  {months:1, monthlyEquivalent:109000, totalPrice:109000, freeDomainFirstYear:false},
  {months:12, monthlyEquivalent:54500, totalPrice:654000, freeDomainFirstYear:true},
  {months:24, monthlyEquivalent:32000, totalPrice:768000, freeDomainFirstYear:true, badge:'Paling Populer'},
  {months:48, monthlyEquivalent:27750, totalPrice:1332000, freeDomainFirstYear:true, badge:'Harga Terbaik'}
].map(Object.freeze));
export const storePlans = Object.freeze([
  {months:1, monthlyEquivalent:299000, totalPrice:299000, freeDomainFirstYear:false},
  {months:12, monthlyEquivalent:179000, totalPrice:2148000, freeDomainFirstYear:true},
  {months:24, monthlyEquivalent:149000, totalPrice:3576000, freeDomainFirstYear:true, badge:'Paling Populer'},
  {months:48, monthlyEquivalent:129000, totalPrice:6192000, freeDomainFirstYear:true, badge:'Harga Terbaik'}
].map(Object.freeze));
export const storeScope = Object.freeze({initialProductAssistance:20,activeProducts:null,rasioTransactionFeePercent:0,productionReady:false,thirdPartyFeesIncluded:false});
export function getPlan(service, months) {
  const plans={profile:profilePlans,store:storePlans}[service];
  const plan=plans?.find(p=>p.months===months);
  if(!plan)throw new Error('Paket tidak tersedia.');
  return {...plan,status:'CONFIRMED',normalMonthly:plans[0].monthlyEquivalent};
}
export const policyDecisions = [
  ['profile-pricing','Harga Profile 1/12/24/48 bulan','CONFIRMED','Pemilik bisnis','Rp109.000 / Rp654.000 / Rp768.000 / Rp1.332.000 total.'],
  ['domain-eligibility','Domain tahun pertama untuk 12/24/48; bukan 1 bulan','CONFIRMED','Pemilik bisnis','Kelayakan durasi dikonfirmasi; TLD dan plafon belum ditetapkan.'],
  ['minor-revisions','Revisi minor tanpa batas jumlah selama aktif','CONFIRMED','Pemilik bisnis','CMS hanya mengedit field yang didukung; tidak ada penghitung sisa revisi.'],
  ['store-pricing','Tarif Store 1/12/24/48 bulan','CONFIRMED','Pemilik bisnis, 19 Oktober 2026','Total Rp299.000 / Rp2.148.000 / Rp3.576.000 / Rp6.192.000; keputusan pembaruan harga final pemilik.'],
  ['store-scope','Scope standar Store','CONFIRMED_BUSINESS_PENDING_TECHNICAL','Pemilik bisnis, 20 Oktober 2026 + teknis','Produk tanpa batas jumlah, bantuan input 20 produk pertama, biaya transaksi dari RasioLabs 0%. Biaya gateway/pihak ketiga terpisah. Kesiapan implementasi perlu diverifikasi sebelum produksi.'],
  ['active-catalogue','Satu template aktif: Padel Club','CONFIRMED','Pemilik bisnis, 19 Oktober 2026','Enam implementasi dihapus setelah backup; tiga screenshot hero dipertahankan sebagai aset marketing.'],
  ['domain-program','TLD, plafon subsidi, registrar, pajak, transfer masuk, domain khusus dan pembelian bulanan','PENDING','Bisnis + hukum','Harus diumumkan sebelum pembayaran. Domain premium/biaya tambahan perlu persetujuan.'],
  ['domain-renewal','Domain tahun kedua dan seterusnya dibayar pelanggan','DRAFT_POLICY_PENDING_LEGAL_REVIEW','Bisnis + hukum','Harga dan expiry domain terpisah dari kontrak website.'],
  ['domain-rights','Registran pelanggan, transfer, dan domain sendiri','DRAFT_POLICY_PENDING_LEGAL_REVIEW','Bisnis + hukum','Benefit yang tidak dipakai tidak otomatis menjadi uang/kredit. Domain tidak ditahan untuk tagihan website.'],
  ['revision-scope','Definisi minor/major, antrean dan penawaran custom','DRAFT_POLICY_PENDING_LEGAL_REVIEW','Bisnis + hukum','Tidak menjanjikan SLA atau penyelesaian 24/7.'],
  ['refund','Pembatalan, refund proporsional, biaya pihak ketiga dan pengaduan','DRAFT_POLICY_PENDING_LEGAL_REVIEW','Bisnis + hukum','Usulan 7 hari kalender sebelum setup individual/pengeluaran; formula dan waktu pemrosesan belum disetujui.'],
  ['renewal','Renewal manual dengan persetujuan aktif dan harga penawaran','DRAFT_POLICY_PENDING_LEGAL_REVIEW','Bisnis + hukum','Tidak ada auto charge default. Tarif renewal lama bukan penawaran v4 final.'],
  ['reminders','Pengingat H-30/14/7/1 dan kanal persetujuan','PROPOSED','Bisnis + operasional + hukum','Pengingat website dan domain harus terpisah.'],
  ['grace','Masa tenggang 14 hari dan prosedur suspensi','PROPOSED','Bisnis + operasional + hukum','Tidak menjalankan suspensi otomatis sebelum disahkan.'],
  ['ownership','Lisensi template, aset pelanggan, karya khusus, output AI dan IP Custom','DRAFT_POLICY_PENDING_LEGAL_REVIEW','Bisnis + hukum','Lisensi template selama aktif; tidak mengalihkan source code.'],
  ['retention','Ekspor 30 hari; retensi pemulihan 60 hari; backup dan pengecualian','PROPOSED','Bisnis + hukum + penanggung jawab data','Titik awal periode dan jadwal penghapusan harus ditegaskan. Tidak ada penghapusan otomatis.'],
  ['legal-entity','Identitas badan usaha, pajak, PSE/PMSE, PDP, kontrak registrar dan sengketa','PENDING_LEGAL_REVIEW','Penasihat hukum Indonesia','Termasuk legal basis, processor/data processing, lisensi pihak ketiga dan kontrak elektronik.'],
  ['payment-operations','Gateway, persetujuan versi syarat, bukti pembayaran dan refund','PENDING','Bisnis + hukum + teknis','Belum ada persetujuan/konfigurasi produksi.']
].map(([id,title,status,owner,note])=>Object.freeze({id,title,status,owner,note}));
export const productionGate = Object.freeze({checkout:false,refund:false,domainTransfer:false,recurringCharges:false,dataDeletion:false,reason:'Kebijakan v4 belum disetujui bisnis dan ditinjau hukum; hanya simulasi lokal.'});
export function requireProductionApproval(action) {
  if (productionGate[action] !== true) { const e=new Error(productionGate.reason); e.code='POLICY_REVIEW_REQUIRED'; throw e; }
}
export const revisionTypes = ['minor','major','incident'];
export const revisionStatuses = ['submitted','triaged','awaiting_material','queued','in_progress','completed','needs_quote'];
export const lifecycleStates = ['renewal_opt_in','renewal_requested','renewal_paid','domain_first_year_eligible','domain_year_one_registered','domain_renewal_due','subscription_expiring','subscription_grace','website_suspended','data_export_requested','revision_queued','early_termination_requested','refund_under_review','refund_completed'];
export function makeRevision(input) {
  if (!revisionTypes.includes(input.type)) throw new Error('Pilih jenis permintaan.');
  for (const key of ['page','before','after']) if (typeof input[key] !== 'string' || !input[key].trim() || input[key].length>2000) throw new Error('Lengkapi halaman, kondisi sekarang, dan perubahan yang diminta (maks. 2.000 karakter).');
  return {revision_type:input.type,revision_status:input.type==='major'?'needs_quote':'submitted',page:input.page.trim(),before:input.before.trim(),after:input.after.trim(),material: String(input.material||'').slice(0,2000),scope:input.type==='major'?'Estimasi dan persetujuan biaya terpisah.':'Ditinjau sesuai cakupan, antrean, dan materi.'};
}
export function renewalNotification(kind,{expiry,price=null,actionUrl}) {
  if(!['subscription','domain'].includes(kind)||!/^\d{4}-\d{2}-\d{2}$/.test(expiry)||!Number.isFinite(Date.parse(expiry)))throw new Error('Notifikasi tidak valid.');
  if(price!==null&&(!Number.isSafeInteger(price)||price<0))throw new Error('Tarif notifikasi tidak valid.');
  if(typeof actionUrl!=='string'||!actionUrl.startsWith('account-v4.html#'))throw new Error('Tujuan notifikasi tidak valid.');
  const subject=kind==='domain'?'Pengingat masa aktif domain':'Pengingat masa aktif langganan website';
  return {kind,subject,expiry,price,actionUrl,delivery:'preview_only',text:`${kind==='domain'?'Domain':'Langganan website'} berakhir ${expiry}. ${price===null?'Tarif perpanjangan menunggu penawaran.':'Total penawaran Rp'+price.toLocaleString('id-ID')+'.'} Tinjau rincian dan setujui pembayaran sebelum perpanjangan.`,status:'PROPOSED'};
}
