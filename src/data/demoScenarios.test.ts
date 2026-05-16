import { describe, expect, it } from "vitest";
import { demoScenarios, type ScenarioRoleCoverage } from "./demoScenarios";

describe("demo scenario catalog", () => {
  it("includes a broad high-volume scenario set", () => {
    expect(demoScenarios.length).toBeGreaterThanOrEqual(20);

    [
      "GI abdominal pain",
      "Chest pain",
      "Shortness of breath",
      "Headache / dizziness",
      "Pediatric fever",
      "Sore throat / URI symptoms",
      "UTI symptoms",
      "Back pain"
    ].forEach((title) => {
      expect(demoScenarios.some((scenario) => scenario.title === title)).toBe(true);
    });
  });

  it("requires clinical metadata on every scenario", () => {
    demoScenarios.forEach((scenario) => {
      expect(scenario.roleCoverage.length).toBeGreaterThan(0);
      expect(scenario.clinicalSetting).not.toBe("");
      expect(["low", "moderate", "high"]).toContain(scenario.acuity);
      expect(["low", "medium", "high"]).toContain(scenario.frequency);
    });
  });

  it("covers every workflow mode family", () => {
    const roles = new Set(demoScenarios.flatMap((scenario) => scenario.roleCoverage));
    const requiredRoles: ScenarioRoleCoverage[] = ["Nursing", "Provider", "SOAP", "SBAR", "Handoff", "Triage", "Telehealth", "Advanced"];

    requiredRoles.forEach((role) => {
      expect(roles.has(role)).toBe(true);
    });
  });
});
