import {templateCatalog} from './template-catalog.js';
import {profilePlans,storeScope,policyVersion} from './policy-v4.js';
import {readSelection,chooseSelection,selectionHref,recoverySelection,homeHref} from './selection.js';

const money=n=>'Rp'+n.toLocaleString('id-ID');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const facts=items=>'<dl class="facts">'+items.map(([key,value])=>`<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')+'</dl>';
const policies='<nav class="policy-links" aria-label="Kebijakan sebelum konfirmasi"><a href="terms.html">Syarat layanan</a><a href="cancellation-policy.html">Pembatalan & refund</a><a href="domain-policy.html">Domain</a><a href="renewal-policy.html">Renewal</a><a href="ownership-policy.html">Kepemilikan & data</a></nav>';

export function initCheckout(root=document){
  const checkout=root.getElementById('checkout-app');
  if(!checkout)return;
  function render(){
    const state=readSelection(location.href),service=state.service,p=state.plan;
    const previousDomain=checkout.querySelector('#domain-name-v4')?.value||'';
    const previousMode=checkout.querySelector('#domain-mode')?.value||'new';
    const changeService=homeHref(recoverySelection(state),'layanan',location.href);
    if(state.errors.length||!service||service==='custom'){
      const messages=state.errors.length?state.errors.map(e=>e.message):[service==='custom'?'Rasio Custom menggunakan penawaran sesuai kebutuhan proyek.':'Pilih layanan sebelum melanjutkan.'];
      const recovery=recoverySelection(state);
      const retry=selectionHref('checkout-v4.html',recovery,location.href);
      checkout.innerHTML=`<section class="flow-card"><h2>Periksa pilihan Anda</h2><div role="alert">${messages.map(message=>`<p>${esc(message)}</p>`).join('')}</div><nav class="actions" aria-label="Perbaiki pilihan">${['profile','store'].includes(service)?`<a class="primary" href="${esc(retry)}">Pilih ulang paket</a>`:''}<a href="${esc(homeHref(recovery,'template',location.href))}">Pilih template yang tersedia</a><a href="${esc(changeService)}">Ganti layanan</a></nav></section>`;
      return;
    }
    const selected=templateCatalog.find(t=>t.id===state.template);
    const options=profilePlans.map(plan=>`<option value="${plan.months}" ${plan.months===state.months?'selected':''}>${plan.months} bulan${plan.badge?' · '+plan.badge:''}</option>`).join('');
    checkout.innerHTML=`<div class="flow-grid"><section class="flow-card"><h2>Rasio Labs ${service==='store'?'Store':'Profile'}</h2><a data-change-service href="${esc(changeService)}">Ganti layanan</a><label for="duration-v4">Durasi layanan</label><select id="duration-v4"><option value="" ${!state.months?'selected':''}>Pilih durasi layanan</option>${options}</select><div id="benefits-v4"></div><label for="template-v4">Template</label>${service==='profile'?`<select id="template-v4"><option value="">Pilih template yang sudah tersedia</option>${templateCatalog.filter(t=>t.service===service).map(t=>`<option value="${esc(t.id)}" ${t.id===state.template?'selected':''}>${esc(t.name)}</option>`).join('')}</select>`:'<p>Katalog toko online sedang disiapkan.</p>'}<label for="domain-mode">Pilihan domain</label><select id="domain-mode"><option value="new">Daftarkan domain baru</option><option value="own">Gunakan domain sendiri</option></select><label for="domain-name-v4">Nama domain</label><input id="domain-name-v4" placeholder="namabisnis.com" autocomplete="off" maxlength="253" aria-describedby="domain-help-v4 checkout-error"><p class="simulation" id="domain-help-v4">Ketersediaan, harga, TLD, plafon subsidi dan pajak belum terhubung ke registrar. Tidak ada domain yang didaftarkan.</p><p id="domain-review-v4"></p><details><summary>Revisi yang termasuk</summary><p>Revisi minor tanpa batas jumlah selama aktif: teks singkat, kontak, tautan, dan foto pada slot yang ada. Halaman, layout, fitur, integrasi, dan input massal perlu estimasi terpisah. CMS hanya mengedit field yang didukung.</p><a href="terms.html">Baca cakupan revisi</a></details></section><section class="flow-card"><h2>Ringkasan pesanan</h2><div id="quote-v4" aria-live="polite"></div>${policies}<form id="checkout-review" novalidate><label class="consent"><input id="consent-v4" type="checkbox"><span>Saya sudah membaca ringkasan dan draf kebijakan untuk simulasi ini.</span></label><p id="checkout-error" class="error" aria-live="polite"></p><button class="primary" type="submit">Tinjau simulasi pesanan</button><p id="checkout-result" aria-live="polite"></p></form><button disabled type="button" aria-describedby="production-lock">Pembayaran belum tersedia</button><p class="simulation" id="production-lock">Checkout produksi terkunci sampai persetujuan bisnis, review hukum, tarif domain/pajak dan integrasi pembayaran selesai.</p></section></div>`;
    const duration=checkout.querySelector('#duration-v4'),template=checkout.querySelector('#template-v4'),mode=checkout.querySelector('#domain-mode'),domain=checkout.querySelector('#domain-name-v4'),consent=checkout.querySelector('#consent-v4');
    domain.value=previousDomain;mode.value=previousMode;
    function renderQuote(){
      consent.checked=false;
      checkout.querySelector('#checkout-result').textContent='';
      checkout.querySelector('#checkout-error').textContent='';
      checkout.querySelector('#benefits-v4').innerHTML=p?`<ul class="benefits"><li class="${p.freeDomainFirstYear?'':'excluded'}">${p.freeDomainFirstYear?'Domain gratis tahun pertama':'Domain tidak termasuk'}</li><li>1 email bisnis selama berlangganan</li><li>Hosting & SSL selama berlangganan</li><li>Revisi minor tanpa batas jumlah</li>${service==='store'?`<li>Produk tanpa batas</li><li>${storeScope.rasioTransactionFeePercent}% biaya transaksi dari RasioLabs</li><li>Biaya payment gateway dan pihak ketiga terpisah</li>`:''}</ul>`:'';
      checkout.querySelector('#domain-review-v4').textContent=mode.value==='own'?'Domain Anda tetap digunakan. Benefit domain tidak otomatis menjadi uang/kredit (draf kebijakan).':'Tahun kedua dan seterusnya dibayar terpisah oleh pelanggan (draf). TLD dan plafon subsidi masih menunggu keputusan bisnis.';
      const details=[['Layanan','Rasio Labs '+(service==='store'?'Store':'Profile')],['Template',selected?selected.name+' · '+selected.id:service==='profile'?'Belum dipilih':'Katalog toko online sedang disiapkan'],['Durasi',state.months?state.months+' bulan':'Belum dipilih']];
      checkout.querySelector('#quote-v4').innerHTML=p?`<p class="price">${money(p.monthlyEquivalent)}<small>/bulan ekuivalen</small></p>${p.months>1?`<p><s>${money(p.normalMonthly)}/bulan</s></p>`:''}${facts([...details,['Total paket dibayar di muka',money(p.totalPrice)],['Domain',mode.value==='own'?'Domain sendiri':p.freeDomainFirstYear?'Tahun pertama: manfaat paket; kelayakan TLD belum final':'Biaya registrasi belum tersedia'],['Pajak/biaya tambahan','Belum dikonfirmasi'],['Total checkout final','Belum dapat ditetapkan']])}<p class="simulation">Harga renewal akan ditampilkan dalam penawaran yang Anda setujui. Tidak ada penagihan otomatis dalam draf ini.</p>`:`${facts(details)}<p>Pilih durasi layanan untuk melihat total pembayaran.</p>`;
    }
    function update(changes,focus){
      const next=selectionHref(location.href,chooseSelection(state,changes),location.href);
      if(next!==location.href)history.pushState(null,'',next);
      render();
      checkout.querySelector(focus)?.focus();
    }
    duration.addEventListener('change',()=>update({months:duration.value||null},'#duration-v4'));
    template?.addEventListener('change',()=>update({template:template.value},'#template-v4'));
    mode.addEventListener('change',renderQuote);
    domain.addEventListener('input',()=>{consent.checked=false;domain.removeAttribute('aria-invalid');checkout.querySelector('#checkout-error').textContent='';checkout.querySelector('#checkout-result').textContent='';});
    const form=checkout.querySelector('form'),error=checkout.querySelector('#checkout-error');
    form.addEventListener('input',()=>{form.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));error.textContent='';});
    function fail(message,field){error.textContent=message;error.setAttribute('role','alert');field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby','checkout-error');field.focus();}
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!p)return fail('Pilih durasi layanan untuk ditinjau.',duration);
      if(template&&!template.value)return fail('Pilih template untuk ditinjau.',template);
      if(!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain.value.trim()))return fail('Isi nama domain yang valid, misalnya namabisnis.com.',domain);
      if(!consent.checked)return fail('Baca draf kebijakan dan centang persetujuan simulasi.',consent);
      const result=checkout.querySelector('#checkout-result');result.setAttribute('role','status');result.textContent=`Simulasi ditinjau: ${money(p.totalPrice)} untuk ${p.months} bulan, sebelum biaya domain/pajak yang belum final. Tidak ada pesanan, kontrak atau pembayaran dibuat. Versi ${policyVersion}.`;
    });
    renderQuote();
  }
  addEventListener('popstate',render);
  addEventListener('pageshow',render);
  render();
}

export function redirectLegacyOrder(){
  if(!document.querySelector('[data-order-shell]'))return false;
  const state=readSelection(location.href);
  if(state.service==='custom'&&!state.errors.length)return false;
  const url=new URL('checkout-v4.html',location.href);
  url.search=location.search;
  location.replace(url.href);
  return true;
}
