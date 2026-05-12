import type { NarrativeInput, NarrativeModeId, RoleScope } from "../lib/types";

export type CompletenessSession = Pick<
  NarrativeInput,
  | "role"
  | "specialty"
  | "complaintGroup"
  | "selectedSymptoms"
  | "selectedNegatives"
  | "observations"
  | "interventions"
  | "timelineEvents"
  | "selectedMode"
  | "onset"
  | "severity"
  | "modifiers"
> & {
  reviewed?: boolean;
  narrativeGenerated?: boolean;
};

export function calculatePatientStoryCompleteness(session: CompletenessSession) {
  const checks = [
    Boolean(session.role),
    Boolean(session.specialty),
    Boolean(session.complaintGroup),
    session.selectedSymptoms.length > 0,
    Boolean(session.onset || session.severity || session.modifiers.length || session.timelineEvents.length),
    session.selectedNegatives.length > 0,
    session.observations.length > 0 || session.interventions.length > 0,
    Boolean(session.narrativeGenerated),
    Boolean(session.reviewed)
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function calculateTimelineCompleteness(session: Pick<CompletenessSession, "timelineEvents">) {
  const events = session.timelineEvents;
  if (events.length === 0) return 0;
  if (events.length === 1) return 25;
  if (events.length === 2) return 50;
  const hasTimestamp = events.some((event) => Boolean(event.timestamp?.trim()));
  if (events.length === 3 && hasTimestamp) return 75;
  const hasPatientStated = events.some((event) => event.sourceType === "patient-stated");
  const hasClinicalFollowup = events.some((event) =>
    ["clinician-observed", "reassessment", "provider-notified"].includes(event.sourceType)
  );
  if (events.length >= 4 && hasPatientStated && hasClinicalFollowup) return 100;
  return 75;
}

export function calculateNarrativeQuality(session: CompletenessSession) {
  const roleModeCompatible = (session.role as RoleScope).allowedModes.includes(session.selectedMode as NarrativeModeId);
  const score =
    Math.min(session.selectedSymptoms.length, 3) * 12 +
    (session.onset || session.severity || session.modifiers.length ? 12 : 0) +
    (session.selectedNegatives.length ? 12 : 0) +
    (session.observations.length ? 14 : 0) +
    (session.timelineEvents.length ? 16 : 0) +
    (roleModeCompatible ? 14 : 0) +
    (session.reviewed ? 20 : 0);
  return Math.min(session.reviewed ? 100 : 95, score);
}
