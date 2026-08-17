import { Loader2, Clock } from "lucide-react";
import ProgrammeResult from "./ProgrammeResult";
import ProgressTracker from "./ProgressTracker";

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

export default function AccountPage({ submissionResult, checkingExisting, onRestart }) {
  return (
    <div className="min-h-screen w-full bg-brand-dark text-white font-body px-4 py-16">
      <div className="text-center mb-10">
        <span className="font-display font-bold text-brand-orange text-xs tracking-widest uppercase">
          Your account
        </span>
        <h1 className="font-display font-extrabold uppercase text-3xl leading-tight mt-2">
          Your programme
        </h1>
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
            onRestart={onRestart}
          />
        ) : (
          <div className="space-y-4">
            <PendingCoach goal={submissionResult.goal} />
            <button
              onClick={onRestart}
              className="block mx-auto text-brand-light hover:text-white text-xs font-body transition-colors"
            >
              Submit a different goal instead
            </button>
          </div>
        )
      ) : (
        <div className="w-full max-w-md mx-auto bg-black/20 border border-white/10 rounded-md p-6 text-center space-y-3">
          <p className="text-brand-light text-sm font-body">
            You haven't built a programme yet.
          </p>
          <a
            href="#app"
            onClick={onRestart}
            className="inline-block bg-brand-orange hover:brightness-110 transition-all text-brand-dark font-display font-bold uppercase tracking-wide text-sm px-5 py-2.5 rounded-sm"
          >
            Build one now
          </a>
        </div>
      )}

      <section className="w-full py-16">
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
    </div>
  );
}
