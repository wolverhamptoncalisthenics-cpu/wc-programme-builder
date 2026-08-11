// PLACEHOLDER CONTENT — swap these for real quotes from your own members
// before this goes live. Three is a good number to start with; add more
// as you collect them.
const TESTIMONIALS = [
  {
    quote:
      "Placeholder — swap in a real quote here about how the programme fit around their schedule or goal.",
    name: "Member name",
  },
  {
    quote:
      "Placeholder — swap in a real quote here about progress they made or how the videos helped.",
    name: "Member name",
  },
  {
    quote:
      "Placeholder — swap in a real quote here about the Saturday classes or the community itself.",
    name: "Member name",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-20">
      <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
        From the community
      </span>
      <h2 className="font-display font-extrabold uppercase text-3xl md:text-4xl leading-tight mt-2 mb-12">
        What members say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="border border-white/15 rounded-sm p-6">
            <p className="text-white/90 text-sm font-body leading-relaxed italic">"{t.quote}"</p>
            <p className="text-brand-orange text-xs font-display font-bold uppercase tracking-wide mt-4">
              {t.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
