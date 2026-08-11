import { useState, useEffect } from "react";
import {
  ChevronRight,
  Loader2,
  ArrowLeft,
  Lock,
  Check,
} from "lucide-react";
import { GOALS } from "../data/programme";

const QUESTIONS = [
  {
    key: "level",
    label: "Where are you at currently?",
    type: "single",
    options: [
      "Just starting out",
      "Comfortable with basics, building strength",
      "Training consistently, chasing skills",
      "Advanced — refining specific weaknesses",
    ],
  },
  {
    key: "days",
    label: "How many days a week can you realistically train?",
    type: "single",
    options: ["2 days", "3 days", "4 days", "5+ days"],
  },
  {
    key: "equipment",
    label: "What have you got access to?",
    type: "multi",
    options: ["Pull-up bar", "Rings", "Parallettes", "Wall space only", "Full gym / leisure centre"],
  },
  {
    key: "limitations",
    label: "Any injuries or things to work around? (optional)",
    type: "text",
  },
];

function buildSystemPrompt(goalLabel, exerciseList) {
  return `You write calisthenics training programmes for Wolverhampton Calisthenics, a community-run group. Voice: direct, encouraging, no fluff, coach-to-athlete. Never invent unsafe loading jumps — progressions should be realistic and beginner-safe where relevant.

The athlete's stated goal is: ${goalLabel}. Build the entire programme around progressing toward this goal specifically.

You must ONLY use exercise names from this exact list (match spelling exactly, do not invent new names): ${exerciseList}

Respond with ONLY valid JSON, no markdown fences, no preamble, matching exactly this shape:
{
  "summary": "2-3 sentence overview of the approach for this person, written directly to them",
  "focus": "a short 3-6 word tag describing the primary focus",
  "quickPlan": {
    "days": [
      { "day": "Day 1", "focus": "short session focus", "exercises": [ { "name": "exact name from the list", "prescription": "e.g. 3x8" } ] }
    ]
  },
  "progression": {
    "phases": [
      { "phase": "Weeks 1-2: Foundation", "focus": "short phase focus", "goals": ["...", "..."], "keyExercises": [ { "name": "exact name from the list", "prescription": "e.g. 3x8" } ] }
    ]
  }
}
The quickPlan should have one entry per training day requested. The progression should have 3-4 phases spanning roughly 8-12 weeks, building logically toward the stated goal.`;
}

const UNLOCKED_STORAGE_KEY = "wc-unlocked-goals";

