-- Wolverhampton Calisthenics — Stripe payments setup
-- Run this in Supabase's SQL Editor (in addition to your earlier
-- setup scripts, not instead of them).

-- Records confirmed, paid unlocks against a person's actual account,
-- rather than the old approach of remembering a code on one device.
-- Only ever written to by the server-side confirm-checkout function
-- (using the service role key, which bypasses these RLS rules) —
-- regular users can only ever read their own rows, never write one
-- directly, so there's no way to fake an unlock from the browser.
create table unlocked_goals (
  user_id uuid references auth.users on delete cascade not null,
  goal_id text not null,
  stripe_session_id text,
  unlocked_at timestamptz default now(),
  primary key (user_id, goal_id)
);

alter table unlocked_goals enable row level security;

create policy "Users can view their own unlocks"
  on unlocked_goals for select
  using (auth.uid() = user_id);
