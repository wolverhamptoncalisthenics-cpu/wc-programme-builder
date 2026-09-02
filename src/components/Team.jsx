import { User } from "lucide-react";

// TODO (Tom/Tim): please check and edit these bios — written from what's
// on record, but you two know your own bios best. Tim's especially needs
// your input, there wasn't much to go on.
//
// TO ADD A REAL PHOTO: put the image file in src/assets/ (e.g.
// tom-photo.jpg), add an import at the top of this file like:
//   import tomPhoto from "../assets/tom-photo.jpg";
// then set `photo: tomPhoto` below instead of `photo: null`. A square
// photo (roughly equal width/height) will look best.
const TEAM = [
  {
    name: "Tom",
    role: "Coach & Founder",
    photo: null,
    bio: "Level 3 qualified personal trainer working toward Level 4 specialisms in GP referral, lower back pain, and obesity & diabetes. Long-term hand balancing practitioner, currently chasing the one-arm handstand and holding a Guinness World Record attempt for longest diamond-grip handstand. Runs Saturday classes and co-founded Stacked, a separate handstand-focused community.",
  },
  {
    name: "Tim",
    role: "Coach & Founder",
    photo: null,
    bio: "Co-runs Wolverhampton Calisthenics alongside Tom, alternating teaching weeks. [Tim, add a couple of lines here about your background and what you focus on coaching.]",
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
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-brand-light/50" />
              </div>
            )}
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
