import {getPlan, storeScope} from '../../server/policy-v4.mjs';
import {templateCatalog} from '../../server/template-catalog.mjs';
import {button, escapeHtml as esc, icon, rupiah, whatsappIcon} from './components.mjs';
import {serviceDetails} from './service-content.mjs';

const consultation='https://wa.me/60142317052';
const serviceOrder=['profile','store','custom'];
const art={
  page:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
  contact:'<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 1 1 19 0Z"/><path d="M7 9h9M7 13h6"/>',
  catalogue:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  store:'<path d="M4 10v11h16V10M3 10l2-7h14l2 7M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 21v-6h6v6"/>',
  workflow:'<rect x="8" y="2" width="8" height="5" rx="1"/><rect x="2" y="17" width="8" height="5" rx="1"/><rect x="14" y="17" width="8" height="5" rx="1"/><path d="M12 7v5M6 17v-5h12v5"/>',
  integration:'<path d="m9 8-4 4 4 4m6-8 4 4-4 4M14 4l-4 16"/>',
  setup:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 10l2 2 5-5M8 16h8"/>',
  consulting:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 13c6 3 12 3 18 0M10 13h4v4h-4z"/>',
  building:'<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M3 21h18M9 7h1m4 0h1M9 11h1m4 0h1M10 21v-5h4v5"/>',
  education:'<path d="m2 8 10-5 10 5-10 5L2 8ZM6 10v8c4 3 8 3 12 0v-8M22 9v8"/>',
  factory:'<path d="M3 21V10l7-4v6l6-4v13M17 21h5L20 3h-3l-1 9M6 17h1m5 0h1M2 21h20"/>',
  community:'<circle cx="12" cy="7" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3M3 8a3 3 0 0 0 0 6m18-6a3 3 0 0 1 0 6M2 18v3m20-3v3"/>',
  fashion:'<path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4c-2 3-6 3-8 0Z"/>',
  beauty:'<rect x="7" y="8" width="10" height="13" rx="2"/><path d="M9 8V5h6v3M12 5V2h7M19 2v2M7 12h10M10 16h4"/>',
  home:'<path d="m2 11 10-8 10 8M5 9v12h14V9M9 21v-8h6v8"/>',
  food:'<path d="M5 6h14l-1 15H6L5 6Zm0 0 3-3h8l3 3M8 11h8M9 16h6"/>',
  sport:'<path d="M8 12h8M2 9v6m20-6v6"/><rect x="4" y="6" width="4" height="12" rx="1"/><rect x="16" y="6" width="4" height="12" rx="1"/>',
  craft:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8 8 12 13M8 16 20 3M12 12l3-3"/>',
  logistics:'<path d="M2 6h13v13H2zM15 11h5l3 4v4h-8M15 15h8"/><circle cx="6" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>',
  booking:'<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M3 10h18M8 2v6m8-6v6m-8 7 3 3 6-6"/>'
};
const detailIcon=name=>art[name]?`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${art[name]}</svg>`:icon(name);
const homeLink=(routes,service,hash,months)=>`${routes.home}?type=${service}${months?`&duration=${months}`:''}#${hash}`;
const serviceLink=(routes,file)=>routes.service?routes.service(file):file;
const consult=(label='Konsultasi Gratis',variant='whatsapp')=>button(`${whatsappIcon}<span>${label}</span>`,consultation,variant,'target="_blank" rel="noopener noreferrer"');
const catalogueButton=(routes,service,variant='primary')=>service==='profile'
  ?button('Lihat Template',homeLink(routes,'profile','template'),variant,'data-service-link')
  :`<button type="button" class="button button--${variant}" disabled aria-describedby="service-store-catalogue-note">Lihat Template</button>`;

