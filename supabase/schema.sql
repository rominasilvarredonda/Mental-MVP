create extension if not exists pgcrypto;

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

create table if not exists public.prelaunch_waitlist (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  gender text,
  gender_other text,
  age integer check (age is null or age >= 12),
  sexual_orientation text,
  sexual_orientation_other text,
  religion text,
  religion_other text,
  therapy_history text,
  support_reason text,
  support_reason_other text,
  occupation text,
  stress_level text,
  mood text,
  social_environment text,
  accompaniment_type text,
  primary_goal text,
  primary_goal_other text,
  therapist_expectations text[] not null default '{}'::text[],
  therapist_expectations_other text,
  preferred_schedule text,
  professional_preference text,
  interests text[] not null default '{}'::text[],
  referral_source text,
  influencer_name text,
  referral_source_other text,
  plan_interest text,
  source text not null default 'pre-landing',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.prelaunch_waitlist add column if not exists gender text;
alter table public.prelaunch_waitlist add column if not exists gender_other text;
alter table public.prelaunch_waitlist add column if not exists age integer;
alter table public.prelaunch_waitlist add column if not exists sexual_orientation text;
alter table public.prelaunch_waitlist add column if not exists sexual_orientation_other text;
alter table public.prelaunch_waitlist add column if not exists religion text;
alter table public.prelaunch_waitlist add column if not exists religion_other text;
alter table public.prelaunch_waitlist add column if not exists therapy_history text;
alter table public.prelaunch_waitlist add column if not exists support_reason text;
alter table public.prelaunch_waitlist add column if not exists support_reason_other text;
alter table public.prelaunch_waitlist add column if not exists occupation text;
alter table public.prelaunch_waitlist add column if not exists stress_level text;
alter table public.prelaunch_waitlist add column if not exists mood text;
alter table public.prelaunch_waitlist add column if not exists social_environment text;
alter table public.prelaunch_waitlist add column if not exists accompaniment_type text;
alter table public.prelaunch_waitlist add column if not exists primary_goal text;
alter table public.prelaunch_waitlist add column if not exists primary_goal_other text;
alter table public.prelaunch_waitlist add column if not exists therapist_expectations text[] not null default '{}'::text[];
alter table public.prelaunch_waitlist add column if not exists therapist_expectations_other text;
alter table public.prelaunch_waitlist add column if not exists preferred_schedule text;
alter table public.prelaunch_waitlist add column if not exists professional_preference text;
alter table public.prelaunch_waitlist add column if not exists interests text[] not null default '{}'::text[];
alter table public.prelaunch_waitlist add column if not exists referral_source text;
alter table public.prelaunch_waitlist add column if not exists influencer_name text;
alter table public.prelaunch_waitlist add column if not exists referral_source_other text;
alter table public.prelaunch_waitlist add column if not exists plan_interest text;
alter table public.prelaunch_waitlist add column if not exists source text not null default 'pre-landing';
alter table public.prelaunch_waitlist add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.prelaunch_waitlist add column if not exists updated_at timestamptz not null default now();

alter table public.prelaunch_waitlist drop constraint if exists prelaunch_waitlist_age_min_check;
alter table public.prelaunch_waitlist add constraint prelaunch_waitlist_age_min_check check (age is null or age >= 12) not valid;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'prelaunch_waitlist' and column_name = 'interested_plan'
  ) then
    execute 'update public.prelaunch_waitlist set plan_interest = interested_plan where plan_interest is null and interested_plan is not null';
  end if;
end $$;

create index if not exists prelaunch_waitlist_email_idx on public.prelaunch_waitlist (lower(email));
create index if not exists prelaunch_waitlist_created_at_idx on public.prelaunch_waitlist (created_at desc);
create index if not exists prelaunch_waitlist_plan_interest_idx on public.prelaunch_waitlist (plan_interest);

create table if not exists public.professional_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  birth_date date not null,
  email text not null,
  phone text not null,
  linkedin text,
  professional_degree text,
  professional_degree_other text,
  specialties text[] not null default '{}'::text[],
  specialty_other text,
  provides_online_sessions boolean,
  weekly_availability text,
  employment_status text,
  professional_experience text,
  motivation text,
  source text not null default 'pre-landing',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.professional_applications add column if not exists professional_degree text;
alter table public.professional_applications add column if not exists professional_degree_other text;
alter table public.professional_applications add column if not exists specialties text[] not null default '{}'::text[];
alter table public.professional_applications add column if not exists specialty_other text;
alter table public.professional_applications add column if not exists provides_online_sessions boolean;
alter table public.professional_applications add column if not exists weekly_availability text;
alter table public.professional_applications add column if not exists employment_status text;
alter table public.professional_applications add column if not exists professional_experience text;
alter table public.professional_applications add column if not exists motivation text;
alter table public.professional_applications add column if not exists source text not null default 'pre-landing';
alter table public.professional_applications add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.professional_applications add column if not exists updated_at timestamptz not null default now();

create index if not exists professional_applications_email_idx on public.professional_applications (lower(email));
create index if not exists professional_applications_created_at_idx on public.professional_applications (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_prelaunch_waitlist_updated_at on public.prelaunch_waitlist;
create trigger set_prelaunch_waitlist_updated_at
  before update on public.prelaunch_waitlist
  for each row execute function public.set_updated_at();

drop trigger if exists set_professional_applications_updated_at on public.professional_applications;
create trigger set_professional_applications_updated_at
  before update on public.professional_applications
  for each row execute function public.set_updated_at();

alter table public.prelaunch_waitlist enable row level security;
alter table public.professional_applications enable row level security;

drop policy if exists "public can insert prelaunch waitlist" on public.prelaunch_waitlist;
create policy "public can insert prelaunch waitlist" on public.prelaunch_waitlist
  for insert
  to anon, authenticated
  with check (source = 'pre-landing');

drop policy if exists "public can insert professional applications" on public.professional_applications;
create policy "public can insert professional applications" on public.professional_applications
  for insert
  to anon, authenticated
  with check (source = 'pre-landing');
