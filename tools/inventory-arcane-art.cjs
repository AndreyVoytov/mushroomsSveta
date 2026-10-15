const fs=require('fs'),path=require('path');
const sharp=require('./arcane-art-runtime.cjs')('sharp');
(async()=>{
 const actors=fs.readdirSync('assets/base/characters').filter(p=>/^(cat|sveta)\d\.png$/.test(p)).map(p=>'assets/base/characters/'+p)
 .concat(fs.readdirSync('assets/additional/characters').filter(p=>/\.png$/.test(p)).map(p=>'assets/additional/characters/'+p),['assets/chapter1/forest/cat3floar.png','assets/chapter1/forest/sveta2_mushrooms.png']);
 const backgrounds=fs.readdirSync('assets/screens').filter(p=>/Bg\.png$/.test(p)).map(p=>'assets/screens/'+p);
 const headers=['assets/base/ui/forestHeader1.png','assets/minigame1/mountinesHeader.png','assets/minigame3/forestHeader2.png','assets/minigame4/lakeHeader.png','assets/minigame5/flowersFieldHeader.png','assets/minigame6/junglesHeader.png','assets/minigame7/bugForestHeader.png','assets/minigame8/snailForestHeader.png','assets/minigame9/cloverHeader.png','assets/minigame10/hiveheader.png'];
 const extras=['assets/base/room/boiler/boiler.png','assets/base/ui/progressbar/forestHeader.png','assets/base/ui/progressbar/potionsHeader.png','assets/base/ui/diary.png','assets/base/ui/tasks.png'];
 const all=[];
 for(const [kind,files] of Object.entries({actors,backgrounds,headers,extras})){
  const layers=[],cw=260,ch=kind==='backgrounds'?450:290,cols=kind==='actors'?6:5;
  for(let i=0;i<files.length;i++){
   const file=files[i],meta=await sharp(file).metadata(),stats=await sharp(file).stats();
   const transparent=!!stats.channels[3]&&stats.channels[3].min<255;
   let bounds={left:0,top:0,width:meta.width,height:meta.height};
   if(transparent){const trim=await sharp(file).trim().toBuffer({resolveWithObject:true});bounds={left:Math.abs(trim.info.trimOffsetLeft||0),top:Math.abs(trim.info.trimOffsetTop||0),width:trim.info.width,height:trim.info.height};}
   const id=(kind==='backgrounds'?'scene-':kind==='headers'?'header-':'')+path.basename(file,'.png');
   all.push({id,kind,file,width:meta.width,height:meta.height,transparent,bounds});
   const thumb=await sharp(file).resize({width:cw-14,height:ch-34,fit:'inside'}).png().toBuffer({resolveWithObject:true});
   const x=(i%cols)*cw,y=Math.floor(i/cols)*ch;
   layers.push({input:thumb.data,left:x+Math.floor((cw-thumb.info.width)/2),top:y+28});
   layers.push({input:Buffer.from('<svg width="260" height="27"><rect width="260" height="27" fill="#fff9e7"/><text x="6" y="18" font-size="14">'+path.basename(file)+'</text></svg>'),left:x,top:y});
  }
  await sharp({create:{width:cw*cols,height:ch*Math.ceil(files.length/cols),channels:4,background:'#e9e2d1'}}).composite(layers).png().toFile('.local-workbench/arcane-references/inventory-'+kind+'.png');
 }
 fs.writeFileSync('artwork/arcane-reskin/asset-manifest.json',JSON.stringify(all,null,2));
 console.log('Art inventory',all.length,Object.fromEntries(['actors','backgrounds','headers','extras'].map(k=>[k,all.filter(a=>a.kind===k).length])));
})().catch(e=>{console.error(e);process.exitCode=1;});
