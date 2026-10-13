import {writeFile} from 'node:fs/promises';
import {businessTemplates} from '../server/templates/index.mjs';
import {defaultsFor} from '../server/model.mjs';
import {profileBase,profileAsset,pageHref,navigationHref} from '../server/profile-pages.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const [key,module] of Object.entries(businessTemplates)){
 const data=defaultsFor(key),base=profileBase(key),family=key.toLowerCase();
 const titleFields=Object.entries(data).filter(([field,value])=>field.endsWith('Title')&&typeof value==='string'&&value.trim()).sort((a,b)=>b[1].length-a[1].length);
 const topicBinding=topic=>{
  const field=titleFields.find(([,value])=>value===topic)?.[0];
  return field?`data-cms-topic-key="${esc(field)}"`:'';
 };
 const labelBinding=label=>{
  const match=titleFields.find(([,value])=>label.includes(value));
  if(!match)return '';
  const [field,value]=match,index=label.indexOf(value);
  return `data-cms-link-label-key="${esc(field)}" data-cms-link-label-prefix="${esc(label.slice(0,index))}" data-cms-link-label-suffix="${esc(label.slice(index+value.length))}"`;
 };
 const t=(field,tag='span',attrs='')=>`<${tag} data-cms-field="${field}" ${attrs}>${esc(data[field])}</${tag}>`;
 const pic=(field,alt,attrs='')=>`<img data-cms-image="${field}" src="${esc(data[field])}" alt="${esc(alt)}" ${/\bwidth=/.test(attrs)?'':'width="1600" height="1100"'} ${/\bloading=/.test(attrs)?'':'loading="lazy"'} ${attrs}/>`;
 const link=(page,label,cls='action',topic='')=>`<a class="${cls}" data-site-page="${esc(page)}" href="${pageHref(base,page)}" ${labelBinding(label)} ${topic?'data-enquiry-topic="'+esc(topic)+'" '+topicBinding(topic):''}>${esc(label)}</a>`;
 const enquiry=({kind,topics,fields=[],messageLabel='Your enquiry'})=>`<form class="enquiry-form" data-business-enquiry data-kind="${esc(kind)}" data-whatsapp="60142317052"><div class="form-two"><label>Your name<input name="name" autocomplete="name" maxlength="90" required/></label><label>Email<input name="email" type="email" autocomplete="email" maxlength="150" required/></label></div><label>Interested in<select name="topic">${topics.map(topic=>`<option ${topicBinding(topic)}>${esc(topic)}</option>`).join('')}</select></label><div class="enquiry-details">${fields.map((field,index)=>{
   const {label,type='text',required=false,min,max,options=[],step=Number.isInteger(min??0)?1:.1}=field;
   const attrs=`name="${esc(label)}" data-enquiry-detail ${required?'required':''}`;
   const control=type==='textarea'?`<textarea ${attrs} rows="3" maxlength="${max||1200}"></textarea>`:type==='select'?`<select ${attrs}>${options.map(option=>`<option>${esc(option)}</option>`).join('')}</select>`:`<input ${attrs} type="${type}" ${min!==undefined?'min="'+min+'"':''} ${type==='number'?'step="'+step+'"':''} ${max!==undefined&&type==='number'?'max="'+max+'"':''} ${type==='text'?'maxlength="'+(max||240)+'"':''}/>`;
   return `<label>${esc(label)}${control}</label>`;
 }).join('')}</div><label>${esc(messageLabel)}<textarea name="message" rows="4" maxlength="2500"></textarea></label><button class="action" type="submit">Review enquiry</button><div class="enquiry-status" data-enquiry-status role="status" aria-live="polite"></div><noscript><p>Send your enquiry using the contact link in the footer.</p></noscript></form>`;
 const nav=[1,2,3,4].map(n=>`<a data-cms-menu="${n}" href="${navigationHref(key,base,data['nav'+n+'Target'])}">${esc(data['nav'+n+'Label'])}</a>`).join('');
 const fonts=module.definition.fonts.startsWith('family=')?module.definition.fonts:'family='+module.definition.fonts;
 for(const [page,label] of Object.entries(module.pages)){
  const main=module.renderPage(page,{data,t,pic,link,enquiry})+'<script src="/template-validation.js?v=labs61" defer></script>';
  const html=`<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${esc(label)} | ${esc(data.businessName)}</title><meta name="description" content="${esc(data.heroDescription)}"/><link rel="icon" href="/assets/rasiolabs-mark.svg"/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap"/><link rel="stylesheet" href="/business-templates.css?v=labs61"/><link rel="stylesheet" href="/template-${family}.css?v=labs61"/></head><body class="business-template profile-template theme-${family} ${page?'template-subpage':'template-home'}"><a class="skip" href="#main">Skip to content</a><div class="template-access"><a href="/#template">← Koleksi template</a><a href="/order?type=profile&amp;template=${key}">Gunakan template</a></div><header class="studio-header"><div class="container header-inner"><a class="studio-logo" data-site-page="" href="${base}">${pic('logo',data.businessName,'loading="eager" width="220" height="64"')}</a><button type="button" class="studio-menu" aria-label="Open navigation" aria-controls="studio-navigation" aria-expanded="false">Menu</button><nav id="studio-navigation" class="studio-nav" aria-label="Main navigation">${nav}<a class="action nav-contact" data-cms-nav-cta href="${navigationHref(key,base,'contact')}">${esc(data.navCtaLabel)}</a></nav></div></header><main id="main">${main}</main><footer class="business-footer"><div class="container"><div class="footer-brand">${t('businessName','strong')}${t('tagline','p')}<a class="footer-whatsapp" href="https://wa.me/60142317052">+60142317052</a></div><nav aria-label="Footer navigation">${Object.entries(module.pages).map(([route,title])=>link(route,title,'footer-page')).join('')}</nav><div class="footer-bottom"><small data-cms-copyright>© ${new Date().getUTCFullYear()} ${esc(data.businessName)}</small><a class="contact-button" href="https://wa.me/60142317052">${esc(data.contactLabel)}</a></div></div></footer><script src="/profile-templates.js?v=labs61" defer></script><script src="/profile-pages.js?v=labs61" defer></script><script type="module" src="/business-templates.js?v=labs61"></script></body></html>`;
  await writeFile('dist'+profileAsset(key,page),html);
 }
}
console.log('Built '+Object.keys(businessTemplates).length+' business template families with '+Object.values(businessTemplates).reduce((total,module)=>total+Object.keys(module.pages).length,0)+' working pages.');
