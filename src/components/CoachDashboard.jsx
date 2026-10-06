import { useState, useEffect } from "react";
import { Loader2, X, Plus, Trash2, Check, Clock, Target } from "lucide-react";
import { supabase } from "../lib/supabase";
import { fetchExerciseNames, addExerciseName } from "../lib/exercises";

function emptyExercise(exerciseNames) {
  return { order: "", name: exerciseNames[0] || "", sets: "", reps: "", tempo: "", notes: "", videoUrl: "" };
}

function emptyDay(exerciseNames) {
  return { day: "", focus: "", exercises: [emptyExercise(exerciseNames)] };
}

function emptyForm(exerciseNames) {
  return {
    summary: "",
    focus: "",
    days: [emptyDay(exerciseNames)],
  };
}

function ExerciseFields({ list, onChange, exerciseNames }) {
  function update(i, field, value) {
    const next = [...list];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  }
  function remove(i) {
    onChange(list.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...list, emptyExercise(exerciseNames)]);
  }
  return (
    <div className="space-y-3">
      {list.map((ex, i) => (
        <div key={i} className="border border-white/10 rounded-sm p-2 space-y-1.5">
          <div className="flex gap-2">
            <input
              value={ex.order}
              onChange={(e) => update(i, "order", e.target.value)}
              placeholder="A1"
              className="w-14 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
            />
            <select
              value={ex.name}
              onChange={(e) => update(i, "name", e.target.value)}
              className="flex-1 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
            >
              {exerciseNames.map((n) => (
                <option key={n} value={n} style={{ backgroundColor: "#42403F", color: "#ffffff" }}>
                  {n}
                </option>
              ))}
            </select>
            <button onClick={() => remove(i)} className="text-brand-light hover:text-brand-orange shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              value={ex.sets}
              onChange={(e) => update(i, "sets", e.target.value)}
              placeholder="Sets"
              className="flex-1 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
            />
            <input
              value={ex.reps}
              onChange={(e) => update(i, "reps", e.target.value)}
              placeholder="Reps"
              className="flex-1 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
            />
            <input
              value={ex.tempo}
              onChange={(e) => update(i, "tempo", e.target.value)}
              placeholder="Tempo"
              className="flex-1 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
            />
          </div>
          <input
            value={ex.videoUrl || ""}
            onChange={(e) => update(i, "videoUrl", e.target.value)}
            placeholder="YouTube link (optional)"
            className="w-full bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
          />
          <input
            value={ex.notes || ""}
            onChange={(e) => update(i, "notes", e.target.value)}
            placeholder="Notes for this exercise (optional)"
            className="w-full bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
          />
        </div>
      ))}
      <button
        onClick={add}
        className="text-brand-orange text-xs font-body flex items-center gap-1 hover:text-white transition-colors"
      >
        <Plus className="w-3 h-3" /> Add exercise
      </button>
    </div>
  );
}

function DayEditor({ days, onChange, exerciseNames }) {
  function update(i, field, value) {
    const next = [...days];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  }
  return (
    <div className="space-y-4">
      {days.map((d, i) => (
        <div key={i} className="border border-white/10 rounded-sm p-3 space-y-2">
          <div className="flex gap-2">
            <input
              value={d.day}
              onChange={(e) => update(i, "day", e.target.value)}
              placeholder="Day 1"
              className="flex-1 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
            />
            <input
              value={d.focus}
              onChange={(e) => update(i, "focus", e.target.value)}
              placeholder="Session focus"
              className="flex-1 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
            />
            <button
              onClick={() => onChange(days.filter((_, idx) => idx !== i))}
              className="text-brand-light hover:text-brand-orange shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <ExerciseFields
            list={d.exercises}
            onChange={(v) => update(i, "exercises", v)}
            exerciseNames={exerciseNames}
          />
        </div>
      ))}
      <button
        onClick={() => onChange([...days, emptyDay(exerciseNames)])}
        className="text-brand-orange text-xs font-body flex items-center gap-1 hover:text-white transition-colors"
      >
        <Plus className="w-3 h-3" /> Add day
      </button>
    </div>
  );
}

