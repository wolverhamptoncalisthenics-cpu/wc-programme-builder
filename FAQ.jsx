import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Do I need any equipment?",
    a: "No — one of the quiz questions asks what you've got access to, and your plan is built around that. If it's wall space only, you'll get a wall-space-only plan.",
  },
  {
    q: "How do I get my programme?",
    a: "After the quiz, you'll create an account. Tom or Tim then builds your programme by hand based on your answers — you'll see it appear in your account once it's ready.",
  },
  {
    q: "How does unlocking a paid programme work?",
    a: "After paying (details on how to pay are outside this app for now), you'll get an access code. Enter it on the goal you've unlocked, then submit the quiz as normal and your coach will build it for you.",
  },
  {
    q: "Can I build more than one programme?",
    a: "Yes — hit \"Submit a different goal instead\" any time to run the quiz again with a different goal or set of answers.",
  },
  {
    q: "Is my information stored anywhere?",
    a: "Yes — creating an account means your answers and programme are saved to your account, so you can log in from any device and pick up where you left off.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/15 py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="font-display font-bold text-base md:text-lg">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-brand-orange shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="text-brand-light text-sm font-body mt-3 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-20">
      <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
        Questions
      </span>
      <h2 className="font-display font-extrabold uppercase text-3xl md:text-4xl leading-tight mt-2 mb-8">
        FAQ
      </h2>
      <div>
        {FAQS.map((f) => (
          <FAQItem key={f.q} q={f.q} a={f.a} />
        ))}
      </div>
    </section>
  );
}
