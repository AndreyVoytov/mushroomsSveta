import {createClient} from 'npm:@supabase/supabase-js@2.117.3';
import {createHandler} from '../_shared/api.mjs';
import {ApiError} from '../_shared/yandex.mjs';

const url=Deno.env.get('SUPABASE_URL')!,secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
async function rpc(name:string,args:Record<string,unknown>){const {data,error}=await admin.rpc(name,args);if(error)throw new ApiError('DATABASE_OPERATION_FAILED',500);return data;}
const handler=createHandler({
  origins:(Deno.env.get('GAME_ALLOWED_ORIGINS')||'').split(',').map(x=>x.trim()).filter(Boolean),
  yandexSecret:Deno.env.get('YANDEX_PURCHASE_SECRET'),
  yandexPlayerIdPath:Deno.env.get('YANDEX_PLAYER_ID_PATH'),
  webProvider:null, // Install the chosen provider here; never trust a browser's paid=true.
  getUser:async(token:string)=>{const {data,error}=await admin.auth.getUser(token);return error?null:data.user;},
  yandexSession:async(identity:string)=>{
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(identity));
    const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
    // This synthetic address is internal; no email is sent. generateLink creates
    // the account if needed; verifyOtp exchanges its token for a real Auth session.
    const {data,error}=await admin.auth.admin.generateLink({type:'magiclink',email:'yandex.'+hash+'@players.invalid'});
    if(error||!data.properties?.hashed_token)throw new ApiError('YANDEX_LOGIN_FAILED',503);
    const auth=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
    const verified=await auth.auth.verifyOtp({token_hash:data.properties.hashed_token,type:'magiclink'});
    if(verified.error||!verified.data.session)throw new ApiError('YANDEX_LOGIN_FAILED',503);
    return {session:verified.data.session};
  },
  load:(uid:string)=>rpc('game_profile_load',{p_uid:uid}),
  save:(uid:string,revision:number,profile:unknown)=>rpc('game_profile_save',{p_uid:uid,p_revision:revision,p_profile:profile}),
  intent:(uid:string,platform:string,productId:string)=>rpc('game_purchase_intent',{p_uid:uid,p_platform:platform,p_product:productId}),
  getIntent:async()=>{throw new ApiError('WEB_PAYMENTS_NOT_CONFIGURED',503);},
  claim:async(uid:string,platform:string,p:{token:string;productId:string;intentId:string},revision:number)=>{
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(p.token));
    const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
    return {...await rpc('game_purchase_claim',{p_uid:uid,p_platform:platform,p_token_hash:hash,p_product:p.productId,p_intent:p.intentId,p_revision:revision}),token:p.token,tokenHash:hash};
  }
});
Deno.serve(handler);
