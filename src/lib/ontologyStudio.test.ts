import { beforeEach, describe, expect, it } from "vitest";
import { specialties } from "../data/specialties";
import { createOntologyVersion, defaultOntologyState, exportOntology, importOntology, resetOntologyState } from "./ontologyStudio";

describe("ontologyStudio", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value)
      }
    });
  });

  it("creates version snapshots", () => {
    const state = defaultOntologyState();
    const next = createOntologyVersion(state, "Test version", "Snapshot");

    expect(next.versions[0].label).toBe("Test version");
    expect(next.versions.length).toBe(state.versions.length + 1);
  });

  it("exports and imports ontology state", () => {
    const state = defaultOntologyState();
    const imported = importOntology(exportOntology(state));

    expect(imported.specialties.length).toBeGreaterThan(0);
    expect(imported.clauses.length).toBeGreaterThan(0);
  });

  it("seed ontology has required specialty and complaint depth", () => {
    expect(specialties.length).toBeGreaterThanOrEqual(10);
    for (const specialty of specialties) {
      expect(specialty.complaintGroups.length).toBeGreaterThanOrEqual(4);
      for (const group of specialty.complaintGroups) {
        expect(group.symptoms.length).toBeGreaterThanOrEqual(10);
        expect(group.modifiers.length).toBeGreaterThanOrEqual(8);
        expect(group.pertinentNegatives.length).toBeGreaterThanOrEqual(8);
        expect(group.observations.length).toBeGreaterThanOrEqual(6);
        expect(group.interventions.length).toBeGreaterThanOrEqual(6);
        expect((group.reassessmentPrompts ?? group.reassessmentOptions).length).toBeGreaterThanOrEqual(5);
        expect((group.escalationPrompts ?? group.redFlags).length).toBeGreaterThanOrEqual(5);
        expect(group.narrativeClauses?.length).toBeGreaterThanOrEqual(5);
      }
    }
  });

  it("resets to seed ontology", () => {
    const reset = resetOntologyState();

    expect(reset.specialties.length).toBe(specialties.length);
    expect(reset.specialties[0].complaintGroups.length).toBeGreaterThanOrEqual(4);
  });

  it("uses the same seed ontology source for library and demo consumers", () => {
    const state = defaultOntologyState();

    expect(state.specialties.map((specialty) => specialty.id)).toEqual(specialties.map((specialty) => specialty.id));
  });
});
