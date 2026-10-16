// Production preparation only: trim transparent margins and resize ImageGen art to logical canvases.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('./arcane-art-runtime.cjs')('sharp');
const root=path.resolve(__dirname,'..'),art=path.join(root,'artwork/arcane-reskin/iteration-3');
if(fs.existsSync(path.join(root,'artwork/arcane-reskin/iteration-4/applied-assets.json'))&&!process.argv.includes('--legacy-v3'))throw Error('Iteration 4 supersedes the inactive covers. Use prepare-arcane-polish.cjs; --legacy-v3 explicitly restores the old artwork.');
const sources=require(path.join(art,'generation-results.json'));
const originals=require(path.join(root,'artwork/arcane-reskin/iteration-2/original-dimensions.json'));
const previous=require(path.join(root,'artwork/arcane-reskin/iteration-2/applied-assets.json'));
async function bounds(input){const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});let l=info.width,t=info.height,r=0,b=0;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>12){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}return{left:l,top:t,width:r-l+1,height:b-t+1};}
async function write(file,data){fs.mkdirSync(path.dirname(file),{recursive:true});for(let i=0;;i++){try{await fs.promises.writeFile(file,data);return;}catch(e){if(i>=7||!['UNKNOWN','EPERM','EBUSY'].includes(e.code))throw e;await new Promise(r=>setTimeout(r,200*(i+1)));}}}
const targets=[];
function original(key,id){const a=(key==='helperPanel2'?originals.filter(a=>a.key===key).pop():originals.find(a=>a.key===key))||previous.find(a=>a.file.endsWith('/'+key+'.png'));if(!a)throw Error(key);targets.push({...a,id,shape:/^(grass|hex|water$|sand$|pinkFlower$|sandPyramid$)/.test(key),...(key==='energyPanelFrame'?{width:960,height:640}:{})});}
for(const s of sources.filter(s=>!['energy-board','resource-capsule','result-badge','dialogue-board','stats-plaque','open-hex','locked-hex','game-hud','notice-board','retry-board','journal-page','extra-steps','hex-water','hex-sand','hex-flower','flower-motif','sand-motif'].includes(s.id)))targets.push({id:s.id,file:'assets/base/ui/arcane/'+s.id+'.png',width:s.w,height:s.h});
original('energyPanelFrame','energy-board');
original('panel2','notice-board');original('panel','retry-board');
original('helperPanel2','notice-board');
original('plusSteps','extra-steps');original('steps','extra-steps');
original('bookBg','journal-page');original('bookPage','journal-page');
for(const key of ['topPanel'])original(key,'game-hud');
for(const key of ['statusPanel','rewardCard','ingredientBg'])original(key,'resource-capsule');
original('rewardBadge','result-badge');original('dialogPnl','dialogue-board');original('characterSkillsBg','stats-plaque');
for(const key of ['grass','grassFlower','grassDF'])original(key,'open-hex');
for(const key of ['hexDark','hexHouseDark'])original(key,'locked-hex');
original('hexWater','hex-water');original('water','hex-water');
original('hexSand','hex-sand');original('sand','hex-sand');
original('hexFlower','hex-flower');original('pinkFlower','flower-motif');original('sandPyramid','sand-motif');
// Supplemental surfaces retain their own material instead of inheriting a white-paper rectangle.
for(const key of ['shopNavBg','tasksPanelTabInactive','characterItemSkillsDetailsBg'])original(key,'resource-capsule');
for(const key of ['shopNavSelected','tasksPanelTabActive','characterCloseButton'])original(key,'secondary-control');
(async()=>{const rows=[];for(const target of targets){
 const s=sources.find(s=>s.id===target.id),box=await bounds(s.source),trim=await sharp(s.source).extract(box).png().toBuffer();
 const file=path.join(root,target.file),backup=path.join(root,'.local-workbench/ui-v3/before',target.file);
 if(fs.existsSync(file)&&!fs.existsSync(backup)){fs.mkdirSync(path.dirname(backup),{recursive:true});fs.copyFileSync(file,backup);}
 let data;
 if(target.shape){
  const baseline=path.join(root,'.local-workbench/ui-v2/before',target.file);
  const b=await bounds(fs.existsSync(baseline)?baseline:backup);
  const sprite=await sharp(trim).resize(b.width,b.height,{fit:'fill'}).png().toBuffer();
  data=await sharp({create:{width:target.width,height:target.height,channels:4,background:'#00000000'}}).composite([{input:sprite,left:b.left,top:b.top}]).png().toBuffer();
 }else data=await sharp(trim).resize(target.width,target.height,{fit:'fill'}).png().toBuffer();
 data=await sharp(data).png({palette:true,colours:256,dither:.15,effort:9}).toBuffer();await write(file,data);
 rows.push({file:target.file,sourceId:s.id,width:target.width,height:target.height,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex'),tool:s.tool,adaptation:target.shape?'fit original visible footprint, full opaque tile surface':'trim alpha margins, resize whole purpose-designed artwork'});
 }
 fs.writeFileSync(path.join(art,'applied-assets.json'),JSON.stringify(rows,null,2));console.log('Prepared',rows.length,'purpose-designed painted surfaces; original canvases retained.');
})().catch(e=>{console.error(e);process.exitCode=1;});
