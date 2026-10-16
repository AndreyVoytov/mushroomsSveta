const fs=require('fs'),path=require('path'),assert=require('assert'),sharp=require('./arcane-art-runtime.cjs')('sharp');
const root=path.resolve(__dirname,'..'),previousArt=path.join(root,'artwork/arcane-reskin/iteration-3');
const polished=fs.existsSync(path.join(root,'artwork/arcane-reskin/iteration-4/applied-assets.json'));
const typography=fs.existsSync(path.join(root,'artwork/arcane-reskin/iteration-5/applied-assets.json'));
const art=typography?path.join(root,'artwork/arcane-reskin/iteration-5'):polished?path.join(root,'artwork/arcane-reskin/iteration-4'):previousArt;
(async()=>{
 const original=require(path.join(root,'artwork/arcane-reskin/iteration-2/original-dimensions.json'));
 for(const a of original){const m=await sharp(path.join(root,a.file)).metadata();assert(m.width<=a.width&&m.height<=a.height,'Original canvas grew: '+a.file);}
 const overrides=polished?require(path.join(root,'artwork/arcane-reskin/iteration-4/applied-assets.json')):[];
 const records=require(path.join(previousArt,'applied-assets.json')).map(a=>overrides.find(b=>a.file===b.file)||a);let bytes=0;
 if(typography)for(const a of require(path.join(art,'applied-assets.json'))){const i=records.findIndex(b=>b.file===a.file);if(i<0)records.push(a);else records[i]=a;}
 for(const a of records){const file=path.join(root,a.file),m=await sharp(file).metadata();assert(m.width===a.width&&m.height===a.height,'Canvas mismatch '+a.file);assert(m.width<=(a.originalWidth||960)&&m.height<=(a.originalHeight||1110),'Display budget '+a.file);bytes+=fs.statSync(file).size;}
 for(const key of ['grass','grassFlower','grassDF']){
  const a=original.find(a=>a.key===key),{data,info}=await sharp(path.join(root,a.file)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const center=((Math.floor(info.height/2)*info.width)+Math.floor(info.width/2))*4;
  assert(data[center+3]>=250,'Opened tile center must be opaque: '+key);
  assert(data[3]===0,'Tile corner must be transparent: '+key);
 }
 async function luminance(key){const a=original.find(a=>a.key===key),{data,info}=await sharp(path.join(root,a.file)).ensureAlpha().raw().toBuffer({resolveWithObject:true});let total=0,count=0;for(let y=Math.floor(info.height*.3);y<info.height*.7;y++)for(let x=Math.floor(info.width*.3);x<info.width*.7;x++){const i=(y*info.width+x)*4;if(data[i+3]>240){total+=data[i]*.2126+data[i+1]*.7152+data[i+2]*.0722;count++;}}return total/count;}
 const normal=await luminance('hex'),gray=await luminance('hexDark');
 if(polished)assert(gray>normal*1.18,'Inactive covers must recede through a lighter face');
 else assert(gray<normal*.72,'Grayed cover must be visibly darker');
 const pages=fs.readdirSync(path.join(root,'assets/atlases')).filter(f=>f.endsWith('.webp'));let atlasBytes=0;
 for(const file of pages){const m=await sharp(path.join(root,'assets/atlases',file)).metadata();assert(m.width<=2048&&m.height<=2048,'Atlas too large');atlasBytes+=fs.statSync(path.join(root,'assets/atlases',file)).size;}
 const report={originalTexturesChecked:original.length,originalCanvasIncreases:0,newMastersPublished:false,purposeDesignedSurfaces:records.length,surfaceBytes:bytes,atlasPages:pages.length,atlasBytes,openedTile:'Opaque filled face; transparent corners',inactive:{treatment:polished?'Pale sage with faint retained motif':'Dark slate',normalLuma:normal,inactiveLuma:gray,ratio:gray/normal}};
 fs.writeFileSync(path.join(art,'asset-budget.json'),JSON.stringify(report,null,2));console.log('PASS ensemble art:',JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1;});
