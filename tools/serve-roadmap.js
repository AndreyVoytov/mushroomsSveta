const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.ROADMAP_PORT) || 4180;
const types = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml' };
http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400);res.end('Bad request');return; }
  if(pathname==='/'){res.writeHead(302,{Location:'/roadmap/'});res.end();return;}
  if(pathname==='/roadmap'){res.writeHead(302,{Location:'/roadmap/'});res.end();return;}
  if(pathname.startsWith('/roadmap/'))pathname='/docs'+pathname;
  if(pathname.startsWith('/mechanics/'))pathname='/docs'+pathname;
  if(pathname.endsWith('/'))pathname+='index.html';
  const file=path.resolve(root,'.'+pathname);
  const allowed=['docs/roadmap','docs/mechanics','assets'].some(folder=>{
    const boundary=path.join(root,folder)+path.sep;return file.startsWith(boundary);
  });
  if(!allowed){res.writeHead(403);res.end('Forbidden');return;}
  fs.stat(file,(error,stat)=>{
    if(error||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-cache'});
    fs.createReadStream(file).pipe(res);
  });
}).listen(port,'127.0.0.1',()=>console.log(`Game design roadmap: http://127.0.0.1:${port}/roadmap/`));
