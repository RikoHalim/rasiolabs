import {readFile,writeFile,readdir} from 'node:fs/promises';
import {fontHead} from './template-fonts.mjs';
export const rebrand=text=>text
  .replace(/Rasio Agency/gi,'Rasio Labs')
  .replace(/rasioagency/g,'rasiolabs')
  .replaceAll('bersama rasio.','bersama Rasio Labs.')
  .replace(/\brasio\.(?=["'<\s])/g,'Rasio Labs.')
  .replace(/Rasio AI/gi,'RasioLabs AI')
  .replace(/Rasio (Profile|Store|Custom)/gi,'RasioLabs $1')
  .replace(/\b(?:Rasio|RASIO)\b(?! Labs|LABS|Labs|[-_.%])/g,'Rasio Labs')
  .replace(/Rasio%20Agency/gi,'Rasio%20Labs')
  .replace(/Rasio%2[Cc]/g,'Rasio%20Labs%2C')
  .replaceAll('#0c56fc','#0c55fc')
  .replaceAll('#2353e1','#0c55fc').replaceAll('#2353E1','#0C55FC')
  .replaceAll('#1739a4','#1237b0');
// Apply also after template generation so generated pages share the current brand.
for(const entry of await readdir('dist',{withFileTypes:true})){
  if(!entry.isFile()||!/\.(html|css|js|svg)$/.test(entry.name))continue;
  const path='dist/'+entry.name;
  let source=rebrand(await readFile(path,'utf8'));
  source=source.replace(/(template-(?:architecture|padel|creative|consulting|hospitality|catering|logistics)-preview)\.(?:png|jpg)(?:\?v=[^"\s<>]+)?/g,'$1.jpg?v=labs61');
  if(entry.name.endsWith('.html')){
    source=source.replaceAll('/assets/rasio-logo.png','/assets/rasiolabs-logo.png');
    source=source.replace(/<link[^>]*href="\/template-brand\.css[^>]*>/g,'');
    source=source.replace(/(\.(?:css|js)\?v=)[^"\s<>]+/g,'$1labs55');
    const businessTemplate=/^template-(hospitality|catering|logistics)(?:-|\.)/.test(entry.name);
    const fontFamily=entry.name.match(/^template-(architecture|padel|creative|consulting|hospitality|catering|logistics)(?:-|\.)/)?.[1];
    if(fontFamily){
      source=source.replace(/<link[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com|\/template-fonts\.css|\/assets\/fonts\/)[^>]*>/g,'');
      source=source.replace('</head>',fontHead(fontFamily)+'</head>');
    }
    const css=entry.name.startsWith('template-')?'profile-brand':'rasiolabs';
    if(!source.includes('/'+css+'.css'))source=source.replace('</head>','<link rel="stylesheet" href="/'+css+'.css?v=labs55"/></head>');
    if(entry.name.startsWith('template-')&&!businessTemplate){
      if(!source.includes('/template-refine.css'))source=source.replace('</head>','<link rel="stylesheet" href="/template-refine.css?v=labs55"/></head>');
      if(!source.includes('/template-modern.css'))source=source.replace('</head>','<link rel="stylesheet" href="/template-modern.css?v=labs55"/></head>');
      if(!source.includes('/template-signatures.css'))source=source.replace('</head>','<link rel="stylesheet" href="/template-signatures.css?v=labs61"/></head>');
      if(!source.includes('/profile-pages.js'))source=source.replace('</body>','<script src="/profile-pages.js?v=labs55" defer></script></body>');
      if(!source.includes('/template-motion.js'))source=source.replace('</body>','<script src="/template-motion.js?v=labs55" defer></script></body>');
    }else if(!businessTemplate&&!['admin.html','cms.html','order.html'].includes(entry.name)&&!source.includes('/clean-layout.css'))source=source.replace('</head>','<link rel="stylesheet" href="/clean-layout.css?v=labs55"/></head>');
    if(entry.name.startsWith('template-')&&!source.includes('data-nojs-contact'))source=source.replace('</head>','<noscript data-nojs-contact><style>[data-enquiry],[data-business-enquiry],[data-volume-calculator],[data-prep-builder],.studio-menu{display:none!important}</style></noscript></head>').replace('<main','<noscript><p style="padding:16px 24px;margin:0;background:#fff;color:#182d38">Use the business contact link in the footer to send an enquiry.</p></noscript><main');
    source=source.replace(/(\/clean-layout\.css\?v=)[^"\s<>]+/g,'$1labs59');
    source=source.replace(/(\/template-modern\.css\?v=)[^"\s<>]+/g,'$1labs61');
    source=source.replace(/(\/template-motion\.js\?v=)[^"\s<>]+/g,'$1labs57');
    source=source.replace(/(\/hero\.js\?v=)[^"\s<>]+/g,'$1labs60');
    source=source.replace(/(\/(?:profile-pages\.js|order\.js|business-templates\.(?:css|js)|template-validation\.js|template-legacy-expansion\.css|template-(?:hospitality|catering|logistics)\.css)\?v=)[^"\s<>]+/g,'$1labs61');
    source=source.replace(/(\/checkout-v18\.css\?v=)[^"\s<>]+/g,'$1labs56');
    source=source.replace(/(\/portal\.css\?v=)[^"\s<>]+/g,'$1labs56');
    source=source.replace(/<link rel="icon"[^>]*>/,'<link rel="icon" href="/assets/rasiolabs-mark.svg" type="image/svg+xml"/>');
  }
  await writeFile(path,source);
}

