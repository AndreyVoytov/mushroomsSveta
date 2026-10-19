// Exercise the real menu lifecycle with a deterministic Phaser timer/tween clock.
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript');
let now=0,queue=[],created=0,infoShown=0;
function signal(){return {add(){},removeAll(){}};}
function point(x=0,y=x){return {x,y,set(x,y=x){this.x=x;this.y=y;},copyFrom(p){this.x=p.x;this.y=p.y;}};}
function button(callback){return {callback,scale:point(1.3),position:point(),angle:0,x:862,y:1360,width:82,height:82,
 loadTexture(){},events:{onInputDown:signal()}};}
function timer(delay,fn){queue.push({at:now+delay,fn});}
function advance(ms){const end=now+ms;while(true){queue.sort((a,b)=>a.at-b.at);if(!queue.length||queue[0].at>end)break;const e=queue.shift();now=e.at;e.fn();}now=end;}
function Base(game){this.game=game;this.scale=point(1);this.buttons=[];this.blackTransparent={events:{onInputDown:signal()}};}
Base.prototype.attachButton=function(key,callback,name){const b=button(callback);b.name=name||key;this.buttons.push(b);return b;};
Base.prototype.bringToTop=function(){};
const game={time:{events:{add:timer}},tweens:{removeFrom(){}},add:{existing(){},tween:target=>({to(props,duration,ease,start,delay=0){timer(duration+delay,()=>Object.assign(target,props));return this;}})}};
const sound={panelOpen(){},panelClose(){},disableSound(){},enableSound(){},simpleCellOpen(){}};
const mocks={ClosablePanel:Base,SoundUtils:sound,Settings:{SUPPORT_MAIL:'test@example.com'},
 SpriteUtils:{fitIcon(){},getAtlasKeyAndFrame:()=>({atlasKey:'atlas',frameName:'sound'})},
 Game:{SOUND_ENABLED:true},GameText:{supportMessage:()=>''},LocalizationService:{get:k=>k},
 LocalizationKey:{ui:k=>k},UiLayout:{touchTarget(){}},ConfirmPanel:function(){created++;this.show=()=>infoShown++;}};
const exportsObject={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/view/component/forest/InGameSettingsPanel.ts'),'utf8'),
 {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}}).outputText,
 {exports:exportsObject,require:n=>({default:mocks[path.basename(n)]||function(){}}),Phaser:{Easing:{Sinusoidal:{InOut:0},Quadratic:{In:0,Out:0}}}});
const Menu=exportsObject.default,original=button(),menu=new Menu(game,{confirmPanel:{show(){}}},original);
menu.show();assert(Menu.shown);assert(!original.visible);
for(let i=0;i<80;i++){menu.show();menu.close();advance(3);}
assert(menu.opened,'opening cannot be interrupted by rapid input');
advance(400);assert(!menu.processing);assert(menu.actions.every((b,i)=>b.y===original.y-(i+1)*112));
assert.equal(menu.gear.position.x,original.x);assert.equal(menu.gear.position.y,original.y);
for(let i=0;i<80;i++){if(menu.opened)menu.close();else menu.show();advance(18);}
advance(400);if(menu.opened)menu.close();advance(400);
assert(!menu.processing&&!menu.opened&&!Menu.shown);assert(original.visible);assert(!menu.blackTransparent.inputEnabled);
menu.show();advance(400);
const support=menu.buttons.find(b=>b.name==='support');support.callback();support.callback();advance(400);
assert.equal(created,1);assert.equal(infoShown,1,'support opens once, after closing the menu');
assert(!menu.blackTransparent.inputEnabled);assert(original.visible);
// The support address is highlighted text; its @ is content, not a marker.
const confirmExports={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/view/component/house/ConfirmPanel.ts'),'utf8'),
 {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}}).outputText,
 {exports:confirmExports,require:()=>({default:Base})});
const parser=Object.create(confirmExports.default.prototype);
assert.equal(parser.parseGreenHighlightText('Почта: ~redhat.game.help@gmail.com~').text,'Почта: redhat.game.help@gmail.com');
assert.equal(parser.parseGreenHighlightText('~Help~ @highlight@').text,'Help highlight');
console.log('PASS settings: 80 rapid inputs, fixed gear, separate action targets, reuse, blocker cleanup, single support handoff.');
