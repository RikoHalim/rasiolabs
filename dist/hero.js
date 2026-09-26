(() => {
 const root = document.querySelector('[data-hero-slider]');
 if (!root) return;
 const slides = [
 ['Website dari template, ', 'cukup berlangganan tahunan.', 'Tidak ada biaya pembuatan website dari nol untuk paket template. Tim Rasio menyiapkan dan membantu mengelola website Anda.'],
 ['Buka toko online tanpa ', 'membangunnya dari nol.', 'Pilih template Rasio Store, siapkan materi produk, lalu tim kami membantu setup dan mengunggah 50 produk pertama.'],
 ['Perkenalkan bisnis lewat ', 'website yang dikelola bersama Rasio.', 'Tim Rasio mengurus tampilan dan perawatan. Anda bisa memperbarui teks, foto, dan logo melalui CMS sederhana.']];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'), slide=root.querySelector('[data-hero-slide]'), title=root.querySelector('[data-hero-title]'), copy=root.querySelector('[data-hero-copy]'), dots=[...root.querySelectorAll('[data-slide]')], pause=root.querySelector('[data-slide-pause]');
 let current=0, paused=reduced.matches, timer, transitionTimer;
 function show(index) {
  if(index===current)return; clearTimeout(transitionTimer); current=index;
  const render=()=>{title.replaceChildren(document.createTextNode(slides[index][0]));const mark=document.createElement('mark');mark.className='marker';mark.textContent=slides[index][1];title.append(mark);copy.textContent=slides[index][2];dots.forEach((d,i)=>d.setAttribute('aria-pressed',String(i===index)));root.querySelector('[data-slide-count]').textContent=`0${index+1} / 03`;slide.classList.remove('is-leaving');};
  if(reduced.matches)render();else{slide.classList.add('is-leaving');transitionTimer=setTimeout(render,220);}
 }
 function schedule(){clearInterval(timer);if(!paused&&!document.hidden&&!root.matches(':hover')&&!root.contains(document.activeElement))timer=setInterval(()=>show((current+1)%3),6500);}
 function label(){pause.setAttribute('aria-label',paused?'Putar slider':'Jeda slider');pause.textContent=paused?'▷':'Ⅱ';}
 dots.forEach((d,i)=>d.addEventListener('click',()=>{show(i);schedule();}));
 pause.addEventListener('click',()=>{paused=!paused;label();schedule();});
 root.addEventListener('mouseenter',()=>clearInterval(timer));root.addEventListener('mouseleave',schedule);root.addEventListener('focusin',()=>clearInterval(timer));root.addEventListener('focusout',()=>setTimeout(schedule,0));document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',()=>{paused=reduced.matches;label();schedule();});label();schedule();
})();
