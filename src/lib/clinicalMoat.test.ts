import { describe, expect, it } from "vitest";
import { clinicalWorkflowModes } from "./clinicalWorkflowModes";
import { getModeMoatInsight, getWorkflowModeMoatSummary } from "./clinicalMoat";

describe("clinical workflow moat knowledge", () => {
  it("gives every workflow mode a moat insight and clinical metadata", () => {
    for (const mode of clinicalWorkflowModes) {
      expect(getModeMoatInsight(mode.id)).toBeTruthy();
      expect(mode.clinicalIntent).toBeTruthy();
      expect(mode.narrativeStructure.length).toBeGreaterThan(0);
      expect(mode.requiredOutputSections.length).toBeGreaterThan(0);
      expect(Object.keys(mode.eventWeighting).length).toBeGreaterThan(0);
      expect(mode.trackingMetadata.workflowMode).toBe(mode.id);
      expect(mode.trackingMetadata.cognitiveFrame).toBeTruthy();
      expect(mode.trackingMetadata.analyticsCategory).toBeTruthy();
    }
  });

  it("states the product thesis in durable knowledge", () => {
    const summary = getWorkflowModeMoatSummary().toLowerCase();

    expect(summary).toContain("not generate generic ai notes");
    expect(summary).toContain("workflow context");
    expect(summary).toContain("cognitive framing");
    expect(summary).toContain("event weighting");
    expect(summary).toContain("analytics metadata");
  });
});
