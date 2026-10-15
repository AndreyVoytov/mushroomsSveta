// Real PostgreSQL/PLpgSQL in memory. No network, credentials or player files.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHmac,createHash} from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';
import {PGlite} from '@electric-sql/pglite';
import {createHandler} from '../supabase/functions/_shared/api.mjs';
import {ApiError,verifySignature,playerIdentity,signedPurchases} from '../supabase/functions/_shared/yandex.mjs';

const db=new PGlite(),uid='00000000-0000-4000-8000-000000000001',other='00000000-0000-4000-8000-000000000002';
const secret='synthetic-local-fixture-only',origin='https://game.example.test';
const hash=token=>createHash('sha256').update(token).digest('hex');
const sign=(data,extra={})=>{const body=Buffer.from(JSON.stringify({algorithm:'HMAC-SHA256',issuedAt:Math.floor(Date.now()/1000),data,...extra}));return createHmac('sha256',secret).update(body).digest('base64')+'.'+body.toString('base64');};
const receipt=(token,productId,intentId)=>({status:'waiting',errorCode:'',token,product:{id:productId},developerPayload:intentId});
async function rpc(name,args){const params=args.map((_,i)=>'$'+(i+1)).join(',');return (await db.query(`select public.${name}(${params}) as result`,args)).rows[0].result;}
const load=()=>rpc('game_profile_load',[uid]);
const save=(rev,p)=>rpc('game_profile_save',[uid,rev,JSON.stringify(p)]);
const intent=(sku,user=uid)=>rpc('game_purchase_intent',[user,'yandex',sku]);
const claim=(token,sku,id,rev,user=uid)=>rpc('game_purchase_claim',[user,'yandex',hash(token),sku,id,rev]);
const handler=createHandler({origins:[origin],yandexSecret:secret,yandexPlayerIdPath:'player.id',webProvider:null,
 getUser:async token=>token==='user'?{id:uid}:null,yandexSession:async id=>({session:{fixtureIdentity:id}}),
 load:user=>rpc('game_profile_load',[user]),save:(user,rev,p)=>rpc('game_profile_save',[user,rev,JSON.stringify(p)]),
 intent:(user,platform,sku)=>rpc('game_purchase_intent',[user,platform,sku]),
 claim:async(user,platform,p,rev)=>({...await claim(p.token,p.productId,p.intentId,rev,user),token:p.token,tokenHash:hash(p.token)})});
