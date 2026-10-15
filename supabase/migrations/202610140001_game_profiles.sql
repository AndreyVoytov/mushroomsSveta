-- Apply to a separate GAME Supabase project. No tracker tables are referenced.
create table public.game_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 0,
  profile jsonb,
  updated_at timestamptz not null default now()
);
create table public.game_products (
  id text primary key,
  grant_data jsonb not null,
  enabled boolean not null default true
);
insert into public.game_products(id,grant_data) values
 ('r110','{"gems":110}'),('r200','{"gems":200}'),('r1100','{"gems":1100}'),
 ('r2400','{"gems":2400}'),('r5000','{"gems":5000}'),
 ('bunch1','{"gems":300,"boosters":[{"type":"compass","count":3},{"type":"rocket3","count":3},{"type":"glove","count":3}]}'),
 ('bunch2','{"gems":1100,"boosters":[{"type":"beans","count":3},{"type":"rainbowPotion","count":3},{"type":"vision","count":3}]}'),
 ('seasonPass','{"gems":0,"seasonPass":true}');
create table public.game_purchase_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check(platform in ('yandex','web')),
  product_id text not null references public.game_products(id),
  grant_data jsonb not null,
  season_id text not null,
  created_at timestamptz not null default now(),
  paid boolean not null default false
);
create table public.game_purchase_ledger (
  platform text not null,
  token_hash text not null check(length(token_hash)=64),
  user_id uuid not null references auth.users(id) on delete cascade,
  intent_id uuid not null unique references public.game_purchase_intents(id),
  product_id text not null,
  granted_at timestamptz not null default now(),
  primary key(platform,token_hash)
);
alter table public.game_profiles enable row level security;
alter table public.game_products enable row level security;
alter table public.game_purchase_intents enable row level security;
alter table public.game_purchase_ledger enable row level security;
-- All access goes through authenticated Edge handlers; clients have no write grants.
revoke all on public.game_profiles,public.game_products,public.game_purchase_intents,public.game_purchase_ledger from anon,authenticated;

create function public.game_profile_load(p_uid uuid) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.game_profiles;
begin
  insert into public.game_profiles(user_id) values(p_uid) on conflict do nothing;
  select * into r from public.game_profiles where user_id=p_uid;
  return jsonb_build_object('revision',r.revision,'profile',r.profile,'serverTime',floor(extract(epoch from now())*1000),
    'config',jsonb_build_object('version','serverless-1','seasonDays',28));
end $$;

