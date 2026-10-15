import {ApiError,verifySignature,playerIdentity,signedPurchases} from './yandex.mjs';
// Dependency injection keeps request validation testable without secrets or external calls.
export function createHandler(deps){
  return async req=>{
    const origin=req.headers.get('origin'),allowed=!origin||deps.origins.includes(origin);
    const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
    if(allowed&&origin)Object.assign(headers,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS'});
    const respond=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
    if(!allowed)return respond({error:'ORIGIN_NOT_ALLOWED'},403);
    if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
    if(req.method!=='POST')return respond({error:'METHOD_NOT_ALLOWED'},405);
    try{
      const raw=await req.text();if(raw.length>220000)throw new ApiError('REQUEST_TOO_LARGE',413);
      let body;try{body=JSON.parse(raw);}catch(_){throw new ApiError('INVALID_JSON');}
      if(!body||typeof body!=='object'||Array.isArray(body))throw new ApiError('INVALID_REQUEST');
      if(body.action==='yandex_auth'){
        const proof=await verifySignature(body.signature,deps.yandexSecret);
        const identity=playerIdentity(proof,deps.yandexPlayerIdPath);
        return respond(await deps.yandexSession(identity));
      }
      const bearer=req.headers.get('authorization')||'';
      if(!/^Bearer .+$/i.test(bearer))throw new ApiError('AUTH_REQUIRED',401);
      const user=await deps.getUser(bearer.slice(7));if(!user)throw new ApiError('INVALID_SESSION',401);
      if(body.action==='load')return respond(await deps.load(user.id));
      if(body.action==='save'){
        if(!Number.isSafeInteger(body.revision)||body.revision<0||!body.profile||typeof body.profile!=='object'||Array.isArray(body.profile))throw new ApiError('INVALID_PROFILE');
        const result=await deps.save(user.id,body.revision,body.profile);
        return respond(result,result.conflict?409:200);
      }
      if(body.action==='intent'){
        if(!['web','yandex'].includes(body.platform)||typeof body.productId!=='string')throw new ApiError('INVALID_INTENT');
        if(body.platform==='web'&&!deps.webProvider)throw new ApiError('WEB_PAYMENTS_NOT_CONFIGURED',503);
        return respond(await deps.intent(user.id,body.platform,body.productId));
      }
      if(body.action==='yandex_claim'){
        if(!Number.isSafeInteger(body.revision)||body.revision<0)throw new ApiError('INVALID_REVISION');
        const proof=await verifySignature(body.signature,deps.yandexSecret),purchases=signedPurchases(proof),results=[];
        let revision=body.revision;
        for(const p of purchases){const result=await deps.claim(user.id,'yandex',p,revision);if(result.conflict)throw new ApiError('PROFILE_CONFLICT',409);revision=result.revision;results.push(result);}
        const snapshot=await deps.load(user.id);if(snapshot.revision!==revision)throw new ApiError('PROFILE_CONFLICT',409);
        return respond({results,...snapshot});
      }
      if(body.action==='web_checkout'){
        if(!deps.webProvider)throw new ApiError('WEB_PAYMENTS_NOT_CONFIGURED',503);
        const intent=await deps.getIntent(user.id,body.intentId,'web');
        return respond(await deps.webProvider.checkout(intent));
      }
      throw new ApiError('UNKNOWN_ACTION');
    }catch(error){return respond({error:error instanceof ApiError?error.code:'BACKEND_ERROR'},error instanceof ApiError?error.status:500);}
  };
}
