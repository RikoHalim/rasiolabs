export function initMotion(root=document){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const hover=matchMedia('(hover: hover) and (pointer: fine)');
  const stage=root.querySelector('[data-hero-visual]'),stack=root.querySelector('[data-product-stack]');
  let frame=0,observer;
  const resetTilt=()=>{cancelAnimationFrame(frame);frame=0;stack?.style.removeProperty('--tilt-x');stack?.style.removeProperty('--tilt-y');};
  stage?.addEventListener('pointermove',e=>{
    if(reduced.matches||!hover.matches)return;
    const box=stage.getBoundingClientRect();
    const x=Math.max(-1,Math.min(1,((e.clientX-box.left)/box.width-.5)*2));
    const y=Math.max(-1,Math.min(1,((e.clientY-box.top)/box.height-.5)*2));
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{stack.style.setProperty('--tilt-x',`${x*2.5}deg`);stack.style.setProperty('--tilt-y',`${-y*2.5}deg`);});
  });
  stage?.addEventListener('pointerleave',resetTilt);
  stage?.addEventListener('pointercancel',resetTilt);
  const reveal=()=>{
    observer?.disconnect();
    const nodes=[...root.querySelectorAll('[data-reveal],[data-process]')];
    if(reduced.matches||!('IntersectionObserver' in window)){nodes.forEach(n=>n.classList.add('is-visible'));return;}
    observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12});
    nodes.forEach(node=>{
      if(node.getBoundingClientRect().top>innerHeight&&!node.hasAttribute('data-process'))node.classList.add('reveal-ready');
      observer.observe(node);
    });
  };
  reduced.addEventListener('change',()=>{resetTilt();reveal();});
  hover.addEventListener('change',resetTilt);reveal();
  const front=root.querySelector('.stack-front');
  const animatedTargets=new Map([...root.querySelectorAll('.ai-feature')].map(card=>[card,card]));
  if(front&&stage)animatedTargets.set(stage,front);
  const visibleTargets=new Set();
  const syncAnimations=()=>animatedTargets.forEach((target,observed)=>{
    const state=visibleTargets.has(observed)&&!document.hidden&&!reduced.matches?'running':'paused';
    if(target===front)target.style.animationPlayState=state;
    else target.style.setProperty('--ai-motion-state',state);
  });
  if('IntersectionObserver' in window){
    const animationObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting)visibleTargets.add(entry.target);else visibleTargets.delete(entry.target);});
      syncAnimations();
    });
    animatedTargets.forEach((_,observed)=>animationObserver.observe(observed));
  }else animatedTargets.forEach((_,observed)=>visibleTargets.add(observed));
  document.addEventListener('visibilitychange',syncAnimations);
  reduced.addEventListener('change',syncAnimations);
  syncAnimations();
}

