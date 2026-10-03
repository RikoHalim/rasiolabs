(() => {
  document.querySelectorAll('[data-filter-scope]').forEach(scope=>{
    const buttons=[...scope.querySelectorAll('[data-filter]')],cards=[...scope.querySelectorAll('[data-category]')];
    buttons.forEach(button=>button.addEventListener('click',()=>{
      buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;});
    }));
  });
  document.querySelectorAll('[data-tabs]').forEach(scope=>{
    const tabs=[...scope.querySelectorAll('[role="tab"]')],panels=[...scope.querySelectorAll('[role="tabpanel"]')];
    const select=(tab,focus=false)=>{tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});panels.forEach(p=>{p.hidden=p.id!==tab.getAttribute('aria-controls');});if(focus)tab.focus();};
    tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',e=>{let index;if(e.key==='ArrowRight'||e.key==='ArrowDown')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')index=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();select(tabs[index],true);});});
  });
  const dialog=document.querySelector('.gallery-dialog'),photos=[...document.querySelectorAll('[data-gallery-image]')];
  if(dialog&&photos.length){
    let current=0,trigger;
    const display=index=>{current=(index+photos.length)%photos.length;const source=photos[current].querySelector('img');dialog.querySelector('img').src=source.currentSrc||source.src;dialog.querySelector('img').alt=source.alt;dialog.querySelector('p').textContent=source.alt;dialog.querySelector('[data-gallery-count]').textContent=(current+1)+' / '+photos.length;};
    photos.forEach((button,index)=>button.addEventListener('click',()=>{trigger=button;display(index);dialog.showModal();}));
    dialog.querySelector('.gallery-close').addEventListener('click',()=>dialog.close());
    dialog.querySelector('[data-gallery-prev]').addEventListener('click',()=>display(current-1));
    dialog.querySelector('[data-gallery-next]').addEventListener('click',()=>display(current+1));
    dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();display(current-1);}if(e.key==='ArrowRight'){e.preventDefault();display(current+1);}});
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>trigger?.focus());
  }
  document.querySelectorAll('[data-enquiry]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const phone=(form.dataset.whatsapp||'').replace(/\D/g,''),status=form.querySelector('.enquiry-status');
    if(!/^\d{8,15}$/.test(phone)){status.textContent='Please use the contact details in the footer.';return;}
    const data=new FormData(form),message='Hello, I’m '+String(data.get('name')).trim()+'.\nEmail: '+String(data.get('email')).trim()+'\n'+form.dataset.kind+': '+data.get('topic')+'\n\n'+String(data.get('message')).trim();
    const url='https://wa.me/'+phone+'?text='+encodeURIComponent(message);
    status.replaceChildren();const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.textContent='Open your enquiry in WhatsApp ↗';status.append(link);
    window.open(url,'_blank','noopener,noreferrer');
  }));
})();
