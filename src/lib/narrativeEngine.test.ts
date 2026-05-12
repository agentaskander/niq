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
    expect(output.requiredOutputSections).toEqual(["Situation", "Background", "Assessment", "Recommendation"]);
  });

  it("includes handoff timeline and pending items", () => {
    const output = generateNarrative({ ...demoSession, selectedMode: "handoff" });

    expect(output.text).toContain("Timeline:");
    expect(output.text).toContain("Open loops:");
    expect(output.text).toContain("Risks / unresolved items:");
    expect(output.text).toContain("Pending actions:");
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

  it("selecting SOAP creates SOAP sections", () => {
    const physician = roleScopes.find((role) => role.id === "physician")!;
    const output = generateNarrative({ ...demoSession, role: physician, selectedMode: "soap" });

    expect(output.text).toContain("Subjective:");
    expect(output.text).toContain("Objective:");
    expect(output.text).toContain("Assessment:");
    expect(output.text).toContain("Plan:");
    expect(output.trackingMetadata.analyticsCategory).toBe("soap_output");
  });

  it("selecting Triage creates acuity red flag and disposition sections", () => {
    const output = generateNarrative({ ...demoSession, selectedMode: "triage" });

    expect(output.text).toContain("Acuity:");
    expect(output.text).toContain("Red flags:");
    expect(output.text).toContain("Disposition:");
  });

  it("selecting Telehealth creates remote patient-reported and follow-up sections", () => {
    const telehealth = roleScopes.find((role) => role.id === "telehealth")!;
    const output = generateNarrative({ ...demoSession, role: telehealth, selectedMode: "telehealth" });

    expect(output.text).toContain("Patient-reported symptoms:");
    expect(output.text).toContain("Remote constraints:");
    expect(output.text).toContain("Limited exam:");
    expect(output.text).toContain("Follow-up:");
    expect(output.text).toContain("Escalation:");
  });

  it("Nursing and Provider produce meaningfully different structures", () => {
    const physician = roleScopes.find((role) => role.id === "physician")!;
    const nursingOutput = generateNarrative({ ...demoSession, selectedMode: "nursing" });
    const providerOutput = generateNarrative({ ...demoSession, role: physician, selectedMode: "provider" });

    expect(nursingOutput.requiredOutputSections).toContain("Bedside timeline");
    expect(providerOutput.requiredOutputSections).toContain("MDM and compliance");
    expect(nursingOutput.text).toContain("Interventions and tasks:");
    expect(providerOutput.text).toContain("MDM and compliance context:");
  });
});
