(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setups = [
    ['.blog-home', '.blog-grid', 'artikel'],
    ['.service-page .problem-section', '.problem-list', 'masalah dan solusi']
  ];

  setups.forEach(([sectionSelector, trackSelector, label]) => {
    const section = document.querySelector(sectionSelector);
    const track = section?.querySelector(trackSelector);
    if (!section || !track || track.children.length < 3) return;
    const cards = [...track.children];
    const controls = document.createElement('div');
    controls.className = 'motion-carousel-nav';
    controls.setAttribute('aria-label', `Navigasi ${label}`);
    controls.innerHTML = `<button type="button" aria-label="${label} sebelumnya">←</button><span aria-live="polite"></span><button type="button" aria-label="${label} berikutnya">→</button>`;
    track.after(controls);
    const [previous, next] = controls.querySelectorAll('button');
    const counter = controls.querySelector('span');

    const spacing = () => cards[1].offsetLeft - cards[0].offsetLeft;
    const maxIndex = () => Math.max(0, cards.length - Math.max(1, Math.round(track.clientWidth / spacing())));
    const currentIndex = () => Math.min(maxIndex(), Math.max(0, Math.round(track.scrollLeft / spacing())));
    const update = () => {
      const index = currentIndex();
      counter.textContent = `${index + 1} / ${maxIndex() + 1}`;
      previous.disabled = index === 0;
      next.disabled = index === maxIndex();
    };
    const go = index => {
      const bounded = Math.min(maxIndex(), Math.max(0, index));
      track.scrollTo({left: bounded * spacing(), behavior: reducedMotion ? 'instant' : 'smooth'});
      window.setTimeout(update, reducedMotion ? 0 : 450);
    };
    previous.addEventListener('click', () => go(currentIndex() - 1));
    next.addEventListener('click', () => go(currentIndex() + 1));
    track.addEventListener('scroll', () => window.requestAnimationFrame(update), {passive:true});
    window.addEventListener('resize', update, {passive:true});
    update();
  });
})();
