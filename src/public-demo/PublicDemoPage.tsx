import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "./components/Icon";
import { articles, type PublicArticle } from "./data/articles";
import { glossaryTerms, type GlossaryTerm } from "./data/glossary";
import { continuityMoments, graphClusters, graphEdges, graphNodes, scenarios, type Scenario } from "./data/publicScenarios";
import { usePublicMeta } from "./seo";

type PublicDemoPageProps = {
  path: string;
  onNavigate: (path: string) => void;
};

export function PublicDemoPage({ path, onNavigate }: PublicDemoPageProps) {
  const slug = path.split("/").pop();
  let content = <HomePage onNavigate={onNavigate} />;

  if (path === "/articles") content = <ArticlesIndex onNavigate={onNavigate} />;
  if (path.startsWith("/articles/")) content = <ArticlePage slug={slug ?? ""} onNavigate={onNavigate} />;
  if (path === "/glossary") content = <GlossaryIndex onNavigate={onNavigate} />;
  if (path.startsWith("/glossary/")) content = <GlossaryPage slug={slug ?? ""} onNavigate={onNavigate} />;

  return (
    <>
      <SiteHeader onNavigate={onNavigate} />
      {content}
      <SiteFooter onNavigate={onNavigate} />
    </>
  );
}

function SiteHeader({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  return (
    <header className="niq-topbar">
      <button className="niq-brand" onClick={() => onNavigate("/demo")} type="button" aria-label="NiQ public demo home">
        <span className="niq-brand-mark">NiQ</span>
        <span>Narrative Intelligence</span>
      </button>
      <nav aria-label="Public demo navigation">
        <button onClick={() => onNavigate("/demo#demo")} type="button">Demo</button>
        <button onClick={() => onNavigate("/articles")} type="button">Articles</button>
        <button onClick={() => onNavigate("/glossary")} type="button">Glossary</button>
        <a href="mailto:hello@agentaskander.com">Contact</a>
      </nav>
    </header>
  );
}

function SiteFooter({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  return (
    <footer className="niq-footer">
      <div>
        <strong>NiQ</strong>
        <p>Narrative intelligence infrastructure for human-centered AI systems.</p>
      </div>
      <div className="niq-footer-links">
        <button onClick={() => onNavigate("/articles")} type="button">Articles</button>
        <button onClick={() => onNavigate("/glossary")} type="button">Glossary</button>
        <a href="mailto:hello@agentaskander.com">hello@agentaskander.com</a>
      </div>
    </footer>
  );
}

function HomePage({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  usePublicMeta({
    title: "NiQ Demo | Narrative Intelligence Infrastructure",
    description:
      "NiQ is a public-safe interactive demo for narrative intelligence infrastructure built around continuity, context, and human review.",
    path: "/demo"
  });

  return (
    <main>
      <section className="niq-hero">
        <div className="niq-hero-bg" aria-hidden="true" />
        <div className="niq-hero-copy">
          <p className="niq-eyebrow">Enterprise-safe public demo</p>
          <h1 className="niq-hero-title">
            <span>Narrative intelligence</span>
            <span>infrastructure</span>
            <span>for human-centered</span>
            <span>AI systems.</span>
          </h1>
          <p className="niq-lede">
            NiQ shows how fragmented conversations, workflow signals, and continuity can become structured intelligence
            surfaces for review. This demo is deterministic, synthetic, and frontend-only.
          </p>
          <div className="niq-hero-actions">
            <button className="niq-button" onClick={() => onNavigate("/demo#demo")} type="button">
              Explore demo <Icon name="arrow" />
            </button>
            <button className="niq-button niq-ghost" onClick={() => onNavigate("/articles/what-is-narrative-intelligence")} type="button">
              Read the thesis
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
            <SignalCard icon="network" title="Context graph" body="Relationships between synthetic events, people, and open questions." />
            <SignalCard icon="workflow" title="Workflow state" body="A reviewable surface showing readiness, gaps, and next actions." />
            <SignalCard icon="shield" title="Human review" body="Every generated summary is positioned as a draft for inspection." />
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
      <GraphSection />
      <WorkflowDemo scenario={scenario} setScenarioId={setScenarioId} />
      <ContinuitySection />
      <ArchitectureSection />
      <ArticlePreview onNavigate={onNavigate} />
      <GlossaryPreview onNavigate={onNavigate} />
      <InvestorSection />
      <FinalCta />
    </>
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
          <p className="niq-eyebrow">SEO article engine</p>
          <h2>Structured thinking for discoverability</h2>
        </div>
        <button className="niq-text-link" onClick={() => onNavigate("/articles")} type="button">
          View all articles <Icon name="chevron" />
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

function InvestorSection() {
  return (
    <section className="niq-section niq-investor-section" data-niq-reveal>
      <div className="niq-investor-board">
        <div>
          <p className="niq-eyebrow">Investor-safe positioning</p>
          <h2>From fragmented work to continuity infrastructure.</h2>
          <p>
            NiQ is positioned around durable human context, reviewable narratives, and enterprise workflow continuity.
            The public demo makes the category legible while keeping the product boundary conservative.
          </p>
        </div>
        <div className="niq-metrics">
          <div><strong>0</strong><span>External API calls</span></div>
          <div><strong>100%</strong><span>Synthetic demo data</span></div>
          <div><strong>4</strong><span>Public concept layers</span></div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="niq-final-cta" data-niq-reveal>
      <Icon name="spark" />
      <h2>Build AI systems that remember the human story.</h2>
      <p>For partnerships, pilots, or investor conversations, contact the NiQ team.</p>
      <a className="niq-button" href="mailto:hello@agentaskander.com">hello@agentaskander.com</a>
    </section>
  );
}

function ArticlesIndex({ onNavigate }: Pick<PublicDemoPageProps, "onNavigate">) {
  usePublicMeta({
    title: "NiQ Articles | Narrative Intelligence",
    description: "SEO-ready public articles on narrative intelligence, continuity, and human-centered AI systems.",
    path: "/articles"
  });
  return (
    <main className="niq-subpage">
      <PageHero eyebrow="Articles" title="Narrative intelligence writing" body="Public-safe essays on context, continuity, and infrastructure for human-centered AI systems." />
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
        <InternalLinks current={article.slug} onNavigate={onNavigate} />
      </article>
    </main>
  );
}

function InternalLinks({ current, onNavigate }: { current: string; onNavigate: (path: string) => void }) {
  return (
    <aside className="niq-internal-links">
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
