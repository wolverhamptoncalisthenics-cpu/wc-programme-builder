import { useState, useEffect } from "react";
import { ChevronRight, Loader2, ArrowLeft, Lock, Check } from "lucide-react";
import { GOALS } from "../data/programme";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import AuthForm from "./AuthForm";

const QUESTIONS = [
  {
    key: "level",
    label: "Where are you at currently?",
    type: "single",
    options: [
      "Just starting out",
      "Comfortable with basics, building strength",
      "Training consistently, chasing skills",
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

const UNLOCKED_STORAGE_KEY = "wc-unlocked-goals";

export default function ProgrammeBuilder({ onSubmitted }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0); // 0 = goal, 1..N = questions, N+1 = auth/submit
  const [answers, setAnswers] = useState({ equipment: [] });
  const [submitting, setSubmitting] = useState(false);
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
  const atSubmitStep = step === totalSteps;

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
    setAnswers((a) => ({ ...a, goal: goal.label, goalId: goal.id, tier: goal.tier }));
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
        setAnswers((a) => ({ ...a, goal: goal.label, goalId: goal.id, tier: goal.tier }));
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

  async function submitQuestionnaire() {
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("submissions").insert({
        user_id: user.id,
        goal_id: answers.goalId,
        goal_label: answers.goal,
        level: answers.level,
        days: answers.days,
        equipment: answers.equipment,
        limitations: answers.limitations || null,
        status: "pending_coach",
        assigned_template_id: null,
      });

      if (insertError) throw insertError;

      // Fire-and-forget: don't block or fail the submission if the
      // email fails to send for some reason, that's a lesser concern
      // than the submission itself failing to save.
      fetch(import.meta.env.VITE_NOTIFY_URL || "/api/notify-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submitterEmail: user.email,
          goalLabel: answers.goal,
          level: answers.level,
          days: answers.days,
          equipment: answers.equipment,
          limitations: answers.limitations || null,
        }),
      }).catch(() => {
        // Silently ignore — the submission itself already succeeded.
      });

      onSubmitted({
        status: "pending_coach",
        plan: null,
        goal: answers.goal,
      });
    } catch (e) {
      setError("Something went wrong saving that. Give it another go.");
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (step === totalSteps - 1) {
      setStep(totalSteps); // move to auth/submit step
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
              disabled={!canAdvance()}
              className="flex-1 bg-brand-orange hover:brightness-110 disabled:bg-white/10 disabled:text-white/30 transition-all text-brand-dark font-display font-bold uppercase tracking-wide py-3 rounded-sm flex items-center justify-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* AUTH + SUBMIT STEP */}
      {atSubmitStep && (
        <div className="space-y-6">
          <div>
            <span className="font-display font-bold text-brand-orange text-sm tracking-widest uppercase">
              Almost there
            </span>
            <h2 className="font-display font-bold text-2xl leading-tight mt-1">
              {user ? "Ready to submit" : "Create your account to get your programme"}
            </h2>
          </div>

          {!user && <AuthForm onAuthed={submitQuestionnaire} />}

          {user && (
            <button
              onClick={submitQuestionnaire}
              disabled={submitting}
              className="w-full bg-brand-orange hover:brightness-110 disabled:bg-white/10 transition-all text-brand-dark font-display font-bold uppercase tracking-wide py-3 rounded-sm flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit & get my programme"}
            </button>
          )}

          {error && <p className="text-brand-orange text-sm font-body">{error}</p>}

          <button
            onClick={() => setStep(QUESTIONS.length)}
            className="text-brand-light text-xs hover:text-white transition-colors font-body flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Back to questions
          </button>
        </div>
      )}
    </div>
  );
}