export default function ProgrammeBuilder({ onResult, exerciseListString }) {
  const [step, setStep] = useState(0); // 0 = goal, 1..N = questions, N+1 = done (handled by parent)
  const [answers, setAnswers] = useState({ equipment: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [unlockedGoals, setUnlockedGoals] = useState([]);
  const [unlockTarget, setUnlockTarget] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [codeChecking, setCodeChecking] = useState(false);
  const [codeError, setCodeError] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(UNLOCKED_STORAGE_KEY) || "[]");
      if (Array.isArray(stored)) setUnlockedGoals(stored);
    } catch {
      // ignore malformed storage
    }
  }, []);

  const totalSteps = 1 + QUESTIONS.length;
  const current = step >= 1 && step <= QUESTIONS.length ? QUESTIONS[step - 1] : null;

  function isUnlocked(goalId) {
    return unlockedGoals.includes(goalId);
  }

  function selectGoal(goal) {
    if (goal.tier === "paid" && !isUnlocked(goal.id)) {
      setUnlockTarget(goal.id);
      setCodeInput("");
      setCodeError(null);
      return;
    }
    setAnswers((a) => ({ ...a, goal: goal.label }));
  }

  async function submitCode(goal) {
    setCodeChecking(true);
    setCodeError(null);
    try {
      const response = await fetch(import.meta.env.VITE_VERIFY_URL || "/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId: goal.id, code: codeInput.trim() }),
      });
      const data = await response.json();
      if (data.valid) {
        const next = [...new Set([...unlockedGoals, goal.id])];
        setUnlockedGoals(next);
        localStorage.setItem(UNLOCKED_STORAGE_KEY, JSON.stringify(next));
        setUnlockTarget(null);
        setAnswers((a) => ({ ...a, goal: goal.label }));
      } else {
        setCodeError("That code doesn't look right. Double check it and try again.");
      }
    } catch (e) {
      setCodeError("Couldn't check that code just now. Try again in a moment.");
    } finally {
      setCodeChecking(false);
    }
  }

  function selectSingle(key, value) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  function toggleMulti(key, value) {
    setAnswers((a) => {
      const existing = a[key] || [];
      const next = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value];
      return { ...a, [key]: next };
    });
  }

  function canAdvance() {
    if (step === 0) return Boolean(answers.goal);
    if (!current) return true;
    if (current.type === "text") return true;
    if (current.type === "multi") return (answers[current.key] || []).length > 0;
    return Boolean(answers[current.key]);
  }

  async function generateProgramme() {
    setLoading(true);
    setError(null);
    const userPrompt = `Athlete answers:
- Goal: ${answers.goal}
- Current level: ${answers.level}
- Training days per week: ${answers.days}
- Equipment: ${(answers.equipment || []).join(", ") || "not specified"}
- Injuries/limitations: ${answers.limitations || "none mentioned"}

Build their personalised programme now.`;

    try {
      const response = await fetch(import.meta.env.VITE_API_URL || "/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystemPrompt(answers.goal, exerciseListString),
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      onResult(parsed, answers.goal);
    } catch (e) {
      setError("Couldn't build your programme just then. Give it another go.");
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (step === totalSteps - 1) {
      generateProgramme();
    } else {
      setStep((s) => s + 1);
    }
  }

  const unlockGoal = GOALS.find((g) => g.id === unlockTarget);

  return (
    <div className="w-full max-w-md mx-auto bg-black/20 border border-white/10 rounded-md p-6">
      {/* GOAL STEP */}
      {step === 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-brand-orange text-sm tracking-widest uppercase">
              Set 1/{totalSteps}
            </span>
            <div className="flex-1 h-[3px] bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-orange transition-all duration-300"
                style={{ width: `${(1 / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="font-display font-bold text-2xl leading-tight">
            What's the main thing you're chasing right now?
          </h2>

          <div className="space-y-2">
            {GOALS.map((goal) => {
              const locked = goal.tier === "paid" && !isUnlocked(goal.id);
              const selected = answers.goal === goal.label;
              return (
                <div key={goal.id}>
                  <button
                    onClick={() => selectGoal(goal)}
                    className={`w-full text-left px-4 py-3 rounded-sm border transition-colors font-body text-sm flex items-center justify-between gap-3 ${
                      selected
                        ? "border-brand-orange bg-brand-orange/10 text-white"
                        : "border-white/15 text-brand-light hover:border-white/40"
                    }`}
                  >
                    <span>{goal.label}</span>
                    {locked && (
                      <span className="flex items-center gap-1.5 text-brand-orange text-xs font-display font-bold uppercase tracking-wide shrink-0">
                        <Lock className="w-3.5 h-3.5" /> {goal.price}
                      </span>
                    )}
                    {!locked && goal.tier === "paid" && (
                      <span className="flex items-center gap-1.5 text-brand-orange text-xs shrink-0">
                        <Check className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    )}
                  </button>

                  {unlockTarget === goal.id && (
                    <div className="mt-2 p-4 border border-brand-orange/40 bg-brand-orange/5 rounded-sm space-y-3">
                      <p className="text-sm text-brand-light font-body">
                        This goal unlocks with <span className="text-white">{goal.product}</span> (
                        {goal.price}). Already got a code? Enter it below.
                      </p>
                      <div className="flex gap-2">
                        <input
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value)}
                          placeholder="Access code"
                          className="flex-1 bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-3 py-2 text-sm text-white font-body"
                        />
                        <button
                          onClick={() => submitCode(goal)}
                          disabled={!codeInput.trim() || codeChecking}
                          className="bg-brand-orange hover:brightness-110 disabled:bg-white/10 disabled:text-white/30 transition-all text-brand-dark font-display font-bold uppercase text-xs tracking-wide px-4 rounded-sm flex items-center justify-center"
                        >
                          {codeChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock"}
                        </button>
                      </div>
                      {codeError && <p className="text-brand-orange text-xs font-body">{codeError}</p>}
                      <button
                        onClick={() => setUnlockTarget(null)}
                        className="text-brand-light text-xs hover:text-white transition-colors font-body"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={next}
            disabled={!canAdvance()}
            className="w-full bg-brand-orange hover:brightness-110 disabled:bg-white/10 disabled:text-white/30 transition-all text-brand-dark font-display font-bold uppercase tracking-wide py-3 rounded-sm flex items-center justify-center gap-2"
          >
            Next <ChevronRight className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
      )}

      {/* QUESTIONS */}
      {step >= 1 && step <= QUESTIONS.length && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-brand-orange text-sm tracking-widest uppercase">
              Set {step + 1}/{totalSteps}
            </span>
            <div className="flex-1 h-[3px] bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-orange transition-all duration-300"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="font-display font-bold text-2xl leading-tight">{current.label}</h2>

          {current.type === "single" && (
            <div className="space-y-2">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => selectSingle(current.key, opt)}
                  className={`w-full text-left px-4 py-3 rounded-sm border transition-colors font-body text-sm ${
                    answers[current.key] === opt
                      ? "border-brand-orange bg-brand-orange/10 text-white"
                      : "border-white/15 text-brand-light hover:border-white/40"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {current.type === "multi" && (
            <div className="flex flex-wrap gap-2">
              {current.options.map((opt) => {
                const active = (answers[current.key] || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleMulti(current.key, opt)}
                    className={`px-3 py-2 rounded-sm border text-sm font-body transition-colors ${
                      active
                        ? "border-brand-orange bg-brand-orange/10 text-white"
                        : "border-white/15 text-brand-light hover:border-white/40"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {current.type === "text" && (
            <textarea
              value={answers.limitations || ""}
              onChange={(e) => setAnswers((a) => ({ ...a, limitations: e.target.value }))}
              placeholder="e.g. dodgy wrist on straight-arm work — leave blank if none"
              className="w-full bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-4 py-3 text-sm text-white font-body resize-none h-24"
            />
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-3 rounded-sm border border-white/15 text-brand-light hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              disabled={!canAdvance() || loading}
              className="flex-1 bg-brand-orange hover:brightness-110 disabled:bg-white/10 disabled:text-white/30 transition-all text-brand-dark font-display font-bold uppercase tracking-wide py-3 rounded-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : step === totalSteps - 1 ? (
                "Build my programme"
              ) : (
                <>
                  Next <ChevronRight className="w-4 h-4" strokeWidth={3} />
                </>
              )}
            </button>
          </div>

          {error && <p className="text-brand-orange text-sm font-body">{error}</p>}
        </div>
      )}
    </div>
  );
}
