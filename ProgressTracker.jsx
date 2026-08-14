import { useState, useEffect } from "react";
import { CheckSquare, Square, Trophy, Plus, X } from "lucide-react";

const CHECKLIST_KEY = "wc-progress-checklist";
const MILESTONES_KEY = "wc-progress-milestones";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function ProgressTracker({ plan }) {
  const [checked, setChecked] = useState({});
  const [milestones, setMilestones] = useState([]);
  const [milestoneInput, setMilestoneInput] = useState("");

  useEffect(() => {
    setChecked(loadJSON(CHECKLIST_KEY, {}));
    setMilestones(loadJSON(MILESTONES_KEY, []));
  }, []);

  function toggleExercise(key) {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      return next;
    });
  }

  function addMilestone() {
    const text = milestoneInput.trim();
    if (!text) return;
    const next = [
      { id: Date.now(), text, date: new Date().toLocaleDateString("en-GB") },
      ...milestones,
    ];
    setMilestones(next);
    localStorage.setItem(MILESTONES_KEY, JSON.stringify(next));
    setMilestoneInput("");
  }

  function removeMilestone(id) {
    const next = milestones.filter((m) => m.id !== id);
    setMilestones(next);
    localStorage.setItem(MILESTONES_KEY, JSON.stringify(next));
  }

  const totalExercises = plan ? plan.days.reduce((sum, d) => sum + d.exercises.length, 0) : 0;
  const completedCount = plan
    ? plan.days.reduce(
        (sum, d, i) =>
          sum + d.exercises.filter((_, j) => checked[`${i}-${j}`]).length,
        0
      )
    : 0;

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Session checklist */}
      <div className="bg-black/20 border border-white/10 rounded-md p-6">
        <h3 className="font-display font-bold text-xl uppercase mb-1">This week's sessions</h3>
        {!plan ? (
          <p className="text-brand-light text-sm font-body">
            Build your programme above first, then come back here to tick off sessions as you go.
          </p>
        ) : (
          <>
            <p className="text-brand-light text-xs font-body mb-4">
              {completedCount} / {totalExercises} exercises ticked off
            </p>
            <div className="space-y-4">
              {plan.days.map((d, i) => (
                <div key={i}>
                  <span className="font-display font-bold uppercase text-brand-orange text-sm tracking-wide">
                    {d.day}
                  </span>
                  <ul className="mt-1 space-y-1.5">
                    {d.exercises.map((ex, j) => {
                      const key = `${i}-${j}`;
                      const isChecked = Boolean(checked[key]);
                      return (
                        <li key={key}>
                          <button
                            onClick={() => toggleExercise(key)}
                            className="w-full flex items-center gap-2 text-left text-sm font-body py-1"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-brand-orange shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-white/30 shrink-0" />
                            )}
                            <span className={isChecked ? "text-white/40 line-through" : "text-white/90"}>
                              {ex.name} — {ex.prescription}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Milestone log */}
      <div className="bg-black/20 border border-white/10 rounded-md p-6">
        <h3 className="font-display font-bold text-xl uppercase mb-1 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-brand-orange" /> Milestones
        </h3>
        <p className="text-brand-light text-xs font-body mb-4">
          Log the moments that matter — first wall hold, first strict rep, whatever's next for you.
        </p>
        <div className="flex gap-2 mb-4">
          <input
            value={milestoneInput}
            onChange={(e) => setMilestoneInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMilestone()}
            placeholder="e.g. First 10 second wall handstand"
            className="flex-1 bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-3 py-2 text-sm text-white font-body"
          />
          <button
            onClick={addMilestone}
            disabled={!milestoneInput.trim()}
            className="bg-brand-orange hover:brightness-110 disabled:bg-white/10 disabled:text-white/30 transition-all text-brand-dark rounded-sm px-3 flex items-center justify-center shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {milestones.length === 0 ? (
          <p className="text-brand-light text-sm font-body">No milestones logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {milestones.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-2 border border-white/10 rounded-sm px-3 py-2"
              >
                <div>
                  <p className="text-sm text-white/90 font-body">{m.text}</p>
                  <p className="text-brand-light text-xs font-body">{m.date}</p>
                </div>
                <button
                  onClick={() => removeMilestone(m.id)}
                  className="text-brand-light hover:text-brand-orange transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
