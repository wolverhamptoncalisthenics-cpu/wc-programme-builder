# Wolverhampton Calisthenics — Programme Builder

A landing page with accounts: people do the questionnaire, create an
account, and every programme — free or paid goal — gets built and
assigned by you or Tim by hand.

## What changed from the AI-generation version

Programmes are no longer written live by Claude, and they're no longer
auto-assigned from templates either. Every submission, regardless of
goal, is saved with status `pending_coach` and waits for you or Tim to
build it manually (a coach dashboard for doing this from within the app
is the next build stage — for now, this happens directly in Supabase's
Table Editor, see below).

This means there's no ongoing AI cost for the main flow. The
`netlify/functions/generate.js` file is still there, unused for now —
worth keeping around in case you want an AI-assisted first draft tool
for yourselves later, but nothing currently calls it. The
`template_programmes` table in the database is also currently unused
by the app — safe to ignore, or repurpose later if you want a "quick
starter plan while you wait" option.

## New pieces

- `src/lib/supabase.js` — connects to your Supabase project
- `src/context/AuthContext.jsx` — tracks who's logged in across the app
- `src/components/AuthForm.jsx` — sign up / log in, available from the
  header or mid-quiz
- `src/components/ProgrammeBuilder.jsx` — saves answers to the database
  for manual review, no auto-assignment
- `supabase/setup.sql` — the one-time database setup script

## One-time setup: Supabase (accounts + database)

1. Go to supabase.com, sign up, create a new project
2. In the SQL Editor, paste in and run `supabase/setup.sql` — this
   creates the accounts system and the submissions table
3. Go to Project Settings > API, copy your **Project URL** and
   **anon public** (or **publishable**) key

## Deploying to Netlify

1. Push this project to GitHub, then in Netlify: **Add new site >
   Import an existing project** and connect the repo — it reads
   `netlify.toml` automatically
2. Under **Site settings > Environment variables**, add:
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon/publishable key
   - (keep the `UNLOCK_CODE_...` variables from before if you still
     want the unlock-code flow for paid goals)
3. Trigger a redeploy after adding the variables

## Setting up the coach dashboard

1. Run `supabase/add-coaches.sql` in Supabase's SQL Editor (if you're
   setting up fresh instead, `supabase/setup.sql` already includes this)
2. On the live site, sign up for a normal account (both you and Tim,
   using whichever emails you want to log in with as coaches)
3. In Supabase, go to **Authentication > Users**, find your account,
   and copy its **User UID**
4. Go to **Table Editor > coaches**, click **Insert row**, paste that
   UID into `user_id`, add your name in `name`, save. Repeat for Tim.
5. Log out and back in on the site (or just refresh) — a **Coach
   dashboard** button will now appear in the header for that account

From the dashboard you can filter submissions by Pending/Ready/All,
click "Build programme" on any pending one, and fill in a proper form
— summary, a weekly plan with exercises picked from your video
library, and a longer progression with phases and goals. Saving marks
it "ready" and the person sees it next time they log in.

## Assigning a programme manually (old method, no longer needed)

Before the dashboard existed, this had to be done directly in
Supabase's Table Editor by pasting raw JSON into the
`manual_programme` column. The dashboard now does this for you — this
section is just here in case you ever need to fix something by hand.

1. In Supabase, go to **Table Editor > submissions**
2. Find the row for the person you're building for (sorted by
   `created_at`, newest at the top — filter by `status = pending_coach`
   to see who's waiting)
3. Click into the `manual_programme` cell and paste in a JSON object
   shaped like this:

   ```json
   {
     "summary": "A short note to them about the approach",
     "focus": "Short tag, e.g. Press handstand progression",
     "quickPlan": { "days": [
       { "day": "Day 1", "focus": "Compression + wrist prep", "exercises": [
         { "name": "Wrist mobility flow", "prescription": "1x5 min" },
         { "name": "Press handstand drill", "prescription": "5x3" }
       ] }
     ] },
     "progression": { "phases": [
       { "phase": "Weeks 1-4: Compression", "focus": "Building the shape", "goals": ["..."], "keyExercises": [
         { "name": "Press handstand drill", "prescription": "5x3" }
       ] }
     ] }
   }
   ```
4. Change `status` from `pending_coach` to `ready`
5. They'll see it next time they log in

## What's still to build (next stages)

1. **Email notifications** — alert you both the moment someone submits
2. **PWA support** — so the site installs like an app on people's phones

## Running it locally

```
npm install
npm run dev
```

Create a `.env` file (copy `.env.example`) with your Supabase URL and
key to test the full flow locally. Needs Node.js installed.

## Adding exercise videos

Open `src/data/programme.js`, find `EXERCISE_LIBRARY`, and fill in a
video ID or URL next to the relevant exercise name:

```js
"Strict pull-ups": "dQw4w9WgXcQ",  // YouTube video ID
"Ring dips": "https://yoursite.com/videos/ring-dips.mp4",  // direct link
```

## Adding a custom domain

Under **Site settings > Domain management > Add a custom domain** in
Netlify, follow the prompts.
