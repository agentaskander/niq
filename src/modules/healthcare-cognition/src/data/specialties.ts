import type { SpecialtyProfile } from "../types";
import { safetyFlags } from "./safety";

export const specialtyProfiles: SpecialtyProfile[] = [
  {
    ...safetyFlags,
    id: "nursing",
    specialty: "Nursing workflow",
    cognitiveLoad: "Frequent handoffs, interrupted documentation, and need for rapid story reconstruction.",
    documentationPattern: "Short fragments, shift notes, reassessment placeholders, and handoff summaries.",
    moduleFit: "Timeline continuity and reviewer questions help reduce reconstruction burden."
  },
  {
    ...safetyFlags,
    id: "urgent-care",
    specialty: "Urgent care operations",
    cognitiveLoad: "High throughput with fast context switching between patient-facing and administrative tasks.",
    documentationPattern: "Brief event summaries, status changes, and follow-up reminders.",
    moduleFit: "Entropy and provenance panels clarify what is ready for review."
  },
  {
    ...safetyFlags,
    id: "care-coordination",
    specialty: "Care coordination",
    cognitiveLoad: "Ownership and scheduling questions accumulate across several roles.",
    documentationPattern: "Messages, call notes, form readiness, and team updates.",
    moduleFit: "Continuity graph separates unresolved questions from shared context."
  },
  {
    ...safetyFlags,
    id: "specialty-clinic",
    specialty: "Specialty clinic",
    cognitiveLoad: "Review packets depend on prior context, administrative readiness, and source clarity.",
    documentationPattern: "Referral notes, packet checks, visit preparation, and reviewer annotations.",
    moduleFit: "Provenance layer makes source support visible before downstream use."
  }
];
