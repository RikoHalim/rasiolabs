(() => {
  const theme=['padel','creative','consulting'].find(name=>document.body.classList.contains('theme-'+name))||'architecture';
  const filterMotion={architecture:{duration:650,delay:100,enter:'translateY(12px)'},padel:{duration:380,delay:65,enter:'translateX(24px)'},creative:{duration:700,delay:140,enter:'translateY(18px) rotate(.8deg)'},consulting:{duration:300,delay:60,enter:'none'}}[theme];
  document.querySelectorAll('[data-filter-scope]').forEach(scope=>{
    const buttons=[...scope.querySelectorAll('[data-filter]')],cards=[...scope.querySelectorAll('[data-category]')];
    buttons.forEach(button=>button.addEventListener('click',()=>{
      const previous=new Map(cards.filter(card=>!card.hidden).map(card=>[card,card.getBoundingClientRect()]));
      buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;});
      if(!matchMedia('(prefers-reduced-motion: reduce)').matches)cards.filter(card=>!card.hidden).forEach((card,index)=>{
        const before=previous.get(card),after=card.getBoundingClientRect();
        card.animate([{opacity:before?1:0,transform:before?'translate('+(before.x-after.x)+'px,'+(before.y-after.y)+'px)':filterMotion.enter},{opacity:1,transform:'none'}],{duration:filterMotion.duration,delay:before?0:index*filterMotion.delay,easing:'cubic-bezier(.22,1,.36,1)'});
      });
    }));
  });
  document.querySelectorAll('[data-tabs]').forEach(scope=>{
    const tabs=[...scope.querySelectorAll('[role="tab"]')],panels=[...scope.querySelectorAll('[role="tabpanel"]')];
    const select=(tab,focus=false)=>{tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});panels.forEach(p=>{p.hidden=p.id!==tab.getAttribute('aria-controls');if(!p.hidden)p.dispatchEvent(new CustomEvent('template:panel-visible',{bubbles:true}));});if(focus)tab.focus();};
    tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',e=>{let index;if(e.key==='ArrowRight'||e.key==='ArrowDown')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')index=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();select(tabs[index],true);});});
  });
  const dialog=document.querySelector('.gallery-dialog'),photos=[...document.querySelectorAll('[data-gallery-image]')];
  if(dialog&&photos.length){
    let current=0,trigger;
    const display=index=>{current=(index+photos.length)%photos.length;const source=photos[current].querySelector('img'),image=dialog.querySelector('img');image.src=source.currentSrc||source.src;image.alt=source.alt;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)image.animate([{opacity:.2,transform:'scale(.985)'},{opacity:1,transform:'scale(1)'}],{duration:450,easing:'ease-out'});dialog.querySelector('p').textContent=source.alt;dialog.querySelector('[data-gallery-count]').textContent=(current+1)+' / '+photos.length;};
    photos.forEach((button,index)=>button.addEventListener('click',()=>{trigger=button;display(index);dialog.showModal();}));
    dialog.querySelector('.gallery-close').addEventListener('click',()=>dialog.close());
    dialog.querySelector('[data-gallery-prev]').addEventListener('click',()=>display(current-1));
    dialog.querySelector('[data-gallery-next]').addEventListener('click',()=>display(current+1));
    dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();display(current-1);}if(e.key==='ArrowRight'){e.preventDefault();display(current+1);}});
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>trigger?.focus());
  }
  document.querySelectorAll('[data-enquiry]').forEach(form=>{
    form.addEventListener('submit',e=>{
    e.preventDefault();if(!window.RasioTemplateForms.validate(form))return;
    const phone=(form.dataset.whatsapp||'').replace(/\D/g,''),status=form.querySelector('.enquiry-status');
    const data=new FormData(form),details=[...form.querySelectorAll('[data-enquiry-detail]')].map(input=>[input.name,String(data.get(input.name)||'').trim()]).filter(([,value])=>value);
    const emailAddress=String(data.get('email')||'').trim();
    const message=['Hello, I’m '+String(data.get('name')).trim()+'.',emailAddress?'Email: '+emailAddress:'',form.dataset.kind+': '+data.get('topic'),...details.map(([label,value])=>label+': '+value),'\n'+String(data.get('message')).trim()].filter(Boolean).join('\n');
    const email=form.dataset.contactEmail||'';
    if(!/^\d{8,15}$/.test(phone)&&!email){status.textContent='Please use the contact details in the footer.';return;}
    const url=/^\d{8,15}$/.test(phone)?'https://wa.me/'+phone+'?text='+encodeURIComponent(message):'mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(form.dataset.kind)+'&body='+encodeURIComponent(message);
    status.replaceChildren();const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.textContent=/^\d{8,15}$/.test(phone)?'Continue in WhatsApp':'Continue by email';status.append(link);
    link.focus({preventScroll:true});
    });
  });
  const home=document.querySelector('[data-site-page=""]');
  const sitePath=new URL(home?.href||location.href,location.href).pathname.replace(/\/+$/,'')||'/';
  const briefKey='profile-brief:'+sitePath;
  const keep=brief=>{try{sessionStorage.setItem(briefKey,JSON.stringify(brief));}catch{}};
  const rows=form=>{
    const data=new FormData(form),seen=new Set(),answers=[];
    for(const input of form.querySelectorAll('[data-prep-field]')){
      if(seen.has(input.name))continue;seen.add(input.name);
      const value=data.getAll(input.name).map(v=>String(v).trim()).filter(Boolean).join(', ');
      if(value)answers.push([input.name,value]);
    }
    return answers;
  };
  document.querySelectorAll('[data-prep-builder]').forEach(form=>{
    const scope=form.closest('.prep-layout'),summary=scope.querySelector('[data-prep-summary]'),status=scope.querySelector('.prep-status');
    const text=()=>form.dataset.kind+'\n\n'+rows(form).map(([label,value])=>label+': '+value).join('\n\n');
    const render=()=>{
      summary.replaceChildren();const answers=rows(form);
      if(!answers.length){const p=document.createElement('p');p.className='prep-summary-empty';p.textContent='Your answers will appear here.';summary.append(p);return;}
      const list=document.createElement('dl');for(const [label,value]of answers){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);list.append(row);}summary.append(list);
      status.textContent='';
    };
    form.addEventListener('input',render);form.addEventListener('change',render);
    form.addEventListener('submit',event=>{event.preventDefault();if(!window.RasioTemplateForms.validate(form))return;render();status.textContent=rows(form).length?'Brief ready. Continue to enquiry when you’re ready.':'Add your answers to prepare a brief.';});
    scope.querySelector('[data-prep-copy]').addEventListener('click',async()=>{if(!rows(form).length){status.textContent='Add your answers first.';return;}try{await navigator.clipboard.writeText(text());status.textContent='Brief copied.';}catch{status.textContent='Copy is unavailable. Use Download brief.';}});
    scope.querySelector('[data-prep-download]').addEventListener('click',()=>{if(!rows(form).length){status.textContent='Add your answers first.';return;}const url=URL.createObjectURL(new Blob([text()],{type:'text/plain;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='project-brief.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Brief downloaded.';});
    scope.querySelector('[data-prep-continue]').addEventListener('click',event=>{if(!window.RasioTemplateForms.validate(form)){event.preventDefault();return;}if(rows(form).length)keep({message:text(),topic:''});});
  });
  document.querySelectorAll('[data-enquiry-topic],[data-site-page="brief"],[data-site-page="contact"],[data-site-page="visit#enquiry"]').forEach(link=>{
    if(link.hasAttribute('data-prep-continue'))return;
    link.addEventListener('click',()=>{
      const card=link.closest('article,.program-card,.expertise-panels [role="tabpanel"],.portfolio-item');
      const topic=link.dataset.enquiryTopic?.trim()||card?.querySelector('h2,h3')?.textContent?.trim();
      if(topic)keep({topic,message:'I’m interested in '+topic+'.'});
    });
  });
  document.querySelectorAll('[data-enquiry]').forEach(form=>{
    let brief;try{brief=JSON.parse(sessionStorage.getItem(briefKey)||'null');}catch{}
    if(!brief)return;
    const message=form.querySelector('[name="message"]');if(message&&!message.value&&typeof brief.message==='string')message.value=brief.message.slice(0,message.maxLength>0?message.maxLength:6000);
    if(typeof brief.topic==='string'){const matching=[...form.querySelectorAll('[name="topic"]')].find(input=>input.value.toLowerCase()===brief.topic.toLowerCase());if(matching)matching.checked=true;}
    try{sessionStorage.removeItem(briefKey);}catch{}
  });
})();
