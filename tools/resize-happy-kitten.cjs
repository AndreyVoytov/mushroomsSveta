// Normalize the existing pose; preserve its drawing, aspect ratio and alpha.
const fs=require('fs'),path=require('path'),sharp=require('./arcane-art-runtime.cjs')('sharp');
const root=path.resolve(__dirname,'..'),relative='assets/base/characters/cat4.png',target=path.join(root,relative);
(async()=>{
 const reference=await sharp(path.join(root,'assets/base/characters/cat1.png')).metadata();
 const backup=path.join(root,'.local-workbench/dialog-polish/cat4-original.png');fs.mkdirSync(path.dirname(backup),{recursive:true});if(!fs.existsSync(backup))fs.copyFileSync(target,backup);
 const png=await sharp(backup).resize(reference.width,reference.height,{fit:'contain',position:'bottom',background:'#00000000'}).png({compressionLevel:9}).toBuffer();fs.writeFileSync(target,png);
 const atlasPath=path.join(root,'assets/atlases/base-0.json'),atlas=JSON.parse(fs.readFileSync(atlasPath,'utf8'));
 if(Object.keys(atlas.frames).length!==1||!atlas.frames['base/characters/cat4.png'])throw Error('Dedicated kitten atlas changed; use the atlas packer.');
 const frame=atlas.frames['base/characters/cat4.png'];Object.assign(frame.frame,{x:1,y:1,w:reference.width,h:reference.height});Object.assign(frame.spriteSourceSize,{x:0,y:0,w:reference.width,h:reference.height});Object.assign(frame.sourceSize,{w:reference.width,h:reference.height});
 Object.assign(atlas.meta.size,{w:reference.width+2,h:reference.height+2});
 const sheet=await sharp({create:{width:reference.width+2,height:reference.height+2,channels:4,background:'#00000000'}}).composite([{input:png,left:1,top:1}]).png({compressionLevel:9}).toBuffer();
 fs.writeFileSync(path.join(root,'assets/atlases/base-0.png'),sheet);fs.writeFileSync(path.join(root,'assets/atlases/base-0.webp'),await sharp(sheet).webp({quality:92}).toBuffer());fs.writeFileSync(atlasPath,JSON.stringify(atlas,null,4)+'\n');
 console.log('Happy kitten and PNG/WebP atlas: '+reference.width+'×'+reference.height+'; original preserved in '+backup);
})().catch(e=>{console.error(e);process.exitCode=1;});
