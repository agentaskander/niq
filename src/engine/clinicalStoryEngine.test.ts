import { describe, expect, it } from "vitest";
import { demoSession } from "../data/demoSession";
import { buildClinicalStory, calculateStoryCompleteness, getAllowedNarrativeModes } from "./clinicalStoryEngine";

describe("clinicalStoryEngine", () => {
  it("buildClinicalStory returns structured story from selected facts", () => {
    const story = buildClinicalStory(demoSession);

    expect(story.role).toBe("rn");
    expect(story.selectedSymptoms).toContain("RUQ pain");
    expect(story.storySummary).toContain("Abdominal Pain");
    expect(story.completenessScore).toBeGreaterThan(50);
  });

  it("buildClinicalStory reports missing elements", () => {
    const story = buildClinicalStory({ ...demoSession, selectedSymptoms: [], timelineEvents: [], observations: [] });

    expect(story.missingElements).toContain("Select at least one symptom");
    expect(story.missingElements).toContain("Add at least two timeline events");
  });

  it("calculates story completeness and allowed modes", () => {
    expect(calculateStoryCompleteness(demoSession)).toBeGreaterThan(50);
    expect(getAllowedNarrativeModes(demoSession.role)).toContain("nursing");
  });
});
