// Reuse the approved character artwork in every small portrait of that character.
const fs=require('fs'),path=require('path');
const sharp=require('./arcane-art-runtime.cjs')('sharp');
const root=path.resolve(__dirname,'..');
async function portrait(source,box,size){
 const picture=await sharp(path.join(root,source)).extract(box).resize(size,size,{fit:'cover'}).png().toBuffer();
 const mask=Buffer.from('<svg width="'+size+'" height="'+size+'"><circle cx="'+size/2+'" cy="'+size/2+'" r="'+size/2+'" fill="white"/></svg>');
 return sharp({create:{width:size,height:size,channels:4,background:'#cdd4b3'}}).composite([{input:picture},{input:mask,blend:'dest-in'}]).png().toBuffer();
}
(async()=>{
 const records=[];
 for(const spec of [
  {file:'assets/base/ui/character/character_menu_icon.png',source:'assets/base/characters/sveta1.png',box:{left:160,top:97,width:274,height:274}},
  {file:'assets/base/action/cat.png',source:'assets/base/characters/cat1.png',box:{left:50,top:15,width:250,height:250}},
  {file:'assets/base/ui/map/cat.png',source:'assets/base/characters/cat1.png'},
  {file:'assets/base/ui/map/catSad.png',source:'assets/base/characters/cat2.png'},
  {file:'assets/base/items/catHex.png',source:'assets/base/characters/cat1.png'}
 ]){
  const target=path.join(root,spec.file),meta=await sharp(target).metadata();
  const input=spec.box?await portrait(spec.source,spec.box,Math.max(meta.width,meta.height)):await sharp(path.join(root,spec.source)).trim().png().toBuffer();
  const out=await sharp(input).resize(meta.width,meta.height,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
  await fs.promises.writeFile(target,out);records.push({file:spec.file,source:spec.source,width:meta.width,height:meta.height});
 }
 const background=await sharp(path.join(root,'assets/screens/forestHouseBg.png')).resize(512,512,{fit:'cover',position:'top'}).blur(2).png().toBuffer();
 const cat=await sharp(path.join(root,'assets/base/characters/cat1.png')).trim().resize(472,472,{fit:'inside'}).png().toBuffer({resolveWithObject:true});
 const border=Buffer.from('<svg width="512" height="512"><rect x="8" y="8" width="496" height="496" rx="76" fill="none" stroke="#c5a36a" stroke-width="12"/></svg>');
 await sharp(background).composite([{input:cat.data,left:Math.floor((512-cat.info.width)/2),top:512-cat.info.height},{input:border}]).png().toFile(path.join(root,'assets/other/arcane-project-icon.png'));
 fs.writeFileSync(path.join(root,'artwork/arcane-reskin/derived-icons.json'),JSON.stringify(records,null,2));
 console.log('Derived five consistent portraits and the project cover.');
})().catch(e=>{console.error(e);process.exitCode=1;});
