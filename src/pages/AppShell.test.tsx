import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { demoScenarios } from "../data/demoScenarios";
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

    const chestPainCard = screen.getAllByTestId("demo-scenario-card").find((card) => within(card).queryByText("Chest pain"));
    expect(chestPainCard).toBeDefined();
    fireEvent.click(chestPainCard!);

    expect(screen.getByText("Loaded: Chest pain")).toBeInTheDocument();
    expect(screen.getByDisplayValue(/chest pain/i)).toBeInTheDocument();
  });

  it("shows a prominent Demo Scenario selector with helper text and filters", () => {
    render(<AppShell mode="demo" />);

    expect(screen.getByTestId("demo-scenario-section")).toBeVisible();
    expect(screen.getByText("Demo Scenario")).toBeVisible();
    expect(screen.getByText("Loaded: GI abdominal pain")).toBeVisible();
    expect(screen.getByText("Choose a realistic patient workflow to preload symptoms, observations, and timeline events.")).toBeVisible();
    const filters = within(screen.getByTestId("scenario-filters"));
    ["All", "Nursing", "Provider", "Triage", "Telehealth", "Handoff/SBAR", "High-volume"].forEach((filter) => {
      expect(filters.getByRole("button", { name: filter })).toBeInTheDocument();
    });
  });

  it("renders readable scenario cards without white text on light backgrounds", () => {
    render(<AppShell mode="demo" />);

    const cards = screen.getAllByTestId("demo-scenario-card");
    expect(cards.length).toBeGreaterThanOrEqual(demoScenarios.length);
    cards.forEach((card) => {
      expect(card.className).not.toContain("text-white");
      expect(card.className).not.toContain("overflow-x");
    });
    expect(screen.getByRole("button", { name: /GI abdominal pain/i })).toHaveClass("border-blue-300", "bg-blue-50", "text-blue-900");
  });

  it("scenario filters narrow the visible card set without clipping labels", () => {
    render(<AppShell mode="demo" />);

    fireEvent.click(within(screen.getByTestId("scenario-filters")).getByRole("button", { name: "Telehealth" }));

    expect(screen.getByRole("button", { name: /Telehealth URI \/ medication question/i })).toBeVisible();
    screen.getAllByTestId("demo-scenario-card").forEach((card) => {
      expect(card.className).toContain("min-w-0");
    });
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

    expect(symptom).toHaveClass("selectable-chip--selected", "bg-blue-50", "text-slate-900");
    expect(screen.getByRole("button", { name: /RUQ pain/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /RUQ pain/ }).textContent?.trim()).not.toBe("");
  });

  it("timeline event add and edit changes timeline input", () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getAllByRole("button", { name: /Add event/i })[0]);
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Event type")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Detail"), { target: { value: "Patient states pain improved after rest." } });

    expect(screen.getByDisplayValue("Patient states pain improved after rest.")).toBeInTheDocument();
  });

  it("timeline event cards are compact by default", () => {
    render(<AppShell mode="demo" />);

    expect(screen.queryByLabelText("Date")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Time")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Event type")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Detail")).not.toBeInTheDocument();
    expect(screen.getByTestId("timeline-event-list")).toHaveClass("overflow-hidden");
  });

  it("Add Event buttons keep visible primary contrast", () => {
    render(<AppShell mode="blank" />);

    const buttons = screen.getAllByRole("button", { name: /Add Event/i });
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveClass("bg-blue-600", "text-white", "border-blue-600");
  });

  it("date/time selector renders quick options and +30m changes event time", () => {
    render(<AppShell mode="blank" />);

    fireEvent.click(screen.getAllByRole("button", { name: /Add event/i })[0]);
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    const timeInput = screen.getByLabelText("Time");
    const before = timeInput.getAttribute("value");
    fireEvent.click(screen.getByRole("button", { name: /Time quick options/i }));
    expect(screen.getByRole("button", { name: "Now" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+15m" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "+30m" }));

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

    expect(screen.getByRole("button", { name: /Generate/i })).toHaveClass("bg-blue-600", "text-white", "border-blue-600");
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

    expect(screen.getByText("Initial patient story")).toBeInTheDocument();
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

    expect(screen.getByText("RUQ pain began after meal")).toBeInTheDocument();
    expect(screen.getByText("Nausea worsened")).toBeInTheDocument();
    expect(screen.getAllByText("Provider notified").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Provider notified per protocol/i).length).toBeGreaterThan(0);
    expect(screen.queryByLabelText("Event type")).not.toBeInTheDocument();
    expect(screen.queryByText("0%")).not.toBeInTheDocument();
  });

  it("loading GI scenario increments workflow interactions by one", () => {
    render(<AppShell mode="demo" />);

    fireEvent.click(screen.getByRole("button", { name: /GI abdominal pain/i }));

    expect(workflowInteractions()).toBe(1);
  });

  it("Copy to EHR is always visible and enabled only after review", () => {
    render(<AppShell mode="blank" />);

    const disabledCopy = screen.getByRole("button", { name: /Review required before export/i });
    expect(disabledCopy).toBeInTheDocument();
    expect(disabledCopy).toBeDisabled();
    expect(disabledCopy).toHaveClass("bg-slate-100", "text-slate-700");
    expect(screen.getByTestId("review-copy-action-bar")).not.toHaveClass("sticky", "fixed");
    expect(screen.getByTestId("workflow-logic-panel")).not.toHaveClass("sticky", "fixed");
    expect(screen.getByTestId("review-required-card")).not.toHaveClass("sticky", "fixed");

    fireEvent.click(screen.getAllByRole("button", { name: /Review Required/i })[0]);

    const enabledCopy = screen.getByRole("button", { name: /Export to EHR/i });
    expect(enabledCopy).toBeEnabled();
  });

  it("review accept and copy to EHR each increment deliberate interactions by one", async () => {
    render(<AppShell mode="blank" />);

    expect(workflowInteractions()).toBe(0);
    fireEvent.click(screen.getAllByRole("button", { name: /Review Required/i })[0]);
    expect(workflowInteractions()).toBe(1);

    fireEvent.click(screen.getByRole("button", { name: /Export to EHR/i }));
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
