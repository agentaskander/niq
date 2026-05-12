const adoptionPlan = [
  "Start with nurse pain, not hospital AI hype",
  "5-nurse beta cohort across ED, med-surg, ICU, home health, and urgent care",
  "10 real-world mock scenarios per nurse",
  "Measure time to narrative and perceived confidence",
  "Measure copy/edit rate and next-shift intent",
  "Record testimonials with permission",
  "Build specialty packs from nurse feedback",
  "Create nurse champion referral loop"
];

const funnel = [
  "Watch 30-second demo",
  "Try sample scenario",
  "Build first patient story",
  "Copy narrative",
  "Invite coworker",
  "Join beta cohort",
  "Team pilot"
];

export function NurseAdoptionPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8">
      <p className="section-kicker">Nurse Adoption</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">How NarrativeIQ wins nurse adoption</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
        The adoption path starts with shift-level documentation pressure, practical mock scenarios, and specialty packs shaped by nurse feedback.
      </p>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <section className="clinical-card rounded-3xl p-5">
          <h2 className="text-xl font-semibold text-ink">Beta Plan</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {adoptionPlan.map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-slate-50 p-4 text-sm leading-6 text-slate-600">{item}</div>
            ))}
          </div>
        </section>
        <section className="rounded-3xl border border-blue/20 bg-soft-blue p-5 shadow-lift">
          <h2 className="text-xl font-semibold text-ink">Adoption Funnel</h2>
          <div className="mt-5 space-y-3">
            {funnel.map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue text-sm font-bold text-white">{index + 1}</span>
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
