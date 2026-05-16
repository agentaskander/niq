import { beforeEach, describe, expect, it } from "vitest";
import { demoSession } from "../data/demoSession";
import { defaultSettings, saveSettings } from "./settings";
import {
  saveBetaFeedback,
  saveBetaSignup,
  createSession,
  isCountableWorkflowEvent,
  listBetaContacts,
  listBetaFeedback,
  listBetaSignups,
  listWorkflowEvents,
  logWorkflowEvent,
  migrateLegacyWorkflowData
} from "./workflowCapture";

describe("workflowCapture", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        removeItem: (key: string) => store.delete(key),
        clear: () => store.clear()
      }
    });
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: { randomUUID: () => `test-${Math.random().toString(16).slice(2)}` }
    });
    saveSettings(defaultSettings);
  });

  it("logs workflow events", () => {
    const session = createSession(demoSession);
    logWorkflowEvent(session, demoSession, "symptom_selected", "facts", { symptomId: "nausea" });

    expect(listWorkflowEvents()).toHaveLength(1);
    expect(listWorkflowEvents()[0].eventType).toBe("symptom_selected");
    expect(listWorkflowEvents()[0].schemaVersion).toBe(2);
  });

  it("resets legacy noisy workflow data", () => {
    localStorage.setItem("niq.workflowEvents.v1", JSON.stringify([{ eventId: "old", eventType: "narrative_generated" }]));
    localStorage.setItem("niq.clinicalStorySessions.v1", JSON.stringify([{ sessionId: "old", totalInteractions: 51 }]));

    expect(migrateLegacyWorkflowData()).toBe(true);
    expect(listWorkflowEvents()).toHaveLength(0);
  });

  it.each([
    "symptom_selected",
    "workflow_mode_selected",
    "clinical_story_built",
    "ehr_copy_clicked"
  ] as const)("does not persist %s when workflow capture is disabled", (eventType) => {
    saveSettings({ ...defaultSettings, workflowCaptureEnabled: false });
    const session = createSession(demoSession);

    logWorkflowEvent(session, demoSession, eventType, eventType === "ehr_copy_clicked" ? "copy" : "facts", { mode: demoSession.selectedMode });

    expect(listWorkflowEvents()).toHaveLength(0);
  });

  it("counts only allowlisted deliberate actions", () => {
    expect(isCountableWorkflowEvent("workflow_mode_selected")).toBe(true);
    expect(isCountableWorkflowEvent("narrative_generate_clicked")).toBe(true);
    expect(isCountableWorkflowEvent("ehr_copy_clicked")).toBe(true);
    expect(isCountableWorkflowEvent("review_gate_accepted")).toBe(true);
    expect(isCountableWorkflowEvent("render")).toBe(false);
    expect(isCountableWorkflowEvent("state_sync")).toBe(false);
    expect(isCountableWorkflowEvent("derived_narrative_updated")).toBe(false);
    expect(isCountableWorkflowEvent("auto_recalculated")).toBe(false);
    expect(isCountableWorkflowEvent("mode_preview_updated")).toBe(false);
  });

  it("stores beta contact separately from feedback", () => {
    saveBetaFeedback(
      {
        sessionId: "session_1",
        role: "RN",
        setting: "ED",
        realismScore: 5,
        timeSavingScore: 5,
        wouldUseNextShift: "yes",
        magicalMoment: "timeline",
        unsafeConcern: "",
        requestedSpecialty: "GI",
        betaInterest: "yes"
      },
      "nurse@example.com"
    );

    expect(listBetaContacts()).toHaveLength(1);
    expect(listBetaContacts()[0].contactEmail).toBe("nurse@example.com");
  });

  it("stores workflow-aware beta signups", () => {
    saveBetaSignup({
      selectedRole: "Nursing",
      workflowInterest: "SBAR",
      clinicalSetting: "ED",
      scenarioInterest: "GI abdominal pain",
      organization: "Demo Health",
      email: "rn@example.com",
      notes: "pilot floor",
      requestEnterprisePilot: true,
      source: "test",
      scenarioViewed: "gi-abdominal-pain",
      workflowModesUsed: ["sbar"]
    });

    expect(listBetaSignups()).toHaveLength(1);
    expect(listBetaSignups()[0]).toMatchObject({
      selectedRole: "Nursing",
      workflowInterest: "SBAR",
      clinicalSetting: "ED",
      scenarioInterest: "GI abdominal pain",
      requestEnterprisePilot: true
    });
    expect(listWorkflowEvents().some((event) => event.eventType === "beta_feedback_saved")).toBe(true);
  });

  it("does not persist beta_feedback_saved when workflow capture is disabled", () => {
    saveSettings({ ...defaultSettings, workflowCaptureEnabled: false });

    saveBetaFeedback(
      {
        sessionId: "session_1",
        role: "RN",
        setting: "ED",
        realismScore: 5,
        timeSavingScore: 5,
        wouldUseNextShift: "yes",
        magicalMoment: "timeline",
        unsafeConcern: "",
        requestedSpecialty: "GI",
        betaInterest: "yes"
      },
      "nurse@example.com"
    );

    expect(listBetaFeedback()).toHaveLength(0);
    expect(listBetaContacts()).toHaveLength(0);
    expect(listWorkflowEvents()).toHaveLength(0);
  });
});
