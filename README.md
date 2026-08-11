# Wolverhampton Calisthenics — Programme Builder

A full landing page with a personalised, AI-generated calisthenics
programme builder at its core, styled in your brand colours and fonts.

## Page structure (top to bottom)

- `src/components/Nav.jsx` — sticky header with anchor links
- `src/components/Hero.jsx` — headline and call to action
- `src/components/HowItWorks.jsx` — the 4-step explainer
- `src/components/Pricing.jsx` — free vs paid tier cards
- `src/components/ProgrammeBuilder.jsx` — the quiz itself (goal, level,
  days, equipment, injuries)
- `src/components/ProgrammeResult.jsx` — the generated plan, weekly/
  progression toggle, exercise videos
- `src/components/ProgressTracker.jsx` — session checklist + milestone log
- `src/components/Testimonials.jsx` — **placeholder quotes, replace before
  going live**
- `src/components/Team.jsx` — coach bios, **Tim's needs your input**
- `src/components/FAQ.jsx` — expandable Q&A
- `src/components/Footer.jsx` — links, update the placeholder ones

Shared data lives in `src/data/programme.js` — the goals list (free/paid,
pricing) and the exercise video library both live here so they stay
consistent across the whole app.

## Editing content

Each section's text is a plain array or object near the top of its file
— open the file, change the words, save. No need to touch the layout
code below unless you want to change how something looks.

Look for `TODO` and `PLACEHOLDER` comments — those mark the two things
worth doing before sharing this widely: real testimonials, and Tim's bio.

## One-time setup: get an Anthropic API key

1. Go to https://console.anthropic.com and sign up (separate from your
   normal Claude.ai login — this is the developer/billing side)
2. Add a small amount of credit (a few pounds will last a very long time
   at this usage level)
3. Create an API key under **Settings > API Keys**
4. Keep it somewhere safe — you'll paste it into Netlify in a moment

## Deploying to Netlify (no coding required)

1. Go to https://app.netlify.com and sign up (free)
2. Easiest route: drag the whole `wc-app` folder onto
   https://app.netlify.com/drop — this uploads and builds it automatically
   - For easier future updates, push this folder to a GitHub repository
     and connect it in Netlify under **Add new site > Import an existing
     project** instead — it'll pick up `netlify.toml` automatically
3. Go to **Site settings > Environment variables** and add:
   - `ANTHROPIC_API_KEY` — your key from above
4. Trigger a redeploy (automatic after adding an environment variable,
   or use **Deploys > Trigger deploy**)
5. Test the whole flow on the live `.netlify.app` link before sharing it

## Setting up paid goals (Tim's pull-up programme, your press handstand programme)

Locked goals need an access code set as an environment variable in
Netlify, same place as your API key:

- `UNLOCK_CODE_FIRST_STRICT_PULL_UP` — the code for Tim's product, e.g. `PULLUP2026`
- `UNLOCK_CODE_PRESS_HANDSTAND` — the code for your press handstand product, e.g. `PRESSHS2026`

Whoever buys gets the code from however you're currently taking payment
(Stripe, bank transfer, whatever) and types it in to unlock that goal.
Change a code any time in Netlify — takes effect within a minute or two,
no redeploy needed.

To add a third paid goal later, add an entry to the `GOALS` array in
`src/data/programme.js` with `tier: "paid"`, and add matching pricing
info to the `TIERS` array in `src/components/Pricing.jsx`, then set a
matching `UNLOCK_CODE_...` variable in Netlify.

Note: unlocking happens per-device (saved in that browser), not
per-person — if someone buys on their phone then opens the app on a
laptop, they'd need to enter the code there too.

## Adding a custom domain later

Under **Site settings > Domain management > Add a custom domain**, follow
Netlify's prompts. You'll update a DNS setting wherever your domain is
registered (or register a new one directly through Netlify). SSL is
automatic and free.

## Adding exercise videos

Open `src/data/programme.js`, find the `EXERCISE_LIBRARY` object, and
fill in a video ID or URL next to the relevant exercise name:

```js
"Strict pull-ups": "dQw4w9WgXcQ",  // YouTube video ID
"Ring dips": "https://yoursite.com/videos/ring-dips.mp4",  // direct link
```

Save, then redeploy.

## Running it locally to test changes (optional)

```
npm install
npm run dev
```

Needs Node.js installed on your computer.
