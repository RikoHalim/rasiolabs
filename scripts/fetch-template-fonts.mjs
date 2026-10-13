import {mkdir,writeFile} from 'node:fs/promises';

const fonts=[['DM Serif Display','ital@0;1'],['Manrope','wght@400..700'],['Barlow','wght@400;500;600;700'],['Barlow Condensed','wght@600;700;800'],['Space Grotesk','wght@400..700'],['Work Sans','wght@400..600'],['Plus Jakarta Sans','wght@400..700'],['Fraunces','opsz,wght@9..144,400..500'],['DM Sans','wght@400..600'],['Newsreader','ital,wght@0,400..600;1,400..500'],['Hanken Grotesk','wght@400..700'],['Archivo','wght@400..700'],['Archivo Narrow','wght@600..700']];
const headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'};
await mkdir('dist/assets/fonts',{recursive:true});
const faces=[],manifest={};
for(const [family,axes] of fonts){
  const license=await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/'+family.toLowerCase().replaceAll(' ','')+'/OFL.txt');
  if(!license.ok)throw new Error('Missing font license: '+family);
  await writeFile('dist/assets/fonts/'+family.toLowerCase().replaceAll(' ','-')+'-OFL.txt',await license.text());
  const url='https://fonts.googleapis.com/css2?family='+family.replaceAll(' ','+')+':'+axes+'&display=optional';
  const response=await fetch(url,{headers});
  if(!response.ok)throw new Error('Font stylesheet: '+family+' '+response.status);
  const css=await response.text();
  const blocks=[...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)].map(match=>match[1]);
  if(!blocks.length)throw new Error('Missing latin font: '+family);
  manifest[family]=[];
  for(const [index,face] of blocks.entries()){
    const remote=face.match(/url\(([^)]+)\)/)?.[1];
    if(!remote)throw new Error('Missing font URL');
    const asset='/assets/fonts/'+family.toLowerCase().replaceAll(' ','-')+'-'+index+'.woff2';
    const file=await fetch(remote);if(!file.ok)throw new Error('Font download: '+family);
    await writeFile('dist'+asset,Buffer.from(await file.arrayBuffer()));
    faces.push(face.replace(remote,asset));
    manifest[family].push({asset,weight:face.match(/font-weight:\s*([^;]+)/)?.[1],style:face.match(/font-style:\s*([^;]+)/)?.[1]});
  }
}
await writeFile('dist/template-fonts.css',faces.join('\n'));
await writeFile('scripts/template-font-assets.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Downloaded local Latin fonts for '+fonts.length+' typefaces.');
