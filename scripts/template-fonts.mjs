import {readFile} from 'node:fs/promises';
const assets=JSON.parse(await readFile(new URL('./template-font-assets.json',import.meta.url),'utf8'));
const pairs={padel:['Barlow Condensed','Barlow']};
export function fontHead(family){
  const preload=(pairs[family]||[]).map((font,index)=>{
    const files=assets[font].filter(file=>file.style==='normal');
    const file=files.length>1?files.find(file=>file.weight===(index===0?'700':'400'))||files[0]:files[0];
    return '<link rel="preload" href="'+file.asset+'" as="font" type="font/woff2" crossorigin/>';
  }).join('');
  return preload+'<link rel="stylesheet" href="/template-fonts.css?v=labs61"/>';
}
