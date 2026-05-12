import type {
  BetaContact,
  BetaFeedback,
  ClinicalStorySession,
  NarrativeInput,
  NarrativeModeId,
  NarrativeRevision,
  OntologyUsageStats,
  WorkflowEvent,
  WorkflowEventType,
  WorkflowStep
} from "./types";
import { isWorkflowCaptureEnabled } from "./settings";

const SESSION_KEY = "niq.clinicalStorySessions.v1";
const EVENT_KEY = "niq.workflowEvents.v1";
const REVISION_KEY = "niq.narrativeRevisions.v1";
const FEEDBACK_KEY = "niq.betaFeedback.v1";
const CONTACT_KEY = "niq.betaContacts.v1";
const MIGRATION_NOTICE_KEY = "niq.workflowMigrationNotice.v1";
const WORKFLOW_EVENT_SCHEMA_VERSION = 2;
const LEGACY_EVENT_THRESHOLD = 40;

const countableWorkflowEvents = new Set<WorkflowEventType>([
  "scenario_loaded",
  "role_selected",
  "specialty_selected",
  "complaint_group_selected",
  "symptom_selected",
  "symptom_deselected",
  "negative_selected",
  "negative_deselected",
  "observation_selected",
  "observation_deselected",
  "intervention_selected",
  "intervention_deselected",
  "workflow_mode_selected",
  "clinical_event_added",
  "clinical_event_edited",
  "clinical_event_deleted",
  "timeline_event_added",
  "timeline_event_edited",
  "timeline_event_deleted",
  "timeline_event_reordered",
  "clinical_story_built",
  "narrative_generate_clicked",
  "narrative_mode_changed",
  "ehr_copy_clicked",
  "review_gate_accepted",
  "review_completed",
  "copied_to_ehr",
  "handoff_created",
  "sbar_created",
  "soap_created",
  "triage_created",
  "telehealth_summary_created",
  "escalation_flagged",
  "pending_action_added",
  "beta_feedback_saved"
]);

const passiveWorkflowEvents = new Set<WorkflowEventType>([
  "render",
  "state_sync",
  "derived_narrative_updated",
  "auto_recalculated",
  "mode_preview_updated",
  "narrative_generated",
  "narrative_edited",
  "session_abandoned",
  "demo_completed"
]);

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;

function read<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  if (typeof localStorage.getItem !== "function") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof localStorage === "undefined") return;
  if (typeof localStorage.setItem !== "function") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function captureWrite<T>(key: string, value: T) {
  if (!isWorkflowCaptureEnabled()) return;
  write(key, value);
}

export function captureWorkflowEvent(event: WorkflowEvent) {
  if (!isWorkflowCaptureEnabled()) return undefined;
  const versioned = { ...event, schemaVersion: WORKFLOW_EVENT_SCHEMA_VERSION };
  write(EVENT_KEY, [versioned, ...read<WorkflowEvent[]>(EVENT_KEY, [])].slice(0, 1000));
  return versioned;
}

export function createSession(input: NarrativeInput, demoScenarioId?: string): ClinicalStorySession {
  const createdAt = performance.now();
  const session: ClinicalStorySession = {
    sessionId: id("session"),
    createdAt: now(),
    updatedAt: now(),
    role: input.role.id,
    specialty: input.specialty.id,
    complaintGroup: input.complaintGroup.id,
    selectedSymptoms: input.selectedSymptoms,
    selectedNegatives: input.selectedNegatives,
    selectedObservations: input.observations,
    selectedInterventions: input.interventions,
    timelineEvents: input.timelineEvents,
    selectedNarrativeMode: input.selectedMode,
    generatedNarratives: {},
    userEditedNarrative: "",
    reviewCompleted: false,
    copiedToEhr: false,
    totalInteractions: 0,
    deviceType: window.innerWidth < 768 ? "mobile" : "desktop",
    demoScenarioId
  };
  saveSession(session);
  sessionStartTimes.set(session.sessionId, createdAt);
  return session;
}

const sessionStartTimes = new Map<string, number>();
const firstNarrativeTimes = new Set<string>();

export function listSessions() {
  if (!isWorkflowCaptureEnabled()) return [];
  return read<ClinicalStorySession[]>(SESSION_KEY, []);
}

export function saveSession(session: ClinicalStorySession) {
  if (!isWorkflowCaptureEnabled()) return;
  const sessions = listSessions();
  const next = [{ ...session, updatedAt: now() }, ...sessions.filter((item) => item.sessionId !== session.sessionId)].slice(0, 100);
  captureWrite(SESSION_KEY, next);
}

