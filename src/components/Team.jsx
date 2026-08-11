// TODO (Tom/Tim): please check and edit these bios — written from what's
// on record, but you two know your own bios best. Tim's especially needs
// your input, there wasn't much to go on.
const TEAM = [
  {
    name: "Tom",
    role: "Coach & Founder",
    bio: "Level 3 qualified personal trainer working toward Level 4 specialisms in GP referral, lower back pain, and obesity & diabetes. Long-term hand balancing practitioner, currently chasing the one-arm handstand and holding a Guinness World Record attempt for longest diamond-grip handstand. Runs Saturday classes and co-founded Stacked, a separate handstand-focused community.",
  },
  {
    name: "Tim",
    role: "Coach",
    bio: "Co-runs Wolverhampton Calisthenics alongside Tom, alternating teaching weeks. [Tim — add a couple of lines here about your background and what you focus on coaching.]",
  },
];

export default function Team() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-20">
      <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
        Your coaches
      </span>
      <h2 className="font-display font-extrabold uppercase text-3xl md:text-4xl leading-tight mt-2 mb-12">
        Who's behind this
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TEAM.map((member) => (
          <div key={member.name} className="border border-white/15 rounded-sm p-6">
            <h3 className="font-display font-bold uppercase text-xl">{member.name}</h3>
            <p className="text-brand-orange text-xs font-display font-bold uppercase tracking-wide mt-1">
              {member.role}
            </p>
            <p className="text-brand-light text-sm font-body mt-4 leading-relaxed">{member.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
