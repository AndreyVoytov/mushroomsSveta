-- Replace OWNER_EMAIL_HERE with the email that may edit the catalog.
create table if not exists public.mechanics_items (
  id text primary key,
  payload jsonb,
  is_deleted boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.mechanics_items enable row level security;
revoke all on public.mechanics_items from public, anon, authenticated;
grant select on public.mechanics_items to anon, authenticated;
grant insert, update on public.mechanics_items to authenticated;

drop policy if exists "Public can read mechanics" on public.mechanics_items;
drop policy if exists "Owner can insert mechanics" on public.mechanics_items;
drop policy if exists "Owner can update mechanics" on public.mechanics_items;

create policy "Public can read mechanics"
  on public.mechanics_items for select to anon, authenticated
  using (true);

create policy "Owner can insert mechanics"
  on public.mechanics_items for insert to authenticated
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = lower('OWNER_EMAIL_HERE'));

create policy "Owner can update mechanics"
  on public.mechanics_items for update to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = lower('OWNER_EMAIL_HERE'))
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = lower('OWNER_EMAIL_HERE'));

create or replace function public.is_mechanics_owner()
returns boolean
language sql
stable
set search_path = ''
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = lower('OWNER_EMAIL_HERE');
$$;

revoke all on function public.is_mechanics_owner() from public;
grant execute on function public.is_mechanics_owner() to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mechanic-images',
  'mechanic-images',
  true,
  8388608,
  array['image/webp', 'image/png', 'image/jpeg', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Owner uploads mechanic images" on storage.objects;
create policy "Owner uploads mechanic images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'mechanic-images'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = lower('OWNER_EMAIL_HERE')
  );
