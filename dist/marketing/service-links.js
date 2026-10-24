import {readSelection,chooseSelection,selectionHref} from '../selection.js';

const policyPages=/\/(?:policies|terms|domain-policy|cancellation-policy|renewal-policy|ownership-policy|cms|admin)\.html$/;
export function initServiceLinks(root=document){
  const pageService=root.body?.dataset.service;
  const originals=new Map([...root.querySelectorAll(pageService?'a[href]':'a[data-service-link]')].map(link=>[link,link.getAttribute('href')]));
  const render=()=>{
    let selected=readSelection(location.href);
    if(pageService&&!selected.raw.some(([key])=>key==='type'))selected=chooseSelection(selected,{service:pageService});
    for(const [link,href] of originals){
      if(href.startsWith('#'))continue;
      const target=new URL(href,location.href);
      if(target.origin!==location.origin||policyPages.test(target.pathname))continue;
      const explicit=link.getAttribute('data-service-link')||target.searchParams.get('type');
      const changes={};
      if(['profile','store','custom'].includes(explicit)){
        changes.service=explicit;
        if(explicit!==selected.service&&explicit!=='profile')changes.template='';
      }
      const months=link.getAttribute('data-service-plan');
      if(months)changes.months=months;
      const template=link.getAttribute('data-template-id')||target.searchParams.get('template');
      if(template)changes.template=template;
      link.href=selectionHref(target,chooseSelection(selected,changes),location.href);
    }
  };
  addEventListener('popstate',render);
  addEventListener('pageshow',render);
  addEventListener('rasio:selection-change',render);
  render();
}
