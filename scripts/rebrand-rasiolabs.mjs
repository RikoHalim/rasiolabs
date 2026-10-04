import {readFile,writeFile,readdir} from 'node:fs/promises';
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
  source=source.replace(/(template-(?:architecture|padel|creative|consulting)-preview)\.(?:png|jpg)(?:\?v=[^"\s<>]+)?/g,'$1.jpg?v=labs50');
  if(entry.name.endsWith('.html')){
    source=source.replaceAll('/assets/rasio-logo.png','/assets/rasiolabs-logo.png');
    source=source.replace(/<link[^>]*href="\/template-brand\.css[^>]*>/g,'');
    source=source.replace(/(\.(?:css|js)\?v=)[^"\s<>]+/g,'$1labs50');
    const css=entry.name.startsWith('template-')?'profile-brand':'rasiolabs';
    if(!source.includes('/'+css+'.css'))source=source.replace('</head>','<link rel="stylesheet" href="/'+css+'.css?v=labs50"/></head>');
    source=source.replace(/<link rel="icon"[^>]*>/,'<link rel="icon" href="/assets/rasiolabs-mark.svg" type="image/svg+xml"/>');
  }
  await writeFile(path,source);
}
