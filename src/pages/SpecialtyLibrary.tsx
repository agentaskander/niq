import { specialties } from "../data/specialties";

export function SpecialtyLibrary() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8">
      <p className="text-xl font-bold text-ink">NarrativeIQ Library</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Seeded specialty templates, complaint groups, symptom chips, pertinent negatives, and escalation prompts for the MVP.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {specialties.map((specialty) => (
          <article key={specialty.id} className="clinical-card rounded-3xl p-5">
            <h2 className="text-xl font-semibold text-ink">{specialty.name}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{specialty.description}</p>
            <p className="mt-2 text-xs text-blue">{specialty.careSettings.join(" • ")}</p>
            <div className="mt-4 space-y-3">
              {specialty.complaintGroups.map((group) => (
                <div key={group.id} className="rounded-2xl border border-line bg-slate-50 p-4">
                  <p className="font-semibold text-ink">{group.name}</p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    Symptoms: {group.symptoms.map((symptom) => symptom.label).join(" • ")}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Red flags: {group.redFlags.join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
