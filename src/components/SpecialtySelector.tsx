import type { Specialty } from "../lib/types";
import { SelectableChip } from "./SelectableChip";

type Props = {
  specialties: Specialty[];
  selected: Specialty;
  onSelect: (specialty: Specialty) => void;
};

export function SpecialtySelector({ specialties, selected, onSelect }: Props) {
  return (
    <div className="grid gap-2">
      {specialties.map((specialty) => (
        <div key={specialty.id} className="rounded-2xl border border-line bg-white p-3">
          <SelectableChip label={specialty.name} selected={selected.id === specialty.id} onClick={() => onSelect(specialty)} tone="teal" />
          <p className="mt-1 text-xs leading-5 text-muted">{specialty.description}</p>
        </div>
      ))}
    </div>
  );
}
