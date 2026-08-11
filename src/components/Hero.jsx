import { ChevronRight } from "lucide-react";
import logo from "../assets/logo-dark-bg.svg";

export default function Hero() {
  function scrollToApp() {
    document.getElementById("app")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="min-h-[90vh] w-full flex flex-col items-center justify-center px-4 py-16 text-center">
      <img src={logo} alt="Wolverhampton Calisthenics" className="h-20 md:h-28 mb-10" />
      <h1 className="font-display font-extrabold uppercase text-4xl md:text-6xl leading-[0.95] tracking-tight max-w-2xl">
        Your programme, <span className="text-brand-orange">built for you</span>
      </h1>
      <p className="text-brand-light font-body text-base md:text-lg mt-6 max-w-md leading-relaxed">
        Answer a few questions. Get a plan matched to your goal, your level, and what you've
        actually got access to — free, in under a minute.
      </p>
      <button
        onClick={scrollToApp}
        className="mt-10 bg-brand-orange hover:brightness-110 transition-all text-brand-dark font-display font-bold uppercase tracking-wide text-lg px-8 py-3 rounded-sm flex items-center gap-2"
      >
        Build my programme <ChevronRight className="w-5 h-5" strokeWidth={3} />
      </button>
    </section>
  );
}
