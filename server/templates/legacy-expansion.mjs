import {templateModules} from './index.mjs';
export const legacyExpansion=Object.fromEntries(Object.entries(templateModules).map(([id,data])=>[id,data.legacy]));
