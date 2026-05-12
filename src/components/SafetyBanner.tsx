import { ShieldAlert } from "lucide-react";

export function SafetyBanner() {
  return (
    <div className="rounded-3xl border border-amber/30 bg-soft-amber p-4 text-sm text-slate-700">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 shrink-0 text-amber" size={18} />
        <p>
          Documentation assistant only. Clinician review required before copy/export. Do not enter PHI in this MVP.
          No autonomous diagnosis, treatment recommendations, final chart submission, or unsupported medical claims.
        </p>
      </div>
    </div>
  );
}
