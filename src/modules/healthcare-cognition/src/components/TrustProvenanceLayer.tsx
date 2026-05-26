import { BadgeCheck, ShieldCheck } from "lucide-react";
import { syntheticCases } from "../data/syntheticCases";

export function TrustProvenanceLayer() {
  const provenanceItems = syntheticCases.flatMap((item) =>
    item.provenance.map((source) => ({
      caseTitle: item.title,
      ...source
    }))
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {provenanceItems.map((item) => (
        <article key={`${item.caseTitle}-${item.source}`} className="rounded-[2rem] border border-line bg-white p-5 shadow-lift">
          {item.reviewerStatus === "ready" ? <BadgeCheck className="text-green" size={22} /> : <ShieldCheck className="text-amber" size={22} />}
          <p className="mt-4 text-xs font-semibold uppercase text-muted">{item.caseTitle}</p>
          <h3 className="mt-2 text-base font-semibold text-ink">{item.source}</h3>
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-canvas p-3">
            <span className="text-sm text-muted">Trace confidence</span>
            <strong className="text-blue">{item.confidence}%</strong>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">{item.reviewerStatus}</p>
        </article>
      ))}
    </div>
  );
}
