import { Clock } from "lucide-react";
import { timelineMoments } from "../data/workflowSignals";
import { timelineContinuityAverage } from "../engines/cognitionEngine";

export function LongitudinalTimeline() {
  const average = timelineContinuityAverage(timelineMoments);

  return (
    <div className="clinical-card rounded-[2rem] p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="section-kicker">Longitudinal continuity</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">Synthetic context across time</h3>
        </div>
        <div className="rounded-2xl border border-blue/20 bg-soft-blue px-4 py-3 text-sm font-semibold text-blue">
          Average impact {average}%
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {timelineMoments.map((moment) => (
          <article key={moment.id} className="rounded-2xl border border-line bg-white p-5">
            <Clock className="text-teal" size={20} />
            <p className="mt-4 text-sm font-semibold text-blue">{moment.time} - {moment.role}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{moment.event}</p>
            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-teal" style={{ width: `${moment.continuityImpact}%` }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
