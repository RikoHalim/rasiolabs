// Page structure belongs to the selected template; CMS content cannot change routes.
export const profilePages = {
  Architecture: {'':'Home',studio:'The studio',projects:'Selected spaces',living:'A place to slow down',detail:'Material perspectives',process:'Our process',contact:'Project enquiry'},
  Padel: {'':'Home',club:'The club & founders',play:'Ways to play',visit:'Visit the club'},
  Creative: {'':'Home',work:'Selected work',identity:'Identity study',digital:'Digital direction',studio:'The studio',brief:'Project brief'},
  Consulting: {'':'Home',expertise:'Our expertise',approach:'How we work',insights:'Perspectives',priorities:'Choosing your next priority',contact:'Business enquiry'}
};
const targets = {
  Architecture:{top:'',studio:'studio',work:'projects',services:'process#services',process:'process',contact:'contact'},
  Padel:{top:'',studio:'club',work:'visit',services:'play',process:'club#founders',contact:'visit#enquiry'},
  Creative:{top:'',studio:'studio',work:'work',services:'studio#capabilities',process:'brief',contact:'brief'},
  Consulting:{top:'',studio:'approach',work:'insights',services:'expertise',process:'approach',contact:'contact'}
};
export const hasProfilePage=(template,page='')=>Object.hasOwn(profilePages,template)&&Object.hasOwn(profilePages[template],page);
export const profileAsset=(template,page='')=>hasProfilePage(template,page)?'/template-'+template.toLowerCase()+(page?'-'+page:'')+'.html':null;
export const profileBase=template=>'/template-'+template.toLowerCase();
export const pageHref=(base,page='')=>base+(page?'/'+page:'');
export const navigationHref=(template,base,target)=>pageHref(base,targets[template]?.[target]??'');
export function mapLinks(data) {
  const lat=Number(data.locationLat),lon=Number(data.locationLon);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return null;
  const bounds=[lon-.015,lat-.01,lon+.015,lat+.01].join(',');
  return {embed:'https://www.openstreetmap.org/export/embed.html?bbox='+encodeURIComponent(bounds)+'&layer=mapnik&marker='+lat+'%2C'+lon,
    view:'https://www.openstreetmap.org/?mlat='+lat+'&mlon='+lon+'#map=15/'+lat+'/'+lon};
}
const group=(id,label,items)=>({id,label,items:items.map(([key,label,max])=>({key,label,max:max==='image'?200:max,type:max==='image'?'image':max>=240?'textarea':'text'}))});
export const pageFields={
  Architecture:[group('projectDetail','Detail proyek',[
    ['project1Context','Latar proyek pertama',1400],['project2Context','Latar proyek kedua',1400],['materialsImage','Foto material','image'],['materialsDescription','Cerita material',800]
  ])],
  Padel:[group('club','Klub & founders',[
    ['founder1Name','Nama founder pertama',90],['founder1Role','Peran founder pertama',90],['founder1Bio','Cerita founder pertama',800],
    ['founder2Name','Nama founder kedua',90],['founder2Role','Peran founder kedua',90],['founder2Bio','Cerita founder kedua',800],
    ['communityImage','Foto komunitas','image'],['playImage','Foto aktivitas','image'],['equipmentImage','Foto perlengkapan','image']
  ]),group('location','Lokasi klub',[
    ['locationName','Nama lokasi',100],['locationAddress','Alamat',240],['locationHours','Jam operasional',160],
    ['locationLat','Latitude peta',30],['locationLon','Longitude peta',30]
  ])],
  Creative:[group('caseStudies','Studi kasus',[
    ['case1Challenge','Identity: tantangan',1200],['case1Direction','Identity: arah desain',1200],['case1Deliverables','Identity: hasil desain',1200],
    ['case2Challenge','Digital: tantangan',1200],['case2Direction','Digital: arah desain',1200],['case2Deliverables','Digital: hasil desain',1200],
    ['brandingImage','Foto arah branding','image']
  ])],
  Consulting:[group('insights','Artikel perspektif',[
    ['insightTitle','Judul artikel',160],['insightLead','Pengantar artikel',600],
    ['insight1','Isi: tentukan masalah',1400],['insight2','Isi: periksa hambatan',1400],['insight3','Isi: pilih langkah',1400],
    ['workshopImage','Foto workshop','image']
  ])]
};
export const pageDefaults={
  Architecture:{project1Context:'An interior shaped around unhurried mornings, shared evenings, and the everyday need for a little breathing room. Natural light leads the layout, while simple materials give the space a warm, quiet character.',project2Context:'A material study exploring the relationship between light, texture, and proportion. The focus is on how a small set of considered choices can give a space its own identity.',materialsImage:'/assets/profile-architecture-materials.jpg',materialsDescription:'We compare texture, colour, and finish in the same conversation as light and everyday use. A material should feel right in the space, not only on a sample board.'},
  Padel:{founder1Name:'The club founder',founder1Role:'Club direction',founder1Bio:'A simple starting point: create a place where the first game feels as welcoming as the hundredth. The club is built around good courts, thoughtful sessions, and the people who bring them to life.',founder2Name:'The community founder',founder2Role:'Player experience',founder2Bio:'The best part of a game often happens between rallies. Our community direction focuses on introductions, shared sessions, and making room for every level of player.',communityImage:'/assets/profile-padel-community.jpg',playImage:'/assets/profile-padel-action.jpg',equipmentImage:'/assets/profile-padel-equipment.jpg',locationName:'Jakarta, Indonesia',locationAddress:'Jakarta, Indonesia',locationHours:'Contact the club for opening hours and court availability.',locationLat:'-6.2088',locationLon:'106.8456'},
  Creative:{case1Challenge:'Give a growing business a clear identity without losing the personality that made it interesting in the first place.',case1Direction:'Start with the brand story, explore a focused visual territory, and connect typography, colour, and imagery into one coherent direction.',case1Deliverables:'A visual identity system, a practical brand guide, and a set of launch touchpoints that work together.',case2Challenge:'Help visitors understand the offer, find the right information, and take the next step with confidence.',case2Direction:'Organise the content around real visitor questions. Use a clear hierarchy, considered imagery, and a consistent visual language.',case2Deliverables:'A website design direction, responsive page layouts, and a content framework for the team to build on.',brandingImage:'/assets/profile-creative-branding.jpg'},
  Consulting:{insightTitle:'Choosing your next business priority.',insightLead:'When everything feels urgent, a clearer question can be more useful than a longer to-do list.',insight1:'Start with the decision you need to make. Describe what is happening today, who it affects, and what would look different if the issue were resolved. Separate the evidence from the assumptions before deciding what to change.',insight2:'Follow the work from beginning to end. Where does it wait? Where is ownership unclear? Ask the people doing the work what information they need and which handoffs create repeated questions.',insight3:'Choose one action with a clear owner and an observable result. Agree on what to review and when to review it. A small, well-understood change gives the team a useful basis for deciding what comes next.',workshopImage:'/assets/profile-consulting-workshop.jpg'}
};
export const pageAssetPaths=Object.values(pageDefaults).flatMap(values=>Object.values(values).filter(v=>v.startsWith('/assets/')));
