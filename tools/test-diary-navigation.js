const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript');
function Base(){};const exported={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/view/component/diary/DiaryPanel.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}}).outputText,
 {exports:exported,require:n=>n==='phaser-ce'?{Easing:{Linear:{None:0}}}:{default:path.basename(n)==='SoundUtils'?{diaryNextPage(){},diaryPrevPage(){}}:Base}});
const Diary=exported.default;
for(const [width,height] of [[960,2077],[960,1344],[640,960]]){
 const scale=Diary.panelScale({width,height});assert(scale>0&&scale<=.9);
 assert(890*1.08*scale<=width-96+1e-8);assert(1085*1.04*scale<=height-160+1e-8);
}
const p=Object.create(Diary.prototype),pages=[],completions=[],timers=[];
Object.assign(p,{opened:true,pagesCount:3,pageTurnInProgress:false,arrowLeft:{},arrowRight:{},pageBg:{scale:{x:1}},pageBg0:{},
 showPage(n){pages.push(n);},resetStaticPageTurnSprite(){},resetSkewPageTurnSprite(){},showPageTurnLayer(){},hidePageTurnSprites(){},clearPageTurnEvent(){},
 game:{time:{events:{add:(delay,fn)=>{timers.push(fn);return {};}}},add:{tween:()=>({to(){return this;},onComplete:{addOnce(fn,ctx){completions.push(()=>fn.call(ctx));}}})}}});
p.showPrevPage(1);p.showNextPage(3);assert.deepEqual(pages,[],'hidden boundary arrows cannot select an invalid recipe');
p.opened=false;p.showNextPage(1);p.showPrevPage(2);assert.deepEqual(pages,[],'a closed diary ignores delayed navigation');p.opened=true;
p.showNextPage(1);for(let i=0;i<50;i++)p.showNextPage(1);assert.deepEqual(pages,[2]);assert(p.pageTurnInProgress);completions.shift()();assert(!p.pageTurnInProgress);
p.showPrevPage(2);for(let i=0;i<50;i++)p.showPrevPage(2);assert.deepEqual(pages,[2]);completions.shift()();assert.deepEqual(pages,[2,1]);timers.shift()();completions.shift()();assert(!p.pageTurnInProgress);
function ReplicaBase(game,x,y){this.game=game;this.x=x;this.y=y;}
const replicaExports={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/view/component/dialog/ReplicaDiaryPanel.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}}).outputText,
 {exports:replicaExports,require:n=>({default:path.basename(n)==='DiaryConfiguration'?{getNextrecipe:()=>null,getCurrentRecipe:()=>null}:path.basename(n)==='DialogPanel'?{BOTTOM_PADDING:0}:ReplicaBase})});
for(const [width,height] of [[960,2077],[960,1344],[640,960]])for(const rightSide of [false,true]){
 const book=new replicaExports.default({width,height},0,0,{rightSide,context:{level:10}},{});
 for(const degrees of [-1.1,5])for(const drift of [-8.25,16.5])for(const cx of [49-890*1.08/2,49+890*1.08/2])for(const cy of [27-1085*1.04/2,27+1085*1.04/2]){
  const a=degrees*Math.PI/180,x=book.x+book.diaryCenterX+drift+(cx*Math.cos(a)-cy*Math.sin(a))*book.finalScale;
  assert(x>=15&&x<=width-15,'animated diary keeps side margins, including right-side dialogue');
 }
}
console.log('PASS diary: viewport fit and animated side margins, first/last boundaries, closed state, 100 rapid page inputs and completed turns.');
