(() => {
  const button=document.querySelector('.studio-menu'),nav=document.querySelector('.studio-nav');
  if(!button||!nav)return;
  const close=()=>{button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open navigation');nav.classList.remove('is-open');};
  button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('is-open',open);});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
  document.addEventListener('click',event=>{if(!event.target.closest('.studio-header'))close();});
})();
