import {navigationHref,pageHref,mapLinks,profilePages} from './profile-pages.mjs';
export function rewriteProfileLinks(source,data,{template,base,page=''}) {
  let html=new HTMLRewriter().on('[data-site-page]',{element:e=>{
    const target=e.getAttribute('data-site-page')||'';
    e.setAttribute('href',pageHref(base,target));
  }}).on('[data-enquiry]',{element:e=>e.setAttribute('data-whatsapp',data.whatsapp.replace(/\D/g,''))});
  const map=mapLinks(data);
  if(map)html=html.on('[data-location-map]',{element:e=>e.setAttribute('src',map.embed)}).on('[data-location-link]',{element:e=>e.setAttribute('href',map.view)});
  return html.transform(source);
}
export function renderProfileTemplate(source,data,{template,base,page=''}) {
  const titleField={living:'work1Title',detail:'work2Title',identity:'work1Title',digital:'work2Title',priorities:'insightTitle'}[page];
  const pageTitle=titleField?data[titleField]:profilePages[template][page];
  let html=new HTMLRewriter().on('.template-access',{element:e=>e.remove()})
    .on('title',{element:e=>e.setInnerContent((page?pageTitle+' | ':'')+data.businessName)})
    .on('meta[name="description"]',{element:e=>e.setAttribute('content',data.heroDescription)});
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
  const contact=number?'https://wa.me/'+number:data.email?'mailto:'+data.email:navigationHref(template,base,'contact');
  for(const n of [1,2,3,4]) html=html.on('[data-cms-menu="'+n+'"]',{element:e=>{
    if(!data['nav'+n+'Visible']){e.remove();return;}
    e.setInnerContent(data['nav'+n+'Label']);e.setAttribute('href',navigationHref(template,base,data['nav'+n+'Target']));
  }});
  html=html.on('[data-cms-nav-cta]',{element:e=>{
    if(!data.navCtaVisible){e.remove();return;}
    e.setInnerContent(data.navCtaLabel);e.setAttribute('href',contact);
  }}).on('.contact-button',{element:e=>{
    e.setInnerContent(data.contactLabel||'Hubungi kami');e.setAttribute('href',contact);
  }}).on('.footer-whatsapp',{element:e=>{
    if(!number&&!data.email){e.remove();return;}
    e.setInnerContent(number?data.whatsapp:data.email);e.setAttribute('href',contact);
  }}).on('[data-cms-copyright]',{element:e=>e.setInnerContent('© '+new Date().getUTCFullYear()+' '+data.businessName)});
  if(!data.navCtaVisible&&![1,2,3,4].some(n=>data['nav'+n+'Visible'])) for(const selector of ['.studio-menu','.studio-nav']) html=html.on(selector,{element:e=>e.setAttribute('hidden','')});
  return rewriteProfileLinks(html.transform(source),data,{template,base,page});
}
