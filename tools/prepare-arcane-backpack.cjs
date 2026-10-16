const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('./arcane-art-runtime.cjs')('sharp');
const root=path.resolve(__dirname,'..'),source=process.argv[2];
if(!source)throw Error('Pass the selected ImageGen master path.');
(async()=>{
 const target=path.join(root,'assets/backpack/panel.png'),before=await sharp(target).metadata();
 const width=973,height=1413;
 if(before.width!==width||before.height!==height)throw Error('Unexpected backpack canvas.');
 const data=await sharp(source).resize(width,height,{fit:'fill'}).ensureAlpha().png({compressionLevel:9}).toBuffer();
 const meta=await sharp(data).metadata();if(!meta.hasAlpha)throw Error('Transparency required.');
 fs.writeFileSync(target,data);
 const dir=path.join(root,'artwork/arcane-reskin/iteration-5');fs.mkdirSync(dir,{recursive:true});
 const report={file:'assets/backpack/panel.png',key:'backpackPanelBg',width,height,originalWidth:width,originalHeight:height,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex'),method:'Built-in ImageGen style transfer; technical resize only; master not published',lazyGroup:'backpack'};
 fs.writeFileSync(path.join(dir,'applied-assets.json'),JSON.stringify([report],null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1;});
