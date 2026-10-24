import {copyFile,readdir} from 'node:fs/promises';
import {templateCatalog} from '../server/template-catalog.mjs';
import {buildSelection} from './build-selection.mjs';

await buildSelection();
for(const {slug} of templateCatalog){
  const source=new URL('../templates/'+slug+'/pages/',import.meta.url);
  for(const file of await readdir(source)){
    if(file.endsWith('.html'))await copyFile(new URL(file,source),new URL('../dist/'+file,import.meta.url));
  }
}
console.log('Built active template pages from their approved sources.');
