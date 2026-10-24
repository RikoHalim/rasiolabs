import http from 'node:http';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {getBuildPaths} from './build-paths.mjs';

const {project,dist,concept}=await getBuildPaths();
const projectDistPrefix='/'+path.basename(project)+'/dist/';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon'};

export function resolvePreviewPath(rawUrl){
  const url=new URL(rawUrl,'http://localhost');
  let pathname=decodeURIComponent(url.pathname),base=dist;
  if(pathname==='/'||pathname==='/index.html')return path.join(dist,'index.html');
  if(pathname.startsWith('/UI Concepts/2026-10-14/')){
    if(!concept)throw new Error('Not found');
    base=concept;pathname=pathname.slice('/UI Concepts/2026-10-14'.length);
  }
  else if(pathname.startsWith('/rasio-web/dist/'))pathname=pathname.slice('/rasio-web/dist'.length);
  else if(pathname.startsWith(projectDistPrefix))pathname=pathname.slice(projectDistPrefix.length-1);
  else if(/^\/template-[a-z]+\/[a-z-]+\/?$/.test(pathname))pathname=pathname.replace(/\/$/,'').replace(/^(\/template-[a-z]+)\//,'$1-')+'.html';
  else if(/^\/template-[a-z]+\/?$/.test(pathname))pathname=pathname.replace(/\/$/,'')+'.html';
  else if(!path.extname(pathname))pathname+='.html';
  const file=path.resolve(base,pathname.replace(/^\//,''));
  const relative=path.relative(base,file);
  if(relative.startsWith('..')||path.isAbsolute(relative)||!types[path.extname(file)]||relative.split(path.sep).some(part=>part.startsWith('.'))||relative.startsWith('server'+path.sep))throw new Error('Not found');
  return file;
}

export function createPreviewServer(){
  return http.createServer(async(req,res)=>{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end('Static preview only.');return;}
    if(req.url.startsWith('/api/')){res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Backend tidak tersedia pada preview statis Sprint 1.'}));return;}
    try {
      const file=resolvePreviewPath(req.url),data=await readFile(file);
      res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
      res.end(req.method==='HEAD'?undefined:data);
    } catch {res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Halaman tidak tersedia pada preview lokal.');}
  });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.RASIO_PREVIEW_PORT||4184);
  const server=createPreviewServer();
  server.on('error',error=>{console.error(`Preview gagal: ${error.message}`);process.exitCode=1;});
  server.listen(port,'127.0.0.1',()=>console.log(`Rasio Labs: http://127.0.0.1:${port}/`));
}
