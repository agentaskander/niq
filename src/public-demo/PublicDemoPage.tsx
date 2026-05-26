import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "./components/Icon";
import { articles, type PublicArticle } from "./data/articles";
import { glossaryTerms, type GlossaryTerm } from "./data/glossary";
import { continuityMoments, graphClusters, graphEdges, graphNodes, scenarios, type Scenario } from "./data/publicScenarios";
import { usePublicMeta } from "./seo";
import { BetaSignupPage } from "../pages/BetaSignupPage";
import { ContactPage } from "../pages/ContactPage";

type PublicDemoPageProps = {
  path: string;
  onNavigate: (path: string) => void;
};

const cognitionModules = [
  {
    title: "Healthcare Cognition",
    domain: "Healthcare workflow intelligence preview",
    layer: "Ontology, provenance, longitudinal workflow memory, and review gates",
    compound: "Shows how NarrativeIQ extends beyond notes into coordination, trust, and cross-system context.",
    path: "/healthcare-cognition"
  },
  {
    title: "Organizational Memory",
    domain: "Teams, decisions, operating cadence",
    layer: "Longitudinal memory and decision continuity",
    compound: "Preserves operational context across decisions, teams, handoffs, and time.",
    path: "/#public-module-previews"
  },
  {
    title: "Relationship Intelligence",
    domain: "Human relationships and commitments",
    layer: "Trust, continuity, commitments, and evolving human context",
    compound: "Models relationship state as durable context instead of isolated messages.",
    path: "/#public-module-previews"
  },
  {
    title: "Workflow Intelligence",
    domain: "Operations, support, delivery, and coordination",
    layer: "Friction, latency, ownership, and repeated operational loops",
    compound: "Turns recurring workflow patterns into reusable operational intelligence.",
    path: "/#public-module-previews"
  },
  {
    title: "Semantic Coordination",
    domain: "Cross-team and cross-system meaning",
    layer: "Entities, events, relationships, and shared narrative state",
    compound: "Connects meaning across tools where handoffs usually lose context.",
    path: "/#public-module-previews"
  },
  {
    title: "Research Continuity",
    domain: "Research, synthesis, and institutional knowledge",
    layer: "Evidence threads, open questions, and reusable knowledge graphs",
    compound: "Carries inquiry forward across people, artifacts, and time.",
    path: "/articles"
  },
  {
    title: "Agent-Orchestrated Operations",
    domain: "Multi-agent workflows and operational systems",
    layer: "Agent boundaries, provenance, review, and context preservation",
    compound: "Gives agent ecosystems a durable cognition layer around tasks and tools.",
    path: "/#public-module-previews"
  }
];

const appliedSystems = [
  {
    title: "Healthcare Cognition",
    body:
      "Healthcare Cognition Lab uses demo care journeys to show how NarrativeIQ extends beyond notes into longitudinal workflow intelligence."
  },
  {
    title: "Organizational Memory",
    body: "Preserves operational context across decisions, teams, handoffs, and time."
  },
  {
    title: "Relationship Intelligence",
    body: "Models trust, continuity, commitments, and evolving human context."
  },
  {
    title: "Workflow Intelligence",
    body: "Surfaces friction, latency, coordination gaps, and recurring operational loops."
  },
  {
    title: "Semantic Coordination",
    body: "Connects entities, events, relationships, and narratives across systems."
  }
];

const compoundingRows = [
  ["transcription", "longitudinal memory"],
  ["summarization", "ontology"],
  ["generic note generation", "workflow intelligence"],
  ["basic chatbot assistance", "trust and provenance"],
  ["one-off workflow automation", "operational coordination"],
  ["isolated dashboards", "narrative continuity"],
  ["static task queues", "agent orchestration"],
  ["single-system records", "cross-system context"]
];

const healthcareAdvantages = [
  "Workflow Intelligence",
  "Ontology / Context Intelligence",
  "Longitudinal Understanding",
  "Interoperability Intelligence",
  "Operational Leverage",
  "Specialty-Specific Cognition",
  "Human Factors / Trust",
  "Cross-System Orchestration"
];

const intelligenceSystems = ["notes", "workflows", "teams", "handoffs", "portals", "research", "operations", "agents"];
const fallbackEmail = "niq@synkos.net";
const fallbackMailto = "mailto:niq@synkos.net?subject=NarrativeIQ%20Private%20Beta%20Interest";

const roadmapStages = [
  ["Documentation Automation", "raw capture", "reviewable source context", "keeps capture bounded by human review"],
  ["Structured Note Intelligence", "template output", "structured narrative state", "turns fragments into inspectable story surfaces"],
  ["Narrative Continuity Layer", "single-session summaries", "continuity across time", "preserves what changed and what carried forward"],
  ["Workflow Cognition Layer", "basic workflow automation", "friction and coordination intelligence", "surfaces recurring operational loops"],
  ["Specialty / Domain Ontology Layer", "generic domain templates", "reusable ontology-driven intelligence", "adapts cognition modules to vertical workflows"],
  ["Cross-System Semantic Layer", "isolated dashboards", "cross-system cognition", "connects meaning across tools and teams"],
  ["Agent-Orchestrated Operations", "single agent tasks", "agent boundaries and provenance", "coordinates agents through reviewable context"],
  ["Cognition Operating System", "point solutions", "longitudinal cognition infrastructure", "compounds memory, ontology, trust, and coordination"]
];

