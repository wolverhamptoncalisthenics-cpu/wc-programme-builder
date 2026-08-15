import { useState, useEffect } from "react";
import { Loader2, X, Plus, Trash2, Check, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";
import { EXERCISE_LIBRARY } from "../data/programme";

const EXERCISE_NAMES = Object.keys(EXERCISE_LIBRARY);

function emptyDay() {
  return { day: "", focus: "", exercises: [{ name: EXERCISE_NAMES[0], prescription: "" }] };
}

function emptyPhase() {
  return {
    phase: "",
    focus: "",
    goals: [""],
    keyExercises: [{ name: EXERCISE_NAMES[0], prescription: "" }],
  };
}

function emptyForm() {
  return { summary: "", focus: "", days: [emptyDay()], phases: [emptyPhase()] };
}

function ExerciseFields({ list, onChange }) {
  function update(i, field, value) {
    const next = [...list];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  }
  function remove(i) {
    onChange(list.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...list, { name: EXERCISE_NAMES[0], prescription: "" }]);
  }
  return (
    <div className="space-y-2">
      {list.map((ex, i) => (
        <div key={i} className="flex gap-2">
          <select
            value={ex.name}
            onChange={(e) => update(i, "name", e.target.value)}
            className="flex-1 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
          >
            {EXERCISE_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <input
            value={ex.prescription}
            onChange={(e) => update(i, "prescription", e.target.value)}
            placeholder="3x8"
            className="w-20 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
          />
          <button onClick={() => remove(i)} className="text-brand-light hover:text-brand-orange shrink-0">
            <X className="w-4 h-4" />
          </button>
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

function DayEditor({ days, onChange }) {
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
          <ExerciseFields list={d.exercises} onChange={(v) => update(i, "exercises", v)} />
        </div>
      ))}
      <button
        onClick={() => onChange([...days, emptyDay()])}
        className="text-brand-orange text-xs font-body flex items-center gap-1 hover:text-white transition-colors"
      >
        <Plus className="w-3 h-3" /> Add day
      </button>
    </div>
  );
}

function GoalFields({ list, onChange }) {
  function update(i, value) {
    const next = [...list];
    next[i] = value;
    onChange(next);
  }
  return (
    <div className="space-y-1.5">
      {list.map((g, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={g}
            onChange={(e) => update(i, e.target.value)}
            placeholder="e.g. 6 strict pull-ups"
            className="flex-1 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
          />
          <button
            onClick={() => onChange(list.filter((_, idx) => idx !== i))}
            className="text-brand-light hover:text-brand-orange shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...list, ""])}
        className="text-brand-orange text-xs font-body flex items-center gap-1 hover:text-white transition-colors"
      >
        <Plus className="w-3 h-3" /> Add goal
      </button>
    </div>
  );
}

function PhaseEditor({ phases, onChange }) {
  function update(i, field, value) {
    const next = [...phases];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  }
  return (
    <div className="space-y-4">
      {phases.map((p, i) => (
        <div key={i} className="border border-white/10 rounded-sm p-3 space-y-2">
          <div className="flex gap-2">
            <input
              value={p.phase}
              onChange={(e) => update(i, "phase", e.target.value)}
              placeholder="Weeks 1-4: Foundation"
              className="flex-1 bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
            />
            <button
              onClick={() => onChange(phases.filter((_, idx) => idx !== i))}
              className="text-brand-light hover:text-brand-orange shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <input
            value={p.focus}
            onChange={(e) => update(i, "focus", e.target.value)}
            placeholder="Phase focus"
            className="w-full bg-white/5 border border-white/15 rounded-sm px-2 py-1.5 text-xs text-white font-body"
          />
          <div>
            <span className="text-brand-light text-[10px] uppercase tracking-wide font-display font-bold">
              Goals
            </span>
            <GoalFields list={p.goals} onChange={(v) => update(i, "goals", v)} />
          </div>
          <div>
            <span className="text-brand-light text-[10px] uppercase tracking-wide font-display font-bold">
              Key exercises
            </span>
            <ExerciseFields list={p.keyExercises} onChange={(v) => update(i, "keyExercises", v)} />
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...phases, emptyPhase()])}
        className="text-brand-orange text-xs font-body flex items-center gap-1 hover:text-white transition-colors"
      >
        <Plus className="w-3 h-3" /> Add phase
      </button>
    </div>
  );
}

function SubmissionEditor({ submission, onSaved, onCancel }) {
  const [form, setForm] = useState(
    submission.manual_programme
      ? {
          summary: submission.manual_programme.summary || "",
          focus: submission.manual_programme.focus || "",
          days: submission.manual_programme.quickPlan?.days || [emptyDay()],
          phases: submission.manual_programme.progression?.phases || [emptyPhase()],
        }
      : emptyForm()
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function save() {
    setSaving(true);
    setError(null);
    const manual_programme = {
      summary: form.summary,
      focus: form.focus,
      quickPlan: { days: form.days },
      progression: { phases: form.phases },
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

      <div>
        <span className="text-brand-light text-[10px] uppercase tracking-wide font-display font-bold">
          Weekly plan
        </span>
        <div className="mt-1">
          <DayEditor days={form.days} onChange={(v) => setForm((f) => ({ ...f, days: v }))} />
        </div>
      </div>

      <div>
        <span className="text-brand-light text-[10px] uppercase tracking-wide font-display font-bold">
          Progression
        </span>
        <div className="mt-1">
          <PhaseEditor phases={form.phases} onChange={(v) => setForm((f) => ({ ...f, phases: v }))} />
        </div>
      </div>

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
  const [filter, setFilter] = useState("pending_coach");
  const [editingId, setEditingId] = useState(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("submissions")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false });
    setSubmissions(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = submissions.filter((s) => (filter === "all" ? true : s.status === filter));

  return (
    <div className="fixed inset-0 z-[70] bg-brand-dark overflow-y-auto">
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
                    <p className="text-sm text-white font-body">{s.profiles?.email || "Unknown"}</p>
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
