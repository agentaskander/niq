import type { NarrativeInput, NarrativeModeId, NarrativeOutput, TimelineEvent } from "./types";
import { getClinicalWorkflowMode } from "./clinicalWorkflowModes";

const globalBlockedPhrases = [
  "diagnosed with",
  "consistent with cholecystitis",
  "order ultrasound",
  "start antibiotics",
  "prescribe",
  "rule out MI",
  "automatic chart submission"
];

const safeAlternatives = [
  "symptoms documented for provider evaluation",
  "provider notified per protocol",
  "further evaluation deferred to licensed provider",
  "assessment findings communicated to provider"
];

const compact = (parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

const sentence = (value: string) => {
  const clean = value.trim();
  if (!clean) return "";
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
};

const list = (items: string[]) => items.filter(Boolean).join(", ");

const selectedSymptomLabels = (input: NarrativeInput) =>
  input.selectedSymptoms
    .map((id) => input.complaintGroup.symptoms.find((symptom) => symptom.id === id)?.label)
    .filter(Boolean) as string[];

const selectedObservationLabels = (input: NarrativeInput) =>
  input.observations
    .map((id) => input.complaintGroup.observations.find((observation) => observation.id === id)?.label)
    .filter(Boolean) as string[];

const timelineSummary = (events: TimelineEvent[]) =>
  events.map((event) => `${event.timestamp}: ${event.title} - ${event.description}`).join(" ");

export function scrubUnsupportedLanguage(text: string, blockedPhrases = globalBlockedPhrases) {
  return blockedPhrases.reduce(
    (safeText, phrase) => safeText.replace(new RegExp(phrase, "gi"), safeAlternatives[0]),
    text
  );
}

function safetyFlags(input: NarrativeInput) {
  const roleFlags = input.role.restrictedLanguage.map((phrase) => `Blocked phrase for ${input.role.name}: ${phrase}`);
  return [
    "Review required before copy/export.",
    "No PHI storage in MVP.",
    "Copy-to-EHR only; no final chart submission.",
    ...roleFlags
  ];
}

function coreFacts(input: NarrativeInput) {
  const symptoms = selectedSymptomLabels(input);
  return compact([
    `Patient reports ${input.chiefComplaint}`,
    input.onset && `beginning ${input.onset}`,
    input.severity && `rated ${input.severity}`,
    symptoms.length ? `with ${list(symptoms)}` : false,
    input.modifiers.length ? `Modifiers: ${list(input.modifiers)}.` : false
  ]);
}

function providerDraftAllowed(input: NarrativeInput) {
  return input.role.allowsAssessmentPlan;
}

function buildSections(input: NarrativeInput): Record<string, string> {
  const facts = sentence(coreFacts(input));
  const symptoms = selectedSymptomLabels(input);
  const observations = selectedObservationLabels(input);
  const timeline = timelineSummary(input.timelineEvents);
  const negatives = input.selectedNegatives.length ? `Patient denies ${list(input.selectedNegatives)}.` : "";
  const interventions = input.interventions.length ? `Interventions completed: ${list(input.interventions)}.` : "";
  const statements = input.patientStatements.map((statement) => `Patient states, "${statement}"`).join(" ");
  const observed = observations.length ? `Observed findings: ${list(observations)}.` : "";
  const providerNotice = input.providerNotification || input.interventions.some((item) => item.toLowerCase().includes("provider"))
    ? sentence(input.providerNotification || "Provider notified per protocol")
    : "";
  const disposition = sentence(input.disposition || "Awaiting provider direction");

  return {
    core: facts,
    timeline,
    statements,
    negatives,
    observations: observed,
    interventions,
    reassessment: sentence(input.responseToIntervention),
    providerNotification: providerNotice,
    disposition,
    hpi: compact([facts, statements, symptoms.length ? `Associated symptoms include ${list(symptoms)}.` : false, negatives]),
    assessmentDraft: providerDraftAllowed(input)
      ? "Assessment draft: clinical impression field reserved for licensed clinician review."
      : "Assessment findings communicated to provider. Further evaluation deferred to licensed provider.",
    planDraft: providerDraftAllowed(input)
      ? "Plan draft: follow-up, diagnostics, and treatment decisions deferred to reviewing clinician."
      : "Provider evaluation requested. Awaiting provider direction."
  };
}

function selectMode(input: NarrativeInput): NarrativeModeId {
  if (input.role.allowedModes.includes(input.selectedMode)) return input.selectedMode;
  return input.role.defaultMode;
}

export function generateNarrative(input: NarrativeInput): NarrativeOutput {
  const mode = selectMode(input);
  const modeDefinition = getClinicalWorkflowMode(mode);
  const sections = buildSections({ ...input, selectedMode: mode });
  const observations = sections.observations;
  const timeline = sections.timeline;
  const redFlags = input.complaintGroup.redFlags.length ? list(input.complaintGroup.redFlags) : "None configured for this complaint group.";
  const pending = sections.disposition || "Awaiting provider direction.";
  let text = "";

  if (mode === "nursing") {
    text = [
      `Bedside timeline: ${timeline || sections.core || "No timeline events entered."}`,
      `Symptoms: ${compact([sections.core, sections.negatives])}`,
      `Interventions and tasks: ${sections.interventions || "No interventions selected."}`,
      `Safety and continuity: ${compact([observations, sections.reassessment, sections.providerNotification, "Symptoms documented for provider evaluation."])}`
    ].join("\n");
  }

  if (mode === "advanced") {
    text = [
      `Clinical facts: ${sections.hpi}`,
      `Timeline summary: ${timeline || "No timeline events entered."}`,
      `Structured metadata: mode=${modeDefinition.id}; audience=${modeDefinition.trackingMetadata.audience}; weighting=${JSON.stringify(modeDefinition.eventWeighting)}.`,
      `Audit detail: selected symptoms ${input.selectedSymptoms.length}; observations ${input.observations.length}; interventions ${input.interventions.length}; timeline events ${input.timelineEvents.length}.`,
      `Review controls: ${compact([sections.providerNotification, "Further evaluation deferred to licensed provider."])}`
    ].join("\n");
  }

  if (mode === "provider") {
    text = [
      `HPI: ${sections.hpi}`,
      `Pertinent negatives: ${sections.negatives || "None selected."}`,
      `Exam/observations: ${observations || "No observations selected."}`,
      providerDraftAllowed(input) ? sections.assessmentDraft : "Clinical impression: not generated for selected role.",
      providerDraftAllowed(input) ? sections.planDraft : "Plan: provider direction pending.",
      `MDM and compliance context: draft only, source facts preserved, clinician review required before orders, billing support, or chart use.`,
      "Clinician review required."
    ].join("\n");
  }

  if (mode === "soap") {
    const soapSections = [
      `Subjective: ${compact([sections.core, sections.statements, sections.negatives])}`,
      `Objective: ${compact([observations, timeline ? `Timeline: ${timeline}` : false])}`
    ];
    soapSections.push(providerDraftAllowed(input) ? `Assessment: ${sections.assessmentDraft}` : "Assessment: not generated for selected role. Provider evaluation requested.");
    soapSections.push(providerDraftAllowed(input) ? `Plan: ${sections.planDraft}` : "Plan: provider direction pending.");
    soapSections.push("Clinician review required.");
    text = soapSections.join("\n");
  }

  if (mode === "sbar") {
    text = [
      `Situation: ${sections.core}`,
      `Background: ${compact([sections.statements, timeline ? `Timeline: ${timeline}` : false])}`,
      `Assessment: ${compact([sections.negatives, observations, sections.reassessment])}`,
      `Recommendation/Request: ${compact([sections.providerNotification, sections.disposition])}`
    ].join("\n");
  }

  if (mode === "handoff") {
    text = [
      `Current concern: ${sections.core}`,
      `Timeline: ${timeline || "No timeline events entered."}`,
      `Completed interventions: ${input.interventions.length ? list(input.interventions) : "None documented."}`,
      `Response: ${sections.reassessment || "Response pending reassessment."}`,
      `Open loops: ${pending}`,
      `Risks / unresolved items: ${input.selectedNegatives.length ? `Pertinent negatives documented: ${list(input.selectedNegatives)}.` : "No safety concerns selected."}`,
      `Pending actions: ${pending}`
    ].join("\n");
  }

  if (mode === "triage") {
    text = [
      `Chief complaint: ${input.chiefComplaint}.`,
      `Acuity: ${compact([input.onset && `Onset ${input.onset}.`, input.severity && `Severity ${input.severity}.`, observations || "No acuity observations selected."])}`,
      `Red flags: considered ${redFlags}. ${input.selectedNegatives.length ? `Denied/present by selection: denies ${list(input.selectedNegatives)}.` : ""}`,
      `Disposition: ${pending} No final diagnosis assigned; symptoms documented for provider evaluation.`
    ].join("\n");
  }

  if (mode === "telehealth") {
    text = [
      `Patient-reported symptoms: ${compact([sections.core, sections.statements])}`,
      `Remote constraints: physical exam limited to patient-reported history and observable video/phone cues documented in this session.`,
      `Limited exam: ${observations || "No remote observations selected."}`,
      `Follow-up: reviewing clinician to complete.`,
      `Escalation: reviewing clinician to complete escalation precautions.`,
      "Clinician review required."
    ].join("\n");
  }

  return {
    mode,
    text: scrubUnsupportedLanguage(text, [...globalBlockedPhrases, ...input.role.restrictedLanguage]),
    sections,
    requiredOutputSections: modeDefinition.requiredOutputSections,
    eventWeighting: modeDefinition.eventWeighting,
    trackingMetadata: modeDefinition.trackingMetadata,
    moatInsight: modeDefinition.moatInsight,
    safetyFlags: safetyFlags(input),
    reviewRequired: true
  };
}

export const blockedPhrasesForRN = globalBlockedPhrases;
