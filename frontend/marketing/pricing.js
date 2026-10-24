import {getPlan} from './policy-v4.js';
import {readSelection,chooseSelection,selectionHref,recoverySelection} from '../selection.js';
export const money=value=>'Rp'+value.toLocaleString('id-ID');
export function pricingView(months,service='profile'){
  const plan=getPlan(service,months);
  return {months,monthly:money(plan.monthlyEquivalent),total:money(plan.totalPrice),saving:plan.normalMonthly*months-plan.totalPrice,domain:plan.freeDomainFirstYear,badge:plan.badge||'',period:`Total ${months} bulan, dibayar di muka`};
}
export function initPricing(root=document){
  const picker=root.querySelector('.duration-picker');if(!picker)return;
  const links=new Map([...root.querySelectorAll('[data-checkout-preview], [data-template-choice], [data-template-preview]')].map(link=>[link,link.href]));
  let state;
  const update=(animate=false)=>{
    const months=state.months;
    picker.querySelectorAll('input').forEach(input=>{input.checked=Number(input.value)===months;});
    picker.closest('.pricing-section').dataset.duration=months?String(months):'';
    let warning=root.querySelector('[data-selection-warning]');
    if(state.errors.length&&!warning){warning=document.createElement('p');warning.dataset.selectionWarning='';warning.setAttribute('role','alert');picker.after(warning);}
    if(warning){warning.replaceChildren();warning.hidden=!state.errors.length;if(state.errors.length){warning.append(state.errors.map(e=>e.message).join(' ')+' ');const recover=document.createElement('a');recover.textContent='Pilih ulang paket';recover.href=selectionHref(location.href,recoverySelection(state),location.href);warning.append(recover);}}
    root.querySelectorAll('[data-price-service]').forEach(card=>{
      if(!months){card.querySelector('[data-price-monthly]').textContent='—';card.querySelector('[data-price-total]').textContent='—';card.querySelector('[data-price-period]').textContent='Pilih durasi layanan';for(const key of ['original','savings'])card.querySelector('[data-price-'+key+']').style.visibility='hidden';card.querySelector('[data-plan-badge]').style.visibility='hidden';card.querySelector('[data-domain-benefit] span').textContent='Pilih durasi untuk melihat manfaat domain';return;}
      const view=pricingView(months,card.dataset.priceService);
      card.querySelector('[data-price-monthly]').textContent=view.monthly;
      card.querySelector('[data-price-total]').textContent=view.total;
      card.querySelector('[data-price-period]').textContent=view.period;
      card.querySelector('[data-price-original]').style.visibility=view.saving?'visible':'hidden';
      const saving=card.querySelector('[data-price-savings]');saving.style.visibility=view.saving?'visible':'hidden';saving.textContent='Hemat '+money(view.saving);
      const benefit=card.querySelector('[data-domain-benefit]');benefit.classList.toggle('not-included',!view.domain);
      benefit.querySelector('span').textContent=view.domain?'Domain gratis tahun pertama':'Domain tidak termasuk';
      benefit.querySelector('path').setAttribute('d',view.domain?'m5 12 4 4L19 6':'m6 6 12 12M6 18 18 6');
      const badge=card.querySelector('[data-plan-badge]');badge.textContent=view.badge;badge.style.visibility=view.badge?'visible':'hidden';
      if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)card.querySelector('[data-price-amount]').animate([{opacity:.55,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'ease-out'});
    });
    root.querySelector('[data-domain-note]').textContent=!months?'Pilih durasi layanan untuk melihat manfaat domain.':months===1?'Paket 1 bulan tidak termasuk domain gratis. Biaya pendaftaran domain dibayar terpisah.':'Domain gratis tahun pertama pada paket Profile dan Store minimal 12 bulan. Perpanjangan domain tahun berikutnya dibayar terpisah oleh pelanggan.';
    for(const [link,href] of links){const target=readSelection(href);const next=chooseSelection(state,{service:target.service,template:target.template});link.href=selectionHref(href,next,location.href);}
  };
  const readUrl=()=>{state=readSelection(location.href);if(!state.raw.some(([key])=>key==='duration')){state=chooseSelection(state,{months:48});history.replaceState(null,'',selectionHref(location.href,state,location.href));}update();};
  picker.addEventListener('change',()=>{state=chooseSelection(state,{months:Number(picker.querySelector('input:checked').value)});history.pushState(null,'',selectionHref(location.href,state,location.href));update(true);dispatchEvent(new Event('rasio:selection-change'));});
  addEventListener('popstate',readUrl);addEventListener('pageshow',readUrl);addEventListener('rasio:selection-change',readUrl);readUrl();
}
