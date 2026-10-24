import {getPlan} from './policy-v4.js';
import {templateCatalog} from './template-catalog.js';

const fields={type:'service',template:'template',duration:'months'};
const durations=new Set(['1','12','24','48']);
export function readSelection(input){
  const url=new URL(input, 'http://rasio.local');
  const raw=[...url.searchParams].filter(([key])=>Object.hasOwn(fields,key));
  const errors=[];
  for(const key of Object.keys(fields))if(url.searchParams.getAll(key).length>1)errors.push({field:key,message:'Pilihan pada tautan berulang. Pilih kembali paket Anda.'});
  const type=url.searchParams.get('type'),id=url.searchParams.get('template'),duration=url.searchParams.get('duration');
  const service=['profile','store','custom'].includes(type)?type:'';
  const template=templateCatalog.find(item=>item.id===id);
  const months=durations.has(duration)?Number(duration):null;
  if(type!==null&&!service)errors.push({field:'type',message:'Layanan pada tautan tidak tersedia.'});
  if(id!==null&&!template)errors.push({field:'template',message:'Template pada tautan tidak tersedia.'});
  if(template&&service&&template.service!==service)errors.push({field:'template',message:'Template tidak sesuai dengan layanan yang dipilih.'});
  if(duration!==null&&!months)errors.push({field:'duration',message:'Durasi pada tautan tidak tersedia. Pilih 1, 12, 24, atau 48 bulan.'});
  const plan=!errors.length&&['profile','store'].includes(service)&&months?getPlan(service,months):null;
  return {service,template:template?.id||'',months,errors,raw,plan,complete:!!(plan&&(service!=='profile'||template))};
}

export function selectionHref(target,selection,base='http://rasio.local'){
  const url=new URL(target,base);
  for(const key of Object.keys(fields))url.searchParams.delete(key);
  if(selection.raw){for(const [key,value] of selection.raw)url.searchParams.append(key,value);}
  else for(const [key,field] of Object.entries(fields))if(selection[field]!==null&&selection[field]!==undefined&&selection[field]!=='')url.searchParams.set(key,String(selection[field]));
  return url.href;
}

export function chooseSelection(selection,changes){
  const url=new URL(selectionHref('/',selection));
  for(const [key,field] of Object.entries(fields))if(Object.hasOwn(changes,field)){
    url.searchParams.delete(key);
    if(changes[field]!==null&&changes[field]!=='')url.searchParams.set(key,String(changes[field]));
  }
  return readSelection(url);
}

export function recoverySelection(selection){
  return {service:selection.service,template:selection.template&&(!selection.service||templateCatalog.find(t=>t.id===selection.template)?.service===selection.service)?selection.template:'',months:selection.months};
}

export const homeHref=(selection,hash,base)=>selectionHref('/#'+hash,selection,base);
