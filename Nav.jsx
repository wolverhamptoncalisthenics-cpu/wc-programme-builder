import { useState } from "react";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import logo from "../assets/logo-dark-bg.svg";
import { useAuth } from "../context/AuthContext";
import AuthForm from "./AuthForm";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Build my plan", href: "#app" },
  { label: "FAQ", href: "#faq" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <img src={logo} alt="Wolverhampton Calisthenics" className="h-9" />
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-body text-brand-light hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          {user ? (
            <button
              onClick={signOut}
              className="text-sm font-body text-brand-light hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm font-display font-bold uppercase tracking-wide text-brand-dark bg-brand-orange hover:brightness-110 transition-all px-4 py-1.5 rounded-sm flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" /> Log in
            </button>
          )}
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-3">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-body text-brand-light hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          {user ? (
            <button
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="text-sm font-body text-brand-light hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          ) : (
            <button
              onClick={() => {
                setShowLogin(true);
                setOpen(false);
              }}
              className="text-sm font-display font-bold uppercase tracking-wide text-brand-orange flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" /> Log in
            </button>
          )}
        </nav>
      )}

      {showLogin && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center px-4"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="w-full max-w-sm bg-brand-dark border border-white/15 rounded-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <AuthForm onAuthed={() => setShowLogin(false)} />
            <button
              onClick={() => setShowLogin(false)}
              className="w-full text-center text-brand-light hover:text-white text-xs font-body mt-4 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
