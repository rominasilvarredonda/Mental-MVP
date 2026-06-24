create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  role text not null default 'user' check (role in ('user','admin','therapist'))
);

create table if not exists public.onboarding_answers (id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade, answers jsonb not null default '[]'::jsonb, created_at timestamptz not null default now());
create table if not exists public.subscriptions (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, plan_name text not null, trial_active boolean not null default true, trial_start_date timestamptz, trial_end_date timestamptz, status text not null default 'trial', created_at timestamptz not null default now());
create table if not exists public.mood_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, mood text not null, note text, date date not null default current_date, created_at timestamptz not null default now());
create table if not exists public.daily_readings (id text primary key, title text not null, category text not null, estimated_time text not null, content text not null);
create table if not exists public.reading_completions (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, reading_id text not null references public.daily_readings(id), completed_date date not null default current_date, completed_at timestamptz not null default now(), unique(user_id, reading_id, completed_date));
create table if not exists public.seminar_reservations (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, seminar_id text not null, reserved_at timestamptz not null default now(), unique(user_id, seminar_id));
create table if not exists public.ai_messages (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, role text not null check (role in ('user','assistant','system')), content text not null, created_at timestamptz not null default now());

alter table public.profiles enable row level security;
alter table public.onboarding_answers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.mood_logs enable row level security;
alter table public.reading_completions enable row level security;
alter table public.seminar_reservations enable row level security;
alter table public.ai_messages enable row level security;

create policy "users manage own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "users manage own onboarding" on public.onboarding_answers for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own subscriptions" on public.subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own moods" on public.mood_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own reading completions" on public.reading_completions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own reservations" on public.seminar_reservations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own AI messages" on public.ai_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
