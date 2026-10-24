import {copyFile,mkdir,readFile,writeFile} from 'node:fs/promises';
import {constants} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {getBuildPaths,relativeUrlPrefix} from './build-paths.mjs';

const files=[
  ['frontend/selection.js','selection.js'],
  ['frontend/checkout-selection.js','checkout-selection.js'],
  ['frontend/template-selection.js','template-selection.js'],
  ['server/policy-v4.mjs','policy-v4.js'],
  ['server/template-catalog.mjs','template-catalog.js'],
];

export async function buildSelection(){
  const {project,dist,concept,destinations}=await getBuildPaths();
  for(const destination of destinations){
    await mkdir(destination,{recursive:true});
    for(const [source,target] of files)await copyFile(path.join(project,source),path.join(destination,target));
  }
  if(concept){
    await copyFile(path.join(dist,'policy-flow.js'),path.join(concept,'policy-flow.js'));
    try{await copyFile(path.join(dist,'checkout-v4.html'),path.join(concept,'checkout-v4.html'),constants.COPYFILE_EXCL);}
    catch(error){if(error.code!=='EEXIST')throw error;}
    const policyCss=(await readFile(path.join(dist,'policy-v4.css'),'utf8')).replaceAll('assets/fonts/',relativeUrlPrefix(concept,dist)+'assets/fonts/');
    try{await writeFile(path.join(concept,'policy-v4.css'),policyCss,{flag:'wx'});}
    catch(error){if(error.code!=='EEXIST')throw error;}
  }
  console.log('Built selection continuity modules and synchronized existing checkout behavior.');
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await buildSelection();
