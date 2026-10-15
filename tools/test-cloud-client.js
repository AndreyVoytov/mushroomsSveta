// Browser-side flow with controlled SDK/network responses. Uses actual User,
// LocalStore, CloudProfileService and ShopService; never connects to a backend.
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),cache={},storage=new Map(),log=[];
let current,server={revision:0,profile:null,serverTime:Date.now(),config:{seasonDays:28}},platform=3,denyWrites=false,failSave=false,consumeFails=false;
const receipts=new Map(),copy=x=>JSON.parse(JSON.stringify(x)),config={supabaseUrl:'https://fixture.invalid',publishableKey:'fixture'};
const sdk={auth:{getSession:async()=>({data:{session:null}}),signInAnonymously:async()=>({data:{session:{}}}),setSession:async()=>({data:{session:{}}}),getUser:async()=>({data:{user:{id:'fixture-account'}}})},functions:{invoke:async(name,{body})=>{
 log.push(body.action);
 if(body.action==='yandex_auth')return {data:{session:{access_token:'fixture'}}};
 if(body.action==='load')return {data:copy(server)};
 if(body.action==='save'){
  if(failSave)return {error:{context:{json:async()=>({error:'OFFLINE'})}}};
  if(body.revision!==server.revision)return {error:{context:{json:async()=>({...copy(server),conflict:true})}}};
  server={...server,revision:server.revision+1,profile:copy(body.profile)};return {data:copy(server)};
 }
 if(body.action==='yandex_claim'){
  if(body.revision!==server.revision)return {error:{context:{json:async()=>({error:'PROFILE_CONFLICT'})}}};
  if(body.signature==='empty')return {data:{...copy(server),results:[]}};
  const known=receipts.has(body.signature),result={productId:'r110',token:'token-'+body.signature,tokenHash:'hash-'+body.signature,grantData:{gems:110},granted:!known};
  if(!known){receipts.set(body.signature,true);server.profile.supermoney+=110;server.profile.processedPurchaseTokens.push(result.tokenHash);server.revision++;}
  result.revision=server.revision;return {data:{...copy(server),results:[result]}};
 }
 return {data:{intentId:'fixture-intent'}};
}}};
const browser={MUSHROOMS_PLATFORM_CONFIG:config,supabase:{createClient:()=>sdk},location:{hostname:'localhost',search:'',href:'http://localhost/'}};
const mocks={Settings:{PLAIN_MODE:true,BUYS:[{id:'r110',gems:110,price:19}],ANALYTICS_BUILD_VERSION:'test'},
 Game:{getInstance:()=>({state:{getCurrentState:()=>({})}})},Utils:{UUID:()=>Math.random().toString(),delete:(a,x)=>a.splice(a.indexOf(x),1)},
 Telemetry:{track:()=>{},economy:()=>{}},AnalyticUtils:{haveLocalStorage:()=>true,getCustomization:()=>platform,logPurchase:()=>{}},
 UserService:{getUser:()=>current,setUser:u=>current=u},ForestUtils:{markBoosterSeen:()=>{}},LocalizationService:{get:k=>k},
 YandexGamesHelper:{queueProfile:()=>{},getPlayerSignature:async()=> 'signed-player-fixture',canPurchase:()=>true,consumePurchase:async token=>{log.push('consume');if(consumeFails)throw Error('consume offline');}},
 ForestDao:{getAllForests:()=>[]},EverydayRubyPanel:{RUBIES_COUNT:50},SoundUtils:{successfulEverydayGems:()=>{}}};
['ForestScreen','ConfirmPanel','BuyConfirmPanel','CircleProgressPanel'].forEach(k=>mocks[k]=class{});
function load(file){const full=path.resolve(root,file);if(cache[full])return cache[full];const exports=cache[full]={};
 if(full.endsWith('.json'))return JSON.parse(fs.readFileSync(full,'utf8'));
 const code=ts.transpileModule(fs.readFileSync(full,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2015,module:ts.ModuleKind.CommonJS}}).outputText;
 vm.runInNewContext(code,{exports,Date,Math,Promise,console,performance,setTimeout,clearTimeout,isFinite,window:browser,
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(denyWrites)throw Error('QuotaExceeded');storage.set(k,v);}},
 require:name=>{const base=path.basename(name);return mocks[base]?{default:mocks[base]}:load(path.resolve(path.dirname(full),name+(path.extname(name)?'':'.ts')));}},{filename:full});return exports;}
