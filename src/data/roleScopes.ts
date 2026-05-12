import type { RoleScope } from "../lib/types";

const rnBlocked = [
  "diagnosed with",
  "consistent with cholecystitis",
  "order ultrasound",
  "start antibiotics",
  "prescribe",
  "rule out MI"
];

export const roleScopes: RoleScope[] = [
  {
    id: "rn",
    name: "RN / Bedside Nurse",
    allowedModes: ["nursing", "advanced", "sbar", "handoff", "triage"],
    restrictedLanguage: rnBlocked,
    defaultMode: "nursing",
    safetyDisclosure: "Avoids diagnosis and treatment orders. Emphasizes reported symptoms, observations, interventions, reassessment, and provider notification.",
    allowsAssessmentPlan: false
  },
  {
    id: "np-pa",
    name: "NP / PA",
    allowedModes: ["advanced", "provider", "soap", "sbar", "handoff", "triage", "telehealth"],
    restrictedLanguage: ["final diagnosis without review", "automatic orders"],
    defaultMode: "advanced",
    safetyDisclosure: "Supports richer HPI and progress-note drafts. Output remains draft and review-required.",
    allowsAssessmentPlan: true
  },
  {
    id: "physician",
    name: "Physician",
    allowedModes: ["provider", "soap", "advanced", "sbar", "handoff", "triage", "telehealth"],
    restrictedLanguage: ["automatic chart submission", "unsupported findings"],
    defaultMode: "provider",
    safetyDisclosure: "Assessment and plan sections are draft-only and require clinician review.",
    allowsAssessmentPlan: true
  },
  {
    id: "urgent-care",
    name: "Urgent Care",
    allowedModes: ["provider", "soap", "advanced", "triage", "sbar"],
    restrictedLanguage: ["automatic orders", "unsupported diagnosis"],
    defaultMode: "provider",
    safetyDisclosure: "Fast HPI, ROS-like negatives, and plan placeholders for provider review.",
    allowsAssessmentPlan: true
  },
  {
    id: "telehealth",
    name: "Telehealth",
    allowedModes: ["telehealth", "advanced", "provider", "soap", "triage"],
    restrictedLanguage: ["unsupported exam claims", "automatic orders"],
    defaultMode: "telehealth",
    safetyDisclosure: "Includes remote encounter limitations and review-required follow-up placeholders.",
    allowsAssessmentPlan: true
  },
  {
    id: "home-health",
    name: "Home Health",
    allowedModes: ["handoff", "nursing", "advanced", "sbar"],
    restrictedLanguage: rnBlocked,
    defaultMode: "handoff",
    safetyDisclosure: "Emphasizes function, safety, adherence, wound/mobility checks, reassessment, and care coordination.",
    allowsAssessmentPlan: false
  }
];

export const defaultRoleScope = roleScopes[0];
