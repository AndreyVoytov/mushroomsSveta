// Package selected ImageGen paintings without tiling or altering their composition.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('./arcane-art-runtime.cjs')('sharp');
const root=path.resolve(__dirname,'..'),art=path.join(root,'artwork/field-polish-2026-10-19');
const selected=JSON.parse(fs.readFileSync(path.join(art,'generation-results.json'),'utf8'));
const output=path.join(root,'assets/arcane/levels');
async function bounds(file){const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});let left=info.width,top=info.height,right=-1,bottom=-1;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>12){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
 if(right<left)throw Error('Empty artwork: '+file);return {left,top,width:right-left+1,height:bottom-top+1};}
(async()=>{fs.mkdirSync(output,{recursive:true});fs.mkdirSync(path.join(art,'sources'),{recursive:true});const applied=[];
 for(const item of selected){const local=path.join(art,'sources',item.id+'.png');fs.copyFileSync(item.source,local);
  let data,relative;
  if(item.id==='water-cover'){
   const box=await bounds(item.source),reference=path.join(root,'assets/base/hex/hex.png'),target=await sharp(reference).metadata(),footprint=await bounds(reference);
   const hex=await sharp(item.source).extract(box).resize(footprint.width,footprint.height,{fit:'fill'}).png().toBuffer();
   data=await sharp({create:{width:target.width,height:target.height,channels:4,background:'#00000000'}})
    .composite([{input:hex,left:footprint.left,top:footprint.top}]).png({compressionLevel:9}).toBuffer();relative='assets/arcane/levels/water-cover-v1.png';
  }else{
   const meta=await sharp(item.source).metadata();if(Math.abs(meta.height/meta.width-3)>.025)throw Error(item.id+' must be one tall 1:3 painting');
   data=await sharp(item.source).removeAlpha().webp({quality:92,effort:5}).toBuffer();relative='assets/arcane/levels/'+item.id+'-v1.webp';
  }
  fs.writeFileSync(path.join(root,relative),data);const meta=await sharp(data).metadata();
  applied.push({id:item.id,file:relative,source:'artwork/field-polish-2026-10-19/sources/'+item.id+'.png',tool:'image_gen',width:meta.width,height:meta.height,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});
 }
 fs.writeFileSync(path.join(art,'applied-assets.json'),JSON.stringify(applied,null,2)+'\n');console.log(JSON.stringify(applied.map(({id,width,height,bytes})=>({id,width,height,bytes})),null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
