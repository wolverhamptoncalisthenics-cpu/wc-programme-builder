import logo from "../assets/logo-light-bg.svg";

export default function Footer() {
  return (
    <footer className="w-full bg-brand-light/5 border-t border-white/10 px-4 py-12">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Wolverhampton Calisthenics" className="h-10" />
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 text-sm font-body text-brand-light">
          <a href="#app" className="hover:text-white transition-colors">
            Build a programme
          </a>
          {/* Update these with your real links */}
          <a href="#" className="hover:text-white transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Saturday classes at Firewalker Fitness
          </a>
        </div>
      </div>
      <p className="text-center text-xs text-brand-light/60 font-body mt-8">
        © {new Date().getFullYear()} Wolverhampton Calisthenics
      </p>
    </footer>
  );
}
