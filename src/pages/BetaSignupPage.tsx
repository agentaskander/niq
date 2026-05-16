import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { demoScenarios } from "../data/demoScenarios";
import { saveBetaSignup } from "../lib/workflowCapture";

type Props = {
  onNavigate: (path: string) => void;
};

const roles = ["Nursing", "Provider", "Triage", "Telehealth", "SBAR/Handoff", "Advanced"];
const workflowInterests = ["Nursing", "Provider", "SOAP", "SBAR", "Handoff", "Triage", "Telehealth", "Advanced"];
const settings = ["ED", "urgent care", "inpatient", "clinic", "home health", "telehealth"];

function queryValue(name: string) {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(name) ?? "";
}

export function BetaSignupPage({ onNavigate }: Props) {
  const scenarioFromQuery = queryValue("scenario");
  const workflowFromQuery = queryValue("workflow");
  const pilotFromQuery = queryValue("pilot");
  const scenarioOptions = useMemo(() => demoScenarios.map((scenario) => ({ id: scenario.id, title: scenario.title })), []);
  const initialScenario = scenarioOptions.find((scenario) => scenario.id === scenarioFromQuery)?.title ?? "";
  const initialWorkflow = workflowInterests.find((workflow) => workflow.toLowerCase() === workflowFromQuery.toLowerCase()) ?? "";
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [workflowInterest, setWorkflowInterest] = useState(initialWorkflow || workflowInterests[0]);
  const [clinicalSetting, setClinicalSetting] = useState(settings[0]);
  const [scenarioInterest, setScenarioInterest] = useState(initialScenario || scenarioOptions[0]?.title || "");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [requestEnterprisePilot, setRequestEnterprisePilot] = useState(pilotFromQuery === "enterprise");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!organization.trim() || !email.trim() || !email.includes("@")) {
      setError("Enter an organization and valid email to join the beta.");
      return;
    }
    saveBetaSignup({
      selectedRole,
      workflowInterest,
      clinicalSetting,
      scenarioInterest,
      organization: organization.trim(),
      email: email.trim(),
      notes: notes.trim(),
      requestEnterprisePilot,
      source: "beta-page",
      scenarioViewed: scenarioFromQuery || undefined,
      workflowModesUsed: workflowFromQuery ? [workflowFromQuery] : undefined
    });
    setError("");
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-36 pt-6 md:px-8">
      <section className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-soft md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-kicker">NarrativeIQ Beta</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">Join the clinical workflow waitlist.</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Help shape workflow-aware charting for nursing, provider notes, triage, telehealth, SBAR, handoff, and advanced review.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-2xl border border-blue-600 bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lift hover:bg-blue-700" onClick={() => onNavigate("/demo")} type="button">
                Try Demo
              </button>
              <button className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-800 shadow-lift hover:bg-blue-100" onClick={() => setRequestEnterprisePilot(true)} type="button">
                Book Enterprise Pilot
              </button>
            </div>
          </div>

          <form className="rounded-[1.5rem] border border-line bg-canvas p-4 md:p-5" onSubmit={submit}>
            <div className="grid gap-4">
              <fieldset>
                <legend className="text-sm font-semibold text-slate-900">Selected role</legend>
                <div className="mt-2 flex flex-wrap gap-2" data-testid="beta-role-options">
                  {roles.map((role) => (
                    <button key={role} className={`rounded-full border px-3 py-2 text-sm font-semibold ${selectedRole === role ? "border-blue-300 bg-blue-50 text-blue-900 ring-1 ring-blue-200" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`} onClick={() => setSelectedRole(role)} type="button">
                      {role}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold text-slate-900">Workflow interest</legend>
                <div className="mt-2 flex flex-wrap gap-2" data-testid="beta-workflow-options">
                  {workflowInterests.map((workflow) => (
                    <button key={workflow} className={`rounded-full border px-3 py-2 text-sm font-semibold ${workflowInterest === workflow ? "border-blue-300 bg-blue-50 text-blue-900 ring-1 ring-blue-200" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`} onClick={() => setWorkflowInterest(workflow)} type="button">
                      {workflow}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="text-sm font-semibold text-slate-900">
                Clinical setting
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900" value={clinicalSetting} onChange={(event) => setClinicalSetting(event.target.value)}>
                  {settings.map((setting) => <option key={setting}>{setting}</option>)}
                </select>
              </label>

              <label className="text-sm font-semibold text-slate-900">
                Scenario interest
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900" value={scenarioInterest} onChange={(event) => setScenarioInterest(event.target.value)}>
                  {scenarioOptions.map((scenario) => <option key={scenario.id}>{scenario.title}</option>)}
                </select>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-900">
                  Organization / company
                  <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900" value={organization} onChange={(event) => setOrganization(event.target.value)} />
                </label>
                <label className="text-sm font-semibold text-slate-900">
                  Email
                  <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>
              </div>

              <label className="text-sm font-semibold text-slate-900">
                Optional notes
                <textarea className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900" value={notes} onChange={(event) => setNotes(event.target.value)} />
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800">
                <input checked={requestEnterprisePilot} onChange={(event) => setRequestEnterprisePilot(event.target.checked)} type="checkbox" />
                Request enterprise pilot conversation
              </label>

              {error && <p className="rounded-2xl border border-critical/20 bg-soft-red p-3 text-sm font-semibold text-critical">{error}</p>}
              {submitted && (
                <p className="inline-flex items-center gap-2 rounded-2xl border border-green/20 bg-soft-green p-3 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="text-green" size={18} /> Beta request saved.
                </p>
              )}

              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-600 bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lift hover:bg-blue-700" type="submit">
                Join Beta <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