function AddExerciseToLibrary({ onAdded }) {
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  async function handleAdd() {
    if (!name.trim()) return;
    setAdding(true);
    setError(null);
    const { error: insertError } = await addExerciseName(name);
    setAdding(false);
    if (insertError) {
      setError(insertError.message.includes("duplicate") ? "That's already in the list." : "Couldn't add that.");
      return;
    }
    setName("");
    onAdded();
  }

  return (
    <div className="border border-white/10 rounded-sm p-3 space-y-2">
      <span className="text-brand-light text-[10px] uppercase tracking-wide font-display font-bold">
        Add a new exercise to the shared list
      </span>
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="e.g. Front lever hold"
          className="flex-1 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !name.trim()}
          className="bg-brand-orange hover:brightness-110 disabled:bg-white/10 transition-all text-brand-dark rounded-sm px-3 flex items-center justify-center shrink-0"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-brand-orange text-xs font-body">{error}</p>}
    </div>
  );
}

function ClientGoals({ userId }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState("");
  const [adding, setAdding] = useState(false);

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
    await supabase.from("goals").insert({ user_id: userId, text: newGoal.trim(), source: "coach" });
    setNewGoal("");
    setAdding(false);
    load();
  }

  return (
    <div className="border border-white/10 rounded-sm p-3 space-y-2">
      <span className="text-brand-light text-[10px] uppercase tracking-wide font-display font-bold flex items-center gap-1.5">
        <Target className="w-3 h-3" /> This client's goals
      </span>

      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
      ) : goals.length === 0 ? (
        <p className="text-brand-light text-xs font-body">No goals set yet.</p>
      ) : (
        <ul className="space-y-1">
          {goals.map((g) => (
            <li key={g.id} className="text-xs text-white/90 font-body flex items-center gap-2">
              {g.completed ? (
                <Check className="w-3 h-3 text-brand-orange shrink-0" />
              ) : (
                <span className="w-3 h-3 border border-brand-light/40 rounded-sm shrink-0" />
              )}
              <span className={g.completed ? "line-through text-brand-light" : ""}>{g.text}</span>
              <span className="text-brand-light/50">({g.source === "coach" ? "you" : "them"})</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addGoal()}
          placeholder="Add a goal for this client"
          className="flex-1 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
        />
        <button
          onClick={addGoal}
          disabled={adding || !newGoal.trim()}
          className="bg-brand-orange hover:brightness-110 disabled:bg-white/10 transition-all text-brand-dark rounded-sm px-3 flex items-center justify-center shrink-0"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function SubmissionEditor({ submission, onSaved, onCancel, exerciseNames, onExerciseAdded }) {
  const [form, setForm] = useState(
    submission.manual_programme
      ? {
          summary: submission.manual_programme.summary || "",
          focus: submission.manual_programme.focus || "",
          days: submission.manual_programme.quickPlan?.days || [emptyDay(exerciseNames)],
        }
      : emptyForm(exerciseNames)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function save() {
    setSaving(true);
    setError(null);
    const wasAlreadyReady = submission.status === "ready";
    const manual_programme = {
      summary: form.summary,
      focus: form.focus,
      quickPlan: { days: form.days },
    };
    const { error: updateError } = await supabase
      .from("submissions")
      .update({ manual_programme, status: "ready" })
      .eq("id", submission.id);

    setSaving(false);
    if (updateError) {
      setError("Couldn't save that. Try again.");
      return;
    }

    // Only email the client the first time this goes "ready" — not on
    // every later tweak, so they don't get repeat notifications.
    if (!wasAlreadyReady && submission.submitterEmail) {
      fetch(import.meta.env.VITE_NOTIFY_CLIENT_URL || "/api/notify-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail: submission.submitterEmail,
          goalLabel: submission.goal_label,
        }),
      }).catch(() => {
        // Silently ignore — the programme itself already saved fine.
      });
    }

    onSaved();
  }

  return (
    <div className="border border-brand-orange/40 bg-brand-orange/5 rounded-sm p-4 space-y-4">
      <div>
        <p className="text-xs text-brand-light font-body">
          {submission.goal_label} • {submission.level} • {submission.days} • {(submission.equipment || []).join(", ")}
        </p>
        {submission.limitations && (
          <p className="text-xs text-brand-orange font-body mt-1">Note: {submission.limitations}</p>
        )}
      </div>

      <div>
        <label className="text-brand-light text-[10px] uppercase tracking-wide font-display font-bold">
          Summary (shown to them)
        </label>
        <textarea
          value={form.summary}
          onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
          className="w-full bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body mt-1 h-16 resize-none"
        />
      </div>

      <div>
        <label className="text-brand-light text-[10px] uppercase tracking-wide font-display font-bold">
          Focus tag
        </label>
        <input
          value={form.focus}
          onChange={(e) => setForm((f) => ({ ...f, focus: e.target.value }))}
          placeholder="e.g. Press handstand progression"
          className="w-full bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body mt-1"
        />
      </div>

      <AddExerciseToLibrary onAdded={onExerciseAdded} />

      <div>
        <span className="text-brand-light text-[10px] uppercase tracking-wide font-display font-bold">
          Weekly plan
        </span>
        <div className="mt-1">
          <DayEditor
            days={form.days}
            onChange={(v) => setForm((f) => ({ ...f, days: v }))}
            exerciseNames={exerciseNames}
          />
        </div>
      </div>

      <ClientGoals userId={submission.user_id} />

      {error && <p className="text-brand-orange text-xs font-body">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="flex-1 bg-brand-orange hover:brightness-110 disabled:bg-white/10 transition-all text-brand-dark font-display font-bold uppercase text-xs tracking-wide py-2.5 rounded-sm flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save & mark ready"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 border border-white/15 text-brand-light hover:text-white text-xs font-body rounded-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function CoachDashboard({ onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filter, setFilter] = useState("pending_coach");
  const [editingId, setEditingId] = useState(null);
  const [exerciseNames, setExerciseNames] = useState([]);

  async function loadExerciseNames() {
    setExerciseNames(await fetchExerciseNames());
  }

  async function load() {
    setLoading(true);
    setLoadError(null);

    // Refresh first, matching the fix applied elsewhere — cheap
    // insurance against the same session-timing issue showing up here.
    await supabase.auth.refreshSession();

    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setLoadError(error.message);
      setSubmissions([]);
      setLoading(false);
      return;
    }

    // Fetched separately rather than embedded in one query — embedding
    // relies on a direct foreign key between the two tables, which
    // isn't reliably set up here (submissions links to auth.users,
    // profiles is a separate table keyed the same way but not
    // guaranteed to be recognised as linked for embedding purposes).
    const userIds = [...new Set((data || []).map((s) => s.user_id))];
    let emailsById = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);
      emailsById = Object.fromEntries((profiles || []).map((p) => [p.id, p.email]));
    }

    setSubmissions((data || []).map((s) => ({ ...s, submitterEmail: emailsById[s.user_id] })));
    setLoading(false);
  }

  useEffect(() => {
    load();
    loadExerciseNames();
  }, []);

  const filtered = submissions.filter((s) => (filter === "all" ? true : s.status === filter));

  return (
    <div className="fixed inset-0 z-[70] bg-brand-dark overflow-y-auto text-white font-body">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-extrabold uppercase text-2xl">Coach dashboard</h1>
          <button onClick={onClose} className="text-brand-light hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { key: "pending_coach", label: "Pending" },
            { key: "ready", label: "Ready" },
            { key: "all", label: "All" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-sm text-xs font-display font-bold uppercase tracking-wide transition-colors ${
                filter === f.key ? "bg-brand-orange text-brand-dark" : "border border-white/15 text-brand-light"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loadError && (
          <p className="text-brand-orange text-sm font-body mb-4 border border-brand-orange/40 bg-brand-orange/5 rounded-sm p-3">
            Couldn't load submissions: {loadError}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-brand-light text-sm font-body">Nothing here.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => (
              <div key={s.id} className="border border-white/15 rounded-sm p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white font-body">{s.submitterEmail || "Unknown"}</p>
                    <p className="text-xs text-brand-light font-body mt-0.5">
                      {s.goal_label} • submitted {new Date(s.created_at).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-display font-bold uppercase tracking-wide px-2 py-1 rounded-sm shrink-0 ${
                      s.status === "ready"
                        ? "bg-brand-orange/20 text-brand-orange"
                        : "bg-white/10 text-brand-light"
                    }`}
                  >
                    {s.status === "ready" ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {s.status === "ready" ? "Ready" : "Pending"}
                  </span>
                </div>

                {editingId === s.id ? (
                  <div className="mt-3">
                    <SubmissionEditor
                      submission={s}
                      exerciseNames={exerciseNames}
                      onExerciseAdded={loadExerciseNames}
                      onSaved={() => {
                        setEditingId(null);
                        load();
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingId(s.id)}
                    className="mt-3 text-brand-orange text-xs font-display font-bold uppercase tracking-wide hover:text-white transition-colors"
                  >
                    {s.status === "ready" ? "Edit programme" : "Build programme"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
