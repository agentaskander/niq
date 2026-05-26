import type { AdvantagePillar } from "../types";
import { safetyFlags } from "./safety";

export const advantagePillars: AdvantagePillar[] = [
  {
    ...safetyFlags,
    id: "continuity-graph",
    title: "Continuity graph",
    summary: "Connects synthetic events, roles, questions, and review needs across a healthcare workflow.",
    signal: "Context survives handoff boundaries.",
    proofPoint: "Narrative fragments become an inspectable continuity surface."
  },
  {
    ...safetyFlags,
    id: "workflow-entropy",
    title: "Workflow entropy lens",
    summary: "Surfaces where documentation friction, ownership ambiguity, and repeated clarification requests cluster.",
    signal: "Operational disorder becomes visible.",
    proofPoint: "Dashboard values are deterministic and non-clinical."
  },
  {
    ...safetyFlags,
    id: "review-first",
    title: "Review-first cognition",
    summary: "Positions every generated surface as a draft requiring human review before use.",
    signal: "Trust is built through inspection.",
    proofPoint: "Provenance cards show source and reviewer status."
  },
  {
    ...safetyFlags,
    id: "specialty-shape",
    title: "Specialty-aware shape",
    summary: "Shows how different care settings need different narrative structure without changing safety boundaries.",
    signal: "One engine can express multiple workflow needs.",
    proofPoint: "Specialty profiles alter framing, not clinical claims."
  },
  {
    ...safetyFlags,
    id: "interoperability",
    title: "Interoperability posture",
    summary: "Maps EHR-adjacent and team-adjacent payloads into plain-language bridge concepts.",
    signal: "Integration value is legible before integration work.",
    proofPoint: "No live systems are contacted."
  },
  {
    ...safetyFlags,
    id: "longitudinal-memory",
    title: "Longitudinal memory surface",
    summary: "Tracks how synthetic context changes over time without storing patient identity.",
    signal: "Temporal drift becomes reviewable.",
    proofPoint: "Timeline moments carry only fictional workflow details."
  },
  {
    ...safetyFlags,
    id: "agent-orchestration",
    title: "Agent orchestration map",
    summary: "Separates capture, structuring, review, and export responsibilities into inspectable stages.",
    signal: "Automation boundaries are explicit.",
    proofPoint: "Every stage has a human gate."
  },
  {
    ...safetyFlags,
    id: "investor-safety",
    title: "Investor-safe moat narrative",
    summary: "Frames product defensibility around workflow cognition, provenance, and governance.",
    signal: "Category story without private implementation exposure.",
    proofPoint: "Roadmap panels avoid production claims."
  }
];
