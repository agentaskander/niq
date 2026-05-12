import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { seedOntology } from "../data/seedOntology";
import { OntologyStudio } from "./OntologyStudio";

describe("OntologyStudio", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        removeItem: (key: string) => store.delete(key)
      }
    });
  });

  it("renders core infrastructure sections", () => {
    render(<OntologyStudio />);

    expect(screen.getByText("Internal Ontology Studio — Demo")).toBeInTheDocument();
    expect(screen.getByText("Ontology CRUD")).toBeInTheDocument();
    expect(screen.getByText("Narrative Clause Editor")).toBeInTheDocument();
    expect(screen.getByText("Co-occurrence Tracking")).toBeInTheDocument();
    expect(screen.getByText("Ontology Versioning")).toBeInTheDocument();
  });

  it("shows internal demo label and editor tabs", () => {
    render(<OntologyStudio />);

    expect(screen.getByText(/Internal Ontology Studio/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Symptoms" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Narrative Clauses" })).toBeInTheDocument();
  });

  it("exports the current draft and restores trusted seed with confirmation", () => {
    render(<OntologyStudio />);

    expect(screen.getByText("Trusted Seed")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Add specialty/i }));
    expect(screen.getByText("Local Draft")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Export Current Draft/i }));
    expect(screen.getAllByDisplayValue(/New Specialty Pack/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole("button", { name: /Restore Trusted Seed/i })[0]);
    expect(screen.getByText(/This will remove local ontology edits/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Confirm Restore Trusted Seed" }));

    expect(screen.getByDisplayValue(seedOntology.specialties[0].name)).toBeInTheDocument();
    expect(screen.getByText("Trusted ontology restored.")).toBeInTheDocument();
    expect(screen.getByText("Trusted Seed")).toBeInTheDocument();
    expect(seedOntology.specialties.length).toBeGreaterThan(0);
  });
});
