const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript');
let config,now,queue,removed,shownRewards,completed,dialogUpdates;
function signal(){const listeners=[];return {addOnce(fn){listeners.push(fn);},dispatch(){listeners.splice(0).forEach(fn=>fn());}};}
function point(){return {x:1,y:1,set(x,y=x){this.x=x;this.y=y;}};}
function sprite(){const value={x:0,y:0,scale:point(),anchor:point(),events:{onDestroy:signal()}};value.position={set(x,y){value.x=x;value.y=y;}};return value;}
function Base(game,x,y){Object.assign(this,sprite(),{game,x,y,children:[]});}
Base.prototype.attachSprite=function(key,name){const s=sprite();s.name=name;this.children.push(s);return s;};
Base.prototype.attachText=function(name,text){const s=this.attachSprite('',name);s.text=text;return s;};
Base.prototype.addChild=function(s){this.children.push(s);};Base.prototype.bringChildToTop=function(){};
function Graphics(game,x,y){Object.assign(this,sprite(),{game,x,y,rects:[]});}
for(const key of ['beginFill','endFill','lineStyle','drawEllipse','moveTo','lineTo'])Graphics.prototype[key]=function(){return this;};
Graphics.prototype.clear=function(){this.rects=[];};Graphics.prototype.drawRoundedRect=function(x,y,w,h,r){this.rects.push({x,y,w,h,r});};
function timer(delay,fn){queue.push({at:now+delay,fn});}
function advance(ms){const end=now+ms;while(true){queue.sort((a,b)=>a.at-b.at);if(!queue.length||queue[0].at>end)break;const e=queue.shift();now=e.at;e.fn();}now=end;}
const game={height:1500,tweens:{removeFrom:target=>removed.push(target)},time:{events:{add:timer}},add:{tween(target){
 const complete=signal(),t={onComplete:complete,onUpdateCallback(fn){this.update=fn;},to(props,duration,ease,start,delay=0){timer(delay+duration,()=>{Object.assign(target,props);if(this.update)this.update();complete.dispatch();});return this;}};return t;
}}};
const user={getCurrentForest:()=>config.forest,isJustCompletedLevel:()=>config.just,getMarkers:()=>config.markers,addMarker:id=>config.markers.push(id),addCompletedTask:()=>completed++};
const mocks={BasePanel:Base,UserService:{getUser:()=>user},RecipeUtils:{getRequiredLevel:r=>r.start},DiaryConfiguration:{getNextrecipe:()=>({start:10})},
 SpriteUtils:{fitPanel(){},fitIcon(){}},PrizesConfiguration:{get allPrizes(){return config.prizes;}},ForestDao:{getEntity:()=>({getById:id=>id}),getAllForests:()=>Array.from({length:20},(_,i)=>i)},
 RewardUtils:{fromPrize:()=>['reward'],applyRewards:()=>shownRewards++},AnimationUtils:{fadeOut(){}},LocalizationService:{get:k=>k},UiLayout:{fit(){}},Label:{INK:'ink',ON_DARK:'paper'}};
const exported={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/view/component/panel/ProgressBar.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}}).outputText,
 {exports:exported,require:n=>({default:mocks[path.basename(n)]||Base}),Phaser:{Graphics,Easing:{Linear:{None:0}},Point:function(x,y){this.x=x;this.y=y;}}});
function create(forest=3,just=false,prizes=[]){config={forest,just,prizes,markers:[]};now=0;queue=[];removed=[];shownRewards=completed=dialogUpdates=0;
 const screen={progressAnimation:true,hideUI(){},lockScreenFor(){},dialogPanel:{updateReplica(){dialogUpdates++;}},showRewardItems(rewards,callback){callback();}};
 return new exported.default(game,screen,480,1350,{id:'chapter',start:3,title:'title'},false);
}
const p=create();assert.equal(p.getCurrent(),0);assert.equal(p.getTotal(),7);assert(!p.progressFill.visible);assert.equal(p.progressFill.rects.length,0,'zero leaves no start cap or tail');
for(const ratio of [0,.001,.25,.5,.75,1]){p.drawProgress(ratio);const rect=p.progressFill.rects[0];if(ratio){assert.equal(rect.w,466*ratio);assert(rect.w<=466);assert(rect.r<=rect.w/2);}else assert(!rect);}
assert.equal(p.taskCount.text,'7 / 7');p.drawProgress(-1);assert(!p.progressFill.visible);p.drawProgress(NaN);assert(!p.progressFill.visible);p.drawProgress(2);assert.equal(p.progressFill.rects[0].w,466);
p.totalCount=0;p.drawProgress(1);assert(!p.progressFill.visible);assert.equal(p.getProgressBodyWidth(10),0);assert.equal(p.taskCount.text,'0 / 0');
const done=create(10,true,[{id:'milestone',level:10}]);assert.equal(done.getCurrent(),7);assert.equal(done.taskCount.text,'6 / 7');advance(1499);assert.equal(shownRewards,0);
advance(1);assert.equal(done.taskCount.text,'7 / 7');assert.equal(shownRewards,1);assert.deepEqual(config.markers,['milestone']);advance(2000);assert.equal(completed,1);assert.equal(dialogUpdates,1);advance(10000);assert.equal(shownRewards,1);assert.equal(completed,1);
done.events.onDestroy.dispatch();assert(removed.includes(done.progressValue),'the owned progress tween is released on destruction');
console.log('PASS home progress: empty/partial/full inner bounds, clamping, zero totals, animated completion, one reward and chapter handoff, tween cleanup.');
