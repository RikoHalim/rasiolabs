import {profileTemplates,isProfileTemplate,templateAssets} from './profile-templates.mjs';
import {pageDefaults,pageFields,pageAssetPaths,mapLinks,profileExpansion} from './profile-pages.mjs';
export const durations = [1,12,24,48];
export const statuses = ['new','materials','building','review','active','cancelled'];
export const statusLabels = {new:'Pesanan baru',materials:'Menunggu materi',building:'Sedang disiapkan',review:'Siap ditinjau',active:'Website aktif',cancelled:'Dibatalkan'};
export function pricing(duration) {
  if (!durations.includes(duration)) throw new Error('Pilih durasi yang tersedia.');
  const monthly=Math.round(109000*(1-({1:0,12:.5,24:.7,48:.75}[duration])));
  return {monthly,total:monthly*duration,renewalMonthly:87200};
}
const groups = [
  ['brand','Identitas bisnis',[['businessName','Nama bisnis',90],['tagline','Bidang bisnis',100],['logo','Logo','image']]],
  ['hero','Halaman utama',[['heroTitle','Judul utama',140],['heroDescription','Deskripsi utama',400],['heroImage','Foto utama','image'],['heroNote','Keterangan foto',120]]],
  ['about','Tentang bisnis',[['aboutTitle','Judul tentang bisnis',160],['aboutLead','Paragraf pertama',800],['aboutBody','Paragraf berikutnya',1400]]],
  ['work','Portofolio',[['workTitle','Judul portofolio',160],['workDescription','Deskripsi portofolio',400],['work1Title','Nama proyek pertama',120],['work1Category','Kategori proyek pertama',120],['work1Description','Cerita proyek pertama',1200],['work1Image','Foto proyek pertama','image'],['work2Title','Nama proyek kedua',120],['work2Category','Kategori proyek kedua',120],['work2Description','Cerita proyek kedua',1200],['work2Image','Foto proyek kedua','image']]],
  ['services','Layanan',[['servicesTitle','Judul layanan',160],['servicesDescription','Pengantar layanan',600],...[1,2,3].flatMap(n=>[[`service${n}Title`,`Nama layanan ${n}`,100],[`service${n}Description`,`Deskripsi layanan ${n}`,800],[`service${n}Detail`,`Rincian layanan ${n}`,240]])]],
  ['process','Cara kerja',[['processTitle','Judul cara kerja',160],['processDescription','Pengantar cara kerja',400],...[1,2,3].flatMap(n=>[[`process${n}Title`,`Judul tahap ${n}`,100],[`process${n}Description`,`Deskripsi tahap ${n}`,800]])]],
  ['contact','Kontak',[['contactTitle','Judul ajakan menghubungi',160],['contactLabel','Teks tombol kontak',60],['whatsapp','Nomor WhatsApp',30],['email','Email bisnis',150]]]
];
export const navigationTargets=[{value:'top',label:'Beranda'},{value:'studio',label:'Tentang bisnis'},{value:'work',label:'Portofolio'},{value:'services',label:'Layanan'},{value:'process',label:'Cara kerja'},{value:'contact',label:'Kontak'},{value:'extra1',label:'Panduan pertama'},{value:'extra2',label:'Panduan kedua'}];
const navigationFields=[1,2,3,4].flatMap(n=>[
  {key:`nav${n}Visible`,label:`Tampilkan menu ${n}`,type:'boolean'},
  {key:`nav${n}Label`,label:`Nama menu ${n}`,type:'text',max:24},
  {key:`nav${n}Target`,label:`Tujuan menu ${n}`,type:'select',options:navigationTargets}
]);
navigationFields.push({key:'navCtaVisible',label:'Tampilkan tombol WhatsApp',type:'boolean'},{key:'navCtaLabel',label:'Teks tombol WhatsApp',type:'text',max:24},{key:'whatsapp',label:'Nomor WhatsApp',type:'text',max:30,placeholder:'+62 812 3456 7890'});
export const fields=groups.map(([id,label,items])=>({id,label,items:items.filter(([key])=>key!=='whatsapp').map(([key,label,size])=>({key,label,type:size==='image'?'image':size>=240?'textarea':'text',max:size==='image'?200:size}))}));
fields.splice(1,0,{id:'navbar',label:'Navbar',items:navigationFields});
const navigationDefaults={nav1Visible:true,nav1Label:'Our work',nav1Target:'work',nav2Visible:true,nav2Label:'The studio',nav2Target:'studio',nav3Visible:true,nav3Label:'Services',nav3Target:'services',nav4Visible:true,nav4Label:'Our process',nav4Target:'process',navCtaVisible:true,navCtaLabel:"Let's talk"};
export const defaults={
  ...navigationDefaults,
  businessName:'Architecture Studio',tagline:'Architecture & interior design',logo:'/assets/rasiolabs-logo.png',
  heroTitle:'Designed for\nbetter living.',heroDescription:'Thoughtful spaces that bring light, purpose, and a little more possibility to everyday life.',heroImage:'/assets/architecture-exterior.jpg',heroNote:'A closer connection to the spaces we call home.',
  aboutTitle:'Good design starts\nwith how you live.',aboutLead:'A favourite corner. The way morning light enters a room. Space to gather, and space to be yourself.',aboutBody:'We bring these everyday moments into the design process. From the first conversation to the smallest material detail, the aim is simple: create a place that feels right for the people who use it.',
  workTitle:'A little less ordinary.\nA lot more you.',workDescription:'A look at the spaces and details that shape our design perspective.',work1Title:'A place to slow down.',work1Category:'Residential / Interior design',work1Description:'A study in natural light, comfortable proportions, and materials that feel good to live with.',work1Image:'/assets/architecture-living.jpg',work2Title:'A fresh perspective.',work2Category:'Spatial design / Material study',work2Description:'An exploration of how light and material can change the way a space feels.',work2Image:'/assets/architecture-detail.jpg',
  servicesTitle:'From the whole space\nto the smallest detail.',servicesDescription:'One considered direction, carried through architecture, interiors, and the way everything comes together.',
  service1Title:'Architecture',service1Description:'Buildings shaped around people, place, and the way they connect.',service1Detail:'Concept design · Space planning · Design development',service2Title:'Interior design',service2Description:'Interiors that feel comfortable from the first day and continue to work over time.',service2Detail:'Residential · Hospitality · Workspaces',service3Title:'Renovation & renewal',service3Description:'A new chapter for an existing space. We identify what deserves to stay and where thoughtful changes can make room for better everyday use.',service3Detail:'Spatial review · Adaptive layouts · Material selection',
  processTitle:'An open conversation.\nA clear way forward.',processDescription:'Space to explore the possibilities, with a shared understanding at every stage.',process1Title:'First, we listen.',process1Description:'We talk about your routines, priorities, site, and budget to understand what your space needs to do.',process2Title:'Then, we explore.',process2Description:'Layouts, materials, and visual concepts help you see the possibilities and shape the direction together.',process3Title:'Make every detail count.',process3Description:'We develop the agreed design into a coordinated plan, ready for the next stage of your project.',contactTitle:"Let's make room\nfor your next chapter.",contactLabel:'Start a conversation',whatsapp:'',email:''
};
export function defaultsFor(template='Architecture') {
  if (!isProfileTemplate(template)) throw new Error('Template tidak tersedia.');
  return {...defaults,...profileTemplates[template].content,...pageDefaults[template]};
}
export function fieldsFor(template) {
  const labels={Padel:{about:'Tentang klub',work:'Lapangan & klub',services:'Program bermain',process:'Persiapan bermain'},Creative:{work:'Karya studio'},Consulting:{work:'Bidang fokus'}};
  const destinations={Padel:{studio:'Klub',work:'Lokasi klub',services:'Program bermain',process:'Founders',contact:'Kontak klub'},Creative:{work:'Karya studio',services:'Keahlian studio',process:'Project brief',contact:'Project brief'},Consulting:{studio:'Pendekatan',work:'Perspektif',services:'Keahlian',process:'Cara kerja'}};
  destinations[template]={...destinations[template],extra1:profileExpansion[template].pages[0].label,extra2:profileExpansion[template].pages[1].label};
  return [...fields.map(g=>({...g,label:labels[template]?.[g.id]||g.label,items:g.items.map(f=>f.type==='select'?{...f,options:f.options.map(option=>({...option,label:destinations[template]?.[option.value]||option.label}))}:f)})),...(pageFields[template]||[])];
}
export const contentWithDefaults=(content,template='Architecture')=>({...defaultsFor(template),...content});
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
export function validateContent(input,template='Architecture') {
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
  if(template==='Padel'&&(!result.locationLat||!result.locationLon||!mapLinks(result)))throw new Error('Koordinat lokasi tidak valid.');
  return result;
}
export function imageMime(bytes) {
  if(bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)return 'image/jpeg';
  if([137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n))return 'image/png';
  if(String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return 'image/webp';
  return null;
}
