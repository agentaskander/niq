import { beforeEach, describe, expect, it } from "vitest";
import { demoSession } from "../data/demoSession";
import { saveBetaFeedback, createSession, listBetaContacts, listWorkflowEvents, logWorkflowEvent } from "./workflowCapture";

describe("workflowCapture", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        clear: () => store.clear()
      }
    });
  });

  it("logs workflow events", () => {
    const session = createSession(demoSession);
    logWorkflowEvent(session, demoSession, "symptom_selected", "facts", { symptomId: "nausea" });

    expect(listWorkflowEvents()).toHaveLength(1);
    expect(listWorkflowEvents()[0].eventType).toBe("symptom_selected");
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
});
