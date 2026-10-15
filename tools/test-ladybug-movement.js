// Run: node tools/test-ladybug-movement.js
const fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript'),assert=require('assert');
function load(file,mocks={},named=false){
    const exports={};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{
        compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}
    }).outputText,{exports,console:{log(){}},Phaser:{Easing:{Linear:{None:0},Exponential:{Out:1}}},
        require:name=>mocks[path.basename(name)]||{default:function(){}}});
    return named?exports:exports.default;
}
const content=load('src/core/model/enum/ContentType.ts',{},true);
const C=content.ContentType;
const common={ContentType:content,Settings:{default:{isOnlyLinearAnimations:()=>false}},
    ForestUtils:{default:{getBiom:type=>type==='water'?'water':'land'}},BiomType:{default:{WATER:'water'}},
    Utils:{default:{random:()=>0}},SoundUtils:{default:{ladybugMove(){},acornMove(){}}}};
const Base=load('src/core/service/provider/BaseCellsProvider.ts',common);
const Ladybugs=load('src/core/service/provider/LadybugsProvider.ts',common);
function point(x=1,y=x){return {x,y,set(x,y=x){this.x=x;this.y=y;}};}
function sprite(x,y){const s={x,y,scale:point(.67),alpha:1,exists:true,bringToTop(){}};return s;}
function state(x,y,kind=C.tree){return {opened:true,content:kind,sprite:sprite(x,y),label:sprite(x,y),movementEndAt:0};}
function cell(y,kind=C.tree){return {X:0,Y:y,type:'land',state:state(0,y*100,kind)};}
function bug(y){return {X:0,Y:y,collected:false,sprite:sprite(0,y*100),baseScaleX:.67,baseScaleY:.67,animationEndAt:0,isLadybug:true};}
function fixture(cells,bugs){
    const tweens=[],events=[];
    const game={time:{now:0,events:{add:(delay,fn)=>events.push({at:game.time.now+delay,fn})}},
        tweens:{removeFrom:target=>tweens.filter(t=>t.target===target&&!t.done).forEach(t=>t.cancelled=true)},
        add:{tween:target=>({to(props,duration,easing,auto,delay=0){
            const t={target,props,duration,easing,at:game.time.now+delay,from:{},cancelled:false,done:false};
            Object.keys(props).forEach(k=>t.from[k]=target[k]);tweens.push(t);return this;
        }})}};
    const provider=Object.create(Base.prototype);
    Object.assign(provider,{game,cells,calculateX:c=>c.X*120,calculateY:c=>c.Y*100,
        getBottomOpenedCellsWithNoSeparators:(x,y)=>cells.filter(c=>c.Y===y+1),getBottomCells:()=>[{state:{cover:{isDark:()=>false}}}]});
    const ladybugs=Object.create(Ladybugs.prototype);
    Object.assign(ladybugs,{game,cellsProvider:provider,ladybugsAndAcorns:bugs,
        screen:{delayWinOrLooseCheck(){},bringUiToTop(){},refreshCovers(){}}});
    provider.stopNumberedTreeReaction=()=>{};
    function advance(now){
        game.time.now=now;
        tweens.forEach(t=>{
            if(t.cancelled||t.done||now<t.at)return;
            const p=Math.min(1,(now-t.at)/t.duration),e=t.easing===0?p:p===1?1:1-Math.pow(2,-10*p);
            Object.keys(t.props).forEach(k=>t.target[k]=t.from[k]+(t.props[k]-t.from[k])*e);
            if(p===1)t.done=true;
        });
        events.filter(e=>!e.done&&e.at<=now).forEach(e=>{e.done=true;e.fn();});
    }
    return {game,provider,ladybugs,tweens,advance};
}

