import { Activity, ArrowRight, Moon, ShieldCheck, Sparkles } from "lucide-react";

type Props = {
  onNavigate: (path: string) => void;
};

const timeline = [
  ["08:12", "Patient stated", "Chest pressure began during walk to clinic."],
  ["08:19", "Clinician observed", "Speaking full sentences, skin warm and dry."],
  ["08:27", "Provider notified", "Assessment findings communicated for provider evaluation."],
  ["08:41", "Reassessment", "Patient reports symptoms unchanged while awaiting direction."]
];

export function DarkModeConceptLab({ onNavigate }: Props) {
  return (
    <main className="min-h-screen bg-[#0F172A] px-5 pb-28 pt-6 text-slate-100 md:px-8">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#111827] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <div className="relative p-6 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(96,165,250,0.24),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(45,212,191,0.18),transparent_28%)]" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">
                <Moon size={14} /> Dark Mode Concept Lab
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                A cinematic workflow concept for investor demos.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                This lab preserves the stronger dark demo aesthetic: deep clinical atmosphere, glowing timeline nodes, elevated narrative panels, and dramatic hierarchy while keeping readability in check.
              </p>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-100 backdrop-blur transition hover:bg-white/15"
              onClick={() => onNavigate("/demo")}
              type="button"
            >
              Compare Production vs Concept Lab <ArrowRight size={16} />
            </button>
          </div>

          <div className="relative mt-10 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <section className="rounded-[1.75rem] border border-white/10 bg-[#1E293B]/75 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-sky-300">Cinematic Patient Story Timeline</p>
                <Sparkles className="text-teal-300" size={18} />
              </div>
              <div className="relative mt-6 space-y-5 before:absolute before:left-4 before:top-4 before:h-[calc(100%-28px)] before:w-px before:bg-sky-300/20">
                {timeline.map(([time, type, detail]) => (
                  <div key={time} className="relative flex gap-4">
                    <div className="z-10 mt-1 h-8 w-8 rounded-full border border-sky-200/30 bg-sky-400 shadow-[0_0_26px_rgba(96,165,250,0.8)]" />
                    <div className="flex-1 rounded-2xl border border-white/10 bg-[#111827]/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-400">{time}</span>
                        <span className="rounded-full bg-teal-300/10 px-2.5 py-1 text-xs font-semibold text-teal-200">{type}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-100">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-white/10 bg-[#1E293B]/75 p-5 backdrop-blur">
              <p className="flex items-center gap-2 text-sm font-semibold text-sky-300">
                <Activity size={17} /> Narrative Mode Engine
              </p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#0F172A]/80 p-5 text-sm leading-7 text-slate-200">
                <p className="font-semibold text-slate-50">SBAR Preview</p>
                <p className="mt-3">Situation: Patient reports chest pressure beginning during walk to clinic.</p>
                <p>Background: Timeline includes patient-stated symptom onset, clinician-observed status, provider notification, and reassessment.</p>
                <p>Assessment: Findings documented for clinician review.</p>
                <p>Recommendation/Request: Provider evaluation requested. Awaiting provider direction.</p>
              </div>
              <div className="mt-5 rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                <ShieldCheck className="mb-2" size={18} />
                Concept only. Production UI remains the calmer light-mode clinical workflow.
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
