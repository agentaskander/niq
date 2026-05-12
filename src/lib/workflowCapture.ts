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

const SESSION_KEY = "niq.clinicalStorySessions.v1";
const EVENT_KEY = "niq.workflowEvents.v1";
const REVISION_KEY = "niq.narrativeRevisions.v1";
const FEEDBACK_KEY = "niq.betaFeedback.v1";
const CONTACT_KEY = "niq.betaContacts.v1";

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;

function read<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
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
  localStorage.setItem(key, JSON.stringify(value));
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
  return read<ClinicalStorySession[]>(SESSION_KEY, []);
}

export function saveSession(session: ClinicalStorySession) {
  const sessions = listSessions();
  const next = [{ ...session, updatedAt: now() }, ...sessions.filter((item) => item.sessionId !== session.sessionId)].slice(0, 100);
  write(SESSION_KEY, next);
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
    totalInteractions: session.totalInteractions + 1,
    ...patch,
    updatedAt: now()
  };
  saveSession(next);
  return next;
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
    sessionId: session.sessionId,
    timestamp: now(),
    eventType,
    payload,
    step,
    role: input.role.id,
    specialty: input.specialty.id,
    complaintGroup: input.complaintGroup.id
  };
  write(EVENT_KEY, [event, ...read<WorkflowEvent[]>(EVENT_KEY, [])].slice(0, 1000));
  return event;
}

export function listWorkflowEvents() {
  return read<WorkflowEvent[]>(EVENT_KEY, []);
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
  write(REVISION_KEY, [revision, ...read<NarrativeRevision[]>(REVISION_KEY, [])].slice(0, 500));
  return revision;
}

export function listNarrativeRevisions() {
  return read<NarrativeRevision[]>(REVISION_KEY, []);
}

export function saveBetaFeedback(feedback: Omit<BetaFeedback, "feedbackId">, contactEmail?: string) {
  const feedbackId = id("feedback");
  const record: BetaFeedback = { feedbackId, ...feedback };
  write(FEEDBACK_KEY, [record, ...read<BetaFeedback[]>(FEEDBACK_KEY, [])].slice(0, 200));
  if (contactEmail) {
    const contact: BetaContact = { feedbackId, contactEmail, createdAt: now() };
    write(CONTACT_KEY, [contact, ...read<BetaContact[]>(CONTACT_KEY, [])].slice(0, 200));
  }
  return record;
}

export function listBetaFeedback() {
  return read<BetaFeedback[]>(FEEDBACK_KEY, []);
}

export function listBetaContacts() {
  return read<BetaContact[]>(CONTACT_KEY, []);
}

export function computeOntologyUsageStats(): OntologyUsageStats[] {
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
