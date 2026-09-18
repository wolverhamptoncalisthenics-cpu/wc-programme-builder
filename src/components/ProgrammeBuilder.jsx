import { useState } from "react";
import { ChevronRight, Loader2, ArrowLeft, Lock, Check } from "lucide-react";
import { GOALS } from "../data/programme";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

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

export default function ProgrammeBuilder({ onSubmitted, unlockedGoals }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0); // 0 = goal, 1..N = questions, N+1 = submit
  const [answers, setAnswers] = useState({ equipment: [] });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [payingGoalId, setPayingGoalId] = useState(null);

  const totalSteps = 1 + QUESTIONS.length;
  const current = step >= 1 && step <= QUESTIONS.length ? QUESTIONS[step - 1] : null;

  function isUnlocked(goalId) {
    return unlockedGoals.includes(goalId);
  }

  function selectGoal(goal) {
    if (goal.tier === "paid" && !isUnlocked(goal.id)) return; // pay button handles this instead
    setAnswers((a) => ({ ...a, goal: goal.label, goalId: goal.id, tier: goal.tier }));
  }

  async function startCheckout(goal) {
    setPayingGoalId(goal.id);
    setError(null);
    try {
      const response = await fetch(import.meta.env.VITE_CHECKOUT_URL || "/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId: goal.id, userId: user.id, userEmail: user.email }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // off to Stripe's hosted checkout page
      } else {
        setError("Couldn't start checkout just now. Try again in a moment.");
        setPayingGoalId(null);
      }
    } catch (e) {
      setError("Couldn't start checkout just now. Try again in a moment.");
      setPayingGoalId(null);
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

  async function insertSubmission() {
    return supabase.from("submissions").insert({
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
  }

  async function submitQuestionnaire() {
    setSubmitting(true);
    setError(null);

    try {
      let { error: insertError } = await insertSubmission();

      if (insertError) {
        // A session-timing hiccup can occasionally hit this request
        // right after a fresh login. Refresh the session and try once
        // more before giving up.
        await supabase.auth.refreshSession();
        ({ error: insertError } = await insertSubmission());
      }

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
      // Before alarming the person, check whether the submission
      // actually made it in despite the error — this can happen if the
      // write itself succeeded but the confirmation response got lost
      // to a brief network hiccup, rather than the save genuinely
      // failing.
      const { data: justSaved } = await supabase
        .from("submissions")
        .select("id")
        .eq("user_id", user.id)
        .eq("goal_id", answers.goalId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (justSaved) {
        onSubmitted({ status: "pending_coach", plan: null, goal: answers.goal });
      } else {
        setError("Something went wrong saving that. Give it another go.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (step === totalSteps - 1) {
      submitQuestionnaire();
    } else {
      setStep((s) => s + 1);
    }
  }

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
              const paying = payingGoalId === goal.id;
              return (
                <div key={goal.id}>
                  <button
                    onClick={() => selectGoal(goal)}
                    disabled={locked}
                    className={`w-full text-left px-4 py-3 rounded-sm border transition-colors font-body text-sm flex items-center justify-between gap-3 ${
                      selected
                        ? "border-brand-orange bg-brand-orange/10 text-white"
                        : locked
                        ? "border-white/10 text-brand-light/70"
                        : "border-white/15 text-brand-light hover:border-white/40"
                    }`}
                  >
                    <span>{goal.label}</span>
                    {!locked && goal.tier === "paid" && (
                      <span className="flex items-center gap-1.5 text-brand-orange text-xs shrink-0">
                        <Check className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    )}
                  </button>

                  {locked && (
                    <button
                      onClick={() => startCheckout(goal)}
                      disabled={paying}
                      className="mt-2 w-full flex items-center justify-center gap-2 border border-brand-orange/40 bg-brand-orange/5 hover:bg-brand-orange/10 transition-colors rounded-sm px-4 py-2.5 text-sm font-body text-brand-light"
                    >
                      {paying ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-brand-orange" />
                          Pay {goal.price} to unlock {goal.product} (12 weeks of programming)
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {error && <p className="text-brand-orange text-sm font-body">{error}</p>}

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
              placeholder="e.g. dodgy wrist on straight-arm work, leave blank if none"
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
              disabled={!canAdvance() || submitting}
              className="flex-1 bg-brand-orange hover:brightness-110 disabled:bg-white/10 disabled:text-white/30 transition-all text-brand-dark font-display font-bold uppercase tracking-wide py-3 rounded-sm flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : step === totalSteps - 1 ? (
                "Submit & get my programme"
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
