import type { EntropySignal, TimelineMoment } from "../types";
import { safetyFlags } from "./safety";

export const entropySignals: EntropySignal[] = [
  {
    ...safetyFlags,
    id: "ownership-clarity",
    label: "Ownership clarity",
    value: 62,
    trend: "watch",
    explanation: "Repeated handoff language indicates ownership should be made explicit before review."
  },
  {
    ...safetyFlags,
    id: "fragment-alignment",
    label: "Fragment alignment",
    value: 78,
    trend: "improving",
    explanation: "Synthetic fragments increasingly agree on the same administrative blockers."
  },
  {
    ...safetyFlags,
    id: "review-readiness",
    label: "Review readiness",
    value: 84,
    trend: "stable",
    explanation: "The story is structured enough for a human reviewer to inspect."
  },
  {
    ...safetyFlags,
    id: "handoff-density",
    label: "Handoff density",
    value: 55,
    trend: "watch",
    explanation: "Multiple roles appear in a short window, increasing coordination burden."
  }
];

export const timelineMoments: TimelineMoment[] = [
  {
    ...safetyFlags,
    id: "intake",
    time: "08:10",
    role: "Intake",
    event: "Initial synthetic workflow question captured.",
    continuityImpact: 34
  },
  {
    ...safetyFlags,
    id: "coordination",
    time: "11:25",
    role: "Coordinator",
    event: "Administrative blocker and ownership question added.",
    continuityImpact: 58
  },
  {
    ...safetyFlags,
    id: "handoff",
    time: "15:40",
    role: "Handoff lead",
    event: "Plain-language continuity summary requested.",
    continuityImpact: 81
  },
  {
    ...safetyFlags,
    id: "review",
    time: "17:05",
    role: "Reviewer",
    event: "Source provenance checked before downstream use.",
    continuityImpact: 74
  }
];
