import { Check } from "lucide-react";
import { loadSettings } from "../lib/settings";

type Props = {
  label: string;
  selected: boolean;
  onClick: () => void;
  tone?: "default" | "teal" | "green" | "red";
  prefix?: string;
};

const toneClass = {
  default: "ring-blue/10",
  teal: "ring-teal/15",
  green: "ring-green/15",
  red: "ring-critical/15"
};

export function SelectableChip({ label, selected, onClick, tone = "default", prefix }: Props) {
  const text = prefix ? `${prefix} ${label}` : label;
  const compact = loadSettings().compactChipMode;
  return (
    <button
      className={`selectable-chip inline-flex items-center gap-2 rounded-full border text-sm font-medium transition ${compact ? "min-h-9 px-3 py-1.5" : "min-h-10 px-3.5 py-2"} ${
        selected
          ? `selectable-chip--selected border-slate-300 bg-[#EAF1F8] text-slate-900 shadow-lift ring-1 ${toneClass[tone]}`
          : "border-line bg-white text-ink hover:border-slate-300 hover:bg-hover"
      }`}
      onClick={onClick}
      type="button"
      data-selected={selected ? "true" : "false"}
    >
      {selected && <Check aria-hidden="true" className="selectable-chip__check shrink-0 text-slate-700" size={14} />}
      <span className="selectable-chip__label">{text}</span>
    </button>
  );
}
