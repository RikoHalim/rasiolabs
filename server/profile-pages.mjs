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

export const profileExpansion={
  Architecture:{homeTitle:'Before the first drawing.',homeLead:'Turn the way you live into a clearer project brief.',pages:[
    {slug:'planning',label:'Plan your space',title:'Plan your space.',lead:'A useful brief begins with everyday life: what works, what gets in the way, and what your space needs to become.',image:'work1Image',alt:'Natural light in a residential interior',modules:[
      ['Start with your day.','Describe how you use the space now. Include the routines, people, and moments the design needs to accommodate. Think about the parts of your day that deserve more room.'],
      ['Set the priorities.','Separate essentials from possibilities. Share the budget range, timing, and constraints so the first conversation has a clear starting point. A short list of priorities is more useful than a long list of references.'],
      ['Bring the context.','Gather photographs, available drawings, and a few references. Explain what you like about each reference: the light, layout, materials, or feeling. Bring questions about the site as well as ideas for the design.']
    ]},
    {slug:'renovation',label:'Renovation & renewal',title:'A new chapter for your space.',lead:'Understand what deserves to stay and what needs to work differently.',image:'materialsImage',alt:'Material samples for architecture and interiors',modules:[
      ['Keep what matters.','Identify the qualities you value: a generous window, a familiar room, or a material with character. These can become the starting point for a space that feels renewed without losing its identity.'],
      ['Look beyond the finish.','Consider movement, storage, light, and the relationship between rooms before choosing surface treatments. The most useful changes often begin with how a space works rather than how it looks.'],
      ['Define the scope.','List the rooms involved and how the work may affect daily use. Share available information about the building so the team can discuss what needs to be assessed before developing a design.']
    ]}
  ]},
  Padel:{homeTitle:'Find your way onto court.',homeLead:'New to the game or bringing your people? Start here.',pages:[
    {slug:'first-game',label:'Your first game',title:'Your first game starts here.',lead:'A few simple details help the club find a suitable introduction to the court.',image:'equipmentImage',alt:'Padel rackets and balls ready for a game',modules:[
      ['Choose a starting point.','Tell the team whether you are trying padel for the first time, returning to sport, or bringing experience from another racket game. Your starting point helps shape a suitable introduction.'],
      ['Get the details.','Ask what equipment you need, what the session includes, and how the club confirms your place. Check practical details before arriving so you can focus on enjoying your first game.'],
      ['Bring a friend—or ask.','Let the team know whether you already have playing partners. Ask about coaching or social sessions if you are coming on your own. Share your experience and the kind of game you are looking for.']
    ]},
    {slug:'group-play',label:'Group play',title:'Make room for your group.',lead:'Bring friends or colleagues together around a shared game.',image:'communityImage',alt:'Padel players sharing a game on a blue court',modules:[
      ['Tell us about your group.','Share the number of people, their experience, and whether the aim is a relaxed introduction or time to play together. A clear group brief helps the team discuss a suitable format.'],
      ['Choose the kind of session.','Discuss court time, coaching, or social play with the team. The right format depends on your group and the arrangements available. Include any preferences that would help everyone feel comfortable taking part.'],
      ['Confirm the plan.','Ask about timing, equipment, costs, and club requirements before making plans. Your session is confirmed directly with the team. Keep the group informed once the arrangements are agreed.']
    ]}
  ]},
  Creative:{homeTitle:'Think beyond the launch.',homeLead:'Clarify the direction, then make it practical for the people using it.',pages:[
    {slug:'brand-foundations',label:'Brand foundations',title:'Get clear before getting visual.',lead:'A strong visual direction starts with a shared understanding of the business.',image:'brandingImage',alt:'Brand strategy and visual direction on a desk',modules:[
      ['What do you offer?','Describe the offer in plain language. Make clear who it helps and what people need to understand first. A focused description gives the design work a useful starting point.'],
      ['What makes it yours?','Identify the choices, values, and character that distinguish the business. Use real examples rather than a list of broad adjectives. The most useful brand stories connect what you say with what you do.'],
      ['Where must it work?','List the places the brand appears: a website, packaging, social content, presentations, or physical spaces. These touchpoints help shape a connected visual system with practical uses in mind.']
    ]},
    {slug:'brand-handover',label:'Brand handover',title:'A brand built for everyday use.',lead:'The final direction needs to make sense to the people who use it.',image:'work1Image',alt:'Colour, texture and visual language for a brand',modules:[
      ['Understand the system.','A clear guide connects the logo, typography, colour, imagery, and voice. The aim is to help each touchpoint feel part of the same brand, even when different people are working on it.'],
      ['Know the essentials.','Discuss the file formats, templates, and guidance your team needs. Agree on the handover scope as part of the project. A useful handover reflects the ways the brand will actually be used.'],
      ['Keep it consistent.','Choose who maintains the brand assets and where the team can find them. A shared source makes everyday decisions easier and helps new work build on the established direction.']
    ]}
  ]},
  Consulting:{homeTitle:'Where would a clearer view help?',homeLead:'Start with a decision to make or a process that needs attention.',pages:[
    {slug:'business-review',label:'Business review',title:'See the business more clearly.',lead:'Connect your goals with the evidence available today.',image:'work1Image',alt:'A team discussing business direction',modules:[
      ['Define the decision.','Start with the question the review needs to answer. A focused decision helps determine which information matters. Describe the choices you are considering and the uncertainties that affect them.'],
      ['Bring the evidence.','Gather relevant plans, customer feedback, operating information, and observations from the team. Identify where information is incomplete. Keep assumptions visible so they can be examined alongside the evidence.'],
      ['Agree on the next step.','Compare the options, assumptions, and trade-offs. Turn the chosen direction into actions with clear ownership and a review point. Decide what the team needs to learn as the work progresses.']
    ]},
    {slug:'operations-review',label:'Operations review',title:'Follow the work. Find the friction.',lead:'Understand how work moves through the business before deciding what to change.',image:'workshopImage',alt:'A team mapping a workflow with sticky notes',modules:[
      ['Map a real workflow.','Choose one recurring piece of work and trace it from request to completion. Include the people, information, and decisions involved. Start with what happens in practice rather than what the process is supposed to look like.'],
      ['Inspect the handoffs.','Look for waiting, repeated questions, and unclear ownership. Ask the people doing the work where the process becomes difficult. Connect their observations with specific stages of the workflow.'],
      ['Test a practical change.','Choose a manageable improvement and agree on what the team will observe. Review the effect before extending the change. Use what you learn to decide whether to refine, continue, or try another approach.']
    ]}
  ]}
};
for(const [template,expansion] of Object.entries(profileExpansion)){
  pageDefaults[template].expansionTitle=expansion.homeTitle;
  pageDefaults[template].expansionLead=expansion.homeLead;
  const items=[['expansionTitle','Judul panduan',160],['expansionLead','Pengantar panduan',400]];
  expansion.pages.forEach((p,i)=>{
    const prefix='extra'+(i+1);
    profilePages[template][p.slug]=p.label;
    targets[template][prefix]=p.slug;
    Object.assign(pageDefaults[template],{[prefix+'Title']:p.title,[prefix+'Lead']:p.lead});
    items.push([prefix+'Title',p.label+': judul',160],[prefix+'Lead',p.label+': pengantar',600]);
    p.modules.forEach(([title,body],n)=>{
      pageDefaults[template][prefix+'Heading'+(n+1)]=title;
      pageDefaults[template][prefix+'Body'+(n+1)]=body;
      items.push([prefix+'Heading'+(n+1),p.label+': poin '+(n+1),100],[prefix+'Body'+(n+1),p.label+': isi '+(n+1),1000]);
    });
  });
  pageFields[template].push(group('guides','Panduan & informasi',items));
}

