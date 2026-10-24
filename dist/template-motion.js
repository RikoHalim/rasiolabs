(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const ease='cubic-bezier(.22,1,.36,1)';
  const profile={
      text:[{opacity:0,transform:'translateX(-36px)'},{opacity:1,transform:'translateX(0)'}],
      photo:[{clipPath:'polygon(0 0,20% 0,0 100%,0 100%)',transform:'translateX(18px)'},{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)',transform:'translateX(0)'}],
      item:[{opacity:0,transform:'translateX(28px)'},{opacity:1,transform:'translateX(0)'}],
      entry:[{opacity:.6,transform:'translateX(14px)'},{opacity:1,transform:'translateX(0)'}],exit:[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-16px)'}],
      textTime:480,photoTime:700,itemTime:450,stagger:90,entryTime:320,exitTime:150
  },running=new Set();
  const play=(element,frames,duration,delay=0)=>{
    if(reduced.matches||!element?.animate)return null;
    const animation=element.animate(frames,{duration,delay,easing:ease,fill:'backwards'});
    running.add(animation);animation.finished.catch(()=>{}).finally(()=>{running.delete(animation);animation.cancel();});return animation;
  };
  document.querySelectorAll('[data-motion-toggle]').forEach(button=>{
    const track=button.closest('.modern-ticker')?.querySelector('.ticker-track');
    if(!track)return;
    button.addEventListener('click',()=>{
      const paused=button.getAttribute('aria-pressed')!=='true';
      button.setAttribute('aria-pressed',String(paused));
      button.setAttribute('aria-label',paused?'Resume scrolling text':'Pause scrolling text');
      button.textContent=paused?'▶':'Ⅱ';
      track.style.animationPlayState=paused?'paused':'running';
    });
    if(reduced.matches)button.hidden=true;
    reduced.addEventListener('change',()=>{button.hidden=reduced.matches;});
  });
  const revealHeading=element=>play(element,profile.text,profile.textTime);
  const groups='.home-stage-grid,.process-grid,.guide-modules,.padel-home-programs,.home-capability-list,.statistics-grid,.modern-service-grid,.padel-program-bento';
  const reveal=element=>{
    if(element.matches(groups))[...element.children].forEach((child,i)=>play(child,profile.item,profile.itemTime,i*profile.stagger));
    else if(element.tagName==='IMG')play(element,profile.photo,profile.photoTime);
    else revealHeading(element);
  };
  if('IntersectionObserver' in window){
    const observed=new WeakSet();
    const observer=new IntersectionObserver(entries=>{
      for(const {target,isIntersecting} of entries){
        const firstObservation=!observed.has(target);
        observed.add(target);
        if(isIntersecting){observer.unobserve(target);if(!firstObservation)reveal(target);}
      }
    },{threshold:.12});
    document.querySelectorAll('main h1,main h2,main figure>img,main .case-cover,main .guide-intro>img,'+groups).forEach(element=>{
      if(element.closest(groups)!==element&&element.closest(groups))return;
      observer.observe(element);
    });
  }
  reduced.addEventListener('change',()=>{if(reduced.matches)running.forEach(a=>a.cancel());});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)running.forEach(a=>a.finish());});
  document.querySelectorAll('details').forEach(details=>details.addEventListener('toggle',()=>{
    if(details.open)play(details.querySelector('p,div'),profile.item,profile.itemTime);
  }));
  document.addEventListener('template:panel-visible',event=>{
    if(!event.target.hidden)[...event.target.children].forEach((child,i)=>play(child,profile.item,profile.itemTime,i*profile.stagger));
  });
})();
