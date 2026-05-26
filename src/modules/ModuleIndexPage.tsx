import { ArrowRight, BrainCircuit, FileText, ShieldCheck } from "lucide-react";

type ModuleIndexPageProps = {
  onNavigate: (path: string) => void;
};

const modules = [
  {
    path: "/modules/healthcare-cognition",
    title: "Healthcare Cognition Lab",
    description: "Synthetic healthcare workflow cognition surfaces with ontology, provenance, orchestration, and investor roadmap.",
    icon: BrainCircuit,
    status: "New"
  },
  {
    path: "/modules/new-patient-story",
    title: "New Patient Story",
    description: "Original interactive NarrativeIQ patient story workflow retained as a module entry.",
    icon: FileText,
    status: "Retained"
  }
];

export function ModuleIndexPage({ onNavigate }: ModuleIndexPageProps) {
  return (
    <main className="min-h-screen bg-canvas px-5 pb-28 pt-10 text-ink md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="section-kicker">NarrativeIQ Modules</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-ink md:text-6xl">Choose a focused NarrativeIQ lab.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              Modules are isolated surfaces inside the restored app. The original home remains at the root route.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-soft-green px-4 py-2 text-sm font-semibold text-green">
            <ShieldCheck size={16} /> Root app preserved
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <article key={module.path} className="clinical-card rounded-[2rem] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-blue text-blue">
                    <Icon size={22} />
                  </div>
                  <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-muted">{module.status}</span>
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-ink">{module.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{module.description}</p>
                <button
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue px-5 py-3 text-sm font-semibold text-white shadow-lift hover:bg-blue/90"
                  onClick={() => onNavigate(module.path)}
                  type="button"
                >
                  Open module <ArrowRight size={16} />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
