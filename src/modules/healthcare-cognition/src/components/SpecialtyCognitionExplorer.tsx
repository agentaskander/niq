import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { specialtyProfiles } from "../data/specialties";

export function SpecialtyCognitionExplorer() {
  const [selectedId, setSelectedId] = useState(specialtyProfiles[0].id);
  const selected = specialtyProfiles.find((profile) => profile.id === selectedId) ?? specialtyProfiles[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      <div className="grid content-start gap-3">
        {specialtyProfiles.map((profile) => (
          <button
            className={`rounded-2xl border p-4 text-left font-semibold shadow-lift ${
              profile.id === selected.id ? "border-teal bg-soft-teal text-teal" : "border-line bg-white text-ink hover:bg-hover"
            }`}
            key={profile.id}
            onClick={() => setSelectedId(profile.id)}
            type="button"
          >
            {profile.specialty}
          </button>
        ))}
      </div>
      <div className="clinical-card rounded-[2rem] p-6">
        <Stethoscope className="text-teal" size={24} />
        <h3 className="mt-4 text-2xl font-semibold text-ink">{selected.specialty}</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoBlock title="Cognitive load" body={selected.cognitiveLoad} />
          <InfoBlock title="Documentation pattern" body={selected.documentationPattern} />
          <InfoBlock title="Module fit" body={selected.moduleFit} />
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line bg-canvas p-5">
      <h4 className="font-semibold text-ink">{title}</h4>
      <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}
