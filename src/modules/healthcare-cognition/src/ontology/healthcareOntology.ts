import type { OntologyNode } from "../types";
import { safetyFlags } from "../data/safety";

export const healthcareOntology: OntologyNode[] = [
  {
    ...safetyFlags,
    id: "care-continuity",
    label: "Care continuity",
    domain: "Workflow context",
    description: "How a synthetic story remains understandable across roles, shifts, and documentation moments.",
    relationships: ["role-handoff", "longitudinal-context", "review-readiness"]
  },
  {
    ...safetyFlags,
    id: "role-handoff",
    label: "Role handoff",
    domain: "Team coordination",
    description: "A transfer point where ownership, status, and unresolved questions need a shared surface.",
    relationships: ["care-continuity", "workflow-entropy", "provenance"]
  },
  {
    ...safetyFlags,
    id: "workflow-entropy",
    label: "Workflow entropy",
    domain: "Operational signal",
    description: "Non-clinical disorder created by repeated clarifications, missing ownership, and fragmented notes.",
    relationships: ["role-handoff", "documentation-load", "review-readiness"]
  },
  {
    ...safetyFlags,
    id: "documentation-load",
    label: "Documentation load",
    domain: "Burden surface",
    description: "The cognitive work needed to reconstruct a coherent story from scattered workflow fragments.",
    relationships: ["workflow-entropy", "specialty-context", "interoperability-friction"]
  },
  {
    ...safetyFlags,
    id: "review-readiness",
    label: "Review readiness",
    domain: "Governance",
    description: "Whether a synthetic narrative surface is organized enough for a human reviewer to inspect.",
    relationships: ["provenance", "care-continuity", "agent-boundary"]
  },
  {
    ...safetyFlags,
    id: "provenance",
    label: "Provenance",
    domain: "Trust layer",
    description: "The visible trace of source fragments, confidence labels, and reviewer status.",
    relationships: ["review-readiness", "role-handoff", "agent-boundary"]
  },
  {
    ...safetyFlags,
    id: "agent-boundary",
    label: "Agent boundary",
    domain: "Orchestration",
    description: "A public-safe line between capture, structuring, review, and export responsibilities.",
    relationships: ["provenance", "review-readiness", "interoperability-friction"]
  },
  {
    ...safetyFlags,
    id: "interoperability-friction",
    label: "Interoperability friction",
    domain: "Integration posture",
    description: "The operational gap between where a story is captured and where a reviewed summary needs to go.",
    relationships: ["documentation-load", "agent-boundary", "specialty-context"]
  },
  {
    ...safetyFlags,
    id: "specialty-context",
    label: "Specialty context",
    domain: "Care setting",
    description: "The different narrative shape needed by a synthetic specialty workflow.",
    relationships: ["documentation-load", "longitudinal-context", "interoperability-friction"]
  },
  {
    ...safetyFlags,
    id: "longitudinal-context",
    label: "Longitudinal context",
    domain: "Timeline",
    description: "A view of how synthetic workflow meaning changes across time without patient identity.",
    relationships: ["care-continuity", "specialty-context", "review-readiness"]
  }
];
