// Run the actual tab callbacks; direct openTab calls would miss the wardrobe regression.
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript');
let closed=0,worldOpened=0;
function Base(){};
function Tab(game,name,label,callback){this.callback=callback;this.setActive=active=>this.active=active;}
const mocks={ClosablePanel:Base,ShopTabButton:Tab,WorldPanel:{show(){worldOpened++;}},LocalizationService:{isRussian:()=>true,get:(key,fallback)=>fallback}};
const exportsObject={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/view/component/house/ShopPanel.ts'),'utf8'),
 {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}}).outputText,
 {exports:exportsObject,require:n=>({default:mocks[path.basename(n)]||Base}),Phaser:{Easing:{Quadratic:{Out:0}}}});
const panel=Object.create(exportsObject.default.prototype),visible={};
Object.assign(panel,{tabs:{},sections:{},game:{tweens:{removeFrom(){}},add:{tween:target=>({to(props){Object.assign(target,props);}})}},
 attachSprite:()=>({scale:{set(){}}}),addSprite(){},close(){closed++;},opened:true});
for(const id of ['bank','items','heroes'])panel.sections[id]={showSection(){visible[id]=true;},hideSection(){visible[id]=false;}};
panel.createNavigation();
for(let i=0;i<20;i++)for(const id of ['heroes','items','bank','items']){
 panel.tabs[id].callback();assert.equal(panel.activeTab,id);assert(visible[id]);
 assert.equal(Object.values(visible).filter(Boolean).length,1,'exactly the selected section is visible');
 assert(panel.opened);assert(panel.tabs[id].active);
}
assert.equal(closed,0,'Items does not close the shop');assert.equal(worldOpened,0,'Items does not open the travel book');
console.log('PASS shop navigation: 80 actual tab callbacks, Heroes → Items, one active section, shop stays open.');
