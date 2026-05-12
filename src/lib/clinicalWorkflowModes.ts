import type { NarrativeModeId, WorkflowEventType } from "./types";

export type WorkflowTrackingMetadata = {
  workflowMode: NarrativeModeId;
  audience: string;
  cognitiveFrame: string;
  urgencyLogic: string;
  continuityLogic: string;
  analyticsCategory: string;
  outputEventType?: WorkflowEventType;
};

export type ClinicalWorkflowModeDefinition = {
  id: NarrativeModeId;
  label: string;
  audience: string;
  clinicalIntent: string;
  narrativeStructure: string[];
  eventWeighting: Record<string, number>;
  requiredOutputSections: string[];
  trackingMetadata: WorkflowTrackingMetadata;
  moatInsight: string;
};

export const clinicalWorkflowModes: ClinicalWorkflowModeDefinition[] = [
  {
    id: "nursing",
    label: "Nursing",
    audience: "Bedside nurses and shift teams",
    clinicalIntent: "Capture bedside care, medications, symptoms, tasks, safety concerns, reassessment, and shift continuity.",
    narrativeStructure: ["Bedside timeline", "Selected symptoms", "Pertinent negatives", "Interventions", "Reassessment", "Provider notification"],
    eventWeighting: { timeline: 1.4, interventions: 1.3, safety: 1.2, assessment: 0.4 },
    requiredOutputSections: ["Bedside timeline", "Symptoms", "Interventions and tasks", "Safety and continuity"],
    trackingMetadata: {
      workflowMode: "nursing",
      audience: "bedside-care",
      cognitiveFrame: "bedside intervention and reassessment",
      urgencyLogic: "surface safety concerns and provider notification",
      continuityLogic: "carry tasks and response to intervention across the shift",
      analyticsCategory: "nursing_documentation"
    },
    moatInsight: "Nursing mode weights time, tasks, bedside interventions, and continuity so the note reads like care delivered at the bedside, not a generic clinical summary."
  },
  {
    id: "advanced",
    label: "Advanced",
    audience: "Power users, reviewers, clinical operations, and demo operators",
    clinicalIntent: "Expose deeper metadata, audit detail, confidence cues, and review controls without counting passive recalculation as work.",
    narrativeStructure: ["Clinical facts", "Timeline summary", "Structured metadata", "Audit detail", "Review controls"],
    eventWeighting: { timeline: 1.2, metadata: 1.5, audit: 1.4, review: 1.3 },
    requiredOutputSections: ["Clinical facts", "Structured metadata", "Audit detail", "Review controls"],
    trackingMetadata: {
      workflowMode: "advanced",
      audience: "advanced-review",
      cognitiveFrame: "audit-ready clinical synthesis",
      urgencyLogic: "flag review gates without auto-creating interactions",
      continuityLogic: "preserve source facts and edit traceability",
      analyticsCategory: "advanced_review"
    },
    moatInsight: "Advanced mode demonstrates the product moat by exposing provenance, review state, and audit detail while excluding render and recalculation noise from analytics."
  },
  {
    id: "provider",
    label: "Provider",
    audience: "Physicians, NPs, PAs, urgent care clinicians",
    clinicalIntent: "Frame the story around assessment, clinical reasoning, plan, orders, MDM, and compliance-oriented review.",
    narrativeStructure: ["HPI", "Pertinent negatives", "Exam and observations", "Assessment draft", "Plan draft", "MDM and compliance context"],
    eventWeighting: { hpi: 1.2, observations: 1.2, assessment: 1.5, plan: 1.5, compliance: 1.2 },
    requiredOutputSections: ["HPI", "Exam and observations", "Assessment", "Plan", "MDM and compliance"],
    trackingMetadata: {
      workflowMode: "provider",
      audience: "licensed-provider",
      cognitiveFrame: "assessment, plan, and medical decision support draft",
      urgencyLogic: "prioritize decision points and review-required plan fields",
      continuityLogic: "connect symptoms, objective cues, and pending orders",
      analyticsCategory: "provider_documentation"
    },
    moatInsight: "Provider mode changes the cognitive frame toward assessment, MDM, and plan review, while keeping draft language and clinician review boundaries explicit."
  },
  {
    id: "soap",
    label: "SOAP",
    audience: "Clinicians using SOAP progress-note structure",
    clinicalIntent: "Transform the story into Subjective, Objective, Assessment, and Plan sections.",
    narrativeStructure: ["Subjective", "Objective", "Assessment", "Plan"],
    eventWeighting: { subjective: 1.1, objective: 1.2, assessment: 1.4, plan: 1.4 },
    requiredOutputSections: ["Subjective", "Objective", "Assessment", "Plan"],
    trackingMetadata: {
      workflowMode: "soap",
      audience: "soap-note",
      cognitiveFrame: "problem-oriented SOAP documentation",
      urgencyLogic: "separate patient report from objective cues and draft decisions",
      continuityLogic: "turn the same facts into a progress-note structure",
      analyticsCategory: "soap_output",
      outputEventType: "soap_created"
    },
    moatInsight: "SOAP mode proves the same clinical story can become a structured progress note with section-level reasoning, not just reformatted prose."
  },
  {
    id: "sbar",
    label: "SBAR",
    audience: "Escalation, team communication, and rapid handoff workflows",
    clinicalIntent: "Focus on Situation, Background, Assessment, and Recommendation with urgency and escalation logic.",
    narrativeStructure: ["Situation", "Background", "Assessment", "Recommendation"],
    eventWeighting: { situation: 1.4, urgency: 1.5, escalation: 1.5, background: 0.9 },
    requiredOutputSections: ["Situation", "Background", "Assessment", "Recommendation"],
    trackingMetadata: {
      workflowMode: "sbar",
      audience: "escalation-communication",
      cognitiveFrame: "urgent team communication",
      urgencyLogic: "push current concern and recommendation to the top",
      continuityLogic: "carry background only as needed for escalation",
      analyticsCategory: "sbar_output",
      outputEventType: "sbar_created"
    },
    moatInsight: "SBAR mode reweights the story toward urgency, escalation, and recommendation so the output supports fast clinical communication."
  },
  {
    id: "handoff",
    label: "Handoff",
    audience: "Shift change, care transitions, and receiving teams",
    clinicalIntent: "Preserve continuity by emphasizing open loops, pending actions, risks, unresolved items, and what must happen next.",
    narrativeStructure: ["Current concern", "Timeline", "Completed actions", "Open loops", "Risks", "Pending actions"],
    eventWeighting: { timeline: 1.3, pending: 1.5, risks: 1.4, continuity: 1.5 },
    requiredOutputSections: ["Current concern", "Timeline", "Open loops", "Risks", "Pending actions"],
    trackingMetadata: {
      workflowMode: "handoff",
      audience: "shift-continuity",
      cognitiveFrame: "continuity, unresolved work, and risk transfer",
      urgencyLogic: "highlight unresolved safety concerns and pending follow-up",
      continuityLogic: "make open loops explicit for the receiving clinician",
      analyticsCategory: "handoff_output",
      outputEventType: "handoff_created"
    },
    moatInsight: "Handoff mode is built around continuity debt: pending tasks, risks, and unresolved items are treated as first-class documentation signals."
  },
  {
    id: "triage",
    label: "Triage",
    audience: "Triage nurses, urgent care intake, routing, and access teams",
    clinicalIntent: "Summarize chief complaint, acuity cues, red flags, and disposition or routing needs.",
    narrativeStructure: ["Chief complaint", "Acuity", "Red flags", "Disposition"],
    eventWeighting: { chiefComplaint: 1.3, acuity: 1.5, redFlags: 1.5, disposition: 1.4 },
    requiredOutputSections: ["Chief complaint", "Acuity", "Red flags", "Disposition"],
    trackingMetadata: {
      workflowMode: "triage",
      audience: "triage-routing",
      cognitiveFrame: "acuity and disposition routing",
      urgencyLogic: "prioritize red flags and acuity cues",
      continuityLogic: "route the patient to the right next step",
      analyticsCategory: "triage_output",
      outputEventType: "triage_created"
    },
    moatInsight: "Triage mode changes the weighting from narrative completeness to acuity, red flags, and routing, which is a different clinical job."
  },
  {
    id: "telehealth",
    label: "Telehealth",
    audience: "Remote clinicians and virtual care teams",
    clinicalIntent: "Document patient-reported symptoms, remote exam constraints, follow-up, and escalation precautions.",
    narrativeStructure: ["Patient-reported symptoms", "Remote constraints", "Limited exam", "Follow-up", "Escalation"],
    eventWeighting: { patientReported: 1.5, remoteLimitations: 1.4, followUp: 1.3, escalation: 1.4 },
    requiredOutputSections: ["Patient-reported symptoms", "Remote constraints", "Limited exam", "Follow-up", "Escalation"],
    trackingMetadata: {
      workflowMode: "telehealth",
      audience: "virtual-care",
      cognitiveFrame: "remote patient-reported care with limited exam",
      urgencyLogic: "make escalation precautions explicit when exam is constrained",
      continuityLogic: "document follow-up and remote limitations",
      analyticsCategory: "telehealth_output",
      outputEventType: "telehealth_summary_created"
    },
    moatInsight: "Telehealth mode treats patient-reported data and limited remote exam constraints as core facts, then makes follow-up and escalation visible."
  }
];

export function getClinicalWorkflowMode(modeId: NarrativeModeId) {
  return clinicalWorkflowModes.find((mode) => mode.id === modeId) ?? clinicalWorkflowModes[0];
}

export function getAllowedClinicalWorkflowModes(allowedModes: NarrativeModeId[]) {
  return clinicalWorkflowModes.filter((mode) => allowedModes.includes(mode.id));
}
