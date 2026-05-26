import { Activity } from "lucide-react";
import { entropySignals } from "../data/workflowSignals";
import { entropyAverage } from "../engines/cognitionEngine";

const trendColors = {
  improving: "bg-soft-green text-green",
  stable: "bg-soft-blue text-blue",
  watch: "bg-soft-amber text-amber"
};

export function WorkflowEntropyDashboard() {
  const average = entropyAverage(entropySignals);

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <div className="clinical-card rounded-[2rem] p-6">
        <Activity className="text-blue" size={26} />
        <p className="mt-5 text-sm font-semibold uppercase text-muted">Composite readiness</p>
        <p className="mt-2 text-5xl font-semibold text-ink">{average}%</p>
        <p className="mt-4 text-sm leading-6 text-muted">Deterministic operational signal from synthetic workflow indicators.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {entropySignals.map((signal) => (
          <article key={signal.id} className="rounded-[2rem] border border-line bg-white p-5 shadow-lift">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-ink">{signal.label}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${trendColors[signal.trend]}`}>{signal.trend}</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue" style={{ width: `${signal.value}%` }} />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{signal.explanation}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
