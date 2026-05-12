import { narrativeModes } from "../data/narrativeModes";
import type { NarrativeModeId } from "../lib/types";

type Props = {
  allowedModes: NarrativeModeId[];
  selected: NarrativeModeId;
  onSelect: (style: NarrativeModeId) => void;
};

export function NarrativeStyleTabs({ allowedModes, selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-3xl border border-line bg-white p-2 shadow-lift sm:grid-cols-4">
      {narrativeModes.map((style) => {
        const disabled = !allowedModes.includes(style.id);
        return (
        <button
          key={style.id}
          className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${
            selected === style.id ? "bg-blue text-white shadow-lift" : "text-muted hover:bg-hover hover:text-ink"
          } ${disabled ? "cursor-not-allowed opacity-35" : ""}`}
          disabled={disabled}
          onClick={() => onSelect(style.id)}
          type="button"
          title={style.description}
        >
          {style.label}
        </button>
        );
      })}
    </div>
  );
}
