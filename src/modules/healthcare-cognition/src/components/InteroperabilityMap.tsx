import { Cable } from "lucide-react";
import { interoperabilityNodes } from "../data/interoperability";

export function InteroperabilityMap() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {interoperabilityNodes.map((node) => (
        <article key={node.id} className="rounded-[2rem] border border-line bg-white p-5 shadow-lift">
          <Cable className="text-blue" size={22} />
          <h3 className="mt-4 text-lg font-semibold text-ink">{node.system}</h3>
          <p className="mt-2 text-sm font-semibold text-teal">{node.payload}</p>
          <p className="mt-4 text-sm leading-6 text-muted">{node.friction}</p>
          <div className="mt-4 rounded-2xl border border-line bg-canvas p-4 text-sm leading-6 text-slate-700">
            {node.demoBridge}
          </div>
        </article>
      ))}
    </div>
  );
}
