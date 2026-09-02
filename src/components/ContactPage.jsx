import { Mail, ArrowLeft } from "lucide-react";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function ContactPage({ onGoHome }) {
  return (
    <div className="min-h-screen w-full bg-brand-dark text-white font-body px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
          Get in touch
        </span>
        <h1 className="font-display font-extrabold uppercase text-3xl leading-tight mt-2 mb-10">
          Contact us
        </h1>

        <div className="space-y-4">
          <a
            href="mailto:wolverhamptoncalisthenics@gmail.com"
            className="flex items-center justify-center gap-3 border border-white/15 rounded-sm py-4 hover:border-white/40 transition-colors"
          >
            <Mail className="w-5 h-5 text-brand-orange" />
            <span className="font-body text-sm">wolverhamptoncalisthenics@gmail.com</span>
          </a>

          <a
            href="https://www.instagram.com/wolverhamptoncalisthenics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 border border-white/15 rounded-sm py-4 hover:border-white/40 transition-colors"
          >
            <InstagramIcon className="w-5 h-5 text-brand-orange" />
            <span className="font-body text-sm">@wolverhamptoncalisthenics</span>
          </a>
        </div>

        <button
          onClick={onGoHome}
          className="mt-10 inline-flex items-center gap-2 text-brand-light hover:text-white text-sm font-body transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>
      </div>
    </div>
  );
}
