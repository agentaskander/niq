import type { NarrativeMode } from "../lib/types";

export const narrativeModes: NarrativeMode[] = [
  { id: "nursing", label: "Nursing", description: "Short, objective bedside nursing note." },
  { id: "advanced", label: "Advanced", description: "Richer HPI-style clinical narrative without diagnosis conclusion." },
  { id: "provider", label: "Provider", description: "Progress-note style draft for provider review." },
  { id: "soap", label: "SOAP", description: "Subjective, Objective, Assessment draft, and Plan draft when role allows." },
  { id: "sbar", label: "SBAR", description: "Situation, Background, Assessment, Recommendation/Request." },
  { id: "handoff", label: "Handoff", description: "Shift or care-transition summary." },
  { id: "triage", label: "Triage", description: "Concise triage note with red flags and acuity cues." },
  { id: "telehealth", label: "Telehealth", description: "Remote encounter narrative with limitations and follow-up placeholders." }
];

export const getModeLabel = (id: string) => narrativeModes.find((mode) => mode.id === id)?.label ?? id;
