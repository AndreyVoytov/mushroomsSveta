// Run: node tools/test-house-discovery.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

function load(file, mocks = {}, phaser = {}) {
    const exports = {};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
        compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5}
    }).outputText, {exports, console: {log() {}}, screen: {}, Phaser: Object.assign({Sprite: function() {}}, phaser),
        require: name => mocks[path.basename(name)] || {default: function() {}}});
    return exports.default;
}

let forestIndex = 1;
const content = {mushroom:1,tree:2,specificItem:3,lilly:4};
const Education = load('src/view/component/dialog/EducationPanel.ts', {
    ContentType:{ContentType:content,ItemContents:{1:1}},
    AimType:{default:{item:0,itemsBunch:1}},
    SpecialItemsConfiguration:{default:{allItems:[{level:'2',image:'homeHex'},{level:'4',image:'diaryHex'}]}},
    BaseCellsProvider:{default:{CELL_WIDTH:120,CELL_HEIGHT:127}},
    SpriteUtils:{default:{loadTexture:(sprite,image)=>{sprite.image=image;}}},
    ForestDao: {default: {indexOf: () => forestIndex}},
    ForestReplicasConfiguration: {default:{allReplicas:[{id:'fr1'}]}},
    UserService: {default: {getUser: () => ({addMarker() {}})}}
});

// The last mushroom is replaced immediately, even if other tiles remain.
for (let lastMushroom = 0; lastMushroom < 19; lastMushroom++) {
    const cells = Array.from({length:19}, (_, i) => ({state: {opened:false,sprite:{},
        content:i === lastMushroom || (i < lastMushroom && i % 2 === 0) ? content.mushroom : content.tree}}));
    const panel = Object.create(Education.prototype);
    const reveals = [];
    const aim = {type:0,image:'mushroom',countLeft:cells.filter(c=>c.state.content===content.mushroom).length};
    Object.assign(panel, {cells, forestType:{}, aims:[aim],houseDiscovered:false,
        screen:{getForestType:()=>({id:'2'})},
        doShowDialogOnSpecificItem: state => {reveals.push(state);state.content=content.specificItem;}});
    cells.forEach((cell, index) => {
        cell.state.opened = true;
        panel.showEducation(cell.state, index + 1);
        if (cell.state.content===content.mushroom) aim.countLeft--;
        assert.equal(reveals.length, index >= lastMushroom ? 1 : 0);
    });
    assert.strictEqual(reveals[0], cells[lastMushroom].state);
    assert.equal(aim.countLeft,1,'the replaced mushroom is never collected');
    assert.equal(cells[lastMushroom].state.sprite.image,'homeHex');
    panel.showEducation(cells[18].state, 19);
    assert.equal(reveals.length, 1, 'discovery is idempotent');
}

// A small scale inherited from any ordinary item must not shrink the diary.
{
    forestIndex=18;
    const panel=Object.create(Education.prototype);
    Object.assign(panel,{forestType:{},doShowEducation(){throw Error('removed blueberry tutorial must not appear');},screen:{setOnClickAnimation(){throw Error('level 19 must not be tutorial-locked');}}});
    panel.showEducation(null,0);
    forestIndex=1;
}

for (const size of [12,36,90,127]) {
    const panel = Object.create(Education.prototype);
    const state = {content:content.mushroom,sprite:{width:size,height:size}};
    Object.assign(panel,{aims:[{type:0,image:'mushroom',countLeft:1}],screen:{getForestType:()=>({id:'4'})}});
    panel.showSpecificCellOnItemAimsLeft(state,0);
    assert.equal(state.sprite.image,'diaryHex');
    assert.equal(state.sprite.width,120);
    assert.equal(state.sprite.height,127);
}

// A returning player's completed story must still be shown on discovery,
// and input must belong to that same live replica when it unlocks.
{
    let unlock, initialReplica;
    const house = {exists:true,inputEnabled:false,input:{}};
    const currentReplica = {whenFullyShown:fn=>{unlock=fn;}};
    const panel = Object.create(Education.prototype);
    Object.assign(panel, {forestType:{},cells:[{state:{sprite:house}}],revealDiscoveredHouse(){},doShowEducation(){},
        screen:{stopLevelForDialog(){},lockScreenFor(){},dialogPanel:{replicaPanel:currentReplica,
            updateReplica:(...args)=>{initialReplica=args[4];}}}});
    panel.doShowDialogOnSpecificItem(panel.cells[0].state);
    assert.equal(initialReplica.id,'fr1','replay explicitly supplies the discovery replica');
    assert(!house.inputEnabled);
    unlock();
    assert(house.inputEnabled && house.input.useHandCursor);
    house.inputEnabled = false;
    panel.screen.dialogPanel.replicaPanel = null;
    unlock();
    assert(!house.inputEnabled,'stale discovery callback cannot unlock the house');
}

