(() => {
  const shell = document.querySelector('[data-order-shell]');
  if (!shell) return;
  const params = new URLSearchParams(location.search);
  const catalog = {
    Architecture: {type:'profile', title:'Architecture Studio — Designed for Better Living', description:'Arsitektur & Interior', art:'<img src="/assets/template-architecture-preview.jpg?v=labs54" alt="Architecture Studio — Designed for Better Living" />'},
    Padel: {type:'profile', title:'Padel Club — More Than a Match', description:'Olahraga & Rekreasi', art:'<img src="/assets/template-padel-preview.jpg?v=labs54" alt="Padel Club — More Than a Match" />'},
    Creative: {type:'profile', title:'Creative Studio — Ideas Made Visible', description:'Studio Kreatif & Branding', art:'<img src="/assets/template-creative-preview.jpg?v=labs54" alt="Creative Studio — Ideas Made Visible" />'},
    Consulting: {type:'profile', title:'Business Consulting — Clarity for What’s Next', description:'Konsultan & Jasa Profesional', art:'<img src="/assets/template-consulting-preview.jpg?v=labs54" alt="Business Consulting — Clarity for What’s Next" />'},
  };
  const service = params.get('type');
  const names = {store:'RasioLabs Store', profile:'RasioLabs Profile', custom:'RasioLabs Custom'};
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
    empty.querySelector('p').textContent = 'Belum ada template RasioLabs Store yang dapat dipilih saat ini. Hubungi Rasio Labs untuk membahas kebutuhan toko online Anda.';
    const contact = empty.querySelector('a');
    contact.href = 'https://wa.me/60142317052?text=' + encodeURIComponent('Halo Rasio Labs, saya ingin konsultasi tentang toko online.');
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
  const durationOffer = document.querySelector('[data-duration-offer]');
  const rupiah = amount => `Rp${amount.toLocaleString('id-ID')}`;
  let domainPrices = {};
  const feeFor = choice => Number(durationSelect.value) === 1 ? domainPrices[choice.slice(choice.indexOf('.') + 1)] ?? null : 0;
  const requestedDuration = Number(params.get('duration'));
  if ([1, 12, 24, 48].includes(requestedDuration)) durationSelect.value = String(requestedDuration);
  const titles = {addons:['RasioLabs AI','Tambahkan insight toko'],domain:['Domain','Tentukan alamat website'],template:['Template','Pilih desain website'],business:['Data bisnis','Lengkapi kontak Anda'],review:['Review','Periksa pilihan Anda']};
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
  let submitting = false;
  let requestIdentity = null;
  const requestStorageKey = 'rasio-profile-order-request';
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
  document.querySelector('[data-business-intro]').textContent = service === 'profile' ? 'Tim Rasio Labs menghubungi Anda dalam 1 × 24 jam setelah pembayaran untuk membantu setup awal dan akses CMS.' : service === 'store' ? 'Tim Rasio Labs menghubungi Anda dalam 1 × 24 jam setelah pembayaran. Kami membantu unggah 50 produk pertama; selanjutnya Anda dapat mengunggah produk tanpa batas melalui dashboard.' : 'Ceritakan kebutuhan Anda agar tim Rasio Labs dapat menyusun cakupan dan penawaran.';
  document.querySelector('[data-management-note]').textContent = service === 'profile' ? 'Tim Rasio Labs menyiapkan desain dan menangani maintenance. Anda dapat memperbarui teks, gambar, dan logo melalui CMS sederhana tanpa mengubah tata letak template.' : service === 'store' ? 'Tim Rasio Labs menyiapkan desain, mengunggah 50 produk pertama, dan menangani maintenance. Anda dapat menambah produk tanpa batas serta mengelola stok dan pesanan melalui dashboard toko.' : 'Proyek custom dimulai setelah cakupan dan penawaran disepakati. Domain masuk dalam cakupan penawaran sesuai kebutuhan proyek.';
  document.querySelector('[data-review-management]').textContent = management;
  document.querySelector('[data-review-intro]').textContent = service === 'custom' ? 'Pilihan ini membantu konsultasi awal. Harga proyek ditentukan setelah pembahasan kebutuhan.' : 'Periksa pilihan Anda sebelum membuat pesanan. Pembayaran dikonfirmasi oleh tim Rasio Labs.';
  if (service === 'profile') {
    document.querySelector('[data-order-domain-intro]').textContent = 'Pilih nama domain untuk website Anda. Tim Rasio Labs memastikan ketersediaannya sebelum pembayaran.';
    form.querySelector('button').textContent = 'Lihat pilihan domain →';
    document.querySelector('#customer-email').required = true;
  }
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
  document.querySelector('[data-claim-offer]').addEventListener('click', () => {
    durationSelect.value = '48';
    durationSelect.dispatchEvent(new Event('change'));
    durationSelect.focus({preventScroll:true});
  });
  if (service === 'custom') {
    document.querySelector('.summary-disclaimer').hidden = true;
    document.querySelector('[data-order-timing]').textContent = 'Jadwal pengerjaan website, ERP, dan software custom disepakati setelah konsultasi.';
    document.querySelector('[data-review-price]').textContent = 'Penawaran setelah konsultasi';
    document.querySelector('[data-consent-copy]').textContent = 'Saya telah memeriksa data bisnis dan domain untuk konsultasi.';
    document.querySelector('.summary-total span').textContent = 'Estimasi proyek';
    document.querySelector('.summary-total strong').textContent = 'Setelah konsultasi';
    document.querySelector('[data-summary-terms]').textContent = '1 email bisnis gratis. Harga proyek dan domain mengikuti penawaran.';
    document.querySelector('[data-mini-total]').textContent = 'Penawaran proyek';
    document.querySelector('[data-plan-monthly]').textContent = 'Sesuai penawaran';
    document.querySelector('[data-summary-package-price]').textContent = 'Setelah konsultasi';
    document.querySelector('.order-package-details > span').textContent = 'Fitur, domain, dan jadwal mengikuti penawaran proyek.';
    document.querySelector('[data-order-domain-intro]').textContent = 'Ketik nama bisnis dan pilih ekstensi sebagai bahan konsultasi. Domain mengikuti penawaran; 1 email bisnis gratis.';
    document.querySelector('[data-summary-domain-included]').textContent = 'Sesuai penawaran';
    document.querySelector('[data-summary-email-included]').textContent = 'Gratis selama langganan';
    document.querySelector('[data-summary-duration]').textContent = 'Pengembangan custom';
    document.querySelector('[data-summary-normal-price]').hidden = true;
    document.querySelector('[data-plan-saving]').hidden = true;
    document.querySelector('[data-plan-normal]').hidden = true;
  }
  function sync() {
    const duration = Number(durationSelect.value);
    const addonDuration = Math.max(12, duration);
    const addonTotal = service === 'store' && aiAddon.checked ? 500000 * addonDuration / 12 : 0;
    document.querySelectorAll('[data-summary-addon]').forEach(e => e.textContent = addonTotal ? `${rupiah(addonTotal)} untuk ${addonDuration} bulan` : 'Tidak ditambahkan');
    if (service === 'store' || service === 'profile') {
      const normalMonthly = service === 'store' ? 210000 : 109000;
      const renewalMonthly = normalMonthly * .8;
      const discount = {1: 0, 12: .5, 24: .7, 48: .75}[duration];
      const monthly = Math.round(normalMonthly * (1 - discount));
      const packageTotal = monthly * duration;
      const normalTotal = normalMonthly * duration;
      const domainFee = feeFor(domain);
      const unquoted = duration === 1 && domainFee === null;
      const total = packageTotal + addonTotal + (domainFee ?? 0);
      const domainTerms = duration === 1 ? 'Domain dibayar terpisah untuk 1 tahun.' : 'Domain gratis selama 1 tahun.';
      document.querySelector('[data-review-price]').textContent = `${rupiah(total)}${unquoted ? ' + biaya domain tahunan' : ''} untuk ${duration} bulan. ${domainTerms} 1 email bisnis gratis.`;
      document.querySelector('.summary-total strong').textContent = `${rupiah(total)}${unquoted ? ' + domain' : ''}`;
      document.querySelector('[data-mini-total]').textContent = `${rupiah(total)}${unquoted ? ' + domain' : ''}`;
      document.querySelector('[data-summary-package-price]').textContent = rupiah(packageTotal);
      document.querySelector('[data-summary-normal-price]').textContent = rupiah(normalTotal);
      document.querySelector('[data-summary-normal-price]').hidden = !discount;
      document.querySelector('[data-plan-saving]').textContent = `Hemat ${rupiah(normalTotal - packageTotal)}`;
      document.querySelector('[data-plan-saving]').hidden = !discount;
      document.querySelector('[data-plan-monthly]').innerHTML = `${rupiah(monthly)} <small>/bulan</small>`;
      document.querySelector('[data-plan-normal]').textContent = `${rupiah(normalMonthly)}/bulan`;
      document.querySelector('[data-plan-normal]').hidden = !discount;
      document.querySelector('[data-summary-duration]').textContent = `Paket website · ${duration} bulan`;
      document.querySelector('[data-summary-total-label]').textContent = unquoted ? 'Subtotal paket' : `Total ${duration} bulan`;
      document.querySelector('[data-summary-domain-label]').textContent = duration === 1 ? 'Domain · 1 tahun' : 'Domain';
      document.querySelector('[data-summary-domain-included]').textContent = duration !== 1 ? 'Gratis selama 1 tahun' : !domain ? 'Pilih domain' : unquoted ? 'Tarif belum tersedia' : rupiah(domainFee);
      document.querySelector('[data-summary-email-included]').textContent = 'Gratis selama langganan';
      document.querySelector('[data-booking-domain]').classList.toggle('domain-not-included',duration === 1);
      document.querySelector('[data-booking-domain]').textContent = duration === 1 ? 'Domain gratis' : 'Domain gratis selama 1 tahun';
      document.querySelector('[data-booking-domain]').setAttribute('aria-label',duration === 1 ? 'Domain gratis: tidak termasuk dalam paket 1 bulan' : 'Domain gratis selama 1 tahun: termasuk dalam paket');
      document.querySelector('[data-order-domain-intro]').textContent = duration === 1 ? 'Cari domain untuk website Anda. Domain dibayar untuk 1 tahun; 1 email bisnis gratis selama langganan.' : 'Cari domain untuk website Anda. Domain gratis selama 1 tahun; 1 email bisnis gratis selama langganan.';
      durationOffer.hidden = duration !== 1;
      const durationDomainBenefit = document.querySelector('[data-duration-domain-benefit]');
      durationDomainBenefit.classList.toggle('domain-not-included', duration === 1);
      durationDomainBenefit.querySelector('span').textContent = duration === 1 ? 'Domain gratis' : 'Domain gratis selama 1 tahun';
      durationDomainBenefit.setAttribute('aria-label', duration === 1 ? 'Domain gratis: tidak termasuk dalam paket 1 bulan' : 'Domain gratis selama 1 tahun: termasuk dalam paket');
      document.querySelector('[data-upgrade-monthly]').textContent = `${rupiah(Math.round(normalMonthly * .25))}/bulan`;
      document.querySelector('[data-upgrade-total]').textContent = `Bayar ${rupiah(Math.round(normalMonthly * .25) * 48)} untuk 48 bulan. Domain gratis selama 1 tahun.`;
      document.querySelector('[data-summary-ai-duration]').textContent = `RasioLabs AI Insight · ${addonDuration} bulan`;
      document.querySelector('[data-summary-ai-price]').textContent = rupiah(addonTotal);
      document.querySelector('[data-summary-terms]').textContent = `${discount ? `Diskon ${Math.round(discount * 100)}%` : 'Harga normal'} berlaku untuk pembayaran ${duration} bulan di muka. Tarif perpanjangan ${rupiah(renewalMonthly)}/bulan. ${domainTerms} 1 email bisnis gratis.${unquoted ? ' Harga domain dikonfirmasi sebelum pembayaran.' : ''}${duration === 1 && addonTotal ? ' Add-on RasioLabs AI Insight ditagih untuk 12 bulan.' : ''}`;
      document.querySelector('[data-summary-ai-line]').hidden = addonTotal === 0;
    }
    document.querySelectorAll('[data-summary-package]').forEach(e => e.textContent = names[service]);
    document.querySelectorAll('[data-summary-template]').forEach(e => e.textContent = catalog[template]?.title || 'Belum dipilih');
    document.querySelectorAll('[data-summary-domain]').forEach(e => e.textContent = domain || 'Belum dipilih');
    document.querySelector('[data-edit-template]').textContent = template ? 'Ubah template' : 'Pilih template';
    refreshDomainPrices();
  }
  function refreshDomainPrices() {
    results.querySelectorAll('[data-domain-choice]').forEach(button => {
      const fee = feeFor(button.dataset.domainChoice);
      const status = button.querySelector('[data-domain-price]');
      status.querySelector('small').textContent = service === 'custom' ? 'Untuk konsultasi' : Number(durationSelect.value) === 1 ? 'Registrasi 1 tahun' : 'Termasuk dalam paket';
      status.querySelector('strong').textContent = service === 'custom' ? 'Sesuai penawaran' : Number(durationSelect.value) !== 1 ? 'Gratis selama 1 tahun' : fee === null ? 'Tarif belum tersedia' : `${rupiah(fee)}/tahun`;
    });
  }
  async function loadDomainPrices() {
    try {
      const response = await fetch('/api/domains/prices',{credentials:'same-origin'});
      if (!response.ok) return;
      const data = await response.json();
      for (const extension of ['com','id','co.id']) {
        const fee = data.prices?.[extension];
        if (Number.isSafeInteger(fee) && fee > 0 && fee <= 100000000) domainPrices[extension] = fee;
      }
      // A newly available quote must be reviewed before the customer submits it.
      if (!submitting) { resetReview(); sync(); }
    } catch { /* Keep an unquoted domain explicit rather than inventing a tariff. */ }
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
    next.textContent = step === 'review' ? service === 'custom' ? 'Siapkan konsultasi →' : 'Buat pesanan →' : 'Selanjutnya →';
    next.disabled = step === 'review' && !consent.checked;
    summaryContinue.textContent = step === 'review' ? service === 'custom' ? 'Siapkan konsultasi →' : 'Buat pesanan →' : 'Lanjutkan langkah →';
    summaryContinue.disabled = next.disabled;
    document.querySelector('[data-step-label]').textContent = `Langkah ${String(index+1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')}`;
    document.querySelector('[data-progress-bar]').style.width = `${(index+1)/steps.length*100}%`;
    drawSteps(); sync();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function resetReview() {
    consent.checked = false;
    checkoutNote.textContent = '';
    customWhatsApp.hidden = true;
    if (current === 'review') { next.disabled = true; summaryContinue.disabled = true; }
  }
  function searchError(value) {
    if (value.includes('.')) {
      const error = RasioDomain.error(value);
      if (error) return error;
      if (service === 'profile' && !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.(com|id|co\.id)$/.test(value)) return 'Pilih ekstensi .com, .id, atau .co.id untuk RasioLabs Profile.';
      return '';
    }
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
    const domainNote = service === 'custom'
      ? 'Pilihan domain ini untuk konsultasi awal. Ketersediaan dan biayanya ditentukan dalam penawaran proyek.'
      : 'Pilih domain yang Anda inginkan. Ketersediaannya akan dikonfirmasi oleh tim Rasio Labs.';
    results.innerHTML = `<p class="domain-results-note">${domainNote}</p>` + choices.map(choice => `<button class="domain-result" type="button" data-domain-choice="${choice}" aria-pressed="false"><span><b>${choice}</b><small>${choice === requested ? 'Domain yang Anda cari' : 'Pilihan ekstensi'}</small></span><span data-domain-price><small></small><strong></strong></span><i aria-hidden="true">Pilih →</i></button>`).join('');
    refreshDomainPrices();
    results.querySelectorAll('[data-domain-choice]').forEach(button => button.addEventListener('click', () => {
      domain = button.dataset.domainChoice;
      errorNode.hidden = true; resetReview(); sync();
      results.querySelectorAll('[data-domain-choice]').forEach(e => { e.classList.toggle('is-selected', e === button); e.setAttribute('aria-pressed',String(e === button)); });
    }));
    return true;
  }
  form.addEventListener('submit', event => { event.preventDefault(); searchDomain(); });
  input.addEventListener('input', () => { domain = ''; results.hidden = true; errorNode.hidden = true; input.removeAttribute('aria-invalid'); resetReview(); sync(); });
  businessForm.addEventListener('input', event => {
    event.target.setCustomValidity?.('');
    event.target.removeAttribute('aria-invalid');
    resetReview();
  });
  function validateBusiness() {
    businessForm.querySelectorAll('input, textarea').forEach(field => {
      field.value = field.value.trim();
      field.setCustomValidity('');
      if (field.required && !field.value) field.setCustomValidity('Lengkapi informasi ini.');
    });
    const phone = document.querySelector('#customer-whatsapp');
    const digits = phone.value.replace(/\D/g, '');
    if (phone.value && (!/^[+\d\s().-]+$/.test(phone.value) || digits.length < 8 || digits.length > 15)) {
      phone.setCustomValidity('Masukkan nomor WhatsApp yang valid, termasuk kode negara.');
    }
    businessForm.querySelectorAll('input, textarea').forEach(field => {
      field.setAttribute('aria-invalid', String(!field.validity.valid));
    });
    return businessForm.reportValidity();
  }
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
  async function createProfileOrder() {
    if (submitting) return;
    if (!validateBusiness()) { setStep('business'); return; }
    const payload = {
      service:'profile', template, domain, duration:Number(durationSelect.value),
      businessName:document.querySelector('#business-name').value,
      customerName:document.querySelector('#customer-name').value,
      whatsapp:document.querySelector('#customer-whatsapp').value,
      email:document.querySelector('#customer-email').value, consent:consent.checked,
      domainFeeExpected:feeFor(domain),
    };
    submitting = true;
    checkoutNote.textContent = 'Menyimpan pesanan…';
    checkoutNote.setAttribute('role','status');
    shell.setAttribute('aria-busy','true');
    const controls = [...shell.querySelectorAll('input, select, textarea, button')].map(control => [control,control.disabled]);
    controls.forEach(([control]) => control.disabled = true);
    next.textContent = 'Menyimpan pesanan…';
    summaryContinue.textContent = 'Menyimpan pesanan…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(),45000);
    try {
      const {domainFeeExpected,...orderChoices} = payload;
      const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(orderChoices)));
      const signature = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2,'0')).join('');
      if (!requestIdentity) {
        try { requestIdentity = JSON.parse(sessionStorage.getItem(requestStorageKey) || 'null'); } catch { requestIdentity = null; }
      }
      if (!requestIdentity || requestIdentity.signature !== signature || !/^[\w-]{36,64}$/.test(requestIdentity.key)) {
        requestIdentity = {key:crypto.randomUUID(),signature};
        try { sessionStorage.setItem(requestStorageKey,JSON.stringify(requestIdentity)); } catch { /* Retain the key in memory when storage is unavailable. */ }
      }
      const response = await fetch('/api/orders', {
        method:'POST', credentials:'same-origin', signal:controller.signal,
        headers:{'Content-Type':'application/json','Idempotency-Key':requestIdentity.key},
        body:JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || 'Pesanan belum dapat disimpan. Coba lagi.');
      if (!result?.order?.id || !result.order.reference) throw new Error('Konfirmasi pesanan belum diterima. Coba lagi.');
      checkoutNote.textContent = `Pesanan ${result.order.reference} tersimpan.`;
      try { sessionStorage.removeItem(requestStorageKey); } catch { /* The saved request can safely be retried. */ }
      location.assign('/cms');
    } catch (error) {
      checkoutNote.textContent = error.name === 'AbortError' ? 'Koneksi terputus. Coba lagi; pesanan yang sudah tersimpan tidak akan dibuat dua kali.' : error instanceof TypeError ? 'Koneksi bermasalah. Coba lagi; pilihan Anda tetap tersimpan di halaman ini.' : error.message;
      checkoutNote.setAttribute('role','alert');
      controls.forEach(([control,disabled]) => control.disabled = disabled);
      next.textContent = 'Coba lagi →';
      summaryContinue.textContent = 'Coba lagi →';
      submitting = false;
    } finally {
      clearTimeout(timeout);
      shell.removeAttribute('aria-busy');
    }
  }
  next.addEventListener('click', async () => {
    if (submitting) return;
    if (current === 'domain' && !domain) {
      if (results.hidden && !searchDomain()) return;
      errorNode.hidden = false; errorNode.textContent = 'Pilih salah satu domain di atas untuk melanjutkan.';
      results.querySelector('button')?.focus(); return;
    }
    if (current === 'template' && !template) { document.querySelector('[data-template-error]').hidden = false; options.querySelector('button')?.focus(); return; }
    if (current === 'business' && !validateBusiness()) return;
    if (current === 'review') {
      if (!consent.checked) return;
      if (service === 'custom') {
        const brief = `Halo Rasio Labs, saya ingin konsultasi RasioLabs Custom.\nBisnis: ${document.querySelector('#business-name').value}\nDomain pilihan: ${domain}\nKebutuhan: ${document.querySelector('#project-brief').value}`;
        customWhatsApp.href = 'https://wa.me/60142317052?text=' + encodeURIComponent(brief);
        customWhatsApp.hidden = false;
        checkoutNote.textContent = 'Ringkasan siap dibuka di WhatsApp. Anda dapat meninjau pesan sebelum mengirimkannya.';
      } else if (service === 'profile') await createProfileOrder();
      return;
    }
    setStep(steps[steps.indexOf(current)+1]);
  });
  summaryContinue.addEventListener('click', () => next.click());
  previous.addEventListener('click', () => setStep(steps[steps.indexOf(current)-1]));
  consent.addEventListener('change', () => { next.disabled = submitting || !consent.checked; summaryContinue.disabled = next.disabled; });
  document.querySelector('[data-summary-toggle]').addEventListener('click', event => {
    const button = event.currentTarget;
    const open = button.closest('.order-summary').classList.toggle('is-open');
    button.setAttribute('aria-expanded',String(open));
    button.firstChild.textContent = open ? 'Tutup rincian ' : 'Lihat rincian ';
    button.querySelector('span').textContent = open ? '−' : '+';
  });
  if (initialDomain) { input.value = initialDomain.split('.')[0]; searchDomain(initialDomain); }
  sync(); setStep('domain');
  if (service !== 'custom') loadDomainPrices();
})();
