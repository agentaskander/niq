import { ArrowDown, ArrowUp, Plus, Sparkles } from "lucide-react";
import type { SourceType, TimelineEvent } from "../lib/types";

type Props = {
  events: TimelineEvent[];
  onMove: (id: string, direction: "up" | "down") => void;
  onAdd: () => void;
};

const sourceTone: Record<SourceType, { dot: string; bg: string; text: string; label: string }> = {
  "patient-stated": { dot: "bg-blue", bg: "bg-soft-blue", text: "text-blue", label: "Patient stated" },
  "clinician-observed": { dot: "bg-teal", bg: "bg-soft-teal", text: "text-teal", label: "Clinician observed" },
  "symptom-change": { dot: "bg-blue", bg: "bg-soft-blue", text: "text-blue", label: "Symptom change" },
  intervention: { dot: "bg-green", bg: "bg-soft-green", text: "text-green", label: "Intervention" },
  reassessment: { dot: "bg-teal", bg: "bg-soft-teal", text: "text-teal", label: "Reassessment" },
  "provider-notified": { dot: "bg-amber", bg: "bg-soft-amber", text: "text-amber", label: "Provider notified" },
  escalation: { dot: "bg-critical", bg: "bg-soft-red", text: "text-critical", label: "Escalation" },
  "handoff-disposition": { dot: "bg-green", bg: "bg-soft-green", text: "text-green", label: "Handoff/disposition" }
};

export function TimelineBuilder({ events, onMove, onAdd }: Props) {
  return (
    <div className="clinical-card rounded-[2rem] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="section-kicker flex items-center gap-2">
            <Sparkles size={14} /> Patient Story Timeline
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Build the clinical story</h3>
          <p className="mt-1 text-sm text-muted">Events stay connected to symptoms, observations, and reassessments.</p>
        </div>
        <button
          className="rounded-full border border-line bg-white p-3 text-blue shadow-lift transition hover:bg-hover"
          onClick={onAdd}
          type="button"
          title="Add event"
        >
          <Plus size={19} />
        </button>
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-slate-50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-soft-blue text-blue">
            <Sparkles size={20} />
          </div>
          <h4 className="mt-4 font-semibold text-ink">Start building the patient story</h4>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Add a patient-stated symptom, observed finding, intervention, reassessment, or provider notification.
          </p>
        </div>
      ) : (
        <div className="relative space-y-4 before:absolute before:left-[22px] before:top-4 before:h-[calc(100%-32px)] before:w-px before:bg-line">
          {events.map((event, index) => {
            const tone = sourceTone[event.sourceType];
            return (
              <div key={event.id} className="timeline-event relative flex gap-4">
                <div className={`z-10 mt-5 h-11 w-11 rounded-full border-4 border-white ${tone.dot} shadow-lift`} />
                <div className="flex-1 rounded-3xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-ink">{event.timestamp}</span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone.bg} ${tone.text}`}>
                          {tone.label}
                        </span>
                      </div>
                      <h4 className="mt-2 text-base font-semibold text-ink">{event.title}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <button disabled={index === 0} onClick={() => onMove(event.id, "up")} className="rounded-full p-2 text-muted transition hover:bg-hover disabled:opacity-30" type="button" title="Move up">
                        <ArrowUp size={15} />
                      </button>
                      <button disabled={index === events.length - 1} onClick={() => onMove(event.id, "down")} className="rounded-full p-2 text-muted transition hover:bg-hover disabled:opacity-30" type="button" title="Move down">
                        <ArrowDown size={15} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...event.linkedSymptomIds, ...event.linkedObservationIds].map((link) => (
                      <span key={link} className="rounded-full border border-line bg-slate-50 px-2.5 py-1 text-xs text-muted">
                        {link}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
