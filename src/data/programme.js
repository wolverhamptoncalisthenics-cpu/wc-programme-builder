// ─────────────────────────────────────────────────────────────
// GOALS
// Free goals are open to everyone. Paid goals show a lock, price,
// and product name, and need an access code to unlock (checked
// server-side — see netlify/functions/verify-code.js).
//
// To change a price, edit `price` below. To change or add codes,
// set environment variables in Netlify named:
//   UNLOCK_CODE_FIRST_STRICT_PULL_UP
//   UNLOCK_CODE_PRESS_HANDSTAND
// (the id, uppercased, with hyphens turned to underscores, prefixed
// with UNLOCK_CODE_)
// ─────────────────────────────────────────────────────────────
export const GOALS = [
  { id: "general-strength", label: "General strength & mobility", tier: "free" },
  { id: "flexibility", label: "Flexibility & movement quality", tier: "free" },
  { id: "handstand-basics", label: "Handstand basics", tier: "free" },
  { id: "muscle-up", label: "Muscle-up", tier: "free" },
  {
    id: "first-strict-pull-up",
    label: "First strict pull-up",
    tier: "paid",
    price: "£15",
    product: "Tim's First Pull-Up Programme",
    coach: "Tim",
  },
  {
    id: "press-handstand",
    label: "Press handstand",
    tier: "paid",
    price: "£15",
    product: "Tom's Press Handstand Programme",
    coach: "Tom",
  },
];

// ─────────────────────────────────────────────────────────────
// EXERCISE VIDEO LIBRARY
// Add your own demo videos here as you record them.
// YouTube: just the video ID. Direct file: full URL starting "http".
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

export function getVideoSource(name) {
  const entry = EXERCISE_LIBRARY[name];
  if (!entry) return null;
  if (entry.startsWith("http")) return { type: "direct", src: entry };
  return { type: "youtube", src: `https://www.youtube-nocookie.com/embed/${entry}` };
}
