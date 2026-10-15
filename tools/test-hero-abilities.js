// Run: node tools/test-hero-abilities.js
const fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript'),assert=require('assert');
function load(file,mocks={},phaser={},named=false){
    const exports={};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{
        compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}
    }).outputText,{exports,console:{log(){}},Phaser:Object.assign({Sprite:function(){}},phaser),
        require:name=>mocks[path.basename(name)]||{default:function(){}}});
    return named?exports:exports.default;
}
const Party=load('src/core/service/HeroParty.ts');
const Tracker=load('src/core/service/HeroChargeTracker.ts',{HeroParty:{default:Party}});
const content=load('src/core/model/enum/ContentType.ts',{}, {},true);
const types=load('src/core/model/enum/CellType.ts');
const Opening=load('src/core/model/enum/OpeningType.ts');
const C=content.ContentType;

assert.deepEqual(Array.from(Party.members({hasCharacter:id=>id==='sveta'}),h=>h&&h.id),['sveta',null,null]);
assert.deepEqual(Array.from(Party.members({hasCharacter:()=>true}),h=>h.id),['sveta','boris','owl']);
{
    const t=new Tracker(['sveta','boris','owl']);
    t.spend(29);assert.equal(t.nextReady(),null);t.spend(1);assert.equal(t.nextReady(),'sveta');
    t.consume('sveta');assert.equal(t.value('sveta'),0);
    t.spend(5);assert.equal(t.nextReady(),'owl');t.consume('owl');
    t.spend(5);assert.equal(t.nextReady(),'boris');t.consume('boris');
    assert.equal(t.value('sveta'),10);assert.equal(t.value('owl'),5);
    t.spend(100);t.consume('sveta');assert.equal(t.value('sveta'),80,'overflow is preserved');
    const before=t.value('boris');t.spend(-5);t.spend(NaN);assert.equal(t.value('boris'),before);
    assert.equal(new Tracker(['sveta']).value('sveta'),0,'new level starts with no charge');
}

// Exercise the real energy entry points. Refunds and free booster openings do
// not change charge; a failed purchase of energy does not create charge.
{
    const t=new Tracker(['sveta']),energy={value:10,getEnergy(){return this.value;},
        spendEnergy(n=1){if(this.value<n)return false;this.value-=n;return true;},addEnergy(n){this.value+=n;}};
    const Top=load('src/view/component/forest/ForestTopPanel.ts',{UserService:{default:{getUser:()=>energy}},OpeningType:{default:Opening}});
    const top=Object.create(Top.prototype);
    Object.assign(top,{levelEnergySpent:0,levelEnergyRefunded:0,energyLabel:{},screen:{onEnergySpent:n=>t.spend(n),showEnergyPanel(){}}});
    assert(top.tryOpenCell(Opening.usual));assert.equal(t.value('sveta'),1);
    assert(top.tryOpenCell(Opening.byVision));assert.equal(t.value('sveta'),1);
    top.restoreSteps(2);assert.equal(t.value('sveta'),1,'animal refund cannot subtract gross expenditure');
    assert(top.spendAdditionalEnergy(3));assert.equal(t.value('sveta'),4);
    energy.value=0;assert(!top.tryOpenCell(Opening.usual));assert(!top.spendAdditionalEnergy(3));
    assert.equal(t.value('sveta'),4);assert.equal(top.levelEnergySpent,4);
}

function fixture(owned=['sveta','boris','owl']){
    const timers=[],removed=[],placements=[],dice=[],opened=[];
    const cells=[];
    const game={time:{now:0,events:{loop:(ms,fn)=>({ms,fn}),add:(ms,fn)=>{const e={ms,fn};timers.push(e);return e;},remove:e=>removed.push(e)}}};
    let available=false;
    const screen={cellsProvider:{getCells:()=>cells,getAdjucentInteractiveCount:(_,c)=>c.score,calculateX:c=>c.X,calculateY:c=>c.Y},
        canUseHeroAbilities:()=>true,delayWinOrLooseCheck(){},addTopOverlay(){},
        placeHeroBooster:(id,p,done)=>{placements.push({id,p,done});return available;}};
    const panel={showCharges(){},origin:()=>({x:100,y:900})};
    const Provider=load('src/core/service/provider/HeroAbilitiesProvider.ts',{
        HeroParty:{default:Party},HeroChargeTracker:{default:Tracker},ContentType:content,OpeningType:{default:Opening},
        UserService:{default:{getUser:()=>({hasCharacter:id=>owned.includes(id)})}},
        ForestUtils:{default:{isBoosterType:()=>false}},Utils:{default:{random:()=>2}},AnimationUtils:{default:{highlight(){}}},
        HeroDiceRoll:{default:function(g,p,result,done){dice.push({result,done});}}
    });
    const provider=new Provider(game,screen,panel);
    const tile=(id,score,locked=false)=>{const c={X:cells.length,Y:0,type:types.FOREST,score,state:{opened:false,content:C.tree,
        cover:{isDark:()=>false,isLocked:()=>locked,openCell:method=>{assert.equal(method,Opening.byVision);c.state.opened=true;opened.push(id);}}}};cells.push(c);return c;};
    return {provider,game,screen,timers,removed,placements,dice,opened,tile,cells,setAvailable:v=>available=v};
}

