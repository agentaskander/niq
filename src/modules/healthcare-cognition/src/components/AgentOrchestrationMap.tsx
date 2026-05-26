import { GitBranch } from "lucide-react";
import { agentSteps } from "../data/orchestration";

export function AgentOrchestrationMap() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {agentSteps.map((step, index) => (
        <article key={step.id} className="relative rounded-[2rem] border border-line bg-white p-5 shadow-lift">
          <div className="flex items-center justify-between">
            <GitBranch className="text-blue" size={22} />
            <span className="rounded-full bg-soft-blue px-3 py-1 text-xs font-semibold text-blue">Step {index + 1}</span>
          </div>
          <h3 className="mt-5 text-lg font-semibold text-ink">{step.agent}</h3>
          <p className="mt-3 text-sm leading-6 text-muted"><strong>Input:</strong> {step.input}</p>
          <p className="mt-2 text-sm leading-6 text-muted"><strong>Output:</strong> {step.output}</p>
          <div className="mt-4 rounded-2xl border border-green/20 bg-soft-green p-4 text-sm font-semibold leading-6 text-green">
            {step.humanGate}
          </div>
        </article>
      ))}
    </div>
  );
}
