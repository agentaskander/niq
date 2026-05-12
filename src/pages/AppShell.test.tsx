import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { listWorkflowEvents } from "../lib/workflowCapture";
import { AppShell } from "./AppShell";

function installStorage() {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      clear: () => store.clear()
    }
  });
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: { randomUUID: () => `test-${Math.random().toString(16).slice(2)}` }
  });
  Object.defineProperty(globalThis.navigator, "clipboard", {
    configurable: true,
    value: { writeText: () => Promise.resolve() }
  });
}

function workflowInteractions() {
  const label = screen.getByText(/Workflow interactions:/i);
  return Number(label.textContent?.match(/Workflow interactions:\s*(\d+)/i)?.[1] ?? "0");
}

describe("AppShell demo workflow", () => {
  beforeEach(() => installStorage());

  it("scenario click loads scenario data", () => {
    render(<AppShell mode="demo" />);

    fireEvent.click(screen.getByRole("button", { name: "Chest pain" }));

    expect(screen.getByText("Loaded: Chest pain")).toBeInTheDocument();
    expect(screen.getByDisplayValue(/chest pain/i)).toBeInTheDocument();
  });

  it("role selection updates selected role", () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    fireEvent.click(screen.getByRole("button", { name: /Physician/i }));

    expect(screen.getByText("Role: Physician")).toBeInTheDocument();
  });

  it("symptom chip toggles selected state", () => {
    render(<AppShell mode="blank" />);
    const symptom = screen.getByRole("button", { name: "RUQ pain" });

    fireEvent.click(symptom);

    expect(symptom).toHaveClass("selectable-chip--selected", "bg-[#EAF1F8]");
    expect(screen.getByRole("button", { name: /RUQ pain/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /RUQ pain/ }).textContent?.trim()).not.toBe("");
  });

  it("timeline event add and edit changes timeline input", () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getAllByRole("button", { name: /Add event/i })[0]);
    fireEvent.change(screen.getByLabelText("Detail"), { target: { value: "Patient states pain improved after rest." } });

    expect(screen.getByDisplayValue("Patient states pain improved after rest.")).toBeInTheDocument();
  });

  it("Add Event buttons keep visible primary contrast", () => {
    render(<AppShell mode="blank" />);

    for (const button of screen.getAllByRole("button", { name: /Add Event/i })) {
      expect(button).toHaveStyle({ backgroundColor: "#2563EB", color: "#FFFFFF", borderColor: "#2563EB" });
      expect(button.className).not.toContain("bg-white");
    }
  });

  it("quick time option 30 min ago changes event time", () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getAllByRole("button", { name: /Add event/i })[0]);
    const timeInput = screen.getByLabelText("Time");
    const before = timeInput.getAttribute("value");
    fireEvent.click(screen.getByRole("button", { name: /Time quick options/i }));
    fireEvent.click(screen.getByRole("button", { name: "30 min ago" }));

    expect(screen.getByLabelText("Time").getAttribute("value")).not.toBe(before);
  });

  it("timeline time input accepts and formats typed values", () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getAllByRole("button", { name: /Add event/i })[0]);
    const timeInput = screen.getByLabelText("Time");
    fireEvent.change(timeInput, { target: { value: "13:05" } });
    fireEvent.blur(timeInput);

    expect(screen.getByDisplayValue("01:05 PM")).toBeInTheDocument();
  });

  it("timeline edit regenerates narrative from shared state", async () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getAllByRole("button", { name: /Add event/i })[0]);
    fireEvent.change(screen.getByLabelText("Detail"), { target: { value: "Patient states pain improved after rest." } });

    await waitFor(() => expect(screen.getAllByDisplayValue(/Patient states pain improved after rest/i).length).toBeGreaterThan(1));
  });

  it("deleting a timeline event returns to empty timeline state", () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getAllByRole("button", { name: /Add event/i })[0]);
    fireEvent.click(screen.getByTitle("Delete event"));

    expect(screen.getByText("Start building the patient story")).toBeInTheDocument();
  });

  it("narrative mode switch changes output", () => {
    render(<AppShell mode="demo" />);

    fireEvent.click(screen.getByRole("button", { name: "SBAR" }));

    expect(screen.getByDisplayValue(/Situation:/i)).toBeInTheDocument();
    expect(screen.getByText(/Why this mode matters/i)).toBeInTheDocument();
    expect(screen.getByText(/Changes output sections, event weighting/i)).toBeInTheDocument();
  });

  it("selecting a workflow mode increments interactions by exactly one", () => {
    render(<AppShell mode="demo" />);

    expect(workflowInteractions()).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "SBAR" }));

    expect(workflowInteractions()).toBe(1);
    expect(listWorkflowEvents().filter((event) => event.eventType === "workflow_mode_selected")).toHaveLength(1);
  });

  it("explicit generate increments interactions by exactly one", () => {
    render(<AppShell mode="blank" />);

    expect(workflowInteractions()).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: /Generate/i }));

    expect(workflowInteractions()).toBe(1);
    expect(listWorkflowEvents().filter((event) => event.eventType === "narrative_generate_clicked")).toHaveLength(1);
  });

  it("changing role once increments workflow interactions by one", () => {
    render(<AppShell mode="blank" />);

    expect(workflowInteractions()).toBe(0);
    fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    fireEvent.click(screen.getByRole("button", { name: /Physician/i }));

    expect(workflowInteractions()).toBe(1);
  });

  it("changing role with default narrative mode change increments by max two", () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /Telehealth/i })[0]);

    expect(workflowInteractions()).toBeLessThanOrEqual(2);
  });

  it("re-render and metric recalculation do not add workflow interactions", () => {
    const { rerender } = render(<AppShell mode="blank" />);

    fireEvent.click(screen.getByRole("button", { name: "RUQ pain" }));
    expect(workflowInteractions()).toBe(1);
    rerender(<AppShell mode="blank" />);

    expect(workflowInteractions()).toBe(1);
  });

  it("clicking Build Clinical Story adds timeline event when empty and updates narrative", () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getByRole("button", { name: "RUQ pain" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Build Clinical Story" })[0]);

    expect(screen.getByDisplayValue("Initial patient story")).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Timeline:/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinical story built from selected facts/i)).toBeInTheDocument();
    expect(listWorkflowEvents().some((event) => event.eventType === "clinical_story_built")).toBe(true);
    expect(screen.getAllByRole("button", { name: /Add Event/i }).length).toBeGreaterThan(0);
  });

  it("Build Clinical Story preserves existing timeline count", () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getAllByRole("button", { name: /Add event/i })[0]);
    expect(screen.getAllByLabelText("Detail")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "RUQ pain" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Build Clinical Story" })[0]);

    expect(screen.getAllByLabelText("Detail")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /Add Event/i }).length).toBeGreaterThan(0);
  });

  it("Build Clinical Story changes timeline completeness from 0%", () => {
    render(<AppShell mode="blank" />);

    expect(screen.getByText("0%")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "RUQ pain" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Build Clinical Story" })[0]);

    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("GI abdominal pain scenario renders multiple timeline events and nonzero completeness", () => {
    render(<AppShell mode="demo" />);

    fireEvent.click(screen.getByRole("button", { name: /GI abdominal pain/i }));

    expect(screen.getByDisplayValue("RUQ pain began after meal")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Nausea worsened")).toBeInTheDocument();
    expect(screen.getAllByDisplayValue("Provider notified").length).toBeGreaterThan(0);
    expect(screen.queryByText("0%")).not.toBeInTheDocument();
  });

  it("loading GI scenario increments workflow interactions by one", () => {
    render(<AppShell mode="demo" />);

    fireEvent.click(screen.getByRole("button", { name: /GI abdominal pain/i }));

    expect(workflowInteractions()).toBe(1);
  });

  it("Copy to EHR is always visible and enabled only after review", () => {
    render(<AppShell mode="blank" />);

    const disabledCopy = screen.getByRole("button", { name: /Copy to EHR - Review required/i });
    expect(disabledCopy).toBeInTheDocument();
    expect(disabledCopy).toBeDisabled();
    expect(screen.getByTestId("review-copy-action-bar")).toHaveClass("sticky", "bottom-24");

    fireEvent.click(screen.getAllByRole("button", { name: /Review Required/i })[0]);

    const enabledCopy = screen.getByRole("button", { name: /Copy to EHR/i });
    expect(enabledCopy).toBeEnabled();
  });

  it("review accept and copy to EHR each increment deliberate interactions by one", async () => {
    render(<AppShell mode="blank" />);

    expect(workflowInteractions()).toBe(0);
    fireEvent.click(screen.getAllByRole("button", { name: /Review Required/i })[0]);
    expect(workflowInteractions()).toBe(1);

    fireEvent.click(screen.getByRole("button", { name: /Copy to EHR/i }));
    await waitFor(() => expect(workflowInteractions()).toBe(2));
    expect(listWorkflowEvents().some((event) => event.eventType === "review_gate_accepted")).toBe(true);
    expect(listWorkflowEvents().some((event) => event.eventType === "ehr_copy_clicked")).toBe(true);
  });

  it("Reset Demo Data sets workflow interactions to 0", () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getByRole("button", { name: "RUQ pain" }));
    expect(workflowInteractions()).toBe(1);
    fireEvent.click(screen.getByRole("button", { name: "Reset Demo Data" }));

    expect(workflowInteractions()).toBe(0);
  });
});
