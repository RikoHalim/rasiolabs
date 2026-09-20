(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;
  const trigger = nav.querySelector('.nav-dropdown-toggle');
  const menu = nav.querySelector('.nav-dropdown-menu');
  function setDropdown(open) { if (trigger) { trigger.setAttribute('aria-expanded',String(open)); menu.hidden = !open; } }
  trigger?.addEventListener('click', () => setDropdown(trigger.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('click', event => { if (!nav.querySelector('.nav-dropdown')?.contains(event.target)) setDropdown(false); });
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Tutup navigasi' : 'Buka navigasi';
    if (!open) setDropdown(false);
  }
  toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && trigger?.getAttribute('aria-expanded') === 'true') { setDropdown(false); trigger.focus(); return; }
    if (!document.body.classList.contains('menu-open')) return;
    if (event.key === 'Escape') { setMenu(false); toggle.focus(); }
    if (event.key === 'Tab') {
      const links = Array.from(nav.querySelectorAll('a,button')).filter(e => e.getClientRects().length);
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === toggle) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.focus(); }
    }
  });
  matchMedia('(min-width: 1081px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
})();
