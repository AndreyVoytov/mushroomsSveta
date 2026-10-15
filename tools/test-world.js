// Behavioral integration checks without Phaser, real payments, or player files.
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),cache={};let now=Date.parse('2026-10-14T08:00:00Z'),current,sequence=0,denyWrites=false,cloudFails=false,consumeFails=false;
const store=new Map(),writes=[],cloud=[],consumed=[],events=[];
class TestDate extends Date{constructor(...a){super(...(a.length?a:[now]));}static now(){return now;}}
const mocks={
    Settings:{PLAIN_MODE:true,KEY:'test',BUYS:[{id:'r110',gems:110,price:19}],ANALYTICS_BUILD_VERSION:'test'},
    Game:{LOCAL_USER_ID:'test',getInstance:()=>({state:{getCurrentState:()=>({})}})},
    Utils:{UUID:()=> 'op-'+(++sequence),delete:(a,x)=>{const i=a.indexOf(x);if(i>=0)a.splice(i,1);}},
    Telemetry:{track:(...x)=>events.push(x),economy:()=>{},context:{}},
    AnalyticUtils:{haveLocalStorage:()=>true,getCustomization:()=>2,logPurchase:()=>{},canPlayWithoutInternet:()=>true},
    UserService:{getUser:()=>current,setUser:x=>current=x,userLoaded:true},
    EverydayRubyPanel:{RUBIES_COUNT:50},SoundUtils:{successfulEverydayGems:()=>{}},
    LocalizationService:{get:x=>x},ForestUtils:{markBoosterSeen:()=>{}},
    YandexGamesHelper:{queueProfile:()=>{},saveProfile:u=>{if(cloudFails)return Promise.reject(Error('offline'));cloud.push(JSON.stringify(u));return Promise.resolve();},consumePurchase:t=>{if(consumeFails)return Promise.reject(Error('consume offline'));consumed.push(t);return Promise.resolve();}},
    ForestDao:{getAllForests:()=>load('src/core/configuration/ForestConfiguration.ts').default.allForests}
};
['ForestScreen','ConfirmPanel','BuyConfirmPanel','CircleProgressPanel'].forEach(k=>mocks[k]=class{});
function load(file){
    const full=path.resolve(root,file);if(cache[full])return cache[full];const exports=cache[full]={};
    if(full.endsWith('.json'))return JSON.parse(fs.readFileSync(full,'utf8'));
    const code=ts.transpileModule(fs.readFileSync(full,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2015,module:ts.ModuleKind.CommonJS}}).outputText;
    vm.runInNewContext(code,{exports,console:{log(){},warn(){}},Date:TestDate,performance:{now:()=>now},Math,Promise,isFinite,setTimeout,clearTimeout,
        window:{location:{href:'http://localhost/',search:''}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>{if(denyWrites)throw Error('QuotaExceeded');store.set(k,v);writes.push(k);}},
        require:name=>{const base=path.basename(name);if(mocks[base])return {default:mocks[base]};return load(path.resolve(path.dirname(full),name+(path.extname(name)?'':'.ts')));}
    },{filename:full});return exports;
}
const User=load('src/core/model/user/User.ts').default;
const Clock=load('src/core/service/GameClock.ts').default;
const Store=load('src/core/service/store/LocalStoreComponent.ts').default;
const Tasks=load('src/core/service/TaskService.ts').default;
const World=load('src/core/service/WorldService.ts').default;
const Config=load('src/core/configuration/WorldConfiguration.ts').default;
const Shop=load('src/core/service/ShopService.ts').default;
const Live=load('src/core/service/LiveConfig.ts').default,Ads=load('src/core/service/AdPacing.ts').default;
function fresh(){Clock.synchronize(now);World.activeAdventure=null;World.expedition=false;World.houseAfterWorld=false;current=new User();return current;}
async function main(){
    let u=fresh();u.addEnergy(100);assert.equal(u.getEnergy(),220);u.addEnergy(1,false);assert.equal(u.getEnergy(),220);
    u.energy=119;u.lastEnergyRegenerationAt=now;u.addEnergy(3,false);assert.equal(u.getEnergy(),120);
    u=fresh();assert(u.claimFieldSapphires('field-a1',3));assert.equal(u.getSupermoney(),303);assert(!u.claimFieldSapphires('field-a1',3));u=new User(JSON.parse(store.get('user3456789012')));assert(!u.claimFieldSapphires('field-a1',3));denyWrites=true;assert.throws(()=>u.claimFieldSapphires('field-a2',2),/Quota/);denyWrites=false;assert.equal(u.getSupermoney(),303);assert(!u.rewardedAttemptIds.includes('field-a2'));
    u=fresh();u.energy=10;u.lastEnergyRegenerationAt=now-1800000;assert(u.buyEnergyPack());assert.equal(u.getEnergy(),170);assert.equal(u.getSupermoney(),290);
    u=fresh();const energyBefore=JSON.stringify(u);denyWrites=true;assert.throws(()=>u.buyEnergyPack(),/Quota/);denyWrites=false;assert.equal(JSON.stringify(u),energyBefore);
    u=fresh();u.dailyGiftDayId='2026-10-13';const count=writes.length;u.tryGiveEverydayGems(null);u.tryGiveEverydayGems(null);assert.equal(u.getSupermoney(),350);assert.equal(writes.length,count+1);
    const reloaded=new User(JSON.parse(store.get('user3456789012')));assert(!reloaded.haveEverydayGemsToTake());
    for(const time of ['2026-10-14T20:59:00Z','2026-10-14T21:00:00Z','2026-10-15T02:59:00Z','2026-10-15T03:00:00Z']){now=Date.parse(time);Clock.synchronize(now);assert.equal(Clock.day(),time<'2026-10-14T21:00:00Z'?'2026-10-14':'2026-10-15');}
    u=fresh();u.dailyGiftDayId='2026-10-14';const before=u.getSupermoney();denyWrites=true;assert.throws(()=>u.tryGiveEverydayGems(null),/Quota/);denyWrites=false;assert.equal(u.getSupermoney(),before);assert(u.haveEverydayGemsToTake());
    u=fresh();const state=u.getTasksState();state.dailyDayId=Clock.day();state.dailyTaskIds=['daily_spend_20','daily_levels_2','daily_mushroom_10'];u.spendEnergy(10);u.addEnergy(5);Tasks.resetPendingLevelCollections();assert.equal(Tasks.getDailyTaskViews(u).find(x=>x.task.id==='daily_spend_20').progress,10);
    u=fresh();const first=Tasks.getDailyTasks(u).map(t=>t.id);u.setCurrentForest(80);assert.deepEqual(Tasks.getDailyTasks(u).map(t=>t.id),first);u=fresh();assert(Tasks.getDailyTasks(u).every(t=>!['acorn','mushroom5','chamomileSmall'].includes(t.targetId)));assert(Tasks.rerollDailyTask(u));assert(!Tasks.rerollDailyTask(u));
    u=fresh();u.setCurrentForest(18);World.prepare(u);assert(World.encounters(u).some(e=>e.id==='ghostDoor'));const originalLevel=u.getCurrentForest();assert(!World.check(u,'ghostDoor',0,'sveta'));assert.equal(u.getCurrentForest(),originalLevel);
    const base=World.stat(u,'sveta','knowledge');World.grantItem(u,'crownOfDawn');assert(World.stat(u,'sveta','knowledge')>base);const stat=World.stat(u,'sveta','knowledge');World.wear(u,'crownOfDawn');assert.equal(World.stat(u,'sveta','knowledge'),stat);
    while(World.stat(u,'sveta','knowledge')<12)assert(World.train(u,'sveta','knowledge'));
    assert(World.check(u,'ghostDoor',0,'sveta'));const energy=u.getEnergy();assert(!World.check(u,'ghostDoor',0,'sveta'));assert.equal(u.getEnergy(),energy);assert.equal(u.getCurrentForest(),originalLevel);
    assert(!u.world.adventures.ghostDoor.startedAt);now+=86400000;Clock.synchronize(now);assert(World.startAdventure(u,'ghostDoor'));assert.equal(u.world.adventures.ghostDoor.startedAt,now);
    for(let i=0;i<8;i++){World.activeAdventure='ghostDoor';World.completeLevel(u);}assert(u.world.adventures.ghostDoor.completedAt);assert(u.world.wardrobe.includes('forestWreath'));assert.equal(u.getCurrentForest(),originalLevel);assert(World.houseAfterWorld);
    u=fresh();u.setCurrentForest(18);World.prepare(u);now+=2*86400000;Clock.synchronize(now);assert(!World.encounters(u).some(e=>e.id==='ghostDoor'));
    u=fresh();u.world.adventures.ghostDoor={unlockedAt:now,progress:0};assert(World.startAdventure(u,'ghostDoor'));now+=3*86400000;Clock.synchronize(now);assert(!World.startAdventure(u,'ghostDoor'));World.completeLevel(u);assert.equal(u.world.adventures.ghostDoor.progress,0);
    u=fresh();u.world.materials={wood:3,clover:2};assert(World.craft(u,'forestWreath'));assert.equal(u.world.materials.wood,0);assert(!World.craft(u,'forestWreath'));
    u=fresh();u.unlockCharacter('boris');assert(World.relationAction(u,'sveta:boris',false));assert(!World.relationAction(u,'sveta:boris',false));u.world.relationships['sveta:boris']=55;World.prepare(u);assert(u.world.adventures.catTrail);assert(!u.world.adventures.catTrail.startedAt);
    const season=World.season(u);season.points=30;assert(World.claimSeason(u,2,false));assert(!World.claimSeason(u,2,false));assert(!World.claimSeason(u,2,true));season.premium=true;assert(World.claimSeason(u,2,true));assert(u.world.wardrobe.includes('seasonRibbon'));
    u=fresh();World.season(u).points=30;const gems=u.getSupermoney();World.activateSeasonPass(u);assert.equal(u.getSupermoney(),gems+10);assert.equal(World.season(u).claims.filter(x=>x[0]==='p').length,3);World.activateSeasonPass(u);assert.equal(u.getSupermoney(),gems+10);
    u=fresh();const currentSeason=World.seasonId(),past='s'+(Number(currentSeason.slice(1))-1);u.world.seasons[past]={points:30,premium:false,claims:[]};World.activateSeasonPass(u,past);assert(u.world.seasons[past].premium);assert.equal(u.world.seasons[past].claims.filter(x=>x[0]==='p').length,3);assert(!World.season(u).premium);
    u=fresh();World.season(u).points=5;denyWrites=true;assert.throws(()=>World.claimSeason(u,0,false),/Quota/);denyWrites=false;assert.equal(World.season(u).claims.length,0);
    Live.apply(null);assert.equal(Live.get('adMinSeconds'),180);Live.apply({adControlPercent:0,adMaxPerSession:2});u=fresh();now+=180000;Clock.synchronize(now);assert(Ads.canShow(10));Ads.record();assert(!Ads.canShow(10));now+=180000;Clock.synchronize(now);assert(Ads.canShow(10));Ads.record();now+=180000;Clock.synchronize(now);assert(!Ads.canShow(10));Live.apply({adControlPercent:100});assert(Ads.isControl());Live.apply({});
    console.log('World/economy: PASS — overflow, regeneration, daily boundaries, rollback, actual spend, task reachability/reroll, permanent wardrobe, checks, 2d/3d lifecycle, relationships and season including delayed paid orders.');
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});
