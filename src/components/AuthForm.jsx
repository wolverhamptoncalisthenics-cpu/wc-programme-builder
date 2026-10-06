import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ onAuthed, plain = false }) {
  const { signUp, signIn, sendPasswordReset } = useAuth();
  const [mode, setMode] = useState("signup"); // "signup" | "login" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "forgot") {
      const { error: resetError } = await sendPasswordReset(email.trim());
      setLoading(false);
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setResetSent(true);
      return;
    }

    const action = mode === "signup" ? signUp : signIn;
    const { data, error: authError } = await action(email.trim(), password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (mode === "signup" && !data.session) {
      // Email confirmation is on by default in Supabase — let them know.
      setError("Check your email to confirm your account, then log in below.");
      setMode("login");
      setLoading(false);
      return;
    }

    setLoading(false);
    onAuthed?.();
  }

  function switchMode(newMode) {
    setMode(newMode);
    setError(null);
    setResetSent(false);
  }

  const heading =
    mode === "signup" ? "Create your account" : mode === "login" ? "Log in" : "Reset your password";

  const subheading =
    mode === "signup"
      ? "So we know where to send your programme once it's ready."
      : mode === "login"
      ? "Welcome back."
      : "Enter your email and we'll send you a link to set a new password.";

  return (
    <div className={plain ? "space-y-4" : "border border-white/15 rounded-sm p-5 space-y-4"}>
      <div className="pr-6">
        <h3 className="font-display font-bold text-lg">{heading}</h3>
        <p className="text-brand-light text-xs font-body mt-1">{subheading}</p>
      </div>

      {resetSent ? (
        <p className="text-brand-light text-sm font-body">
          Check your email for a link to set a new password.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-3 py-2 text-sm text-white font-body"
          />

          {mode !== "forgot" && (
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-3 py-2 text-sm text-white font-body"
            />
          )}

          {error && <p className="text-brand-orange text-xs font-body">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange hover:brightness-110 disabled:bg-white/10 transition-all text-brand-dark font-display font-bold uppercase tracking-wide py-2.5 rounded-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "signup" ? (
              "Create account & continue"
            ) : mode === "login" ? (
              "Log in & continue"
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-1.5">
        {mode !== "forgot" && (
          <button
            onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
            className="text-brand-light text-xs hover:text-white transition-colors font-body text-left"
          >
            {mode === "signup" ? "Already got an account? Log in" : "New here? Create an account"}
          </button>
        )}
        {mode === "login" && (
          <button
            onClick={() => switchMode("forgot")}
            className="text-brand-light text-xs hover:text-white transition-colors font-body text-left"
          >
            Forgot your password?
          </button>
        )}
        {mode === "forgot" && (
          <button
            onClick={() => switchMode("login")}
            className="text-brand-light text-xs hover:text-white transition-colors font-body text-left"
          >
            Back to log in
          </button>
        )}
      </div>
    </div>
  );
}
