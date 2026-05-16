import { describe, expect, it } from "vitest";
import { demoScenarios } from "../data/demoScenarios";
import { demoSession } from "../data/demoSession";
import { seedOntology } from "../data/seedOntology";
import { generateNarrative } from "./narrativeEngine";

describe("workflow architecture preservation", () => {
  it("keeps provider notification linked to symptoms observations and interventions", () => {
    const providerEvent = demoSession.timelineEvents.find((event) => event.sourceType === "provider-notified")!;

    expect(providerEvent.linkedSymptomIds).toEqual(expect.arrayContaining(["ruq-pain", "nausea"]));
    expect(providerEvent.linkedObservationIds).toContain("guarding");
    expect(providerEvent.linkedInterventionIds).toContain("Provider notified per protocol");
  });

  it("keeps reassessment chain links on timeline events", () => {
    const reassessmentEvent = demoSession.timelineEvents.find((event) => event.sourceType === "reassessment")!;

    expect(reassessmentEvent.linkedSymptomIds).toContain("ruq-pain");
    expect(reassessmentEvent.linkedInterventionIds).toContain("Comfort measures offered");
    expect(reassessmentEvent.linkedReassessmentIds).toContain("Patient resting in position of comfort; pain unchanged at reassessment.");
  });

  it("keeps workflow mode metadata and export sections on narrative output", () => {
    const output = generateNarrative({ ...demoSession, selectedMode: "sbar" });

    expect(output.trackingMetadata.workflowMode).toBe("sbar");
    expect(output.trackingMetadata.analyticsCategory).toBe("sbar_output");
    expect(output.eventWeighting.escalation).toBeGreaterThan(1);
    expect(output.requiredOutputSections).toEqual(["Situation", "Background", "Assessment", "Recommendation"]);
  });

  it("keeps ontology concepts connected to narrative clauses and workflow facts", () => {
    const complaintGroups = seedOntology.specialties.flatMap((specialty) => specialty.complaintGroups);
    const abdominalPain = complaintGroups.find((group) => group.id === "abdominal-pain")!;

    expect(abdominalPain.symptoms.map((symptom) => symptom.id)).toContain("ruq-pain");
    expect(abdominalPain.observations.map((observation) => observation.id)).toContain("warm-dry");
    expect(abdominalPain.interventions).toContain("Provider notified per protocol");
    expect(abdominalPain.reassessmentOptions.length).toBeGreaterThan(0);
    expect(abdominalPain.narrativeClauses?.length).toBeGreaterThan(0);
  });

  it("keeps demo scenario event to fact relationships", () => {
    const gi = demoScenarios.find((scenario) => scenario.id === "gi-abdominal-pain")!;
    const providerEvent = gi.input.timelineEvents.find((event) => event.sourceType === "provider-notified")!;

    expect(providerEvent.linkedSymptomIds).toEqual(expect.arrayContaining(["ruq-pain", "nausea"]));
    expect(providerEvent.linkedObservationIds).toContain("guarding");
    expect(providerEvent.linkedInterventionIds).toContain("Provider notified per protocol");
  });
});
