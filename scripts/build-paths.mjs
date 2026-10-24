import {stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

export async function getBuildPaths({project=projectRoot,env=process.env}={}){
  project=path.resolve(project);
  const dist=path.join(project,'dist');
  const configured=env.RASIO_CONCEPT_DIR?.trim();
  let concept=configured?path.resolve(project,configured):null;
  if(!configured){
    const workspaceConcepts=path.resolve(project,'../UI Concepts');
    try{
      if((await stat(workspaceConcepts)).isDirectory())concept=path.join(workspaceConcepts,'2026-10-14');
    }catch(error){
      if(!['ENOENT','ENOTDIR'].includes(error.code))throw error;
    }
  }
  if(concept===dist)throw new Error('RASIO_CONCEPT_DIR must be different from dist.');
  return {project,dist,concept,destinations:concept?[dist,concept]:[dist]};
}

export function relativeUrlPrefix(from,to){
  const relative=path.relative(from,to).split(path.sep).join('/');
  return relative?relative+'/':'./';
}
