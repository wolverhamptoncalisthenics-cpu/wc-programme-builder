-- Wolverhampton Calisthenics — database setup
-- Paste this whole file into Supabase's SQL Editor and click Run.

-- Extends Supabase's built-in auth.users with a simple profile row.
-- Supabase handles passwords, sessions, etc. itself — this table just
-- gives us a place to hang extra info if needed later.
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

-- Automatically creates a profile row whenever someone signs up.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Ready-made programmes for the free/common goals. You and Tim write
-- these once each, and everyone with that goal gets the same one
-- instantly. Edit the content any time by updating these rows.
create table template_programmes (
  id uuid primary key default gen_random_uuid(),
  goal_id text unique not null,
  goal_label text not null,
  summary text,
  focus text,
  quick_plan jsonb,
  progression jsonb,
  updated_at timestamptz default now()
);

alter table template_programmes enable row level security;

create policy "Anyone can read templates"
  on template_programmes for select
  using (true);

-- One row per person's questionnaire submission. Free goals get
-- auto-assigned a template immediately. Paid/advanced goals sit as
-- "pending_coach" until you or Tim build their programme by hand
-- (that part comes in the next stage, the coach dashboard).
create table submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  goal_id text not null,
  goal_label text not null,
  level text,
  days text,
  equipment text[],
  limitations text,
  status text not null default 'pending', -- 'assigned' | 'pending_coach' | 'ready'
  assigned_template_id uuid references template_programmes(id),
  manual_programme jsonb,
  created_at timestamptz default now()
);

alter table submissions enable row level security;

create policy "Users can view their own submissions"
  on submissions for select
  using (auth.uid() = user_id);

create policy "Users can create their own submissions"
  on submissions for insert
  with check (auth.uid() = user_id);

-- Starter templates so the free goals have *something* to show while
-- you write your real versions. Replace the quick_plan/progression
-- content with your own programmes whenever you're ready — just
-- update these rows (or ask me to help wire up an easier editor for
-- this once the coach dashboard is built).
insert into template_programmes (goal_id, goal_label, summary, focus, quick_plan, progression) values
(
  'general-strength',
  'General strength & mobility',
  'A balanced foundation covering pushing, pulling, core, and mobility — a solid base whatever you build toward next.',
  'Full-body foundations',
  '{"days": [
    {"day": "Day 1", "focus": "Push + core", "exercises": [{"name": "Push-ups", "prescription": "3x10"}, {"name": "Hollow body hold", "prescription": "3x20s"}]},
    {"day": "Day 2", "focus": "Pull + mobility", "exercises": [{"name": "Australian rows", "prescription": "3x10"}, {"name": "Wrist mobility flow", "prescription": "1x5 min"}]},
    {"day": "Day 3", "focus": "Full body", "exercises": [{"name": "Deep squat hold", "prescription": "3x30s"}, {"name": "Plank hold", "prescription": "3x30s"}]}
  ]}',
  '{"phases": [
    {"phase": "Weeks 1-4: Foundation", "focus": "Building consistency", "goals": ["Train 3x per week without missing sessions", "Comfortable form on all basic movements"], "keyExercises": [{"name": "Push-ups", "prescription": "3x10"}, {"name": "Australian rows", "prescription": "3x10"}]}
  ]}'
),
(
  'flexibility',
  'Flexibility & movement quality',
  'Focused mobility work to improve range of motion and movement quality across the whole body.',
  'Mobility & range',
  '{"days": [
    {"day": "Day 1", "focus": "Shoulders & wrists", "exercises": [{"name": "Shoulder dislocates", "prescription": "3x10"}, {"name": "Wrist mobility flow", "prescription": "1x5 min"}]},
    {"day": "Day 2", "focus": "Hips & legs", "exercises": [{"name": "Cossack squats", "prescription": "3x8 each side"}, {"name": "Deep squat hold", "prescription": "3x30s"}]}
  ]}',
  '{"phases": [
    {"phase": "Weeks 1-4: Range building", "focus": "Consistent daily mobility", "goals": ["Noticeable ease in daily movement"], "keyExercises": [{"name": "Deep squat hold", "prescription": "3x30s"}]}
  ]}'
),
(
  'handstand-basics',
  'Handstand basics',
  'The entry point into handstand training — building the wrist and shoulder foundation before chasing freestanding balance.',
  'Handstand foundations',
  '{"days": [
    {"day": "Day 1", "focus": "Wrist prep + wall work", "exercises": [{"name": "Wrist mobility flow", "prescription": "1x5 min"}, {"name": "Wall handstand hold", "prescription": "5x20s"}]},
    {"day": "Day 2", "focus": "Core + shoulders", "exercises": [{"name": "Hollow body hold", "prescription": "3x20s"}, {"name": "Pike push-ups", "prescription": "3x8"}]}
  ]}',
  '{"phases": [
    {"phase": "Weeks 1-4: Comfort inverted", "focus": "Building wall confidence", "goals": ["Hold a wall handstand for 30+ seconds"], "keyExercises": [{"name": "Wall handstand hold", "prescription": "5x20s"}]}
  ]}'
);
