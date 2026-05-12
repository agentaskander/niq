import { ArrowRight, Brain, ClipboardList, HeartHandshake, Repeat2, Timer, Users } from "lucide-react";

const painPoints = [
  ["Shift chaos", "Nurses reconstruct patient stories while answering call lights, coordinating handoffs, and responding to changing status."],
  ["Cognitive burden", "Charting forces clinicians to translate scattered observations into defensible narrative logic after the moment has passed."],
  ["Fragmented reconstruction", "Symptoms, timing, reassessments, and provider notifications live in separate mental buckets until documentation time."],
  ["Handoff stress", "The next clinician needs the story, not just isolated fields and stale fragments."],
  ["Defensive charting", "Repetitive documentation becomes a safety behavior, not a workflow clinicians enjoy."]
];

const betaPlan = [
  "5-nurse beta cohort across ED, med-surg, ICU, home health, and urgent care",
  "10 real-world mock scenarios per nurse with before/after note comparison",
  "60-second charting challenge measured against baseline reconstruction time",
  "Measure perceived confidence, edit rate, copy rate, and next-shift intent",
  "Ask the retention question directly: “Would you need this on your next shift?”",
  "Build specialty packs from nurse language, workflow gaps, and handoff patterns",
  "Launch nurse champion referral loop with manager dashboard feedback"
];

const enterprise = [
  "Workflow lock-in through timeline-native charting habits",
  "Structured clinical storytelling across nurses, NPs, PAs, physicians, urgent care, telehealth, and home health",
  "Cross-role narrative generation from the same patient story",
  "Burnout reduction through less reconstruction and fewer repetitive note rewrites",
  "Better handoff quality, chart consistency, and specialty-specific documentation patterns",
  "Workflow intelligence moat from de-identified selection sequences, edits, acceptance, and abandonment points"
];

export function NurseAdoptionPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 md:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_0.8fr] lg:p-10">
          <div>
            <p className="section-kicker">Nurse Adoption Strategy</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-ink md:text-6xl">
              Win the shift before selling the platform.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
              NarrativeIQ adoption starts with nurse pain: cognitive burden, fragmented chart reconstruction, handoff stress, repetitive documentation, and defensive charting under shift pressure. The product wins when a nurse says, “I need this on my next shift.”
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Timeline cognition advantage", "Nurse delight", "Workflow addiction", "Burnout reduction"].map((item) => (
                <span key={item} className="rounded-full border border-blue/20 bg-soft-blue px-4 py-2 text-sm font-semibold text-blue">{item}</span>
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-blue/20 bg-soft-blue p-5">
            <p className="text-sm font-semibold text-blue">Before / After Note Comparison</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Before</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Fragmented symptom notes, timing remembered later, reassessment buried, handoff rebuilt from memory.</p>
              </div>
              <div className="rounded-2xl border border-blue/20 bg-white p-4 shadow-lift">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue">After</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">Patient story timeline captures symptom progression, interventions, reassessment, and provider notification, then renders nursing, SBAR, handoff, or provider formats.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-5">
        {painPoints.map(([title, copy], index) => {
          const icons = [Brain, Timer, ClipboardList, HeartHandshake, Repeat2];
          const Icon = icons[index];
          return (
            <div key={title} className="clinical-card rounded-[1.75rem] p-5">
              <Icon className="text-blue" size={20} />
              <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{copy}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="clinical-card rounded-[2rem] p-6">
          <p className="section-kicker">Beta Cohort Rollout</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">The 60-second charting challenge.</h2>
          <div className="mt-5 grid gap-3">
            {betaPlan.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-line bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <ArrowRight className="mt-0.5 shrink-0 text-teal" size={16} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-teal/20 bg-soft-teal p-6 shadow-lift">
          <p className="section-kicker text-teal">Enterprise Positioning</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Workflow-native infrastructure, not another scribe.</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {enterprise.map((item) => (
              <div key={item} className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm leading-6 text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-teal/20 bg-white p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-teal"><Users size={17} /> Nurse Champion Program</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Recruit nurse champions by specialty, gather de-identified workflow feedback, promote specialty packs that feel authored by the floor, and build retention through visible charting relief.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
