import type { InteroperabilityNode } from "../types";
import { safetyFlags } from "./safety";

export const interoperabilityNodes: InteroperabilityNode[] = [
  {
    ...safetyFlags,
    id: "ehr-note",
    system: "EHR note surface",
    payload: "Reviewed narrative summary",
    friction: "Context is often copied after review rather than preserved as a living story.",
    demoBridge: "Show source fragments beside the final draft."
  },
  {
    ...safetyFlags,
    id: "team-inbox",
    system: "Team inbox",
    payload: "Open question digest",
    friction: "Messages mix confirmed facts with unresolved administrative questions.",
    demoBridge: "Separate confirmed context from reviewer questions."
  },
  {
    ...safetyFlags,
    id: "handoff-board",
    system: "Handoff board",
    payload: "Continuity timeline",
    friction: "Shift tools compress time and ownership into short notes.",
    demoBridge: "Render timeline moments by role, source, and review status."
  },
  {
    ...safetyFlags,
    id: "analytics-layer",
    system: "Operations analytics",
    payload: "Workflow burden signals",
    friction: "Teams see volume but not the story friction behind volume.",
    demoBridge: "Display entropy signals as non-clinical operational indicators."
  }
];
