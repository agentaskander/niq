import { describe, expect, it } from "vitest";
import { demoSession } from "../data/demoSession";
import {
  calculateNarrativeQuality,
  calculatePatientStoryCompleteness,
  calculateTimelineCompleteness
} from "./completeness";

describe("completeness", () => {
  it("calculates patient story completeness from actual state", () => {
    expect(calculatePatientStoryCompleteness({ ...demoSession, reviewed: false, narrativeGenerated: true })).toBeGreaterThan(70);
    expect(calculatePatientStoryCompleteness({ ...demoSession, selectedSymptoms: [], reviewed: false, narrativeGenerated: false })).toBeLessThan(90);
  });

  it("calculates timeline completeness by event count and event types", () => {
    expect(calculateTimelineCompleteness({ timelineEvents: [] })).toBe(0);
    expect(calculateTimelineCompleteness({ timelineEvents: demoSession.timelineEvents.slice(0, 1) })).toBe(25);
    expect(calculateTimelineCompleteness({ timelineEvents: demoSession.timelineEvents.slice(0, 2) })).toBe(50);
    expect(calculateTimelineCompleteness({ timelineEvents: demoSession.timelineEvents.slice(0, 3) })).toBe(75);
    expect(calculateTimelineCompleteness({ timelineEvents: demoSession.timelineEvents })).toBe(100);
  });

  it("caps narrative quality below 100 until reviewed", () => {
    expect(calculateNarrativeQuality({ ...demoSession, reviewed: false, narrativeGenerated: true })).toBeLessThanOrEqual(95);
    expect(calculateNarrativeQuality({ ...demoSession, reviewed: true, narrativeGenerated: true })).toBe(100);
  });
});
