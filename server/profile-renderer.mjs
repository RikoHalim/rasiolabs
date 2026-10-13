import {navigationHref,pageHref,mapLinks,profilePages,profileExpansion} from './profile-pages.mjs';
import {businessTemplates} from './templates/index.mjs';
import {legacyExpansion} from './templates/legacy-expansion.mjs';
export function rewriteProfileLinks(source,data,{template,base,page=''}) {
  let html=new HTMLRewriter().on('[data-site-page]',{element:e=>{
    const target=e.getAttribute('data-site-page')||'';
    e.setAttribute('href',pageHref(base,target));
  }}).on('[data-cms-link-label-key]',{element:e=>{
    const label=data[e.getAttribute('data-cms-link-label-key')];
    if(typeof label==='string')e.setInnerContent((e.getAttribute('data-cms-link-label-prefix')||'')+label+(e.getAttribute('data-cms-link-label-suffix')||''));
  }}).on('[data-cms-topic-key]',{element:e=>{
    const topic=data[e.getAttribute('data-cms-topic-key')];
    if(typeof topic!=='string')return;
    if(e.tagName==='option'){e.setInnerContent(topic);e.setAttribute('value',topic);}
    else if(e.tagName==='input')e.setAttribute('value',topic);
    else e.setAttribute('data-enquiry-topic',topic);
  }}).on('[data-enquiry], [data-business-enquiry]',{element:e=>{e.setAttribute('data-whatsapp',data.whatsapp.replace(/\D/g,''));e.setAttribute('data-contact-email',data.email||'');}});
  const map=mapLinks(data);
  if(map)html=html.on('[data-location-map]',{element:e=>{e.setAttribute('src',map.embed);e.setAttribute('title',data.locationName||'Business location');}}).on('[data-location-link]',{element:e=>e.setAttribute('href',map.view)});
  return html.transform(source);
}
export function renderProfileTemplate(source,data,{template,base,page=''}) {
  const extra=profileExpansion[template]?.pages.findIndex(p=>p.slug===page)??-1;
  const titleField=extra>=0?'extra'+(extra+1)+'Title':legacyExpansion[template]?.titleFields[page]||(template==='Hospitality'?{'garden-room':'work1Title','terrace-suite':'work2Title'}:{living:'work1Title',detail:'work2Title',identity:'work1Title',digital:'work2Title',priorities:'insightTitle'})[page];
  const pageTitle=titleField?data[titleField]:profilePages[template][page];
  let html=new HTMLRewriter().on('.template-access',{element:e=>e.remove()})
    .on('[data-business-statistics]',{element:e=>{if(data.statisticsVisible===false||![1,2,3].some(n=>data['stat'+n+'Value']?.trim()&&data['stat'+n+'Label']?.trim()))e.remove();}})
    .on('[data-business-statistic]',{element:e=>{const prefix='stat'+e.getAttribute('data-business-statistic');if(!data[prefix+'Value']?.trim()||!data[prefix+'Label']?.trim())e.remove();}})
    .on('title',{element:e=>e.setInnerContent((page?pageTitle+' | ':'')+data.businessName)})
    .on('meta[name="description"]',{element:e=>e.setAttribute('content',extra>=0?data['extra'+(extra+1)+'Lead']:data[legacyExpansion[template]?.leadFields[page]]||data.heroDescription)});
  for(const [key,value] of Object.entries(data)) {
    if(typeof value!=='string') continue;
    html=html.on('[data-cms-field="'+key+'"]',{element:e=>e.setInnerContent(value)});
  }
  html=html.on('[data-cms-image]',{element:e=>{
    const key=e.getAttribute('data-cms-image');if(!Object.hasOwn(data,key))return;
    e.setAttribute('src',data[key]);
    if(key==='logo')e.setAttribute('alt',data.businessName);
    if(['heroImage','work1Image','work2Image'].includes(key))e.setAttribute('alt',data[{heroImage:'heroTitle',work1Image:'work1Title',work2Image:'work2Title'}[key]]);
  }});
  const number=data.whatsapp.replace(/\D/g,'');
  const contact=number?'https://wa.me/'+number:data.email?'mailto:'+encodeURIComponent(data.email):navigationHref(template,base,'contact');
  for(const n of [1,2,3,4]) html=html.on('[data-cms-menu="'+n+'"]',{element:e=>{
    if(!data['nav'+n+'Visible']){e.remove();return;}
    e.setInnerContent(data['nav'+n+'Label']);e.setAttribute('href',navigationHref(template,base,data['nav'+n+'Target']));
  }});
  html=html.on('[data-cms-nav-cta]',{element:e=>{
    if(!data.navCtaVisible){e.remove();return;}
    e.setInnerContent(data.navCtaLabel);e.setAttribute('href',businessTemplates[template]?navigationHref(template,base,'contact'):contact);
    if(template==='Architecture'&&!page)e.append(' <span aria-hidden="true">↗</span>',{html:true});
  }}).on('.contact-button',{element:e=>{
    e.setInnerContent(data.contactLabel||'Hubungi kami');e.setAttribute('href',contact);
  }}).on('.footer-whatsapp',{element:e=>{
    if(!number&&!data.email){e.remove();return;}
    e.setInnerContent(number?data.whatsapp:data.email);e.setAttribute('href',contact);
  }}).on('[data-cms-copyright]',{element:e=>e.setInnerContent('© '+new Date().getUTCFullYear()+' '+data.businessName)});
  if(!data.navCtaVisible&&![1,2,3,4].some(n=>data['nav'+n+'Visible'])) for(const selector of ['.studio-menu','.studio-nav']) html=html.on(selector,{element:e=>e.setAttribute('hidden','')});
  return rewriteProfileLinks(html.transform(source),data,{template,base,page});
}
