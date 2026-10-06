-- Wolverhampton Calisthenics — workout display, goals, and exercise
-- library setup. Run this in Supabase's SQL Editor.

-- The exercise dropdown in the coach dashboard now reads from here
-- instead of a fixed list in the code, so coaches can add new
-- exercises themselves and have them available for every future
-- programme.
create table exercise_library (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

alter table exercise_library enable row level security;

create policy "Anyone can read the exercise library"
  on exercise_library for select
  using (true);

create policy "Coaches can add exercises"
  on exercise_library for insert
  with check (exists (select 1 from coaches where user_id = auth.uid()));

-- Seeds it with everything already in use, so nothing is lost.
insert into exercise_library (name) values
  ('Dead hang'), ('Scapular pull-ups'), ('Negative pull-ups'),
  ('Band-assisted pull-ups'), ('Strict pull-ups'), ('Chin-ups'),
  ('Australian rows'), ('Ring rows'), ('Archer pull-ups'),
  ('Wall handstand hold'), ('Chest-to-wall handstand'),
  ('Freestanding handstand practice'), ('Press handstand drill'),
  ('Straddle press to handstand'), ('Pike push-ups'),
  ('Wall handstand push-ups'), ('Hollow body hold'),
  ('Arch hold (superman)'), ('Hollow rocks'), ('L-sit hold'),
  ('Tuck L-sit'), ('Dips'), ('Ring dips'), ('Straight bar dips'),
  ('Explosive pull-ups'), ('Muscle-up transition drill'),
  ('Band-assisted muscle-ups'), ('Wrist mobility flow'),
  ('Shoulder dislocates'), ('Deep squat hold'), ('Cossack squats'),
  ('Push-ups'), ('Diamond push-ups'), ('Plank hold'), ('Side plank'),
  ('Parallette support hold'), ('Straddle planche lean'),
  ('Skin the cat'), ('Active hang')
on conflict (name) do nothing;

-- Goals — renamed and reworked from the old "milestones" feature.
-- Both the client and their coach can add goals to the same account-
-- wide list. Ticking one off records when and any notes about it.
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  text text not null,
  source text not null default 'client', -- 'client' or 'coach'
  completed boolean not null default false,
  completed_at timestamptz,
  completion_notes text,
  created_at timestamptz default now()
);

alter table goals enable row level security;

create policy "Users can view their own goals"
  on goals for select
  using (auth.uid() = user_id);

create policy "Users can add their own goals"
  on goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own goals"
  on goals for update
  using (auth.uid() = user_id);

create policy "Coaches can view all goals"
  on goals for select
  using (exists (select 1 from coaches where user_id = auth.uid()));

create policy "Coaches can add goals for anyone"
  on goals for insert
  with check (exists (select 1 from coaches where user_id = auth.uid()));

create policy "Coaches can update any goal"
  on goals for update
  using (exists (select 1 from coaches where user_id = auth.uid()));

-- Session completions — replaces ticking off individual exercises.
-- Each row is one logged instance of completing a session (e.g. "Day
-- 1"), so the same session can be ticked off again every week as the
-- 12 weeks go on, building up a dated history.
create table session_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  submission_id uuid references submissions(id) on delete cascade not null,
  day_label text not null,
  completed_at timestamptz default now(),
  notes text
);

alter table session_completions enable row level security;

create policy "Users can view their own session completions"
  on session_completions for select
  using (auth.uid() = user_id);

create policy "Users can log their own session completions"
  on session_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own session completions"
  on session_completions for delete
  using (auth.uid() = user_id);
