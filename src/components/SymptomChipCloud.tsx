import type { ClinicalSymptom } from "../lib/types";
import { SelectableChip } from "./SelectableChip";

type Props = {
  symptoms: ClinicalSymptom[];
  selected: string[];
  onToggle: (id: string) => void;
};

export function SymptomChipCloud({ symptoms, selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {symptoms.map((symptom, index) => {
        const active = selected.includes(symptom.id);
        return (
          <div
            key={symptom.id}
            style={{ animationDelay: `${index * 55}ms` }}
          >
            <SelectableChip label={symptom.label} selected={active} onClick={() => onToggle(symptom.id)} />
          </div>
        );
      })}
    </div>
  );
}
