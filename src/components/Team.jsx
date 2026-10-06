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
    bio: [
      "I'm a Level 3 qualified personal trainer, and I've been working in the fitness industry for the past 6 years. I started weightlifting in my teens, but got bored of typical bodybuilding routines pretty quickly. That sent me exploring other things, running, yoga, and eventually bodyweight training, which is where I got properly hooked.",
      "Learning to handstand has been a huge part of that journey, and for the past few years I've been sharing that with others, helping people learn to balance on their hands from scratch. I want to be able to help people who don't fit the typical \"gym-goer\" mould too.",
      "I'm continuing to refine my one-arm handstand and other advanced bodyweight strength skills. I still consider myself a student of this as much as a coach, and I learn from other coaches whenever I'm able to.",
    ],
  },
  {
    name: "Tim",
    role: "Coach & Founder",
    photo: null,
    bio: [
      "Co-runs Wolverhampton Calisthenics alongside Tom, alternating teaching weeks. [Tim, add a couple of lines here about your background and what you focus on coaching.]",
    ],
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
            <div className="text-brand-light text-sm font-body mt-4 leading-relaxed space-y-3">
              {member.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
