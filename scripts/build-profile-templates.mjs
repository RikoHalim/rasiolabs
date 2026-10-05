import {writeFile} from 'node:fs/promises';
import {profileTemplates} from '../server/profile-templates.mjs';
import {defaultsFor} from '../server/model.mjs';
import {profileBase,pageHref,navigationHref} from '../server/profile-pages.mjs';
import {templateFonts,modernHero} from './profile-modern-design.mjs';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const key of Object.keys(profileTemplates)) {
  const def=profileTemplates[key],d=defaultsFor(key),theme=key.toLowerCase(),base=profileBase(key);
  const text=(key,tag='span',attrs='')=>`<${tag} data-cms-field="${key}" ${attrs}>${esc(d[key])}</${tag}>`;
  const photo=(key,alt,attrs='')=>`<img data-cms-image="${key}" src="${esc(d[key])}" alt="${esc(alt)}" width="1400" height="1000" ${attrs}/>`;
  const link=(page,label,cls='text-link')=>`<a class="${cls}" data-site-page="${page}" href="${pageHref(base,page)}">${label}</a>`;
  const nav=[1,2,3,4].map(n=>`<a data-cms-menu="${n}" href="${navigationHref(key,base,d[`nav${n}Target`])}">${esc(d[`nav${n}Label`])}</a>`).join('');
  const html=`<!doctype html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${esc(def.title)} | Rasio Labs</title><meta name="description" content="${esc(d.heroDescription)}"/><meta name="theme-color" content="${key==='Padel'?'#153c2b':key==='Creative'?'#111410':key==='Architecture'?'#26352f':'#17263d'}"/><link rel="icon" href="/favicon.svg"/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=${templateFonts[key]}&display=swap" rel="stylesheet"/><link rel="stylesheet" href="/profile-templates.css?v=labs55"/></head>
<body class="profile-template template-home theme-${theme}"><a class="skip" href="#main">Skip to content</a><div class="template-access"><a href="/#template">← Koleksi template</a><a href="/order?type=profile&amp;template=${key}">Gunakan template</a></div>
<header class="studio-header"><div class="container header-row"><a class="studio-logo" data-site-page="" href="${base}" aria-label="Rasio Labs home"><img data-cms-image="logo" src="/assets/rasiolabs-logo.png" alt="Rasio Labs" width="128" height="50"/></a><button class="studio-menu" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="studio-nav"><span></span><span></span></button><nav id="studio-nav" class="studio-nav" aria-label="Main navigation">${nav}<a data-cms-nav-cta class="nav-contact" href="https://wa.me/60142317052">${esc(d.navCtaLabel)}</a></nav></div></header>
<main id="main">${modernHero(key,{t:text,pic:photo,link})}<!--template-home-start--><!--template-home-end-->
<section class="contact-section container" id="contact"><div>${text('contactTitle','h2')}</div><a class="contact-button" href="https://wa.me/60142317052">${esc(d.contactLabel)}</a></section></main>
<footer class="template-footer"><div class="container footer-main"><a class="studio-logo" data-site-page="" href="${base}"><img data-cms-image="logo" src="/assets/rasiolabs-logo.png" alt="Rasio Labs" width="128" height="50"/></a>${text('businessName','p')}<a class="footer-whatsapp" href="https://wa.me/60142317052" target="_blank" rel="noopener">+60142317052</a></div><div class="container footer-bottom"><span data-cms-copyright>© ${new Date().getUTCFullYear()} ${esc(d.businessName)}</span><a href="#top">Back to top</a></div></footer><script src="/profile-templates.js?v=labs55" defer></script></body></html>`;
  await writeFile('dist'+def.path,html);
}
console.log('Built four distinct modern Profile template homepages.');
