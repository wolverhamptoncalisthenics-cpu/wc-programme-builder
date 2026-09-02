function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer({ onOpenContact }) {
  return (
    <footer className="w-full bg-brand-light/5 border-t border-white/10 px-4 py-6">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-body text-brand-light">
        <p className="text-xs text-brand-light/60">
          © {new Date().getFullYear()} Wolverhampton Calisthenics
        </p>
        <a
          href="https://www.instagram.com/wolverhamptoncalisthenics"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:text-white transition-colors"
        >
          <InstagramIcon className="w-6 h-6" />
        </a>
        <a href="#app" className="hover:text-white transition-colors">
          Build my plan
        </a>
        <button onClick={onOpenContact} className="hover:text-white transition-colors">
          Contact
        </button>
      </div>
    </footer>
  );
}
