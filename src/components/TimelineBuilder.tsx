import { useEffect, useState } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Bell, ClipboardCheck, Edit3, Eye, MessageCircle, Plus, RefreshCw, Sparkles, Trash2, X } from "lucide-react";
import type { ClinicalObservation, ClinicalSymptom, SourceType, TimelineEvent } from "../lib/types";
import { EventDateTimeSelector } from "./EventDateTimeSelector";
import { SelectableChip } from "./SelectableChip";

type Props = {
  events: TimelineEvent[];
  selectedSymptomIds: string[];
  selectedObservationIds: string[];
  selectedInterventionIds: string[];
  selectedReassessmentIds: string[];
  onMove: (id: string, direction: "up" | "down") => void;
  onAdd: () => void;
  onBuildClinicalStory: () => void;
  onUpdate: (id: string, patch: Partial<TimelineEvent>) => void;
  onDelete: (id: string) => void;
  symptoms: ClinicalSymptom[];
  observations: ClinicalObservation[];
};

const eventTypes: Array<{ id: SourceType; label: string; Icon: typeof MessageCircle }> = [
  { id: "patient-stated", label: "Patient stated", Icon: MessageCircle },
  { id: "clinician-observed", label: "Clinician observed", Icon: Eye },
  { id: "symptom-change", label: "Symptom progression", Icon: Sparkles },
  { id: "intervention", label: "Intervention", Icon: ClipboardCheck },
  { id: "reassessment", label: "Reassessment", Icon: RefreshCw },
  { id: "provider-notified", label: "Provider notified", Icon: Bell },
  { id: "escalation", label: "Escalation", Icon: AlertTriangle },
  { id: "handoff-disposition", label: "Disposition/handoff", Icon: ArrowDown }
];

const sourceTone: Record<SourceType, { dot: string; bg: string; text: string; label: string; Icon: typeof MessageCircle }> = {
  "patient-stated": { dot: "bg-blue", bg: "bg-soft-blue", text: "text-blue", label: "Patient stated", Icon: MessageCircle },
  "clinician-observed": { dot: "bg-teal", bg: "bg-soft-teal", text: "text-teal", label: "Clinician observed", Icon: Eye },
  "symptom-change": { dot: "bg-blue", bg: "bg-soft-blue", text: "text-blue", label: "Symptom progression", Icon: Sparkles },
  intervention: { dot: "bg-green", bg: "bg-soft-green", text: "text-green", label: "Intervention", Icon: ClipboardCheck },
  reassessment: { dot: "bg-teal", bg: "bg-soft-teal", text: "text-teal", label: "Reassessment", Icon: RefreshCw },
  "provider-notified": { dot: "bg-amber", bg: "bg-soft-amber", text: "text-amber", label: "Provider notified", Icon: Bell },
  escalation: { dot: "bg-critical", bg: "bg-soft-red", text: "text-critical", label: "Escalation", Icon: AlertTriangle },
  "handoff-disposition": { dot: "bg-green", bg: "bg-soft-green", text: "text-green", label: "Disposition/handoff", Icon: ArrowDown }
};

