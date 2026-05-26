import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FileText, HelpCircle, ShieldCheck } from "lucide-react";
import { syntheticCases } from "../data/syntheticCases";
import { summarizeCase } from "../engines/cognitionEngine";

export function SyntheticCaseExplorer() {
  const [caseId, setCaseId] = useState(syntheticCases[0].id);
  const selectedCase = syntheticCases.find((item) => item.id === caseId) ?? syntheticCases[0];
  const summary = useMemo(() => summarizeCase(selectedCase), [selectedCase]);

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <div className="grid content-start gap-3">
        {syntheticCases.map((item) => (
          <button
            className={`rounded-2xl border p-4 text-left shadow-lift transition ${
              item.id === selectedCase.id ? "border-blue bg-soft-blue text-blue" : "border-line bg-white text-ink hover:bg-hover"
            }`}
            key={item.id}
            onClick={() => setCaseId(item.id)}
            type="button"
          >
            <span className="text-sm font-semibold">{item.title}</span>
            <span className="mt-1 block text-xs text-muted">{item.setting}</span>
          </button>
        ))}
      </div>
      <div className="clinical-card rounded-[2rem] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker">{summary.headline}</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink">{selectedCase.title}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{selectedCase.story}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Metric value={summary.fragmentCount} label="Fragments" />
            <Metric value={summary.reviewerQuestionCount} label="Questions" />
            <Metric value={`${summary.continuityScore}%`} label="Trace" />
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Panel title="Synthetic fragments" icon={<FileText size={18} />}>
            {selectedCase.fragments.map((fragment) => <p key={fragment}>{fragment}</p>)}
          </Panel>
          <Panel title="Reviewer questions" icon={<HelpCircle size={18} />}>
            {selectedCase.reviewerQuestions.map((question) => <p key={question}>{question}</p>)}
          </Panel>
          <Panel title="Provenance" icon={<ShieldCheck size={18} />}>
            {selectedCase.provenance.map((item) => (
              <p key={item.source}>{item.source}: {item.confidence}% - {item.reviewerStatus}</p>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white px-4 py-3">
      <strong className="block text-xl text-blue">{value}</strong>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-canvas p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">{icon}{title}</h4>
      <div className="space-y-3 text-sm leading-6 text-muted">{children}</div>
    </div>
  );
}
