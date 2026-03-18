-- ════════════════════════════════════════════════════════
--  ND Habit Tracker — Supabase Database Schema
--  Run this in: supabase.com → your project → SQL Editor
-- ════════════════════════════════════════════════════════

-- TABLE 1: user_habits
-- Stores each user's habit list (as JSON)
create table if not exists public.user_habits (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  data        jsonb not null default '{"habits":[]}',
  updated_at  timestamptz default now(),
  unique (user_id)
);

-- TABLE 2: user_days
-- Stores each user's daily log (checks, spoons, energy, etc.)
create table if not exists public.user_days (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  date        text not null,   -- format: 'YYYY-MM-DD'
  data        jsonb not null default '{}',
  updated_at  timestamptz default now(),
  unique (user_id, date)
);

-- ── ROW LEVEL SECURITY (keeps each user's data private) ──
alter table public.user_habits enable row level security;
alter table public.user_days   enable row level security;

-- user_habits policies
create policy "Users can read own habits"
  on public.user_habits for select
  using (auth.uid() = user_id);

create policy "Users can insert own habits"
  on public.user_habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own habits"
  on public.user_habits for update
  using (auth.uid() = user_id);

create policy "Users can delete own habits"
  on public.user_habits for delete
  using (auth.uid() = user_id);

-- user_days policies
create policy "Users can read own days"
  on public.user_days for select
  using (auth.uid() = user_id);

create policy "Users can insert own days"
  on public.user_days for insert
  with check (auth.uid() = user_id);

create policy "Users can update own days"
  on public.user_days for update
  using (auth.uid() = user_id);

create policy "Users can delete own days"
  on public.user_days for delete
  using (auth.uid() = user_id);

-- ── OPTIONAL: updated_at auto-trigger ──
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger on_user_habits_updated
  before update on public.user_habits
  for each row execute procedure public.handle_updated_at();

create trigger on_user_days_updated
  before update on public.user_days
  for each row execute procedure public.handle_updated_at();

-- ════════════════════════════════════════════════════════
--  DONE! Your database is ready.
--  Now copy your Project URL and anon key from:
--  supabase.com → your project → Settings → API
-- ════════════════════════════════════════════════════════
