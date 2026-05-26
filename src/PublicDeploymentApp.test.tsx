import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PublicDeploymentApp } from "./PublicDeploymentApp";

describe("PublicDeploymentApp", () => {
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

  it("redirects the root route to the public demo", () => {
    render(<PublicDeploymentApp />);

    expect(window.location.pathname).toBe("/");
    expect(screen.getByRole("heading", { name: /Longitudinal cognition infrastructure/i })).toBeInTheDocument();
    expect(screen.queryByText("Internal NarrativeIQ module preview — not intended for public publishing.")).not.toBeInTheDocument();
    expect(screen.queryByText("Structured clinical narratives at the speed of care.")).not.toBeInTheDocument();
  });

  it("serves the public healthcare cognition preview", () => {
    window.history.pushState({}, "", "/healthcare-cognition");
    render(<PublicDeploymentApp />);

    expect(screen.getByRole("heading", { name: "Healthcare Cognition Lab" })).toBeInTheDocument();
    expect(screen.getAllByText(/NarrativeIQ public demos are conceptual and investor-oriented/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Join Private Beta" }));
    expect(window.location.pathname).toBe("/beta");
    expect(screen.getByRole("heading", { name: "Join the Narrative Intelligence beta." })).toBeInTheDocument();
  });

  it("serves public lead capture routes without mailto primary CTAs", () => {
    window.history.pushState({}, "", "/contact");
    render(<PublicDeploymentApp />);

    expect(screen.getByRole("heading", { name: "Contact the NarrativeIQ team." })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "niq@synkos.net" })[0]).toHaveAttribute("href", "mailto:niq@synkos.net?subject=NarrativeIQ%20Private%20Beta%20Interest");
    expect(screen.getByRole("button", { name: /Send request/i }).tagName).toBe("BUTTON");
    const legacyEmail = `hello@${"agentaskander"}.com`;
    expect(document.body.textContent).not.toContain(legacyEmail);
  });

  it("blocks internal module routes from the public deployment registry", () => {
    window.history.pushState({}, "", "/modules/healthcare-cognition");
    render(<PublicDeploymentApp />);

    expect(screen.getByRole("heading", { name: "This route is not part of the public demo." })).toBeInTheDocument();
    expect(screen.queryByText("Internal Ideation Board — not for public publishing.")).not.toBeInTheDocument();
  });
});
