import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { BetaFeedbackForm } from "../components/BetaFeedbackForm";
import { ComplaintGroupSelector } from "../components/ComplaintGroupSelector";
import { CompliancePanel } from "../components/CompliancePanel";
import { CopyToEhrButton } from "../components/CopyToEhrButton";
import { DemoProgress } from "../components/DemoProgress";
import { NarrativePreview } from "../components/NarrativePreview";
import { NarrativeStyleTabs } from "../components/NarrativeStyleTabs";
import { PhiWarningPanel } from "../components/PhiWarningPanel";
import { ReviewGate } from "../components/ReviewGate";
import { RoleSelector } from "../components/RoleSelector";
import { SafetyBanner } from "../components/SafetyBanner";
import { SelectedFactsPanel } from "../components/SelectedFactsPanel";
import { SpecialtySelector } from "../components/SpecialtySelector";
import { SymptomChipCloud } from "../components/SymptomChipCloud";
import { TimelineBuilder } from "../components/TimelineBuilder";
import { demoSession } from "../data/demoSession";
import { demoScenarios } from "../data/demoScenarios";
import { roleScopes } from "../data/roleScopes";
import { specialties } from "../data/specialties";
import { detectPhi } from "../lib/phiDetection";
import { generateNarrative } from "../lib/narrativeEngine";
import {
  createSession,
  logWorkflowEvent,
  markNarrativeGenerated,
  saveNarrativeRevision,
  syncSessionFromInput
} from "../lib/workflowCapture";
import type { ComplaintGroup, NarrativeInput, RoleScope, Specialty, TimelineEvent } from "../lib/types";

