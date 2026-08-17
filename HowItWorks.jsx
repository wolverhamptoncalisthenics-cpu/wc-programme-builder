import { ClipboardList, Sparkles, PlayCircle, LineChart } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Answer 5 quick questions",
    body: "Your goal, your level, how many days you can train, and what equipment you've got.",
  },
  {
    icon: Sparkles,
    title: "Your coach builds your plan",
    body: "Tom or Tim puts your programme together by hand, matched to your goal, level, and what you've got access to.",
  },
  {
    icon: PlayCircle,
    title: "Train with video demos",
    body: "Every move links to a demo so you're never guessing on form.",
  },
  {
    icon: LineChart,
    title: "Track as you go",
    body: "Tick off sessions and watch your progress build, saved right on your device.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-20">
      <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
        The process
      </span>
      <h2 className="font-display font-extrabold uppercase text-3xl md:text-4xl leading-tight mt-2 mb-12">
        How it works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-brand-orange text-2xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon className="w-5 h-5 text-brand-orange" strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-lg leading-snug">{step.title}</h3>
              <p className="text-brand-light text-sm font-body leading-relaxed">{step.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
