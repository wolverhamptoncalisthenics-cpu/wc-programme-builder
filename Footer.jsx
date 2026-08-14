import logo from "../assets/logo-light-bg.svg";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-brand-light/5 border-t border-white/10 px-4 py-12">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Wolverhampton Calisthenics" className="h-10" />
        </div>
        <div className="flex items-center gap-6 text-sm font-body text-brand-light">
          <a href="#app" className="hover:text-white transition-colors">
            Build a programme
          </a>
          {/* Update this with your real Instagram link */}
          <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
            <InstagramIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
      <p className="text-center text-xs text-brand-light/60 font-body mt-8">
        © {new Date().getFullYear()} Wolverhampton Calisthenics
      </p>
    </footer>
  );
}

