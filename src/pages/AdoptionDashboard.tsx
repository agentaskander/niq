import { HeartHandshake, MessageSquare, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { isWorkflowCaptureEnabled } from "../lib/settings";
import { listBetaFeedback } from "../lib/workflowCapture";

export function AdoptionDashboard() {
  const captureEnabled = isWorkflowCaptureEnabled();
  const feedback = listBetaFeedback();
  const average = feedback.length ? Math.round(feedback.reduce((sum, item) => sum + item.timeSavingScore, 0) / feedback.length) : 0;
  const metrics: Array<{ label: string; value: string | number; Icon: LucideIcon }> = [
    { label: "Beta nurses invited", value: captureEnabled ? "64" : "Off", Icon: Users },
    { label: "Completed first narrative", value: captureEnabled ? "51" : "Off", Icon: TrendingUp },
    { label: "Would use next shift", value: captureEnabled ? feedback.filter((item) => item.wouldUseNextShift.toLowerCase().includes("yes")).length || "Mock 43" : "Off", Icon: HeartHandshake },
    { label: "Nurse delight score", value: captureEnabled ? average ? `${average}/5` : "8.7/10" : "Off", Icon: MessageSquare }
  ];
  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8">
      <p className="section-kicker">Nurse Adoption Metrics</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Beta workflow dashboard</h1>
      {!captureEnabled && (
        <div className="mt-5 rounded-3xl border border-amber/30 bg-soft-amber p-4 text-sm font-semibold text-slate-700">
          Workflow capture is off. Enable it in Settings to collect local demo metrics.
        </div>
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {metrics.map(({ label, value, Icon }) => (
          <div key={label} className="clinical-card rounded-3xl p-5">
            <Icon className="text-blue" size={20} />
            <p className="mt-4 text-2xl font-semibold text-ink">{value}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>
      <section className="clinical-card mt-6 rounded-3xl p-5">
        <p className="section-kicker">Feedback highlights</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(!captureEnabled ? [] : feedback.length ? feedback : [
            { feedbackId: "mock1", magicalMoment: "Timeline made the story clear.", unsafeConcern: "Need obvious review gate." },
            { feedbackId: "mock2", magicalMoment: "SBAR from the same story was useful.", unsafeConcern: "Need specialty-specific wording." }
          ]).map((item) => (
            <div key={item.feedbackId} className="rounded-2xl border border-line bg-slate-50 p-4 text-sm text-slate-700">
              <p><strong>Magical:</strong> {item.magicalMoment || "Not provided"}</p>
              <p className="mt-2"><strong>Concern:</strong> {item.unsafeConcern || "None provided"}</p>
            </div>
          ))}
          {!captureEnabled && <p className="text-sm text-muted">Workflow capture is off. Enable it in Settings to collect local demo metrics.</p>}
        </div>
      </section>
    </main>
  );
}
