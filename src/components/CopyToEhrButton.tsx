import { Copy, LockKeyhole } from "lucide-react";
import { useState } from "react";

type Props = {
  reviewed: boolean;
  narrative: string;
  onCopied?: () => void;
};

export function CopyToEhrButton({ reviewed, narrative, onCopied }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!reviewed) return;
    await navigator.clipboard?.writeText(narrative);
    setCopied(true);
    onCopied?.();
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold transition ${
        reviewed
          ? "border border-blue-600 bg-blue-600 text-white shadow-lift hover:bg-blue-700"
          : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-700"
      }`}
      aria-label={reviewed ? "Export to EHR" : "Review required before export"}
      disabled={!reviewed}
      onClick={copy}
      type="button"
    >
      {reviewed ? <Copy size={18} /> : <LockKeyhole size={18} />}
      {copied ? "Exported" : reviewed ? "Export to EHR" : "Review required before export"}
    </button>
  );
}
