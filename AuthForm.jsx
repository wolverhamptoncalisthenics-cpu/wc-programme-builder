import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ onAuthed }) {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState("signup"); // "signup" | "login"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

  return (
    <div className="border border-white/15 rounded-sm p-5 space-y-4">
      <div>
        <h3 className="font-display font-bold text-lg">
          {mode === "signup" ? "Create your account" : "Log in"}
        </h3>
        <p className="text-brand-light text-xs font-body mt-1">
          {mode === "signup"
            ? "So we know where to send your programme once it's ready."
            : "Welcome back."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-3 py-2 text-sm text-white font-body"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-3 py-2 text-sm text-white font-body"
        />

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
          ) : (
            "Log in & continue"
          )}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === "signup" ? "login" : "signup");
          setError(null);
        }}
        className="text-brand-light text-xs hover:text-white transition-colors font-body"
      >
        {mode === "signup" ? "Already got an account? Log in" : "New here? Create an account"}
      </button>
    </div>
  );
}