export function syncSessionFromInput(session: ClinicalStorySession, input: NarrativeInput, patch: Partial<ClinicalStorySession> = {}) {
  const next: ClinicalStorySession = {
    ...session,
    role: input.role.id,
    specialty: input.specialty.id,
    complaintGroup: input.complaintGroup.id,
    selectedSymptoms: input.selectedSymptoms,
    selectedNegatives: input.selectedNegatives,
    selectedObservations: input.observations,
    selectedInterventions: input.interventions,
    timelineEvents: input.timelineEvents,
    selectedNarrativeMode: input.selectedMode,
    ...patch,
    updatedAt: now()
  };
  saveSession(next);
  return next;
}

export function isCountableWorkflowEvent(eventType: WorkflowEventType) {
  if (passiveWorkflowEvents.has(eventType)) return false;
  return countableWorkflowEvents.has(eventType);
}

export function resetWorkflowDemoData() {
  [SESSION_KEY, EVENT_KEY, REVISION_KEY, FEEDBACK_KEY, CONTACT_KEY].forEach((key) => {
    if (typeof localStorage !== "undefined" && typeof localStorage.removeItem === "function") localStorage.removeItem(key);
  });
}

export function migrateLegacyWorkflowData() {
  if (typeof localStorage === "undefined" || typeof localStorage.getItem !== "function") return false;
  const events = read<WorkflowEvent[]>(EVENT_KEY, []);
  const sessions = read<ClinicalStorySession[]>(SESSION_KEY, []);
  const noisyEvents = events.length > LEGACY_EVENT_THRESHOLD || events.some((event) => event.schemaVersion !== WORKFLOW_EVENT_SCHEMA_VERSION);
  const noisySessions = sessions.some((session) => session.totalInteractions > LEGACY_EVENT_THRESHOLD);
  if (!noisyEvents && !noisySessions) return localStorage.getItem(MIGRATION_NOTICE_KEY) === "1";
  resetWorkflowDemoData();
  if (typeof localStorage.setItem === "function") localStorage.setItem(MIGRATION_NOTICE_KEY, "1");
  return true;
}

export function clearWorkflowMigrationNotice() {
  if (typeof localStorage !== "undefined" && typeof localStorage.removeItem === "function") localStorage.removeItem(MIGRATION_NOTICE_KEY);
}

export function logWorkflowEvent(
  session: ClinicalStorySession,
  input: NarrativeInput,
  eventType: WorkflowEventType,
  step: WorkflowStep,
  payload: Record<string, unknown>
) {
  const event: WorkflowEvent = {
    eventId: id("event"),
    schemaVersion: WORKFLOW_EVENT_SCHEMA_VERSION,
    sessionId: session.sessionId,
    timestamp: now(),
    eventType,
    payload,
    step,
    role: input.role.id,
    specialty: input.specialty.id,
    complaintGroup: input.complaintGroup.id
  };
  return captureWorkflowEvent(event);
}

export function listWorkflowEvents() {
  if (!isWorkflowCaptureEnabled()) return [];
  return read<WorkflowEvent[]>(EVENT_KEY, []).filter((event) => event.schemaVersion === WORKFLOW_EVENT_SCHEMA_VERSION);
}

export function markNarrativeGenerated(session: ClinicalStorySession, mode: NarrativeModeId, text: string) {
  const start = sessionStartTimes.get(session.sessionId);
  const patch: Partial<ClinicalStorySession> = {
    generatedNarratives: { ...session.generatedNarratives, [mode]: text }
  };
  if (start && !firstNarrativeTimes.has(session.sessionId)) {
    patch.timeToFirstNarrativeMs = Math.round(performance.now() - start);
    firstNarrativeTimes.add(session.sessionId);
  }
  return { ...session, ...patch };
}

export function approxEditDistance(a: string, b: string) {
  const lengthDelta = Math.abs(a.length - b.length);
  const min = Math.min(a.length, b.length);
  let changed = 0;
  for (let i = 0; i < min; i += 1) {
    if (a[i] !== b[i]) changed += 1;
  }
  return lengthDelta + changed;
}

export function saveNarrativeRevision(
  sessionId: string,
  mode: NarrativeModeId,
  generatedText: string,
  editedText: string,
  accepted: boolean,
  copied: boolean
) {
  const revision: NarrativeRevision = {
    revisionId: id("revision"),
    sessionId,
    mode,
    generatedText,
    editedText,
    editDistanceApprox: approxEditDistance(generatedText, editedText),
    accepted,
    copied,
    createdAt: now()
  };
  captureWrite(REVISION_KEY, [revision, ...read<NarrativeRevision[]>(REVISION_KEY, [])].slice(0, 500));
  return revision;
}

export function listNarrativeRevisions() {
  if (!isWorkflowCaptureEnabled()) return [];
  return read<NarrativeRevision[]>(REVISION_KEY, []);
}

