import { useState } from "react";
import { saveBetaFeedback } from "../lib/workflowCapture";

type Props = {
  sessionId: string;
  role: string;
  setting: string;
  onSubmitted: () => void;
};

export function BetaFeedbackForm({ sessionId, role, setting, onSubmitted }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    role,
    setting,
    realismScore: 4,
    timeSavingScore: 4,
    wouldUseNextShift: "yes",
    magicalMoment: "",
    unsafeConcern: "",
    requestedSpecialty: "",
    betaInterest: "yes",
    contactEmail: ""
  });

  const update = (field: keyof typeof form, value: string | number) => setForm((current) => ({ ...current, [field]: value }));

  const submit = () => {
    saveBetaFeedback(
      {
        sessionId,
        role: form.role,
        setting: form.setting,
        realismScore: Number(form.realismScore),
        timeSavingScore: Number(form.timeSavingScore),
        wouldUseNextShift: form.wouldUseNextShift,
        magicalMoment: form.magicalMoment,
        unsafeConcern: form.unsafeConcern,
        requestedSpecialty: form.requestedSpecialty,
        betaInterest: form.betaInterest
      },
      form.contactEmail || undefined
    );
    setSubmitted(true);
    onSubmitted();
  };

  if (submitted) {
    return <div className="rounded-3xl border border-green/30 bg-soft-green p-4 text-sm text-slate-700">Feedback saved. Optional contact was stored separately from workflow data.</div>;
  }

  return (
    <div className="clinical-card rounded-[2rem] p-4">
      <p className="section-kicker">Beta Feedback</p>
      <div className="mt-4 grid gap-3">
        <Field label="What is your role?" value={form.role} onChange={(value) => update("role", value)} />
        <Field label="What setting do you work in?" value={form.setting} onChange={(value) => update("setting", value)} />
        <Range label="How realistic was this workflow?" value={form.realismScore} onChange={(value) => update("realismScore", value)} />
        <Range label="Would this save you time on shift?" value={form.timeSavingScore} onChange={(value) => update("timeSavingScore", value)} />
        <Field label="Would you use this next shift?" value={form.wouldUseNextShift} onChange={(value) => update("wouldUseNextShift", value)} />
        <Field label="What part felt magical?" value={form.magicalMoment} onChange={(value) => update("magicalMoment", value)} />
        <Field label="What part felt unsafe or wrong?" value={form.unsafeConcern} onChange={(value) => update("unsafeConcern", value)} />
        <Field label="What complaint group should we build next?" value={form.requestedSpecialty} onChange={(value) => update("requestedSpecialty", value)} />
        <Field label="Would you join a beta pilot?" value={form.betaInterest} onChange={(value) => update("betaInterest", value)} />
        <Field label="Optional contact email, stored separately" value={form.contactEmail} onChange={(value) => update("contactEmail", value)} />
        <button className="rounded-2xl bg-blue px-5 py-3 font-semibold text-white shadow-lift" onClick={submit} type="button">Submit feedback</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700">
      {label}
      <input className="rounded-2xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-blue" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Range({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700">
      <span className="flex justify-between">{label}<strong>{value}/5</strong></span>
      <input type="range" min="1" max="5" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
