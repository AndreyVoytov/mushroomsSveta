// Archived v1 experiment. The current UI uses ImageGen pixels; never overwrite it by accident.
if (!process.argv.includes('--legacy-v1')) throw Error('Superseded by tools/apply-painted-ui.cjs. --legacy-v1 is only for reproducing the archived first experiment.');
const fs=require('fs'),path=require('path');
const sharp=require('./arcane-art-runtime.cjs')('sharp');
const mappings={
 'assets/base/ui/panel.png':'panel','assets/base/ui/panel2.png':'panel',
 'assets/base/ui/helperPanel.png':'inset','assets/base/ui/helperPanel2.png':'inset',
 'assets/base/ui/dialogPnl.png':'dialog','assets/base/ui/topPanel.png':'hud','assets/base/ui/topPanelFrame.png':'inset',
 'assets/base/ui/statusPanel.png':'resource','assets/base/ui/titlePnl.png':'name',
 'assets/base/ui/pnlButton.png':'button','assets/base/ui/energyPanelBuyButton.png':'button',
 'assets/base/ui/playButton.png':'play','assets/base/ui/playButtonOld.png':'play',
 'assets/base/ui/plusButton.png':'plus','assets/base/ui/closeButton.png':'close','assets/base/ui/closeButtonViolet.png':'close',
 'assets/base/ui/settingsButton.png':'gear','assets/basehq/settingsMain.png':'gear','assets/base/ui/skipButton.png':'quiet',
 'assets/base/ui/circle.png':'circle','assets/base/ui/circleB.png':'circle','assets/base/ui/circleOrange.png':'circle','assets/base/ui/circleGray.png':'mutedCircle',
 'assets/base/action/actionCircle.png':'circle','assets/base/ui/progressCircle.png':'circle',
 'assets/base/ui/reward/rewardBoard.png':'panel','assets/base/ui/reward/rewardCard.png':'inset',
 'assets/base/ui/reward/rewardHeader.png':'ribbon','assets/base/ui/reward/rewardBadge.png':'name','assets/base/ui/reward/rewardButton.png':'button',
 'assets/base/ui/progressbar/ribbon.png':'ribbon','assets/base/ui/progressbar/ribbon2.png':'ribbon',
 'assets/base/ui/progressbar/progressLineBg.png':'track','assets/base/ui/progressbar/body.jpg':'progress','assets/base/ui/progressbar/tail.png':'progress',
 'assets/base/ui/wooden_tab.png':'ribbon','assets/base/task/header_ribbon.png':'ribbon',
 'assets/base/ui/character/equipped_bg.png':'inset','assets/base/ui/character/skills_bg.png':'panel',
 'assets/base/ui/character/item_skills_details_bg.png':'panel','assets/base/ui/character/character_item_info_panel_details.png':'inset',
 'assets/base/ui/shop/itemBg.png':'inset','assets/base/ui/shop/nav_bg.png':'panel','assets/base/ui/shop/nav_selected.png':'name',
 'assets/base/ui/shop/buy_item_button.png':'button','assets/base/task/task_bg.png':'panel','assets/base/task/task_item_bg.png':'inset',
 'assets/base/task/task_reward_bg.png':'inset','assets/basehq/sound1.png':'sound','assets/basehq/sound2.png':'mute',
 'assets/basehq/support.png':'support','assets/basehq/turnOff.png':'exit',
 'assets/base/ui/progressbar/circle.png':'circle','assets/base/ui/progressbar/circleSmall.png':'circle',
 'assets/base/task/bg_top.png':'panel','assets/base/task/bg_center.png':'panel','assets/base/task/bg_bottom.png':'panel',
 'assets/base/task/tab_active.png':'name','assets/base/task/tab_inactive.png':'inset',
 'assets/base/task/taks_list_bg_top.png':'inset','assets/base/task/taks_list_bg_center.png':'inset','assets/base/task/taks_list_bg_bottom.png':'inset',
 'assets/base/task/progress_empty.png':'track','assets/base/task/progress_full.png':'progress',
 'assets/base/task/task_progress_empty.png':'track','assets/base/task/task_progress_full.png':'progress',
 'assets/base/task/task_panel_close.png':'close',
 'assets/base/ui/diary/ingredientBg.png':'inset','assets/base/ui/diary/diaryArrowsBg.png':'ribbon'
};
const bronze='#ac864c',ink='#514739';
function shapePath(w,h,margin=5){const a=margin,b=w-margin,c=h-margin,r=Math.min(26,h*.18,w*.09);return 'M '+(a+r)+' '+a+' H '+(b-r)+' L '+b+' '+(a+r)+' V '+(c-r)+' L '+(b-r)+' '+c+' H '+(a+r)+' L '+a+' '+(c-r)+' V '+(a+r)+' Z';}
function icon(name){
 if(name==='plus')return '<path d="M50 30V70M30 50H70"/>';
 if(name==='close')return '<path d="M34 34L66 66M66 34L34 66"/>';
 if(name==='support')return '<path d="M38 37C38 19 70 21 67 39C65 49 51 48 51 60"/><circle cx="51" cy="73" r="3" fill="'+ink+'" stroke="none"/>';
 if(name==='exit')return '<path d="M44 22H24V78H44M48 50H80M66 36L80 50L66 64"/>';
 if(name==='sound'||name==='mute')return '<path d="M18 40H32L49 26V74L32 60H18ZM62 36Q77 50 62 64"/>'+(name==='sound'?'<path d="M72 25Q95 50 72 75"/>':'<path d="M64 35L86 65M86 35L64 65"/>');
 let p='';for(let i=0;i<32;i++){const a=i/32*Math.PI*2,r=i%4===0||i%4===3?34:27;p+=(i?'L':'M')+(50+Math.cos(a)*r)+' '+(50+Math.sin(a)*r)+' ';}
 return '<path d="'+p+'Z" fill="#c8b17b" stroke-width="3"/><circle cx="50" cy="50" r="12" fill="#f5ecd4" stroke-width="3"/>';
}
function makeSvg(w,h,type){
 const circle=/Circle$|^circle$/.test(type)||['plus','close','gear','sound','mute','support','exit'].includes(type);
 const action=type==='button'||type==='name'||type==='progress'||type==='plus';
 const grad=action?'sage':type==='panel'?'wood':'paper';
 const inset=type==='inset'||type==='track',m=inset?2:5;
 const defs='<defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff7e4"/><stop offset="1" stop-color="#ecdfc0"/></linearGradient><linearGradient id="wood" x2="0" y2="1"><stop stop-color="#e6cea2"/><stop offset=".46" stop-color="#efdcb5"/><stop offset="1" stop-color="#d0b686"/></linearGradient><linearGradient id="sage" x2="0" y2="1"><stop stop-color="#c3d29a"/><stop offset=".45" stop-color="#a9c18b"/><stop offset="1" stop-color="#849e6d"/></linearGradient><linearGradient id="bronze" x2="1" y2="1"><stop stop-color="#e9ce8d"/><stop offset=".5" stop-color="#9e793e"/><stop offset="1" stop-color="#d4b470"/></linearGradient></defs>';
 let art='';
 if(type==='progress')art='<rect width="'+w+'" height="'+h+'" fill="url(#sage)"/><path d="M0 2H'+w+'" stroke="#eaf1c9" stroke-width="3"/>';
 else if(circle){
  const r=Math.min(w,h)/2-5,cx=w/2,cy=h/2;
  art='<circle cx="'+cx+'" cy="'+(cy+3)+'" r="'+r+'" fill="#5c493a" opacity=".25"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="url(#'+(type==='mutedCircle'?'wood':'paper')+')" stroke="url(#bronze)" stroke-width="4"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r-7)+'" fill="none" stroke="#fff8d8" stroke-width="1.5"/>';
  if(type!=='circle'&&type!=='mutedCircle')art+='<g transform="translate('+(cx-r*.78)+' '+(cy-r*.78)+') scale('+(r*1.56/100)+')" fill="none" stroke="'+ink+'" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">'+icon(type)+'</g>';
 }else if(type==='play'){
  art='<path d="M30 8Q20 6 17 28L7 '+(h-28)+'Q5 '+(h+3)+' 31 '+(h-10)+'L'+(w-15)+' '+(h*.61)+'Q'+(w+4)+' '+(h*.5)+' '+(w-16)+' '+(h*.4)+'Z" fill="url(#sage)" stroke="url(#bronze)" stroke-width="5"/>';
 }else{
  const d=shapePath(w,h,m);
  art='<path d="'+d+'" fill="#5c493a" opacity=".2" transform="translate(0 3)"/><path d="'+d+'" fill="url(#'+grad+')" stroke="url(#bronze)" stroke-width="'+(inset?2:4)+'"/>';
  if(!inset)art+='<path d="'+shapePath(w,h,11)+'" fill="none" stroke="#fff4d4" stroke-width="1.5" opacity=".85"/>';
  if(type==='panel'||type==='dialog'||type==='ribbon'||type==='hud'){
   const q=Math.min(23,h*.12);for(const x of [20,w-20])art+='<path d="M'+x+' '+(h/2-q)+'L'+(x+q*.35)+' '+h/2+'L'+x+' '+(h/2+q)+'L'+(x-q*.35)+' '+h/2+'Z" fill="none" stroke="'+bronze+'" stroke-width="1.5" opacity=".5"/>';
  }
  if(type==='panel')art+='<path d="M30 '+(h*.12)+'Q'+(w*.35)+' '+(h*.09)+' '+(w-30)+' '+(h*.14)+'M30 '+(h*.9)+'Q'+(w*.7)+' '+(h*.86)+' '+(w-30)+' '+(h*.91)+'" fill="none" stroke="#a78551" opacity=".09" stroke-width="2"/>';
 }
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'">'+defs+art+'</svg>';
}
(async()=>{
 fs.mkdirSync('artwork/arcane-reskin/ui',{recursive:true});const records=[];
 for(const [file,type]of Object.entries(mappings)){
  if(!fs.existsSync(file))continue;const meta=await sharp(file).metadata(),svg=makeSvg(meta.width,meta.height,type);
  const source='artwork/arcane-reskin/ui/'+file.replace(/^assets\//,'').replace(/[\\/]/g,'-').replace(/\.(png|jpg)$/i,'.svg');fs.writeFileSync(source,svg);
  const buffer=await sharp(Buffer.from(svg)).toFormat(/\.jpg$/i.test(file)?'jpeg':'png').toBuffer();fs.writeFileSync(file,buffer);
  records.push({file,type,width:meta.width,height:meta.height,source});
 }
 fs.writeFileSync('artwork/arcane-reskin/ui-manifest.json',JSON.stringify(records,null,2));console.log('Arcane watercolor UI:',records.length,'assets');
})().catch(e=>{console.error(e);process.exitCode=1;});
