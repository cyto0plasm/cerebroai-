-- Run in Supabase SQL Editor after creating a project.
-- Enables Row Level Security so users only see their own scans.

create table if not exists public.scans (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists scans_user_id_idx on public.scans (user_id);
create index if not exists scans_created_at_idx on public.scans (created_at desc);

alter table public.scans enable row level security;

create policy "Users read own scans"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "Users insert own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

create policy "Users update own scans"
  on public.scans for update
  using (auth.uid() = user_id);

create policy "Users delete own scans"
  on public.scans for delete
  using (auth.uid() = user_id);
