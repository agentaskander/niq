import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BetaDeploymentApp } from "./BetaDeploymentApp";

describe("BetaDeploymentApp", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    Object.defineProperty(globalThis, "IntersectionObserver", {
      configurable: true,
      value: class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    });
  });

  it("redirects the root route to beta intake", () => {
    render(<BetaDeploymentApp />);

    expect(window.location.pathname).toBe("/beta");
    expect(screen.getByRole("heading", { name: "Join the Narrative Intelligence beta." })).toBeInTheDocument();
    expect(screen.queryByText("Structured clinical narratives at the speed of care.")).not.toBeInTheDocument();
  });

  it("serves beta intake", () => {
    window.history.pushState({}, "", "/beta");
    render(<BetaDeploymentApp />);

    expect(screen.getByRole("heading", { name: "Join the Narrative Intelligence beta." })).toBeInTheDocument();
  });

  it("serves the private healthcare beta preview", () => {
    window.history.pushState({}, "", "/beta/healthcare-cognition");
    render(<BetaDeploymentApp />);

    expect(screen.getByRole("heading", { name: "Healthcare Cognition Lab" })).toBeInTheDocument();
    expect(screen.getByText("Private Beta Preview")).toBeInTheDocument();
  });

  it("blocks module routes", () => {
    window.history.pushState({}, "", "/modules/new-patient-story");
    render(<BetaDeploymentApp />);

    expect(screen.getByRole("heading", { name: "This route is outside the beta preview." })).toBeInTheDocument();
    expect(screen.queryByText("Internal NarrativeIQ module preview — not intended for public publishing.")).not.toBeInTheDocument();
  });
});