export function saveBetaFeedback(feedback: Omit<BetaFeedback, "feedbackId">, contactEmail?: string) {
  const feedbackId = id("feedback");
  const record: BetaFeedback = { feedbackId, ...feedback };
  if (!isWorkflowCaptureEnabled()) return record;
  write(FEEDBACK_KEY, [record, ...read<BetaFeedback[]>(FEEDBACK_KEY, [])].slice(0, 200));
  if (contactEmail) {
    const contact: BetaContact = { feedbackId, contactEmail, createdAt: now() };
    write(CONTACT_KEY, [contact, ...read<BetaContact[]>(CONTACT_KEY, [])].slice(0, 200));
  }
  captureWorkflowEvent({
    eventId: id("event"),
    sessionId: feedback.sessionId,
    timestamp: now(),
    eventType: "beta_feedback_saved",
    payload: { betaInterest: feedback.betaInterest, hasContact: Boolean(contactEmail) },
    step: "feedback",
    role: feedback.role,
    specialty: feedback.setting,
    complaintGroup: feedback.requestedSpecialty || "beta-feedback"
  });
  return record;
}

export function listBetaFeedback() {
  if (!isWorkflowCaptureEnabled()) return [];
  return read<BetaFeedback[]>(FEEDBACK_KEY, []);
}

export function listBetaContacts() {
  if (!isWorkflowCaptureEnabled()) return [];
  return read<BetaContact[]>(CONTACT_KEY, []);
}

export function computeOntologyUsageStats(): OntologyUsageStats[] {
  if (!isWorkflowCaptureEnabled()) return [];
  const sessions = listSessions();
  return sessions.flatMap((session) =>
    session.selectedSymptoms.map((symptomId) => {
      const matching = sessions.filter((item) => item.selectedSymptoms.includes(symptomId));
      const copied = matching.filter((item) => item.copiedToEhr).length;
      const edited = matching.filter((item) => item.userEditedNarrative.trim()).length;
      const coSelectedSymptoms: Record<string, number> = {};
      const narrativeModesUsed: Record<string, number> = {};
      for (const item of matching) {
        narrativeModesUsed[item.selectedNarrativeMode] = (narrativeModesUsed[item.selectedNarrativeMode] ?? 0) + 1;
        for (const co of item.selectedSymptoms.filter((value) => value !== symptomId)) {
          coSelectedSymptoms[co] = (coSelectedSymptoms[co] ?? 0) + 1;
        }
      }
      return {
        specialty: session.specialty,
        complaintGroup: session.complaintGroup,
        symptomId,
        selectedCount: matching.length,
        coSelectedSymptoms,
        narrativeModesUsed,
        copyRate: matching.length ? copied / matching.length : 0,
        editRate: matching.length ? edited / matching.length : 0
      };
    })
  );
}

export function moatMetrics() {
  if (!isWorkflowCaptureEnabled()) {
    return {
      sessionsCompleted: 0,
      averageTimeToNarrativeMs: 0,
      copyRate: 0,
      mostUsedNarrativeMode: "capture disabled",
      averageEditsPerNarrative: 0,
      narrativeAcceptanceRate: 0,
      workflowAbandonmentStep: "capture disabled"
    };
  }
  const sessions = listSessions();
  const revisions = listNarrativeRevisions();
  const completed = sessions.filter((session) => session.copiedToEhr || session.reviewCompleted);
  const copied = sessions.filter((session) => session.copiedToEhr);
  const timeToNarrative = sessions.map((session) => session.timeToFirstNarrativeMs).filter(Boolean) as number[];
  const modeCounts = sessions.reduce<Record<string, number>>((acc, session) => {
    acc[session.selectedNarrativeMode] = (acc[session.selectedNarrativeMode] ?? 0) + 1;
    return acc;
  }, {});
  const topMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "nursing";
  return {
    sessionsCompleted: completed.length,
    averageTimeToNarrativeMs: timeToNarrative.length ? Math.round(timeToNarrative.reduce((a, b) => a + b, 0) / timeToNarrative.length) : 0,
    copyRate: sessions.length ? copied.length / sessions.length : 0,
    mostUsedNarrativeMode: topMode,
    averageEditsPerNarrative: revisions.length ? Math.round(revisions.reduce((sum, rev) => sum + rev.editDistanceApprox, 0) / revisions.length) : 0,
    narrativeAcceptanceRate: revisions.length ? revisions.filter((rev) => rev.accepted).length / revisions.length : 0,
    workflowAbandonmentStep: sessions.find((session) => session.abandonedAtStep)?.abandonedAtStep ?? "none"
  };
}