const User=load('src/core/model/user/User.ts').default,Cloud=load('src/core/service/CloudProfileService.ts').default,Shop=load('src/core/service/ShopService.ts').default,Server=load('src/core/service/store/ServerStoreComponent.ts').default;
async function main(){
 current=new User();await Cloud.initialize(false);Cloud.queueProfile(current);await Cloud.flush();
 const emptyRevision=server.revision;await Shop.applySignedYandexPurchases({signature:'empty'},[]);assert.equal(server.revision,emptyRevision);assert(!Cloud.claiming);
 const a={x:1,z:{b:2,a:3},updatedAt:1,lastLoginAt:1},b={z:{a:3,b:2},x:1,updatedAt:2,lastLoginAt:2};assert.equal(Cloud.fingerprint(a),Cloud.fingerprint(b));
 const applied=[];await Promise.all([Shop.applySignedYandexPurchases({signature:'one'},applied),Shop.applySignedYandexPurchases({signature:'one'},applied)]);
 assert.equal(current.getSupermoney(),410);assert.equal(server.profile.supermoney,410);assert.equal(applied.length,1);assert.equal(current.processedPurchaseTokens.length,1);
 assert(log.indexOf('consume')>log.indexOf('yandex_claim'));assert.equal(log[log.indexOf('consume')-1],'save');
 consumeFails=true;await assert.rejects(()=>Shop.applySignedYandexPurchases({signature:'two'},[]),/consume offline/);const paid=current.getSupermoney();consumeFails=false;await Shop.applySignedYandexPurchases({signature:'two'},[]);assert.equal(current.getSupermoney(),paid);
 await assert.rejects(()=>Shop.applySignedYandexPurchases({productID:'r110',purchaseToken:'unsigned'},[]),/SIGNED_RECEIPT_REQUIRED/);
 denyWrites=true;const consumed=log.filter(x=>x==='consume').length,before=current.getSupermoney();await assert.rejects(()=>Shop.applySignedYandexPurchases({signature:'quota'},[]),/Quota/);denyWrites=false;
 assert.equal(current.getSupermoney(),before);assert.equal(Cloud.status,'conflict');assert.equal(log.filter(x=>x==='consume').length,consumed);assert.equal(server.profile.supermoney,before+110);
 // Recover the durable grant; replay does not issue it again.
 current=new User(copy(server.profile));Cloud.accept(copy(server));await Shop.applySignedYandexPurchases({signature:'quota'},[]);assert.equal(current.getSupermoney(),before+110);
 failSave=true;await assert.rejects(()=>Shop.applySignedYandexPurchases({signature:'save-failure'},[]),/OFFLINE/);failSave=false;assert.equal(Cloud.status,'conflict');assert(storage.has('mushrooms.cloud.local-backup'));
 current=new User(copy(server.profile));Cloud.accept(copy(server));
 // Another device changes the revision between this device's last save and receipt.
 server.revision++;server.profile.supermoney+=1;await assert.rejects(()=>Shop.applySignedYandexPurchases({signature:'stale'},[]),/PROFILE_CONFLICT/);assert.equal(Cloud.status,'conflict');assert.equal(current.getSupermoney(),server.profile.supermoney-1);
 // Startup/offline reconciliation runs the actual store, with a fresh page's auth state.
 const baseline=()=>{server.profile=copy(current);Cloud.accept(copy(server));Cloud.initialization=null;Cloud.status='offline';};
 current=new User(copy(server.profile));baseline();server.profile.supermoney+=10;server.revision++;await Server.reconnectCloud();assert.equal(current.getSupermoney(),server.profile.supermoney);assert.equal(Cloud.status,'ready');
 baseline();current.setSupermoney(current.getSupermoney()+3,'fixture_offline');await Server.reconnectCloud();assert.equal(server.profile.supermoney,current.getSupermoney());assert.equal(Cloud.status,'ready');
 baseline();current.setSupermoney(current.getSupermoney()+4,'fixture_offline');const localDirty=current.getSupermoney();server.profile.supermoney+=7;server.revision++;await Server.reconnectCloud();assert.equal(Cloud.status,'conflict');assert.equal(current.getSupermoney(),localDirty);assert.notEqual(current.getSupermoney(),server.profile.supermoney);
 current=new User(copy(server.profile));baseline();server.profile.supermoney+=5;server.revision++;const prior=current.getSupermoney();denyWrites=true;await Server.reconnectCloud();denyWrites=false;assert.equal(Cloud.status,'conflict');assert.equal(current.getSupermoney(),prior);assert.equal(server.profile.supermoney,prior+5);
 platform=0;assert(!Shop.canPurchase({id:'r110'}));browser.location.search='?testpayments=1';assert(Shop.canPurchase({id:'r110'}));browser.location.hostname='game.example';assert(!Shop.canPurchase({id:'r110'}));
 Cloud.accept(copy(server));clearTimeout(Cloud.timer);
 console.log('Cloud client: PASS — serialized signed grants, cloud-before-consume, replay, local/server failure recovery, stale-device conflict, stable fingerprints, no production fake payments.');
}
main().catch(error=>{clearTimeout(Cloud.timer);console.error(error.stack);process.exitCode=1;});
