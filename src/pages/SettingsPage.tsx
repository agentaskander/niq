import { useEffect, useState } from "react";
import { roleScopes } from "../data/roleScopes";
import { specialties } from "../data/specialties";
import { narrativeModes } from "../data/narrativeModes";
import { clearDemoData, loadSettings, saveSettings, type NarrativeIqSettings } from "../lib/settings";
import { listWorkflowEvents } from "../lib/workflowCapture";

export function SettingsPage() {
  const [settings, setSettings] = useState<NarrativeIqSettings>(() => loadSettings());
  const [message, setMessage] = useState("");
  const workflowEvents = listWorkflowEvents();
  const exportDisabled = !settings.workflowCaptureEnabled || workflowEvents.length === 0;

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const update = <K extends keyof NarrativeIqSettings>(key: K, value: NarrativeIqSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const exportEvents = () => {
    if (exportDisabled) return;
    const payload = JSON.stringify(workflowEvents, null, 2);
    navigator.clipboard?.writeText(payload);
    setMessage("Anonymized workflow events JSON copied locally.");
  };

  const clearData = () => {
    clearDemoData();
    setMessage("Local demo data cleared.");
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8">
      <p className="text-xl font-bold text-ink">Settings</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Local profile, safety defaults, workflow preferences, and beta data controls for the NarrativeIQ demo.
      </p>
      {message && <div className="mt-4 rounded-2xl border border-green/20 bg-soft-green p-3 text-sm font-semibold text-slate-800">{message}</div>}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="clinical-card rounded-3xl p-5">
          <p className="section-kicker">Profile</p>
          <div className="mt-4 grid gap-3">
            <Select label="Role" value={settings.role} onChange={(value) => update("role", value as NarrativeIqSettings["role"])} options={roleScopes.map((role) => [role.id, role.name])} />
            <Input label="Care setting" value={settings.careSetting} onChange={(value) => update("careSetting", value)} />
            <Select label="Default specialty" value={settings.defaultSpecialty} onChange={(value) => update("defaultSpecialty", value)} options={specialties.map((specialty) => [specialty.id, specialty.name])} />
            <Select label="Default narrative mode" value={settings.defaultNarrativeMode} onChange={(value) => update("defaultNarrativeMode", value as NarrativeIqSettings["defaultNarrativeMode"])} options={narrativeModes.map((mode) => [mode.id, mode.label])} />
            <Select label="Shift type" value={settings.shiftType} onChange={(value) => update("shiftType", value)} options={[["day", "Day"], ["night", "Night"], ["swing", "Swing"], ["on-call", "On call"]]} />
            <Select label="Documentation style" value={settings.documentationStyle} onChange={(value) => update("documentationStyle", value as NarrativeIqSettings["documentationStyle"])} options={[["concise", "Concise"], ["balanced", "Balanced"], ["detailed", "Detailed"]]} />
            <Select label="Preferred tone" value={settings.preferredTone} onChange={(value) => update("preferredTone", value as NarrativeIqSettings["preferredTone"])} options={[["objective", "Objective"], ["narrative", "Narrative"], ["sbar-forward", "SBAR-forward"]]} />
          </div>
        </section>

        <section className="clinical-card rounded-3xl p-5">
          <p className="section-kicker">Safety Defaults</p>
          <Toggle label="Always require review before copy" checked={settings.alwaysRequireReview} onChange={(value) => update("alwaysRequireReview", value)} />
          <Toggle label="Warn on PHI-like text" checked={settings.warnOnPhi} onChange={(value) => update("warnOnPhi", value)} />
          <Toggle label="Block diagnosis language for RN mode" checked={settings.blockRnDiagnosisLanguage} onChange={(value) => update("blockRnDiagnosisLanguage", value)} />
          <Toggle label="No treatment orders in RN mode" checked={settings.blockRnTreatmentOrders} onChange={(value) => update("blockRnTreatmentOrders", value)} />
        </section>

        <section className="clinical-card rounded-3xl p-5">
          <p className="section-kicker">Workflow Preferences</p>
          <Toggle label="Auto-build timeline from selected symptoms" checked={settings.autoBuildTimeline} onChange={(value) => update("autoBuildTimeline", value)} />
          <Toggle label="Auto-collapse completed sections" checked={settings.autoCollapseCompletedSections} onChange={(value) => update("autoCollapseCompletedSections", value)} />
          <Toggle label="Show metric explanations" checked={settings.showMetricExplanations} onChange={(value) => update("showMetricExplanations", value)} />
          <Toggle label="Compact chip mode" checked={settings.compactChipMode} onChange={(value) => update("compactChipMode", value)} />
          <Select label="Default start" value={settings.defaultStart} onChange={(value) => update("defaultStart", value as NarrativeIqSettings["defaultStart"])} options={[["demo", "Demo scenarios"], ["blank", "Blank story"]]} />
        </section>

        <section className="clinical-card rounded-3xl p-5">
          <p className="section-kicker">Data / Beta</p>
          <Toggle label="Local workflow capture enabled" checked={settings.workflowCaptureEnabled} onChange={(value) => update("workflowCaptureEnabled", value)} />
          {!settings.workflowCaptureEnabled && (
            <p className="mt-3 rounded-2xl border border-amber/30 bg-soft-amber p-3 text-sm text-slate-700">
              Workflow capture is off. Enable it to collect local demo metrics.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-lift ${exportDisabled ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-blue text-white"}`}
              disabled={exportDisabled}
              onClick={exportEvents}
              type="button"
            >
              Export anonymized workflow events JSON
            </button>
            <button className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lift hover:bg-hover" onClick={clearData} type="button">Clear local demo data</button>
            <a className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lift hover:bg-hover" href="/app/adoption">Beta feedback plan</a>
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-muted">
      {label}
      <input className="rounded-2xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-blue" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[][]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-muted">
      {label}
      <select className="rounded-2xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-blue" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-line bg-slate-50 p-3 text-sm font-semibold text-slate-700">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
