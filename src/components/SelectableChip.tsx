import { Check } from "lucide-react";
import { loadSettings } from "../lib/settings";

type Props = {
  label: string;
  selected: boolean;
  onClick: () => void;
  tone?: "default" | "teal" | "green" | "red";
  prefix?: string;
  disabled?: boolean;
};

const toneClass = {
  default: "ring-blue-200",
  teal: "ring-blue-200",
  green: "ring-blue-200",
  red: "ring-blue-200"
};

export function SelectableChip({ label, selected, onClick, tone = "default", prefix, disabled = false }: Props) {
  const text = prefix ? `${prefix} ${label}` : label;
  const compact = loadSettings().compactChipMode;
  return (
    <button
      className={`selectable-chip inline-flex items-center gap-2 rounded-full border text-sm font-medium transition ${compact ? "min-h-9 px-3 py-1.5" : "min-h-10 px-3.5 py-2"} ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
          : selected
            ? `selectable-chip--selected border-blue-300 bg-blue-50 text-slate-900 shadow-lift ring-1 ${toneClass[tone]}`
            : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-slate-50"
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
      data-selected={selected ? "true" : "false"}
    >
      {selected && <Check aria-hidden="true" className="selectable-chip__check shrink-0 text-slate-700" size={14} />}
      <span className="selectable-chip__label">{text}</span>
    </button>
  );
}
