import { generateNarrative } from "../lib/narrativeEngine";
import { getClinicalWorkflowMode } from "../lib/clinicalWorkflowModes";
import type { ClinicalStory, NarrativeInput, NarrativeModeId, NarrativeOutput, RoleScope, WorkflowEvent } from "../lib/types";

const labelsFromIds = <T extends { id: string; label: string }>(ids: string[], options: T[]) =>
  ids.map((id) => options.find((item) => item.id === id)?.label ?? id);

export function calculateStoryCompleteness(input: NarrativeInput) {
  const checks = [
    Boolean(input.role),
    Boolean(input.complaintGroup),
    input.selectedSymptoms.length > 0,
    Boolean(input.onset || input.severity),
    input.selectedNegatives.length > 0,
    input.observations.length > 0,
    input.timelineEvents.length >= 2,
    input.interventions.length > 0
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function getAllowedNarrativeModes(role: RoleScope) {
  return role.allowedModes;
}

export function buildClinicalStory(input: NarrativeInput): ClinicalStory {
  const selectedSymptoms = labelsFromIds(input.selectedSymptoms, input.complaintGroup.symptoms);
  const selectedObservations = labelsFromIds(input.observations, input.complaintGroup.observations);
  const missingElements = [
    !input.complaintGroup ? "Select complaint group" : "",
    input.selectedSymptoms.length === 0 ? "Select at least one symptom" : "",
    !input.onset && !input.severity ? "Add timing or severity" : "",
    input.timelineEvents.length < 2 ? "Add at least two timeline events" : "",
    input.selectedNegatives.length === 0 ? "Select pertinent negatives" : "",
    input.observations.length === 0 ? "Add clinician observations" : ""
  ].filter(Boolean);

  const storySummary = [
    `${input.role.name} story for ${input.specialty.name} / ${input.complaintGroup.name}.`,
    `Chief concern: ${input.chiefComplaint}.`,
    selectedSymptoms.length ? `Selected symptoms: ${selectedSymptoms.join(", ")}.` : "",
    input.selectedNegatives.length ? `Pertinent negatives: ${input.selectedNegatives.join(", ")}.` : "",
    selectedObservations.length ? `Observations: ${selectedObservations.join(", ")}.` : "",
    input.timelineEvents.length ? `Timeline events: ${input.timelineEvents.length}.` : ""
  ].filter(Boolean).join(" ");

  return {
    role: input.role.id,
    scopeLabel: input.role.name,
    specialty: input.specialty.name,
    complaintGroup: input.complaintGroup.name,
    chiefConcern: input.chiefComplaint,
    selectedSymptoms,
    selectedNegatives: input.selectedNegatives,
    selectedObservations,
    selectedInterventions: input.interventions,
    timelineEvents: input.timelineEvents,
    storySummary,
    missingElements,
    completenessScore: calculateStoryCompleteness(input),
    safetyFlags: [
      "Review required before copy/export.",
      "No PHI storage in demo.",
      ...input.role.restrictedLanguage.map((phrase) => `Restricted language: ${phrase}`)
    ]
  };
}

export function generateNarrativeFromStory(story: ClinicalStory, mode: NarrativeModeId, input?: NarrativeInput): NarrativeOutput {
  if (input) return generateNarrative({ ...input, selectedMode: mode });
  const modeDefinition = getClinicalWorkflowMode(mode);
  return {
    mode,
    text: story.storySummary,
    sections: { story: story.storySummary },
    requiredOutputSections: modeDefinition.requiredOutputSections,
    eventWeighting: modeDefinition.eventWeighting,
    trackingMetadata: modeDefinition.trackingMetadata,
    moatInsight: modeDefinition.moatInsight,
    safetyFlags: story.safetyFlags,
    reviewRequired: true
  };
}

export function logWorkflowEvent(event: WorkflowEvent) {
  return event;
}
