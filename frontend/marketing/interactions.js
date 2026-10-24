import {readSelection,chooseSelection,selectionHref} from '../selection.js';

export function initNavigation(root=document){
  const header=root.querySelector('[data-header]'), toggle=root.querySelector('.menu-toggle'), links=root.querySelector('#nav-links');
  if(!header||!toggle||!links)return;
  header.classList.add('js-menu');
  toggle.hidden=false;
  const close=()=>{header.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Buka menu');};
  toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')!=='true';
    header.classList.toggle('is-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Tutup menu':'Buka menu');
  });
  root.addEventListener('keydown',e=>{if(e.key==='Escape'&&header.classList.contains('is-open')){close();toggle.focus();}});
  root.addEventListener('click',e=>{if(!header.contains(e.target))close();});
  links.addEventListener('click',e=>{if(e.target.closest('a'))close();});
  const media=matchMedia('(min-width: 901px)');media.addEventListener('change',close);
  let frame=0;
  const update=()=>{header.classList.toggle('is-scrolled',scrollY>12);frame=0;};
  addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});update();
}

export function initTabs(root=document){
  root.querySelectorAll('[data-tabs]').forEach(list=>{
    const tabs=[...list.querySelectorAll('[role=tab]')];
    const isProduct=tabs.every(tab=>/^product-(profile|store|custom)$/.test(tab.getAttribute('aria-controls')));
    const select=(tab,persist=false)=>{
      tabs.forEach(item=>{
        const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;
        root.getElementById(item.getAttribute('aria-controls')).hidden=!active;
      });
      if(persist&&isProduct){
        const state=readSelection(location.href),service=tab.getAttribute('aria-controls').slice('product-'.length);
        const next=chooseSelection(state,{service,...(service!=='profile'?{template:''}:{})});
        const href=selectionHref(location.href,next,location.href);
        if(href!==location.href)history.pushState(null,'',href);
        dispatchEvent(new Event('rasio:selection-change'));
      }
    };
    tabs.forEach((tab,index)=>{
      tab.addEventListener('click',()=>select(tab,true));
      tab.addEventListener('keydown',e=>{
        const vertical=list.getAttribute('aria-orientation')==='vertical';
        const next=vertical?'ArrowDown':'ArrowRight',prev=vertical?'ArrowUp':'ArrowLeft';
        let target;
        if(e.key===next)target=(index+1)%tabs.length;
        if(e.key===prev)target=(index-1+tabs.length)%tabs.length;
        if(e.key==='Home')target=0;
        if(e.key==='End')target=tabs.length-1;
        if(target!==undefined){e.preventDefault();tabs[target].focus();select(tabs[target],true);}
      });
    });
    if(isProduct){const restore=()=>{const service=readSelection(location.href).service||'profile';const tab=tabs.find(tab=>tab.getAttribute('aria-controls')==='product-'+service);if(tab)select(tab);};addEventListener('popstate',restore);addEventListener('pageshow',restore);restore();}
  });
}

export function initCatalogue(root=document){
  const form=root.querySelector('[data-template-filter]');if(!form)return;
  const search=form.elements.q,sector=form.elements.sector,clear=form.querySelector('.clear-search');
  const cards=[...root.querySelectorAll('[data-template-sector]')],empty=root.querySelector('[data-template-empty]');
  const more=root.querySelector('[data-load-templates]'),pageSize=6;
  let limit=pageSize;
  if(cards.length<=1){
    form.hidden=true;more.hidden=true;empty.hidden=true;
    const url=new URL(location.href);url.searchParams.delete('q');url.searchParams.delete('sector');history.replaceState(null,'',url);
    return;
  }
  form.hidden=false;
  const apply=(persist=true)=>{
    const query=search.value.trim().toLocaleLowerCase('id-ID');
    const matches=cards.filter(card=>(!sector.value||card.dataset.templateSector===sector.value)&&(!query||card.dataset.templateSearch.includes(query)));
    const visible=new Set(matches.slice(0,limit));
    cards.forEach(card=>{card.hidden=!visible.has(card);});
    clear.hidden=!search.value;
    root.querySelector('[data-template-count]').textContent=matches.length>limit?`${visible.size} dari ${matches.length} template`:`${matches.length} template`;
    empty.hidden=matches.length>0;
    more.hidden=matches.length<=limit;
    if(persist){const url=new URL(location.href);for(const [key,value] of [['q',search.value.trim()],['sector',sector.value]]){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}history.replaceState(null,'',url);}
  };
  const resetPage=()=>{limit=pageSize;apply();};
  const readUrl=()=>{const params=new URLSearchParams(location.search);search.value=params.get('q')||'';sector.value=params.get('sector')||'';limit=pageSize;apply(false);};
  more.addEventListener('click',()=>{
    const previouslyHidden=cards.filter(card=>card.hidden);
    limit+=pageSize;apply(false);
    previouslyHidden.find(card=>!card.hidden)?.querySelector('[data-template-choice]')?.focus({preventScroll:true});
  });
  search.addEventListener('input',e=>{if(!e.isComposing)resetPage();});
  search.addEventListener('compositionend',resetPage);
  sector.addEventListener('change',resetPage);
  clear.addEventListener('click',()=>{search.value='';resetPage();search.focus();});
  form.addEventListener('submit',e=>{e.preventDefault();resetPage();});
  root.querySelector('[data-reset-filter]').addEventListener('click',()=>{search.value='';sector.value='';resetPage();search.focus();});
  addEventListener('popstate',readUrl);readUrl();
}

