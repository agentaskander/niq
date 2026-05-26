import { ArrowLeft, Boxes, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

type ModuleChromeProps = {
  title: string;
  eyebrow: string;
  description: string;
  onNavigate: (path: string) => void;
  children: ReactNode;
};

export function ModuleChrome({ title, eyebrow, description, onNavigate, children }: ModuleChromeProps) {
  return (
    <main className="min-h-screen bg-canvas pb-24 text-ink">
      <section className="relative overflow-hidden border-b border-line bg-white px-5 py-8 md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(13,148,136,0.12),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(37,99,235,0.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lift hover:bg-hover"
              onClick={() => onNavigate("/modules")}
              type="button"
            >
              <ArrowLeft size={16} /> Modules
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-soft-green px-4 py-2 text-sm font-semibold text-green">
              <ShieldCheck size={16} /> Synthetic only
            </div>
          </div>
          <div className="mb-6 rounded-2xl border border-amber/30 bg-soft-amber px-5 py-4 text-sm font-semibold text-amber">
            Internal Ideation Board — not for public publishing.
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="section-kicker">{eyebrow}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-ink md:text-6xl">{title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{description}</p>
            </div>
            <div className="clinical-card rounded-[2rem] p-6">
              <Boxes className="text-teal" size={24} />
              <h2 className="mt-4 text-xl font-semibold text-ink">Safety frame</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Demo data is synthetic, non-PHI, non-diagnostic, non-advisory, and investor-demo safe.
              </p>
            </div>
          </div>
        </div>
      </section>
      {children}
    </main>
  );
}
