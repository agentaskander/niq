import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App navigation", () => {
  beforeEach(() => {
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
    window.history.pushState({}, "", "/demo");
    render(<App />);

    expect(screen.getByRole("button", { name: "Marketing" })).toBeInTheDocument();
    expect(screen.getAllByText("Interactive Demo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("New Story").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Library").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adoption" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Workflow Intel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ontology" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
  });

  it("renders compact bottom dock styling", () => {
    window.history.pushState({}, "", "/demo");
    render(<App />);

    expect(document.querySelector("nav")?.className).toContain("max-w-3xl");
    expect(screen.getByRole("button", { name: "Demo" })).toHaveClass("bg-blue-50", "text-blue-800", "ring-blue-200");
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

  it("shows beta CTAs on marketing and demo pages", () => {
    window.history.pushState({}, "", "/");
    const { unmount } = render(<App />);

    expect(screen.getAllByRole("button", { name: /Try Demo/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Join Beta/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Book Enterprise Pilot/i }).length).toBeGreaterThan(0);

    unmount();
    window.history.pushState({}, "", "/demo");
    render(<App />);

    expect(screen.getByRole("button", { name: "Join Beta" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Book Enterprise Pilot" })).toBeInTheDocument();
  });

  it("renders beta route from Join Beta CTA", () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    fireEvent.click(screen.getAllByRole("button", { name: /Join Beta/i })[0]);

    expect(screen.getByText("Join the clinical workflow waitlist.")).toBeInTheDocument();
    expect(screen.getByText("Workflow interest")).toBeInTheDocument();
  });
});
