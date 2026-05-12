import { CheckCircle2, LockKeyhole } from "lucide-react";

type Props = {
  reviewed: boolean;
  onReviewedChange: (reviewed: boolean) => void;
};

export function ReviewGate({ reviewed, onReviewedChange }: Props) {
  return (
    <button
      className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
        reviewed ? "border-green/50 bg-soft-green" : "border-amber/30 bg-soft-amber"
      }`}
      onClick={() => onReviewedChange(!reviewed)}
      type="button"
    >
      <span>
        <span className="block font-semibold text-ink">{reviewed ? "Reviewed" : "Review Required"}</span>
        <span className="text-xs leading-4 text-muted">
          Clinician confirms narrative accuracy before copy/export.
        </span>
      </span>
      {reviewed ? <CheckCircle2 className="text-green" /> : <LockKeyhole className="text-amber" />}
    </button>
  );
}
