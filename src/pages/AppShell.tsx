import { useEffect, useMemo, useRef, useState } from "react";
import { BetaFeedbackForm } from "../components/BetaFeedbackForm";
import { ComplaintGroupSelector } from "../components/ComplaintGroupSelector";
import { CompliancePanel } from "../components/CompliancePanel";
import { CopyToEhrButton } from "../components/CopyToEhrButton";
import { DemoProgress } from "../components/DemoProgress";
import { MetricBar } from "../components/MetricBar";
import { NarrativePreview } from "../components/NarrativePreview";
import { NarrativeStyleTabs } from "../components/NarrativeStyleTabs";
import { PhiWarningPanel } from "../components/PhiWarningPanel";
import { ReviewGate } from "../components/ReviewGate";
import { RoleSelector } from "../components/RoleSelector";
import { SafetyBanner } from "../components/SafetyBanner";
import { SelectableChip } from "../components/SelectableChip";
import { SelectedFactsPanel } from "../components/SelectedFactsPanel";
import { SpecialtySelector } from "../components/SpecialtySelector";
import { SymptomChipCloud } from "../components/SymptomChipCloud";
import { TimelineBuilder } from "../components/TimelineBuilder";
import { demoSession } from "../data/demoSession";
import { demoScenarios } from "../data/demoScenarios";
import { roleScopes } from "../data/roleScopes";
import { specialties as seedSpecialties } from "../data/specialties";
import { detectPhi } from "../lib/phiDetection";
import { loadSettings } from "../lib/settings";
import { loadOntologyState } from "../lib/ontologyStudio";
import { getClinicalWorkflowMode } from "../lib/clinicalWorkflowModes";
import { buildClinicalStory } from "../engine/clinicalStoryEngine";
import {
  calculateNarrativeQuality,
  calculatePatientStoryCompleteness,
  calculateTimelineCompleteness
} from "../engine/completeness";
import { generateNarrative } from "../lib/narrativeEngine";
import {
  createSession,
  clearWorkflowMigrationNotice,
  isCountableWorkflowEvent,
  logWorkflowEvent,
  markNarrativeGenerated,
  migrateLegacyWorkflowData,
  resetWorkflowDemoData,
  saveSession,
  saveNarrativeRevision,
  syncSessionFromInput
} from "../lib/workflowCapture";
import type { ClinicalStory, ComplaintGroup, NarrativeInput, RoleScope, Specialty, TimelineEvent } from "../lib/types";

type Props = {
  mode: "demo" | "blank";
};

type WorkflowLogRequest = {
  eventType: Parameters<typeof logWorkflowEvent>[2];
  step: Parameters<typeof logWorkflowEvent>[3];
  payload: Record<string, unknown>;
};

const blankSession: NarrativeInput = {
  ...demoSession,
  selectedSymptoms: [],
  selectedNegatives: [],
  observations: [],
  interventions: [],
  modifiers: [],
  timelineEvents: [],
  patientStatements: [],
  responseToIntervention: "",
  providerNotification: "",
  disposition: "Awaiting provider direction."
};

function applySettingsToBlank(input: NarrativeInput): NarrativeInput {
  const settings = loadSettings();
  const role = roleScopes.find((item) => item.id === settings.role) ?? input.role;
  const specialty = seedSpecialties.find((item) => item.id === settings.defaultSpecialty) ?? input.specialty;
  const complaintGroup = specialty.complaintGroups[0] ?? input.complaintGroup;
  const selectedMode = role.allowedModes.includes(settings.defaultNarrativeMode) ? settings.defaultNarrativeMode : role.defaultMode;
  return { ...input, role, specialty, complaintGroup, selectedMode, chiefComplaint: complaintGroup.name.toLowerCase() };
}

function currentTimeLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AppShell({ mode }: Props) {
  const legacyEventsWereReset = useMemo(() => migrateLegacyWorkflowData(), []);
  const initialInput = mode === "demo" ? demoSession : applySettingsToBlank(blankSession);
  const activeSpecialties = useMemo(() => loadOntologyState().specialties, []);
  const [input, setInput] = useState<NarrativeInput>(initialInput);
  const [activeScenarioId, setActiveScenarioId] = useState(mode === "demo" ? "gi-abdominal-pain" : "");
  const [session, setSession] = useState(() => createSession(initialInput, mode === "demo" ? "gi-abdominal-pain" : undefined));
  const [reviewed, setReviewed] = useState(false);
  const [editedNarrative, setEditedNarrative] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [clinicalStory, setClinicalStory] = useState<ClinicalStory | null>(null);
  const [storyError, setStoryError] = useState("");
  const [toast, setToast] = useState("");
  const [roleExpanded, setRoleExpanded] = useState(false);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [scenarioExpanded, setScenarioExpanded] = useState(mode === "demo");
  const [legacyEventsReset, setLegacyEventsReset] = useState(legacyEventsWereReset);
  const timelineRef = useRef<HTMLElement | null>(null);
  const output = useMemo(() => generateNarrative(input), [input]);
  const activeNarrative = editedNarrative || output.text;

  useEffect(() => {
    setEditedNarrative(output.text);
    const next = markNarrativeGenerated(session, output.mode, output.text);
    setSession(next);
    saveSession(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [output.mode, output.text]);

  const symptomLabels = input.selectedSymptoms.map((id) => input.complaintGroup.symptoms.find((item) => item.id === id)?.label ?? id);
  const observationLabels = input.observations.map((id) => input.complaintGroup.observations.find((item) => item.id === id)?.label ?? id);
  const phiWarnings = detectPhi([editedNarrative, ...input.patientStatements, ...input.timelineEvents.map((event) => event.description)].join(" "));
  const completenessItems = [
    ["Role selected", Boolean(input.role)],
    ["Complaint selected", Boolean(input.complaintGroup)],
    ["Symptoms selected", input.selectedSymptoms.length > 0],
    ["Timing added", Boolean(input.onset || input.severity)],
    ["Negatives selected", input.selectedNegatives.length > 0],
    ["Observation added", input.observations.length > 0],
    ["Timeline has at least 2 events", input.timelineEvents.length >= 2],
    ["Narrative reviewed", reviewed]
  ] as const;
  const completeness = calculatePatientStoryCompleteness({ ...input, reviewed, narrativeGenerated: Boolean(output.text) });
  const timelineCompleteness = calculateTimelineCompleteness(input);
  const quality = calculateNarrativeQuality({ ...input, reviewed, narrativeGenerated: Boolean(output.text) });

  const commitInput = (next: Partial<NarrativeInput>, events: WorkflowLogRequest[] = []) => {
    const nextInput = { ...input, ...next };
    setInput(nextInput);
    setReviewed(false);
    const increment = events.filter((event) => isCountableWorkflowEvent(event.eventType)).length;
    const nextSession = syncSessionFromInput(session, nextInput, {
      totalInteractions: session.totalInteractions + increment
    });
    setSession(nextSession);
    events.forEach((event) => logWorkflowEvent(nextSession, nextInput, event.eventType, event.step, event.payload));
    return { nextInput, nextSession };
  };

  const update = (next: Partial<NarrativeInput>, eventType?: Parameters<typeof logWorkflowEvent>[2], step: Parameters<typeof logWorkflowEvent>[3] = "facts", payload: Record<string, unknown> = {}) => {
    commitInput(next, eventType ? [{ eventType, step, payload }] : []);
  };

  const pulse = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(8);
    }
  };

  const selectRole = (role: RoleScope) => {
    setRoleExpanded(false);
    commitInput(
      { role, selectedMode: role.defaultMode },
      [{ eventType: "role_selected", step: "role", payload: { role: role.id, selectedMode: role.defaultMode } }]
    );
  };

  const selectSpecialty = (specialty: Specialty) => {
    const complaintGroup = specialty.complaintGroups[0];
    setContextExpanded(false);
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
    setContextExpanded(false);
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
    pulse();
    const current = input[field];
    const selected = !current.includes(value);
    const eventType = field === "selectedSymptoms"
      ? selected ? "symptom_selected" : "symptom_deselected"
      : field === "selectedNegatives"
        ? selected ? "negative_selected" : "negative_deselected"
        : field === "observations"
          ? selected ? "observation_selected" : "observation_deselected"
          : field === "interventions"
            ? selected ? "intervention_selected" : "intervention_deselected"
            : undefined;
    update({ [field]: selected ? [...current, value] : current.filter((item) => item !== value) }, eventType, "facts", { field, value, selected });
  };

  const moveEvent = (id: string, direction: "up" | "down") => {
    const events = [...input.timelineEvents];
    const index = events.findIndex((event) => event.id === id);
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || nextIndex < 0 || nextIndex >= events.length) return;
    [events[index], events[nextIndex]] = [events[nextIndex], events[index]];
    update({ timelineEvents: events }, "timeline_event_reordered", "timeline", { id, direction });
  };

  const updateTimelineEvent = (id: string, patch: Partial<TimelineEvent>) => {
    update({
      timelineEvents: input.timelineEvents.map((event) => event.id === id ? { ...event, ...patch } : event)
    }, "clinical_event_edited", "timeline", { id, patch });
    setToast("Narrative regenerated from timeline edit.");
    window.setTimeout(() => setToast(""), 1200);
  };

  const deleteTimelineEvent = (id: string) => {
    update({ timelineEvents: input.timelineEvents.filter((event) => event.id !== id) }, "clinical_event_deleted", "timeline", { id, deleted: true });
    setToast("Timeline event deleted. Narrative updated.");
    window.setTimeout(() => setToast(""), 1200);
  };

  const addEvent = (sourceType: TimelineEvent["sourceType"] = "clinician-observed") => {
    const event: TimelineEvent = {
      id: crypto.randomUUID(),
      timestamp: currentTimeLabel(),
      eventType: sourceType,
      sourceType,
      title: sourceType.replace("-", " "),
      description: "Additional de-identified event added to the patient story timeline.",
      linkedSymptomIds: input.selectedSymptoms.slice(0, 2),
      linkedObservationIds: input.observations.slice(0, 2)
    };
    pulse();
    update({ timelineEvents: [...input.timelineEvents, event] }, "clinical_event_added", "timeline", { sourceType });
    setToast("Timeline event added. Narrative updated.");
    window.setTimeout(() => setToast(""), 1200);
  };

  const selectWorkflowMode = (selectedMode: typeof input.selectedMode) => {
    const modeDefinition = getClinicalWorkflowMode(selectedMode);
    update({ selectedMode }, "workflow_mode_selected", "narrative", {
      selectedMode,
      trackingMetadata: modeDefinition.trackingMetadata,
      eventWeighting: modeDefinition.eventWeighting,
      requiredOutputSections: modeDefinition.requiredOutputSections
    });
  };

  const generateNarrativeClick = () => {
    const nextSession = syncSessionFromInput(session, input, {
      totalInteractions: session.totalInteractions + 1,
      generatedNarratives: { ...session.generatedNarratives, [output.mode]: output.text }
    });
    setReviewed(false);
    setSession(nextSession);
    logWorkflowEvent(nextSession, input, "narrative_generate_clicked", "narrative", {
      mode: output.mode,
      trackingMetadata: output.trackingMetadata,
      requiredOutputSections: output.requiredOutputSections
    });
    setToast(`${getClinicalWorkflowMode(output.mode).label} narrative generated.`);
    window.setTimeout(() => setToast(""), 1400);
  };

  const buildStory = () => {
    const missing = [
      !input.role && "role",
      !input.specialty && "specialty",
      !input.complaintGroup && "complaint group",
      input.selectedSymptoms.length === 0 && input.observations.length === 0 && "at least one symptom or observation"
    ].filter(Boolean);
    if (missing.length) {
      setStoryError(`Select ${missing.join(", ")} first.`);
      return;
    }
    const symptomText = symptomLabels.length ? symptomLabels.join(", ") : input.complaintGroup.name.toLowerCase();
    const observationText = observationLabels.length ? ` Observations selected: ${observationLabels.join(", ")}.` : "";
    const negativeText = input.selectedNegatives.length ? ` Patient denies ${input.selectedNegatives.join(", ")}.` : "";
    const autoEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      timestamp: currentTimeLabel(),
      eventType: "patient-stated",
      sourceType: "patient-stated",
      title: "Initial patient story",
      description: `Patient reports ${input.complaintGroup.name.toLowerCase()} with ${symptomText}.${observationText}${negativeText}`,
      linkedSymptomIds: input.selectedSymptoms,
      linkedObservationIds: input.observations
    };
    const nextInput = {
      ...input,
      timelineEvents: input.timelineEvents.length ? input.timelineEvents : [autoEvent]
    };
    const story = buildClinicalStory(nextInput);
    setClinicalStory(story);
    setStoryError("");
    setToast("Clinical story built from selected facts.");
    setInput(nextInput);
    const nextSession = syncSessionFromInput(session, nextInput, {
      totalInteractions: session.totalInteractions + 1
    });
    setSession(nextSession);
    logWorkflowEvent(nextSession, nextInput, "clinical_story_built", "timeline", { completenessScore: story.completenessScore });
    window.setTimeout(() => setToast(""), 1800);
  };

  const loadScenario = (scenarioId: string) => {
    const scenario = demoScenarios.find((item) => item.id === scenarioId);
    if (!scenario) return;
    setInput(scenario.input);
    setActiveScenarioId(scenario.id);
    const nextSession = createSession(scenario.input, scenario.id);
    const countedSession = { ...nextSession, totalInteractions: 1 };
    saveSession(countedSession);
    setSession(countedSession);
    setReviewed(false);
    setFeedbackOpen(false);
    setEditedNarrative("");
    setClinicalStory(null);
    setScenarioExpanded(false);
    setClinicalStory(buildClinicalStory(scenario.input));
    logWorkflowEvent(countedSession, scenario.input, "scenario_loaded", "complaint", { scenarioId });
  };

  const resetSession = () => {
    const nextInput = mode === "demo" ? demoSession : applySettingsToBlank(blankSession);
    setInput(nextInput);
    setActiveScenarioId(mode === "demo" ? "gi-abdominal-pain" : "");
    const nextSession = createSession(nextInput, mode === "demo" ? "gi-abdominal-pain" : undefined);
    setSession(nextSession);
    setReviewed(false);
    setFeedbackOpen(false);
    setEditedNarrative("");
    setClinicalStory(null);
    setScenarioExpanded(mode === "demo");
  };

  const resetDemoData = () => {
    resetWorkflowDemoData();
    clearWorkflowMigrationNotice();
    const nextInput = mode === "demo" ? demoSession : applySettingsToBlank(blankSession);
    const nextSession = createSession(nextInput, mode === "demo" ? "gi-abdominal-pain" : undefined);
    setInput(nextInput);
    setSession(nextSession);
    setReviewed(false);
    setFeedbackOpen(false);
    setEditedNarrative("");
    setClinicalStory(null);
    setLegacyEventsReset(false);
    setToast("Demo data reset.");
    window.setTimeout(() => setToast(""), 1400);
  };

  const completeReview = (value: boolean) => {
    setReviewed(value);
    const nextSession = syncSessionFromInput(session, input, {
      reviewCompleted: value,
      userEditedNarrative: editedNarrative,
      totalInteractions: session.totalInteractions + (value ? 1 : 0)
    });
    setSession(nextSession);
    if (value) {
      logWorkflowEvent(nextSession, input, "review_gate_accepted", "review", { mode: output.mode });
      saveNarrativeRevision(session.sessionId, output.mode, output.text, editedNarrative, true, false);
    }
  };

  const copyToEhr = () => {
    const start = new Date(session.createdAt).getTime();
    const nextSession = syncSessionFromInput(session, input, {
      copiedToEhr: true,
      reviewCompleted: true,
      userEditedNarrative: editedNarrative,
      timeToCopyMs: Date.now() - start,
      totalInteractions: session.totalInteractions + 1
    });
    setSession(nextSession);
    logWorkflowEvent(nextSession, input, "ehr_copy_clicked", "copy", { mode: output.mode });
    logWorkflowEvent(nextSession, input, "demo_completed", "feedback", { mode: output.mode });
    saveNarrativeRevision(session.sessionId, output.mode, output.text, editedNarrative, true, true);
    setFeedbackOpen(true);
    setToast("Copied to EHR.");
    window.setTimeout(() => setToast(""), 1600);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-32 pt-5 md:px-8">
      <div className="mb-6 flex items-center justify-between rounded-[2rem] border border-line bg-white/80 p-4 shadow-soft backdrop-blur">
        <div>
          <p className="text-xl font-bold tracking-tight text-ink">{mode === "demo" ? "Interactive Demo" : "New Patient Story"}</p>
          <p className="text-xs text-muted">
            {mode === "demo"
              ? "Start with preloaded clinical scenarios to see NarrativeIQ working instantly."
              : "Start blank and build a patient story from scratch."}
          </p>
        </div>
        <button className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-muted shadow-lift hover:bg-hover" onClick={resetSession} type="button">
          Reset session
        </button>
      </div>

      <SafetyBanner />
      <div className="mt-4 rounded-3xl border border-blue/20 bg-soft-blue p-4 text-sm text-slate-700">
        <strong>Do not enter patient identifiers.</strong> This demo is for de-identified workflow testing only.
      </div>
      <div className="mt-4">
        <DemoProgress completeness={completeness} timelineCompleteness={timelineCompleteness} quality={quality} interactions={session.totalInteractions} legacyEventsReset={legacyEventsReset} onResetDemoData={resetDemoData} />
      </div>
      {toast && <div className="fixed right-4 top-24 z-50 rounded-2xl bg-green px-4 py-3 text-sm font-semibold text-white shadow-soft">{toast}</div>}
      {mode === "demo" && (
      <div className="mt-4 clinical-card rounded-[2rem] p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="section-kicker">Demo Scenario</p>
            <p className="text-sm font-semibold text-ink">{activeScenarioId ? `Loaded: ${demoScenarios.find((scenario) => scenario.id === activeScenarioId)?.title ?? "Scenario"}` : "Choose a scenario"}</p>
          </div>
          <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:bg-hover" onClick={() => setScenarioExpanded(!scenarioExpanded)} type="button">
                {scenarioExpanded ? "Done" : "Edit"}
          </button>
        </div>
        {scenarioExpanded && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {demoScenarios.map((scenario) => {
              const active = activeScenarioId === scenario.id;
              return (
              <button key={scenario.id} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-blue bg-blue text-white shadow-lift" : "border-line bg-white text-slate-700 hover:bg-hover"}`} onClick={() => loadScenario(scenario.id)} type="button" title={scenario.description}>
                {active ? "✓ " : ""}{scenario.title}
              </button>
              );
            })}
          </div>
        )}
      </div>
      )}

      <div className="mt-6 grid gap-5 xl:grid-cols-[360px_minmax(420px,1fr)_380px] xl:items-start">
        <section className="space-y-5">
          <div className="clinical-card rounded-[2rem] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-kicker">Role + Scope</p>
                <p className="mt-1 text-sm font-semibold text-ink">Role: {input.role.name}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{input.role.safetyDisclosure}</p>
              </div>
              <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:bg-hover" onClick={() => setRoleExpanded(!roleExpanded)} type="button">
                {roleExpanded ? "Done" : "Edit"}
              </button>
            </div>
            {roleExpanded && <div className="mt-3"><RoleSelector roles={roleScopes} selected={input.role} onSelect={selectRole} /></div>}
          </div>
          <div className="clinical-card rounded-[2rem] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-kicker">Clinical Context</p>
                <p className="mt-1 text-sm font-semibold text-ink">Specialty: {input.specialty.name}</p>
                <p className="mt-1 text-xs leading-5 text-muted">Complaint: {input.complaintGroup.name}</p>
              </div>
              <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:bg-hover" onClick={() => setContextExpanded(!contextExpanded)} type="button">
                {contextExpanded ? "Done" : "Edit"}
              </button>
            </div>
            {contextExpanded && (
              <div className="mt-3 space-y-3">
                <SpecialtySelector specialties={activeSpecialties} selected={input.specialty} onSelect={selectSpecialty} />
                <ComplaintGroupSelector groups={input.specialty.complaintGroups} selected={input.complaintGroup} onSelect={selectComplaintGroup} />
              </div>
            )}
          </div>
          <div className="clinical-card rounded-[2rem] p-4">
            <p className="section-kicker mb-3">Symptoms</p>
            <SymptomChipCloud symptoms={input.complaintGroup.symptoms} selected={input.selectedSymptoms} onToggle={(id) => toggleArrayValue("selectedSymptoms", id)} />
          </div>
          <ChipSection variant="negative" title="Pertinent Negatives" items={input.complaintGroup.pertinentNegatives} selected={input.selectedNegatives} onToggle={(value) => toggleArrayValue("selectedNegatives", value)} prefix="Denies" />
          <ChipSection variant="observation" title="Observations" items={input.complaintGroup.observations.map((item) => item.label)} selected={input.observations.map((id) => input.complaintGroup.observations.find((item) => item.id === id)?.label ?? id)} onToggle={(label) => toggleArrayValue("observations", input.complaintGroup.observations.find((item) => item.label === label)?.id ?? label)} />
          <ChipSection variant="intervention" title="Interventions" items={input.complaintGroup.interventions} selected={input.interventions} onToggle={(value) => toggleArrayValue("interventions", value)} />
        </section>

        <section ref={timelineRef} className="space-y-5 xl:order-none -order-1">
          <TimelineBuilder
            events={input.timelineEvents}
            selectedSymptomIds={input.selectedSymptoms}
            selectedObservationIds={input.observations}
            onMove={moveEvent}
            onAdd={() => addEvent("patient-stated")}
            onBuildClinicalStory={buildStory}
            onUpdate={updateTimelineEvent}
            onDelete={deleteTimelineEvent}
            symptoms={input.complaintGroup.symptoms}
            observations={input.complaintGroup.observations}
          />
          <div className="clinical-card rounded-[2rem] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-kicker">Build Clinical Story</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">Validate selected facts, create the structured story, auto-start the timeline if needed, and refresh narrative modes.</p>
              </div>
              <button className="shrink-0 rounded-2xl bg-blue px-4 py-3 text-sm font-semibold text-white shadow-lift hover:bg-blue/90" onClick={buildStory} type="button">
                Build Clinical Story
              </button>
            </div>
            {storyError && <p className="mt-3 rounded-2xl border border-critical/20 bg-soft-red p-3 text-sm text-critical">{storyError}</p>}
            {clinicalStory && (
              <div className="mt-4 rounded-2xl border border-line bg-slate-50 p-4">
                <p className="text-sm font-semibold text-ink">{clinicalStory.completenessScore}% complete story</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{clinicalStory.storySummary}</p>
                {clinicalStory.missingElements.length > 0 && <p className="mt-2 text-xs text-muted">Missing: {clinicalStory.missingElements.join(", ")}</p>}
              </div>
            )}
          </div>
          <ChipSection variant="default" title="Timing + Modifiers" items={[...input.complaintGroup.timingOptions, ...input.complaintGroup.modifiers, ...input.complaintGroup.severityOptions]} selected={[input.onset, input.severity, ...input.modifiers]} onToggle={(value) => {
            if (input.complaintGroup.timingOptions.includes(value)) update({ onset: value });
            else if (input.complaintGroup.severityOptions.includes(value)) update({ severity: value });
            else toggleArrayValue("modifiers", value);
          }} />
          <div className="clinical-card rounded-[2rem] p-4">
            <p className="section-kicker">Clinical Story</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              The Clinical Story is the structured patient narrative built from symptoms, observations, timeline events, interventions, and reassessments. NarrativeIQ transforms the same clinical story into different documentation formats.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-blue">
              {["Symptoms", "Timeline", "Story", "Narrative Modes"].map((item, index) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="rounded-full bg-soft-blue px-3 py-1">{item}</span>
                  {index < 3 && <span className="text-muted">→</span>}
                </span>
              ))}
            </div>
          </div>
        </section>

        <aside className="sticky bottom-24 space-y-4 self-start xl:top-5">
          <NarrativeStyleTabs allowedModes={input.role.allowedModes} selected={output.mode} onSelect={selectWorkflowMode} onGenerate={generateNarrativeClick} />
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
          <div className="rounded-3xl border border-line bg-white p-4 shadow-lift">
            <p className="section-kicker">Patient Story Completeness</p>
            <div className="mt-3"><MetricBar label="Completeness" value={completeness} /></div>
            <div className="mt-3 grid gap-2">
              {completenessItems.map(([label, done]) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className={done ? "font-semibold text-ink" : "text-muted"}>{label}</span>
                  <span className={done ? "text-green" : "text-muted"}>{done ? "Done" : "Needed"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sticky bottom-24 z-30 rounded-3xl border border-line bg-white/95 p-3 shadow-soft backdrop-blur xl:bottom-4" data-testid="review-copy-action-bar">
            <div className="grid gap-2">
              <ReviewGate reviewed={reviewed} onReviewedChange={completeReview} />
              <CopyToEhrButton reviewed={reviewed} narrative={activeNarrative} onCopied={copyToEhr} />
            </div>
          </div>
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
  variant?: "default" | "negative" | "observation" | "intervention" | "redFlag";
};

function ChipSection({ title, items, selected, onToggle, prefix, variant = "default" }: ChipSectionProps) {
  const tone = variant === "observation" ? "teal" : variant === "intervention" ? "green" : variant === "redFlag" ? "red" : "default";
  return (
    <div className="clinical-card rounded-[2rem] p-3">
      <p className="section-kicker mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <SelectableChip
              key={item}
              label={item}
              selected={active}
              onClick={() => onToggle(item)}
              prefix={prefix}
              tone={tone}
            />
          );
        })}
      </div>
    </div>
  );
}
