(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const theme=['padel','creative','consulting'].find(name=>document.body.classList.contains('theme-'+name))||'architecture';
  const ease='cubic-bezier(.22,1,.36,1)';
  const profiles={
    architecture:{
      text:[{opacity:0,clipPath:'inset(0 0 100% 0)',transform:'translateY(10px)'},{opacity:1,clipPath:'inset(0)',transform:'translateY(0)'}],
      photo:[{clipPath:'inset(0 0 100% 0)',transform:'scale(1.045)'},{clipPath:'inset(0)',transform:'scale(1)'}],
      item:[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],
      entry:[{opacity:.45},{opacity:1}],exit:[{opacity:1},{opacity:0}],
      textTime:850,photoTime:1200,itemTime:750,stagger:130,entryTime:550,exitTime:180
    },
    padel:{
      text:[{opacity:0,transform:'translateX(-36px)'},{opacity:1,transform:'translateX(0)'}],
      photo:[{clipPath:'polygon(0 0,20% 0,0 100%,0 100%)',transform:'translateX(18px)'},{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)',transform:'translateX(0)'}],
      item:[{opacity:0,transform:'translateX(28px)'},{opacity:1,transform:'translateX(0)'}],
      entry:[{opacity:.6,transform:'translateX(14px)'},{opacity:1,transform:'translateX(0)'}],exit:[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-16px)'}],
      textTime:480,photoTime:700,itemTime:450,stagger:90,entryTime:320,exitTime:150
    },
    creative:{
      text:[{opacity:0,transform:'translateY(22px) rotate(.6deg)'},{opacity:1,transform:'translateY(0) rotate(0)'}],
      photo:[{clipPath:'inset(48% 0 48% 0)',transform:'scale(1.025)'},{clipPath:'inset(0)',transform:'scale(1)'}],
      item:[{opacity:0,transform:'translateY(24px) rotate(1deg)'},{opacity:1,transform:'translateY(0) rotate(0)'}],
      entry:[{opacity:.3,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],exit:[{opacity:1},{opacity:0}],
      textTime:800,photoTime:950,itemTime:700,stagger:160,entryTime:650,exitTime:240
    },
    consulting:{
      text:[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],
      photo:[{opacity:.2,transform:'translateX(8px)'},{opacity:1,transform:'translateX(0)'}],
      item:[{opacity:0},{opacity:1}],
      entry:[{opacity:.7},{opacity:1}],exit:[{opacity:1},{opacity:0}],
      textTime:360,photoTime:500,itemTime:350,stagger:80,entryTime:300,exitTime:130
    }
  };
  const profile=profiles[theme],running=new Set();
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
  const revealHeading=element=>{
    // Keep the original words and line breaks; only their entrance is sequenced.
    if(theme==='creative'&&element.tagName==='H1'&&!reduced.matches){
      const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT),nodes=[];
      while(walker.nextNode())nodes.push(walker.currentNode);
      for(const node of nodes){
        const fragment=document.createDocumentFragment();
        for(const token of node.textContent.split(/(\s+)/)){
          if(!token)continue;
          if(/^\s+$/.test(token))fragment.append(document.createTextNode(token));
          else{const word=document.createElement('span');word.className='motion-word';word.textContent=token;fragment.append(word);}
        }
        node.replaceWith(fragment);
      }
      element.querySelectorAll('.motion-word').forEach((word,i)=>play(word,[{opacity:0,transform:'translateY(30px) rotate(2deg)'},{opacity:1,transform:'translateY(0) rotate(0)'}],700,i*70));
    }else play(element,profile.text,profile.textTime);
  };
  const groups='.home-stage-grid,.process-grid,.guide-modules,.padel-home-programs,.consulting-focus,.home-capability-list,.statistics-grid,.modern-service-grid,.consulting-service-bento,.padel-program-bento';
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
    document.querySelectorAll('main h1,main h2,main figure>img,main .case-cover,main .architecture-cover,main .guide-intro>img,'+groups).forEach(element=>{
      if(element.closest(groups)!==element&&element.closest(groups))return;
      observer.observe(element);
    });
  }
  const photos=[...document.querySelectorAll('.hero-photo>img,.hero-image,.architecture-hero img,.modern-hero--architecture .modern-hero-photo>img')];
  const progress=theme==='architecture'?document.createElement('div'):null;
  if(progress){progress.className='template-reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);}
  let frame=0;
  const update=()=>{
    frame=0;
    if(progress){const total=document.documentElement.scrollHeight-innerHeight;progress.style.scale=(total>0?Math.min(1,Math.max(0,scrollY/total)):0)+' 1';}
    photos.forEach(photo=>{
      if(theme!=='architecture'||reduced.matches||innerWidth<761){photo.style.translate='';return;}
      const r=photo.getBoundingClientRect();
      if(r.bottom>0&&r.top<innerHeight)photo.style.translate='0 '+Math.max(-10,Math.min(10,(r.top+r.height/2-innerHeight/2)*-.025))+'px';
    });
  };
  const requestUpdate=()=>{if(!frame)frame=requestAnimationFrame(update);};
  window.addEventListener('scroll',requestUpdate,{passive:true});window.addEventListener('resize',requestUpdate);
  reduced.addEventListener('change',()=>{if(reduced.matches)running.forEach(a=>a.cancel());requestUpdate();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)running.forEach(a=>a.finish());});requestUpdate();
  document.querySelectorAll('details').forEach(details=>details.addEventListener('toggle',()=>{
    if(details.open)play(details.querySelector('p,div'),profile.item,profile.itemTime);
  }));
  document.addEventListener('template:panel-visible',event=>{
    if(!event.target.hidden)[...event.target.children].forEach((child,i)=>play(child,profile.item,profile.itemTime,i*profile.stagger));
  });
})();