export function TimelineBuilder({ events, selectedSymptomIds, selectedObservationIds, selectedInterventionIds, selectedReassessmentIds, onMove, onAdd, onBuildClinicalStory, onUpdate, onDelete, symptoms, observations }: Props) {
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [pendingAdd, setPendingAdd] = useState(false);
  const symptomLabel = (id: string) => symptoms.find((symptom) => symptom.id === id)?.label ?? id;
  const observationLabel = (id: string) => observations.find((observation) => observation.id === id)?.label ?? id;

  useEffect(() => {
    if (!pendingAdd) return;
    const newest = events[events.length - 1];
    if (newest) {
      setEditingEventId(newest.id);
      setPendingAdd(false);
    }
  }, [events, pendingAdd]);

  const addAndEdit = () => {
    setPendingAdd(true);
    onAdd();
  };

  return (
    <div className="clinical-card rounded-[1.25rem] p-4">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="section-kicker flex items-center gap-2">
            <Sparkles size={14} /> Patient Story Timeline
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Build the clinical story</h3>
          <p className="mt-1 text-sm text-muted">Editing any event updates the narrative live.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lift transition hover:bg-hover" onClick={onBuildClinicalStory} type="button">
            <Sparkles size={18} /> Build Clinical Story
          </button>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-blue-600 bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lift transition hover:bg-blue-700" onClick={addAndEdit} type="button">
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-slate-50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-soft-blue text-blue">
            <Sparkles size={20} />
          </div>
          <h4 className="mt-4 font-semibold text-ink">Start building the patient story</h4>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Add symptom progression, interventions, reassessments, and provider notifications.
          </p>
        </div>
      ) : (
        <div className="relative max-w-full overflow-hidden pr-1 before:absolute before:left-[18px] before:top-4 before:h-[calc(100%-32px)] before:w-px before:bg-line" data-testid="timeline-event-list">
          <div className="space-y-4">
          {events.map((event, index) => {
            const tone = sourceTone[event.sourceType];
            const Icon = tone.Icon;
            const editing = editingEventId === event.id;
            return (
              <div key={event.id} className="timeline-event relative flex max-w-full gap-3 overflow-hidden">
                <div className={`z-10 mt-5 h-9 w-9 rounded-full border-4 border-white ${tone.dot} shadow-lift`} />
                <div className="min-w-0 flex-1 rounded-2xl border border-line bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span className="shrink-0 text-sm font-semibold text-ink">{event.timestamp}</span>
                          <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tone.bg} ${tone.text}`}>
                            <Icon className="shrink-0" size={13} /> <span className="truncate">{tone.label}</span>
                          </span>
                        </div>
                        <h4 className="mt-2 break-words text-base font-semibold text-ink">{event.title}</h4>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button onClick={() => setEditingEventId(editing ? null : event.id)} className="rounded-full p-2 text-muted transition hover:bg-hover hover:text-ink" type="button" title={editing ? "Close editor" : "Edit event"}>
                          {editing ? <X size={15} /> : <Edit3 size={15} />}
                        </button>
                        <button disabled={index === 0} onClick={() => onMove(event.id, "up")} className="rounded-full p-2 text-muted transition hover:bg-hover disabled:opacity-30" type="button" title="Move up">
                          <ArrowUp size={15} />
                        </button>
                        <button disabled={index === events.length - 1} onClick={() => onMove(event.id, "down")} className="rounded-full p-2 text-muted transition hover:bg-hover disabled:opacity-30" type="button" title="Move down">
                          <ArrowDown size={15} />
                        </button>
                        <button onClick={() => onDelete(event.id)} className="rounded-full p-2 text-critical transition hover:bg-soft-red" type="button" title="Delete event">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    {!editing && (
                      <>
                        <p className="break-words text-sm leading-6 text-slate-600">{event.description}</p>
                        {[...event.linkedSymptomIds, ...event.linkedObservationIds, ...event.linkedInterventionIds, ...event.linkedReassessmentIds].length > 0 && (
                          <div className="flex max-w-full flex-wrap gap-2">
                            {[...event.linkedSymptomIds, ...event.linkedObservationIds, ...event.linkedInterventionIds, ...event.linkedReassessmentIds].map((fact) => {
                              const isObservation = event.linkedObservationIds.includes(fact);
                              const isSymptom = event.linkedSymptomIds.includes(fact);
                              const label = isObservation ? observationLabel(fact) : isSymptom ? symptomLabel(fact) : fact;
                              return (
                                <span key={fact} className="max-w-full rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                                  {label}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                    {editing && (
                      <div className="grid max-w-full gap-3 rounded-2xl border border-blue-100 bg-slate-50 p-3">
                        <div className="grid min-w-0 gap-2 md:grid-cols-[minmax(0,270px)_minmax(0,1fr)]">
                          <EventDateTimeSelector timestamp={event.timestamp} onChange={(timestamp) => onUpdate(event.id, { timestamp })} />
                          <label className="grid min-w-0 gap-1 text-xs font-semibold text-muted">
                            Event type
                            <select className="min-w-0 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-blue" value={event.sourceType} onChange={(change) => onUpdate(event.id, { sourceType: change.target.value as SourceType, eventType: change.target.value })}>
                              {eventTypes.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
                            </select>
                          </label>
                        </div>
                        <label className="grid gap-1 text-xs font-semibold text-muted">
                          Short title
                          <input className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-blue" value={event.title} onChange={(change) => onUpdate(event.id, { title: change.target.value })} />
                        </label>
                        <label className="grid gap-1 text-xs font-semibold text-muted">
                          Detail
                          <textarea className="min-h-20 resize-y rounded-xl border border-line bg-white px-3 py-2 text-sm leading-6 text-slate-700 outline-none focus:border-blue" value={event.description} onChange={(change) => onUpdate(event.id, { description: change.target.value })} />
                        </label>
                        <div>
                          <p className="text-xs font-semibold text-muted">Linked facts</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {[...selectedSymptomIds, ...selectedObservationIds, ...selectedInterventionIds, ...selectedReassessmentIds].map((fact) => {
                              const linked = event.linkedSymptomIds.includes(fact) || event.linkedObservationIds.includes(fact) || event.linkedInterventionIds.includes(fact) || event.linkedReassessmentIds.includes(fact);
                              const isObservation = selectedObservationIds.includes(fact);
                              const isIntervention = selectedInterventionIds.includes(fact);
                              const isReassessment = selectedReassessmentIds.includes(fact);
                              const key = isObservation ? "linkedObservationIds" : isIntervention ? "linkedInterventionIds" : isReassessment ? "linkedReassessmentIds" : "linkedSymptomIds";
                              const current = event[key];
                              const label = isObservation ? observationLabel(fact) : selectedSymptomIds.includes(fact) ? symptomLabel(fact) : fact;
                              return (
                                <SelectableChip
                                  key={fact}
                                  label={label}
                                  selected={linked}
                                  onClick={() => onUpdate(event.id, { [key]: linked ? current.filter((item) => item !== fact) : [...current, fact] })}
                                  tone={isObservation ? "teal" : "default"}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}
