import { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { BetaSignupPage } from "./pages/BetaSignupPage";
import { PublicDemoApp } from "./public-demo/PublicDemoApp";

const PUBLIC_HOME_PATH = "/demo/healthcare-cognition";
const betaRoutes = new Set([PUBLIC_HOME_PATH, "/beta", "/beta/healthcare-cognition", "/contact", "/request-demo"]);

function normalizePath(path: string) {
  return path.replace(/\/$/, "") || "/";
}

function initialBetaPath() {
  const path = normalizePath(window.location.pathname);
  if (path === "/") {
    window.history.replaceState(null, "", "/beta");
    return "/beta";
  }
  return path;
}

export function BetaDeploymentApp() {
  const [path, setPath] = useState(initialBetaPath);
  const isAllowed = betaRoutes.has(path);

  const navigate = (nextPath: string) => {
    const [rawPath] = nextPath.split("#");
    const normalized = normalizePath(rawPath);
    const target = normalized === "/" ? "/beta" : betaRoutes.has(normalized) ? nextPath : PUBLIC_HOME_PATH;
    window.history.pushState(null, "", target);
    setPath(normalizePath(window.location.pathname));
  };

  window.onpopstate = () => setPath(normalizePath(window.location.pathname));

  if (!isAllowed) return <BetaBoundary onNavigate={navigate} />;
  if (path === "/beta") return <BetaSignupPage onNavigate={navigate} />;
  if (path === "/beta/healthcare-cognition") return <BetaHealthcarePreview onNavigate={navigate} />;

  return <PublicDemoApp path={path} onNavigate={navigate} />;
}

function BetaBoundary({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <main className="min-h-screen bg-canvas px-5 py-16 text-ink md:px-8">
      <section className="clinical-card mx-auto max-w-2xl rounded-[2rem] p-8">
        <p className="section-kicker">Beta Boundary</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">This route is outside the beta preview.</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          The beta deployment exposes only the public demo, public Healthcare Cognition preview, and NDA-oriented beta intake.
        </p>
        <button
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue px-5 py-3 text-sm font-semibold text-white shadow-lift hover:bg-blue/90"
          onClick={() => onNavigate("/beta")}
          type="button"
        >
          Open beta intake
        </button>
      </section>
    </main>
  );
}

function BetaHealthcarePreview({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <main className="min-h-screen bg-canvas px-5 pb-24 pt-10 text-ink md:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-line bg-white/80 p-4 shadow-soft backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-soft-blue text-blue">
              <LockKeyhole size={20} />
            </div>
            <div>
              <p className="section-kicker">Private Beta Preview</p>
              <h1 className="text-2xl font-semibold tracking-tight text-ink">Healthcare Cognition Lab</h1>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lift hover:bg-hover"
            onClick={() => onNavigate("/demo/healthcare-cognition")}
            type="button"
          >
            Public preview <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="clinical-card rounded-[2rem] p-6">
            <p className="section-kicker">Confidentiality Acknowledgment</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Limited product exposure for NDA review.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              This beta preview provides a controlled view of product direction, module value, and review boundaries. It does not expose management tools, restricted knowledge assets, or production implementation methods.
            </p>
            <div className="mt-6 rounded-2xl border border-amber/30 bg-soft-amber p-4 text-sm font-semibold leading-6 text-slate-800">
              Access assumes confidential handling. Do not redistribute screenshots, workflow details, or roadmap context without written approval.
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {[
              ["Demo Data", "Preview examples use non-PHI demo data and public-safe healthcare context."],
              ["Review Boundary", "The lab remains a workflow intelligence preview, not clinical advice."],
              ["Detail Capture", "Beta feedback should focus on workflow clarity, buyer fit, and implementation constraints."],
              ["Limited Scope", "No management console, operations console, deep workspace, or restricted engineering views are mounted in this build."]
            ].map(([title, body]) => (
              <article key={title} className="rounded-[2rem] border border-line bg-white p-5 shadow-lift">
                <ShieldCheck className="text-green" size={20} />
                <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </article>
            ))}
          </section>
        </div>

        <section className="clinical-card mt-5 rounded-[2rem] p-6">
          <p className="section-kicker">Beta Discussion Notes</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              "Which workflows lose the most context across handoffs?",
              "Where should provenance and review gates appear in the product surface?",
              "What procurement, compliance, and integration questions need early answers?"
            ].map((question) => (
              <div key={question} className="rounded-2xl border border-line bg-canvas p-4 text-sm font-semibold leading-6 text-slate-700">
                {question}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
