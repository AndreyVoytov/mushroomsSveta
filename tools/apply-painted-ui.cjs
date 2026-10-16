// Only adapts ImageGen artwork to the game's logical canvases. No vector UI drawing.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('./arcane-art-runtime.cjs')('sharp');
const root=path.resolve(__dirname,'..'),art=path.join(root,'artwork/arcane-reskin/iteration-2');
if(fs.existsSync(path.join(root,'artwork/arcane-reskin/iteration-3/applied-assets.json'))&&!process.argv.includes('--legacy-v2'))throw Error('Iteration 2 is archived. Use tools/prepare-arcane-ensembles.cjs for the current purpose-designed UI.');
const originals=JSON.parse(fs.readFileSync(path.join(art,'original-dimensions.json')));
const sources=JSON.parse(fs.readFileSync(path.join(art,'generation-results.json')));
const previous=fs.existsSync(path.join(art,'applied-assets.json'))?JSON.parse(fs.readFileSync(path.join(art,'applied-assets.json'))):[];
const legacy=JSON.parse(fs.readFileSync(path.join(root,'artwork/arcane-reskin/ui-manifest.json')));
const family={panel:'panel',inset:'inset',dialog:'dialog',hud:'hud',resource:'inset',name:'header',button:'button',play:'play',plus:'plus',close:'close',gear:'gear',quiet:'inset',circle:'circle',mutedCircle:'circle',ribbon:'header',track:'progress-track',progress:'progress-fill',sound:'sound',mute:'mute',support:'info',exit:'exit'};
const mapping=new Map(legacy.map(a=>[a.file,{file:a.file,id:family[a.type],width:a.width,height:a.height}]));
function add(key,id,options={}){const a=originals.find(a=>a.key===key);if(!a)throw Error('Unknown original UI: '+key);mapping.set(a.file,{...a,id,...options});}
for(const key of ['slotOpened','characterEquippedBg','characterItemSkillsDetailsBg','shopItemBg','characterSkillsBg','ingredientBg'])add(key,'inset');
for(const key of ['characterPanelBanner','shopHeader','characterCloseButton'])add(key,key==='characterCloseButton'?'button':'header');
for(const key of ['characterSkillInfoButton','characterArtifactInfoButton','characterSlotItemInfoButton','characterItemInfoDetailsButton','shopInfoButton'])add(key,'info');
add('characterArrowLeft','arrow');add('characterArrowRight','arrow',{flip:true});
add('diaryArrowLeft','arrow');add('closeBook','close');
add('characterLevelProgressEmpty','progress-track');add('characterLevelProgressFull','progress-fill');
add('circleViolet','circle');add('lukoshkoIcon','basket');add('lukoshkoIcon2','basket');add('lukoshkoHeader','basket');
add('lightning','energy');add('gems','star');add('sapphireStar','star');
add('energyPanelFrame','panel',{width:960,height:640});
add('energyPanelOrb','energy',{width:160,height:150});
add('energyPanelBuyButton','button',{width:512,height:160});
add('characterBackpackButton','backpack');add('characterShopButton','shop-button');
for(const [key,id] of [['shopSkillEnergy','skill-energy'],['shopSkillBravery','skill-bravery'],['shopSkillKnowledge','skill-knowledge'],['shopSkillFriendship','skill-friendship']])add(key,id);
for(const key of ['chest1','chest2','chest3','energy_chest','tasksPanelChest','tasksPanelChest2','tasksPanelChest3','tasksPanelChest4','tasksPanelChest5','tasksPanelChest6','tasksPanelChest7'])add(key,'reward-chest');
add('tasksPanelOrnament','divider');
for(const a of [
 {file:'assets/base/ui/arcane/dialogNameplate.png',id:'dialog-name',width:286,height:75},
 {file:'assets/base/ui/arcane/dialogButton.png',id:'dialog-button',width:487,height:120},
 {file:'assets/base/ui/arcane/portraitFrame.png',id:'portrait-ring',width:148,height:148},
 {file:'assets/base/ui/arcane/chargeRing.png',id:'portrait-charge',width:148,height:148},
 {file:'assets/base/ui/arcane/emptyHero.png',id:'empty-hero',width:136,height:136},
 {file:'assets/base/ui/arcane/chargeBadge.png',id:'inset',width:92,height:32},
 {file:'assets/base/ui/arcane/quietButton.png',id:'button',width:256,height:60},
 {file:'assets/base/ui/arcane/dialogMedallion.png',id:'dialog-medallion',width:148,height:148}
])mapping.set(a.file,a);
const sliced=new Set(['panel','inset','dialog','header','hud','button','dialog-name','dialog-button','progress-track','progress-fill']);
const onlyArg=process.argv.find(a=>a.startsWith('--only=')),only=onlyArg?new Set(onlyArg.slice(7).split(',')):null;
const groupArg=process.argv.find(a=>a.startsWith('--group=')),group=groupArg?groupArg.slice(8):'ui';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
async function write(file,data){for(let i=0;;i++){try{await fs.promises.writeFile(file,data);return;}catch(e){if(i>=7||!['UNKNOWN','EPERM','EBUSY'].includes(e.code))throw e;await new Promise(r=>setTimeout(r,200*(i+1)));}}}
async function visibleBounds(input){const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});let l=info.width,t=info.height,r=0,b=0;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>12){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}return {left:l,top:t,width:r-l+1,height:b-t+1};}
const trims=new Map();
async function trimmed(id){if(trims.has(id))return trims.get(id);const source=sources.find(a=>a.id===id);if(!source)throw Error('Missing generated source '+id);const box=await visibleBounds(source.source),data=await sharp(source.source).extract(box).png().toBuffer({resolveWithObject:true});trims.set(id,data);return data;}
async function slice(input,w,h,id){
 const sw=input.info.width,sh=input.info.height,edge=Math.max(2,Math.round(Math.min(sw,sh)*.26));
 const cap=Math.max(1,Math.round(Math.min(id==='panel'?38:id==='dialog'?28:id==='inset'?15:22,w/4,h/3)));
 const sx=[0,edge,sw-edge,sw],sy=[0,edge,sh-edge,sh],dx=[0,cap,w-cap,w],dy=[0,cap,h-cap,h],layers=[];
 for(let y=0;y<3;y++)for(let x=0;x<3;x++){const part=await sharp(input.data).extract({left:sx[x],top:sy[y],width:sx[x+1]-sx[x],height:sy[y+1]-sy[y]}).resize(dx[x+1]-dx[x],dy[y+1]-dy[y],{fit:'fill'}).png().toBuffer();layers.push({input:part,left:dx[x],top:dy[y]});}
 return sharp({create:{width:w,height:h,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(layers).png().toBuffer();
}
(async()=>{
 let count=0;const results=new Map(previous.map(a=>[a.file,a]));
 let work=group==='ui'?[...mapping.values()]:sources.filter(a=>a.file&&(group==='field'?/^(field-|nature-)/.test(a.id):a.id==='character-panel')).map(a=>({...originals.find(o=>o.file===a.file),id:a.id}));
 for(const a of work){
  if(only&&!only.has(a.id))continue;const source=sources.find(s=>s.id===a.id);if(!source)continue;
  const target=path.join(root,a.file),backup=path.join(root,'.local-workbench/ui-v2/before',a.file);fs.mkdirSync(path.dirname(target),{recursive:true});
  if(fs.existsSync(target)&&!fs.existsSync(backup)){fs.mkdirSync(path.dirname(backup),{recursive:true});fs.copyFileSync(target,backup);}
  const original=originals.find(o=>o.file===a.file);if(original&&(a.width>original.width||a.height>original.height))throw Error('Texture resolution increased: '+a.file);
  const input=await trimmed(a.id);let data;
  if(group==='ui'&&a.key==='lightning'){
   const box=await visibleBounds(backup),fit=await sharp(input.data).resize(box.width,box.height,{fit:'inside'}).png().toBuffer({resolveWithObject:true});
   data=await sharp({create:{width:a.width,height:a.height,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:fit.data,left:box.left+Math.floor((box.width-fit.info.width)/2),top:box.top+Math.floor((box.height-fit.info.height)/2)}]).png().toBuffer();
  }
  else if(group==='ui')data=sliced.has(a.id)?await slice(input,a.width,a.height,a.id):await sharp(input.data).resize(a.width,a.height,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
  else if(/ground$/.test(a.id)||a.id==='field-grass')data=await sharp(source.source).resize(a.width,a.height,{fit:'fill'}).toBuffer();
  else {
   const box=await visibleBounds(backup),fit=await sharp(input.data).resize(box.width,box.height,{fit:/^field-hex/.test(a.id)?'fill':'inside'}).png().toBuffer({resolveWithObject:true});
   data=await sharp({create:{width:a.width,height:a.height,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:fit.data,left:box.left+Math.floor((box.width-fit.info.width)/2),top:box.top+Math.floor((box.height-fit.info.height)/2)}]).png().toBuffer();
  }
  if(a.flip)data=await sharp(data).flop().png().toBuffer();
  const output=/\.jpg$/i.test(a.file)?await sharp(data).flatten({background:'#788a69'}).jpeg({quality:90}).toBuffer():await sharp(data).png({palette:true,colours:256,dither:.15,effort:9}).toBuffer();
  await write(target,output);results.set(a.file,{file:a.file,sourceId:a.id,width:a.width,height:a.height,originalWidth:original?.width,originalHeight:original?.height,bytes:output.length,sha256:sha(output),sourceSha256:sha(fs.readFileSync(source.source)),tool:'built-in image_gen',adaptation:sliced.has(a.id)&&group==='ui'?'nine-slice raster adaptation':'fit original logical canvas'});count++;
 }
 fs.writeFileSync(path.join(art,'applied-assets.json'),JSON.stringify([...results.values()],null,2));console.log('Applied',count,'painted',group,'assets; no original texture resolution increased.');
})().catch(e=>{console.error(e);process.exitCode=1;});
