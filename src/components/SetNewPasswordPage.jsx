import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SetNewPasswordPage() {
  const { updatePassword, clearPasswordRecovery } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await updatePassword(password);
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
  }

  return (
    <div className="min-h-screen w-full bg-brand-dark text-white font-body px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-sm border border-white/15 rounded-md p-6">
        {done ? (
          <div className="text-center space-y-4">
            <Check className="w-8 h-8 text-brand-orange mx-auto" />
            <h1 className="font-display font-bold text-lg">Password updated</h1>
            <p className="text-brand-light text-sm font-body">
              You're all set, use your new password next time you log in.
            </p>
            <button
              onClick={clearPasswordRecovery}
              className="w-full bg-brand-orange hover:brightness-110 transition-all text-brand-dark font-display font-bold uppercase tracking-wide py-2.5 rounded-sm"
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-display font-bold text-lg">Set a new password</h1>
            <p className="text-brand-light text-xs font-body mt-1 mb-4">
              Choose a new password for your account.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="w-full bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-3 py-2 text-sm text-white font-body"
              />
              <input
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-3 py-2 text-sm text-white font-body"
              />
              {error && <p className="text-brand-orange text-xs font-body">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-orange hover:brightness-110 disabled:bg-white/10 transition-all text-brand-dark font-display font-bold uppercase tracking-wide py-2.5 rounded-sm flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