function pageHeader(routes,service){
  return `<a class="skip-link" href="#main">Lewati ke konten</a><header class="site-header" data-header><nav class="navigation container" aria-label="Navigasi utama"><a class="brand" href="${routes.home}" data-service-link aria-label="Rasio Labs, beranda"><img src="${routes.asset}rasiolabs-logo.png" width="144" height="48" alt="Rasio Labs"></a><button class="menu-toggle" aria-label="Buka menu" aria-expanded="false" aria-controls="nav-links" hidden>${icon('menu')}</button><div class="nav-links" id="nav-links">${serviceOrder.map(key=>`<a href="${serviceLink(routes,serviceDetails[key].file)}?type=${key}" data-service-link${key===service?' aria-current="page"':''}>${serviceDetails[key].name}</a>`).join('')}<a href="#service-pricing">${service==='custom'?'Biaya':'Harga'}</a><a class="nav-login" href="${routes.page('cms.html')}">Login klien</a></div>${service==='custom'?consult():button('Lihat Paket','#service-pricing')}</nav></header>`;
}

function pageFooter(routes){
  return `<footer class="site-footer"><div class="container footer-inner"><a class="brand" href="${routes.home}" data-service-link aria-label="Beranda Rasio Labs"><img src="${routes.asset}rasiolabs-logo.png" width="144" height="48" alt="Rasio Labs"></a><nav aria-label="Navigasi footer"><a href="${routes.home}#layanan" data-service-link>Layanan</a><a href="${homeLink(routes,'profile','template')}" data-service-link>Template</a><a href="${routes.home}#rasio-ai" data-service-link>Rasio AI</a><a href="${routes.page('cms.html')}">Login klien</a><a href="${routes.policy('policies.html')}">Kebijakan</a><a href="${routes.policy('terms.html')}">Ketentuan layanan</a></nav><small>© 2026 Rasio Labs</small></div></footer>`;
}

function browser(asset,extra=''){
  return `<div class="sp-browser ${extra}"><div class="preview-chrome" aria-hidden="true"><span></span><span></span><span></span><em>Padel Club</em></div><img src="${asset}template-padel-preview.jpg" width="960" height="600" alt="Tampilan website Padel Club dengan lapangan, program bermain, dan informasi klub" decoding="async"></div>`;
}

function productVisual(service,asset){
  if(service==='profile')return `<div class="sp-profile-visual">${browser(asset,'sp-browser--main')}<ul class="sp-profile-badges"><li>${icon('hosting')}<span>Hosting & SSL</span></li><li>${icon('edit')}<span>CMS</span></li><li>${icon('check')}<span>Revisi minor</span></li></ul></div>`;
  if(service==='store')return `<div class="sp-store-visual" aria-label="Ilustrasi susunan produk dan keranjang toko"><div class="sp-store-browser"><div class="preview-chrome" aria-hidden="true"><span></span><span></span><span></span><em>Toko Anda</em></div><div class="sp-store-heading"><strong>Koleksi perawatan</strong>${detailIcon('store')}</div><div class="sp-store-products">${[['cleanser','Pembersih wajah'],['serum','Serum'],['cream','Pelembap']].map(([file,label])=>`<div class="sp-store-product"><img src="${asset}store-${file}-v24.png" width="160" height="160" alt="${label}" loading="lazy"><strong>${label}</strong></div>`).join('')}</div><div class="sp-store-cart">${detailIcon('store')}<div><strong>Keranjang belanja</strong><small>Produk · Jumlah · Total</small></div>${icon('arrow')}</div></div></div>`;
  return `<div class="sp-custom-visual" aria-label="Contoh hubungan kebutuhan, proses, dan laporan pada software custom"><p class="sp-flow-label">Alur kerja bisnis</p><div class="sp-flow-node"><span>${detailIcon('page')}</span><strong>Permintaan masuk</strong><small>Data pelanggan dan kebutuhan</small></div><span class="sp-flow-arrow" aria-hidden="true">↓</span><div class="sp-flow-node"><span>${detailIcon('workflow')}</span><strong>Proses & persetujuan</strong><small>Tahapan dan akses pengguna</small></div><span class="sp-flow-arrow" aria-hidden="true">↓</span><div class="sp-flow-node"><span>${detailIcon('integration')}</span><strong>Laporan & integrasi</strong><small>Sesuai lingkup proyek</small></div></div>`;
}

