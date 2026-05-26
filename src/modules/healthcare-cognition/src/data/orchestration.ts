import type { AgentStep } from "../types";
import { safetyFlags } from "./safety";

export const agentSteps: AgentStep[] = [
  {
    ...safetyFlags,
    id: "capture-agent",
    agent: "Capture agent",
    input: "Synthetic workflow fragments",
    output: "Normalized public-safe events",
    humanGate: "Reviewer confirms source eligibility."
  },
  {
    ...safetyFlags,
    id: "structure-agent",
    agent: "Structure agent",
    input: "Normalized events",
    output: "Themes, timeline moments, and open questions",
    humanGate: "Reviewer checks that structure matches source fragments."
  },
  {
    ...safetyFlags,
    id: "provenance-agent",
    agent: "Provenance agent",
    input: "Structured themes and sources",
    output: "Traceable source cards and confidence labels",
    humanGate: "Reviewer approves provenance visibility."
  },
  {
    ...safetyFlags,
    id: "export-agent",
    agent: "Export agent",
    input: "Reviewed narrative surface",
    output: "Copy-ready non-clinical demo summary",
    humanGate: "Reviewer decides whether output leaves the module."
  }
];