// Ready summons wait for a free tile without consuming charge or inventory.
{
    const f=fixture(['sveta']);f.provider.recordEnergySpent(30);f.provider.pump();
    assert.equal(f.provider.tracker.value('sveta'),30);assert(!f.provider.busy);
    f.setAvailable(true);f.provider.pump();assert.equal(f.provider.tracker.value('sveta'),0);assert(f.provider.busy);
    f.provider.recordEnergySpent(31);f.provider.pump();assert.equal(f.placements.length,2,'active throw prevents a second throw');
    f.placements[1].done();f.provider.pump();assert.equal(f.provider.tracker.value('sveta'),1);
    f.provider.dispose();const count=f.placements.length;f.provider.pump();assert.equal(f.placements.length,count);
    assert(f.removed.length>=1,'state exit removes the pump');
}

// Owl opens the rolled number of eligible, highest-current-number cells, in
// sequence. A locked high number and a zero-number tree are excluded.
{
    const f=fixture(['owl']),a=f.tile('a',2),b=f.tile('b',5),c=f.tile('c',3);f.tile('zero',0);f.tile('locked',6,true);
    f.provider.recordEnergySpent(35);f.provider.pump();
    assert.equal(f.dice[0].result,3);assert.equal(f.provider.tracker.value('owl'),0);assert.equal(f.opened.length,0);
    f.dice[0].done();assert.deepEqual(f.opened,['b']);a.score=6;
    f.timers.shift().fn();assert.deepEqual(f.opened,['b','a']);
    f.timers.shift().fn();assert.deepEqual(f.opened,['b','a','c']);
    f.timers.shift().fn();assert(!f.provider.busy);
    f.provider.dispose();assert(f.removed.length>0);
}
{
    const f=fixture(['owl']);f.tile('only',4);f.provider.recordEnergySpent(35);f.provider.pump();f.dice[0].done();
    f.provider.dispose();f.timers[0].fn();assert.deepEqual(f.opened,['only'],'pending owl opening is cancelled on exit');
}

// Real placement selects an empty land tile with unexplored neighbors and
// keeps it unactivatable while it is travelling from the portrait.
{
    const flights=[],point=()=>({x:1,y:1,set(x,y=x){this.x=x;this.y=y;}});
    function sprite(){return {exists:true,visible:false,alpha:0,scale:point(),position:point(),kill(){this.visible=false;}};}
    const far={X:0,Y:0,type:types.FOREST,state:{opened:true,content:C.empty,sprite:sprite(),label:{},cover:{}}};
    const near={X:2,Y:0,type:types.FOREST,state:{opened:true,content:C.empty,sprite:sprite(),label:{},cover:{}},bg:{}};
    const closed={X:3,Y:0,type:types.FOREST,state:{opened:false,content:C.mushroom,cover:{isDark:()=>false}}};
    const cp={getCells:()=>[far,near,closed],areAdjucent:(a,b)=>a===closed&&b===near,stopNumberedTreeReaction(){},calculateX:c=>c.X*100,calculateY:()=>400,
        addCellSprite:(g,s,c)=>{c.state.sprite=sprite();c.state.sprite.alpha=1;c.state.sprite.visible=true;}};
    const Forest=load('src/view/screen/ForestScreen.ts',{ContentType:content,CellType:{default:types},
        BiomType:{default:{WATER:'water'}},ForestUtils:{default:{getBiom:()=> 'land'}},Utils:{default:{random:()=>2}},AnimationUtils:{default:{highlight(){}}}},
        {Easing:{Sinusoidal:{Out:1}},Math:{bezierInterpolation(){}}});
    const scene=Object.create(Forest.prototype);
    Object.assign(scene,{cellsProvider:cp,hasMobileOccupant:()=>false,delayWinOrLooseCheck(){},
        game:{time:{now:100},add:{tween:()=>({to(){return this;},interpolation(){return this;},onComplete:{addOnce:fn=>flights.push(fn)}})}}});
    let landed=0;
    assert(scene.placeHeroBooster('sveta',{x:100,y:900},()=>landed++));
    assert.equal(near.state.content,C.compass);assert.equal(near.type,types.COMPASS_FREE);
    assert(!near.state.opened&&near.state.boosterLanding&&!near.state.sprite.inputEnabled);
    assert.equal(far.state.content,C.empty);
    flights[0]();assert(!near.state.boosterLanding&&near.state.sprite.inputEnabled);assert.equal(landed,1);
}
console.log('Hero abilities: three-slot roster, gross energy, thresholds/overflow, pending summons, round-robin, ranked sequential owl reveals, landing guard and exit cleanup passed.');

// Dice use at most six tiny cached faces; the settled face and callback are
// stable regardless of frame rate, and the transient sprite destroys itself.
{
    function Group(game){this.game=game;this.exists=true;this.children=[];}
    Group.prototype.add=function(s){this.children.push(s);};Group.prototype.destroy=function(){this.exists=false;};
    const cache={},created=[];
    function Sprite(g,x,y,texture){Object.assign(this,{x,y,texture,anchor:{set(){}},scale:{set(){}},loadTexture(t){this.texture=t;}});}
    const ctx={save(){},beginPath(){},moveTo(){},arcTo(){},closePath(){},fill(){},stroke(){},arc(){},
        createLinearGradient:()=>({addColorStop(){}})};
    const game={world:{},time:{now:0},cache:{getBitmapData:k=>cache[k],addBitmapData:(k,v)=>cache[k]=v},
        make:{bitmapData:(w,h)=>{created.push({w,h});return {ctx};}}};
    const Dice=load('src/view/component/forest/HeroDiceRoll.ts',{}, {Group,Sprite});
    let settled=0;
    const dice=new Dice(game,{x:200,y:900},6,()=>settled++);
    for(let t=0;t<1600;t+=17){game.time.now=t;dice.update();}
    assert.equal(created.length,6);assert(created.every(d=>d.w===96&&d.h===104));
    assert.equal(dice.face,6);assert.equal(settled,1);assert(!dice.exists);
}
