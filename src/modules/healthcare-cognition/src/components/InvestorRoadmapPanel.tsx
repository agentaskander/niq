import { TrendingUp } from "lucide-react";
import { roadmapItems } from "../data/roadmap";

export function InvestorRoadmapPanel() {
  return (
    <div className="clinical-card rounded-[2rem] p-6">
      <div className="mb-6 flex items-center gap-3">
        <TrendingUp className="text-blue" size={24} />
        <div>
          <p className="section-kicker">Investor roadmap</p>
          <h3 className="mt-1 text-2xl font-semibold text-ink">From concept lab to governed platform</h3>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {roadmapItems.map((item) => (
          <article key={item.id} className="rounded-2xl border border-line bg-white p-5">
            <p className="text-sm font-semibold text-blue">{item.horizon}</p>
            <h4 className="mt-3 text-lg font-semibold text-ink">{item.title}</h4>
            <p className="mt-3 text-sm leading-6 text-muted">{item.investorFrame}</p>
            <p className="mt-4 rounded-2xl bg-canvas p-3 text-xs font-semibold leading-5 text-slate-700">{item.riskControl}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
