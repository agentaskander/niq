import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { defaultSettings, saveSettings } from "../lib/settings";
import { listBetaSignups } from "../lib/workflowCapture";
import { BetaSignupPage } from "./BetaSignupPage";

function installStorage() {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear()
    }
  });
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: { randomUUID: () => `test-${Math.random().toString(16).slice(2)}` }
  });
  saveSettings(defaultSettings);
}

describe("BetaSignupPage", () => {
  beforeEach(() => {
    installStorage();
    window.history.pushState({}, "", "/beta");
  });

  it("renders waitlist fields and workflow selectors", () => {
    render(<BetaSignupPage onNavigate={() => undefined} />);

    expect(screen.getByText("Join the clinical workflow waitlist.")).toBeInTheDocument();
    expect(screen.getByText("Selected role")).toBeInTheDocument();
    expect(screen.getByText("Workflow interest")).toBeInTheDocument();
    expect(screen.getByLabelText(/Clinical setting/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Scenario interest/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Organization \/ company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Optional notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Request enterprise pilot conversation/i)).toBeInTheDocument();
  });

  it("validates required organization and email before submit", () => {
    render(<BetaSignupPage onNavigate={() => undefined} />);

    fireEvent.click(screen.getByRole("button", { name: /Join Beta/i }));

    expect(screen.getByText("Enter an organization and valid email to join the beta.")).toBeInTheDocument();
    expect(listBetaSignups()).toHaveLength(0);
  });

  it("saves workflow-aware beta signup data", () => {
    render(<BetaSignupPage onNavigate={() => undefined} />);

    fireEvent.click(within(screen.getByTestId("beta-role-options")).getByRole("button", { name: "Provider" }));
    fireEvent.click(within(screen.getByTestId("beta-workflow-options")).getByRole("button", { name: "Telehealth" }));
    fireEvent.change(screen.getByLabelText(/Clinical setting/i), { target: { value: "telehealth" } });
    fireEvent.change(screen.getByLabelText(/Organization \/ company/i), { target: { value: "Demo Health" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "pilot@example.com" } });
    fireEvent.click(screen.getByLabelText(/Request enterprise pilot conversation/i));
    fireEvent.click(screen.getByRole("button", { name: /Join Beta/i }));

    expect(screen.getByText("Beta request saved.")).toBeInTheDocument();
    expect(listBetaSignups()).toHaveLength(1);
    expect(listBetaSignups()[0]).toMatchObject({
      selectedRole: "Provider",
      workflowInterest: "Telehealth",
      clinicalSetting: "telehealth",
      organization: "Demo Health",
      email: "pilot@example.com",
      requestEnterprisePilot: true
    });
  });

  it("prefills scenario and workflow from demo query params", () => {
    window.history.pushState({}, "", "/beta?scenario=chest-pain&workflow=provider&pilot=enterprise");

    render(<BetaSignupPage onNavigate={() => undefined} />);

    expect(screen.getByLabelText(/Scenario interest/i)).toHaveValue("Chest pain");
    expect(within(screen.getByTestId("beta-workflow-options")).getByRole("button", { name: "Provider" })).toHaveClass("bg-blue-50", "text-blue-900");
    expect(screen.getByLabelText(/Request enterprise pilot conversation/i)).toBeChecked();
  });
});
