import { auditEntries } from "../data/demoSession";

export function CompliancePanel() {
  return (
    <div className="clinical-card rounded-3xl p-4">
      <p className="section-kicker">Mock Audit Log</p>
      <div className="mt-4 space-y-3">
        {auditEntries.map((entry) => (
          <div key={entry.id} className="rounded-2xl border border-line bg-slate-50/70 p-3">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-ink">{entry.action}</span>
              <span className="text-muted">{entry.time}</span>
            </div>
            <p className="mt-1 text-xs text-muted">{entry.actor} • {entry.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