// Both sprites traverse the same distance at the same speed, with no shrinking
// or delayed reappearance of the decoration.
{
    const top=cell(0,C.empty),bottom=cell(1),moving=bug(0),decoration=bottom.state.sprite;
    const f=fixture([top,bottom],[moving]);
    assert(f.ladybugs.refreshLadybugsAndAcorns());
    const a=f.tweens.find(t=>t.target===moving.sprite),b=f.tweens.find(t=>t.target===decoration);
    assert.equal(a.at,b.at);assert.equal(a.duration,b.duration);assert.equal(a.easing,b.easing);
    for(const t of [120,180,300,500,720]){
        f.advance(t);
        assert(Math.abs(moving.sprite.y+decoration.y-100)<.0001,'exchange has matching progress at '+t);
        assert.equal(decoration.scale.x,.67,'decoration never vanishes into a scale tween');
    }
    assert.equal(moving.sprite.y,100);assert.equal(decoration.y,0);
    assert.equal(moving.sprite.scale.x,.67,'movement preserves the board size');
}

// First entry clears the decoration permanently; there is no previous tile.
{
    const first=cell(0),second=cell(1),moving=bug(-1),discarded=first.state.sprite;
    const f=fixture([first,second],[moving]);
    f.ladybugs.refreshLadybugsAndAcorns();f.advance(720);
    assert.equal(first.state.content,C.empty);assert.equal(discarded.alpha,0);
    f.ladybugs.refreshLadybugsAndAcorns();f.advance(1440);
    assert.equal(discarded.alpha,0,'later swaps never restore the discarded sprite');
    assert.equal(moving.Y,1);
}

// A second ladybug cannot commandeer a decoration still moving up into its tile.
{
    const cells=[cell(0,C.empty),cell(1),cell(2)],lower=bug(0),upper=bug(-1);
    const f=fixture(cells,[upper,lower]);
    f.ladybugs.refreshLadybugsAndAcorns();
    assert.equal(lower.Y,1);assert.equal(upper.Y,-1);
    f.advance(500);f.ladybugs.refreshLadybugsAndAcorns();assert.equal(upper.Y,-1);
    f.advance(720);f.ladybugs.refreshLadybugsAndAcorns();
    assert.equal(lower.Y,2);assert.equal(upper.Y,0,'next exchange can begin after the first one lands');
    const count=f.tweens.length;f.ladybugs.refreshLadybugsAndAcorns();assert.equal(f.tweens.length,count,'no duplicate move');
}

// Empty-cell escape sprites and activated boosters remain owned by their
// running animation, even when the logical state rotates to another tile.
for(const kind of [C.empty,C.compass]){
    const top=cell(0,kind),bottom=cell(1),visual=top.state.sprite;
    const f=fixture([top,bottom],[]);
    f.game.add.tween(visual).to({x:200,y:-400},2000,0,true,0);
    const escape=f.tweens[0];
    f.provider.switchCellsByCircle([top,bottom],null,true,120,600);
    assert(!escape.cancelled,'existing animation keeps its tween');
    assert.equal(f.tweens.filter(t=>t.target===visual).length,1);
    f.advance(720);
    assert(Math.abs(visual.x-72)<.001&&Math.abs(visual.y+144)<.001,'visual follows its own escape arc');
}

// Water carries every movable once, using its original tile coordinates.
{
    const cells=[cell(0,C.empty),cell(1,C.empty),cell(2,C.empty)],bugs=[bug(1),bug(2)];
    cells.forEach(c=>c.type='water');
    const f=fixture(cells,bugs);
    f.provider.switchCellsByCircle(cells,bugs);
    assert.deepEqual(bugs.map(b=>b.Y),[0,1]);
    f.advance(700);assert.deepEqual(bugs.map(b=>b.sprite.y),[0,100]);
    assert(bugs.every(b=>b.animationEndAt===700));
}
{
    const done=bug(0);done.collected=true;
    const f=fixture([cell(0),cell(1)],[done]);
    assert(!f.ladybugs.refreshLadybugsAndAcorns());assert.equal(f.tweens.length,0);
}
console.log('Ladybug movement: synchronized swaps, permanent first-entry removal, shared-cell reservations, anchored escapes, water transport and collected guards passed.');
