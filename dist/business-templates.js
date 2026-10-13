import {packageVolume,enquiryDestination,validStay} from './business-enquiry.mjs';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced&&'IntersectionObserver' in window){
 document.body.classList.add('motion-ready');
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}, {threshold:.12});
 document.querySelectorAll('[data-motion]').forEach(element=>{const rect=element.getBoundingClientRect();if(rect.top<innerHeight&&rect.bottom>0){element.classList.add('is-visible');if(element.dataset.motion!=='pan')element.classList.add('motion-static');}else observer.observe(element);});
}
document.querySelectorAll('[data-volume-calculator]').forEach(form=>{
 const output=form.querySelector('[data-volume-output]');
 form.addEventListener('input',()=>{output.textContent='Calculate again after changing the dimensions.';});
 form.addEventListener('submit',event=>{event.preventDefault();if(!window.RasioTemplateForms.validate(form))return;try{const values=new FormData(form);const volume=packageVolume(...['length','width','height','quantity'].map(key=>values.get(key)));output.textContent=volume.toLocaleString('en-GB',{minimumFractionDigits:3,maximumFractionDigits:4})+' m³ total package volume';}catch(error){output.textContent=error.message;}});
});
document.querySelectorAll('[data-business-enquiry]').forEach(form=>{
 const status=form.querySelector('[data-enquiry-status]'),arrival=form.elements.namedItem('Arrival date'),departure=form.elements.namedItem('Departure date');
 const topicSelect=form.elements.topic;
 if(topicSelect){
  const current=topicSelect.value,options=[...topicSelect.options],unique=new Map();
  for(const option of options)if(!unique.has(option.value)||option.selected)unique.set(option.value,option);
  for(const option of options)if(unique.get(option.value)!==option)option.remove();
  topicSelect.value=current;
 }
 const today=new Date(),localDay=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
 form.querySelectorAll('input[type=date]').forEach(input=>input.min=localDay);
 const checkDates=()=>{if(departure){departure.setCustomValidity(arrival.value&&departure.value&&!validStay(arrival.value,departure.value)?'Departure must be after arrival.':'');if(arrival.value)departure.min=arrival.value;}};
 if(arrival){arrival.addEventListener('input',checkDates);departure.addEventListener('input',checkDates);}
 const queryTopic=new URLSearchParams(location.search).get('topic');
 let selected=queryTopic;
 try{const home=document.querySelector('[data-site-page=""]');const base=new URL(home?.href||location.href,location.href).pathname.replace(/\/+$/,'')||'/';const storageKey='profile-brief:'+base;const saved=JSON.parse(sessionStorage.getItem(storageKey)||'null');selected=selected||saved?.topic;sessionStorage.removeItem(storageKey);}catch{}
 if(selected&&form.elements.topic){let option=[...form.elements.topic.options].find(option=>option.value===selected);if(!option){option=new Option(selected,selected);form.elements.topic.add(option);}form.elements.topic.value=selected;}
 form.addEventListener('input',()=>{status.replaceChildren();});
 form.addEventListener('submit',event=>{
  event.preventDefault();checkDates();if(!window.RasioTemplateForms.validate(form))return;
  const values=[...new FormData(form)].filter(([,value])=>String(value).trim());
  const label=key=>({name:'Your name',email:'Email',topic:'Interested in',message:'Notes'}[key]||key);
  const message=values.map(([key,value])=>label(key)+': '+value).join('\n');
  const destination=enquiryDestination(form.dataset.whatsapp,form.dataset.contactEmail,form.dataset.kind,message);
  status.replaceChildren();
  if(!destination){status.textContent='Contact details are not available. Please use the business contact information in the footer.';return;}
  const title=document.createElement('h3');title.textContent='Check your enquiry';status.append(title);
  const summary=document.createElement('dl');for(const [key,value] of values){const term=document.createElement('dt'),detail=document.createElement('dd');term.textContent=label(key);detail.textContent=value;summary.append(term,detail);}status.append(summary);
  const next=document.createElement('a');next.className='action';next.textContent=destination.label;next.href=destination.href;if(next.href.startsWith('https:')){next.target='_blank';next.rel='noopener';}status.append(next);next.focus({preventScroll:true});
 });
});
document.querySelectorAll('[data-cargo-checklist]').forEach(form=>{
 const items=[...form.querySelectorAll('input[type=checkbox]')],status=form.querySelector('[data-checklist-status]');
 form.addEventListener('submit',event=>event.preventDefault());
 form.addEventListener('change',()=>{const count=items.filter(item=>item.checked).length;status.textContent=count===items.length?'Checklist complete. Ready to prepare your enquiry.':count+' of '+items.length+' items prepared';});
});
