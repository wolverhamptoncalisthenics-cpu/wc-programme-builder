import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import ProgrammeBuilder from "./components/ProgrammeBuilder";
import Testimonials from "./components/Testimonials";
import Team from "./components/Team";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import AccountPage from "./components/AccountPage";
import ContactPage from "./components/ContactPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import SetNewPasswordPage from "./components/SetNewPasswordPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabase";

function AppInner() {
  const { user, loading, passwordRecovery } = useAuth();
  const [submissionResult, setSubmissionResult] = useState(null); // { status, plan, goal }
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [builderKey, setBuilderKey] = useState(0);
  const [view, setView] = useState("site"); // "site" | "account"

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setCheckingExisting(false);
      return;
    }

    let cancelled = false;
    async function loadLatest() {
      setCheckingExisting(true);
      const { data, error } = await supabase
        .from("submissions")
        .select("*, template_programmes(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        // A 401 here usually means the session token wasn't valid yet
        // at the moment of the request (can happen right after signup
        // or email confirmation). Refreshing the session and retrying
        // once is a reasonable, low-risk recovery rather than just
        // leaving the person on a stuck loading state.
        const { data: refreshed } = await supabase.auth.refreshSession();
        if (refreshed?.session) {
          const retry = await supabase
            .from("submissions")
            .select("*, template_programmes(*)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (!cancelled && retry.data) {
            applyResult(retry.data);
          }
        }
        setCheckingExisting(false);
        return;
      }

      if (data) {
        applyResult(data);
      }
      setCheckingExisting(false);
    }

    function applyResult(data) {
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

    loadLatest();
    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  function handleSubmitted(result) {
    setSubmissionResult(result);
    setView("account"); // take them straight to their account to see the status
  }

  function handleRestart() {
    setSubmissionResult(null);
    setBuilderKey((k) => k + 1);
    setView("site");
  }

  if (passwordRecovery) {
    return <SetNewPasswordPage />;
  }

  if (view === "account" && user) {
    return (
      <div className="min-h-screen w-full bg-brand-dark">
        <Nav onGoHome={() => setView("site")} onOpenAccount={() => setView("account")} />
        <AccountPage
          submissionResult={submissionResult}
          checkingExisting={checkingExisting}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  if (view === "contact") {
    return (
      <div className="min-h-screen w-full bg-brand-dark">
        <Nav onGoHome={() => setView("site")} onOpenAccount={() => setView("account")} />
        <ContactPage />
      </div>
    );
  }

  if (view === "privacy") {
    return (
      <div className="min-h-screen w-full bg-brand-dark">
        <Nav onGoHome={() => setView("site")} onOpenAccount={() => setView("account")} />
        <PrivacyPolicyPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-brand-dark text-white font-body">
      <Nav onGoHome={() => setView("site")} onOpenAccount={() => setView("account")} />
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

        <ProgrammeBuilder key={builderKey} onSubmitted={handleSubmitted} />
      </section>

      <Testimonials />
      <Team />

      <div id="faq">
        <FAQ />
      </div>

      <Footer onOpenContact={() => setView("contact")} onOpenPrivacy={() => setView("privacy")} />
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
