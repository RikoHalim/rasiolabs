import {readFile,writeFile,cp,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project=fileURLToPath(new URL('../../',import.meta.url));
const evidence=path.dirname(fileURLToPath(import.meta.url));
const digest=value=>createHash('sha256').update(value).digest('hex');
const before=JSON.parse(await readFile(path.join(evidence,'integrity-before.json'),'utf8'));
const files={};
for(const file of Object.keys(before.files))files[file]=digest(await readFile(path.join(project,file)));
const home=await readFile(path.join(project,'dist/index.html'),'utf8');
const sections={};
for(const [id,next] of [['hero','included'],['rasio-ai','harga'],['harga','transparansi']]){
  const start=home.indexOf('<section',home.lastIndexOf('<section',home.indexOf(`id="${id}"`)));
  const end=home.lastIndexOf('<section',home.indexOf(`id="${next}"`));
  sections[id]=digest(home.slice(start,end));
}
const changed=[...Object.keys(files).filter(file=>files[file]!==before.files[file]),...Object.keys(sections).filter(id=>sections[id]!==before.sections[id]).map(id=>'section:'+id)];
if(changed.length)throw new Error('Protected scope changed: '+changed.join(', '));

await mkdir(path.join(project,'dist/client/marketing'),{recursive:true});
const outputs=['index.html','rasio-profile.html','rasio-store.html','rasio-custom.html','selection.js','checkout-selection.js','template-selection.js','template-catalog.js','policy-v4.js','policy-flow.js','checkout-v4.html'];
for(const file of await readdir(path.join(project,'dist/marketing')))outputs.push('marketing/'+file);
for(const file of outputs)await cp(path.join(project,'dist',file),path.join(project,'dist/client',file));
const clientMatches=[];
for(const file of outputs){
  const source=digest(await readFile(path.join(project,'dist',file)));
  const copy=digest(await readFile(path.join(project,'dist/client',file)));
  if(source!==copy)throw new Error('Client output differs: '+file);
  clientMatches.push(file);
}
await writeFile(path.join(evidence,'integrity-after.json'),JSON.stringify({files,sections,protectedScopeUnchanged:true,clientMatches},null,2)+'\n');
console.log(`Protected files and homepage sections unchanged; ${clientMatches.length} client outputs synchronized and byte-checked.`);
