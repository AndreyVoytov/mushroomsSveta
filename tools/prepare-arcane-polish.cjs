// Normalize the selected ImageGen state variant to the existing logical canvases.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),sharp=require('./arcane-art-runtime.cjs')('sharp');
const root=path.resolve(__dirname,'..'),art=path.join(root,'artwork/arcane-reskin/iteration-4');
const source=require(path.join(art,'generation-results.json'))[0];
async function bounds(file){const{data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});let l=info.width,t=info.height,r=0,b=0;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>12){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}return{left:l,top:t,width:r-l+1,height:b-t+1};}
(async()=>{const crop=await bounds(source.source),trim=await sharp(source.source).extract(crop).png().toBuffer(),rows=[];
 for(const file of ['assets/base/hex/hexDark.png','assets/base/hex/hexHouseDark.png']){
  const target=path.join(root,file),backup=path.join(root,'.local-workbench/ui-v4/before',file);if(!fs.existsSync(backup)){fs.mkdirSync(path.dirname(backup),{recursive:true});fs.copyFileSync(target,backup);}
  const meta=await sharp(backup).metadata(),box=await bounds(backup),sprite=await sharp(trim).resize(box.width,box.height,{fit:'fill'}).png().toBuffer();
  const data=await sharp({create:{width:meta.width,height:meta.height,channels:4,background:'#00000000'}}).composite([{input:sprite,left:box.left,top:box.top}]).png({palette:true,colours:256,dither:.15,effort:9}).toBuffer();fs.writeFileSync(target,data);
  rows.push({file,sourceId:source.id,width:meta.width,height:meta.height,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex'),tool:source.tool,adaptation:'Trim alpha margin and fit original visible footprint; original canvas retained.'});
 }
 fs.writeFileSync(path.join(art,'applied-assets.json'),JSON.stringify(rows,null,2)+'\n');console.log('Prepared pale inactive covers:',JSON.stringify(rows));
})().catch(e=>{console.error(e);process.exitCode=1;});
