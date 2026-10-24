import {readFile,writeFile,mkdir,copyFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {renderHomepage} from '../frontend/marketing/homepage.mjs';
import {renderCustomerPolicies} from '../frontend/marketing/policies.mjs';
import {renderServicePages} from '../frontend/marketing/service-pages.mjs';
import {buildSelection} from './build-selection.mjs';
import {getBuildPaths,relativeUrlPrefix} from './build-paths.mjs';

await buildSelection();

const {project,dist,concept}=await getBuildPaths();
const source=path.join(project,'frontend/marketing');
const outputs=[
  {dir:dist,home:'index.html',asset:'assets/',page:file=>file,template:slug=>`template-${slug}.html`}
];
if(concept){
  const prefix=relativeUrlPrefix(concept,dist);
  outputs.push({dir:concept,home:'index-v3.html',asset:prefix+'assets/',page:file=>prefix+file,template:slug=>`${prefix}template-${slug}.html`});
}
for(const output of outputs){
  const destination=path.join(output.dir,'marketing');await mkdir(destination,{recursive:true});
  for(const file of await readdir(path.join(source,'styles'))){
    const css=await readFile(path.join(source,'styles',file),'utf8');
    await writeFile(path.join(destination,file),css.replaceAll('__ASSET__','../'+output.asset));
  }
  for(const file of ['homepage.js','pricing.js','interactions.js','motion.js','service-links.js','service-page.js'])await copyFile(path.join(source,file),path.join(destination,file));
  await copyFile(path.join(project,'server/policy-v4.mjs'),path.join(destination,'policy-v4.js'));
  const routes={...output,policy:file=>file,service:file=>file};
  await writeFile(path.join(output.dir,output.home),renderHomepage(routes));
  for(const [file,html] of renderServicePages(routes))await writeFile(path.join(output.dir,file),html);
  for(const [file,html] of renderCustomerPolicies(output))await writeFile(path.join(output.dir,file),html);
}
console.log(`Built homepage and selection continuity in dist${concept?' and the configured concept preview':''}; no policy document regeneration.`);
