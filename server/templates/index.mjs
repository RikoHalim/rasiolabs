import * as hospitality from './hospitality.mjs';
import * as catering from './catering.mjs';
import * as logistics from './logistics.mjs';
export const businessTemplates=Object.fromEntries([hospitality,catering,logistics].map(module=>[module.key,module]));
export const businessContentKeys=Object.fromEntries(Object.entries(businessTemplates).map(([key,module])=>{
 const keys=new Set(['businessName','tagline','logo','email','whatsapp','contactLabel']);
 const ctx={data:module.definition.content,t:(field)=>{keys.add(field);return '';},pic:(field)=>{keys.add(field);return '';},link:()=>'',enquiry:()=>''};
 for(const page of Object.keys(module.pages))module.renderPage(page,ctx);
 return [key,keys];
}));
