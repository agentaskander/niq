import { ArrowRight, FileText, HeartPulse, ShieldCheck, Timer, Users } from "lucide-react";
import { motion } from "framer-motion";
import { MarketingTimelineMock } from "../components/MarketingTimelineMock";
import { SectionHeader } from "../components/SectionHeader";

type Props = {
  onNavigate: (path: string) => void;
};

const modes = ["Bedside note", "SOAP", "SBAR", "Handoff", "Provider narrative"];
const roles = ["Nursing", "NP/PA", "Urgent care", "Telehealth", "Home health", "Provider teams"];
const safety = ["Review Gate", "Scope-aware generation", "Copy-to-EHR workflow", "Audit logs", "PHI warning system"];
const adoption = ["Faster charting", "Cleaner handoffs", "Reduced cognitive burden", "Timeline continuity", "Workflow delight"];

export function LandingPage({ onNavigate }: Props) {
  return (
    <main className="overflow-hidden bg-canvas text-ink">
      <section className="relative px-5 pb-16 pt-6 md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_4%,rgba(59,130,246,0.12),transparent_32%),radial-gradient(circle_at_84%_12%,rgba(20,184,166,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-line bg-white/80 px-4 py-3 shadow-soft backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-soft-blue text-blue">
                <HeartPulse size={20} />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-ink">NarrativeIQ</p>
                <p className="text-xs text-muted">Structured clinical narratives</p>
              </div>
            </div>
          </div>

          <div className="grid min-h-[76vh] items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
              <p className="inline-flex rounded-full border border-blue/20 bg-soft-blue px-4 py-2 text-sm font-medium text-blue">
                Documentation assistant only • Clinician review required
              </p>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight text-ink md:text-7xl">
                  Structured clinical narratives at the speed of care.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted">
                  Turn symptoms, observations, and patient timelines into review-ready narratives across nursing and provider workflows.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue px-6 py-4 font-semibold text-white shadow-lift transition hover:bg-blue/90" onClick={() => onNavigate("/demo")} type="button">
                  Try Interactive Demo <ArrowRight size={18} />
                </button>
                <button className="rounded-2xl border border-line bg-white px-6 py-4 font-semibold text-muted shadow-lift" disabled type="button" title="Coming soon">
                  Book Clinical Pilot · Coming soon
                </button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <MarketingTimelineMock />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {[
            ["Problem", "Current charting forces clinicians to reconstruct patient stories from fragmented notes."],
            ["Solution", "NarrativeIQ creates a visual patient story timeline that generates structured narratives instantly."],
            ["Outcome", "Clinicians scan faster, document with more confidence, and hand off with clearer continuity."]
          ].map(([title, copy]) => (
            <div key={title} className="clinical-card rounded-[2rem] p-6">
              <h2 className="text-xl font-semibold text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="The Patient Story Timeline"
            title="The clinical story becomes visible before the note is written."
            description="Patient-stated symptoms, clinician observations, interventions, reassessments, and provider notifications form a calm timeline that updates the narrative live."
          />
          <MarketingTimelineMock />
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <SectionHeader
            eyebrow="Narrative Style Engine"
            title="One patient story, multiple clinical perspectives."
            description="The same timeline transforms into bedside notes, SOAP, SBAR, handoff, and provider narratives with role-aware safety boundaries."
          />
          <div className="grid gap-4 md:grid-cols-5">
            {modes.map((mode, index) => (
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="rounded-3xl border border-line bg-canvas p-5"
              >
                <FileText className="text-blue" size={20} />
                <p className="mt-4 font-semibold text-ink">{mode}</p>
                <p className="mt-2 text-xs leading-5 text-muted">Generated from the same structured facts.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Built For Clinical Workflows" title="Simple enough for nurses. Strong enough for provider teams." />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {roles.map((role) => (
              <div key={role} className="rounded-3xl border border-line bg-white p-5 text-center shadow-lift">
                <Users className="mx-auto text-teal" size={20} />
                <p className="mt-3 text-sm font-semibold text-ink">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Safety + Governance" title="Review stays where it belongs: with the clinician." />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {safety.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-line bg-canvas p-4 text-sm font-medium text-slate-700">
                  <ShieldCheck className="text-green" size={18} /> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="clinical-card rounded-[2rem] p-6">
            <p className="section-kicker">Workflow Intelligence</p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">Built from real clinician workflows.</h3>
            <p className="mt-3 text-sm leading-7 text-muted">
              NarrativeIQ learns from de-identified workflow patterns to improve specialty-specific documentation experiences without collecting patient identifiers.
            </p>
          </div>
          <div className="clinical-card rounded-[2rem] p-6">
            <p className="section-kicker">Conceptual Moat</p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">Clinical Story Engine architecture</h3>
            <div className="mt-6 space-y-3">
              {["Clinical Story Engine", "Timeline Layer", "Narrative Transformation Engine", "Role-aware Outputs"].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-blue text-sm font-bold text-blue">{index + 1}</span>
                  <div className="flex-1 rounded-2xl border border-line bg-white p-4 text-sm font-semibold text-ink">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Nurse Adoption Strategy" title="Designed around shift reality, not AI hype." />
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
            NarrativeIQ wins when it lowers the mental load of fragmented chart reconstruction, improves handoff confidence, and creates the “I need this on my next shift” moment for nurses.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {[...adoption, "60-second charting challenge", "Nurse champion program", "Workflow intelligence moat"].map((item) => (
              <div key={item} className="rounded-3xl border border-line bg-white p-5 shadow-lift">
                <Timer className="text-blue" size={20} />
                <p className="mt-4 text-sm font-semibold leading-6 text-ink">{item}</p>
              </div>
            ))}
          </div>
          <button className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-lift hover:bg-hover" onClick={() => onNavigate("/app/adoption")} type="button">
            View nurse adoption plan <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-4">
          {[
            ["48 sec", "Average note time"],
            ["82%", "Copy-to-EHR rate"],
            ["96%", "Review completion"],
            ["8.7/10", "Nurse delight score"]
          ].map(([value, label]) => (
            <div key={label} className="rounded-[2rem] border border-line bg-canvas p-6 text-center">
              <p className="text-4xl font-semibold text-blue">{value}</p>
              <p className="mt-2 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 rounded-[2rem] border border-blue/20 bg-soft-blue p-8 md:flex-row md:items-center">
          <div>
            <p className="section-kicker">Interactive Demo</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">See NarrativeIQ in a live workflow demo.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-2xl bg-blue px-6 py-4 font-semibold text-white shadow-lift" onClick={() => onNavigate("/demo")} type="button">
              Open Studio <ArrowRight size={18} />
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-blue/20 bg-white px-6 py-4 font-semibold text-blue shadow-lift" onClick={() => onNavigate("/lab/dark-mode")} type="button">
              Compare Production vs Concept Lab
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
