import type { ClinicalSymptom } from "../lib/types";

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
          <button
            key={symptom.id}
            className={`chip-float rounded-full border px-4 py-2 text-sm transition ${
              active
                ? "border-blue bg-blue text-white shadow-lift"
                : "border-line bg-white text-ink hover:border-blue/30 hover:bg-hover"
            }`}
            onClick={() => onToggle(symptom.id)}
            style={{ animationDelay: `${index * 55}ms` }}
            type="button"
          >
            {symptom.label}
          </button>
        );
      })}
    </div>
  );
}
