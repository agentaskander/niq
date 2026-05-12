import { seedOntology } from "../data/seedOntology";
import { captureWorkflowEvent } from "./workflowCapture";
import type { OntologyStudioState, OntologyVersion, Specialty } from "./types";

const ONTOLOGY_KEY = "niq.ontologyStudio.v1";
const now = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function defaultOntologyState(): OntologyStudioState {
  return clone(seedOntology);
}

export function loadOntologyState(): OntologyStudioState {
  if (typeof localStorage === "undefined" || typeof localStorage.getItem !== "function") return defaultOntologyState();
  const raw = localStorage.getItem(ONTOLOGY_KEY);
  if (!raw) return defaultOntologyState();
  try {
    return JSON.parse(raw) as OntologyStudioState;
  } catch {
    return defaultOntologyState();
  }
}

export function resetOntologyState() {
  const next = defaultOntologyState();
  if (typeof localStorage !== "undefined") {
    if (typeof localStorage.removeItem === "function") localStorage.removeItem(ONTOLOGY_KEY);
    else if (typeof localStorage.setItem === "function") localStorage.setItem(ONTOLOGY_KEY, JSON.stringify(next));
  }
  return next;
}

export function saveOntologyState(state: OntologyStudioState) {
  const next = { ...state, source: "draft" as const, updatedAt: now() };
  if (typeof localStorage !== "undefined" && typeof localStorage.setItem === "function") {
    localStorage.setItem(ONTOLOGY_KEY, JSON.stringify(next));
  }
  return next;
}

export function countSymptoms(packs: Specialty[]) {
  return new Set(packs.flatMap((specialty) => specialty.complaintGroups.flatMap((group) => group.symptoms.map((symptom) => symptom.id)))).size;
}

export function createOntologyVersion(state: OntologyStudioState, label: string, notes: string) {
  const version: OntologyVersion = {
    versionId: makeId("version"),
    createdAt: now(),
    label,
    notes,
    specialtyCount: state.specialties.length,
    symptomCount: countSymptoms(state.specialties),
    clauseCount: state.clauses.length
  };
  return saveOntologyState({
    ...state,
    versions: [version, ...state.versions],
    activeVersionId: version.versionId
  });
}

export function exportOntology(state: OntologyStudioState) {
  return JSON.stringify(state, null, 2);
}

export function importOntology(json: string) {
  const parsed = JSON.parse(json) as OntologyStudioState;
  if (!Array.isArray(parsed.specialties) || !Array.isArray(parsed.clauses)) {
    throw new Error("Invalid ontology payload.");
  }
  return saveOntologyState({ ...parsed, source: "draft", updatedAt: now() });
}

export function logOntologyRestoredSeed() {
  captureWorkflowEvent({
    eventId: makeId("event"),
    sessionId: "ontology-studio",
    timestamp: now(),
    eventType: "ontology_restored_seed",
    payload: { source: "trusted-seed" },
    step: "facts",
    role: "admin",
    specialty: "ontology-studio",
    complaintGroup: "trusted-seed"
  });
}
