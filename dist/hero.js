(() => {
  const root = document.querySelector('[data-hero-slider]');
  if (!root) return;

  const slides = [
    {
      label: 'Company Profile',
      lead: 'Buat website bisnis ',
      highlight: 'tanpa biaya pembuatan dari nol.',
      copy: 'Berlangganan template siap pakai. Rasio Labs menangani setup dan maintenance; Anda bisa memperbarui konten melalui CMS.',
      note: 'Company Profile',
      price: 'Rp27.250',
      suffix: '/bln',
      priceNote: 'Untuk berlangganan 48 bulan',
      benefits: ['Domain gratis 1 tahun (langganan 12-24 bulan)', 'Email bisnis, hosting & SSL', 'Setup & maintenance oleh Rasio Labs', 'CMS, SEO & chatbot 24/7'],
    },
    {
      label: 'Online Store',
      lead: 'Buka toko online Anda ',
      highlight: 'tanpa repot urusan teknis.',
      copy: 'Pilih template toko online. Rasio Labs menyiapkan toko dan membantu unggah 50 produk pertama; produk berikutnya bisa Anda tambah tanpa batas.',
      note: 'Online Store',
      price: 'Rp52.500',
      suffix: '/bln',
      priceNote: 'Untuk berlangganan 48 bulan',
      benefits: ['Domain gratis 1 tahun (langganan 12-24 bulan)', 'Email bisnis, hosting & SSL', 'Produk tanpa batas, 50 awal dibantu', 'Checkout, pengiriman & chatbot 24/7'],
    },
    {
      label: 'RasioLabs Custom',
      lead: 'Bangun software ',
      highlight: 'sesuai alur bisnis Anda.',
      copy: 'Dari website hingga ERP, kami merancang sistem sesuai kebutuhan tim Anda. Mulai dengan konsultasi proyek.',
      note: 'RasioLabs Custom',
      price: 'Sesuai cakupan proyek',
      suffix: '',
      priceNote: 'Konsultasi untuk penawaran proyek',
      benefits: ['Website, ERP & software custom', 'Integrasi sesuai kebutuhan tim', 'Pengembangan sesuai cakupan proyek', '1 email bisnis gratis'],
    },
  ];

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const hoverSurface = document.querySelector('#top .hero-visual');
  const stack = hoverSurface?.querySelector('.template-stack');
  const slide = root.querySelector('[data-hero-slide]');
  const title = root.querySelector('[data-hero-title]');
  const copy = root.querySelector('[data-hero-copy]');
  const dots = [...root.querySelectorAll('[data-slide]')];
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
  const whatsapp = 'https://wa.me/60142317052?text=Halo%20Rasio%20Labs%2C%20saya%20ingin%20konsultasi%20gratis%20tentang%20website%20bisnis.';
  const actions = [
    {primary: ['Lihat Paket', '#paket-profile'], secondary: ['Konsultasi Gratis', whatsapp]},
    {primary: ['Lihat Paket', '#paket-store'], secondary: ['Konsultasi Gratis', whatsapp]},
    {primary: ['Konsultasi Gratis', whatsapp], secondary: ['Lihat layanan Custom', '/layanan-custom.html']},
  ];
  const originalTabIndex = new WeakMap();
  let current = 0;
  let interval;
  let transitionTimer;
  let resizeTimer;
  let tiltFrame = 0;
  let tiltX = 0;
  let tiltY = 0;

  function resetTilt() {
    cancelAnimationFrame(tiltFrame);
    tiltFrame = 0;
    stack?.style.removeProperty('--hero-tilt-x');
    stack?.style.removeProperty('--hero-tilt-y');
  }

  hoverSurface?.addEventListener('pointermove', (event) => {
    if (!stack || event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches || document.hidden) return;
    const bounds = hoverSurface.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    tiltX = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)) * -5;
    tiltY = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)) * 7;
    if (!tiltFrame) tiltFrame = requestAnimationFrame(() => {
      tiltFrame = 0;
      stack.style.setProperty('--hero-tilt-x', tiltX.toFixed(2) + 'deg');
      stack.style.setProperty('--hero-tilt-y', tiltY.toFixed(2) + 'deg');
    });
  });
  hoverSurface?.addEventListener('pointerleave', resetTilt);
  hoverSurface?.addEventListener('pointercancel', resetTilt);
  finePointer.addEventListener('change', resetTilt);

  const logoMarquee = document.querySelector('.company-marquee');
  const logoGroup = logoMarquee?.querySelector('[data-company-logo-group]');
  if (logoGroup) {
    const duplicate = logoGroup.cloneNode(true);
    duplicate.removeAttribute('data-company-logo-group');
    duplicate.setAttribute('aria-hidden', 'true');
    logoGroup.parentElement.append(duplicate);
  }

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
    root.style.minHeight = '';
    slide.style.minHeight = '';
    const width = root.getBoundingClientRect().width;
    if (!width) return;
    const measure = root.cloneNode(true);
    measure.classList.add('hero-slide-measure');
    measure.removeAttribute('data-hero-slider');
    measure.inert = true;
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
    root.parentElement.append(measure);
    const measureTitle = measure.querySelector('[data-hero-title]');
    const measureCopy = measure.querySelector('[data-hero-copy]');
    let tallest = 0;
    slides.forEach((_, index) => {
      fill(measureTitle, measureCopy, index);
      measure.querySelectorAll('.hero-benefit-list li').forEach((item, i) => {
        item.textContent = slides[index].benefits[i];
      });
      measure.querySelector('[data-hero-price-label]').textContent = index === 2 ? 'Harga' : 'Mulai dari';
      fillPrice(measure.querySelector('[data-hero-price]'), index);
      measure.querySelector('[data-hero-price-note]').textContent = slides[index].priceNote;
      fillActionLabel(measure.querySelector('[data-hero-primary]'), actions[index].primary[0], true);
      measure.querySelector('[data-hero-secondary]').textContent = actions[index].secondary[0];
      tallest = Math.max(tallest, measure.getBoundingClientRect().height);
    });
    measure.remove();
    root.style.minHeight = Math.ceil(tallest) + 'px';
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

  function fillActionLabel(link, label, withArrow) {
    link.textContent = label;
    if (!withArrow) return;
    const arrow = document.createElement('span');
    arrow.className = 'hero-action-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    link.append(arrow);
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
      fillActionLabel(link, action[0], link === primary);
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
    if (reducedMotion.matches || document.hidden) resetTilt();
    root.closest('#top').classList.toggle('is-motion-paused', reducedMotion.matches || document.hidden);
    logoMarquee?.classList.toggle('is-motion-paused', reducedMotion.matches || document.hidden);
    if (!reducedMotion.matches && !document.hidden) {
      interval = setInterval(() => show((current + 1) % slides.length), 6200);
    }
  }

  dots.forEach((dot, index) => {
    dot.setAttribute('aria-label', slides[index].label);
    dot.addEventListener('click', () => {
      show(index, true);
      schedule();
    });
  });
  primary?.addEventListener('click', () => {
    if (primary.hash === '#paket-profile' || primary.hash === '#paket-store') {
      document.querySelector('[data-offer-duration="48"]')?.click();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(transitionTimer);
      render(current, false);
    }
    schedule();
  });
  reducedMotion.addEventListener('change', () => {
    clearTimeout(transitionTimer);
    slide.classList.remove('is-leaving');
    render(current, false);
    schedule();
  });
  window.addEventListener('resize', () => {
    resetTilt();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measureSlides, 90);
  });
  document.fonts?.ready.then(measureSlides);
  render(0, false);
  measureSlides();
  schedule();
})();
