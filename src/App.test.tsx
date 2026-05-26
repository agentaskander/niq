import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App navigation", () => {
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

  it("shows primary public and internal route labels", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "Marketing" })).toBeInTheDocument();
    expect(screen.getAllByText("Demo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("New Story").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Library").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adoption" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Workflow Intel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ontology" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
  });

  it("renders compact bottom dock styling", () => {
    render(<App />);

    expect(document.querySelector("nav")?.className).toContain("max-w-3xl");
    expect(screen.getByRole("button", { name: "Marketing" })).toHaveClass("bg-blue-50", "text-blue-800", "ring-blue-200");
  });

  it("renders the isolated public demo without the internal dock", () => {
    window.history.pushState({}, "", "/demo");
    render(<App />);

    expect(screen.getByRole("heading", { name: /Longitudinal cognition infrastructure/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Public demo navigation" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Explore Healthcare Cognition Lab" }).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "New Story" })).not.toBeInTheDocument();
  });

  it("renders the sanitized public healthcare cognition page", () => {
    window.history.pushState({}, "", "/demo/healthcare-cognition");
    render(<App />);

    expect(screen.getByRole("heading", { name: "Healthcare Cognition Lab" })).toBeInTheDocument();
    expect(screen.getAllByText(/NarrativeIQ public demos are conceptual and investor-oriented/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Join Private Beta" })).toHaveAttribute("href", "https://niq.synkos.net/beta");
    expect(screen.queryByText("Internal Ideation Board — not for public publishing.")).not.toBeInTheDocument();
  });

  it("renders the module index route", () => {
    window.history.pushState({}, "", "/modules");
    render(<App />);

    expect(screen.getByRole("heading", { name: "Choose a focused NarrativeIQ lab." })).toBeInTheDocument();
    expect(screen.getByText("Healthcare Cognition Lab")).toBeInTheDocument();
    expect(screen.getByText("New Patient Story")).toBeInTheDocument();
  });

  it("renders the healthcare cognition module and alias", async () => {
    window.history.pushState({}, "", "/modules/healthcare-cognition");
    const { unmount } = render(<App />);

    expect(await screen.findByRole("heading", { name: /Healthcare workflow cognition without PHI/i })).toBeInTheDocument();
    expect(screen.getByText("Eight defensible surfaces for healthcare cognition")).toBeInTheDocument();
    expect(screen.getByText("Internal Ideation Board — not for public publishing.")).toBeInTheDocument();

    unmount();
    window.history.pushState({}, "", "/narrativeiq/healthcare-cognition");
    render(<App />);

    expect(await screen.findByRole("heading", { name: /Healthcare workflow cognition without PHI/i })).toBeInTheDocument();
  });

  it("keeps the old patient story module route available", () => {
    window.history.pushState({}, "", "/modules/new-patient-story");
    render(<App />);

    expect(screen.getAllByText(/Patient Story Timeline/i).length).toBeGreaterThan(0);
  });

  it("renders the dark mode concept lab route", () => {
    window.history.pushState({}, "", "/lab/dark-mode");
    render(<App />);

    expect(screen.getByText("Dark Mode Concept Lab")).toBeInTheDocument();
    expect(screen.getByText(/Compare Production vs Concept Lab/i)).toBeInTheDocument();
  });

  it("renders the Ontology Studio route", () => {
    window.history.pushState({}, "", "/app/ontology");
    render(<App />);

    expect(screen.getByText("Internal Ontology Studio — Demo")).toBeInTheDocument();
  });

  it("renders Library details route", () => {
    window.history.pushState({}, "", "/app/library");
    render(<App />);

    expect(screen.getByText("NarrativeIQ Library")).toBeInTheDocument();
    expect(screen.getByText(/Seeded specialty templates/i)).toBeInTheDocument();
  });

  it("shows beta CTAs on marketing while keeping the public demo separate", () => {
    const { unmount } = render(<App />);

    expect(screen.getAllByRole("button", { name: /Try Demo/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Join Beta/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Book Enterprise Pilot/i }).length).toBeGreaterThan(0);

    unmount();
    window.history.pushState({}, "", "/demo");
    render(<App />);

    expect(screen.queryByRole("button", { name: "Join Beta" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Book Enterprise Pilot" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Public Module Previews/i }).length).toBeGreaterThan(0);
  });

  it("renders beta route from Join Beta CTA", () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    fireEvent.click(screen.getAllByRole("button", { name: /Join Beta/i })[0]);

    expect(screen.getByText("Join the clinical workflow waitlist.")).toBeInTheDocument();
    expect(screen.getByText("Workflow interest")).toBeInTheDocument();
  });
});
