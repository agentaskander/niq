import type { PhiWarning } from "../lib/phiDetection";

type Props = {
  warnings: PhiWarning[];
};

export function PhiWarningPanel({ warnings }: Props) {
  if (!warnings.length) return null;
  return (
    <div className="rounded-3xl border border-critical/20 bg-soft-red p-4">
      <p className="text-sm font-semibold text-critical">Potential identifier detected</p>
      <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-700">
        {warnings.map((warning) => (
          <li key={`${warning.type}-${warning.message}`}>{warning.message}</li>
        ))}
      </ul>
    </div>
  );
}
