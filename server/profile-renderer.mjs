export function renderProfileTemplate(source,data) {
  let html=new HTMLRewriter()
    .on('.template-access',{element:e=>e.remove()})
    .on('title',{element:e=>e.setInnerContent(data.businessName)})
    .on('meta[name="description"]',{element:e=>e.setAttribute('content',data.heroDescription)});
  for(const [key,value] of Object.entries(data)) {
    if(typeof value!=='string') continue;
    html=html.on(`[data-cms-field="${key}"]`,{element:e=>e.setInnerContent(value)});
  }
  for(const key of ['logo','heroImage','work1Image','work2Image']) html=html.on(`[data-cms-image="${key}"]`,{element:e=>{
    e.setAttribute('src',data[key]);
    e.setAttribute('alt',key==='logo'?data.businessName:data[key==='heroImage'?'heroTitle':key==='work1Image'?'work1Title':'work2Title']);
  }});
  const number=data.whatsapp.replace(/\D/g,'');
  const contact=number?`https://wa.me/${number}`:data.email?`mailto:${data.email}`:'#contact';
  for(const n of [1,2,3,4]) html=html.on(`[data-cms-menu="${n}"]`,{element:e=>{
    if(!data[`nav${n}Visible`]){e.remove();return;}
    e.setInnerContent(data[`nav${n}Label`]);e.setAttribute('href','#'+data[`nav${n}Target`]);
  }});
  html=html.on('[data-cms-nav-cta]',{element:e=>{
    if(!data.navCtaVisible){e.remove();return;}
    e.setInnerContent(data.navCtaLabel);e.setAttribute('href',contact);
  }}).on('.contact-button',{element:e=>{
    e.setInnerContent(data.contactLabel||'Hubungi kami');e.setAttribute('href',contact);
  }}).on('.footer-whatsapp',{element:e=>{
    if(!number&&!data.email){e.remove();return;}
    e.setInnerContent(number?data.whatsapp:data.email);e.setAttribute('href',contact);
  }}).on('[data-cms-copyright]',{element:e=>e.setInnerContent(`© ${new Date().getUTCFullYear()} ${data.businessName}`)});
  if(!data.navCtaVisible&&![1,2,3,4].some(n=>data[`nav${n}Visible`])) for(const selector of ['.studio-menu','.studio-nav']) html=html.on(selector,{element:e=>e.setAttribute('hidden','')});
  return html.transform(source);
}
