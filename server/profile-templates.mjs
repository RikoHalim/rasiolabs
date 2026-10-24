import {templateModules} from './templates/index.mjs';
import {templateCatalog} from './template-catalog.mjs';
export const profileTemplates = Object.fromEntries(templateCatalog.map(({id})=>[id,templateModules[id].definition]));
export const isProfileTemplate = key => typeof key==='string' && Object.hasOwn(profileTemplates,key);
export const templateAssets = new Set(['/assets/rasiolabs-logo.png','/assets/rasio-logo.png',...Object.values(templateModules).flatMap(t=>Object.values(t.defaults).filter(v=>typeof v==='string'&&v.startsWith('/assets/')))]);
