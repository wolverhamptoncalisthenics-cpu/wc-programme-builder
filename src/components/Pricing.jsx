import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Free",
    price: "£0",
    description: "Everything you need for open-ended training.",
    features: [
      "General strength & mobility",
      "Flexibility & movement quality",
      "Handstand basics",
      "Video demos for every move",
      "Progress tracking",
    ],
    highlight: false,
  },
  {
    name: "First Pull-Up",
    price: "£15",
    description: "Tim's structured path from dead hang to your first strict pull-up.",
    features: [
      "Everything in Free",
      "Programme built specifically for pulling strength",
      "Progressions matched to your current level",
      "One-time payment, yours to keep",
    ],
    highlight: true,
  },
  {
    name: "Press Handstand",
    price: "£15",
    description: "Tom's programme for compression, strength, and control to press to handstand.",
    features: [
      "Everything in Free",
      "Programme built specifically for pressing strength",
      "Progressions matched to your current level",
      "One-time payment, yours to keep",
    ],
    highlight: true,
  },
];

export default function Pricing() {
  function scrollToApp() {
    document.getElementById("app")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-20">
      <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
        Pricing
      </span>
      <h2 className="font-display font-extrabold uppercase text-3xl md:text-4xl leading-tight mt-2 mb-12">
        Start free. Unlock more when you're ready.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-sm border p-6 flex flex-col ${
              tier.highlight ? "border-brand-orange bg-brand-orange/5" : "border-white/15"
            }`}
          >
            <h3 className="font-display font-bold uppercase text-xl">{tier.name}</h3>
            <p className="font-display font-extrabold text-3xl text-brand-orange mt-2">
              {tier.price}
            </p>
            <p className="text-brand-light text-sm font-body mt-3 leading-relaxed">
              {tier.description}
            </p>
            <ul className="mt-6 space-y-2 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm font-body text-white/90">
                  <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={scrollToApp}
              className={`mt-6 w-full font-display font-bold uppercase tracking-wide text-sm py-3 rounded-sm transition-all ${
                tier.highlight
                  ? "bg-brand-orange hover:brightness-110 text-brand-dark"
                  : "border border-white/20 hover:border-white/40 text-white"
              }`}
            >
              {tier.price === "£0" ? "Start free" : "Get access"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
