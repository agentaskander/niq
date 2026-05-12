import { LockKeyhole } from "lucide-react";
import { computeOntologyUsageStats, listBetaFeedback, listSessions, moatMetrics } from "../lib/workflowCapture";

export function MoatDashboard() {
  const metrics = moatMetrics();
  const sessions = listSessions();
  const ontology = computeOntologyUsageStats();
  const feedback = listBetaFeedback();
  const topSymptoms = ontology
    .sort((a, b) => b.selectedCount - a.selectedCount)
    .slice(0, 5);
  const topPairs = ontology
    .flatMap((stat) => Object.entries(stat.coSelectedSymptoms).map(([pair, count]) => [`${stat.symptomId} + ${pair}`, count] as const))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8">
      <div className="rounded-[2rem] border border-amber/30 bg-soft-amber p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-amber"><LockKeyhole size={18} /> Internal Workflow Intelligence — Confidential</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Clinical Story Workflow Dataset</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
          Local demo metrics showing how workflow behavior can become a defensible product advantage without collecting PHI.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ["Sessions completed", metrics.sessionsCompleted],
          ["Average time to narrative", `${metrics.averageTimeToNarrativeMs} ms`],
          ["Copy-to-EHR rate", `${Math.round(metrics.copyRate * 100)}%`],
          ["Most used narrative mode", metrics.mostUsedNarrativeMode],
          ["Average edits per narrative", metrics.averageEditsPerNarrative],
          ["Narrative acceptance rate", `${Math.round(metrics.narrativeAcceptanceRate * 100)}%`],
          ["Nurse delight score", feedback.length ? `${Math.round(feedback.reduce((sum, item) => sum + item.timeSavingScore, 0) / feedback.length)}/5` : "placeholder"],
          ["Workflow abandonment step", metrics.workflowAbandonmentStep],
          ["Highest value specialties", sessions.map((session) => session.specialty).slice(0, 3).join(", ") || "pending"]
        ].map(([label, value]) => (
          <div key={label} className="clinical-card rounded-3xl p-5">
            <p className="section-kicker">{label}</p>
            <p className="mt-3 text-2xl font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="clinical-card rounded-3xl p-5">
          <p className="section-kicker">Most selected symptom clusters</p>
          <div className="mt-4 space-y-3">
            {topSymptoms.length ? topSymptoms.map((stat) => (
              <div key={`${stat.specialty}-${stat.symptomId}`} className="rounded-2xl border border-line bg-slate-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-ink">{stat.symptomId}</span>
                  <span className="text-blue">{stat.selectedCount} selections</span>
                </div>
                <p className="mt-2 text-xs text-muted">{stat.specialty} / {stat.complaintGroup}</p>
              </div>
            )) : <p className="text-sm text-muted">Complete a demo to populate workflow intelligence.</p>}
          </div>
        </section>
        <section className="clinical-card rounded-3xl p-5">
          <p className="section-kicker">Top co-occurring symptom pairs</p>
          <div className="mt-4 space-y-3">
            {topPairs.length ? topPairs.map(([pair, count]) => (
              <div key={pair} className="flex justify-between rounded-2xl border border-line bg-slate-50 p-4 text-sm">
                <span className="font-semibold text-ink">{pair}</span>
                <span className="text-blue">{count}</span>
              </div>
            )) : <p className="text-sm text-muted">Co-selection patterns appear after symptom selection events.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
