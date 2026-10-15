const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('./arcane-art-runtime.cjs')('sharp');
const root=path.resolve(__dirname,'..'),inventory=JSON.parse(fs.readFileSync(path.join(root,'artwork/arcane-reskin/asset-manifest.json'),'utf8'));
const records=JSON.parse(fs.readFileSync(path.join(root,'artwork/arcane-reskin/generation-results.json'),'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
// Windows may briefly hold an image open while the workspace preview indexes it.
async function writeAsset(target,data){
 for(let attempt=0;;attempt++){
  try{await fs.promises.writeFile(target,data);return;}
  catch(error){if(attempt>=7||!['UNKNOWN','EBUSY','EPERM'].includes(error.code))throw error;await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));}
 }
}
(async()=>{
 const validated=[];
 for(const a of inventory){
  const target=path.join(root,a.file),backup=path.join(root,'.local-workbench/arcane-source-cache',a.file);
  fs.mkdirSync(path.dirname(backup),{recursive:true});if(!fs.existsSync(backup))fs.copyFileSync(target,backup);
  const record=records.find(r=>r.id===a.id);if(!record)continue;
  const generated=path.join(root,'.local-workbench/arcane-generated',a.id+'.png');fs.mkdirSync(path.dirname(generated),{recursive:true});fs.copyFileSync(record.source,generated);
  let result;
  if(a.kind==='backgrounds')result=await sharp(generated).resize(a.width,a.height,{fit:'fill'}).flatten({background:'#e6dfc8'}).png().toBuffer();
  else if(a.kind==='headers'){
   const rgb=await sharp(generated).resize(a.width,a.height,{fit:'fill'}).flatten({background:'#c6d8ce'}).removeAlpha().raw().toBuffer();
   const alpha=await sharp(backup).ensureAlpha().extractChannel('alpha').raw().toBuffer();
   result=await sharp(rgb,{raw:{width:a.width,height:a.height,channels:3}}).joinChannel(alpha,{raw:{width:a.width,height:a.height,channels:1}}).png().toBuffer();
  }else{
   const meta=await sharp(generated).metadata();if(!meta.hasAlpha)throw Error('Generated sprite must have alpha: '+a.id);
   const trim=await sharp(generated).trim().png().toBuffer();
   const fit=await sharp(trim).resize({width:a.bounds.width,height:a.bounds.height,fit:'inside'}).png().toBuffer({resolveWithObject:true});
   const left=a.bounds.left+Math.floor((a.bounds.width-fit.info.width)/2),top=a.bounds.top+a.bounds.height-fit.info.height;
   result=await sharp({create:{width:a.width,height:a.height,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:fit.data,left,top}]).png().toBuffer();
  }
  const m=await sharp(result).metadata();if(m.width!==a.width||m.height!==a.height)throw Error('Art dimensions changed: '+a.id);
  await writeAsset(target,result);
  validated.push({id:a.id,file:a.file,width:a.width,height:a.height,originalSha256:hash(fs.readFileSync(backup)),sha256:hash(result),tool:'built-in image_gen',alpha:m.hasAlpha});
 }
 fs.writeFileSync(path.join(root,'artwork/arcane-reskin/validation.json'),JSON.stringify(validated,null,2));
 fs.writeFileSync(path.join(root,'artwork/arcane-reskin/imagegen-prompts.json'),JSON.stringify({tool:'built-in image_gen',prompts:records.map(r=>({id:r.id,prompt:r.prompt,references:r.references}))},null,2));
 console.log('Normalized',validated.length,'Arcane images; original canvas sizes and sprite transparency retained.');
})().catch(e=>{console.error(e);process.exitCode=1;});
