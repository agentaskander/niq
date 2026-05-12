import { ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  narrative: string;
  safetyFlags?: string[];
  editedNarrative?: string;
  onEditedNarrativeChange?: (value: string) => void;
};

export function NarrativePreview({ narrative, safetyFlags = [], editedNarrative, onEditedNarrativeChange }: Props) {
  const value = editedNarrative ?? narrative;
  return (
    <div className="clinical-card rounded-[2rem] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="section-kicker">Live Narrative</p>
          <h3 className="mt-1 text-lg font-semibold text-ink">Review-ready clinical story</h3>
        </div>
        <ClipboardCheck className="text-blue" size={22} />
      </div>
      <motion.textarea
        key={narrative}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="min-h-64 w-full resize-y whitespace-pre-wrap rounded-3xl border border-line bg-slate-50/80 p-5 font-sans text-[15px] leading-8 text-slate-700 outline-none transition focus:border-blue focus:bg-white"
        onChange={(event) => onEditedNarrativeChange?.(event.target.value)}
        value={value}
      >
      </motion.textarea>
      {safetyFlags.length > 0 && (
        <div className="mt-3 rounded-3xl border border-amber/20 bg-soft-amber p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber">Safety Flags</p>
          <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
            {safetyFlags.slice(0, 4).map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
