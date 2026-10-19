const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript');
const exportsObject={};let created=0;
function Base(){}
const mocks={SpriteUtils:{createSprite:(game,x,y)=>{created++;return {x,y,position:{set(){}},anchor:{set(){}},visible:true};},fitIcon(){}},UiLayout:{fit(){},goalPair(){}}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/view/component/forest/ForestTopPanel.ts'),'utf8'),
 {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}}).outputText,
 {exports:exportsObject,require:n=>({default:mocks[path.basename(n)]||Base}),Phaser:{Sprite:Base}});
const panel=Object.create(exportsObject.default.prototype),aim={countLeft:0,label:{x:600,y:80,visible:true}};
Object.assign(panel,{aims:[aim],aimChecks:[],aimCenters:[480],game:{time:{events:{add:(delay,fn)=>fn()}}},addChild(){}});
for(let i=0;i<100;i++)panel.updateAimCounters(0);
assert.equal(created,1,'a completed goal owns exactly one check');assert(!aim.label.visible&&panel.aimChecks[0].visible);
aim.countLeft=5;panel.updateAimCounters(0);assert(aim.label.visible&&!panel.aimChecks[0].visible);
aim.countLeft=0;panel.updateAimCounters(0);assert.equal(created,1);assert(panel.aimChecks[0].visible);
console.log('PASS UI goals: 100 repeated refreshes, one check, positive count restored, check reused.');
const layoutExports={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/core/utils/UiLayout.ts'),'utf8'),
 {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}}).outputText,{exports:layoutExports});
for(const countWidth of [26,54,82])for(const trim of [null,{x:17,y:23,width:140,height:160}])for(const art of [{x:0,y:0,width:106,height:114},{x:21,y:12,width:67,height:86}]){
 const icon={texture:{frame:{width:140,height:160},crop:{width:106,height:114},trim,uiInkBounds:art},anchor:{x:.5,y:.5},scale:{x:.8,y:.8}};
 const count={scale:{x:.9,y:.9},getInkBounds:()=>({x:-countWidth/2,y:-20,width:countWidth,height:40})};
 layoutExports.default.goalPair(icon,count,480,80,14);
 const left=icon.x+((trim?trim.x:0)+art.x-70)*.8,right=count.x+countWidth/2*.9;
 assert(Math.abs((left+right)/2-480)<1e-8,'the entire visible goal is centered');
 const iconRight=left+art.width*.8,textLeft=count.x-countWidth/2*.9;
 assert(Math.abs(textLeft-iconRight-14)<1e-8,'one fixed gap for all counter widths');
 assert(Math.abs(icon.y+((trim?trim.y:0)+art.y-80+art.height/2)*.8-80)<1e-8);
 assert.equal(count.y,80);
}
console.log('PASS goal geometry: 1–3 digit counts, trimmed artwork, shared center and compact gap.');
