import { ShieldCheck } from "lucide-react";
import { advantagePillars } from "../data/advantagePillars";

export function AdvantagePillars() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {advantagePillars.map((pillar) => (
        <article key={pillar.id} className="clinical-card rounded-[2rem] p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-ink">{pillar.title}</h3>
            <ShieldCheck className="shrink-0 text-green" size={18} />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">{pillar.summary}</p>
          <div className="mt-5 rounded-2xl border border-line bg-canvas p-4">
            <p className="text-xs font-semibold uppercase text-blue">{pillar.signal}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{pillar.proofPoint}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
