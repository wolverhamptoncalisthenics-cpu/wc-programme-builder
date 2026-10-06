import { RotateCcw } from "lucide-react";
import WorkoutTable from "./WorkoutTable";

export default function ProgrammeResult({ result, goal, onRestart }) {
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

      <button
        onClick={onRestart}
        className="w-full flex items-center justify-center gap-2 text-brand-light hover:text-white text-sm py-3 transition-colors font-body"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Start over
      </button>
    </div>
  );
}
