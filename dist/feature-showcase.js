(() => {
  const tabs = [...document.querySelectorAll('[data-feature-tab]')];
  const panels = [...document.querySelectorAll('[data-feature-panel]')];
  const detailLink = document.querySelector('[data-feature-link]');
  const count = document.querySelector('[data-feature-count]');
  if (!tabs.length || !panels.length) return;

  const links = {
    profile: ['/index.html#layanan', 'Lihat detail RasioLabs Profile'],
    store: ['/index.html#layanan', 'Lihat detail RasioLabs Store'],
    custom: ['/index.html#layanan', 'Lihat detail RasioLabs Custom']
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
    if (count) count.textContent = `${String(tabs.indexOf(selected) + 1).padStart(2, '0')} / ${String(tabs.length).padStart(2, '0')}`;
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
  document.querySelector('[data-feature-prev]')?.addEventListener('click', () => {
    const index = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
    selectTab(tabs[(index - 1 + tabs.length) % tabs.length]);
  });
  document.querySelector('[data-feature-next]')?.addEventListener('click', () => {
    const index = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
    selectTab(tabs[(index + 1) % tabs.length]);
  });

})();