// Phaser clears panel.game on destroy before it destroys all world sprites.
// The house's idle-animation cleanup must survive that destruction order.
{
    let cleanup, fittedWidth, removed;
    const point = () => ({set(){}});
    function Graphics() {this.position=point();this.scale=point();}
    Graphics.prototype.beginFill=Graphics.prototype.drawEllipse=Graphics.prototype.endFill=function(){};
    const HouseEducation = load('src/view/component/dialog/EducationPanel.ts', {
        SpriteUtils:{default:{loadTexture(){},fitIcon:(sprite,w,h)=>{fittedWidth=w;sprite.width=w;sprite.height=w;}}},
        AnimationUtils:{default:{showStable(){}}}
    },{Graphics,Easing:{Sinusoidal:{Out:0,InOut:0}}});
    const game = {tweens:{removeFrom(){}},add:{tween:()=>({to(){}})},time:{events:{
        loop:()=>42,remove:event=>{removed=event;}}}};
    const house = {width:12,height:90,x:0,y:0,anchor:point(),scale:point(),input:{},bringToTop(){},
        events:{onInputDown:{add(){}},onDestroy:{addOnce:fn=>{cleanup=fn;}}}};
    const tile = {x:200,y:300,width:120,height:127,scale:{x:1,y:1},addChild(){}};
    const panel = Object.create(HouseEducation.prototype);
    panel.game=game;
    panel.revealDiscoveredHouse(house,tile);
    assert(Math.abs(fittedWidth * 100 / 130 - 120 * 0.96) < 0.001,'visible art fills the cell regardless of preceding sprite size');
    panel.game=null;
    cleanup();
    assert.equal(removed,42,'scene teardown safely cancels the house idle timer');
}

const Replica = load('src/view/component/dialog/ReplicaPanel.ts');
const replica = Object.create(Replica.prototype);
Object.assign(replica, {entranceFinished:false, textFinished:false, readyCallbacks:[]});
let ready = 0;
replica.whenFullyShown(() => ready++);
replica.markEntranceFinished();
assert(!replica.isFullyShown());
assert.equal(ready, 0, 'entrance alone does not unlock the house');
replica.textFinished = true;
replica.notifyReadyCallbacks();
assert(replica.isFullyShown());
assert.equal(ready, 1);
replica.notifyReadyCallbacks();
assert.equal(ready, 1, 'unlock callback runs once');

// Later replicas use show(), not firstShow(). They must also become ready,
// otherwise r2b never arms its fade/house-interior transition.
for (const sideSwitched of [false,true]) {
    const timers=[];
    const Replacement=load('src/view/component/dialog/ReplicaPanel.ts',{
        Settings:{default:{isOnlyLinearAnimations:()=>true}},
        AnimationUtils:{default:{tint(){}}}
    },{Easing:{Linear:{None:0},Quadratic:{Out:0}}});
    const replacement=Object.create(Replacement.prototype);
    const point=()=>({x:1,y:1});
    const tween=()=>({to(){return this;},from(){return this;}});
    Object.assign(replacement,{eventToken:0,delayedEvents:[],readyCallbacks:[],r:{},personImage:{scale:point()},
        secondPersonImage:sideSwitched?{scale:point()}:null,dialogPnl:{},titlePnl:{},title:{},text:{},textHolder:{},
        showIntroPanels(){},setNameplatePreparedHidden(){},ensureNameplateOnTop(){},
        printText(){this.textFinished=true;this.notifyReadyCallbacks();},
        game:{add:{tween},time:{events:{add:(delay,fn)=>{const t={delay,fn};timers.push(t);return t;}}}}});
    let completed=0;
    replacement.whenFullyShown(()=>completed++);
    replacement.show(sideSwitched);
    timers.shift().fn();
    assert.equal(completed,0,'printed text alone cannot arm the next action');
    const entrance=timers.shift();
    assert.equal(entrance.delay,sideSwitched?400:200);
    entrance.fn();
    assert(replacement.isFullyShown());
    assert.equal(completed,1,'replacement entrance arms its action once');
}

