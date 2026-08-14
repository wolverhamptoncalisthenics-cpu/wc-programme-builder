import { useState, useEffect } from "react";
import { Loader2, Clock, LogOut } from "lucide-react";
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
import { AuthProvider, useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabase";

function PendingCoach({ goal }) {
  return (
    <div className="w-full max-w-md mx-auto bg-black/20 border border-white/10 rounded-md p-6 text-center space-y-3">
      <Clock className="w-8 h-8 text-brand-orange mx-auto" />
      <h3 className="font-display font-bold text-xl uppercase">Your coach is on it</h3>
      <p className="text-brand-light text-sm font-body leading-relaxed">
        <span className="text-white">{goal}</span> is a coach-built programme. Tom or Tim will put
        yours together and it'll show up here once it's ready — no need to do anything else.
      </p>
    </div>
  );
}

function AppInner() {
  const { user, loading, signOut } = useAuth();
  const [submissionResult, setSubmissionResult] = useState(null); // { status, plan, goal }
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [builderKey, setBuilderKey] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setCheckingExisting(false);
      return;
    }

    let cancelled = false;
    async function loadLatest() {
      setCheckingExisting(true);
      const { data } = await supabase
        .from("submissions")
        .select("*, template_programmes(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (data) {
        if (data.status === "assigned" && data.template_programmes) {
          setSubmissionResult({
            status: "assigned",
            goal: data.goal_label,
            plan: {
              summary: data.template_programmes.summary,
              focus: data.template_programmes.focus,
              quickPlan: data.template_programmes.quick_plan,
              progression: data.template_programmes.progression,
            },
          });
        } else if (data.status === "ready" && data.manual_programme) {
          setSubmissionResult({
            status: "ready",
            goal: data.goal_label,
            plan: data.manual_programme,
          });
        } else {
          setSubmissionResult({ status: "pending_coach", goal: data.goal_label, plan: null });
        }
      }
      setCheckingExisting(false);
    }
    loadLatest();
    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  function handleSubmitted(result) {
    setSubmissionResult(result);
  }

  function handleRestart() {
    setSubmissionResult(null);
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
          {user && (
            <button
              onClick={signOut}
              className="mt-3 text-brand-light hover:text-white text-xs font-body flex items-center gap-1 mx-auto transition-colors"
            >
              <LogOut className="w-3 h-3" /> Log out ({user.email})
            </button>
          )}
        </div>

        {checkingExisting ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
          </div>
        ) : submissionResult ? (
          submissionResult.plan ? (
            <ProgrammeResult
              result={submissionResult.plan}
              goal={submissionResult.goal}
              onRestart={handleRestart}
            />
          ) : (
            <div className="space-y-4">
              <PendingCoach goal={submissionResult.goal} />
              <button
                onClick={handleRestart}
                className="block mx-auto text-brand-light hover:text-white text-xs font-body transition-colors"
              >
                Submit a different goal instead
              </button>
            </div>
          )
        ) : (
          <ProgrammeBuilder key={builderKey} onSubmitted={handleSubmitted} />
        )}
      </section>

      {user && (
        <section className="w-full px-4 py-20">
          <div className="max-w-md mx-auto text-center mb-10">
            <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
              Stay on track
            </span>
            <h2 className="font-display font-extrabold uppercase text-3xl leading-tight mt-2">
              Your progress
            </h2>
          </div>
          <ProgressTracker plan={submissionResult?.plan ? submissionResult.plan.quickPlan : null} />
        </section>
      )}

      <Testimonials />
      <Team />

      <div id="faq">
        <FAQ />
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
