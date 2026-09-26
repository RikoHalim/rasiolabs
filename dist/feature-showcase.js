(() => {
  const tabs = [...document.querySelectorAll('[data-feature-tab]')];
  const panels = [...document.querySelectorAll('[data-feature-panel]')];
  const detailLink = document.querySelector('[data-feature-link]');
  const section = document.querySelector('.feature-showcase');
  if (!tabs.length || !panels.length) return;

  const links = {
    profile: ['/layanan-profile.html', 'Lihat detail Rasio Profile'],
    store: ['/layanan-store.html', 'Lihat detail Rasio Store'],
    custom: ['/layanan-custom.html', 'Lihat detail Rasio Custom']
  };

  function selectTab(selected, focus = false) {
    const key = selected.dataset.featureTab;
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      panel.hidden = panel.dataset.featurePanel !== key;
      panel.classList.remove('is-entering');
      if (!panel.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      }
    });
    if (detailLink) {
      detailLink.href = links[key][0];
      detailLink.innerHTML = `${links[key][1]} <span aria-hidden="true">↗</span>`;
    }
    if (focus) selected.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[nextIndex], true);
    });
  });

  if (section && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let visible = false;
    let paused = false;
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, {threshold:.3}).observe(section);
    section.addEventListener('pointerenter', () => { paused = true; });
    section.addEventListener('pointerleave', () => { paused = false; });
    section.addEventListener('focusin', () => { paused = true; });
    section.addEventListener('focusout', () => { paused = false; });
    window.setInterval(() => {
      if (!visible || paused || document.hidden) return;
      const activeIndex = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
      selectTab(tabs[(activeIndex + 1) % tabs.length]);
    }, 8500);
  }
})();
