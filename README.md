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
   - The Stripe payment variables, see "Setting up Stripe payments"
     below
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

## Setting up Stripe payments

Paid goals (the press handstand and first pull-up programmes) unlock
through a real payment, using your existing Stripe account. Nobody
types in a code any more — Stripe handles the payment page itself,
and the unlock is recorded permanently against the person's account
the moment they're sent back to your site.

**1. Run the database migration**

In Supabase's SQL Editor, run `supabase/add-stripe.sql` — this adds
the `unlocked_goals` table that records confirmed payments.

**2. Create a Price for each paid goal in Stripe**

In your Stripe dashboard: **Product catalog > Add product**. Create
one for each paid goal (e.g. "First Pull-Up Programme", £49.99,
one-time). Once created, click into the product and copy its **Price
ID** (starts with `price_...`, not the Product ID which starts with
`prod_...`).

**3. Add environment variables in Netlify**

- `STRIPE_SECRET_KEY` — from Stripe: **Developers > API keys >
  Secret key**. Keep this one private, it's powerful
- `STRIPE_PRICE_FIRST_STRICT_PULL_UP` — the Price ID for Tim's
  product
- `STRIPE_PRICE_PRESS_HANDSTAND` — the Price ID for your product
- `SUPABASE_URL` — same value as `VITE_SUPABASE_URL`, just without the
  `VITE_` prefix (needed here because this runs on the server, not in
  the browser)
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase, **Project Settings >
  API > service_role (secret) key**. This bypasses your database's
  security rules entirely, which is exactly why only this one
  server-side function is allowed to use it — never put it anywhere
  in the app's own browser-facing code

Trigger a redeploy after adding these.

**4. Test it with a real test payment**

Stripe accounts start in **test mode** by default (check the toggle
in the top right of the Stripe dashboard). While in test mode, use
Stripe's test card number `4242 4242 4242 4242`, any future expiry
date, and any 3-digit CVC, to go through a full "payment" without
spending real money. Confirm the goal unlocks on your account
afterwards, and that it's still unlocked if you log out and back in.

**5. Go live**

Once you're happy it works, flip Stripe's toggle from test mode to
live mode, and create live-mode versions of your two Products/Prices
(test and live mode have entirely separate data in Stripe). Update the
`STRIPE_SECRET_KEY` and the two `STRIPE_PRICE_...` variables in
Netlify with the live-mode values, then redeploy.

To add a third paid goal later, create its Price in Stripe, add a new
`STRIPE_PRICE_...` variable following the same naming pattern, and add
the goal to the `GOALS` array in `src/data/programme.js`.

## Setting up email notifications

Two things trigger an email: you and Tim get notified the moment
someone submits the questionnaire, and the person themselves gets
notified once their programme is marked "ready" in the coach
dashboard. Both send through your own Gmail account, using something
called an "app password" rather than your normal login password
(Google requires this for any app sending on your behalf).

**1. Turn on 2-Step Verification** (if it isn't already on)

Go to myaccount.google.com/security on the Gmail account you want to
send from. Under "How you sign in to Google", turn on **2-Step
Verification** if it isn't already — this is required before Google
will let you create an app password.

**2. Create an app password**

Still in myaccount.google.com/security, search for **App passwords**
(or go to myaccount.google.com/apppasswords directly). Create one,
name it something like "Wolverhampton Calisthenics site", and Google
will show you a 16-character code. Copy it — you won't be able to see
it again after leaving the page.

**3. Add environment variables in Netlify**

Same place as before (Site settings > Environment variables):

- `GMAIL_USER` — the Gmail address you're sending from, e.g.
  `wolverhamptoncalisthenics@gmail.com`
- `GMAIL_APP_PASSWORD` — the 16-character code from step 2 (remove any
  spaces Google shows it with)
- `COACH_NOTIFY_EMAIL` — the shared inbox you and Tim want notified at
  for new submissions (can be the same Gmail address, or different)

Trigger a redeploy after adding these, then submit a test
questionnaire on the live site and check the inbox — it should land
within a few seconds. Then test the other direction too: mark a test
submission "ready" in the coach dashboard and confirm the client-side
email arrives.

**A note on reliability:** the "new submission" email fires from the
person's own browser right after they submit, so it needs their
connection to still be open for that brief moment. In practice this is
essentially always the case, but if you ever suspect an email didn't
send, the submission itself will still be sitting safely in the coach
dashboard regardless — the email is just a convenience nudge, not the
only way you'll find out about it.

**A note on sending limits:** Gmail allows up to 500 emails a day sent
this way, comfortably more than this app will need at your current
scale. If the community grows large enough to bump into that, or you
want a more "official" sending address than a Gmail one, moving to a
proper email service with your own verified domain (like Resend) is a
sensible upgrade at that point, not something to worry about now.

## What's still to build (next stages)

1. **PWA support** — so the site installs like an app on people's phones

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
