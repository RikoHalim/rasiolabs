(() => {
  document.querySelectorAll('.service-page .sector-section').forEach((section, index) => {
    const grid = section.querySelector('.sector-grid');
    if (!grid || grid.children.length <= 8) return;

    grid.id = `service-sectors-${index + 1}`;
    section.classList.add('sector-compact');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sector-toggle';
    button.setAttribute('aria-controls', grid.id);
    button.setAttribute('aria-expanded', 'false');
    button.textContent = 'Lihat semua sektor';
    grid.after(button);

    button.addEventListener('click', () => {
      const expanded = section.classList.toggle('is-expanded');
      button.setAttribute('aria-expanded', String(expanded));
      button.textContent = expanded ? 'Tampilkan lebih sedikit' : 'Lihat semua sektor';
    });
  });
})();