export function PublicDemoPage({ path, onNavigate }: PublicDemoPageProps) {
  const slug = path.split("/").pop();
  let content = <HomePage onNavigate={onNavigate} />;

  if (path === "/healthcare-cognition") content = <PublicHealthcareCognitionPage onNavigate={onNavigate} />;
  if (path === "/beta") content = <BetaSignupPage onNavigate={onNavigate} />;
  if (path === "/contact") content = <ContactPage kind="contact" />;
  if (path === "/request-demo") content = <ContactPage kind="request-demo" />;
  if (path === "/articles") content = <ArticlesIndex onNavigate={onNavigate} />;
  if (path.startsWith("/articles/")) content = <ArticlePage slug={slug ?? ""} onNavigate={onNavigate} />;
  if (path === "/glossary") content = <GlossaryIndex onNavigate={onNavigate} />;
  if (path.startsWith("/glossary/")) content = <GlossaryPage slug={slug ?? ""} onNavigate={onNavigate} />;

  return (
    <>
      <SiteHeader onNavigate={onNavigate} isLabPage={path === "/healthcare-cognition"} />
      {content}
      <SiteFooter onNavigate={onNavigate} isLabPage={path === "/healthcare-cognition"} />
    </>
  );
}

function SiteHeader({ onNavigate, isLabPage = false }: Pick<PublicDemoPageProps, "onNavigate"> & { isLabPage?: boolean }) {
  return (
    <header className={`niq-topbar${isLabPage ? " niq-topbar-light" : ""}`}>
       <button className="niq-brand" onClick={() => onNavigate("/")} type="button" aria-label="NiQ public demo home">
        <span className="niq-brand-mark">NiQ</span>
        <span>Narrative Intelligence</span>
      </button>
      <nav aria-label="Public demo navigation">
        <button onClick={() => onNavigate("/#demo")} type="button">Workflow Demo</button>
        <button onClick={() => onNavigate("/#public-module-previews")} type="button">Module Previews</button>
        <button onClick={() => onNavigate("/healthcare-cognition")} type="button">Healthcare Lab</button>
        <button onClick={() => onNavigate("/articles")} type="button">Articles</button>
        <button onClick={() => onNavigate("/glossary")} type="button">Glossary</button>
        <button onClick={() => onNavigate("/contact")} type="button">Contact</button>
      </nav>
    </header>
  );
}

function SiteFooter({ onNavigate, isLabPage = false }: Pick<PublicDemoPageProps, "onNavigate"> & { isLabPage?: boolean }) {
  return (
    <footer className={`niq-footer${isLabPage ? " niq-footer-light" : ""}`}>
      <div>
        <strong>NiQ</strong>
        <p>Longitudinal cognition infrastructure for complex human systems.</p>
        <p className="niq-footer-note">
          NarrativeIQ public demos are conceptual and investor-oriented. They do not contain sensitive clinical data, clinical decisions, care recommendations, or deployment claims.
        </p>
      </div>
      <div className="niq-footer-links">
        <button onClick={() => onNavigate("/#public-module-previews")} type="button">Module Previews</button>
        <button onClick={() => onNavigate("/healthcare-cognition")} type="button">Healthcare Lab</button>
        <button onClick={() => onNavigate("/articles")} type="button">Articles</button>
        <button onClick={() => onNavigate("/glossary")} type="button">Glossary</button>
        <button onClick={() => onNavigate("/contact")} type="button">Contact</button>
        <span className="niq-fallback-email">Prefer email? <a href={fallbackMailto}>{fallbackEmail}</a></span>
      </div>
    </footer>
  );
}

function HomePage({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  usePublicMeta({
    title: "NarrativeIQ Demo - Longitudinal Cognition Infrastructure",
    description:
      "Explore NarrativeIQ's longitudinal cognition infrastructure for preserving context, workflow meaning, semantic relationships, and narrative continuity across complex human systems.",
    path: "/healthcare-cognition"
  });

  return (
    <main>
      <section className="niq-hero">
        <div className="niq-hero-bg" aria-hidden="true" />
        <div className="niq-hero-copy">
          <p className="niq-eyebrow">Enterprise-safe public demo</p>
          <h1 className="niq-hero-title">
            <span>Longitudinal cognition</span>
            <span>infrastructure</span>
            <span>for complex human</span>
            <span>systems.</span>
          </h1>
          <p className="niq-lede">
            NarrativeIQ preserves meaning across notes, workflows, relationships, handoffs, research, operations, and time.
            Instead of stopping at notes, it models continuity, context, coordination, and operational meaning.
          </p>
          <div className="niq-hero-actions">
             <button className="niq-button" onClick={() => onNavigate("/#public-module-previews")} type="button">
              Public Module Previews <Icon name="arrow" />
            </button>
             <button className="niq-button niq-ghost" onClick={() => onNavigate("/healthcare-cognition")} type="button">
              Explore Healthcare Cognition Lab
            </button>
             <button className="niq-button niq-ghost" onClick={() => onNavigate("/request-demo")} type="button">
              Request Demo
            </button>
          </div>
        </div>
        <div className="niq-hero-panel">
          <div className="niq-panel-header">
            <span />
            <span />
            <span />
            <strong>continuity preview</strong>
          </div>
          <div className="niq-signal-stack">
            <SignalCard icon="network" title="Ontology layer" body="Entities, events, roles, commitments, and context states become reusable semantic structure." />
            <SignalCard icon="workflow" title="Workflow cognition" body="Friction, handoffs, open loops, and coordination gaps become visible across time." />
            <SignalCard icon="shield" title="Trust and provenance" body="Every cognition surface is positioned as a draft with source visibility and human review." />
          </div>
        </div>
      </section>
      <HomeSections onNavigate={onNavigate} />
    </main>
  );
}

function SignalCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <article className="niq-signal-card">
      <Icon name={icon} />
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}

