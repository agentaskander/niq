import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SelectableChip } from "./SelectableChip";

describe("SelectableChip", () => {
  it("keeps selected chip text visible", () => {
    render(<SelectableChip label="RUQ pain" selected onClick={() => undefined} />);

    const chip = screen.getByRole("button", { name: /RUQ pain/i });
    expect(chip).toHaveClass("selectable-chip", "selectable-chip--selected", "bg-[#EAF1F8]");
    expect(chip.textContent?.trim()).not.toBe("");
    expect(chip).toHaveTextContent("RUQ pain");
    expect(chip.querySelector(".selectable-chip__check")).toBeInTheDocument();
    expect(chip.className).not.toContain("text-white");
  });

  it("uses one selected class for symptoms, observations, interventions, and ontology chips", () => {
    render(
      <>
        <SelectableChip label="symptom" selected onClick={() => undefined} />
        <SelectableChip label="observation" selected tone="teal" onClick={() => undefined} />
        <SelectableChip label="intervention" selected tone="green" onClick={() => undefined} />
        <SelectableChip label="ontology" selected onClick={() => undefined} />
      </>
    );

    for (const chip of screen.getAllByRole("button")) {
      expect(chip).toHaveClass("selectable-chip--selected");
      expect(chip.textContent?.trim()).not.toBe("");
      expect(chip.querySelector(".selectable-chip__check")).toBeInTheDocument();
      expect(chip.className).not.toContain("text-white");
    }
  });
});
