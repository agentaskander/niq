import type { Specialty } from "../lib/types";

type Props = {
  specialties: Specialty[];
  selected: Specialty;
  onSelect: (specialty: Specialty) => void;
};

export function SpecialtySelector({ specialties, selected, onSelect }: Props) {
  return (
    <div className="grid gap-2">
      {specialties.map((specialty) => (
        <button
          key={specialty.id}
          className={`rounded-2xl border p-4 text-left transition ${
            selected.id === specialty.id
              ? "border-teal bg-soft-teal shadow-lift"
              : "border-line bg-white hover:border-teal/30 hover:bg-soft-teal"
          }`}
          onClick={() => onSelect(specialty)}
          type="button"
        >
          <div className="font-semibold text-ink">{specialty.name}</div>
          <p className="mt-1 text-xs leading-5 text-muted">{specialty.description}</p>
        </button>
      ))}
    </div>
  );
}
