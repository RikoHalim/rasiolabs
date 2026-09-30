import { cp, mkdir, readdir } from 'node:fs/promises';
await mkdir('dist/client',{recursive:true});
for (const entry of await readdir('dist',{withFileTypes:true})) {
  if (['client','server','.openai'].includes(entry.name)) continue;
  await cp(`dist/${entry.name}`,`dist/client/${entry.name}`,{recursive:true});
}
await mkdir('dist/server',{recursive:true});
await cp('server/worker.mjs','dist/server/index.js');
await cp('server/model.mjs','dist/server/model.mjs');
await mkdir('dist/.openai',{recursive:true});
await cp('.openai/hosting.json','dist/.openai/hosting.json');
await cp('drizzle','dist/.openai/drizzle',{recursive:true});
console.log('Built Rasio Worker, client pages, and database migrations.');
