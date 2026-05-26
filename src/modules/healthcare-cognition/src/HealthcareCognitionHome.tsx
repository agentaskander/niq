import { Activity, BrainCircuit, Cable, Clock, GitBranch, Network, ShieldCheck, Stethoscope, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AdvantagePillars } from "./components/AdvantagePillars";
import { AgentOrchestrationMap } from "./components/AgentOrchestrationMap";
import { InteroperabilityMap } from "./components/InteroperabilityMap";
import { InvestorRoadmapPanel } from "./components/InvestorRoadmapPanel";
import { LongitudinalTimeline } from "./components/LongitudinalTimeline";
import { ModuleChrome } from "./components/ModuleChrome";
import { OntologyMap } from "./components/OntologyMap";
import { SectionBand } from "./components/SectionBand";
import { SpecialtyCognitionExplorer } from "./components/SpecialtyCognitionExplorer";
import { SyntheticCaseExplorer } from "./components/SyntheticCaseExplorer";
import { TrustProvenanceLayer } from "./components/TrustProvenanceLayer";
import { WorkflowEntropyDashboard } from "./components/WorkflowEntropyDashboard";

type HealthcareCognitionHomeProps = {
  onNavigate: (path: string) => void;
};

const labStats: Array<[string, string, LucideIcon]> = [
  ["8", "Advantage pillars", BrainCircuit],
  ["10", "Ontology nodes", Network],
  ["3", "Synthetic cases", Activity],
  ["0", "Clinical claims", ShieldCheck]
];

export function HealthcareCognitionHome({ onNavigate }: HealthcareCognitionHomeProps) {
  return (
    <ModuleChrome
      eyebrow="Healthcare Cognition Lab"
      title="Healthcare workflow cognition without PHI, diagnosis, or medical advice."
      description="A synthetic investor-safe module showing how NarrativeIQ can organize care-team context, provenance, handoffs, and workflow burden into reviewable cognition surfaces."
      onNavigate={onNavigate}
    >
      <section className="px-5 py-8 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {labStats.map(([value, label, Icon]) => (
            <div key={label} className="rounded-[2rem] border border-line bg-white p-5 shadow-lift">
              <Icon className="text-blue" size={22} />
              <p className="mt-4 text-4xl font-semibold text-ink">{value}</p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionBand
        eyebrow="Advantage pillars"
        title="Eight defensible surfaces for healthcare cognition"
        description="The lab frames product advantage around workflow context, human review, and governance rather than clinical claims."
      >
        <AdvantagePillars />
      </SectionBand>

      <SectionBand
        eyebrow="Ontology"
        title="Thorough public-safe ontology buildout"
        description="A healthcare operations taxonomy that describes continuity and workflow state without treatment guidance."
      >
        <OntologyMap />
      </SectionBand>

      <SectionBand
        eyebrow="Synthetic case explorer"
        title="Explore fictional workflow stories"
        description="Each case is synthetic, non-PHI, non-diagnostic, and designed only to demonstrate reviewable narrative cognition."
      >
        <SyntheticCaseExplorer />
      </SectionBand>

      <SectionBand
        eyebrow="Workflow entropy"
        title="Operational disorder becomes visible"
        description="A deterministic dashboard for non-clinical burden signals such as ownership clarity and handoff density."
      >
        <WorkflowEntropyDashboard />
      </SectionBand>

      <SectionBand eyebrow="Longitudinal timeline" title="Continuity over time">
        <LongitudinalTimeline />
      </SectionBand>

      <SectionBand
        eyebrow="Interoperability map"
        title="EHR-adjacent value without live integration"
        description="The module maps where reviewed context could move while keeping every system interaction conceptual."
      >
        <InteroperabilityMap />
      </SectionBand>

      <SectionBand eyebrow="Specialty cognition" title="Specialty-specific narrative shape">
        <SpecialtyCognitionExplorer />
      </SectionBand>

      <SectionBand eyebrow="Trust layer" title="Provenance and reviewer visibility">
        <TrustProvenanceLayer />
      </SectionBand>

      <SectionBand
        eyebrow="Agent orchestration"
        title="Explicit agent boundaries with human gates"
        description="Capture, structure, provenance, and export are separated so automation boundaries remain inspectable."
      >
        <AgentOrchestrationMap />
      </SectionBand>

      <section className="px-5 py-10 md:px-8">
        <div className="mx-auto max-w-7xl">
          <InvestorRoadmapPanel />
        </div>
      </section>

      <section className="px-5 py-10 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {([
            ["Timeline continuity", Clock],
            ["Interoperability posture", Cable],
            ["Specialty cognition", Stethoscope],
            ["Roadmap clarity", TrendingUp],
            ["Agent boundaries", GitBranch]
          ] as Array<[string, LucideIcon]>).map(([label, Icon]) => (
            <div key={label} className="rounded-2xl border border-line bg-white p-5 text-sm font-semibold text-slate-700 shadow-lift">
              <Icon className="mb-3 text-teal" size={20} />
              {label}
            </div>
          ))}
        </div>
      </section>
    </ModuleChrome>
  );
}
