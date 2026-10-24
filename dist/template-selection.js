import {readSelection,chooseSelection,selectionHref,recoverySelection,homeHref} from './selection.js';

export function initTemplateSelection(root=document){
  const bar=root.querySelector('.template-access');
  if(!bar)return;
  const originalLinks=new Map([...root.querySelectorAll('a[href]')].map(a=>[a,a.getAttribute('href')]));
  const render=()=>{
    let state=readSelection(location.href);
    const defaults={};
    if(!state.raw.some(([key])=>key==='type'))defaults.service='profile';
    if(!state.raw.some(([key])=>key==='template'))defaults.template='Padel';
    state=chooseSelection(state,defaults);
    for(const [link,href] of originalLinks){
      const url=new URL(href,location.href);
      if(url.origin!==location.origin)continue;
      if(link.matches('[data-use-template]')){
        link.href=selectionHref('/checkout-v4.html',state,location.href);
        link.textContent=state.errors.length?'Periksa pilihan':state.months?'Gunakan template':'Pilih paket';
      }else if(bar.contains(link))link.href=homeHref(recoverySelection(state),'template',location.href);
      else if(/^\/template-padel(?:[/.\-]|$)/.test(url.pathname)||href.startsWith('#'))link.href=selectionHref(url,state,location.href);
    }
    let error=bar.querySelector('[data-selection-error]');
    if(state.errors.length&&!error){error=root.createElement('span');error.dataset.selectionError='';error.setAttribute('role','alert');bar.append(error);}
    if(error){error.textContent=state.errors.map(item=>item.message).join(' ');error.hidden=!state.errors.length;}
  };
  addEventListener('popstate',render);
  addEventListener('pageshow',render);
  render();
}
if(typeof document!=='undefined')initTemplateSelection();