export const profileHomeContent={
  Architecture:[
    {title:'Spaces designed around everyday living.',lead:'The most useful design decisions begin with how you move, gather, rest, and spend time at home.',image:'/assets/architecture-living.jpg',link:'Explore our spaces',items:[
      ['Room to gather.','Connected spaces make it easier to share a meal, welcome friends, and spend time together without losing the quieter parts of the home.'],
      ['A quieter corner.','A place to read, work, or pause deserves the same care as the main living area. Privacy, acoustics, and a comfortable scale shape its character.'],
      ['Light through the day.','We consider the orientation and use of each room, so natural light becomes part of daily life rather than an afterthought.']
    ]},
    {title:'Bring light, texture, and proportion into balance.',lead:'A considered material palette connects the overall space with the details you experience up close.',image:'/assets/profile-architecture-materials.jpg',link:'Explore our design process',items:[
      ['Texture','Materials influence how a room feels to touch and live in. We consider their character alongside maintenance and everyday use.'],
      ['Light','Surfaces respond differently to daylight and artificial light. Looking at them together helps make the palette feel coherent.'],
      ['Proportion','The relationship between openings, furniture, and finishes gives a space its rhythm. Small adjustments can make it feel more comfortable.']
    ]}
  ],
  Padel:[
    {title:'GET READY FOR YOUR NEXT RALLY.',lead:'A few details help the team find a way to play that suits you.',image:'/assets/profile-padel-action.jpg',link:'Explore ways to play',items:[
      ['Find your level.','Tell us whether you are picking up a racket for the first time, returning to the court, or looking for a more challenging game.'],
      ['Choose your format.','Explore court sessions, coaching, and social play. Share whether you are coming on your own, with a partner, or with a group.'],
      ['Confirm the details.','Speak with the club about timing, equipment, and arrangements before your visit. The team will help you prepare for your chosen session.']
    ]},
    {title:'GOOD GAMES START WITH GOOD QUESTIONS.',lead:'Plan your visit before you step onto the court.',image:'/assets/profile-padel-equipment.jpg',link:'Plan your first game',items:[
      ['Can I come without a partner?','Yes, you can ask the club about a suitable way to join. Share your experience and preferred format so the team can discuss the options with you.'],
      ['What equipment should I bring?','Wear comfortable sports clothing and suitable footwear. Check with the club about rackets, balls, and any requirements for your session.'],
      ['How is my session confirmed?','Contact the team with your preferred session and date. The club confirms the available arrangements directly before you visit.']
    ]}
  ],
  Creative:[
    {title:'Build a connected brand across every touchpoint.',lead:'Direction, identity, and digital design work best when they share the same idea.',image:'/assets/profile-creative-branding.jpg',link:'Explore our capabilities',items:[
      ['Brand direction','Define what the business needs to communicate, who it needs to reach, and the character that makes the direction its own.'],
      ['Visual identity','Connect typography, colour, imagery, and graphic details into a visual language that works across different formats.'],
      ['Digital experience','Bring that language into a website with a clear structure, useful content, and a considered path through the experience.']
    ]},
    {title:'How we move an idea from conversation to launch.',lead:'A shared brief keeps the creative work focused while leaving room to explore.',image:'/assets/profile-creative-detail.jpg',link:'Start your project brief',items:[
      ['Understand the brief.','We begin with the business, audience, and places the work needs to appear. Together, we define the question the project needs to answer.'],
      ['Explore the direction.','References, early concepts, and a visual direction help us discuss the choices. Your feedback shapes how the idea develops.'],
      ['Make it ready to use.','We refine the agreed direction and prepare the assets and guidance within the project scope, so the team can use the work with clarity.']
    ]}
  ],
  Consulting:[
    {title:'Move from a business question to a shared plan.',lead:'Make space for the evidence, the people doing the work, and the decisions that need to be made.',image:'/assets/profile-consulting-detail.jpg',link:'See how we work',items:[
      ['Understand the context.','We listen to the question, review the available information, and speak with the people closest to the work.'],
      ['Focus the priorities.','We compare the options and trade-offs, then identify what needs attention first and where more information would help.'],
      ['Agree on a next step.','The team leaves with a direction to discuss, actions to own, and a point at which to review what has been learned.']
    ]},
    {title:'Make the next step tangible for your team.',lead:'Useful support gives people a clearer way to move the work forward.',image:'/assets/profile-consulting-workshop.jpg',link:'Discuss your current priority',items:[
      ['A clearer question.','A focused brief that names the decision, the constraints, and the information needed to evaluate the options.'],
      ['A practical direction.','Priorities and actions connected to the way your business operates, rather than a plan detached from day-to-day work.'],
      ['A shared next step.','Clear ownership and a review point agreed with the team, so decisions can be revisited as new information becomes available.']
    ]}
  ]
};
for(const [template,sections] of Object.entries(profileHomeContent)){
  const items=[];
  sections.forEach((section,index)=>{
    const prefix='home'+(index+1);
    Object.assign(pageDefaults[template],{[prefix+'Title']:section.title,[prefix+'Lead']:section.lead,[prefix+'Image']:section.image,[prefix+'Link']:section.link});
    items.push([prefix+'Title','Bagian '+(index+1)+': judul',160],[prefix+'Lead','Bagian '+(index+1)+': pengantar',400],[prefix+'Image','Bagian '+(index+1)+': gambar','image'],[prefix+'Link','Bagian '+(index+1)+': teks tautan',60]);
    section.items.forEach(([title,body],i)=>{
      pageDefaults[template][prefix+'Item'+(i+1)+'Title']=title;
      pageDefaults[template][prefix+'Item'+(i+1)+'Body']=body;
      items.push([prefix+'Item'+(i+1)+'Title','Bagian '+(index+1)+': poin '+(i+1),100],[prefix+'Item'+(i+1)+'Body','Bagian '+(index+1)+': isi '+(i+1),600]);
    });
  });
  pageFields[template].push(group('home-stories','Section beranda',items));
}
