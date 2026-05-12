import type { NarrativeModeId, RoleScopeId } from "./types";

export type NarrativeIqSettings = {
  role: RoleScopeId;
  careSetting: string;
  defaultSpecialty: string;
  defaultNarrativeMode: NarrativeModeId;
  shiftType: string;
  documentationStyle: "concise" | "balanced" | "detailed";
  preferredTone: "objective" | "narrative" | "sbar-forward";
  alwaysRequireReview: boolean;
  warnOnPhi: boolean;
  blockRnDiagnosisLanguage: boolean;
  blockRnTreatmentOrders: boolean;
  autoBuildTimeline: boolean;
  autoCollapseCompletedSections: boolean;
  showMetricExplanations: boolean;
  compactChipMode: boolean;
  defaultStart: "demo" | "blank";
  workflowCaptureEnabled: boolean;
  localWorkflowCapture?: boolean;
};

export const SETTINGS_KEY = "niq.settings.v1";

export const defaultSettings: NarrativeIqSettings = {
  role: "rn",
  careSetting: "Emergency Department",
  defaultSpecialty: "gi-liver",
  defaultNarrativeMode: "nursing",
  shiftType: "day",
  documentationStyle: "balanced",
  preferredTone: "objective",
  alwaysRequireReview: true,
  warnOnPhi: true,
  blockRnDiagnosisLanguage: true,
  blockRnTreatmentOrders: true,
  autoBuildTimeline: false,
  autoCollapseCompletedSections: true,
  showMetricExplanations: true,
  compactChipMode: false,
  defaultStart: "demo",
  workflowCaptureEnabled: true
};

export function loadSettings(): NarrativeIqSettings {
  if (typeof localStorage === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<NarrativeIqSettings>;
    return {
      ...defaultSettings,
      ...parsed,
      workflowCaptureEnabled: parsed.workflowCaptureEnabled ?? parsed.localWorkflowCapture ?? defaultSettings.workflowCaptureEnabled
    };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: NarrativeIqSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function isWorkflowCaptureEnabled() {
  return loadSettings().workflowCaptureEnabled;
}

export function clearDemoData() {
  [
    "niq.clinicalStorySessions.v1",
    "niq.workflowEvents.v1",
    "niq.narrativeRevisions.v1",
    "niq.betaFeedback.v1",
    "niq.betaContacts.v1",
    "niq.preferredModeUsage.v1",
    "niq.cachedClinicalStory.v1"
  ].forEach((key) => localStorage.removeItem(key));
}