create function public.game_profile_save(p_uid uuid,p_revision bigint,p_profile jsonb) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.game_profiles; incoming jsonb; seasons jsonb; entry record; premium boolean;
begin
  if jsonb_typeof(p_profile)<>'object' or octet_length(p_profile::text)>190000 then raise exception 'INVALID_PROFILE'; end if;
  insert into public.game_profiles(user_id) values(p_uid) on conflict do nothing;
  select * into r from public.game_profiles where user_id=p_uid for update;
  if r.revision<>p_revision then
    return jsonb_build_object('conflict',true,'revision',r.revision,'profile',r.profile);
  end if;
  incoming=p_profile;
  -- The receipt markers are server-owned. Monetary gameplay still uses client
  -- progress in this milestone; anti-cheat for ALL gameplay grants is separate.
  incoming=jsonb_set(incoming,'{processedPurchaseTokens}',coalesce(r.profile->'processedPurchaseTokens','[]'),true);
  if jsonb_typeof(incoming#>'{world,seasons}')='object' then
    seasons=incoming#>'{world,seasons}';
    for entry in select key,value from jsonb_each(seasons) loop
      premium=coalesce((r.profile#>>array['world','seasons',entry.key,'premium'])::boolean,false);
      seasons=jsonb_set(seasons,array[entry.key],entry.value||jsonb_build_object('premium',premium),true);
    end loop;
    -- Preserve paid season records even if a client omits them.
    for entry in select key,value from jsonb_each(coalesce(r.profile#>'{world,seasons}','{}')) loop
      if coalesce((entry.value->>'premium')::boolean,false) and not(seasons?entry.key) then seasons=jsonb_set(seasons,array[entry.key],entry.value,true); end if;
    end loop;
    incoming=jsonb_set(incoming,'{world,seasons}',seasons,true);
  elsif r.profile#>'{world,seasons}' is not null then
    incoming=jsonb_set(incoming,'{world}',coalesce(incoming->'world','{}')||jsonb_build_object('seasons',r.profile#>'{world,seasons}'),true);
  end if;
  update public.game_profiles set profile=incoming,revision=revision+1,updated_at=now() where user_id=p_uid;
  return public.game_profile_load(p_uid);
end $$;

create function public.game_purchase_intent(p_uid uuid,p_platform text,p_product text) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare g jsonb; n uuid; s text;
begin
  if p_platform not in ('yandex','web') then raise exception 'INVALID_PLATFORM'; end if;
  if not exists(select 1 from public.game_profiles where user_id=p_uid and profile is not null) then raise exception 'PROFILE_REQUIRED'; end if;
  select grant_data into g from public.game_products where id=p_product and enabled;
  if g is null then raise exception 'UNKNOWN_PRODUCT'; end if;
  s='s'||floor((extract(epoch from now())+10800)/(28*86400))::bigint::text;
  insert into public.game_purchase_intents(user_id,platform,product_id,grant_data,season_id)
    values(p_uid,p_platform,p_product,g,s) returning id into n;
  return jsonb_build_object('intentId',n,'productId',p_product,'platform',p_platform);
end $$;

create function public.game_purchase_claim(p_uid uuid,p_platform text,p_token_hash text,p_product text,p_intent uuid,p_revision bigint) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.game_profiles; i public.game_purchase_intents; previous public.game_purchase_ledger;
  p jsonb; b jsonb; old_boosters jsonb; new_boosters jsonb; boost_found boolean; boost jsonb; world_data jsonb; season_data jsonb; delta bigint;
begin
  select * into r from public.game_profiles where user_id=p_uid for update;
  if r.profile is null then raise exception 'PROFILE_REQUIRED'; end if;
  if r.revision<>p_revision then return jsonb_build_object('conflict',true,'revision',r.revision); end if;
  select * into previous from public.game_purchase_ledger where platform=p_platform and token_hash=p_token_hash;
  if found then
    if previous.user_id<>p_uid or previous.product_id<>p_product or previous.intent_id<>p_intent then raise exception 'RECEIPT_OWNER_MISMATCH'; end if;
    return jsonb_build_object('granted',false,'revision',r.revision,'productId',p_product,'seasonId',(select season_id from public.game_purchase_intents where id=p_intent),'grantData',(select grant_data from public.game_purchase_intents where id=p_intent));
  end if;
  select * into i from public.game_purchase_intents where id=p_intent for update;
  if not found or i.user_id<>p_uid or i.platform<>p_platform or i.product_id<>p_product or i.paid then raise exception 'INVALID_PURCHASE_INTENT'; end if;
  p=r.profile;
  delta=coalesce((i.grant_data->>'gems')::bigint,0);
  p=jsonb_set(p,'{supermoney}',to_jsonb(coalesce((p->>'supermoney')::bigint,300)+delta),true);
  old_boosters=coalesce(p->'boosters','[]');
  for boost in select value from jsonb_array_elements(coalesce(i.grant_data->'boosters','[]')) loop
    new_boosters='[]';boost_found=false;
    for b in select value from jsonb_array_elements(old_boosters) loop
      if b->>'type'=boost->>'type' then
        b=jsonb_set(b,'{count}',to_jsonb(coalesce((b->>'count')::bigint,0)+(boost->>'count')::bigint));boost_found=true;
      end if;
      new_boosters=new_boosters||jsonb_build_array(b);
    end loop;
    if not boost_found then new_boosters=new_boosters||jsonb_build_array(boost); end if;
    old_boosters=new_boosters;
  end loop;
  p=jsonb_set(p,'{boosters}',old_boosters,true);
  if coalesce((i.grant_data->>'seasonPass')::boolean,false) then
    world_data=coalesce(p->'world','{}');season_data=coalesce(world_data->'seasons','{}');
    season_data=jsonb_set(season_data,array[i.season_id],coalesce(season_data->i.season_id,'{"points":0,"claims":[]}')||'{"premium":true}',true);
    world_data=jsonb_set(world_data,'{seasons}',season_data,true);p=jsonb_set(p,'{world}',world_data,true);
  end if;
  p=jsonb_set(p,'{processedPurchaseTokens}',coalesce(p->'processedPurchaseTokens','[]')||jsonb_build_array(p_token_hash),true);
  -- Receipt + complete bundle + revision are committed in the SAME transaction.
  insert into public.game_purchase_ledger(platform,token_hash,user_id,intent_id,product_id)
    values(p_platform,p_token_hash,p_uid,p_intent,p_product);
  update public.game_purchase_intents set paid=true where id=p_intent;
  update public.game_profiles set profile=p,revision=revision+1,updated_at=now() where user_id=p_uid;
  return jsonb_build_object('granted',true,'revision',r.revision+1,'productId',p_product,'seasonId',i.season_id,'grantData',i.grant_data);
end $$;

revoke all on function public.game_profile_load(uuid),public.game_profile_save(uuid,bigint,jsonb),
  public.game_purchase_intent(uuid,text,text),public.game_purchase_claim(uuid,text,text,text,uuid,bigint) from public,anon,authenticated;
grant execute on function public.game_profile_load(uuid),public.game_profile_save(uuid,bigint,jsonb),
  public.game_purchase_intent(uuid,text,text),public.game_purchase_claim(uuid,text,text,text,uuid,bigint) to service_role;
