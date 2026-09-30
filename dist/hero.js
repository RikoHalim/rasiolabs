(() => {
  const root = document.querySelector('[data-hero-slider]');
  if (!root) return;

  const slides = [
    {
      label: 'Rasio Profile',
      lead: 'Website bisnis siap online, ',
      highlight: 'tanpa biaya pembuatan dari nol.',
      copy: 'Pilih template dan berlangganan. Tim Rasio menyiapkan website serta mengelola teknisnya; Anda tetap dapat memperbarui konten lewat CMS sederhana.',
      note: 'Company profile yang disiapkan dan dikelola Rasio',
      price: 'Rp27.250',
      suffix: '/bln',
      priceNote: 'Paket 48 bulan, dibayar di muka',
      benefits: ['Domain & 1 email bisnis selama langganan', 'Setup & maintenance oleh tim Rasio', 'CMS sederhana untuk ubah konten', 'SEO, WhatsApp CTA & AI chatbot 24/7'],
    },
    {
      label: 'Rasio Store',
      lead: 'Buka toko online milik brand Anda, ',
      highlight: 'tanpa repot urusan teknis.',
      copy: 'Tim Rasio menyiapkan toko dan membantu mengunggah 50 produk pertama. Berikutnya, Anda bisa menambah produk tanpa batas melalui dashboard.',
      note: 'Toko online dengan pengelolaan teknis dari Rasio',
      price: 'Rp52.500',
      suffix: '/bln',
      priceNote: 'Paket 48 bulan, dibayar di muka',
      benefits: ['Domain & 1 email bisnis selama langganan', 'Setup & maintenance oleh tim Rasio', '50 produk awal dibantu, berikutnya tanpa batas', 'Checkout, pengiriman & AI chatbot 24/7'],
    },
    {
      label: 'Rasio Custom',
      lead: 'Punya kebutuhan yang lebih spesifik? ',
      highlight: 'Bangun sistem bersama Rasio.',
      copy: 'Website, ERP, dan software custom dirancang mengikuti alur kerja bisnis Anda. Ceritakan kebutuhan proyek untuk mendapat penawaran.',
      note: 'Website dan ERP sesuai kebutuhan bisnis',
      price: 'Sesuai cakupan proyek',
      suffix: '',
      priceNote: 'Konsultasi untuk penawaran proyek',
      benefits: ['Website, ERP, atau software sesuai kebutuhan', 'Integrasi dan akses tim sesuai cakupan', 'Fitur & jadwal disepakati bersama', 'Rasio menangani implementasi proyek'],
    },
  ];

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const slide = root.querySelector('[data-hero-slide]');
  const title = root.querySelector('[data-hero-title]');
  const copy = root.querySelector('[data-hero-copy]');
  const dots = [...root.querySelectorAll('[data-slide]')];
  const pause = root.querySelector('[data-slide-pause]');
  const count = root.querySelector('[data-slide-count]');
  const announcement = root.querySelector('[data-hero-announcement]');
  const note = document.querySelector('[data-hero-note]');
  const price = document.querySelector('[data-hero-price]');
  const priceLabel = document.querySelector('[data-hero-price-label]');
  const priceNote = document.querySelector('[data-hero-price-note]');
  const benefits = [...document.querySelectorAll('#top .hero-benefit-list li')];
  const primary = document.querySelector('[data-hero-primary]');
  const secondary = document.querySelector('[data-hero-secondary]');
  const visuals = [...document.querySelectorAll('[data-hero-visual]')];
  const whatsapp = 'https://wa.me/60142317052?text=Halo%20Rasio%2C%20saya%20ingin%20konsultasi%20gratis%20tentang%20website%20bisnis.';
  const actions = [
    {primary: ['Lihat Paket', '#paket-profile'], secondary: ['Konsultasi Gratis ↗', whatsapp]},
    {primary: ['Lihat Paket', '#paket-store'], secondary: ['Konsultasi Gratis ↗', whatsapp]},
    {primary: ['Diskusikan proyek custom ↗', whatsapp], secondary: ['Lihat layanan Custom ↗', '/layanan-custom.html']},
  ];
  const originalTabIndex = new WeakMap();
  let current = 0;
  let userPaused = false;
  let interval;
  let transitionTimer;
  let resizeTimer;

  function fill(targetTitle, targetCopy, index) {
    targetTitle.replaceChildren(document.createTextNode(slides[index].lead));
    const mark = document.createElement('mark');
    mark.className = 'marker';
    mark.textContent = slides[index].highlight;
    targetTitle.append(mark);
    targetCopy.textContent = slides[index].copy;
  }

  function measureSlides() {
    if (!slide) return;
    slide.style.minHeight = '';
    const baseMinHeight = parseFloat(getComputedStyle(slide).minHeight) || 0;
    const width = slide.getBoundingClientRect().width;
    if (!width) return;
    const measure = slide.cloneNode(true);
    measure.classList.add('hero-slide-measure');
    measure.removeAttribute('data-hero-slide');
    Object.assign(measure.style, {
      position: 'fixed',
      left: '-9999px',
      top: '0',
      width: width + 'px',
      height: 'auto',
      minHeight: '0',
      visibility: 'hidden',
      pointerEvents: 'none',
      opacity: '0',
      transform: 'none',
      transition: 'none',
    });
    measure.setAttribute('aria-hidden', 'true');
    root.append(measure);
    const measureTitle = measure.querySelector('[data-hero-title]');
    const measureCopy = measure.querySelector('[data-hero-copy]');
    let tallest = 0;
    slides.forEach((_, index) => {
      fill(measureTitle, measureCopy, index);
      tallest = Math.max(tallest, measure.scrollHeight);
    });
    measure.remove();
    slide.style.minHeight = Math.max(baseMinHeight, Math.ceil(tallest) + 8) + 'px';
    reserveHeight(root.querySelector('.hero-benefits'), (clone, index) => {
      clone.querySelectorAll('li').forEach((item, i) => { item.textContent = slides[index].benefits[i]; });
    });
    reserveHeight(root.querySelector('.hero-start-price'), (clone, index) => {
      clone.querySelector('[data-hero-price-label]').textContent = index === 2 ? 'Harga' : 'Mulai dari';
      fillPrice(clone.querySelector('[data-hero-price]'), index);
      clone.querySelector('[data-hero-price-note]').textContent = slides[index].priceNote;
    });
    reserveHeight(root.querySelector('.hero-actions'), (clone, index) => {
      clone.querySelector('[data-hero-primary]').textContent = actions[index].primary[0];
      clone.querySelector('[data-hero-secondary]').textContent = actions[index].secondary[0];
    });
    reserveHeight(note?.parentElement, (clone, index) => {
      clone.querySelector('[data-hero-note]').textContent = slides[index].note;
    });
  }

  function fillPrice(element, index) {
    element.replaceChildren(document.createTextNode(slides[index].price));
    if (slides[index].suffix) {
      const suffix = document.createElement('small');
      suffix.textContent = slides[index].suffix;
      element.append(suffix);
    }
  }

  function reserveHeight(element, update) {
    if (!element) return;
    element.style.minHeight = '';
    const width = element.getBoundingClientRect().width;
    if (!width) return;
    const baseHeight = parseFloat(getComputedStyle(element).minHeight) || 0;
    const clone = element.cloneNode(true);
    clone.removeAttribute('id');
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    Object.assign(clone.style, {
      position: 'fixed', left: '-9999px', top: '0', width: width + 'px',
      height: 'auto', minHeight: '0', visibility: 'hidden', pointerEvents: 'none',
      transform: 'none', transition: 'none',
    });
    element.parentElement.append(clone);
    let tallest = baseHeight;
    slides.forEach((_, index) => {
      update(clone, index);
      tallest = Math.max(tallest, clone.getBoundingClientRect().height);
    });
    clone.remove();
    element.style.minHeight = Math.ceil(tallest) + 'px';
  }

  function setVisualFocus(visual, active) {
    const selector = 'a,button,input,select,textarea,[tabindex]';
    const focusables = visual.matches(selector)
      ? [visual, ...visual.querySelectorAll(selector)]
      : [...visual.querySelectorAll(selector)];
    focusables.forEach((element) => {
      if (!originalTabIndex.has(element)) originalTabIndex.set(element, element.getAttribute('tabindex'));
      const original = originalTabIndex.get(element);
      if (!active) element.setAttribute('tabindex', '-1');
      else if (original === null) element.removeAttribute('tabindex');
      else element.setAttribute('tabindex', original);
    });
    visual.inert = !active;
  }

  function render(index, announce) {
    fill(title, copy, index);
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
    visuals.forEach((visual, i) => {
      const distance = (i - index + slides.length) % slides.length;
      const active = distance === 0;
      visual.classList.toggle('is-active', active);
      visual.classList.toggle('is-behind-right', distance === 1);
      visual.classList.toggle('is-behind-left', distance === 2);
      visual.setAttribute('aria-hidden', String(!active));
      setVisualFocus(visual, active);
    });
    if (note) note.textContent = slides[index].note;
    benefits.forEach((benefit, i) => { if (slides[index].benefits[i]) benefit.textContent = slides[index].benefits[i]; });
    if (priceLabel) priceLabel.textContent = index === 2 ? 'Harga' : 'Mulai dari';
    if (price) fillPrice(price, index);
    if (priceNote) priceNote.textContent = slides[index].priceNote;
    [[primary, actions[index].primary], [secondary, actions[index].secondary]].forEach(([link, action]) => {
      if (!link) return;
      link.textContent = action[0];
      link.href = action[1];
      if (action[1].startsWith('https://')) {
        link.target = '_blank';
        link.rel = 'noopener';
      } else {
        link.removeAttribute('target');
        link.removeAttribute('rel');
      }
    });
    if (count) count.textContent = '0' + (index + 1) + ' / 03';
    if (announce && announcement) announcement.textContent = 'Slide ' + (index + 1) + ' dari 3: ' + slides[index].label;
    slide.classList.remove('is-leaving');
  }

  function show(index, announce = false) {
    if (index === current) return;
    clearTimeout(transitionTimer);
    current = index;
    if (reducedMotion.matches) render(index, announce);
    else {
      slide.classList.add('is-leaving');
      transitionTimer = setTimeout(() => render(index, announce), 220);
    }
  }

  function schedule() {
    clearInterval(interval);
    if (!userPaused && !reducedMotion.matches && !document.hidden) {
      interval = setInterval(() => show((current + 1) % slides.length), 6200);
    }
  }

  function updatePauseButton() {
    if (!pause) return;
    pause.disabled = reducedMotion.matches;
    pause.setAttribute('aria-label', reducedMotion.matches ? 'Animasi dinonaktifkan oleh pengaturan perangkat' : userPaused ? 'Putar slider' : 'Jeda slider');
    pause.textContent = userPaused || reducedMotion.matches ? '▷' : 'Ⅱ';
  }

  dots.forEach((dot, index) => {
    dot.setAttribute('aria-label', slides[index].label);
    dot.addEventListener('click', () => {
      show(index, true);
      schedule();
    });
  });
  pause?.addEventListener('click', () => {
    userPaused = !userPaused;
    updatePauseButton();
    schedule();
  });
  primary?.addEventListener('click', () => {
    if (primary.hash === '#paket-profile' || primary.hash === '#paket-store') {
      document.querySelector('[data-offer-duration="48"]')?.click();
    }
  });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => {
    clearTimeout(transitionTimer);
    slide.classList.remove('is-leaving');
    render(current, false);
    updatePauseButton();
    schedule();
  });
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measureSlides, 90);
  });
  document.fonts?.ready.then(measureSlides);
  render(0, false);
  measureSlides();
  updatePauseButton();
  schedule();
})();
