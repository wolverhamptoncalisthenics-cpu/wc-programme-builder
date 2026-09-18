// ─────────────────────────────────────────────────────────────
// GOALS
// Free goals are open to everyone. Paid goals show a lock and price,
// with a "Pay to unlock" button that starts a real Stripe payment
// (see netlify/functions/create-checkout-session.js and
// confirm-checkout.js). Once paid, the unlock is recorded against the
// person's account in the unlocked_goals table, not on their device.
//
// Note: the `id` values below are internal keys only (used to match
// database rows and environment variable names) — they're never shown
// to users.
//
// To change a price, edit `price` below (this is just the displayed
// text — the actual amount charged comes from the Stripe Price you
// set up, see README). Each paid goal needs a matching Stripe Price
// ID set as an environment variable in Netlify named:
//   STRIPE_PRICE_FIRST_STRICT_PULL_UP
//   STRIPE_PRICE_PRESS_HANDSTAND
// (the id, uppercased, with hyphens turned to underscores, prefixed
// with STRIPE_PRICE_)
// ─────────────────────────────────────────────────────────────
export const GOALS = [
  { id: "general-strength", label: "General strength & mobility", tier: "free" },
  { id: "flexibility", label: "Flexibility & movement quality", tier: "free" },
  { id: "handstand-basics", label: "Handstand basics", tier: "free" },
  {
    id: "first-strict-pull-up",
    label: "First strict pull-up",
    tier: "paid",
    price: "£49.99",
    product: "Tim's First Pull-Up Programme",
    coach: "Tim",
  },
  {
    id: "press-handstand",
    label: "Press handstand",
    tier: "paid",
    price: "£49.99",
    product: "Tom's Press Handstand Programme",
    coach: "Tom",
  },
];

// ─────────────────────────────────────────────────────────────
// EXERCISE VIDEO LIBRARY
// This list is used only to populate the exercise-name dropdown in
// the coach dashboard — actual video links and notes are now entered
// per exercise when a programme is built, not stored here.
// ─────────────────────────────────────────────────────────────
export const EXERCISE_LIBRARY = {
  "Dead hang": "",
  "Scapular pull-ups": "",
  "Negative pull-ups": "",
  "Band-assisted pull-ups": "",
  "Strict pull-ups": "",
  "Chin-ups": "",
  "Australian rows": "",
  "Ring rows": "",
  "Archer pull-ups": "",
  "Wall handstand hold": "",
  "Chest-to-wall handstand": "",
  "Freestanding handstand practice": "",
  "Press handstand drill": "",
  "Straddle press to handstand": "",
  "Pike push-ups": "",
  "Wall handstand push-ups": "",
  "Hollow body hold": "",
  "Arch hold (superman)": "",
  "Hollow rocks": "",
  "L-sit hold": "",
  "Tuck L-sit": "",
  Dips: "",
  "Ring dips": "",
  "Straight bar dips": "",
  "Explosive pull-ups": "",
  "Muscle-up transition drill": "",
  "Band-assisted muscle-ups": "",
  "Wrist mobility flow": "",
  "Shoulder dislocates": "",
  "Deep squat hold": "",
  "Cossack squats": "",
  "Push-ups": "",
  "Diamond push-ups": "",
  "Plank hold": "",
  "Side plank": "",
  "Parallette support hold": "",
  "Straddle planche lean": "",
  "Skin the cat": "",
  "Active hang": "",
};
