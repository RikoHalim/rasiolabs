import {templateModules} from './templates/index.mjs';
const collect=key=>Object.fromEntries(Object.entries(templateModules).map(([id,data])=>[id,data[key]]));
export const profilePages=collect('pages');
export const pageFields=collect('pageFields');
export const pageDefaults=collect('pageDefaults');
export const profileExpansion=collect('expansion');
export const profileStatistics=collect('statistics');
export const pageAssetPaths=Object.values(pageDefaults).flatMap(values=>Object.values(values).filter(v=>typeof v==='string'&&v.startsWith('/assets/')));
export const hasProfilePage=(template,page='')=>Object.hasOwn(profilePages,template)&&Object.hasOwn(profilePages[template],page);
export const profileAsset=(template,page='')=>hasProfilePage(template,page)?'/template-'+template.toLowerCase()+(page?'-'+page:'')+'.html':null;
export const profileBase=template=>'/template-'+template.toLowerCase();
export const pageHref=(base,page='')=>base+(page?'/'+page:'');
export const navigationHref=(template,base,target)=>pageHref(base,target?.startsWith('page:')&&hasProfilePage(template,target.slice(5))?target.slice(5):templateModules[template]?.targets[target]??'');
export function mapLinks(data){
  if(!String(data.locationLat??'').trim()||!String(data.locationLon??'').trim())return null;
  const lat=Number(data.locationLat),lon=Number(data.locationLon);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return null;
  const bounds=[lon-.015,lat-.01,lon+.015,lat+.01].join(',');
  return {embed:'https://www.openstreetmap.org/export/embed.html?bbox='+encodeURIComponent(bounds)+'&layer=mapnik&marker='+lat+'%2C'+lon,view:'https://www.openstreetmap.org/?mlat='+lat+'&mlon='+lon+'#map=15/'+lat+'/'+lon};
}
export function statisticsPreviewFor(template){
  return Object.fromEntries(profileStatistics[template].items.flatMap(([value,label],index)=>[['stat'+(index+1)+'Value',value],['stat'+(index+1)+'Label',label]]));
}