// Exercise the actual dialog creation path: no global action may be armed
// by a fixed timer while a discovery panel is entering or printing.
const timers = [], actions = [];
let dialogReplica;
function FakeReplica() { dialogReplica = this; this.whenFullyShown = fn => {this.ready = fn;}; }
const dialog = Object.create(load('src/view/component/dialog/DialogPanel.ts', {
    UserService:{default:{getUser:() => ({})}},
    ReplicaPanel:{default:FakeReplica}
}).prototype);
Object.assign(dialog, {game:{height:1000, time:{events:{add:(delay,fn)=>timers.push({delay,fn})}}, kineticScrolling:{stop(){}}},
    screen:{isLocked:()=>false,bringDialogOverlayToFront(){},lockScreenFor(){},setOnClickAnimation:a=>actions.push(a)},
    stripsPanel:{showStrips(){}}, getNextReplica:()=>null, bringToTop(){}, addChild(){}, lastReplicaAt:Date.now(),replicaDelay:0});
dialog.updateReplica(true, false, false, false, {id:'fr1',text:'house',afterAnimation:'exploreHouse'});
assert.equal(actions.length, 0);
assert(!timers.some(t => t.delay === 100), 'no early fixed timer');
dialogReplica.ready();
assert.deepEqual(actions, ['exploreHouse']);
dialog.replicaPanel = null;
dialogReplica.ready();
assert.equal(actions.length, 1, 'a stale replica cannot arm a transition');

// Finding the level-14 kitten uses the raised, one-shot discovery bounce.
{
    const CatEducation=load('src/view/component/dialog/EducationPanel.ts',{
        ForestDao:{default:{indexOf:()=>13}},ContentType:{ContentType:content},
        AnimationUtils:{default:{showStable:s=>{s.visible=true;s.alpha=1;}}}
    },{Easing:{Sinusoidal:{Out:0}}});
    const tweens=[],removed=[];
    const scale={x:.8,y:.9,set(x,y){this.x=x;this.y=y;}},cat={scale,exists:true,anchor:{set(){}},bringToTop(){}};
    const tile={x:240,y:740,height:127};
    const panel=Object.create(CatEducation.prototype),state={sprite:cat};
    Object.assign(panel,{cells:[{state,bg:tile}],doShowEducation(){},game:{tweens:{removeFrom:t=>removed.push(t)},add:{tween:target=>({to(props,duration){tweens.push({target,props,duration});return this;}})}},
        screen:{stopLevelForDialog(){},lockScreenFor(){},dialogPanel:{updateReplica(){}}}});
    panel.doShowDialogOnSpecificItem(state);
    const rest=tile.y-tile.height*.2;
    assert.equal(cat.x,tile.x);assert.equal(cat.y,rest);assert(cat.visible&&cat.alpha===1);
    assert(removed.includes(cat)&&removed.includes(scale));assert.equal(tweens.length,2);
    assert(tweens[1].props.y[0]<rest&&tweens[1].props.y[1]>rest);assert.equal(tweens[1].props.y.slice(-1)[0],rest);
    assert.equal(tweens[0].props.x.slice(-1)[0],.8);assert.equal(tweens[0].props.y.slice(-1)[0],.9);
    assert(tweens.every(t=>t.duration<=650),'the kitten settles promptly rather than looping');
    console.log('Kitten discovery: level-14 route, raised position, one-shot bounce and restored scale passed.');
}

const BaseScreen = load('src/view/screen/BaseForestScreen.ts', {
    Game:{default:{ANIMALS_SHOWCASE:false}},
    ContentType:{AnimalsContents:{}}
});
const scene = Object.create(BaseScreen.prototype);
let won = 0;
Object.assign(scene, {levelStopped:false,tryToScroll(){},dialogPanel:{isDialogActive:()=>false},
    educationPanel:{shown:false},
    cellsProvider:{getCells:()=>[{state:{opened:false,cover:{isDark:()=>false,isLocked:()=>false}}}]},
    topPanel:{getAims:()=>[{countLeft:0}]},tryShowEventLevelEndReplica:()=>false,showWinPanel:()=>won++});
scene.doCheckWinOrLooseConditions();
assert.equal(won, 1, 'completed aims retain normal win behavior');
scene.levelStopped=true;
scene.doCheckWinOrLooseConditions();
assert.equal(won, 1, 'a stopped level cannot finish twice');
console.log('House discovery: last mushroom in 19 reveal orders, diary size, first/replacement dialogue readiness, replay and stale callbacks passed.');
