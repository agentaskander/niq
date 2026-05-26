import type { SyntheticCase } from "../types";
import { safetyFlags } from "./safety";

export const syntheticCases: SyntheticCase[] = [
  {
    ...safetyFlags,
    id: "shift-reconstruction",
    title: "Shift story reconstruction",
    setting: "Inpatient operations",
    acuity: "moderate",
    story: "A fictional team needs to reconstruct a care coordination story from scattered shift notes.",
    fragments: [
      "Nurse note: family asked for a plain-language update before evening handoff.",
      "Coordinator note: transport timing and document availability changed during the afternoon.",
      "Team note: reviewer wants unresolved ownership questions separated from confirmed facts."
    ],
    reviewerQuestions: ["Who owns the next update?", "Which items are confirmed?", "What changed since the prior handoff?"],
    continuitySignals: ["family update need", "transport timing change", "ownership gap"],
    provenance: [
      { source: "Synthetic nurse note", confidence: 86, reviewerStatus: "ready" },
      { source: "Synthetic coordinator note", confidence: 72, reviewerStatus: "needs review" },
      { source: "Synthetic team note", confidence: 91, reviewerStatus: "ready" }
    ]
  },
  {
    ...safetyFlags,
    id: "ambulatory-followup",
    title: "Ambulatory follow-up continuity",
    setting: "Outpatient operations",
    acuity: "low",
    story: "A fictional clinic team organizes non-clinical follow-up context before a callback.",
    fragments: [
      "Front desk note: appointment timing changed twice this week.",
      "Care team note: reviewer requested a concise summary of open administrative items.",
      "Patient message placeholder: asks which forms should be ready before the visit."
    ],
    reviewerQuestions: ["Which administrative items remain open?", "What should be summarized for callback?", "What timing changed?"],
    continuitySignals: ["scheduling friction", "forms readiness", "callback summary"],
    provenance: [
      { source: "Synthetic scheduling note", confidence: 80, reviewerStatus: "ready" },
      { source: "Synthetic care team note", confidence: 76, reviewerStatus: "needs review" },
      { source: "Synthetic message placeholder", confidence: 68, reviewerStatus: "needs review" }
    ]
  },
  {
    ...safetyFlags,
    id: "specialty-review",
    title: "Specialty review packet",
    setting: "Specialty coordination",
    acuity: "high",
    story: "A fictional specialty team prepares a review packet that separates timeline, unresolved questions, and source provenance.",
    fragments: [
      "Referral queue note: review packet is missing an administrative attachment.",
      "Specialty team note: prior context needs to be summarized without clinical interpretation.",
      "Operations note: reviewer wants the timeline grouped by role and source."
    ],
    reviewerQuestions: ["Which attachment is missing?", "Which context is prior versus new?", "Which source supports each timeline moment?"],
    continuitySignals: ["packet readiness", "source grouping", "prior context separation"],
    provenance: [
      { source: "Synthetic referral note", confidence: 83, reviewerStatus: "ready" },
      { source: "Synthetic specialty note", confidence: 70, reviewerStatus: "needs review" },
      { source: "Synthetic operations note", confidence: 88, reviewerStatus: "ready" }
    ]
  }
];
