export type NarrativeModeId =
  | "nursing"
  | "advanced"
  | "provider"
  | "soap"
  | "sbar"
  | "handoff"
  | "triage"
  | "telehealth";

export type RoleScopeId =
  | "rn"
  | "np-pa"
  | "physician"
  | "urgent-care"
  | "telehealth"
  | "home-health";

export type SourceType =
  | "patient-stated"
  | "clinician-observed"
  | "symptom-change"
  | "intervention"
  | "reassessment"
  | "provider-notified"
  | "escalation"
  | "handoff-disposition";

export type ClinicalSymptom = {
  id: string;
  label: string;
  category: string;
  synonyms: string[];
};

export type ClinicalObservation = {
  id: string;
  label: string;
  category: string;
};

export type RoleScope = {
  id: RoleScopeId;
  name: string;
  allowedModes: NarrativeModeId[];
  restrictedLanguage: string[];
  defaultMode: NarrativeModeId;
  safetyDisclosure: string;
  allowsAssessmentPlan: boolean;
};

export type NarrativeMode = {
  id: NarrativeModeId;
  label: string;
  description: string;
};

export type ComplaintGroup = {
  id: string;
  name: string;
  symptoms: ClinicalSymptom[];
  timingOptions: string[];
  severityOptions: string[];
  modifiers: string[];
  pertinentNegatives: string[];
  observations: ClinicalObservation[];
  interventions: string[];
  reassessmentOptions: string[];
  redFlags: string[];
};

export type Specialty = {
  id: string;
  name: string;
  careSettings: string[];
  description: string;
  complaintGroups: ComplaintGroup[];
};

export type TimelineEvent = {
  id: string;
  timestamp: string;
  eventType: string;
  sourceType: SourceType;
  title: string;
  description: string;
  linkedSymptomIds: string[];
  linkedObservationIds: string[];
};

export type WorkflowEventType =
  | "role_selected"
  | "specialty_selected"
  | "complaint_group_selected"
  | "symptom_selected"
  | "symptom_deselected"
  | "negative_selected"
  | "observation_selected"
  | "intervention_selected"
  | "timeline_event_added"
  | "timeline_event_edited"
  | "narrative_generated"
  | "narrative_mode_changed"
  | "narrative_edited"
  | "review_completed"
  | "copied_to_ehr"
  | "session_abandoned"
  | "demo_completed";

export type WorkflowStep =
  | "role"
  | "specialty"
  | "complaint"
  | "facts"
  | "timeline"
  | "narrative"
  | "review"
  | "copy"
  | "feedback";

export type WorkflowEvent = {
  eventId: string;
  sessionId: string;
  timestamp: string;
  eventType: WorkflowEventType;
  payload: Record<string, unknown>;
  step: WorkflowStep;
  role: string;
  specialty: string;
  complaintGroup: string;
};

export type NarrativeRevision = {
  revisionId: string;
  sessionId: string;
  mode: NarrativeModeId;
  generatedText: string;
  editedText: string;
  editDistanceApprox: number;
  accepted: boolean;
  copied: boolean;
  createdAt: string;
};

export type ClinicalStorySession = {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  specialty: string;
  complaintGroup: string;
  selectedSymptoms: string[];
  selectedNegatives: string[];
  selectedObservations: string[];
  selectedInterventions: string[];
  timelineEvents: TimelineEvent[];
  selectedNarrativeMode: NarrativeModeId;
  generatedNarratives: Partial<Record<NarrativeModeId, string>>;
  userEditedNarrative: string;
  reviewCompleted: boolean;
  copiedToEhr: boolean;
  timeToFirstNarrativeMs?: number;
  timeToCopyMs?: number;
  totalInteractions: number;
  abandonedAtStep?: WorkflowStep;
  deviceType: "mobile" | "desktop";
  demoScenarioId?: string;
};

export type OntologyUsageStats = {
  specialty: string;
  complaintGroup: string;
  symptomId: string;
  selectedCount: number;
  coSelectedSymptoms: Record<string, number>;
  narrativeModesUsed: Record<string, number>;
  copyRate: number;
  editRate: number;
};

export type BetaFeedback = {
  feedbackId: string;
  sessionId: string;
  role: string;
  setting: string;
  realismScore: number;
  timeSavingScore: number;
  wouldUseNextShift: string;
  magicalMoment: string;
  unsafeConcern: string;
  requestedSpecialty: string;
  betaInterest: string;
};

export type BetaContact = {
  feedbackId: string;
  contactEmail: string;
  createdAt: string;
};

export type NarrativeInput = {
  role: RoleScope;
  specialty: Specialty;
  complaintGroup: ComplaintGroup;
  selectedSymptoms: string[];
  selectedNegatives: string[];
  observations: string[];
  interventions: string[];
  timelineEvents: TimelineEvent[];
  selectedMode: NarrativeModeId;
  chiefComplaint: string;
  onset: string;
  severity: string;
  modifiers: string[];
  patientStatements: string[];
  responseToIntervention: string;
  providerNotification: string;
  disposition: string;
};

export type NarrativeOutput = {
  mode: NarrativeModeId;
  text: string;
  sections: Record<string, string>;
  safetyFlags: string[];
  reviewRequired: boolean;
};

export type AuditEntry = {
  id: string;
  time: string;
  actor: string;
  action: string;
  detail: string;
};
