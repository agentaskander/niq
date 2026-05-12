import { MetricProgress } from "./MetricProgress";

type Props = {
  completeness: number;
  timelineCompleteness: number;
  quality: number;
  interactions: number;
  legacyEventsReset?: boolean;
  onResetDemoData: () => void;
};

const explanations = {
  completeness: "Demo/local analytics. Calculated from role, specialty, complaint group, symptoms or observations, pertinent negatives, timeline presence, narrative generation, and review completion.",
  timeline: "Demo/local analytics. Calculated from number of timeline events, timestamps, patient-stated events, and clinician-observed, reassessment, or provider-notified events.",
  quality: "Demo/local analytics, not clinical quality. Calculated from symptom detail, timing, negatives, observations, timeline context, role/mode compatibility, and review completion."
};

export function DemoProgress({ completeness, timelineCompleteness, quality, interactions, legacyEventsReset, onResetDemoData }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <MetricProgress label="Patient story completeness" value={completeness} explanation={explanations.completeness} />
      <MetricProgress label="Timeline completeness" value={timelineCompleteness} explanation={explanations.timeline} />
      <MetricProgress label="Narrative quality" value={quality} explanation={explanations.quality} />
      <div className="rounded-3xl border border-line bg-white p-4 shadow-lift">
        <p className="flex items-center gap-1 text-xs font-semibold text-muted">
          Workflow interactions: {interactions}
          <span
            className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-line text-[10px] text-slate-500"
            title="Counts deliberate user actions in this local demo. Automatic recalculations are excluded."
          >
            ?
          </span>
        </p>
        <p className="mt-2 text-2xl font-semibold text-ink">{interactions}</p>
        {legacyEventsReset && <p className="mt-1 text-[11px] font-semibold text-amber">Legacy demo events were reset.</p>}
        <button className="mt-3 rounded-xl border border-line px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-hover" onClick={onResetDemoData} type="button">
          Reset Demo Data
        </button>
      </div>
    </div>
  );
}
