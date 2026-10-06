import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Target, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function SessionCard({ day, submissionId, userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("session_completions")
      .select("*")
      .eq("submission_id", submissionId)
      .eq("day_label", day.day)
      .order("completed_at", { ascending: false });
    setHistory(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, day.day]);

  async function markComplete() {
    setSaving(true);
    await supabase.from("session_completions").insert({
      user_id: userId,
      submission_id: submissionId,
      day_label: day.day,
      notes: notes.trim() || null,
    });
    setNotes("");
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function removeEntry(id) {
    await supabase.from("session_completions").delete().eq("id", id);
    load();
  }

  return (
    <div className="border border-white/10 rounded-sm p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <span className="font-display font-bold uppercase text-brand-orange text-sm tracking-wide">
            {day.day}
          </span>
          <p className="text-brand-light text-xs font-body">{day.focus}</p>
        </div>
        <span className="text-brand-light text-xs font-body shrink-0">
          {loading ? "…" : `${history.length} logged`}
        </span>
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 transition-colors rounded-sm py-2 text-sm font-body text-brand-orange"
        >
          <CheckCircle2 className="w-4 h-4" /> Mark this session complete
        </button>
      ) : (
        <div className="space-y-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes on how it went? (optional)"
            className="w-full bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-3 py-2 text-xs text-white font-body resize-none h-16"
          />
          <div className="flex gap-2">
            <button
              onClick={markComplete}
              disabled={saving}
              className="flex-1 bg-brand-orange hover:brightness-110 disabled:bg-white/10 transition-all text-brand-dark font-display font-bold uppercase text-xs tracking-wide py-2 rounded-sm"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 border border-white/15 text-brand-light hover:text-white text-xs font-body rounded-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="text-brand-light hover:text-white text-xs font-body flex items-center gap-1 transition-colors"
          >
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showHistory ? "Hide history" : "Show history"}
          </button>
          {showHistory && (
            <ul className="mt-2 space-y-1.5">
              {history.map((h) => (
                <li
                  key={h.id}
                  className="flex items-start justify-between gap-2 border-t border-white/10 pt-1.5 text-xs font-body"
                >
                  <div>
                    <p className="text-brand-light">
                      {new Date(h.completed_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {h.notes && <p className="text-white/80 mt-0.5">{h.notes}</p>}
                  </div>
                  <button
                    onClick={() => removeEntry(h.id)}
                    className="text-brand-light hover:text-brand-orange shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function Goals({ userId }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState("");
  const [adding, setAdding] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [completionNotes, setCompletionNotes] = useState("");

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setGoals(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function addGoal() {
    if (!newGoal.trim()) return;
    setAdding(true);
    await supabase.from("goals").insert({ user_id: userId, text: newGoal.trim(), source: "client" });
    setNewGoal("");
    setAdding(false);
    load();
  }

  async function completeGoal(id) {
    await supabase
      .from("goals")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        completion_notes: completionNotes.trim() || null,
      })
      .eq("id", id);
    setCompletingId(null);
    setCompletionNotes("");
    load();
  }

  const active = goals.filter((g) => !g.completed);
  const completed = goals.filter((g) => g.completed);

  return (
    <div className="bg-black/20 border border-white/10 rounded-md p-6">
      <h3 className="font-display font-bold text-xl uppercase mb-1 flex items-center gap-2">
        <Target className="w-5 h-5 text-brand-orange" /> Goals
      </h3>
      <p className="text-brand-light text-xs font-body mb-4">
        Set your own goals, or see the ones your coach has set for you.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addGoal()}
          placeholder="e.g. First 10 second wall handstand"
          className="flex-1 bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-3 py-2 text-sm text-white font-body"
        />
        <button
          onClick={addGoal}
          disabled={adding || !newGoal.trim()}
          className="bg-brand-orange hover:brightness-110 disabled:bg-white/10 disabled:text-white/30 transition-all text-brand-dark rounded-sm px-3 flex items-center justify-center shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <p className="text-brand-light text-sm font-body">Loading...</p>
      ) : (
        <>
          {active.length === 0 && completed.length === 0 ? (
            <p className="text-brand-light text-sm font-body">No goals yet.</p>
          ) : (
            <ul className="space-y-2">
              {active.map((g) => (
                <li key={g.id} className="border border-white/10 rounded-sm px-3 py-2">
                  <button
                    onClick={() => setCompletingId(completingId === g.id ? null : g.id)}
                    className="w-full flex items-center gap-2 text-left text-sm font-body"
                  >
                    <Circle className="w-4 h-4 text-brand-light/50 shrink-0" />
                    <span className="text-white/90 flex-1">{g.text}</span>
                    <span className="text-brand-light/50 text-xs shrink-0">
                      {g.source === "coach" ? "from your coach" : ""}
                    </span>
                  </button>
                  {completingId === g.id && (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={completionNotes}
                        onChange={(e) => setCompletionNotes(e.target.value)}
                        placeholder="Any notes on hitting this goal? (optional)"
                        className="w-full bg-white/5 border border-white/15 focus:border-brand-orange outline-none rounded-sm px-3 py-2 text-xs text-white font-body resize-none h-16"
                      />
                      <button
                        onClick={() => completeGoal(g.id)}
                        className="w-full bg-brand-orange hover:brightness-110 transition-all text-brand-dark font-display font-bold uppercase text-xs tracking-wide py-2 rounded-sm"
                      >
                        Mark as achieved
                      </button>
                    </div>
                  )}
                </li>
              ))}

              {completed.map((g) => (
                <li
                  key={g.id}
                  className="border border-white/10 rounded-sm px-3 py-2 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-brand-light line-through font-body">{g.text}</p>
                    <p className="text-brand-light/60 text-xs font-body">
                      Achieved{" "}
                      {new Date(g.completed_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {g.completion_notes && (
                      <p className="text-white/70 text-xs font-body mt-0.5">{g.completion_notes}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default function ProgressTracker({ plan, submissionId }) {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="bg-black/20 border border-white/10 rounded-md p-6">
        <h3 className="font-display font-bold text-xl uppercase mb-1">Your sessions</h3>
        {!plan || !submissionId ? (
          <p className="text-brand-light text-sm font-body">
            Build your programme above first, then come back here to tick off sessions as you go.
          </p>
        ) : (
          <div className="space-y-4 mt-4">
            {plan.days.map((d, i) => (
              <SessionCard key={i} day={d} submissionId={submissionId} userId={user.id} />
            ))}
          </div>
        )}
      </div>

      {user && <Goals userId={user.id} />}
    </div>
  );
}
