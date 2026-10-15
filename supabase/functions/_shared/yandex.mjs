export class ApiError extends Error {
  constructor(code,status=400){super(code);this.code=code;this.status=status;}
}
function bytes(base64){
  if(typeof base64!=='string'||!base64||!/^[A-Za-z0-9+/_=-]+$/.test(base64))throw new ApiError('INVALID_SIGNATURE');
  try{return Uint8Array.from(atob(base64.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}catch(_){throw new ApiError('INVALID_SIGNATURE');}
}
export async function verifySignature(signature,secret,now=Date.now()){
  if(!secret)throw new ApiError('YANDEX_SECRET_NOT_CONFIGURED',503);
  if(typeof signature!=='string'||signature.length>100000)throw new ApiError('INVALID_SIGNATURE');
  const parts=signature.split('.');if(parts.length!==2)throw new ApiError('INVALID_SIGNATURE');
  const mac=bytes(parts[0]),body=bytes(parts[1]);if(mac.length!==32)throw new ApiError('INVALID_SIGNATURE');
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
  if(!await crypto.subtle.verify('HMAC',key,mac,body))throw new ApiError('INVALID_SIGNATURE',401);
  let value;try{value=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(body));}catch(_){throw new ApiError('INVALID_SIGNED_JSON');}
  if(!value||typeof value!=='object'||Array.isArray(value))throw new ApiError('INVALID_SIGNED_JSON');
  if(value.algorithm!=='HMAC-SHA256')throw new ApiError('UNSUPPORTED_SIGNATURE');
  if(!Number.isFinite(value.issuedAt)||value.issuedAt*1000>now+60000||now-value.issuedAt*1000>15*60000)throw new ApiError('EXPIRED_SIGNATURE',401);
  return value;
}
export function playerIdentity(value,path){
  if(!path||!/^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*$/.test(path))throw new ApiError('YANDEX_ID_PATH_NOT_CONFIGURED',503);
  let id=value;for(const key of path.split('.')){if(!id||!Object.prototype.hasOwnProperty.call(id,key))throw new ApiError('INVALID_PLAYER_ID');id=id[key];}
  if(typeof id!=='string'||!id||id.length>200)throw new ApiError('INVALID_PLAYER_ID');return id;
}
export function signedPurchases(value){
  const entries=Array.isArray(value.data)?value.data:[value.data];
  if(entries.length>100)throw new ApiError('TOO_MANY_PURCHASES');
  return entries.map(p=>{
    if(!p||p.status!=='waiting'||p.errorCode||!p.product||typeof p.product.id!=='string'||typeof p.token!=='string'||!p.token||typeof p.developerPayload!=='string'||!p.developerPayload)throw new ApiError('UNBOUND_OR_INVALID_PURCHASE');
    return {token:p.token,productId:p.product.id,intentId:p.developerPayload};
  });
}
