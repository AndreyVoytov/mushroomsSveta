// Run: node tools/test-forest-presentation.js
const fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript'),assert=require('assert');
function load(file,mocks={},phaser={}){
    const exports={};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{
        compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}
    }).outputText,{exports,console:{log(){}},window:{location:{href:''}},Phaser:Object.assign({Sprite:function(){}},phaser),
        require:name=>mocks[path.basename(name)]||{default:function(){}}});
    return exports.default;
}

// Carry the actual closed panel through world and overlay destruction, then
// reclaim it once. A slow preload cannot expose a replacement/blank frame.
{
    const Trees=load('src/view/component/panel/TreesTransitionPanel.ts',{
        AnimationUtils:{default:{primeForShow(){}}}
    });
    function parent(){return {children:[],addChild(c){if(c.parent)c.parent.children.splice(c.parent.children.indexOf(c),1);this.children.push(c);c.parent=this;}};}
    const stage=parent(),oldOverlay=parent();
    const removed=[];
    const game={stage,time:{events:{add(){},remove:e=>removed.push(e),loop:()=>22}}};
    const cover=Object.create(Trees.prototype);
    Object.assign(cover,{game,exists:true,visible:true,coverAnimationComplete:false,loadingDotsEvent:11});
    oldOverlay.addChild(cover);
    cover.coveredCallbacks=[()=>{oldOverlay.children.forEach(c=>{c.exists=false;});oldOverlay.children=[];}];
    cover.markCoverAnimationComplete();
    assert(cover.exists&&cover.visible&&cover.parent===stage);
    assert.equal(oldOverlay.children.length,0);
    assert.strictEqual(Trees.takeClosedCover(game),cover,'same geometry and texture survive loading');
    assert.deepEqual(removed,[11]);
    assert.equal(cover.loadingDotsEvent,22);
    assert.strictEqual(Trees.takeClosedCover(game),null,'cover consumed once');
}

const cellTypes={COMPASS_FREE:1,COMPASS_IVY:2};
const Booster=load('src/core/service/provider/BoosterProvider.ts',{
    CellType:{default:cellTypes},OpeningType:{default:{usual:0,byCompass:1}},
    ForestUtils:{default:{getOpeningTypeByBooster:()=>1}},ContentType:{ContentType:{empty:0}}
});
{
    const opened={state:{opened:false}},near={type:1,state:{opened:false,cover:{isLocked:()=>false}}},
        locked={type:2,state:{opened:false,cover:{isLocked:()=>true}}},far={type:1,state:{opened:false,cover:{isLocked:()=>false}}};
    const booster=Object.create(Booster.prototype),activations=[];
    Object.assign(booster,{cellsProvider:{getCells:()=>[near,locked,far],areAdjucent:c=>c!==far},
        activateBooster:(c,neighbor)=>{activations.push({c,neighbor});c.state.opened=true;}});
    booster.activateAdjacentSnails(opened);
    assert.equal(activations.length,0,'a neighboring tap is not a cell opening');
    opened.state.opened=true;
    booster.activateAdjacentSnails(opened);booster.activateAdjacentSnails(opened);
    assert.equal(activations.length,1);
    assert.strictEqual(activations[0].c,near);assert(activations[0].neighbor);
    let energy=0;
    Object.assign(booster,{game:{tweens:{removeFrom(){}}},screen:{topPanel:{tryOpenCell:()=>{energy++;return true;}},refreshIvyAndIce(){}}});
    near.state.opened=false;near.state.sprite={};
    assert(booster.doApplyCurrentBooster(near.state.sprite,near,true));
    assert.equal(energy,0,'neighbor activation does not charge a second move');
    assert(!booster.doApplyCurrentBooster(near.state.sprite,near,true),'activation is idempotent');
}

