import {templates, essentials, steps, faqs, profilePlans} from './content.mjs';
import {button, preview, icon, templateCard, rupiah} from './components.mjs';
import {renderServices,renderAi,renderPricing} from './sections.mjs';

export const sectionOrder=['hero','included','why-rasio','layanan','template','cara-kerja','rasio-ai','harga','transparansi','faq','mulai'];

export function renderHomepage(routes){
  const asset=routes.asset, plan=profilePlans.find(p=>p.months===48);
  return `<!doctype html>
<html lang="id"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Website profesional untuk bisnis Anda, tanpa harus membuatnya sendiri. Rasio menyiapkan website dari template pilihan Anda, lengkap dengan hosting, CMS, dan bantuan revisi.">
<title>Rasio Labs | Website bisnis, dikelola untuk Anda</title>
<link rel="preload" href="${asset}fonts/dm-sans-0.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="marketing/tokens.css"><link rel="stylesheet" href="marketing/components.css"><link rel="stylesheet" href="marketing/homepage.css"><link rel="stylesheet" href="marketing/products.css">
<script type="module" src="marketing/homepage.js"></script>
</head><body>
<a class="skip-link" href="#main">Lewati ke konten</a>
<header class="site-header" data-header><nav class="navigation container" aria-label="Navigasi utama">
<a class="brand" href="#main" aria-label="Rasio Labs, beranda"><img src="${asset}rasiolabs-logo.png" width="144" height="48" alt="Rasio Labs"></a>
<button class="menu-toggle" aria-label="Buka menu" aria-expanded="false" aria-controls="nav-links" hidden>${icon('menu')}</button>
<div class="nav-links" id="nav-links"><a href="#layanan">Layanan</a><a href="#template">Template</a><a href="#cara-kerja">Cara kerja</a><a href="#harga">Harga</a><a href="#rasio-ai">Rasio AI</a><a class="nav-login" href="${routes.page('cms.html')}">Login klien</a></div>
${button('Lihat Template','#template')}
</nav></header>
<main id="main" tabindex="-1">
<section class="hero" id="hero" aria-labelledby="hero-title"><div class="hero-layout container">
  <div class="hero-copy"><h1 id="hero-title">Website profesional untuk bisnis Anda,<br><span>tanpa harus membuatnya sendiri.</span></h1>
  <p class="hero-description">Pilih template yang sesuai, kirimkan informasi bisnis Anda, lalu tim Rasio menyiapkan websitenya hingga siap digunakan.</p>
  <div class="actions">${button('Lihat Template','#template')}${button('Lihat Harga','#harga','secondary')}</div>
  <div class="hero-price"><span>Mulai dari</span><p><strong>${rupiah(plan.monthlyEquivalent)}</strong><span>/bulan</span></p><small>Untuk berlangganan 48 bulan · total ${rupiah(plan.totalPrice)}</small></div></div>
  <div class="hero-visual" data-hero-visual aria-label="Contoh tampilan website dari koleksi Rasio Labs"><div class="hero-outline" aria-hidden="true"></div><div class="product-stack" data-product-stack>${preview(asset,'architecture','Architecture Studio','stack-back')}${preview(asset,'creative','Creative Studio','stack-middle')}${preview(asset,'padel','Padel Club','stack-front')}</div></div>
</div></section>

<section class="essentials" id="included" aria-labelledby="included-title"><div class="container"><h2 class="visually-hidden" id="included-title">Sudah termasuk dalam layanan</h2><ul class="essentials-list">${essentials.map(([name,title,sub])=>`<li>${icon(name)}<div><strong>${title}</strong><span>${sub}</span></div></li>`).join('')}</ul></div></section>

<section class="section why-section" id="why-rasio" aria-labelledby="why-title"><div class="container why-layout">
  <div class="why-copy"><h2 id="why-title">Website Anda disiapkan dan dikelola oleh tim Rasio.</h2><p>Anda tidak perlu membuat website sendiri, mengatur hosting, atau melakukan setup teknis. Tim kami menyiapkannya dari template yang Anda pilih.</p></div>
  <div class="responsibility-panel" data-reveal><div class="responsibility-row"><span class="role-label">${icon('hosting')}</span><div><h3>Setup sudah termasuk</h3><p>Website, hosting, SSL, dan email bisnis disiapkan dalam layanan berlangganan.</p></div></div><div class="responsibility-row responsibility-row--rasio"><span class="role-label">${icon('edit')}</span><div><h3>Konten bisa diperbarui</h3><p>Edit konten yang didukung melalui CMS, atau ajukan revisi minor kepada tim Rasio.</p></div></div></div>
</div></section>

${renderServices(routes)}

<section class="section templates-section" id="template" aria-labelledby="templates-title"><div class="container">
  <div class="section-heading"><h2 id="templates-title">Pilih Template Website</h2></div>
  <form class="catalogue-tools" role="search" data-template-filter hidden><label class="search-field"><span class="visually-hidden">Cari template</span>${icon('search')}<input type="search" name="q" placeholder="Cari nama atau sektor" autocomplete="off"><button type="button" class="clear-search" aria-label="Hapus pencarian" hidden>${icon('close')}</button></label><label class="sector-field"><span>Sektor</span><select name="sector" aria-label="Sektor"><option value="">Semua sektor</option>${[...new Set(templates.map(t=>t.sector))].map(sector=>`<option>${sector}</option>`).join('')}</select></label><span class="catalogue-count" role="status" data-template-count>${templates.length} template</span></form>
  <div class="template-grid${templates.length===1?' template-grid--single':''}" id="template-grid">${templates.map(t=>templateCard(t,routes)).join('')}</div>
  <div class="catalogue-more"><button class="button button--secondary" type="button" data-load-templates aria-controls="template-grid" hidden>Muat lebih banyak</button></div>
  <div class="empty-state" data-template-empty hidden><h3>Template belum ditemukan.</h3><p>Coba nama lain atau tampilkan semua sektor.</p><button class="button button--secondary" type="button" data-reset-filter>Tampilkan semua template</button></div>
</div></section>

<section class="section process-section" id="cara-kerja" aria-labelledby="process-title"><div class="container"><div class="section-heading center"><h2 id="process-title">Cara Memesan Website di Rasio</h2></div><ol class="process-steps" data-process>${steps.map((s,i)=>`<li><span class="step-marker">${i+1}</span><h3>${s.title}</h3><p>${s.body}</p></li>`).join('')}</ol></div></section>

${renderAi()}
${renderPricing(routes)}

<section class="section trust-section" id="transparansi" aria-labelledby="trust-title"><div class="container"><div class="section-heading"><h2 id="trust-title">Yang Perlu Anda Ketahui</h2></div><div class="trust-points">
<article><span>${icon('domain')}</span><h3>Domain gratis satu tahun</h3><p>Berlaku pada paket minimal 12 bulan. Perpanjangan domain tahun berikutnya dibayar pelanggan.</p></article>
<article><span>${icon('edit')}</span><h3>Revisi minor tanpa batas</h3><p>Untuk perubahan konten pada struktur yang sudah ada. Halaman, layout, atau fitur baru dibahas terpisah.</p></article>
<article><span>${icon('shield')}</span><h3>Konten tetap milik Anda</h3><p>Langganan memberi hak penggunaan template dan teknologi Rasio selama layanan aktif, sesuai ketentuan layanan.</p></article>
</div></div></section>

<section class="section faq-section" id="faq" aria-labelledby="faq-title"><div class="container faq-layout"><div class="faq-heading"><h2 id="faq-title">Pertanyaan yang Sering Diajukan</h2></div><div class="faq-list">${faqs.map(([q,a])=>`<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`).join('')}</div></div></section>

<section class="final-cta" id="mulai" aria-labelledby="final-title"><div class="container final-cta-inner"><h2 id="final-title">Mulai dengan Memilih <br>Template Website</h2>${button('Lihat Template','#template','light')}</div></section>
</main>
<footer class="site-footer"><div class="container footer-inner"><a href="#main" class="brand" aria-label="Kembali ke beranda Rasio Labs"><img src="${asset}rasiolabs-logo.png" width="144" height="48" alt="Rasio Labs"></a><nav aria-label="Navigasi footer"><a href="#layanan">Layanan</a><a href="#template">Template</a><a href="#rasio-ai">Rasio AI</a><a href="${routes.page('cms.html')}">Login klien</a><a href="${routes.policy('policies.html')}">Kebijakan</a></nav><small>© 2026 Rasio Labs</small></div></footer>
</body></html>`;
}
