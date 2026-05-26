import type { RoadmapItem } from "../types";
import { safetyFlags } from "./safety";

export const roadmapItems: RoadmapItem[] = [
  {
    ...safetyFlags,
    id: "concept",
    horizon: "Now",
    title: "Public concept lab",
    investorFrame: "Demonstrates healthcare cognition category clarity with synthetic data only.",
    riskControl: "Frontend-only, no PHI, no clinical advice, no diagnosis."
  },
  {
    ...safetyFlags,
    id: "pilot",
    horizon: "Next",
    title: "Governed pilot package",
    investorFrame: "Packages role-specific workflows, provenance UX, and review gates for controlled evaluation.",
    riskControl: "Compliance review before any non-demo data touches the workflow."
  },
  {
    ...safetyFlags,
    id: "integration",
    horizon: "Later",
    title: "Integration readiness",
    investorFrame: "Builds EHR-adjacent export posture and audit surfaces.",
    riskControl: "Human approval stays between generated draft and downstream system."
  },
  {
    ...safetyFlags,
    id: "platform",
    horizon: "Scale",
    title: "Specialty cognition platform",
    investorFrame: "Expands from narrative documentation to governed workflow intelligence.",
    riskControl: "Specialty packages remain bounded by review, provenance, and data controls."
  }
];