// Execute the animation setup, including the callback that enters the turn.
{
    const timers=[],animations={},played=[],growth=[];
    let sparkEffects=0;
    const AnimatedBooster=load('src/core/service/provider/BoosterProvider.ts',{
        SnailSpinEffects:{default:function(){sparkEffects++;}},SoundUtils:{default:{useCompass(){}}},
        Settings:{default:{isOnlyLinearAnimations:()=>true}},
        ContentType:{ContentType:{empty:0}}
    },{ArrayUtils:{numberArray:(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i)},Easing:{Linear:{None:0},Sinusoidal:{InOut:1}}});
    const booster=Object.create(AnimatedBooster.prototype);
    Object.assign(booster,{doApplyCurrentBooster:()=>true,cellsProvider:{getCells:()=>[]},
        game:{time:{events:{add:(ms,fn)=>timers.push({ms,fn})}},add:{tween:target=>({to(props,duration){growth.push({target,props,duration});return this;},stop(){}})}},
        screen:{delayWinOrLooseCheck(){},bringUiToTop(){},add:{existing(){}}}});
    const sprite={exists:true,visible:true,scale:{x:1,y:1},loadTexture(){},anchor:{set(){}},animations:{
        add:(key,frames,fps,loop)=>{const a={frames,fps,loop,onComplete:{addOnce:fn=>{a.complete=fn;}}};animations[key]=a;return a;},
        play:key=>played.push(key)
    }};
    const originalState={content:100},cell={state:originalState};
    booster.applyCurrentCompass(sprite,cell);
    timers.find(t=>t.ms===200).fn();
    assert.equal(animations.charge.frames[0],0);
    assert.deepEqual(Array.from(animations.spin.frames),Array.from({length:20},(_,i)=>20+i));
    assert(animations.spin.loop);
    assert.equal(sprite.width,144);
    assert.equal(growth[0].props.x,1.3,'first turn grows smoothly to 1.3');
    animations.charge.complete();
    assert.equal(sprite.width,144,'second turn retains its original size');
    assert.equal(sprite.height,153);
    assert.deepEqual(played,['charge','spin']);assert.equal(sparkEffects,1);
    cell.state={content:153}; // A later water/cell exchange changes the tile owner.
    timers.find(t=>t.ms===2000).fn();
    timers.find(t=>t.ms===750).fn();
    assert.equal(originalState.content,0);
    assert.equal(cell.state.content,153,'finishing snail cannot erase a replacement decoration');
}

// Neighbor reactions choose their own material sound.
{
    const sounds=[];
    const Painter=load('src/core/service/provider/CellsPainter.ts',{
        ContentType:{ContentType:{mirror:1,wlilly1:2,wlilly2:3,tree:4}},
        SoundUtils:{default:{mirrorGlass:()=>sounds.push('glass'),waterLilySway:()=>sounds.push('water'),treeRustle:()=>sounds.push('leaves')}},
        Utils:{default:{random:()=>0}}
    },{Easing:{Sinusoidal:{InOut:0}}});
    const painter=Object.create(Painter.prototype);
    painter.stopNumberedTreeReaction=()=>{};
    const tween={to(){return this;},onUpdateCallback(){},onComplete:{addOnce(){}}};
    for(const content of [1,2,3,4]){
        painter.animateNumberedTreeReaction({state:{content,sprite:{game:{add:{tween:()=>tween}}}}},'tree');
    }
    assert.deepEqual(sounds,['glass','water','water','leaves']);
}

// The idle hint follows the board's six-sided footprint.
{
    const points=[];
    const Screen=load('src/view/screen/BaseForestScreen.ts',{
        BaseCellsProvider:{default:{CELL_WIDTH:120,CELL_HEIGHT:127}}
    },{Easing:{Sinusoidal:{Out:0},Linear:{None:0}}});
    const s=Object.create(Screen.prototype),cell={state:{opened:false,cover:{isDark:()=>false},sprite:{x:200,y:400}}};
    Object.assign(s,{lastCellActivityAt:0,lastIdleWaveAt:0,levelStopped:false,cellsProvider:{getCells:()=>[cell]},
        game:{camera:{y:0},height:1000,time:{now:5000,events:{add:(ms,fn)=>fn()}},add:{
            graphics:()=>({lineStyle(){},drawPolygon:p=>points.push(p),drawCircle(){throw Error('circular wave');},scale:{set(){}}}),
            tween:()=>({to:()=>({onComplete:{addOnce(){}}})})}}});
    s.showIdleCellWavesIfNeeded();
    assert.equal(points.length,1);assert.equal(points[0].length,14);
    assert.equal(new Set(Array.from({length:6},(_,i)=>points[0].slice(i*2,i*2+2).join(','))).size,6);
}

console.log('Forest presentation: persistent transition handoff, neighbor-triggered snail, full turn frames and hex waves passed.');
