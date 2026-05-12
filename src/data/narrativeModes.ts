import type { NarrativeMode } from "../lib/types";
import { clinicalWorkflowModes } from "../lib/clinicalWorkflowModes";

export const narrativeModes: NarrativeMode[] = clinicalWorkflowModes.map((mode) => ({
  id: mode.id,
  label: mode.label,
  description: mode.clinicalIntent
}));

export const getModeLabel = (id: string) => narrativeModes.find((mode) => mode.id === id)?.label ?? id;
