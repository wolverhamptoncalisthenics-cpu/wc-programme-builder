import { useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import ProgrammeBuilder from "./components/ProgrammeBuilder";
import ProgrammeResult from "./components/ProgrammeResult";
import ProgressTracker from "./components/ProgressTracker";
import Testimonials from "./components/Testimonials";
import Team from "./components/Team";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { EXERCISE_LIBRARY } from "./data/programme";

const EXERCISE_LIST_STRING = Object.keys(EXERCISE_LIBRARY).join(", ");

export default function App() {
  const [result, setResult] = useState(null);
  const [goal, setGoal] = useState(null);
  const [builderKey, setBuilderKey] = useState(0);

  function handleResult(parsed, goalLabel) {
    setResult(parsed);
    setGoal(goalLabel);
  }

  function handleRestart() {
    setResult(null);
    setGoal(null);
    setBuilderKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen w-full bg-brand-dark text-white font-body">
      <Nav />
      <Hero />

      <div id="how-it-works">
        <HowItWorks />
      </div>

      <div id="pricing">
        <Pricing />
      </div>

      <section id="app" className="w-full px-4 py-20 border-y border-white/10 bg-black/10">
        <div className="max-w-md mx-auto text-center mb-10">
          <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
            Build your programme
          </span>
          <h2 className="font-display font-extrabold uppercase text-3xl leading-tight mt-2">
            Let's get started
          </h2>
        </div>

        {result ? (
          <ProgrammeResult result={result} goal={goal} onRestart={handleRestart} />
        ) : (
          <ProgrammeBuilder
            key={builderKey}
            onResult={handleResult}
            exerciseListString={EXERCISE_LIST_STRING}
          />
        )}
      </section>

      <section className="w-full px-4 py-20">
        <div className="max-w-md mx-auto text-center mb-10">
          <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
            Stay on track
          </span>
          <h2 className="font-display font-extrabold uppercase text-3xl leading-tight mt-2">
            Your progress
          </h2>
        </div>
        <ProgressTracker plan={result ? result.quickPlan : null} />
      </section>

      <Testimonials />
      <Team />

      <div id="faq">
        <FAQ />
      </div>

      <Footer />
    </div>
  );
}
