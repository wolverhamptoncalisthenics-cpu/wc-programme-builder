-- Wolverhampton Calisthenics — coach dashboard setup
-- Run this AFTER your original setup.sql (which you've already done).
-- This just adds the coaches table and the extra permissions needed
-- for the coach dashboard. Paste into Supabase's SQL Editor and Run.

create table coaches (
  user_id uuid references auth.users on delete cascade primary key,
  name text
);

alter table coaches enable row level security;

create policy "Users can check their own coach status"
  on coaches for select
  using (auth.uid() = user_id);

create policy "Coaches can view all submissions"
  on submissions for select
  using (exists (select 1 from coaches where user_id = auth.uid()));

create policy "Coaches can update submissions"
  on submissions for update
  using (exists (select 1 from coaches where user_id = auth.uid()));

create policy "Coaches can view all profiles"
  on profiles for select
  using (exists (select 1 from coaches where user_id = auth.uid()));
