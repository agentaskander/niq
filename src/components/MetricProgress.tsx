import { useState } from "react";
import { loadSettings } from "../lib/settings";
import { MetricBar } from "./MetricBar";

type Props = {
  label: string;
  value: number;
  explanation: string;
  sourceLabel?: string;
};

export function MetricProgress({ label, value, explanation, sourceLabel }: Props) {
  const [open, setOpen] = useState(() => loadSettings().showMetricExplanations);
  return (
    <div className="rounded-3xl border border-line bg-white p-4 shadow-lift">
      <MetricBar label={label} value={value} />
      {sourceLabel && <p className="mt-2 text-[11px] font-semibold text-slate-500">{sourceLabel}</p>}
      <button className="mt-3 text-xs font-semibold text-blue hover:underline" onClick={() => setOpen(!open)} type="button">
        How calculated?
      </button>
      {open && <p className="mt-2 text-xs leading-5 text-muted">{explanation}</p>}
    </div>
  );
}
