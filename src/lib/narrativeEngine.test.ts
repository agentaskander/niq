import { describe, expect, it } from "vitest";
import { demoSession } from "../data/demoSession";
import { roleScopes } from "../data/roleScopes";
import { generateNarrative } from "./narrativeEngine";

describe("generateNarrative", () => {
  it("keeps RN output free of diagnosis claims", () => {
    const output = generateNarrative({ ...demoSession, selectedMode: "nursing" });

    expect(output.text.toLowerCase()).not.toContain("diagnosed with");
    expect(output.text.toLowerCase()).not.toContain("consistent with cholecystitis");
    expect(output.text.toLowerCase()).toContain("symptoms documented for provider evaluation");
  });

  it("keeps RN output free of treatment orders", () => {
    const output = generateNarrative({
      ...demoSession,
      selectedMode: "nursing",
      interventions: ["order ultrasound", "start antibiotics", "prescribe medication"]
    });

    expect(output.text.toLowerCase()).not.toContain("order ultrasound");
    expect(output.text.toLowerCase()).not.toContain("start antibiotics");
    expect(output.text.toLowerCase()).not.toContain("prescribe");
  });

  it("marks provider modes draft and review required", () => {
    const physician = roleScopes.find((role) => role.id === "physician")!;
    const output = generateNarrative({ ...demoSession, role: physician, selectedMode: "provider" });

    expect(output.reviewRequired).toBe(true);
    expect(output.text).toContain("Assessment draft");
    expect(output.text).toContain("Plan draft");
    expect(output.text).toContain("Clinician review required");
  });

  it("only uses supplied facts", () => {
    const output = generateNarrative({ ...demoSession, selectedSymptoms: ["nausea"], selectedMode: "advanced" });

    expect(output.text.toLowerCase()).toContain("nausea");
    expect(output.text.toLowerCase()).not.toContain("headache");
    expect(output.text.toLowerCase()).not.toContain("short phrases");
  });

  it("includes required SBAR sections", () => {
    const output = generateNarrative({ ...demoSession, selectedMode: "sbar" });

    expect(output.text).toContain("Situation:");
    expect(output.text).toContain("Background:");
    expect(output.text).toContain("Assessment:");
    expect(output.text).toContain("Recommendation/Request:");
  });

  it("includes handoff timeline and pending items", () => {
    const output = generateNarrative({ ...demoSession, selectedMode: "handoff" });

    expect(output.text).toContain("Timeline:");
    expect(output.text).toContain("Pending follow-up:");
    expect(output.text).toContain("Awaiting provider direction");
  });

  it("supports SOAP only with assessment and plan draft when role allows", () => {
    const physician = roleScopes.find((role) => role.id === "physician")!;
    const providerOutput = generateNarrative({ ...demoSession, role: physician, selectedMode: "soap" });
    const rnOutput = generateNarrative({ ...demoSession, selectedMode: "soap" });

    expect(providerOutput.text).toContain("Assessment draft");
    expect(providerOutput.text).toContain("Plan draft");
    expect(rnOutput.mode).toBe("nursing");
  });
});
