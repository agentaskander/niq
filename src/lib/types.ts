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
  severityWeight?: number;
  redFlag?: boolean;
  defaultNarrativeClause?: string;
  applicableRoles?: RoleScopeId[];
  createdAt?: string;
  updatedAt?: string;
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
  specialtyId?: string;
  name: string;
  description?: string;
  symptoms: ClinicalSymptom[];
  timingOptions: string[];
  severityOptions: string[];
  modifiers: string[];
  pertinentNegatives: string[];
  observations: ClinicalObservation[];
  interventions: string[];
  reassessmentOptions: string[];
  reassessmentPrompts?: string[];
  redFlags: string[];
  escalationPrompts?: string[];
  narrativeClauses?: NarrativeClause[];
  roleRestrictions?: Partial<Record<RoleScopeId, string[]>>;
  relatedComplaintGroups?: string[];
};

export type Specialty = {
  id: string;
  name: string;
  careSettings: string[];
  description: string;
  complaintGroups: ComplaintGroup[];
  version?: string;
  updatedAt?: string;
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
  linkedInterventionIds: string[];
  linkedReassessmentIds: string[];
};

export type WorkflowEventType =
  | "scenario_loaded"
  | "role_selected"
  | "specialty_selected"
  | "complaint_group_selected"
  | "symptom_selected"
  | "symptom_deselected"
  | "negative_selected"
  | "negative_deselected"
  | "observation_selected"
  | "observation_deselected"
  | "intervention_selected"
  | "intervention_deselected"
  | "workflow_mode_selected"
  | "clinical_event_added"
  | "clinical_event_edited"
  | "clinical_event_deleted"
  | "timeline_event_added"
  | "timeline_event_edited"
  | "timeline_event_deleted"
  | "timeline_event_reordered"
  | "clinical_story_built"
  | "narrative_generate_clicked"
  | "narrative_generated"
  | "narrative_mode_changed"
  | "narrative_edited"
  | "ehr_copy_clicked"
  | "review_gate_accepted"
  | "review_completed"
  | "copied_to_ehr"
  | "handoff_created"
  | "sbar_created"
  | "soap_created"
  | "triage_created"
  | "telehealth_summary_created"
  | "escalation_flagged"
  | "pending_action_added"
  | "beta_feedback_saved"
  | "ontology_restored_seed"
  | "render"
  | "state_sync"
  | "derived_narrative_updated"
  | "auto_recalculated"
  | "mode_preview_updated"
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
  schemaVersion?: number;
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

export type BetaSignup = {
  signupId: string;
  createdAt: string;
  selectedRole: string;
  workflowInterest: string;
  clinicalSetting: string;
  scenarioInterest: string;
  organization: string;
  email: string;
  notes: string;
  requestEnterprisePilot: boolean;
  source: string;
  scenarioViewed?: string;
  workflowModesUsed?: string[];
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
  requiredOutputSections: string[];
  eventWeighting: Record<string, number>;
  trackingMetadata: {
    workflowMode: NarrativeModeId;
    audience: string;
    cognitiveFrame: string;
    urgencyLogic: string;
    continuityLogic: string;
    analyticsCategory: string;
    outputEventType?: WorkflowEventType;
  };
  moatInsight: string;
  safetyFlags: string[];
  reviewRequired: boolean;
};

export type ClinicalStory = {
  role: string;
  scopeLabel: string;
  specialty: string;
  complaintGroup: string;
  chiefConcern: string;
  selectedSymptoms: string[];
  selectedNegatives: string[];
  selectedObservations: string[];
  selectedInterventions: string[];
  timelineEvents: TimelineEvent[];
  storySummary: string;
  missingElements: string[];
  completenessScore: number;
  safetyFlags: string[];
};

export type NarrativeClause = {
  clauseId: string;
  id?: string;
  mode: NarrativeModeId;
  roleScope: RoleScopeId | "all";
  role?: RoleScopeId | "all" | string;
  specialtyId: string;
  complaintGroupId: string;
  triggerItemIds?: string[];
  text: string;
  safetyLevel: "approved" | "review" | "restricted";
  blockedForRoles?: RoleScopeId[];
  version?: string;
};

export type OntologyVersion = {
  versionId: string;
  createdAt: string;
  label: string;
  notes: string;
  specialtyCount: number;
  symptomCount: number;
  clauseCount: number;
};

export type OntologyStudioState = {
  specialties: Specialty[];
  clauses: NarrativeClause[];
  roleRestrictions: Record<RoleScopeId, string[]>;
  versions: OntologyVersion[];
  activeVersionId?: string;
  updatedAt: string;
  source?: "seed" | "draft";
};

export type AuditEntry = {
  id: string;
  time: string;
  actor: string;
  action: string;
  detail: string;
};