function HomeSections({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];

  return (
    <>
      <ModuleArchitectureSection onNavigate={onNavigate} />
      <AppliedCognitionSystems />
      <CommoditizesVsCompounds />
      <HealthcareCognitionPreview onNavigate={onNavigate} />
      <OntologyVisualizationTeaser />
      <IntelligenceBetweenSystems />
      <InvestorRoadmapPreview />
      <SeoContentBlock />
      <GraphSection />
      <WorkflowDemo scenario={scenario} setScenarioId={setScenarioId} />
      <ContinuitySection />
      <ArchitectureSection />
      <ArticlePreview onNavigate={onNavigate} />
      <GlossaryPreview onNavigate={onNavigate} />
      <FinalCta onNavigate={onNavigate} />
    </>
  );
}

function ModuleArchitectureSection({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  return (
    <section className="niq-section niq-module-section" id="public-module-previews" data-niq-reveal>
      <div className="niq-section-kicker niq-row">
        <div>
          <p className="niq-eyebrow">Module architecture</p>
          <h2>Reusable Cognition Modules</h2>
          <p>
            NarrativeIQ modules turn domain-specific workflows into reusable cognition layers: ontology, longitudinal
            memory, workflow intelligence, trust and provenance, cross-system coordination, and agent orchestration.
          </p>
        </div>
         <button className="niq-text-link" onClick={() => onNavigate("/healthcare-cognition")} type="button">
          Open public healthcare preview <Icon name="chevron" />
        </button>
      </div>
      <div className="niq-module-grid">
        {cognitionModules.map((module) => (
          <article className="niq-module-card" key={module.title}>
            <p>{module.domain}</p>
            <h3>{module.title}</h3>
            <span>{module.layer}</span>
            <strong>{module.compound}</strong>
            {module.title === "Healthcare Cognition" || module.title === "Research Continuity" ? (
              <button onClick={() => onNavigate(module.path)} type="button">
                {module.title === "Healthcare Cognition" ? "Open Healthcare Lab" : "Open Articles"}
                <Icon name="arrow" />
              </button>
            ) : (
              <span className="niq-preview-pill">Preview included below</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function AppliedCognitionSystems() {
  return (
    <section className="niq-section niq-applied-section" data-niq-reveal>
      <div className="niq-section-kicker">
        <p className="niq-eyebrow">Applied cognition systems</p>
        <h2>Portable intelligence beyond one vertical</h2>
        <p>
          The same module architecture applies beyond healthcare to organizations, relationships, research, education,
          operations, and agent ecosystems.
        </p>
      </div>
      <div className="niq-applied-grid">
        {appliedSystems.map((system) => (
          <article key={system.title}>
            <h3>{system.title}</h3>
            <p>{system.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CommoditizesVsCompounds() {
  return (
    <section className="niq-section niq-compounds-section" data-niq-reveal>
      <div className="niq-compound-board">
        <div>
          <p className="niq-eyebrow">Investor thesis</p>
          <h2>What Commoditizes vs What Compounds</h2>
          <p>AI transcription captures words. NarrativeIQ preserves meaning.</p>
          <p>AI scribing commoditizes; cognition infrastructure compounds.</p>
        </div>
        <div className="niq-compound-columns">
          <div>
            <h3>Commoditizing</h3>
            {compoundingRows.map(([left]) => <span key={left}>{left}</span>)}
          </div>
          <div>
            <h3>Compounding</h3>
            {compoundingRows.map(([, right]) => <span key={right}>{right}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function HealthcareCognitionPreview({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  return (
    <section className="niq-section niq-healthcare-preview" data-niq-reveal>
      <div className="niq-healthcare-board">
        <div>
          <p className="niq-eyebrow">One vertical proof environment</p>
          <h2>Healthcare Cognition Lab</h2>
          <p className="niq-healthcare-subtitle">A public proof environment for longitudinal healthcare workflow intelligence.</p>
          <p>
            Healthcare Cognition Lab is a representative preview showing how NarrativeIQ extends beyond transcription
            into workflow intelligence, ontology, trust, and cross-system coordination. Healthcare is one proof domain for
            a broader module architecture.
          </p>
          <p className="niq-safety-note">This public preview uses demo data only and does not provide medical advice.</p>
           <button className="niq-button" onClick={() => onNavigate("/healthcare-cognition")} type="button">
            Explore Healthcare Cognition Lab <Icon name="arrow" />
          </button>
        </div>
        <div className="niq-advantage-chip-grid">
          {healthcareAdvantages.map((advantage) => <span key={advantage}>{advantage}</span>)}
        </div>
      </div>
    </section>
  );
}

function PublicHealthcareCognitionPage({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  usePublicMeta({
    title: "NarrativeIQ Healthcare Cognition Lab - Synthetic Workflow Intelligence Demo",
    description:
      "A synthetic investor demo showing how NarrativeIQ extends beyond AI scribing into healthcare workflow cognition, ontology, trust, and cross-system coordination.",
    path: "/healthcare-cognition"
  });

  const publicPillars = [
    ["Workflow Intelligence", "Surfaces handoffs, coordination friction, and operational context without clinical claims."],
    ["Ontology / Context Intelligence", "Uses representative ontology categories instead of exposing a full schema."],
    ["Longitudinal Understanding", "Shows how meaning changes across time, roles, and workflows."],
    ["Interoperability Intelligence", "Frames how context can move between teams and tools without backend architecture details."],
    ["Operational Leverage", "Turns example workflow signals into investor-readable operational context."],
    ["Specialty-Specific Cognition", "Shows how a vertical module adapts public-safe language to a domain environment."],
    ["Human Factors / Trust", "Keeps source visibility, review posture, and provenance in the public narrative."],
    ["Cross-System Orchestration", "Uses conceptual agent roles while keeping proprietary orchestration details private."]
  ];

  const publicCases = [
    {
      title: "Shift continuity preview",
      setting: "Inpatient operations sample",
      fragments: ["family update request", "transport timing changed", "ownership question pending"],
      outcome: "A reviewer sees what changed, what remains open, and which context should carry forward."
    },
    {
      title: "Ambulatory follow-up preview",
      setting: "Outpatient workflow sample",
      fragments: ["forms readiness", "callback summary", "scheduling friction"],
      outcome: "A team can separate confirmed context from unresolved operational questions."
    },
    {
      title: "Specialty packet preview",
      setting: "Specialty coordination sample",
      fragments: ["packet readiness", "prior context", "source trace"],
      outcome: "A reviewer sees source-supported narrative continuity before downstream coordination."
    }
  ];

  const timelinePreview = [
    ["08:10", "Intake question captured", 35],
    ["11:25", "Coordination blocker added", 58],
    ["15:40", "Continuity summary requested", 82],
    ["17:05", "Source visibility reviewed", 74]
  ] as const;

  const entropyPreview = [
    ["Ownership clarity", "watch", 62],
    ["Fragment alignment", "improving", 78],
    ["Review readiness", "stable", 84],
    ["Handoff density", "watch", 55]
  ] as const;

  const interoperabilityPreview = [
    ["EHR-adjacent note surface", "reviewed narrative summary"],
    ["Team inbox", "open question digest"],
    ["Handoff board", "continuity timeline"],
    ["Operations analytics", "workflow burden signal"]
  ];

  const provenancePreview = [
    ["Nurse note sample", "source visible"],
    ["Coordinator update", "needs review"],
    ["Operations note", "review ready"],
    ["Team handoff", "human gate"]
  ];

  const publicRoadmap = [
    ["Documentation Automation", "captures structured fragments"],
    ["Structured Note Intelligence", "organizes review-ready surfaces"],
    ["Narrative Continuity Layer", "preserves meaning across time"],
    ["Workflow Cognition Layer", "surfaces coordination gaps"],
    ["Domain Ontology Layer", "uses representative categories"],
    ["Cross-System Semantic Layer", "preserves context between tools"],
    ["Agent-Orchestrated Operations", "coordinates conceptual roles"],
    ["Cognition Operating System", "compounds memory, trust, and workflow meaning"]
  ];

  return (
    <main className="niq-public-lab-shell">
      <aside className="niq-public-lab-sidebar">
         <button className="niq-public-lab-brand" onClick={() => onNavigate("/")} type="button">
          <span>NiQ</span>
          <strong>Healthcare Cognition</strong>
        </button>
        {["Overview", "Cases", "Timeline", "Entropy", "Ontology", "Provenance", "Roadmap"].map((item) => (
          <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>
        ))}
        <div className="niq-public-label">
          NarrativeIQ public demos are conceptual and investor-oriented. They do not contain sensitive clinical data, clinical decisions, care recommendations, or deployment claims.
        </div>
         <button className="niq-public-beta-cta" onClick={() => onNavigate("/beta")} type="button">
          Request Private Beta Access
        </button>
      </aside>

      <section className="niq-public-lab-workspace">
        <header className="niq-public-lab-header" id="overview">
          <div>
            <p className="niq-eyebrow">Public Preview</p>
            <h1>Healthcare Cognition Lab</h1>
            <p>
              A limited NarrativeIQ product preview for longitudinal healthcare workflow intelligence: sample journeys,
              representative ontology categories, example workflow signals, provenance, interoperability, and investor narrative.
            </p>
          </div>
          <div className="niq-public-boundary-note">
            <strong>
              NarrativeIQ public demos are conceptual and investor-oriented. They do not contain sensitive clinical data, clinical decisions, care recommendations, or deployment claims.
            </strong>
            <span> Proprietary ontology rules, scoring logic, generation instructions, routing methods, and implementation details are intentionally omitted.</span>
             <button className="niq-public-beta-cta" onClick={() => onNavigate("/beta")} type="button">
              Join Private Beta
            </button>
          </div>
        </header>

        <div className="niq-public-lab-metrics">
          <div><strong>8</strong><span>representative pillars</span></div>
          <div><strong>3</strong><span>sample journeys</span></div>
          <div><strong>4</strong><span>system touchpoints</span></div>
          <div><strong>0</strong><span>clinical claims</span></div>
        </div>

        <div className="niq-public-app-grid" id="cases">
          <section className="niq-public-app-panel niq-public-case-selector">
            <div className="niq-panel-title">
              <p className="niq-eyebrow">Case Preview</p>
              <h2>Representative previews</h2>
            </div>
            {publicCases.map((item, index) => (
              <article className={index === 0 ? "active" : ""} key={item.title}>
                <span>{item.setting}</span>
                <h3>{item.title}</h3>
                <div>{item.fragments.map((fragment) => <b key={fragment}>{fragment}</b>)}</div>
                <p>{item.outcome}</p>
              </article>
            ))}
          </section>

          <section className="niq-public-app-panel" id="timeline">
            <div className="niq-panel-title">
              <p className="niq-eyebrow">Longitudinal timeline preview</p>
              <h2>Sample Care Journey</h2>
            </div>
            {timelinePreview.map(([time, event, value]) => (
              <div className="niq-public-timeline-row" key={time}>
                <span>{time}</span>
                <strong>{event}</strong>
                <i><b style={{ width: `${value}%` }} /></i>
              </div>
            ))}
          </section>

          <section className="niq-public-app-panel" id="entropy">
            <div className="niq-panel-title">
              <p className="niq-eyebrow">Workflow entropy panel</p>
              <h2>Example workflow signals</h2>
            </div>
            {entropyPreview.map(([label, trend, value]) => (
              <div className="niq-public-signal-row" key={label}>
                <span>{label}</span>
                <strong>{trend}</strong>
                <i><b style={{ width: `${value}%` }} /></i>
              </div>
            ))}
            <p className="niq-muted-note">Representative preview metrics, not calculation rules.</p>
          </section>

          <section className="niq-public-app-panel niq-public-ontology-panel" id="ontology">
            <div className="niq-panel-title">
              <p className="niq-eyebrow">Ontology graph preview</p>
              <h2>Representative ontology categories</h2>
            </div>
            <div className="niq-public-lab-graph">
              {["care continuity", "workflow state", "role handoff", "review readiness", "provenance", "specialty context", "timeline", "system boundary"].map((node) => (
                <span key={node}>{node}</span>
              ))}
            </div>
          </section>

          <section className="niq-public-app-panel" id="provenance">
            <div className="niq-panel-title">
              <p className="niq-eyebrow">Trust/provenance panel</p>
              <h2>Reviewable source posture</h2>
            </div>
            <div className="niq-public-map-grid niq-public-map-grid-compact">
              {provenancePreview.map(([source, status]) => (
                <article key={source}>
                  <h3>{source}</h3>
                  <p>{status}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="niq-public-app-panel">
            <div className="niq-panel-title">
              <p className="niq-eyebrow">Interoperability map</p>
              <h2>Context between systems</h2>
            </div>
            <div className="niq-public-map-grid niq-public-map-grid-compact">
              {interoperabilityPreview.map(([system, payload]) => (
                <article key={system}>
                  <h3>{system}</h3>
                  <p>{payload}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="niq-public-app-panel niq-public-pillars-panel">
          <div className="niq-panel-title">
            <p className="niq-eyebrow">Representative preview badges</p>
            <h2>Eight public advantage pillars</h2>
          </div>
          <div className="niq-public-pillar-grid">
            {publicPillars.map(([title, body]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="niq-public-app-panel niq-public-roadmap-drawer" id="roadmap">
          <div className="niq-panel-title">
            <p className="niq-eyebrow">Roadmap</p>
            <h2>From healthcare proof environment to cognition infrastructure</h2>
            <p>The roadmap is intentionally public-level: category movement, compounding value, and market narrative without proprietary build details.</p>
          </div>
          <div className="niq-public-roadmap-grid">
            {publicRoadmap.map(([stage, body], index) => (
              <article key={stage}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{stage}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="niq-public-app-panel niq-seo-copy">
          <p className="niq-eyebrow">SEO-rich product explanation</p>
          <h2>Healthcare as proof, not the boundary</h2>
          <p>
            The public Healthcare Cognition Lab shows how a domain-specific module can preserve context across complex
            workflows while staying public-safe, review-oriented, and non-clinical. The same architecture extends to
            organizational memory, relationship intelligence, workflow intelligence, research continuity, semantic
            coordination, and agent-orchestrated operations.
          </p>
          <p>
            Healthcare workflow intelligence is a useful proof environment because context often fragments across notes,
            handoffs, portals, teams, and time. NarrativeIQ demonstrates how a longitudinal cognition layer can preserve
            operational meaning, semantic healthcare coordination, trust posture, and cross-system context without
            making clinical decision, care recommendation, or deployment claims.
          </p>
        </section>
      </section>
    </main>
  );
}

function OntologyVisualizationTeaser() {
  const nodes = [
    ["narrative threads", 50, 16],
    ["entities", 22, 34],
    ["workflows", 74, 34],
    ["handoffs", 18, 64],
    ["context states", 50, 52],
    ["trust/provenance", 82, 64],
    ["timeline", 36, 82],
    ["module boundaries", 66, 82]
  ];

  return (
    <section className="niq-section niq-ontology-teaser" data-niq-reveal>
      <div className="niq-section-kicker">
        <p className="niq-eyebrow">Semantic knowledge graph</p>
        <h2>Notes are documents. Ontology is understanding.</h2>
        <p>Ontology turns disconnected events into reusable context across domains.</p>
      </div>
      <div className="niq-ontology-layout">
        <svg className="niq-ontology-graph" viewBox="0 0 100 100" role="img" aria-label="NarrativeIQ ontology graph teaser">
          {nodes.slice(1).map(([, x, y]) => <line key={`${x}-${y}`} x1="50" y1="52" x2={x as number} y2={y as number} className="niq-ontology-line" />)}
          {nodes.map(([label, x, y]) => (
            <g key={label as string} className="niq-ontology-node">
              <circle cx={x as number} cy={y as number} r={label === "context states" ? 8 : 6} />
              <text x={x as number} y={(y as number) + 12}>{label as string}</text>
            </g>
          ))}
        </svg>
        <div className="niq-ontology-copy">
          <h3>From fragmented records to reusable context</h3>
          <p>
            NarrativeIQ maps narrative threads, entities, workflows, handoffs, context states, trust signals,
            longitudinal timelines, and module boundaries into a public-safe cognition layer.
          </p>
        </div>
      </div>
    </section>
  );
}

function IntelligenceBetweenSystems() {
  return (
    <section className="niq-section niq-between-section" data-niq-reveal>
      <div className="niq-section-kicker">
        <p className="niq-eyebrow">Cross-system cognition</p>
        <h2>The Intelligence Between Systems</h2>
        <p>The future advantage is not the note. It is the cognition layer around the note.</p>
        <p>The future advantage is not the chart. It is the cognition layer between charts.</p>
        <p>The same architecture applies wherever complex systems lose context across time.</p>
      </div>
      <div className="niq-system-strip">
        {intelligenceSystems.map((system) => <span key={system}>{system}</span>)}
      </div>
    </section>
  );
}

function InvestorRoadmapPreview() {
  return (
    <section className="niq-section niq-roadmap-section" id="investor-roadmap" data-niq-reveal>
      <div className="niq-section-kicker">
        <p className="niq-eyebrow">Investor roadmap preview</p>
        <h2>From automation to a cognition operating system</h2>
        <p>Each stage clarifies what commoditizes, what compounds, and where NarrativeIQ becomes harder to replace.</p>
      </div>
      <div className="niq-roadmap-grid">
        {roadmapStages.map(([stage, commoditizes, compounds, advantage], index) => (
          <article key={stage}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{stage}</h3>
            <p><strong>Commoditizes:</strong> {commoditizes}</p>
            <p><strong>Compounds:</strong> {compounds}</p>
            <p><strong>NarrativeIQ advantage:</strong> {advantage}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SeoContentBlock() {
  return (
    <section className="niq-section niq-seo-block" data-niq-reveal>
      <div className="niq-seo-copy">
        <p className="niq-eyebrow">Why narrative intelligence matters</p>
        <h2>Why Narrative Intelligence Matters</h2>
        <p>
          Organizations lose context across time. Notes preserve facts, but they do not always preserve continuity.
          Workflows fragment meaning as decisions, relationships, research threads, handoffs, and operational signals move
          between people and systems.
        </p>
        <p>
          Cognition infrastructure connects narrative, ontology, workflow, and coordination. NarrativeIQ builds a cognition
          layer for context preservation, semantic coordination, organizational cognition, relationship intelligence,
          research continuity, operational intelligence, and agent-orchestrated operations.
        </p>
        <p>
          Healthcare Cognition is one proof environment for applied cognition systems. The broader architecture applies to
          organizations, relationships, research, education, operations, and agent ecosystems wherever complex human systems
          need cross-system context preservation.
        </p>
      </div>
    </section>
  );
}

function GraphSection() {
  const [cluster, setCluster] = useState("all");
  const activeNodes = cluster === "all" ? graphNodes : graphNodes.filter((node) => node.cluster === cluster);
  const activeIds = new Set(activeNodes.map((node) => node.id));

  return (
    <section className="niq-section niq-graph-section" data-niq-reveal>
      <div className="niq-section-kicker">
        <p className="niq-eyebrow">Living context</p>
        <h2>Animated graph intelligence UI</h2>
        <p>
          The graph below is a public-safe visualization using mock nodes. It suggests how narrative state, continuity,
          workflow signals, and relationships can be made visible without exposing production methods.
        </p>
      </div>
      <div className="niq-graph-layout">
        <div className="niq-cluster-controls" aria-label="Graph cluster filters">
          <button className={cluster === "all" ? "active" : ""} onClick={() => setCluster("all")} type="button">All</button>
          {graphClusters.map((item) => (
            <button
              className={cluster === item.id ? "active" : ""}
              key={item.id}
              onClick={() => setCluster(item.id)}
              style={{ "--cluster": item.color } as CSSProperties}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <svg className="niq-graph-canvas" viewBox="0 0 100 100" role="img" aria-label="Synthetic narrative intelligence graph">
          {graphEdges.map(([a, b], index) => {
            const from = graphNodes.find((node) => node.id === a);
            const to = graphNodes.find((node) => node.id === b);
            if (!from || !to) return null;
            const visible = activeIds.has(a) && activeIds.has(b);
            return (
              <line
                key={`${a}-${b}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={visible ? "niq-edge is-active" : "niq-edge"}
                style={{ animationDelay: `${index * 0.18}s` }}
              />
            );
          })}
          {graphNodes.map((node, index) => {
            const clusterMeta = graphClusters.find((item) => item.id === node.cluster);
            const active = cluster === "all" || cluster === node.cluster;
            return (
              <g
                key={node.id}
                className={active ? "niq-node is-active" : "niq-node"}
                style={{ "--node": clusterMeta?.color ?? "#75d0c2", animationDelay: `${index * 0.12}s` } as CSSProperties}
              >
                <circle cx={node.x} cy={node.y} r={node.size} />
                <text x={node.x} y={node.y + 0.8}>{node.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function WorkflowDemo({ scenario, setScenarioId }: { scenario: Scenario; setScenarioId: (id: string) => void }) {
  const narrative = useMemo(() => {
    return {
      title: `${scenario.label} brief`,
      summary: scenario.summary,
      lines: [
        `Current state: ${scenario.state}.`,
        `Primary context: ${scenario.continuity.join(", ")}.`,
        `Relationship surface: ${scenario.relationship}.`,
        "Reviewer note: synthetic preview only; no backend processing is performed."
      ]
    };
  }, [scenario]);

  return (
    <section className="niq-section niq-demo-section" id="demo" data-niq-reveal>
      <div className="niq-section-kicker">
        <p className="niq-eyebrow">Interactive workflow</p>
        <h2>A deterministic narrative workflow simulation</h2>
        <p>
          Select a scenario to see synthetic context become themes, timeline, continuity markers, and a review-ready
          narrative state. The experience feels operational while remaining entirely mock and local.
        </p>
      </div>
      <div className="niq-demo-grid">
        <div className="niq-scenario-list">
          {scenarios.map((item) => (
            <button className={item.id === scenario.id ? "active" : ""} key={item.id} onClick={() => setScenarioId(item.id)} type="button">
              <span>{item.label}</span>
              <small>{item.sector}</small>
            </button>
          ))}
        </div>
        <div className="niq-conversation-card">
          <h3>Synthetic context stream</h3>
          {scenario.conversation.map((line) => <p key={line}>{line}</p>)}
        </div>
        <div className="niq-extraction-card">
          <h3>NiQ preview extraction</h3>
          <PreviewList label="Themes" items={scenario.themes} />
          <PreviewList label="Continuity" items={scenario.continuity} />
          <PreviewList label="Workflow signals" items={scenario.signals} />
        </div>
        <div className="niq-timeline-card">
          <h3>Timeline</h3>
          {scenario.timeline.map((item) => (
            <div className="niq-timeline-row" key={item.time}>
              <span>{item.time}</span>
              <div><i style={{ width: `${item.intensity}%` }} /></div>
              <strong>{item.event}</strong>
            </div>
          ))}
        </div>
        <div className="niq-narrative-card">
          <h3>{narrative.title}</h3>
          <p>{narrative.summary}</p>
          {narrative.lines.map((line) => (
            <div className="niq-narrative-line" key={line}><Icon name="check" /> {line}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreviewList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="niq-preview-list">
      <h4>{label}</h4>
      <div>{items.map((item) => <span key={item}>{item}</span>)}</div>
    </div>
  );
}

function ContinuitySection() {
  return (
    <section className="niq-section niq-continuity-section" data-niq-reveal>
      <div className="niq-section-kicker">
        <p className="niq-eyebrow">Memory continuity</p>
        <h2>Why continuity matters</h2>
        <p>
          AI experiences often reset the story. NiQ frames continuity as an inspectable timeline that helps humans see
          what carried forward and where meaning shifted.
        </p>
      </div>
      <div className="niq-continuity-track">
        {continuityMoments.map((item, index) => (
          <article key={item.title} style={{ "--strength": `${item.strength}%`, "--delay": `${index * 0.12}s` } as CSSProperties}>
            <div className="niq-moment-index">{String(index + 1).padStart(2, "0")}</div>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <div className="niq-meter"><span /></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ArchitectureSection() {
  const cards = [
    ["Capture", "Synthetic inputs are organized into a shared workspace.", "braces"],
    ["Continuity", "Important context remains visible as new updates arrive.", "branch"],
    ["Review", "Gaps, assumptions, and draft summaries remain inspectable.", "shield"],
    ["Output", "A human-approved narrative can be copied into the next workflow.", "file"]
  ];

  return (
    <section className="niq-section niq-architecture-section" data-niq-reveal>
      <div className="niq-section-kicker">
        <p className="niq-eyebrow">Architecture preview</p>
        <h2>Public-safe infrastructure framing</h2>
        <p>
          This diagram is intentionally high-level. It communicates the product category without exposing non-public
          implementation details.
        </p>
      </div>
      <div className="niq-arch-grid">
        {cards.map(([title, body, icon], index) => (
          <article key={title}>
            <Icon name={icon} />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ArticlePreview({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  return (
    <section className="niq-section niq-article-preview" data-niq-reveal>
      <div className="niq-section-kicker niq-row">
        <div>
          <p className="niq-eyebrow">NarrativeIQ Research & Intelligence Library</p>
          <h2>Structured thinking for continuity</h2>
        </div>
         <button className="niq-text-link" onClick={() => onNavigate("/articles")} type="button">
          Open Research Library <Icon name="chevron" />
        </button>
      </div>
      <div className="niq-article-grid">
        {articles.slice(0, 3).map((article) => <ArticleCard article={article} key={article.slug} onNavigate={onNavigate} />)}
      </div>
    </section>
  );
}

function ArticleCard({ article, onNavigate }: { article: PublicArticle; onNavigate: (path: string) => void }) {
  return (
    <article className="niq-article-card">
      <Icon name="book" />
      <p>{article.readTime}</p>
      <h3>{article.title}</h3>
      <span>{article.description}</span>
      <button onClick={() => onNavigate(`/articles/${article.slug}`)} type="button">
        Read article <Icon name="arrow" />
      </button>
    </article>
  );
}

function GlossaryPreview({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  return (
    <section className="niq-section niq-glossary-preview" data-niq-reveal>
      <div className="niq-section-kicker niq-row">
        <div>
          <p className="niq-eyebrow">Semantic glossary</p>
          <h2>Language for context-aware systems</h2>
        </div>
         <button className="niq-text-link" onClick={() => onNavigate("/glossary")} type="button">
          Browse glossary <Icon name="chevron" />
        </button>
      </div>
      <div className="niq-glossary-strip">
        {glossaryTerms.slice(0, 6).map((term) => (
          <button key={term.slug} onClick={() => onNavigate(`/glossary/${term.slug}`)} type="button">
            <span>{term.term}</span>
            <small>{term.definition}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function FinalCta({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  return (
    <section className="niq-final-cta" data-niq-reveal>
      <Icon name="spark" />
      <h2>Build AI systems that remember the human story.</h2>
      <p>For partnerships, pilots, or investor conversations, contact the NiQ team.</p>
       <button className="niq-button" onClick={() => onNavigate("/request-demo")} type="button">Request Demo</button>
      <p className="niq-fallback-email">Prefer email? <a href={fallbackMailto}>{fallbackEmail}</a></p>
    </section>
  );
}

function ArticlesIndex({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  usePublicMeta({
    title: "NarrativeIQ Research & Intelligence Library",
    description: "Public research notes on narrative intelligence, semantic coordination, continuity, and applied cognition systems.",
    path: "/articles"
  });
  return (
    <main className="niq-subpage">
      <PageHero eyebrow="Research Library" title="NarrativeIQ Research & Intelligence Library" body="Public-safe research notes on context preservation, narrative continuity, semantic coordination, and applied cognition systems." />
      <div className="niq-article-grid niq-wide">
        {articles.map((article) => <ArticleCard article={article} key={article.slug} onNavigate={onNavigate} />)}
      </div>
    </main>
  );
}

function ArticlePage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  const article = articles.find((item) => item.slug === slug) ?? articles[0];
  usePublicMeta({
    title: `${article.title} | NiQ`,
    description: article.description,
    path: `/articles/${article.slug}`,
    type: "article",
    article
  });

  return (
    <main className="niq-article-page">
       <button className="niq-back-link" onClick={() => onNavigate("/articles")} type="button">Articles</button>
      <article>
        <p className="niq-eyebrow">{article.readTime}</p>
        <h1>{article.title}</h1>
        <p className="niq-article-description">{article.description}</p>
        <div className="niq-tag-row">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <RelatedReadingLinks current={article.slug} onNavigate={onNavigate} />
      </article>
    </main>
  );
}

function RelatedReadingLinks({ current, onNavigate }: { current: string; onNavigate: (path: string) => void }) {
  return (
    <aside className="niq-related-reading-links">
      <h3>Continue reading</h3>
      {articles.filter((article) => article.slug !== current).slice(0, 3).map((article) => (
        <button key={article.slug} onClick={() => onNavigate(`/articles/${article.slug}`)} type="button">
          <Icon name="link" /> {article.title}
        </button>
      ))}
    </aside>
  );
}

function GlossaryIndex({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  usePublicMeta({
    title: "NiQ Glossary | Context and Continuity Terms",
    description: "A concise glossary for narrative intelligence, context continuity, and human-centered AI systems.",
    path: "/glossary"
  });
  return (
    <main className="niq-subpage">
      <PageHero eyebrow="Glossary" title="Semantic glossary" body="Definitions for public-safe concepts used across the NiQ demo and article system." />
      <div className="niq-glossary-grid">
        {glossaryTerms.map((term) => <GlossaryCard key={term.slug} term={term} onNavigate={onNavigate} />)}
      </div>
    </main>
  );
}

function GlossaryCard({ term, onNavigate }: { term: GlossaryTerm; onNavigate: (path: string) => void }) {
  return (
    <button onClick={() => onNavigate(`/glossary/${term.slug}`)} type="button">
      <Icon name="dot" />
      <h3>{term.term}</h3>
      <p>{term.definition}</p>
    </button>
  );
}

function GlossaryPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  const term = glossaryTerms.find((item) => item.slug === slug) ?? glossaryTerms[0];
  usePublicMeta({
    title: `${term.term} | NiQ Glossary`,
    description: term.definition,
    path: `/glossary/${term.slug}`
  });
  return (
    <main className="niq-subpage niq-term-page">
       <button className="niq-back-link" onClick={() => onNavigate("/glossary")} type="button">Glossary</button>
      <PageHero eyebrow="Glossary term" title={term.term} body={term.definition} />
      <section className="niq-related-terms">
        <h2>Related terms</h2>
        <div>
          {term.related.map((slugValue) => {
            const related = glossaryTerms.find((item) => item.slug === slugValue);
            return related ? (
              <button key={related.slug} onClick={() => onNavigate(`/glossary/${related.slug}`)} type="button">
                {related.term}
              </button>
            ) : null;
          })}
        </div>
      </section>
    </main>
  );
}

function PageHero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="niq-page-hero" data-niq-reveal>
      <p className="niq-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{body}</p>
    </section>
  );
}
