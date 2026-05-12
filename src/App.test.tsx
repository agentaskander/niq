import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App navigation", () => {
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
  });

  it("renders compact bottom dock styling", () => {
    window.history.pushState({}, "", "/demo");
    render(<App />);

    expect(document.querySelector("nav")?.className).toContain("max-w-3xl");
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
});