async function api(body,headers={}){const response=await handler(new Request(origin+'/api',{method:'POST',headers:{origin,'authorization':'Bearer user',...headers},body:JSON.stringify(body)}));return {status:response.status,body:await response.json()};}
try{
 await db.exec("create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);");
 await db.query('insert into auth.users values($1),($2)',[uid,other]);
 await db.exec(await readFile(new URL('../supabase/migrations/202610140001_game_profiles.sql',import.meta.url),'utf8'));
 assert.equal((await load()).profile,null);
 const profile={supermoney:300,boosters:[{type:'compass',count:2}],processedPurchaseTokens:['fake'],world:{seasons:{fake:{points:30,premium:true,claims:[]}}}};
 let snap=await save(0,profile);assert.equal(snap.revision,1);assert.deepEqual(snap.profile.processedPurchaseTokens,[]);assert.equal(snap.profile.world.seasons.fake.premium,false);
 let stale=await save(0,{supermoney:999});assert(stale.conflict);assert.equal((await load()).profile.supermoney,300);
 const buy=await intent('bunch1');await assert.rejects(()=>intent('unknown'),/UNKNOWN_PRODUCT/);
 await assert.rejects(()=>claim('wrong-owner','bunch1',buy.intentId,0,other),/PROFILE_REQUIRED/);
 let result=await claim('bundle','bunch1',buy.intentId,1);assert(result.granted);snap=await load();assert.equal(snap.profile.supermoney,600);
 assert.deepEqual(snap.profile.boosters,[{type:'compass',count:5},{type:'rocket3',count:3},{type:'glove',count:3}]);
 assert.equal((await claim('bundle','bunch1',buy.intentId,snap.revision)).granted,false);assert.equal((await load()).profile.supermoney,600);
 await rpc('game_profile_save',[other,0,JSON.stringify({supermoney:300})]);
 await assert.rejects(()=>claim('bundle','bunch1',buy.intentId,1,other),/RECEIPT_OWNER_MISMATCH/);
 assert((await claim('next','bunch1',buy.intentId,1)).conflict);
 assert((await save(1,profile)).conflict); // A device cannot overwrite the paid revision.
 const buy2=await intent('bunch2');await claim('bundle2','bunch2',buy2.intentId,snap.revision);snap=await load();assert.equal(snap.profile.supermoney,1700);assert(snap.profile.boosters.some(b=>b.type==='rainbowPotion'&&b.count===3));
 const pass=await intent('seasonPass');result=await claim('pass','seasonPass',pass.intentId,snap.revision);snap=await load();assert(snap.profile.world.seasons[result.seasonId].premium);
 snap=await save(snap.revision,{...snap.profile,processedPurchaseTokens:[],world:{seasons:{[result.seasonId]:{points:30,premium:false,claims:[]}}}});
 assert.equal(snap.profile.processedPurchaseTokens.length,3);assert(snap.profile.world.seasons[result.seasonId].premium);
 snap=await save(snap.revision,{...snap.profile,world:{seasons:{}}});assert(snap.profile.world.seasons[result.seasonId].premium);
 // Force a late failure after profile calculation. All ledger/intent/profile writes roll back.
 const broken=await intent('r110'),before=await load();
 await db.exec("alter table public.game_profiles add constraint reject_fixture_balance check ((profile->>'supermoney')::bigint<>1810)");
 await assert.rejects(()=>claim('rollback','r110',broken.intentId,before.revision),/reject_fixture_balance/);
 assert.equal((await load()).revision,before.revision);assert.equal((await load()).profile.supermoney,1700);
 assert.equal((await db.query('select paid from game_purchase_intents where id=$1',[broken.intentId])).rows[0].paid,false);
 assert.equal((await db.query('select count(*)::int as n from game_purchase_ledger where token_hash=$1',[hash('rollback')])).rows[0].n,0);
 await db.exec('alter table public.game_profiles drop constraint reject_fixture_balance');
 // CAS contenders are serialized by PGlite; this tests stale revisions, not multi-connection locks.
 const rev=(await load()).revision,contenders=await Promise.all([save(rev,{...(await load()).profile,fixture:'a'}),save(rev,{...(await load()).profile,fixture:'b'})]);
 assert.equal(contenders.filter(r=>r.conflict).length,1);
 await db.exec('set role authenticated');
 await assert.rejects(()=>db.query('select * from game_profiles'),/permission denied/);
 await assert.rejects(()=>load(),/permission denied/);await db.exec('reset role');
 assert.equal((await api({action:'load'},{authorization:''})).status,401);
 assert.equal((await api({action:'load'},{authorization:'Bearer bad'})).status,401);
 assert.equal((await api({action:'load'},{origin:'https://evil.test'})).status,403);
 assert.equal((await api({action:'web_checkout',intentId:buy.intentId})).status,503);
 assert.equal((await api({action:'intent',platform:'web',productId:'r110'})).status,503);
 const valid=sign([], {player:{id:'test-player'}});assert.equal(playerIdentity(await verifySignature(valid,secret),'player.id'),'test-player');
 assert.equal((await api({action:'yandex_auth',signature:valid},{authorization:''})).body.session.fixtureIdentity,'test-player');
 await assert.rejects(()=>verifySignature('X'+valid.slice(1),secret),/INVALID_SIGNATURE/);
 await assert.rejects(()=>verifySignature(sign([],{issuedAt:1}),secret),/EXPIRED_SIGNATURE/);
 await assert.rejects(()=>verifySignature(sign([],{algorithm:'none'}),secret),/UNSUPPORTED_SIGNATURE/);
 assert.throws(()=>playerIdentity({player:{id:'x'}},''),/YANDEX_ID_PATH_NOT_CONFIGURED/);
 assert.throws(()=>signedPurchases({data:[receipt('unbound','r110','')]}),/UNBOUND_OR_INVALID_PURCHASE/);
 snap=await load();let response=await api({action:'yandex_claim',revision:snap.revision,signature:sign([])});assert.equal(response.status,200);assert.equal(response.body.results.length,0);
 const signedIntent=await intent('r110'),signature=sign(receipt('signed','r110',signedIntent.intentId));
 response=await api({action:'yandex_claim',revision:snap.revision,signature});assert.equal(response.status,200);assert(response.body.results[0].granted);assert.equal(response.body.profile.supermoney,1810);
 response=await api({action:'yandex_claim',revision:response.body.revision,signature});assert.equal(response.status,200);assert.equal(response.body.results[0].granted,false);assert.equal(response.body.profile.supermoney,1810);
 response=await api({action:'save',revision:0,profile});assert.equal(response.status,409);
 // Configuration changes cannot alter a previously created order's grant.
 const frozen=await intent('r110');await db.exec("update game_products set grant_data='{"+'"gems":999'+"}' where id='r110'");
 const frozenGrant=await claim('frozen','r110',frozen.intentId,(await load()).revision);assert.equal(frozenGrant.grantData.gems,110);
 await db.exec("update game_products set grant_data='{"+'"gems":110'+"}' where id='r110'");
 // The server catalog must match the actual game catalog, including enum values.
 const transpile=async file=>ts.transpileModule(await readFile(new URL('../'+file,import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2015,module:ts.ModuleKind.CommonJS}}).outputText;
 const enumModule={exports:{}};vm.runInNewContext(await transpile('src/core/model/enum/BoosterType.ts'),{exports:enumModule.exports});
 const settingsModule={exports:{}};vm.runInNewContext(await transpile('src/core/service/Settings.ts'),{exports:settingsModule.exports,require:name=>name.endsWith('BoosterType')?enumModule.exports:{default:{}}});
 const catalog=(await db.query('select id,grant_data from game_products order by id')).rows,buys=settingsModule.exports.default.BUYS;
 assert.deepEqual(catalog.map(x=>x.id),Array.from(buys,b=>b.id).sort());
 let productNumber=10;
 for(const product of catalog){
  const local=buys.find(b=>b.id===product.id);assert.equal(product.grant_data.gems,local.gems);assert.equal(!!product.grant_data.seasonPass,!!local.seasonPass);assert.deepEqual(product.grant_data.boosters||[],JSON.parse(JSON.stringify(local.boosters||[])));
  const customer='00000000-0000-4000-8000-'+String(productNumber++).padStart(12,'0');await db.query('insert into auth.users values($1)',[customer]);
  await rpc('game_profile_save',[customer,0,JSON.stringify({supermoney:10,boosters:[],world:{seasons:{}}})]);
  const order=await intent(product.id,customer),grant=await claim('all-'+product.id,product.id,order.intentId,1,customer),saved=await rpc('game_profile_load',[customer]);
  assert.equal(saved.profile.supermoney,10+local.gems);assert.deepEqual(saved.profile.boosters,JSON.parse(JSON.stringify(local.boosters||[])));if(local.seasonPass)assert(saved.profile.world.seasons[grant.seasonId].premium);
 }
 console.log('Serverless: PASS — real SQL migration, CAS, ownership, complete bundle, paid season, replay, rollback, RLS, auth/CORS, signed receipts, immutable orders; web checkout disabled.');
}finally{await db.close();}
