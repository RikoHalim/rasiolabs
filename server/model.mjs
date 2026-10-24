import {profileTemplates,isProfileTemplate,templateAssets} from './profile-templates.mjs';
import {pageDefaults,pageFields,pageAssetPaths,mapLinks,profileExpansion,profilePages} from './profile-pages.mjs';
import {templateModules} from './templates/index.mjs';
import {getPlan} from './policy-v4.mjs';
export const durations = [1,12,24,48];
export const statuses = ['new','materials','building','review','active','cancelled'];
export const statusLabels = {new:'Pesanan baru',materials:'Menunggu materi',building:'Sedang disiapkan',review:'Siap ditinjau',active:'Website aktif',cancelled:'Dibatalkan'};
export function pricing(duration) {
  if (!durations.includes(duration)) throw new Error('Pilih durasi yang tersedia.');
  const plan=getPlan('profile',duration);
  return {monthly:plan.monthlyEquivalent,total:plan.totalPrice,renewalMonthly:null};
}
export const defaults=templateModules.Padel.defaults;
export const fields=templateModules.Padel.fields;
const navigationDefaults=Object.fromEntries(Object.entries(defaults).filter(([key])=>key.startsWith('nav')));
export const navigationTargets=fields.find(g=>g.id==='navbar').items.find(f=>f.type==='select').options;
export function defaultsFor(template='Padel') {
  if(!isProfileTemplate(template))throw new Error('Template tidak tersedia.');
  return {...templateModules[template].defaults};
}
export function fieldsFor(template='Padel') {
  if(!isProfileTemplate(template))throw new Error('Template tidak tersedia.');
  return structuredClone(templateModules[template].fields);
}
export const contentWithDefaults=(content,template='Padel')=>({...defaultsFor(template),...content});
export function validateOrder(b) {
  const clean=(key,min,max)=>{const s=typeof b[key]==='string'?b[key].trim():'';if(s.length<min||s.length>max)throw new Error(`Lengkapi ${key==='businessName'?'nama bisnis':key==='customerName'?'nama penanggung jawab':key}.`);return s;};
  if (b.consent!==true || b.service!=='profile' || !isProfileTemplate(b.template)) throw new Error('Periksa layanan dan template yang dipilih.');
  const whatsapp=clean('whatsapp',8,30);
  if(!/^[+\d\s().-]+$/.test(whatsapp)||whatsapp.replace(/\D/g,'').length<8||whatsapp.replace(/\D/g,'').length>15)throw new Error('Nomor WhatsApp tidak valid.');
  const email=typeof b.email==='string'?b.email.trim().toLowerCase():'';
  if(!email||email.length>150||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Isi email kontak yang valid untuk menerima akses login.');
  const domain=clean('domain',3,253).toLowerCase();
  if(!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.(com|id|co\.id)$/.test(domain))throw new Error('Pilih nama domain .com, .id, atau .co.id yang valid.');
  const duration=Number(b.duration);pricing(duration);
  return {businessName:clean('businessName',2,90),customerName:clean('customerName',2,100),whatsapp,email,domain,duration,template:b.template};
}
export function validateContent(input,template='Padel') {
  if (!input || typeof input!=='object' || Array.isArray(input)) throw new Error('Konten tidak valid.');
  const result={};
  const templateDefaults=defaultsFor(template);
  for(const group of fieldsFor(template))for(const f of group.items){
    const legacyDefault=Object.hasOwn(navigationDefaults,f.key)||Object.hasOwn(pageDefaults[template],f.key);
    const raw=input[f.key]===undefined&&legacyDefault?templateDefaults[f.key]:input[f.key];
    if(f.type==='boolean'){if(typeof raw!=='boolean')throw new Error(`${f.label} tidak valid.`);result[f.key]=raw;continue;}
    if(f.type==='select'){if(!f.options.some(option=>option.value===raw))throw new Error(`${f.label} tidak valid.`);result[f.key]=raw;continue;}
    const value=typeof raw==='string'?raw.trim():'';
    if(value.length>f.max)throw new Error(`${f.label} terlalu panjang.`);
    if(f.type==='image'&&!templateAssets.has(value)&&!pageAssetPaths.includes(value)&&!/^\/media\/[0-9a-f-]{36}$/.test(value))throw new Error(`Unggah ${f.label.toLowerCase()} yang valid.`);
    result[f.key]=value;
  }
  for(const n of [1,2,3,4])if(result[`nav${n}Visible`]&&!result[`nav${n}Label`])throw new Error(`Isi nama menu ${n}.`);
  if(result.navCtaVisible&&!result.navCtaLabel)throw new Error('Isi teks tombol WhatsApp.');
  if(!result.businessName||!result.heroTitle)throw new Error('Nama bisnis dan judul utama wajib diisi.');
  if(result.whatsapp&&(!/^[+\d\s().-]+$/.test(result.whatsapp)||!/^\d{8,15}$/.test(result.whatsapp.replace(/\D/g,''))))throw new Error('Nomor WhatsApp tidak valid.');
  if(result.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email))throw new Error('Email tidak valid.');
  if(Object.hasOwn(result,'locationLat')&&(!result.locationLat||!result.locationLon||!mapLinks(result)))throw new Error('Koordinat lokasi tidak valid.');
  return result;
}
export function imageMime(bytes) {
  if(bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)return 'image/jpeg';
  if([137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n))return 'image/png';
  if(String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return 'image/webp';
  return null;
}
