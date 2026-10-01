import { useState } from "react";
import { Zap, Calendar, RotateCcw } from "lucide-react";
import WorkoutTable from "./WorkoutTable";

export default function ProgrammeResult({ result, goal, onRestart }) {
  const [view, setView] = useState("quick");

  return (
    <div className="w-full max-w-3xl mx-auto bg-black/20 border border-white/10 rounded-md p-6 space-y-6">
      <div>
        <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
          {result.focus}
        </span>
        <h2 className="font-display font-extrabold uppercase text-3xl leading-none mt-1">
          Your programme
        </h2>
        <p className="text-brand-light text-sm mt-3 leading-relaxed font-body">{result.summary}</p>
      </div>

      <div className="flex border border-white/15 rounded-sm overflow-hidden max-w-md">
        <button
          onClick={() => setView("quick")}
          className={`flex-1 py-2 font-display font-bold uppercase text-sm tracking-wide flex items-center justify-center gap-1.5 transition-colors ${
            view === "quick" ? "bg-brand-orange text-brand-dark" : "text-brand-light"
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Weekly plan
        </button>
        <button
          onClick={() => setView("progression")}
          className={`flex-1 py-2 font-display font-bold uppercase text-sm tracking-wide flex items-center justify-center gap-1.5 transition-colors ${
            view === "progression" ? "bg-brand-orange text-brand-dark" : "text-brand-light"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Progression
        </button>
      </div>

      {view === "quick" && (
        <div className="space-y-6">
          {result.quickPlan.days.map((d, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-display font-bold uppercase text-brand-orange text-sm tracking-wide">
                  {d.day}
                </span>
                <span className="text-brand-light text-xs font-body">{d.focus}</span>
              </div>
              <WorkoutTable exercises={d.exercises} />
            </div>
          ))}
        </div>
      )}

      {view === "progression" && (
        <div className="space-y-6">
          {result.progression.phases.map((p, i) => (
            <div key={i}>
              <span className="font-display font-bold uppercase text-brand-orange text-sm tracking-wide">
                {p.phase}
              </span>
              <p className="text-brand-light text-xs mt-0.5 mb-3 font-body">{p.focus}</p>
              <div>
                <span className="text-brand-light text-xs uppercase tracking-wide font-display font-bold">
                  Goals
                </span>
                <ul className="mt-1 mb-3 space-y-1">
                  {p.goals.map((g, j) => (
                    <li key={j} className="text-sm text-white/90 flex gap-2 font-body">
                      <span className="text-brand-orange">•</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="text-brand-light text-xs uppercase tracking-wide font-display font-bold">
                Key work
              </span>
              <div className="mt-1">
                <WorkoutTable exercises={p.keyExercises} />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onRestart}
        className="w-full flex items-center justify-center gap-2 text-brand-light hover:text-white text-sm py-3 transition-colors font-body"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Start over
      </button>
    </div>
  );
}