function featureGrid(service,content,asset){
  const features=content.features.map(([name,title,body])=>`<article class="sp-feature"><span class="sp-feature-icon">${detailIcon(name)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('');
  const storeFee=service==='store'?`<aside class="sp-store-fee"><div><strong>${storeScope.rasioTransactionFeePercent}%</strong><h3>Biaya transaksi dari Rasio Labs</h3></div><p>Rasio tidak memotong persentase penjualan Anda. Biaya payment gateway dan pihak ketiga dibayar terpisah.</p></aside><div class="sp-payment-methods"><div><h3>Pilihan pembayaran</h3><p>Metode mengikuti penyedia dan aktivasi toko.</p></div><ul aria-label="Contoh metode pembayaran">${[['payment-visa-v21.svg','Visa'],['payment-qris-v21.svg','QRIS'],['payment-mastercard-v21.svg','Mastercard'],['payment-bca-midtrans-v25.png','BCA'],['payment-bni-midtrans-v25.png','BNI'],['payment-bri-midtrans-v25.png','BRI'],['payment-mandiri-midtrans-v25.png','Mandiri'],['payment-shopeepay-midtrans-v25.png','ShopeePay']].map(([file,label])=>`<li><img src="${asset}${file}" width="112" height="42" alt="${label}" loading="lazy"></li>`).join('')}</ul></div>`:'';
  return `<section class="sp-section sp-section--ice" id="service-features" aria-labelledby="features-title"><div class="container"><div class="sp-section-heading"><h2 id="features-title">${content.featureTitle}</h2></div><div class="sp-feature-grid">${features}</div>${storeFee}<div class="sp-chatbot-strip">${detailIcon('contact')}<div><h3>AI Chatbot termasuk</h3><p>Membantu menjawab pertanyaan pengunjung berdasarkan informasi bisnis Anda${service==='custom'?' dan lingkup proyek yang disepakati':''}.</p></div></div></div></section>`;
}

function example(service,routes){
  if(service==='profile'){
    const template=templateCatalog.find(item=>item.id==='Padel');
    const href=routes.template(template.slug)+'?type=profile&template='+encodeURIComponent(template.id);
    return `<section class="sp-section sp-section--warm" id="service-example" aria-labelledby="example-title"><div class="container sp-example-grid"><div class="sp-example-visual">${browser(routes.asset)}</div><div class="sp-example-copy"><h2 id="example-title">Lihat halaman yang akan digunakan pengunjung.</h2><h3>${template.name}</h3><p>Informasi lapangan, program bermain, klub, dan lokasi tersusun dalam halaman yang dapat dijelajahi.</p><div class="actions">${button('Lihat Template',href,'primary','data-service-link')}${button('Pilih Template',homeLink(routes,'profile','template'),'secondary','data-service-link')}</div></div></div></section>`;
  }
  const custom=service==='custom';
  return `<section class="sp-section sp-section--warm" id="service-example" aria-labelledby="example-title"><div class="container sp-example-grid"><div class="sp-example-copy"><h2 id="example-title">${custom?'Contoh kebutuhan yang dapat dibahas.':'Alur pembelian yang mudah diikuti.'}</h2><p>${custom?'Permintaan pelanggan dapat melalui pemeriksaan, persetujuan, dan pencatatan hasil. Kebutuhan setiap tahap ditentukan sebelum pengembangan.':'Pelanggan melihat informasi produk, menambahkan pilihan ke keranjang, lalu memeriksa pesanan melalui checkout.'}</p><p class="fine-print">${custom?'Contoh ini menjelaskan jenis alur, bukan paket fitur yang otomatis disertakan.':'Pilihan pembayaran dan pengiriman diperiksa sesuai kebutuhan serta penyedia yang digunakan.'}</p>${consult()}</div><ol class="sp-example-flow">${(custom?['Permintaan pelanggan','Pemeriksaan data','Persetujuan','Laporan']:['Detail produk','Keranjang','Checkout','Pesanan']).map((item,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><strong>${item}</strong></li>`).join('')}</ol></div></section>`;
}

function pricing(service,content,routes){
  if(service==='custom')return `<section class="sp-section sp-pricing sp-section--ice" id="service-pricing" aria-labelledby="pricing-title"><div class="container sp-custom-pricing"><div><h2 id="pricing-title">Biaya mengikuti kebutuhan proyek.</h2><p>Penawaran merinci fitur, integrasi, hasil pekerjaan, serta biaya sesuai lingkup yang dibahas.</p>${consult()}</div><ol><li>Ceritakan kebutuhan utama.</li><li>Tentukan fitur dan batas pekerjaan.</li><li>Tinjau penawaran sebelum menyetujui proyek.</li></ol></div></section>`;
  return `<section class="sp-section sp-pricing" id="service-pricing" aria-labelledby="pricing-title"><div class="container"><div class="sp-section-heading"><h2 id="pricing-title">Paket dan Harga ${content.name}</h2><p>Harga per bulan untuk paket 12–48 bulan adalah ekuivalen. Total dibayar di muka untuk durasi yang dipilih.</p></div><div class="sp-plan-grid">${[1,12,24,48].map(months=>{
    const plan=getPlan(service,months);
    const href=service==='profile'?homeLink(routes,service,'template',months):routes.policy('checkout-v4.html')+`?type=store&duration=${months}`;
    return `<article class="sp-plan${months===24?' sp-plan--popular':months===48?' sp-plan--best':''}" data-service-plan="${months}"><div class="sp-plan-badge-slot">${plan.badge?`<span class="sp-plan-badge">${plan.badge}</span>`:''}</div><h3>${months} bulan</h3><p class="sp-plan-price"><strong>${rupiah(plan.monthlyEquivalent)}</strong><span>/bulan</span></p><p class="sp-plan-total">Total ${rupiah(plan.totalPrice)}<br>untuk ${months} bulan</p><p class="sp-plan-domain">${plan.freeDomainFirstYear?'Domain gratis tahun pertama':'Domain dibayar terpisah'}</p><div class="actions">${button(service==='profile'?'Pilih Paket':'Lihat Paket',href,'primary',`data-service-plan="${months}" data-service-link="${service}"`)}</div></article>`;
  }).join('')}</div><p class="sp-pricing-note">Hosting, SSL, 1 email bisnis, CMS, AI Chatbot, dan revisi minor termasuk sesuai cakupan layanan. Domain gratis tahun pertama untuk paket minimal 12 bulan; perpanjangan domain tahun berikutnya dibayar pelanggan.</p></div></section>`;
}

function renderServicePage(service,routes){
  const content=serviceDetails[service];
  const custom=service==='custom';
  const plan=custom?null:getPlan(service,48);
  const actions=custom?consult():catalogueButton(routes,service)+button('Lihat Paket','#service-pricing','secondary');
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${content.name} | Rasio Labs</title><meta name="description" content="${esc(content.description)}"><link rel="preload" href="${routes.asset}fonts/dm-sans-0.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="marketing/tokens.css"><link rel="stylesheet" href="marketing/components.css"><link rel="stylesheet" href="marketing/homepage.css"><link rel="stylesheet" href="marketing/products.css"><link rel="stylesheet" href="marketing/services.css"><script type="module" src="marketing/service-page.js"></script></head><body class="service-page" data-service="${service}">
${pageHeader(routes,service)}<main id="main" tabindex="-1">
<section class="sp-hero" id="service-hero" aria-labelledby="service-title"><div class="container sp-hero-grid"><div class="sp-hero-copy"><p class="sp-kicker">${content.name}</p><h1 id="service-title">${content.title}</h1><p class="sp-description">${content.description}</p><p class="sp-fit">${content.fit}</p><div class="actions">${actions}</div>${service==='store'?'<p class="sp-catalogue-note" id="service-store-catalogue-note">Belum ada template Store yang dapat dipilih.</p>'+consult('Konsultasikan Kebutuhan','secondary'):''}${plan?`<div class="sp-hero-price"><span>Mulai dari</span><p><strong>${rupiah(plan.monthlyEquivalent)}</strong><span>/bulan</span></p><small>Untuk 48 bulan · total ${rupiah(plan.totalPrice)}</small></div>`:''}</div><div class="sp-hero-visual">${productVisual(service,routes.asset)}</div></div></section>
<section class="sp-section" id="service-why" aria-labelledby="why-title"><div class="container"><div class="sp-section-heading"><h2 id="why-title">${content.whyTitle}</h2></div><div class="sp-reasons">${content.why.map(([name,title,body])=>`<article>${detailIcon(name)}<h3>${title}</h3><p>${body}</p></article>`).join('')}</div></div></section>
${featureGrid(service,content,routes.asset)}
<section class="sp-section" id="service-sectors" aria-labelledby="sectors-title"><div class="container"><div class="sp-section-heading"><h2 id="sectors-title">Contoh penggunaan menurut bidang bisnis</h2><p>Penerapan disesuaikan dengan kebutuhan${custom?' dan lingkup proyek':'; daftar ini bukan daftar template yang tersedia'}.</p></div><div class="sp-sector-grid">${content.sectors.map(([name,title,body])=>`<article class="sp-sector"><span>${detailIcon(name)}</span><h3>${title}</h3><p>${body}</p></article>`).join('')}</div></div></section>
${example(service,routes)}
${service==='profile'?'':`<section class="sp-section sp-section--navy" id="service-scope" aria-labelledby="scope-title"><div class="container"><div class="sp-section-heading"><h2 id="scope-title">Penyesuaian dan batas layanan</h2></div><div class="sp-scope-grid">${content.scope.map(([title,body])=>`<article><h3>${title}</h3><p>${body}</p></article>`).join('')}</div></div></section>`}
<section class="sp-section sp-section--ice" id="service-order" aria-labelledby="order-title"><div class="container"><div class="sp-section-heading"><h2 id="order-title">${custom?'Cara Memulai Proyek Custom':'Cara Memesan '+content.name}</h2></div><ol class="sp-steps">${content.steps.map(([name,title,body],index)=>`<li><span class="sp-step-number">${String(index+1).padStart(2,'0')}</span>${detailIcon(name)}<h3>${title}</h3><p>${body}</p></li>`).join('')}</ol></div></section>
${pricing(service,content,routes)}
<section class="sp-section sp-faq" id="service-faq" aria-labelledby="faq-title"><div class="container faq-layout"><h2 id="faq-title">Pertanyaan tentang ${content.name}</h2><div class="faq-list">${content.faqs.map(([question,answer])=>`<details><summary>${question}<span aria-hidden="true">+</span></summary><p>${answer}</p></details>`).join('')}<details><summary>Bagaimana perpanjangan dan pembatalannya?<span aria-hidden="true">+</span></summary><p>Harga perpanjangan, cara berhenti, serta ketentuan pengembalian dana dijelaskan sebelum Anda menyetujui pesanan.</p></details></div></div></section>
<section class="sp-final" id="service-start" aria-labelledby="start-title"><div class="container"><h2 id="start-title">${custom?'Bahas kebutuhan website atau software Anda.':service==='store'?'Diskusikan kebutuhan toko Anda.':'Pilih template untuk website bisnis Anda.'}</h2>${custom||service==='store'?consult():button('Lihat Template',homeLink(routes,'profile','template'),'light','data-service-link')}</div></section>
</main>${pageFooter(routes)}</body></html>`;
}

export function renderServicePages(routes){
  return serviceOrder.map(service=>[serviceDetails[service].file,renderServicePage(service,routes)]);
}
