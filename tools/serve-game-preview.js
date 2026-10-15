const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),port=Number(process.env.GAME_PREVIEW_PORT||8893);
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ogg':'audio/ogg','.mp3':'audio/mpeg','.woff':'font/woff'};
http.createServer((req,res)=>{
    let p;try{p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch(_){res.writeHead(400).end();return;}
    const mapped=p==='/'?'build/index.html':p.startsWith('/js/')?'build'+p:p.slice(1);
    let file=path.resolve(root,mapped);
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);}catch(_){res.writeHead(404).end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log('Game preview: http://127.0.0.1:'+port+'/'));
