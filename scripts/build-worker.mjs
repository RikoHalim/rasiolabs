import { cp, mkdir, readdir } from 'node:fs/promises';
import './build-profile-templates.mjs';
await import('./build-profile-pages.mjs');
await import('./build-business-templates.mjs');
await import('./rebrand-rasiolabs.mjs');
await mkdir('dist/client',{recursive:true});
for (const entry of await readdir('dist',{withFileTypes:true})) {
  if (['client','server','.openai'].includes(entry.name)) continue;
  await cp(`dist/${entry.name}`,`dist/client/${entry.name}`,{recursive:true});
}
await mkdir('dist/server',{recursive:true});
await cp('server/worker.mjs','dist/server/index.js');
await cp('server/model.mjs','dist/server/model.mjs');
await cp('server/client-auth.mjs','dist/server/client-auth.mjs');
await cp('server/domains.mjs','dist/server/domains.mjs');
await cp('server/profile-templates.mjs','dist/server/profile-templates.mjs');
await cp('server/profile-renderer.mjs','dist/server/profile-renderer.mjs');
await cp('server/profile-pages.mjs','dist/server/profile-pages.mjs');
await cp('server/templates','dist/server/templates',{recursive:true});
await mkdir('dist/.openai',{recursive:true});
await cp('.openai/hosting.json','dist/.openai/hosting.json');
await cp('drizzle','dist/.openai/drizzle',{recursive:true});
console.log('Built Rasio Worker, client pages, and database migrations.');
