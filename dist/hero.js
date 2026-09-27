(() => {
 const root = document.querySelector('[data-hero-slider]');
 if (!root) return;
 const slides = [
 ['Website bisnis siap online, ', 'tanpa biaya pembuatan dari nol.', 'Pilih template dan durasi langganan. Tim Rasio menyiapkan website, mengurus teknisnya, dan memberi Anda CMS sederhana untuk memperbarui konten.'],
 ['Buka toko online milik brand Anda, ', 'dibantu sampai siap jualan.', 'Rasio menyiapkan toko dan 50 produk pertama. Setelahnya, Anda dapat menambah produk tanpa batas melalui dashboard; kami tetap menangani sisi teknisnya.'],
 ['Perkenalkan bisnis Anda lewat ', 'website yang terasa milik sendiri.', 'Tampilkan layanan dan karya dalam desain yang sesuai brand. Anda dapat mengubah konten melalui CMS sederhana, sementara Rasio menjaga desain dan maintenance.']];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'), slide=root.querySelector('[data-hero-slide]'), title=root.querySelector('[data-hero-title]'), copy=root.querySelector('[data-hero-copy]'), dots=[...root.querySelectorAll('[data-slide]')], pause=root.querySelector('[data-slide-pause]'), announcement=root.querySelector('[data-hero-announcement]');
 const visuals=[...document.querySelectorAll('[data-hero-visual]')], hoverZone=document.querySelector('.hero--people');
 let current=0, paused=reduced.matches, timer, transitionTimer, resizeTimer;
 function fill(targetTitle,targetCopy,index){targetTitle.replaceChildren(document.createTextNode(slides[index][0]));const mark=document.createElement('mark');mark.className='marker';mark.textContent=slides[index][1];targetTitle.append(mark);targetCopy.textContent=slides[index][2];}
 function measureSlides(){
  const measure=slide.cloneNode(true);measure.classList.add('hero-slide-measure');measure.removeAttribute('data-hero-slide');measure.style.width=`${slide.getBoundingClientRect().width}px`;root.append(measure);
  const measureTitle=measure.querySelector('[data-hero-title]'),measureCopy=measure.querySelector('[data-hero-copy]');
  let tallest=0;slides.forEach((_,index)=>{fill(measureTitle,measureCopy,index);tallest=Math.max(tallest,measure.scrollHeight);});measure.remove();slide.style.minHeight=`${Math.ceil(tallest)+4}px`;
 }
 function show(index,announce=false) {
  if(index===current)return; clearTimeout(transitionTimer); current=index;
  const render=()=>{fill(title,copy,index);dots.forEach((d,i)=>d.setAttribute('aria-pressed',String(i===index)));visuals.forEach((visual,i)=>{visual.classList.toggle('is-active',i===index);visual.setAttribute('aria-hidden',String(i!==index));});root.querySelector('[data-slide-count]').textContent=`0${index+1} / 03`;if(announce&&announcement)announcement.textContent=`Slide ${index+1} dari 3: ${dots[index].getAttribute('aria-label')}`;slide.classList.remove('is-leaving');};
  if(reduced.matches)render();else{slide.classList.add('is-leaving');transitionTimer=setTimeout(render,220);}
 }
 function schedule(){clearInterval(timer);if(!paused&&!document.hidden&&!hoverZone.matches(':hover')&&!hoverZone.contains(document.activeElement))timer=setInterval(()=>show((current+1)%3),6800);}
 function label(){pause.setAttribute('aria-label',paused?'Putar slider':'Jeda slider');pause.textContent=paused?'▷':'Ⅱ';}
 dots.forEach((d,i)=>d.addEventListener('click',()=>{show(i,true);schedule();}));
 pause.addEventListener('click',()=>{paused=!paused;label();schedule();});
 hoverZone.addEventListener('mouseenter',()=>clearInterval(timer));hoverZone.addEventListener('mouseleave',schedule);hoverZone.addEventListener('focusin',()=>clearInterval(timer));hoverZone.addEventListener('focusout',()=>setTimeout(schedule,0));document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',()=>{paused=reduced.matches;label();schedule();});window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(measureSlides,90);});document.fonts?.ready.then(measureSlides);measureSlides();label();schedule();
})();
