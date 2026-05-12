import { BarChart3, ClipboardCheck, Clock3, ShieldAlert, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CompliancePanel } from "../components/CompliancePanel";
import { MetricProgress } from "../components/MetricProgress";
import { narrativeModes } from "../data/narrativeModes";
import { isWorkflowCaptureEnabled } from "../lib/settings";
import { listNarrativeRevisions, listSessions, listWorkflowEvents } from "../lib/workflowCapture";

const metrics = [
  ["Beta nurses invited", "64", ClipboardCheck],
  ["Completed first narrative", "51", TrendingUp],
  ["Average note time", "48 sec", Clock3],
  ["Repeat usage", "68%", BarChart3],
  ["Nurse delight score", "8.7", ShieldAlert]
];

type Metric = {
  label: string;
  value: string | number;
  Icon: LucideIcon;
};

const demoStyleUsage: Record<string, number> = {
  nursing: 31,
  advanced: 24,
  provider: 13,
  soap: 9,
  sbar: 8,
  handoff: 7,
  triage: 5,
  telehealth: 3
};

export function AdminDashboard() {
  const captureEnabled = isWorkflowCaptureEnabled();
  const sessions = listSessions();
  const events = listWorkflowEvents();
  const revisions = listNarrativeRevisions();
  const reviewCount = sessions.filter((session) => session.reviewCompleted).length;
  const modeCounts = sessions.reduce<Record<string, number>>((acc, session) => {
    acc[session.selectedNarrativeMode] = (acc[session.selectedNarrativeMode] ?? 0) + 1;
    return acc;
  }, {});
  const topMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "nursing";
  const eventModeCounts = events.reduce<Record<string, number>>((acc, event) => {
    const mode = typeof event.payload.mode === "string"
      ? event.payload.mode
      : typeof event.payload.selectedMode === "string"
        ? event.payload.selectedMode
        : undefined;
    if (mode) acc[mode] = (acc[mode] ?? 0) + 1;
    return acc;
  }, {});
  const localTotal = Object.values(eventModeCounts).reduce((sum, count) => sum + count, 0);
  const usageSource = !captureEnabled ? "Workflow capture disabled" : localTotal ? "Local workflow event history" : "Demo sample usage";
  const topSpecialties = [...new Set(sessions.map((session) => session.specialty))].slice(0, 4).join(", ") || "ED, med-surg, ICU";
  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8">
      <p className="text-xl font-bold text-ink">Enterprise Admin</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Mock operational dashboard for governance, template usage, review completion, and copy-to-EHR events.
      </p>
      {!captureEnabled && <CaptureDisabledNotice />}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {([
          { label: "Total sessions", value: sessions.length || "Mock 128", Icon: ClipboardCheck },
          { label: "Narratives generated", value: revisions.length || events.filter((event) => event.eventType === "narrative_generated").length || "Mock 342", Icon: TrendingUp },
          { label: "Copy-to-EHR events", value: events.filter((event) => event.eventType === "copied_to_ehr").length || "Mock 88", Icon: Clock3 },
          { label: "Review completion rate", value: sessions.length ? `${Math.round((reviewCount / sessions.length) * 100)}%` : "96%", Icon: BarChart3 },
          { label: "Top narrative mode", value: topMode, Icon: ShieldAlert }
        ] satisfies Metric[]).map(({ label, value, Icon }) => (
          <div key={label} className="clinical-card rounded-3xl p-4">
            <Icon className="text-blue" size={20} />
            <p className="mt-4 text-2xl font-semibold text-ink">{value}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 hidden gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map(([label, value, Icon]) => (
          <div key={label as string} className="clinical-card rounded-3xl p-4">
            <Icon className="text-blue" size={20} />
            <p className="mt-4 text-2xl font-semibold text-ink">{value as string}</p>
            <p className="text-xs text-muted">{label as string}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className={`clinical-card rounded-3xl p-5 ${!captureEnabled ? "opacity-60" : ""}`}>
          <p className="section-kicker">Preferred narrative mode</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Demo/local analytics calculated from narrative mode selection, review, and copy events when available. These are usage signals, not clinical quality scores.
          </p>
          <div className="mt-5 space-y-4">
            {narrativeModes.map((mode) => {
              const value = !captureEnabled ? 0 : localTotal ? ((eventModeCounts[mode.id] ?? 0) / localTotal) * 100 : demoStyleUsage[mode.id] ?? 0;
              return (
                <MetricProgress
                  key={mode.id}
                  label={mode.label}
                  value={value}
                  sourceLabel={usageSource}
                  explanation="Calculated from local workflow event history: narrative mode selected count plus review/copy signals when available. If no local data exists, this panel uses labeled demo sample usage."
                />
              );
            })}
          </div>
        </div>
        <CompliancePanel />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ["Top specialties", topSpecialties],
          ["Copy-to-EHR rate", "82% after review gate"],
          ["Review completion rate", "96% reviewed before copy"]
        ].map(([label, value]) => (
          <div key={label} className="clinical-card rounded-3xl p-5">
            <p className="section-kicker">{label}</p>
            <p className="mt-3 text-lg font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

function CaptureDisabledNotice() {
  return (
    <div className="mt-5 rounded-3xl border border-amber/30 bg-soft-amber p-4 text-sm font-semibold text-slate-700">
      Workflow capture is off. Enable it in Settings to collect local demo metrics.
    </div>
  );
}
