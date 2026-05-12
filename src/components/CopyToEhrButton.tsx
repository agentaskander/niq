import { Copy } from "lucide-react";
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
        reviewed ? "bg-blue text-white shadow-lift hover:bg-blue/90" : "cursor-not-allowed bg-slate-100 text-slate-400"
      }`}
      aria-label={reviewed ? "Copy to EHR" : "Copy to EHR - Review required"}
      disabled={!reviewed}
      onClick={copy}
      type="button"
    >
      <Copy size={18} />
      {copied ? "Copied" : reviewed ? "Copy to EHR" : "Review required"}
    </button>
  );
}
