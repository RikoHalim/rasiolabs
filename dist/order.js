(() => {
  const shell = document.querySelector('[data-order-shell]');
  if (!shell) return;
  const params = new URLSearchParams(location.search);
  const catalog = {
    Architecture: {type:'profile', title:'Architecture Studio — Designed for Better Living', description:'Arsitektur & Interior', art:'<img src="/assets/architecture-exterior.jpg" alt="Preview Architecture Studio" /><img class="order-architecture-logo" src="/assets/rasio-logo.png" alt="Rasio Agency" />'},
  };
  const service = params.get('type');
  const names = {store:'Rasio Store', profile:'Rasio Profile', custom:'Rasio Custom'};
  if (!Object.hasOwn(names, service)) {
    shell.hidden = true;
    document.querySelector('[data-order-empty]').hidden = false;
    return;
  }
  document.body.classList.add(`order-service-${service}`);
  if (service !== 'custom' && !Object.values(catalog).some(item => item.type === service)) {
    shell.hidden = true;
    document.querySelector('.order-progress-bar').hidden = true;
    const empty = document.querySelector('[data-order-empty]');
    empty.hidden = false;
    empty.querySelector('h1').textContent = 'Template toko online belum tersedia.';
    empty.querySelector('p').textContent = 'Belum ada template Rasio Store yang dapat dipilih saat ini. Hubungi Rasio untuk membahas kebutuhan toko online Anda.';
    const contact = empty.querySelector('a');
    contact.href = 'https://wa.me/60142317052?text=' + encodeURIComponent('Halo Rasio, saya ingin konsultasi tentang toko online.');
    contact.textContent = 'Konsultasi toko online ↗';
    contact.target = '_blank'; contact.rel = 'noopener';
    return;
  }
  const requestedTemplate = params.get('template');
  let template = Object.hasOwn(catalog, requestedTemplate) && catalog[requestedTemplate].type === service ? requestedTemplate : '';
  const requestedDomain = RasioDomain.normalize(params.get('domain') || '');
  const initialDomain = !RasioDomain.error(requestedDomain) ? requestedDomain : '';
  let domain = '';
  let steps = service === 'custom' || template ? ['domain','business','review'] : ['domain','template','business','review'];
  if (service === 'store') steps.splice(steps.indexOf('business'),0,'addons');
  let current = 'domain';
  const aiAddon = document.querySelector('[data-ai-addon]');
  const durationSelect = document.querySelector('[data-duration-select]');
  const requestedDuration = Number(params.get('duration'));
  if ([1, 12, 24, 48].includes(requestedDuration)) durationSelect.value = String(requestedDuration);
  const titles = {addons:['Rasio AI','Tambahkan insight toko'],domain:['Domain','Tentukan alamat website'],template:['Template','Pilih desain website'],business:['Data bisnis','Lengkapi kontak Anda'],review:['Review','Periksa pilihan Anda']};
  const input = document.querySelector('#order-domain');
  const form = document.querySelector('[data-order-domain-form]');
  const results = document.querySelector('[data-domain-results]');
  const errorNode = document.querySelector('[data-order-domain-status]');
  const next = document.querySelector('[data-next]');
  const summaryContinue = document.querySelector('[data-summary-continue]');
  const previous = document.querySelector('[data-previous]');
  const businessForm = document.querySelector('[data-business-form]');
  const consent = document.querySelector('[data-review-consent]');
  const checkoutNote = document.querySelector('[data-checkout-note]');
  const customWhatsApp = document.querySelector('[data-custom-whatsapp]');
  const couponToggle = document.querySelector('[data-coupon-toggle]');
  const couponForm = document.querySelector('[data-coupon-form]');
  couponToggle.addEventListener('click', () => {
    const open = couponForm.hidden;
    couponForm.hidden = !open;
    couponToggle.setAttribute('aria-expanded', String(open));
    couponToggle.querySelector('span').textContent = open ? '−' : '＋';
    if (open) couponForm.querySelector('input').focus();
  });
  couponForm.addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('[data-coupon-message]').textContent = 'Belum ada kupon aktif saat ini. Harga promo sesuai durasi tetap berlaku.';
  });

  const management = service === 'profile' ? 'CMS sederhana untuk teks, gambar, dan logo' : service === 'store' ? 'Dashboard toko untuk produk dan pesanan' : 'Disepakati sesuai cakupan proyek';
  document.querySelector('[data-business-intro]').textContent = service === 'profile' ? 'Tim Rasio menghubungi Anda dalam 1 × 24 jam setelah pembayaran untuk membantu setup awal dan akses CMS.' : service === 'store' ? 'Tim Rasio menghubungi Anda dalam 1 × 24 jam setelah pembayaran. Kami membantu unggah 50 produk pertama; selanjutnya Anda dapat mengunggah produk tanpa batas melalui dashboard.' : 'Ceritakan kebutuhan Anda agar tim Rasio dapat menyusun cakupan dan penawaran.';
  document.querySelector('[data-management-note]').textContent = service === 'profile' ? 'Tim Rasio menyiapkan desain dan menangani maintenance. Anda dapat memperbarui teks, gambar, dan logo melalui CMS sederhana tanpa mengubah tata letak template.' : service === 'store' ? 'Tim Rasio menyiapkan desain, mengunggah 50 produk pertama, dan menangani maintenance. Anda dapat menambah produk tanpa batas serta mengelola stok dan pesanan melalui dashboard toko.' : 'Proyek custom dimulai setelah cakupan dan penawaran disepakati. Domain masuk dalam cakupan penawaran sesuai kebutuhan proyek.';
  document.querySelector('[data-review-management]').textContent = management;
  document.querySelector('[data-review-intro]').textContent = service === 'custom' ? 'Pilihan ini membantu konsultasi awal. Harga proyek ditentukan setelah pembahasan kebutuhan.' : 'Periksa pilihan Anda sebelum checkout. Pembayaran dan harga masih berupa simulasi pada prototipe ini.';
  document.querySelector('[data-custom-field]').hidden = service !== 'custom';
  document.querySelector('#project-brief').required = service === 'custom';
  document.querySelector('[data-template-summary]').hidden = service === 'custom';
  document.querySelector('[data-template-review]').hidden = service === 'custom';
  document.querySelector('[data-edit-template]').hidden = service === 'custom';
  document.querySelector('[data-addon-summary]').hidden = service !== 'store';
  document.querySelector('[data-addon-review]').hidden = service !== 'store';
  document.querySelector('[data-duration-field]').hidden = service === 'custom';
  document.querySelector('.coupon-box').hidden = service === 'custom';
  document.querySelector('.booking-help').hidden = service === 'custom';
  aiAddon.addEventListener('change', () => { resetReview(); sync(); });
  durationSelect.addEventListener('change', () => { resetReview(); sync(); });
  if (service === 'custom') {
    document.querySelector('[data-order-timing]').textContent = 'Jadwal pengerjaan website, ERP, dan software custom disepakati setelah konsultasi.';
    document.querySelector('[data-review-price]').textContent = 'Penawaran setelah konsultasi';
    document.querySelector('[data-consent-copy]').textContent = 'Saya telah memeriksa data bisnis dan domain untuk konsultasi.';
    document.querySelector('.summary-total span').textContent = 'Estimasi proyek';
    document.querySelector('.summary-total strong').textContent = 'Setelah konsultasi';
    document.querySelector('.summary-body > p').textContent = 'Rasio menyusun harga dan cakupan proyek setelah pembahasan kebutuhan.';
    document.querySelector('[data-mini-total]').textContent = 'Penawaran proyek';
    document.querySelector('[data-plan-monthly]').textContent = 'Sesuai penawaran';
    document.querySelector('[data-summary-package-price]').textContent = 'Setelah konsultasi';
    document.querySelector('.order-package-details > span').textContent = 'Fitur, domain, dan jadwal mengikuti penawaran proyek.';
  }
  function sync() {
    const duration = Number(durationSelect.value);
    const rupiah = amount => `Rp${amount.toLocaleString('id-ID')}`;
    const addonDuration = Math.max(12, duration);
    const addonTotal = service === 'store' && aiAddon.checked ? 500000 * addonDuration / 12 : 0;
    document.querySelectorAll('[data-summary-addon]').forEach(e => e.textContent = addonTotal ? `${rupiah(addonTotal)} untuk ${addonDuration} bulan` : 'Tidak ditambahkan');
    if (service === 'store' || service === 'profile') {
      const normalMonthly = service === 'store' ? 210000 : 109000;
      const discount = {1: 0, 12: .5, 24: .7, 48: .75}[duration];
      const monthly = Math.round(normalMonthly * (1 - discount));
      const packageTotal = monthly * duration;
      const normalTotal = normalMonthly * duration;
      document.querySelector('[data-review-price]').textContent = `${rupiah(packageTotal + addonTotal)} untuk ${duration} bulan, domain termasuk`;
      document.querySelector('.summary-total strong').textContent = rupiah(packageTotal + addonTotal);
      document.querySelector('[data-mini-total]').textContent = rupiah(packageTotal + addonTotal);
      document.querySelector('[data-summary-package-price]').textContent = rupiah(packageTotal);
      document.querySelector('[data-summary-normal-price]').textContent = rupiah(normalTotal);
      document.querySelector('[data-summary-normal-price]').hidden = !discount;
      document.querySelector('[data-plan-saving]').textContent = `Hemat ${rupiah(normalTotal - packageTotal)}`;
      document.querySelector('[data-plan-saving]').hidden = !discount;
      document.querySelector('[data-plan-monthly]').innerHTML = `${rupiah(monthly)} <small>/bulan</small>`;
      document.querySelector('[data-plan-normal]').textContent = `${rupiah(normalMonthly)}/bulan`;
      document.querySelector('[data-plan-normal]').hidden = !discount;
      document.querySelector('[data-summary-duration]').textContent = `Paket website · ${duration} bulan`;
      document.querySelector('[data-summary-total-label]').textContent = `Total ${duration} bulan`;
      document.querySelector('[data-summary-ai-duration]').textContent = `Rasio AI Insight · ${addonDuration} bulan`;
      document.querySelector('[data-summary-ai-price]').textContent = rupiah(addonTotal);
      document.querySelector('[data-summary-terms]').textContent = `${discount ? `Diskon ${Math.round(discount * 100)}%` : 'Harga normal'} berlaku untuk pembayaran ${duration} bulan di muka. Perpanjangan mengikuti harga yang berlaku saat jatuh tempo.${duration === 1 && addonTotal ? ' Add-on Rasio AI Insight ditagih untuk 12 bulan.' : ''}`;
      document.querySelector('[data-summary-ai-line]').hidden = addonTotal === 0;
    }
    document.querySelectorAll('[data-summary-package]').forEach(e => e.textContent = names[service]);
    document.querySelectorAll('[data-summary-template]').forEach(e => e.textContent = catalog[template]?.title || 'Belum dipilih');
    document.querySelectorAll('[data-summary-domain]').forEach(e => e.textContent = domain || 'Belum dipilih');
    document.querySelector('[data-edit-template]').textContent = template ? 'Ubah template' : 'Pilih template';
  }
  function drawSteps() {
    const nav = document.querySelector('[data-order-steps]');
    nav.replaceChildren();
    steps.forEach((step,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `order-step${step === current ? ' is-active' : ''}${index < steps.indexOf(current) ? ' is-complete' : ''}`;
      button.innerHTML = `<span>${String(index+1).padStart(2,'0')}</span><span><b>${titles[step][0]}</b><small>${titles[step][1]}</small></span>`;
      if (step === current) button.setAttribute('aria-current','step');
      button.disabled = index > steps.indexOf(current);
      button.addEventListener('click', () => { if (index <= steps.indexOf(current)) setStep(step); });
      nav.append(button);
    });
  }
  function setStep(step) {
    current = step;
    const index = steps.indexOf(step);
    document.querySelectorAll('[data-step-panel]').forEach(panel => {
      panel.hidden = panel.dataset.stepPanel !== step;
      panel.classList.toggle('is-active', !panel.hidden);
    });
    previous.disabled = index === 0;
    next.textContent = step === 'review' ? service === 'custom' ? 'Siapkan konsultasi →' : 'Tinjau simulasi →' : 'Selanjutnya →';
    next.disabled = step === 'review' && !consent.checked;
    summaryContinue.textContent = step === 'review' ? service === 'custom' ? 'Siapkan konsultasi →' : 'Tinjau simulasi →' : 'Lanjutkan langkah →';
    summaryContinue.disabled = next.disabled;
    document.querySelector('[data-step-label]').textContent = `Langkah ${String(index+1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')}`;
    document.querySelector('[data-progress-bar]').style.width = `${(index+1)/steps.length*100}%`;
    drawSteps(); sync();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function resetReview() { consent.checked = false; checkoutNote.textContent = ''; customWhatsApp.hidden = true; }
  function searchError(value) {
    if (value.includes('.')) return RasioDomain.error(value);
    if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(value)) return 'Masukkan nama bisnis tanpa spasi, misalnya namabisnis.';
    return '';
  }
  function searchDomain(preferred = '') {
    const query = RasioDomain.normalize(input.value);
    const error = searchError(query);
    input.setAttribute('aria-invalid',String(Boolean(error)));
    errorNode.hidden = !error;
    errorNode.textContent = error;
    if (error) { input.focus(); return false; }
    const name = query.split('.')[0];
    input.value = name;
    domain = ''; resetReview(); sync();
    const requested = query.includes('.') ? query : preferred;
    const choices = [...new Set([...(requested ? [requested] : []),`${name}.com`,`${name}.id`,`${name}.co.id`])];
    results.hidden = false;
    results.innerHTML = '<p class="domain-results-note">Domain termasuk dalam paket. Nama dan ketersediaan di sini masih berupa simulasi.</p>' + choices.map(choice => `<button class="domain-result" type="button" data-domain-choice="${choice}" aria-pressed="false"><span><b>${choice}</b><small>${choice === requested ? 'Domain yang Anda cari' : 'Pilihan ekstensi'}</small></span><span><small>Dalam paket</small><strong>Termasuk</strong></span><i aria-hidden="true">Pilih →</i></button>`).join('');
    results.querySelectorAll('[data-domain-choice]').forEach(button => button.addEventListener('click', () => {
      domain = button.dataset.domainChoice;
      errorNode.hidden = true; resetReview(); sync();
      results.querySelectorAll('[data-domain-choice]').forEach(e => { e.classList.toggle('is-selected', e === button); e.setAttribute('aria-pressed',String(e === button)); });
    }));
    return true;
  }
  form.addEventListener('submit', event => { event.preventDefault(); searchDomain(); });
  input.addEventListener('input', () => { domain = ''; results.hidden = true; errorNode.hidden = true; input.removeAttribute('aria-invalid'); resetReview(); sync(); });
  businessForm.addEventListener('input', resetReview);
  businessForm.addEventListener('submit', event => { event.preventDefault(); next.click(); });
  const options = document.querySelector('[data-template-options]');
  Object.entries(catalog).filter(([,item]) => item.type === service).forEach(([name,item]) => {
    const button = document.createElement('button');
    button.className = 'order-template-card'; button.type = 'button'; button.dataset.templateChoice = name;
    button.setAttribute('aria-pressed',String(template === name));
    button.innerHTML = `<span class="order-template-art ${name.toLowerCase()}">${item.art}</span><strong>${item.title}</strong><small>${item.description}</small><span>${template === name ? 'Template dipilih' : 'Pilih template'}</span>`;
    button.addEventListener('click', () => {
      template = name; resetReview(); sync();
      document.querySelector('[data-template-error]').hidden = true;
      options.querySelectorAll('button').forEach(e => { e.setAttribute('aria-pressed',String(e === button)); e.lastElementChild.textContent = e === button ? 'Template dipilih' : 'Pilih template'; });
    });
    options.append(button);
  });
  document.querySelector('[data-edit-template]').addEventListener('click', () => {
    if (!domain) {
      errorNode.hidden = false; errorNode.textContent = 'Pilih domain terlebih dahulu, lalu lanjutkan ke pilihan template.'; input.focus(); return;
    }
    if (!steps.includes('template')) steps.splice(1,0,'template');
    setStep('template');
  });
  next.addEventListener('click', () => {
    if (current === 'domain' && !domain) {
      if (results.hidden && !searchDomain()) return;
      errorNode.hidden = false; errorNode.textContent = 'Pilih salah satu domain di atas untuk melanjutkan.';
      results.querySelector('button')?.focus(); return;
    }
    if (current === 'template' && !template) { document.querySelector('[data-template-error]').hidden = false; options.querySelector('button')?.focus(); return; }
    if (current === 'business' && !businessForm.reportValidity()) return;
    if (current === 'review') {
      if (!consent.checked) return;
      if (service === 'custom') {
        const brief = `Halo Rasio, saya ingin konsultasi Rasio Custom.\nBisnis: ${document.querySelector('#business-name').value}\nDomain pilihan: ${domain}\nKebutuhan: ${document.querySelector('#project-brief').value}`;
        customWhatsApp.href = 'https://wa.me/60142317052?text=' + encodeURIComponent(brief);
        customWhatsApp.hidden = false;
        checkoutNote.textContent = 'Ringkasan siap dibuka di WhatsApp. Anda dapat meninjau pesan sebelum mengirimkannya.';
      } else checkoutNote.textContent = 'Simulasi selesai. Pembayaran asli belum diaktifkan; tidak ada tagihan atau data yang dikirim.';
      return;
    }
    setStep(steps[steps.indexOf(current)+1]);
  });
  summaryContinue.addEventListener('click', () => next.click());
  previous.addEventListener('click', () => setStep(steps[steps.indexOf(current)-1]));
  consent.addEventListener('change', () => { next.disabled = !consent.checked; summaryContinue.disabled = next.disabled; });
  document.querySelector('[data-summary-toggle]').addEventListener('click', event => {
    const button = event.currentTarget;
    const open = button.closest('.order-summary').classList.toggle('is-open');
    button.setAttribute('aria-expanded',String(open));
    button.firstChild.textContent = open ? 'Tutup rincian ' : 'Lihat rincian ';
    button.querySelector('span').textContent = open ? '−' : '+';
  });
  if (initialDomain) { input.value = initialDomain.split('.')[0]; searchDomain(initialDomain); }
  sync(); setStep('domain');
})();
