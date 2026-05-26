import { useState } from "react";
import { PublicDemoApp } from "./public-demo/PublicDemoApp";

const publicRoutes = new Set(["/", "/healthcare-cognition", "/articles", "/glossary", "/beta", "/contact", "/request-demo"]);

function normalizePath(path: string) {
  const normalized = path.replace(/\/$/, "") || "/";
  return normalized;
}

function initialPublicPath() {
  const path = normalizePath(window.location.pathname);
  if (path === "/") {
    return "/";
  }
  return path;
}

export function PublicDeploymentApp() {
  const [path, setPath] = useState(initialPublicPath);
  const isAllowed = publicRoutes.has(path) || path.startsWith("/articles/") || path.startsWith("/glossary/");

  const navigate = (nextPath: string) => {
    const [rawPath] = nextPath.split("#");
    const normalized = normalizePath(rawPath);
    const target = publicRoutes.has(normalized) || normalized.startsWith("/articles/") || normalized.startsWith("/glossary/") ? nextPath : "/";
    window.history.pushState(null, "", target);
    setPath(normalizePath(window.location.pathname));

    const hash = target.includes("#") ? target.split("#").pop() : "";
    if (hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  };

  window.onpopstate = () => setPath(normalizePath(window.location.pathname));

  if (!isAllowed) {
    return (
      <main className="min-h-screen bg-canvas px-5 py-16 text-ink md:px-8">
        <section className="clinical-card mx-auto max-w-2xl rounded-[2rem] p-8">
          <p className="section-kicker">Public Deployment Boundary</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">This route is not part of the public demo.</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            NarrativeIQ public deployment exposes only the public demo experience and public-safe Healthcare Cognition preview.
          </p>
          <button
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue px-5 py-3 text-sm font-semibold text-white shadow-lift hover:bg-blue/90"
            onClick={() => navigate("/")}
            type="button"
          >
            Open NiQ
          </button>
        </section>
      </main>
    );
  }

  return <PublicDemoApp path={path} onNavigate={navigate} />;
}
