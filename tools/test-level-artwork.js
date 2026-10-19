const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),ts=require('typescript');
function load(file,mocks={},phaser={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}}).outputText,
 {exports,console,Phaser:phaser,require:n=>mocks[path.basename(n)]||{default:function(){}}});return exports.default;}
function signal(){return {addOnce(fn){this.complete=fn;}};}
const images=[],bitmaps=[];
function Sprite(game,x,y,bitmap){Object.assign(this,{game,x,y,height:bitmap.height,cameraOffset:{x,y},texture:{baseTexture:{source:bitmap.canvas}},events:{onDestroy:signal()}});}
Sprite.prototype.postUpdate=function(){this.postUpdates=(this.postUpdates||0)+1;};
const Backdrop=load('src/view/component/forest/LevelBackdrop.ts',{SpriteUtils:{default:{createSprite(game,x,y,key){images.push(key);return {texture:{crop:{x:0,y:0,width:724,height:2172},baseTexture:{source:{key}}},destroy(){}};}}}},{Sprite});
for(const [width,height] of [[640,960],[960,1344],[960,2077],[1200,3000]]){
 const loaded=[];
 const game={width,height,camera:{y:0},cache:{checkImageKey:()=>false},load:{image:(key,file)=>loaded.push({key,file})},make:{bitmapData(w,h){const b={width:w,height:h,canvas:{},destroy(){this.destroyed=true;},draws:[],gradients:[],fills:[]};
  b.context={clearRect(){},drawImage:(...args)=>b.draws.push(args),createLinearGradient:(...bounds)=>{const g={bounds,stops:[],addColorStop(pos,color){this.stops.push({pos,color});}};b.gradients.push(g);return g;},fillRect:(...a)=>b.fills.push(a)};bitmaps.push(b);return b;}}};
 Backdrop.preload(game,{environment:0,header:'mountinesHeader'});assert.equal(loaded.length,2);assert(loaded[0].file.endsWith('/mountains-v1.webp'));assert(loaded[1].file.endsWith('/water-cover-v1.png'));
 const editorLoads=[];Backdrop.preloadForEditor({...game,load:{image:(key,file)=>editorLoads.push({key,file})}});assert.equal(editorLoads.length,16);assert.equal(new Set(editorLoads.map(x=>x.key)).size,16,'the editor can switch through every theme without a missing texture');
 const header=Math.min(height*.35,570),scene=Backdrop.create(game,{environment:0},header),paint=bitmaps[bitmaps.length-1];
 assert(scene.fixedToCamera,'scrolling a long field cannot expose the end of the illustration');assert(paint.height>=height+320);
 const draw=paint.draws[0];assert(draw[5]<=0&&draw[7]>=width&&draw[8]>=paint.height,'a single proportional illustration covers the whole backdrop');
 assert.equal(paint.gradients[0].bounds[1],header+24,'white haze begins below the header');
 const alphas=paint.gradients[0].stops.map(s=>Number(s.color.match(/,([\d.]+)\)/)[1]));assert.equal(alphas[0],0);assert(alphas.every((a,i)=>a>=0&&a<1&&(!i||a>=alphas[i-1])));
 const slice=Backdrop.slice(game,scene,height-226,107,true),sample=bitmaps[bitmaps.length-1];
 assert.strictEqual(sample.draws[0][0],paint.canvas,'the lower screen mask samples the same painting');assert.equal(sample.draws[0][2],height-226);assert(slice.fixedToCamera);
 for(const scroll of [100,500,10000,0]){game.camera.y=scroll;scene.postUpdate();slice.postUpdate();const offset=-scene.cameraOffset.y;
  assert(offset>=0&&offset+height+160<=paint.height,'long fields retain painted background beyond the viewport');
  assert.equal(sample.draws[sample.draws.length-1][2],height-226+offset,'scroll masks stay aligned with the illustration');}
 assert.equal(scene.postUpdates,4);assert.equal(slice.postUpdates,4,'nested sprite post-update retains Phaser camera and raster updates');
 slice.events.onDestroy.complete();scene.events.onDestroy.complete();assert(sample.destroyed&&paint.destroyed,'owned raster surfaces are released');
 const editorScene=Backdrop.create(game,{environment:0},header,true);editorScene.y=200;editorScene.postUpdate();assert(!editorScene.fixedToCamera);assert.equal(editorScene.y,200,'editor layout offsets are preserved');editorScene.events.onDestroy.complete();
}
const expected={forestHeader1:'forest',mountinesHeader:'mountains',forestHeader2:'dark',lakeHeader:'lake',flowersFieldHeader:'flowers',junglesHeader:'jungle',bugForestHeader:'bug',snailForestHeader:'snail',cloverHeader:'clover',hiveHeader:'hive'};
for(const header of Object.keys(expected))assert.equal(Backdrop.artwork({environment:0,header}).key,'arcane-level-'+expected[header]);
assert.equal(Backdrop.artwork({environment:2}).key,'arcane-level-house');assert.equal(Backdrop.artwork({environment:0,sceneImage:'world-scene'}).key,'world-scene');
for(const [scene,name] of [['riverJourneyScene','river'],['mushroomJourneyScene','forest'],['dungeonJourneyScene','dungeon'],['balloonJourneyScene','balloon']])assert.equal(Backdrop.artwork({environment:0,sceneImage:scene}).key,'arcane-level-journey-'+name);

// Preserve opacity while opening, refreshing and losing the last adjacent item.
const Painter=load('src/core/service/provider/CellsPainter.ts',{AnimationUtils:{default:{primeForShow(){}}}},{Easing:{Linear:{None:0}}});
const painter=Object.create(Painter.prototype),fades=[];
const game={add:{tween(target){const t={target,onComplete:signal(),to(p){this.props=p;return this;},stop(){this.stopped=true;}};fades.push(t);return t;}}};
for(const image of ['tree','stump','log','darkTree','rottenStump','cobwebDarkLog']){
 const cell={state:{sprite:{game,exists:true,alpha:1},renderedAdjucentCount:0,renderedContentImage:image}};
 painter.updateDecorationOpacity(cell);assert.equal(cell.state.sprite.alpha,.42);painter.revealCellContent(cell);assert.equal(fades[fades.length-1].props.alpha,.42);
 fades[fades.length-1].onComplete.complete();assert.equal(cell.state.sprite.alpha,.42);
}
const cell={state:{sprite:{game,exists:true,alpha:1},renderedAdjucentCount:1,renderedContentImage:'tree_num1'}};
painter.updateDecorationOpacity(cell);painter.revealCellContent(cell);const old=fades[fades.length-1];assert.equal(old.props.alpha,1);
cell.state.renderedAdjucentCount=0;cell.state.renderedContentImage='log';painter.updateDecorationOpacity(cell);assert(old.stopped);old.onComplete.complete();assert.equal(cell.state.sprite.alpha,.42,'stale reveal cannot restore bright empty scenery');
for(const image of ['tree_num2','mirror','mushroom','wlilly1']){cell.state.renderedContentImage=image;painter.updateDecorationOpacity(cell);assert.equal(cell.state.sprite.alpha,1);}
console.log('PASS level artwork: continuous proportional scenes, viewport reserve, graded haze, matching scroll masks, cleanup and stable unnumbered-scenery opacity.');
