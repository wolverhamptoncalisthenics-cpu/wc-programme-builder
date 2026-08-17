import { useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, LogIn, LogOut, LayoutDashboard, User } from "lucide-react";
import logo from "../assets/logo-dark-bg.svg";
import { useAuth } from "../context/AuthContext";
import AuthForm from "./AuthForm";
import CoachDashboard from "./CoachDashboard";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Build my plan", href: "#app" },
  { label: "FAQ", href: "#faq" },
];

export default function Nav({ onGoHome, onOpenAccount }) {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { user, isCoach, signOut } = useAuth();

  function handleNavClick() {
    onGoHome?.();
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#top" onClick={handleNavClick} className="flex items-center gap-2">
          <img src={logo} alt="Wolverhampton Calisthenics" className="h-12" />
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={handleNavClick}
              className="text-sm font-body text-brand-light hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          {user && (
            <button
              onClick={() => onOpenAccount?.()}
              className="text-sm font-body text-brand-light hover:text-white transition-colors flex items-center gap-1.5"
            >
              <User className="w-4 h-4" /> Your account
            </button>
          )}
          {isCoach && (
            <button
              onClick={() => setShowDashboard(true)}
              className="text-sm font-body text-brand-orange hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" /> Coach dashboard
            </button>
          )}
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
              onClick={handleNavClick}
              className="text-sm font-body text-brand-light hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          {user && (
            <button
              onClick={() => {
                onOpenAccount?.();
                setOpen(false);
              }}
              className="text-sm font-body text-brand-light hover:text-white transition-colors flex items-center gap-1.5"
            >
              <User className="w-4 h-4" /> Your account
            </button>
          )}
          {isCoach && (
            <button
              onClick={() => {
                setShowDashboard(true);
                setOpen(false);
              }}
              className="text-sm font-body text-brand-orange hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" /> Coach dashboard
            </button>
          )}
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

      {/* Rendered via portal straight into <body>, so it isn't trapped
          inside this sticky header's positioning context — that trap
          was why the popup was rendering as a tiny box under the nav
          instead of centered over the whole page. */}
      {showLogin &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] bg-black/70 flex items-start sm:items-center justify-center px-4 py-8 overflow-y-auto"
            onClick={() => setShowLogin(false)}
          >
            <div
              className="relative w-full max-w-sm bg-brand-dark border border-white/15 rounded-md p-6 my-auto text-white font-body"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLogin(false)}
                aria-label="Close"
                className="absolute top-4 right-4 text-brand-light hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <AuthForm onAuthed={() => setShowLogin(false)} plain />
            </div>
          </div>,
          document.body
        )}

      {showDashboard &&
        createPortal(<CoachDashboard onClose={() => setShowDashboard(false)} />, document.body)}
    </header>
  );
}
