import { useMemo, useState } from "react";
import { BarChart3, Boxes, Database, DownloadCloud, FileText, GitBranch, History, Network, Pencil, Plus, Save, Share2, ShieldCheck, UploadCloud } from "lucide-react";
import { SelectableChip } from "../components/SelectableChip";
import { narrativeModes } from "../data/narrativeModes";
import { roleScopes } from "../data/roleScopes";
import { computeOntologyUsageStats, listWorkflowEvents } from "../lib/workflowCapture";
import { isWorkflowCaptureEnabled } from "../lib/settings";
import {
  countSymptoms,
  createOntologyVersion,
  exportOntology,
  importOntology,
  logOntologyRestoredSeed,
  loadOntologyState,
  resetOntologyState,
  saveOntologyState
} from "../lib/ontologyStudio";
import type { ClinicalObservation, ClinicalSymptom, NarrativeClause, RoleScopeId } from "../lib/types";

const editorTabs = ["Symptoms", "Modifiers", "Negatives", "Observations", "Interventions", "Reassessments", "Red Flags", "Narrative Clauses", "Role Restrictions"] as const;

export function OntologyStudio() {
  const [state, setState] = useState(loadOntologyState);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(state.specialties[0]?.id ?? "");
  const [selectedGroupId, setSelectedGroupId] = useState(state.specialties[0]?.complaintGroups[0]?.id ?? "");
  const [importText, setImportText] = useState("");
  const [status, setStatus] = useState("");
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof editorTabs)[number]>("Symptoms");
  const selectedSpecialty = state.specialties.find((specialty) => specialty.id === selectedSpecialtyId) ?? state.specialties[0];
  const selectedGroup = selectedSpecialty?.complaintGroups.find((group) => group.id === selectedGroupId) ?? selectedSpecialty?.complaintGroups[0];
  const usage = computeOntologyUsageStats();
  const captureEnabled = isWorkflowCaptureEnabled();
  const workflowEvents = listWorkflowEvents();
  const coPairs = usage
    .flatMap((stat) => Object.entries(stat.coSelectedSymptoms).map(([co, count]) => ({ pair: `${stat.symptomId} + ${co}`, count })))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const save = (next = state, message = "Ontology saved locally.") => {
    const saved = saveOntologyState(next);
    setState(saved);
    setStatus(message);
    window.setTimeout(() => setStatus(""), 1800);
  };

  const restoreTrustedSeed = () => {
    const reset = resetOntologyState();
    logOntologyRestoredSeed();
    setState(reset);
    setSelectedSpecialtyId(reset.specialties[0]?.id ?? "");
    setSelectedGroupId(reset.specialties[0]?.complaintGroups[0]?.id ?? "");
    setConfirmRestore(false);
    setStatus("Trusted ontology restored.");
    window.setTimeout(() => setStatus(""), 1800);
  };

  const exportCurrentDraft = () => {
    const json = exportOntology(state);
    setImportText(json);
    if (typeof document !== "undefined" && typeof URL !== "undefined" && typeof Blob !== "undefined" && typeof URL.createObjectURL === "function") {
      const href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = href;
      link.download = `narrativeiq-ontology-draft-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(href);
    }
    setStatus("Current draft exported.");
    window.setTimeout(() => setStatus(""), 1800);
  };

  const updateSpecialtyName = (name: string) => {
    save({
      ...state,
      specialties: state.specialties.map((specialty) => specialty.id === selectedSpecialty.id ? { ...specialty, name } : specialty)
    });
  };

  const updateGroupName = (name: string) => {
    save({
      ...state,
      specialties: state.specialties.map((specialty) => specialty.id === selectedSpecialty.id
        ? {
            ...specialty,
            complaintGroups: specialty.complaintGroups.map((group) => group.id === selectedGroup.id ? { ...group, name } : group)
          }
        : specialty)
    });
  };

  const updateGroupArray = (field: "pertinentNegatives" | "interventions" | "modifiers" | "redFlags" | "reassessmentOptions", value: string) => {
    const items = value.split("\n").map((item) => item.trim()).filter(Boolean);
    save({
      ...state,
      specialties: state.specialties.map((specialty) => specialty.id === selectedSpecialty.id
        ? {
            ...specialty,
            complaintGroups: specialty.complaintGroups.map((group) => group.id === selectedGroup.id ? { ...group, [field]: items } : group)
          }
        : specialty)
    });
  };

  const addSpecialty = () => {
    const id = `specialty-${Date.now()}`;
    const groupId = `complaint-${Date.now()}`;
    const next = {
      id,
      name: "New Specialty Pack",
      description: "Custom internal ontology specialty pack.",
      careSettings: ["internal demo"],
      version: "0.1.0",
      updatedAt: new Date().toISOString(),
      complaintGroups: [{
        id: groupId,
        specialtyId: id,
        name: "General Clinical Concern",
        description: "Custom internal complaint workflow.",
        symptoms: [],
        timingOptions: ["started today"],
        severityOptions: ["mild", "moderate", "severe"],
        modifiers: [],
        pertinentNegatives: [],
        observations: [],
        interventions: [],
        reassessmentOptions: [],
        redFlags: [],
        narrativeClauses: [],
        relatedComplaintGroups: []
      }]
    };
    save({ ...state, specialties: [next, ...state.specialties] }, "Specialty pack created.");
    setSelectedSpecialtyId(id);
    setSelectedGroupId(groupId);
  };

  const addComplaintGroup = () => {
    const id = `complaint-${Date.now()}`;
    const nextGroup = {
      id,
      specialtyId: selectedSpecialty.id,
      name: "New Complaint Group",
      description: "Custom internal complaint workflow.",
      symptoms: [],
      timingOptions: ["started today"],
      severityOptions: ["mild", "moderate", "severe"],
      modifiers: [],
      pertinentNegatives: [],
      observations: [],
      interventions: [],
      reassessmentOptions: [],
      redFlags: [],
      narrativeClauses: [],
      relatedComplaintGroups: []
    };
    save({
      ...state,
      specialties: state.specialties.map((specialty) => specialty.id === selectedSpecialty.id ? { ...specialty, complaintGroups: [nextGroup, ...specialty.complaintGroups] } : specialty)
    }, "Complaint group created.");
    setSelectedGroupId(id);
  };

  const deleteComplaintGroup = () => {
    const groups = selectedSpecialty.complaintGroups.filter((group) => group.id !== selectedGroup.id);
    save({
      ...state,
      specialties: state.specialties.map((specialty) => specialty.id === selectedSpecialty.id ? { ...specialty, complaintGroups: groups } : specialty)
    }, "Complaint group deleted.");
    setSelectedGroupId(groups[0]?.id ?? "");
  };

  const updateSymptom = (id: string, label: string) => {
    save({
      ...state,
      specialties: state.specialties.map((specialty) => specialty.id === selectedSpecialty.id
        ? { ...specialty, complaintGroups: specialty.complaintGroups.map((group) => group.id === selectedGroup.id ? { ...group, symptoms: group.symptoms.map((symptom) => symptom.id === id ? { ...symptom, label, updatedAt: new Date().toISOString() } : symptom) } : group) }
        : specialty)
    });
  };

  const deleteSymptom = (id: string) => {
    save({
      ...state,
      specialties: state.specialties.map((specialty) => specialty.id === selectedSpecialty.id
        ? { ...specialty, complaintGroups: specialty.complaintGroups.map((group) => group.id === selectedGroup.id ? { ...group, symptoms: group.symptoms.filter((symptom) => symptom.id !== id) } : group) }
        : specialty)
    });
  };

  const updateObservation = (id: string, label: string) => {
    save({
      ...state,
      specialties: state.specialties.map((specialty) => specialty.id === selectedSpecialty.id
        ? { ...specialty, complaintGroups: specialty.complaintGroups.map((group) => group.id === selectedGroup.id ? { ...group, observations: group.observations.map((observation) => observation.id === id ? { ...observation, label } : observation) } : group) }
        : specialty)
    });
  };

  const deleteObservation = (id: string) => {
    save({
      ...state,
      specialties: state.specialties.map((specialty) => specialty.id === selectedSpecialty.id
        ? { ...specialty, complaintGroups: specialty.complaintGroups.map((group) => group.id === selectedGroup.id ? { ...group, observations: group.observations.filter((observation) => observation.id !== id) } : group) }
        : specialty)
    });
  };

  const addSymptom = () => {
    const symptom: ClinicalSymptom = { id: `symptom-${Date.now()}`, label: "New symptom", category: "custom", synonyms: [] };
    save({
      ...state,
      specialties: state.specialties.map((specialty) => specialty.id === selectedSpecialty.id
        ? {
            ...specialty,
            complaintGroups: specialty.complaintGroups.map((group) => group.id === selectedGroup.id ? { ...group, symptoms: [...group.symptoms, symptom] } : group)
          }
        : specialty)
    });
  };

  const addObservation = () => {
    const observation: ClinicalObservation = { id: `observation-${Date.now()}`, label: "New observation", category: "custom" };
    save({
      ...state,
      specialties: state.specialties.map((specialty) => specialty.id === selectedSpecialty.id
        ? {
            ...specialty,
            complaintGroups: specialty.complaintGroups.map((group) => group.id === selectedGroup.id ? { ...group, observations: [...group.observations, observation] } : group)
          }
        : specialty)
    });
  };

  const addClause = () => {
    const clause: NarrativeClause = {
      clauseId: `clause-${Date.now()}`,
      mode: "nursing",
      roleScope: "all",
      specialtyId: selectedSpecialty.id,
      complaintGroupId: selectedGroup.id,
      text: "New approved narrative clause using selected facts only.",
      safetyLevel: "review"
    };
    save({ ...state, clauses: [clause, ...state.clauses] });
  };

  const updateClause = (clauseId: string, patch: Partial<NarrativeClause>) => {
    save({ ...state, clauses: state.clauses.map((clause) => clause.clauseId === clauseId ? { ...clause, ...patch } : clause) });
  };

  const updateRoleRestriction = (roleId: RoleScopeId, text: string) => {
    save({
      ...state,
      roleRestrictions: {
        ...state.roleRestrictions,
        [roleId]: text.split("\n").map((item) => item.trim()).filter(Boolean)
      }
    });
  };

  const analytics = useMemo(() => [
    ["Specialty packs", state.specialties.length],
    ["Unique symptoms", countSymptoms(state.specialties)],
    ["Narrative clauses", state.clauses.length],
    ["Workflow events", workflowEvents.length],
    ["Tracked co-occurrence pairs", coPairs.length],
    ["Ontology versions", state.versions.length]
  ], [state, workflowEvents.length, coPairs.length]);

  if (!selectedSpecialty || !selectedGroup) {
    return <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8">No ontology packs available.</main>;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 md:px-8">
      {status && <div className="fixed right-4 top-24 z-50 rounded-2xl bg-green px-4 py-3 text-sm font-semibold text-white shadow-soft">{status}</div>}
      {confirmRestore && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4">
          <div className="w-full max-w-md rounded-3xl border border-line bg-white p-5 shadow-soft">
            <p className="text-lg font-semibold text-ink">Restore Trusted Seed</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">This will remove local ontology edits and restore the trusted seed library.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button className="rounded-2xl border border-line px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => setConfirmRestore(false)} type="button">Cancel</button>
              <button aria-label="Confirm Restore Trusted Seed" className="rounded-2xl bg-blue px-4 py-2 text-sm font-semibold text-white" onClick={restoreTrustedSeed} type="button">Restore Trusted Seed</button>
            </div>
          </div>
        </div>
      )}
      <div className="rounded-[2rem] border border-blue/20 bg-soft-blue p-5">
        <p className="section-kicker">Internal Ontology Studio — Demo</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Clinical infrastructure workbench</h1>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${state.source === "draft" ? "border-amber/30 bg-soft-amber text-amber" : "border-blue/20 bg-white text-blue"}`}>
            {state.source === "draft" ? "Local Draft" : "Trusted Seed"}
          </span>
        </div>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Manage specialty packs, symptom graphs, narrative clauses, role restrictions, workflow analytics, import/export, and ontology versions. Internal demo data only.
        </p>
        <p className="mt-3 rounded-2xl border border-amber/30 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700">Ontology Studio is internal tooling. Do not enter PHI.</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Version {state.versions[0]?.label ?? "Trusted Seed"}</span>
          <span>Last edited {new Date(state.updatedAt).toLocaleString()}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700" onClick={exportCurrentDraft} type="button"><DownloadCloud size={16} /> Export Current Draft</button>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700" onClick={() => document.getElementById("ontology-import-panel")?.scrollIntoView({ behavior: "smooth", block: "start" })} type="button"><UploadCloud size={16} /> Import Draft</button>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-blue px-3 py-2 text-sm font-semibold text-white shadow-lift" onClick={() => setConfirmRestore(true)} type="button"><History size={16} /> Restore Trusted Seed</button>
        </div>
      </div>
      {!captureEnabled && (
        <div className="mt-5 rounded-3xl border border-amber/30 bg-soft-amber p-4 text-sm font-semibold text-slate-700">
          Workflow capture is off. Enable it in Settings to collect local demo metrics.
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-6">
        {analytics.map(([label, value]) => (
          <div key={label as string} className="clinical-card rounded-3xl p-4">
            <p className="section-kicker">{label as string}</p>
            <p className="mt-3 text-2xl font-semibold text-ink">{value as number}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {state.specialties.slice(0, 8).map((specialty) => {
          const symptomCount = specialty.complaintGroups.reduce((sum, group) => sum + group.symptoms.length, 0);
          const redFlagCount = specialty.complaintGroups.reduce((sum, group) => sum + group.redFlags.length, 0);
          const clauseCount = specialty.complaintGroups.reduce((sum, group) => sum + (group.narrativeClauses?.length ?? 0), 0);
          return (
            <article key={specialty.id} className="clinical-card rounded-3xl p-4">
              <p className="font-semibold text-ink">{specialty.name} Pack</p>
              <p className="mt-2 text-xs text-muted">{specialty.complaintGroups.length} groups · {symptomCount} symptoms · {redFlagCount} red flags · {clauseCount} clauses</p>
              <p className="mt-2 text-xs text-blue">v{specialty.version ?? "1.0.0"} · {specialty.updatedAt ?? state.updatedAt}</p>
            </article>
          );
        })}
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[320px_1fr_380px]">
        <section className="space-y-5">
          <div className="clinical-card rounded-3xl p-4">
            <p className="section-kicker mb-3 flex items-center gap-2"><Boxes size={14} /> Specialty Packs</p>
            <button className="mb-3 w-full rounded-2xl bg-blue px-3 py-2 text-sm font-semibold text-white" onClick={addSpecialty} type="button">Add specialty</button>
            <div className="grid gap-2">
              {state.specialties.map((specialty) => (
                <SelectableChip
                  key={specialty.id}
                  label={specialty.name}
                  selected={selectedSpecialty.id === specialty.id}
                  onClick={() => {
                    setSelectedSpecialtyId(specialty.id);
                    setSelectedGroupId(specialty.complaintGroups[0]?.id ?? "");
                  }}
                />
              ))}
            </div>
          </div>
          <div className="clinical-card rounded-3xl p-4">
            <p className="section-kicker mb-3 flex items-center gap-2"><Database size={14} /> Complaint Groups</p>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button className="rounded-2xl bg-teal px-3 py-2 text-sm font-semibold text-white" onClick={addComplaintGroup} type="button">Add group</button>
              <button className="rounded-2xl border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700" onClick={deleteComplaintGroup} type="button">Delete</button>
            </div>
            <div className="grid gap-2">
              {selectedSpecialty.complaintGroups.map((group) => (
                <SelectableChip
                  key={group.id}
                  label={group.name}
                  selected={selectedGroup.id === group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  tone="teal"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="clinical-card rounded-3xl p-5">
            <p className="section-kicker flex items-center gap-2"><Pencil size={14} /> Ontology CRUD</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {editorTabs.map((tab) => (
                <SelectableChip key={tab} label={tab} selected={activeTab === tab} onClick={() => setActiveTab(tab)} />
              ))}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Specialty name
                <input className="rounded-2xl border border-line px-3 py-2 outline-none focus:border-blue" value={selectedSpecialty.name} onChange={(event) => updateSpecialtyName(event.target.value)} />
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Complaint group
                <input className="rounded-2xl border border-line px-3 py-2 outline-none focus:border-blue" value={selectedGroup.name} onChange={(event) => updateGroupName(event.target.value)} />
              </label>
            </div>
            <div className="mt-5">
              {activeTab === "Symptoms" && <EditableItemList title="Symptoms" items={selectedGroup.symptoms} onAdd={addSymptom} onUpdate={updateSymptom} onDelete={deleteSymptom} />}
              {activeTab === "Observations" && <EditableItemList title="Observations" items={selectedGroup.observations} onAdd={addObservation} onUpdate={updateObservation} onDelete={deleteObservation} />}
              {activeTab === "Negatives" && <TextareaList title="Pertinent negatives" value={selectedGroup.pertinentNegatives.join("\n")} onChange={(value) => updateGroupArray("pertinentNegatives", value)} />}
              {activeTab === "Interventions" && <TextareaList title="Interventions" value={selectedGroup.interventions.join("\n")} onChange={(value) => updateGroupArray("interventions", value)} />}
              {activeTab === "Modifiers" && <TextareaList title="Modifiers" value={selectedGroup.modifiers.join("\n")} onChange={(value) => updateGroupArray("modifiers", value)} />}
              {activeTab === "Reassessments" && <TextareaList title="Reassessment prompts" value={selectedGroup.reassessmentOptions.join("\n")} onChange={(value) => updateGroupArray("reassessmentOptions", value)} />}
              {activeTab === "Red Flags" && <TextareaList title="Red flags / escalation prompts" value={selectedGroup.redFlags.join("\n")} onChange={(value) => updateGroupArray("redFlags", value)} />}
              {activeTab === "Narrative Clauses" && <p className="rounded-2xl border border-amber/30 bg-soft-amber p-3 text-sm text-slate-700">Internal phrase library. Do not expose publicly. Use the editor below to maintain approved clauses.</p>}
              {activeTab === "Role Restrictions" && <p className="rounded-2xl border border-line bg-slate-50 p-3 text-sm text-slate-700">Role restrictions are editable in the right panel. RN cannot diagnose or order treatment; provider modes remain draft/review-gated.</p>}
            </div>
          </div>

          <div className="clinical-card rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <p className="section-kicker flex items-center gap-2"><FileText size={14} /> Narrative Clause Editor</p>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-blue px-3 py-2 text-sm font-semibold text-white" onClick={addClause} type="button"><Plus size={16} /> Add clause</button>
            </div>
            <div className="mt-4 space-y-3">
              {state.clauses.filter((clause) => clause.specialtyId === selectedSpecialty.id && clause.complaintGroupId === selectedGroup.id).map((clause) => (
                <div key={clause.clauseId} className="rounded-2xl border border-line bg-slate-50 p-4">
                  <div className="grid gap-2 md:grid-cols-3">
                    <select className="rounded-xl border border-line px-2 py-2 text-sm" value={clause.mode} onChange={(event) => updateClause(clause.clauseId, { mode: event.target.value as NarrativeClause["mode"] })}>
                      {narrativeModes.map((mode) => <option key={mode.id} value={mode.id}>{mode.label}</option>)}
                    </select>
                    <select className="rounded-xl border border-line px-2 py-2 text-sm" value={clause.roleScope} onChange={(event) => updateClause(clause.clauseId, { roleScope: event.target.value as NarrativeClause["roleScope"] })}>
                      <option value="all">All roles</option>
                      {roleScopes.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                    </select>
                    <select className="rounded-xl border border-line px-2 py-2 text-sm" value={clause.safetyLevel} onChange={(event) => updateClause(clause.clauseId, { safetyLevel: event.target.value as NarrativeClause["safetyLevel"] })}>
                      <option value="approved">Approved</option>
                      <option value="review">Review</option>
                      <option value="restricted">Restricted</option>
                    </select>
                  </div>
                  <textarea className="mt-3 min-h-24 w-full rounded-2xl border border-line p-3 text-sm leading-6 outline-none focus:border-blue" value={clause.text} onChange={(event) => updateClause(clause.clauseId, { text: event.target.value })} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="clinical-card rounded-3xl p-5">
            <p className="section-kicker flex items-center gap-2"><Network size={14} /> Symptom Graph</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedGroup.symptoms.map((symptom) => (
                <SelectableChip key={symptom.id} label={symptom.label} selected onClick={() => undefined} />
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">Graph view uses selected complaint symptoms and live co-occurrence data from local workflow events.</p>
          </div>

          <div className="clinical-card rounded-3xl p-5">
            <p className="section-kicker flex items-center gap-2"><Share2 size={14} /> Co-occurrence Tracking</p>
            <div className="mt-4 space-y-2">
              {coPairs.length ? coPairs.map((pair) => (
                <div key={pair.pair} className="flex justify-between rounded-2xl border border-line bg-slate-50 p-3 text-sm">
                  <span className="font-semibold text-ink">{pair.pair}</span>
                  <span className="text-blue">{pair.count}</span>
                </div>
              )) : <p className="text-sm text-muted">{captureEnabled ? "Complete demo workflows to populate co-occurrence patterns." : "Workflow capture is off. Enable it in Settings to collect local demo metrics."}</p>}
            </div>
          </div>

          <div className="clinical-card rounded-3xl p-5">
            <p className="section-kicker flex items-center gap-2"><ShieldCheck size={14} /> Role Restrictions</p>
            <div className="mt-4 space-y-3">
              {roleScopes.map((role) => (
                <label key={role.id} className="grid gap-1 text-xs font-semibold text-muted">
                  {role.name}
                  <textarea className="min-h-20 rounded-2xl border border-line p-3 text-sm text-slate-700 outline-none focus:border-blue" value={(state.roleRestrictions[role.id] ?? []).join("\n")} onChange={(event) => updateRoleRestriction(role.id, event.target.value)} />
                </label>
              ))}
            </div>
          </div>

          <div id="ontology-import-panel" className="clinical-card rounded-3xl p-5">
            <p className="section-kicker flex items-center gap-2"><UploadCloud size={14} /> Import / Export</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-2xl border border-line px-3 py-2 text-sm font-semibold" onClick={exportCurrentDraft} type="button"><DownloadCloud size={16} /> Export</button>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-line px-3 py-2 text-sm font-semibold" onClick={() => {
                try {
                  const imported = importOntology(importText);
                  setState(imported);
                  setStatus("Ontology imported.");
                } catch (error) {
                  setStatus(error instanceof Error ? error.message : "Import failed.");
                }
              }} type="button"><UploadCloud size={16} /> Import</button>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-line px-3 py-2 text-sm font-semibold" onClick={() => setConfirmRestore(true)} type="button"><History size={16} /> Restore Trusted Seed</button>
            </div>
            <textarea className="mt-3 min-h-40 w-full rounded-2xl border border-line p-3 text-xs outline-none focus:border-blue" value={importText} onChange={(event) => setImportText(event.target.value)} placeholder="Exported ontology JSON appears here." />
          </div>

          <div className="clinical-card rounded-3xl p-5">
            <p className="section-kicker flex items-center gap-2"><GitBranch size={14} /> Ontology Versioning</p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-green px-3 py-2 text-sm font-semibold text-white" onClick={() => setState(createOntologyVersion(state, `Version ${state.versions.length + 1}`, "Manual local snapshot."))} type="button"><Save size={16} /> Snapshot version</button>
            <div className="mt-4 space-y-2">
              {state.versions.map((version) => (
                <div key={version.versionId} className="rounded-2xl border border-line bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-ink">{version.label}</p>
                  <p className="text-xs text-muted">{version.createdAt} · {version.symptomCount} symptoms · {version.clauseCount} clauses</p>
                </div>
              ))}
            </div>
          </div>
          <div className="clinical-card rounded-3xl p-5">
            <p className="section-kicker flex items-center gap-2"><BarChart3 size={14} /> Workflow Analytics</p>
            <p className="mt-3 text-sm leading-6 text-muted">Local workflow events feed co-occurrence, adoption, versioning, and ontology usage metrics.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function EditableItemList({ title, items, onAdd, onUpdate, onDelete }: { title: string; items: Array<{ id: string; label: string }>; onAdd: () => void; onUpdate: (id: string, label: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-2xl border border-line bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <button className="rounded-full bg-white p-2 text-blue shadow-lift" onClick={onAdd} type="button" title={`Add ${title}`}><Plus size={14} /></button>
      </div>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <div key={item.id} className="grid gap-2 rounded-2xl border border-line bg-white p-2 sm:grid-cols-[1fr_auto]">
            <input className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue" value={item.label} onChange={(event) => onUpdate(item.id, event.target.value)} />
            <button className="rounded-xl border border-line px-3 py-2 text-xs font-semibold text-critical" onClick={() => onDelete(item.id)} type="button">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextareaList({ title, value, onChange }: { title: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 rounded-2xl border border-line bg-slate-50 p-4 text-sm font-semibold text-ink">
      {title}
      <textarea className="min-h-28 rounded-2xl border border-line bg-white p-3 text-sm font-normal leading-6 text-slate-700 outline-none focus:border-blue" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
