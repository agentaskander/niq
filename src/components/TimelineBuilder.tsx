import { AlertTriangle, ArrowDown, ArrowUp, Bell, ClipboardCheck, Eye, MessageCircle, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import type { ClinicalObservation, ClinicalSymptom, SourceType, TimelineEvent } from "../lib/types";
import { SelectableChip } from "./SelectableChip";
import { TimePicker } from "./TimePicker";

type Props = {
  events: TimelineEvent[];
  selectedSymptomIds: string[];
  selectedObservationIds: string[];
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

export function TimelineBuilder({ events, selectedSymptomIds, selectedObservationIds, onMove, onAdd, onBuildClinicalStory, onUpdate, onDelete, symptoms, observations }: Props) {
  const symptomLabel = (id: string) => symptoms.find((symptom) => symptom.id === id)?.label ?? id;
  const observationLabel = (id: string) => observations.find((observation) => observation.id === id)?.label ?? id;

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
          <button className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lift transition" style={{ backgroundColor: "#2563EB", borderColor: "#2563EB", color: "#FFFFFF" }} onClick={onAdd} type="button">
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
          <button className="mt-5 inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lift transition" style={{ backgroundColor: "#2563EB", borderColor: "#2563EB", color: "#FFFFFF" }} onClick={onAdd} type="button">
            <Plus size={18} /> Add Event
          </button>
        </div>
      ) : (
        <div className="relative max-h-[78vh] overflow-y-auto pb-16 pr-1 before:absolute before:left-[18px] before:top-4 before:h-[calc(100%-80px)] before:w-px before:bg-line">
          <div className="space-y-4">
          {events.map((event, index) => {
            const tone = sourceTone[event.sourceType];
            const Icon = tone.Icon;
            return (
              <div key={event.id} className="timeline-event relative flex gap-3">
                <div className={`z-10 mt-5 h-9 w-9 rounded-full border-4 border-white ${tone.dot} shadow-lift`} />
                <div className="flex-1 rounded-2xl border border-line bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tone.bg} ${tone.text}`}>
                        <Icon size={13} /> {tone.label}
                      </span>
                      <div className="flex items-center gap-1">
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
                    <div className="grid gap-2 sm:grid-cols-[112px_1fr]">
                      <TimePicker value={event.timestamp} onChange={(timestamp) => onUpdate(event.id, { timestamp })} />
                      <label className="grid gap-1 text-xs font-semibold text-muted">
                        Event type
                        <select className="rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink outline-none focus:border-blue" value={event.sourceType} onChange={(change) => onUpdate(event.id, { sourceType: change.target.value as SourceType, eventType: change.target.value })}>
                          {eventTypes.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
                        </select>
                      </label>
                    </div>
                    <label className="grid gap-1 text-xs font-semibold text-muted">
                      Short title
                      <input className="rounded-xl border border-line px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-blue" value={event.title} onChange={(change) => onUpdate(event.id, { title: change.target.value })} />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-muted">
                      Detail
                      <textarea className="min-h-20 resize-y rounded-xl border border-line px-3 py-2 text-sm leading-6 text-slate-700 outline-none focus:border-blue" value={event.description} onChange={(change) => onUpdate(event.id, { description: change.target.value })} />
                    </label>
                    <div>
                      <p className="text-xs font-semibold text-muted">Linked facts</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[...selectedSymptomIds, ...selectedObservationIds].map((fact) => {
                          const linked = event.linkedSymptomIds.includes(fact) || event.linkedObservationIds.includes(fact);
                          const isObservation = selectedObservationIds.includes(fact);
                          const key = isObservation ? "linkedObservationIds" : "linkedSymptomIds";
                          const current = event[key];
                          const label = isObservation ? observationLabel(fact) : symptomLabel(fact);
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
                </div>
              </div>
            );
          })}
          </div>
          <div className="sticky bottom-2 z-20 mt-4 flex justify-end">
            <button className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lift transition" style={{ backgroundColor: "#2563EB", borderColor: "#2563EB", color: "#FFFFFF" }} onClick={onAdd} type="button">
              <Plus size={18} /> Add Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
