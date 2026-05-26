import { Network } from "lucide-react";
import { healthcareOntology } from "../ontology/healthcareOntology";

export function OntologyMap() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {healthcareOntology.map((node) => (
        <article key={node.id} className="rounded-[2rem] border border-line bg-white p-5 shadow-lift">
          <Network className="text-teal" size={20} />
          <p className="mt-4 text-xs font-semibold uppercase text-muted">{node.domain}</p>
          <h3 className="mt-2 text-lg font-semibold text-ink">{node.label}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{node.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {node.relationships.map((relationship) => (
              <span key={relationship} className="rounded-full bg-soft-blue px-3 py-1 text-xs font-semibold text-blue">
                {relationship}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
