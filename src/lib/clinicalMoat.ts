import { clinicalWorkflowModes, getClinicalWorkflowMode } from "./clinicalWorkflowModes";
import type { NarrativeModeId } from "./types";

export function getWorkflowModeMoatSummary() {
  return "We do not generate generic AI notes. NarrativeIQ adapts documentation intelligence to the actual workflow context, changing cognitive framing, event weighting, urgency and continuity logic, narrative structure, and analytics metadata for each clinical mode.";
}

export function getWorkflowModeDifferentiators() {
  return clinicalWorkflowModes.map((mode) => ({
    id: mode.id,
    label: mode.label,
    clinicalIntent: mode.clinicalIntent,
    requiredOutputSections: mode.requiredOutputSections,
    trackingMetadata: mode.trackingMetadata,
    moatInsight: mode.moatInsight
  }));
}

export function getModeMoatInsight(modeId: NarrativeModeId) {
  return getClinicalWorkflowMode(modeId).moatInsight;
}
