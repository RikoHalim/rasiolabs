import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
  try{
    if(req.method!=='GET')throw Error('Read-only preview');
    let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';
    if(!path.extname(name))name+='.html';
    const file=path.resolve(root,name),relative=path.relative(root,file);
    if(relative.startsWith('..')||path.isAbsolute(relative)||!types[path.extname(file)])throw Error('Not found');
    const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store'});res.end(data);
  }catch{res.writeHead(404);res.end('Preview only — no backend transaction');}
}).listen(4185,'127.0.0.1',()=>console.log('Policy source preview http://127.0.0.1:4185'));
