(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const theme = document.body.classList.contains('theme-padel') ? 'padel' : document.body.classList.contains('theme-creative') ? 'creative' : document.body.classList.contains('theme-consulting') ? 'consulting' : 'architecture';
  const running = new Set();
  const play = (element, frames, options) => {
    if (reduced.matches || !element.animate) return;
    const animation = element.animate(frames, options);
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
  };
  const revealPhoto = element => {
    const masks = {
      architecture: [{clipPath:'inset(0 0 100% 0)',transform:'scale(1.06)'},{clipPath:'inset(0)',transform:'scale(1)'}],
      padel: [{clipPath:'inset(0 100% 0 0 round 12px)',transform:'translateX(24px)'},{clipPath:'inset(0 round 12px)',transform:'translateX(0)'}],
      creative: [{clipPath:'polygon(0 0,0 0,0 100%,0 100%)',transform:'scale(1.04)'},{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)',transform:'scale(1)'}],
      consulting: [{opacity:0,transform:'scale(1.045)'},{opacity:1,transform:'scale(1)'}],
    };
    play(element,masks[theme],{duration:1150,easing:'cubic-bezier(.16,1,.3,1)'});
  };
  const revealText = element => play(element,[{opacity:0,transform:'translateY(28px)',filter:'blur(4px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:850,easing:'cubic-bezier(.16,1,.3,1)'});
  const main=document.querySelector('main');
  if(main)play(main,[{opacity:.4},{opacity:1}],{duration:420,easing:'ease-out'});
  let leaving=false;
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[data-site-page]');
    if(!main?.animate||!link||reduced.matches||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download'))return;
    const target=new URL(link.href,location.href);
    if(target.origin!==location.origin||target.pathname===location.pathname)return;
    event.preventDefault();if(leaving)return;leaving=true;
    const exit=main.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-8px)'}],{duration:170,easing:'ease-in'});
    exit.finished.catch(()=>{}).then(()=>location.assign(target.href));
  });
  window.addEventListener('pageshow',()=>{leaving=false;});
  const observer = new IntersectionObserver(entries => {
    for (const {target,isIntersecting} of entries) if (isIntersecting) {
      observer.unobserve(target);
      if (target.tagName === 'IMG') revealPhoto(target); else revealText(target);
      if (target.matches('.home-stage-grid,.process-grid,.guide-modules')) {
        [...target.children].forEach((child,i)=>play(child,[{opacity:0,transform:'translateY(35px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,delay:i*110,easing:'cubic-bezier(.16,1,.3,1)'}));
      }
    }
  },{threshold:.12});
  document.querySelectorAll('main h1,main h2,main figure>img,main .case-cover,main .guide-intro>img,.home-stage-grid,.process-grid,.guide-modules').forEach(e=>observer.observe(e));

  const photos = [...document.querySelectorAll('.hero-photo>img,.hero-image,.architecture-hero img,.hero-photos figure>img')];
  const progress = document.createElement('div');
  progress.className='template-reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  let frame = 0;
  const update = () => {
    frame=0;
    const total=document.documentElement.scrollHeight-innerHeight;
    progress.style.scale=(total>0?Math.min(1,Math.max(0,scrollY/total)):0)+' 1';
    if (reduced.matches || innerWidth < 761) return;
    photos.forEach(photo=>{
      const r=photo.getBoundingClientRect();
      if (r.bottom>0&&r.top<innerHeight) photo.style.translate='0 '+Math.max(-12,Math.min(12,(r.top+r.height/2-innerHeight/2)*-.035))+'px';
    });
  };
  const requestUpdate=()=>{if(!frame)frame=requestAnimationFrame(update);};
  window.addEventListener('scroll',requestUpdate,{passive:true});window.addEventListener('resize',requestUpdate);
  reduced.addEventListener('change',()=>{if(reduced.matches){running.forEach(a=>a.cancel());photos.forEach(p=>p.style.translate='');}requestUpdate();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)running.forEach(a=>a.finish());});
  requestUpdate();
  document.querySelectorAll('details').forEach(details=>details.addEventListener('toggle',()=>{
    if(details.open){const body=details.querySelector('p,div');if(body)play(body,[{opacity:0,transform:'translateY(-7px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'ease-out'});}
  }));
})();
