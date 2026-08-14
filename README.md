# Wolverhampton Calisthenics — Programme Builder

A landing page with accounts: people do the questionnaire, create an
account, and either get a ready-made template programme instantly
(free/common goals) or wait for you or Tim to build theirs by hand
(paid/advanced goals).

## What changed from the AI-generation version

Programmes are no longer written live by Claude. Instead:

- **Free goals** (general strength, flexibility, handstand basics,
  muscle-up) → instantly assigned one of a handful of template
  programmes you and Tim write once, stored in the database
- **Paid goals** (press handstand, first pull-up) → after payment and
  unlocking, their answers are saved and marked "pending" — you build
  their programme by hand (a coach dashboard for this is the next
  build stage, not included yet)

This also means there's no ongoing AI cost for the main flow. The
`netlify/functions/generate.js` file is still there, unused for now —
worth keeping around in case you want an AI-assisted first draft tool
for yourselves later, but nothing currently calls it.

## New pieces

- `src/lib/supabase.js` — connects to your Supabase project
- `src/context/AuthContext.jsx` — tracks who's logged in across the app
- `src/components/AuthForm.jsx` — sign up / log in, shown mid-quiz
- `src/components/ProgrammeBuilder.jsx` — now saves answers to the
  database instead of calling an AI
- `supabase/setup.sql` — the one-time database setup script

## One-time setup: Supabase (accounts + database)

1. Go to supabase.com, sign up, create a new project
2. In the SQL Editor, paste in and run `supabase/setup.sql` — this
   creates the accounts system, the submissions table, and seeds four
   starter templates so there's something to test with
3. Go to Project Settings > API, copy your **Project URL** and
   **anon public** key

## Deploying to Netlify

1. Push this project to GitHub, then in Netlify: **Add new site >
   Import an existing project** and connect the repo — it reads
   `netlify.toml` automatically
2. Under **Site settings > Environment variables**, add:
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon key
   - (keep `ANTHROPIC_API_KEY` and the `UNLOCK_CODE_...` variables from
     before if you still want the unlock-code flow for paid goals)
3. Trigger a redeploy after adding the variables

## Writing your real template programmes

The four starter templates are placeholders, just enough to test with.
In Supabase, go to **Table Editor > template_programmes** — it's a
spreadsheet-style view. Edit the `summary`, `focus`, `quick_plan`, and
`progression` columns directly. The `quick_plan` and `progression`
columns hold structured data (JSON) — happy to help you edit these
through the table editor's built-in JSON view if the format is fiddly,
just ask.

## What's still to build (next stages)

1. **Coach dashboard** — a private, login-gated page for you and Tim to
   see new "pending_coach" submissions and write/save a manual
   programme against them
2. **Email notifications** — alert you both the moment someone submits
3. **PWA support** — so the site installs like an app on people's phones

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
