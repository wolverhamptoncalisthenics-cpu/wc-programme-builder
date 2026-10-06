const TESTIMONIALS = [
  {
    quote:
      "I've got a much better understanding of my form, and it's great seeing other athletes learning different skills and helping each other out with feedback.",
    name: "Anthony Golding",
  },
  {
    quote: "I've learnt new skills and sharpened the ones I already had.",
    name: "Samantha Box",
  },
  {
    quote:
      "It's shown me exactly which weak points I need to work on to optimise my performance, keep progressing, and stay injury free.",
    name: "Ryan Liecheukyin",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-20">
      <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
        From the community
      </span>
      <h2 className="font-display font-extrabold uppercase text-3xl md:text-4xl leading-tight mt-2 mb-12">
        What the community says
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
