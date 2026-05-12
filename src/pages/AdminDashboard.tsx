import { BarChart3, ClipboardCheck, Clock3, ShieldAlert, TrendingUp } from "lucide-react";
import { CompliancePanel } from "../components/CompliancePanel";

const metrics = [
  ["Beta nurses invited", "64", ClipboardCheck],
  ["Completed first narrative", "51", TrendingUp],
  ["Average note time", "48 sec", Clock3],
  ["Repeat usage", "68%", BarChart3],
  ["Nurse delight score", "8.7", ShieldAlert]
];

const styleUsage = [
  ["Nursing", "31%"],
  ["Advanced", "24%"],
  ["Provider", "13%"],
  ["SOAP", "9%"],
  ["SBAR", "8%"],
  ["Handoff", "7%"],
  ["Triage", "5%"],
  ["Telehealth", "3%"]
];

export function AdminDashboard() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8">
      <p className="text-xl font-bold text-ink">Enterprise Admin</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Mock operational dashboard for governance, template usage, review completion, and copy-to-EHR events.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map(([label, value, Icon]) => (
          <div key={label as string} className="clinical-card rounded-3xl p-4">
            <Icon className="text-blue" size={20} />
            <p className="mt-4 text-2xl font-semibold text-ink">{value as string}</p>
            <p className="text-xs text-muted">{label as string}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="clinical-card rounded-3xl p-5">
          <p className="section-kicker">Preferred narrative mode</p>
          <div className="mt-5 space-y-4">
            {styleUsage.map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted">{label}</span>
                  <span className="font-semibold text-ink">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-blue" style={{ width: value }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <CompliancePanel />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ["Top specialties", "ED, med-surg, ICU, home health"],
          ["Copy-to-EHR rate", "82% after review gate"],
          ["Review completion rate", "96% reviewed before copy"]
        ].map(([label, value]) => (
          <div key={label} className="clinical-card rounded-3xl p-5">
            <p className="section-kicker">{label}</p>
            <p className="mt-3 text-lg font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
