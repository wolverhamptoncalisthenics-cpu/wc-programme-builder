import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCoach, setIsCoach] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Supabase fires a "PASSWORD_RECOVERY" event when someone lands on
    // the site via the link from a password-reset email. Catching it
    // here lets the app show a "set new password" screen instead of
    // treating them as a normal logged-in visit.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") {
        setPasswordRecovery(true);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setIsCoach(false);
      return;
    }
    supabase
      .from("coaches")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setIsCoach(Boolean(data)));
  }, [user]);

  async function signUp(email, password) {
    return supabase.auth.signUp({ email, password });
  }

  async function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  async function signOut() {
    return supabase.auth.signOut();
  }

  async function sendPasswordReset(email) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
  }

  async function updatePassword(newPassword) {
    return supabase.auth.updateUser({ password: newPassword });
  }

  function clearPasswordRecovery() {
    setPasswordRecovery(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isCoach,
        passwordRecovery,
        signUp,
        signIn,
        signOut,
        sendPasswordReset,
        updatePassword,
        clearPasswordRecovery,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
