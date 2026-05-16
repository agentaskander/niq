import { Sparkles } from "lucide-react";
import { clinicalWorkflowModes, getClinicalWorkflowMode } from "../lib/clinicalWorkflowModes";
import type { NarrativeModeId } from "../lib/types";
import { SelectableChip } from "./SelectableChip";

type Props = {
  allowedModes: NarrativeModeId[];
  selected: NarrativeModeId;
  onSelect: (style: NarrativeModeId) => void;
  onGenerate?: () => void;
  generateDisabled?: boolean;
};

export function NarrativeStyleTabs({ allowedModes, selected, onSelect, onGenerate, generateDisabled = false }: Props) {
  const selectedMode = getClinicalWorkflowMode(selected);

  return (
    <div className="rounded-2xl border border-line bg-white p-2 shadow-lift" data-testid="workflow-logic-panel">
      <div className="flex gap-1.5 overflow-x-auto pb-1 xl:flex-wrap xl:overflow-visible">
      {clinicalWorkflowModes.map((style) => {
        const disabled = !allowedModes.includes(style.id);
        return (
          <span key={style.id} className="shrink-0" title={disabled ? "Not available for this role scope in this demo." : style.clinicalIntent}>
            <SelectableChip label={style.label} selected={selected === style.id} disabled={disabled} onClick={() => onSelect(style.id)} />
          </span>
        );
      })}
      </div>
      <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Workflow logic</p>
            <p className="mt-1 text-sm font-semibold text-ink">{selectedMode.label}: {selectedMode.audience}</p>
          </div>
          {onGenerate && (
            <button
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-lift ${
                generateDisabled
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-600"
                  : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={generateDisabled}
              onClick={onGenerate}
              type="button"
            >
              <Sparkles size={14} />
              Generate
            </button>
          )}
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-700">{selectedMode.clinicalIntent}</p>
        <div className="mt-2 rounded-lg border border-blue/15 bg-white px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue">Why this mode matters</p>
          <p className="mt-1 text-xs leading-5 text-slate-700">{selectedMode.moatInsight}</p>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-muted">
          Changes output sections, event weighting, urgency/continuity logic, and analytics metadata.
        </p>
      </div>
    </div>
  );
}
