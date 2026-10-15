// Render the licensed font sources into Phaser's existing lightweight bitmap-text pipeline.
const fs=require('fs'),path=require('path');
const {chromium}=require('./arcane-art-runtime.cjs')('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();
 const codes=new Set([32,160,0x2013,0x2014,0x2018,0x2019,0x201c,0x201d,0x2026,0x20ac,0x2116,0x2190,0x2192,0x2713]);
 for(const font of ['bm_arial','bm_bookman','bm_gilroy'])for(const m of fs.readFileSync('assets/base/fonts/bitmap/'+font+'.fnt','utf8').matchAll(/<char id="(\d+)"/g))codes.add(+m[1]);
 for(let i=32;i<384;i++)codes.add(i);for(let i=1024;i<1168;i++)codes.add(i);
 const characters=Array.from(codes).sort((a,b)=>a-b);
 for(const font of [{name:'bm_arcane_ui',file:'Manrope',weight:'700'},{name:'bm_arcane_title',file:'Lora',weight:'600'}]){
  const data=fs.readFileSync('assets/other/fonts/arcane/'+font.file+'.ttf').toString('base64');
  const result=await page.evaluate(async({font,data,characters})=>{
   const face=new FontFace(font.name,'url(data:font/ttf;base64,'+data+')',{weight:font.weight});await face.load();document.fonts.add(face);
   const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=2048;const ctx=canvas.getContext('2d');
   ctx.font=font.weight+' 64px '+font.name;ctx.fillStyle='#ffffff';ctx.textBaseline='alphabetic';
   const glyphs=[];let x=3,y=3,row=0;
   for(const code of characters){
    const ch=String.fromCodePoint(code),m=ctx.measureText(ch),left=Math.ceil(m.actualBoundingBoxLeft),ascent=Math.ceil(m.actualBoundingBoxAscent),descent=Math.ceil(m.actualBoundingBoxDescent);
    const w=Math.max(1,Math.ceil(left+m.actualBoundingBoxRight)+6),h=Math.max(1,ascent+descent+6);
    if(x+w+3>2048){x=3;y+=row+3;row=0;}if(y+h>2048)throw Error('Font atlas overflow');
    ctx.fillText(ch,x+left+3,y+ascent+3);
    glyphs.push({id:code,x,y,width:w,height:h,xoffset:-left-3,yoffset:Math.round(54-ascent)-3,xadvance:Math.ceil(m.width),page:0,chnl:0});x+=w+3;row=Math.max(row,h);
   }
   return {png:canvas.toDataURL('image/png').split(',')[1],glyphs};
  },{font,data,characters});
  const output='assets/base/fonts/bitmap/'+font.name;
  fs.writeFileSync(output+'.png',Buffer.from(result.png,'base64'));
  const xml='<?xml version="1.0" encoding="UTF-8"?><font><info face="'+font.file+'" size="64" bold="1" italic="0"/><common lineHeight="84" base="54" scaleW="2048" scaleH="2048" pages="1" packed="0"/><pages><page id="0" file="'+font.name+'.png"/></pages><chars count="'+result.glyphs.length+'">'+result.glyphs.map(g=>'<char '+Object.entries(g).map(([k,v])=>k+'="'+v+'"').join(' ')+'/>').join('')+'</chars><kernings count="0"/></font>';
  fs.writeFileSync(output+'.fnt',xml);console.log(font.name,result.glyphs.length,'glyphs');
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