export function AppShell() {
  const [input, setInput] = useState<NarrativeInput>(demoSession);
  const [session, setSession] = useState(() => createSession(demoSession, "gi-abdominal-pain"));
  const [reviewed, setReviewed] = useState(false);
  const [editedNarrative, setEditedNarrative] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const output = useMemo(() => generateNarrative(input), [input]);
  const activeNarrative = editedNarrative || output.text;

  useEffect(() => {
    setEditedNarrative(output.text);
    const next = markNarrativeGenerated(session, output.mode, output.text);
    setSession(syncSessionFromInput(next, input, next));
    logWorkflowEvent(session, input, "narrative_generated", "narrative", { mode: output.mode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [output.mode, output.text]);

  const symptomLabels = input.selectedSymptoms.map((id) => input.complaintGroup.symptoms.find((item) => item.id === id)?.label ?? id);
  const observationLabels = input.observations.map((id) => input.complaintGroup.observations.find((item) => item.id === id)?.label ?? id);
  const phiWarnings = detectPhi([editedNarrative, ...input.patientStatements, ...input.timelineEvents.map((event) => event.description)].join(" "));
  const completeness = Math.min(100, Math.round(((input.selectedSymptoms.length ? 1 : 0) + (input.selectedNegatives.length ? 1 : 0) + (input.observations.length ? 1 : 0) + (input.interventions.length ? 1 : 0) + (input.timelineEvents.length ? 1 : 0) + (reviewed ? 1 : 0)) / 6 * 100));
  const timelineCompleteness = Math.min(100, input.timelineEvents.length * 22);
  const quality = Math.min(100, Math.round((completeness + timelineCompleteness + (activeNarrative.length > 180 ? 90 : 60)) / 3));

  const update = (next: Partial<NarrativeInput>, eventType?: Parameters<typeof logWorkflowEvent>[2], step: Parameters<typeof logWorkflowEvent>[3] = "facts", payload: Record<string, unknown> = {}) => {
    const nextInput = { ...input, ...next };
    setInput(nextInput);
    setReviewed(false);
    const nextSession = syncSessionFromInput(session, nextInput);
    setSession(nextSession);
    if (eventType) logWorkflowEvent(nextSession, nextInput, eventType, step, payload);
  };

  const selectRole = (role: RoleScope) => {
    update({ role, selectedMode: role.defaultMode }, "role_selected", "role", { role: role.id });
  };

  const selectSpecialty = (specialty: Specialty) => {
    const complaintGroup = specialty.complaintGroups[0];
    update({
      specialty,
      complaintGroup,
      chiefComplaint: complaintGroup.name.toLowerCase(),
      selectedSymptoms: [],
      selectedNegatives: complaintGroup.pertinentNegatives.slice(0, 3),
      observations: complaintGroup.observations.slice(0, 1).map((observation) => observation.id),
      interventions: complaintGroup.interventions.slice(0, 1),
      modifiers: complaintGroup.modifiers.slice(0, 1)
    }, "specialty_selected", "specialty", { specialty: specialty.id });
  };

  const selectComplaintGroup = (complaintGroup: ComplaintGroup) => {
    update({
      complaintGroup,
      chiefComplaint: complaintGroup.name.toLowerCase(),
      selectedSymptoms: [],
      selectedNegatives: complaintGroup.pertinentNegatives.slice(0, 3),
      observations: complaintGroup.observations.slice(0, 1).map((observation) => observation.id),
      interventions: complaintGroup.interventions.slice(0, 1),
      modifiers: complaintGroup.modifiers.slice(0, 1)
    }, "complaint_group_selected", "complaint", { complaintGroup: complaintGroup.id });
  };

  const toggleArrayValue = (field: "selectedSymptoms" | "selectedNegatives" | "observations" | "interventions" | "modifiers", value: string) => {
    const current = input[field];
    const selected = !current.includes(value);
    const eventType = field === "selectedSymptoms"
      ? selected ? "symptom_selected" : "symptom_deselected"
      : field === "selectedNegatives"
        ? "negative_selected"
        : field === "observations"
          ? "observation_selected"
          : field === "interventions"
            ? "intervention_selected"
            : undefined;
    update({ [field]: selected ? [...current, value] : current.filter((item) => item !== value) }, eventType, "facts", { field, value, selected });
  };

  const moveEvent = (id: string, direction: "up" | "down") => {
    const events = [...input.timelineEvents];
    const index = events.findIndex((event) => event.id === id);
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || nextIndex < 0 || nextIndex >= events.length) return;
    [events[index], events[nextIndex]] = [events[nextIndex], events[index]];
    update({ timelineEvents: events }, "timeline_event_edited", "timeline", { id, direction });
  };

  const addEvent = (sourceType: TimelineEvent["sourceType"] = "clinician-observed") => {
    const event: TimelineEvent = {
      id: crypto.randomUUID(),
      timestamp: "Now",
      eventType: sourceType,
      sourceType,
      title: sourceType.replace("-", " "),
      description: "Additional de-identified event added to the patient story timeline.",
      linkedSymptomIds: input.selectedSymptoms.slice(0, 2),
      linkedObservationIds: input.observations.slice(0, 2)
    };
    update({ timelineEvents: [...input.timelineEvents, event] }, "timeline_event_added", "timeline", { sourceType });
  };

  const loadScenario = (scenarioId: string) => {
    const scenario = demoScenarios.find((item) => item.id === scenarioId);
    if (!scenario) return;
    setInput(scenario.input);
    const nextSession = createSession(scenario.input, scenario.id);
    setSession(nextSession);
    setReviewed(false);
    setFeedbackOpen(false);
    setEditedNarrative("");
    logWorkflowEvent(nextSession, scenario.input, "complaint_group_selected", "complaint", { scenarioId });
  };

  const completeReview = (value: boolean) => {
    setReviewed(value);
    const nextSession = syncSessionFromInput(session, input, { reviewCompleted: value, userEditedNarrative: editedNarrative });
    setSession(nextSession);
    if (value) {
      logWorkflowEvent(nextSession, input, "review_completed", "review", { mode: output.mode });
      saveNarrativeRevision(session.sessionId, output.mode, output.text, editedNarrative, true, false);
    }
  };

  const copyToEhr = () => {
    const start = new Date(session.createdAt).getTime();
    const nextSession = syncSessionFromInput(session, input, {
      copiedToEhr: true,
      reviewCompleted: true,
      userEditedNarrative: editedNarrative,
      timeToCopyMs: Date.now() - start
    });
    setSession(nextSession);
    logWorkflowEvent(nextSession, input, "copied_to_ehr", "copy", { mode: output.mode });
    logWorkflowEvent(nextSession, input, "demo_completed", "feedback", { mode: output.mode });
    saveNarrativeRevision(session.sessionId, output.mode, output.text, editedNarrative, true, true);
    setFeedbackOpen(true);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-32 pt-5 md:px-8">
      <div className="mb-6 flex items-center justify-between rounded-[2rem] border border-line bg-white/80 p-4 shadow-soft backdrop-blur">
        <div>
          <p className="text-xl font-bold tracking-tight text-ink">NarrativeIQ Studio</p>
          <p className="text-xs text-muted">Symptoms to Patient Story Timeline to Narrative Modes to Review Gate to Copy to EHR</p>
        </div>
        <span className="rounded-full border border-amber/30 bg-soft-amber px-3 py-1 text-xs font-semibold text-amber">
          Review Required
        </span>
      </div>

      <SafetyBanner />
      <div className="mt-4 rounded-3xl border border-blue/20 bg-soft-blue p-4 text-sm text-slate-700">
        <strong>Do not enter patient identifiers.</strong> This demo is for de-identified workflow testing only.
      </div>
      <div className="mt-4">
        <DemoProgress completeness={completeness} timelineCompleteness={timelineCompleteness} quality={quality} interactions={session.totalInteractions} />
      </div>
      <div className="mt-4 clinical-card rounded-[2rem] p-4">
        <p className="section-kicker mb-3">Demo Scenarios</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {demoScenarios.map((scenario) => (
            <button key={scenario.id} className="shrink-0 rounded-full border border-line bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-hover" onClick={() => loadScenario(scenario.id)} type="button" title={scenario.description}>
              {scenario.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr_1fr]">
        <section className="space-y-5">
          <div className="clinical-card rounded-[2rem] p-4">
            <p className="section-kicker mb-3">Role + Scope</p>
            <RoleSelector roles={roleScopes} selected={input.role} onSelect={selectRole} />
          </div>
          <div className="clinical-card rounded-[2rem] p-4">
            <p className="section-kicker mb-3">Specialty</p>
            <SpecialtySelector specialties={specialties} selected={input.specialty} onSelect={selectSpecialty} />
          </div>
          <div className="clinical-card rounded-[2rem] p-4">
            <p className="section-kicker mb-3">Complaint Group</p>
            <ComplaintGroupSelector groups={input.specialty.complaintGroups} selected={input.complaintGroup} onSelect={selectComplaintGroup} />
          </div>
          <div className="clinical-card rounded-[2rem] p-4">
            <p className="section-kicker mb-3">Smart Symptom Chips</p>
            <SymptomChipCloud symptoms={input.complaintGroup.symptoms} selected={input.selectedSymptoms} onToggle={(id) => toggleArrayValue("selectedSymptoms", id)} />
          </div>
          <ChipSection title="Negatives" items={input.complaintGroup.pertinentNegatives} selected={input.selectedNegatives} onToggle={(value) => toggleArrayValue("selectedNegatives", value)} prefix="Denies" />
          <ChipSection title="Observations" items={input.complaintGroup.observations.map((item) => item.label)} selected={input.observations.map((id) => input.complaintGroup.observations.find((item) => item.id === id)?.label ?? id)} onToggle={(label) => toggleArrayValue("observations", input.complaintGroup.observations.find((item) => item.label === label)?.id ?? label)} />
          <ChipSection title="Interventions" items={input.complaintGroup.interventions} selected={input.interventions} onToggle={(value) => toggleArrayValue("interventions", value)} />
        </section>

        <section className="space-y-5 xl:order-none -order-1">
          <TimelineBuilder events={input.timelineEvents} onMove={moveEvent} onAdd={addEvent} />
          <div className="clinical-card rounded-[2rem] p-4">
            <p className="section-kicker mb-3">Add Timeline Event</p>
            <div className="flex flex-wrap gap-2">
              {["patient-stated", "clinician-observed", "symptom-change", "intervention", "reassessment", "provider-notified", "escalation", "handoff-disposition"].map((type) => (
                <button key={type} className="rounded-full border border-line bg-white px-3 py-2 text-sm text-muted hover:bg-hover" onClick={() => addEvent(type as TimelineEvent["sourceType"])} type="button">
                  <Plus className="mr-1 inline" size={14} /> {type.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
          <ChipSection title="Timing + Modifiers" items={[...input.complaintGroup.timingOptions, ...input.complaintGroup.modifiers, ...input.complaintGroup.severityOptions]} selected={[input.onset, input.severity, ...input.modifiers]} onToggle={(value) => {
            if (input.complaintGroup.timingOptions.includes(value)) update({ onset: value });
            else if (input.complaintGroup.severityOptions.includes(value)) update({ severity: value });
            else toggleArrayValue("modifiers", value);
          }} />
          <div className="clinical-card rounded-[2rem] p-4">
            <p className="section-kicker">Clinical Story Engine</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Universal symptom ontology", "Event graph", "Symptom-to-narrative mapper", "Timeline-to-note generator"].map((item) => (
                <div key={item} className="rounded-2xl border border-line bg-slate-50 p-4 text-sm text-slate-600">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <aside className="sticky bottom-24 space-y-5 self-start xl:top-5">
          <NarrativeStyleTabs allowedModes={input.role.allowedModes} selected={output.mode} onSelect={(selectedMode) => update({ selectedMode }, "narrative_mode_changed", "narrative", { selectedMode })} />
          <SelectedFactsPanel symptoms={symptomLabels} negatives={input.selectedNegatives} observations={observationLabels} interventions={input.interventions} />
          <NarrativePreview narrative={output.text} editedNarrative={editedNarrative} onEditedNarrativeChange={(value) => {
            setEditedNarrative(value);
            const nextSession = syncSessionFromInput(session, input, { userEditedNarrative: value });
            setSession(nextSession);
            logWorkflowEvent(nextSession, input, "narrative_edited", "narrative", { length: value.length });
          }} safetyFlags={output.safetyFlags} />
          <PhiWarningPanel warnings={phiWarnings} />
          <div className="grid gap-3 rounded-3xl border border-line bg-white p-4 shadow-lift md:grid-cols-2">
            <div>
              <p className="section-kicker">Before</p>
              <p className="mt-2 line-clamp-4 text-xs leading-5 text-muted">{output.text}</p>
            </div>
            <div>
              <p className="section-kicker">After edit</p>
              <p className="mt-2 line-clamp-4 text-xs leading-5 text-muted">{activeNarrative}</p>
            </div>
          </div>
          <ReviewGate reviewed={reviewed} onReviewedChange={completeReview} />
          <CopyToEhrButton reviewed={reviewed} narrative={activeNarrative} onCopied={copyToEhr} />
          {feedbackOpen && <BetaFeedbackForm sessionId={session.sessionId} role={input.role.name} setting={input.specialty.name} onSubmitted={() => logWorkflowEvent(session, input, "demo_completed", "feedback", { feedback: true })} />}
          <CompliancePanel />
        </aside>
      </div>
    </main>
  );
}

type ChipSectionProps = {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
  prefix?: string;
};

function ChipSection({ title, items, selected, onToggle, prefix }: ChipSectionProps) {
  return (
    <div className="clinical-card rounded-[2rem] p-4">
      <p className="section-kicker mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              className={`rounded-full border px-3 py-2 text-sm ${
                active ? "border-teal bg-soft-teal text-teal shadow-lift" : "border-line bg-white text-muted hover:bg-hover hover:text-ink"
              }`}
              onClick={() => onToggle(item)}
              type="button"
            >
              {prefix ? `${prefix} ${item}` : item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
