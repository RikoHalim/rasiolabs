(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;
  const trigger = nav.querySelector('.nav-dropdown-toggle');
  const menu = nav.querySelector('.nav-dropdown-menu');
  const dropdown = nav.querySelector('.nav-dropdown');
  const hoverPointer = matchMedia('(min-width: 1081px) and (hover: hover) and (pointer: fine)');
  let closeTimer, openedByHover = false;
  function setDropdown(open) {
    clearTimeout(closeTimer);
    if (!open) openedByHover = false;
    if (trigger) { trigger.setAttribute('aria-expanded',String(open)); menu.hidden = !open; }
  }
  dropdown?.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' && hoverPointer.matches) { setDropdown(true); openedByHover = true; }
  });
  dropdown?.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse' || !hoverPointer.matches) return;
    closeTimer = setTimeout(() => {
      if (!dropdown.contains(document.activeElement)) setDropdown(false);
    }, 160);
  });
  dropdown?.addEventListener('focusout', event => {
    if (!dropdown.contains(event.relatedTarget) && !dropdown.matches(':hover')) setDropdown(false);
  });
  trigger?.addEventListener('click', event => {
    const keepHoverOpen = event.detail > 0 && openedByHover;
    openedByHover = false;
    setDropdown(keepHoverOpen || trigger.getAttribute('aria-expanded') !== 'true');
  });
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
