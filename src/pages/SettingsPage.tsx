export function SettingsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 pb-28 pt-6 md:px-8">
      <p className="text-xl font-bold text-ink">Settings</p>
      <div className="mt-6 space-y-4">
        {[
          ["No PHI storage", "MVP sessions are demo-only and should not contain patient identifiers."],
          ["OpenAI integration", "Future adapter will connect generateNarrative(input, style) to approved model workflows."],
          ["EHR integration", "Future export layer can route reviewed narratives through enterprise governance."],
          ["Template governance", "Approved clinical leaders can manage templates, warnings, and review requirements."]
        ].map(([title, copy]) => (
          <div key={title} className="clinical-card rounded-3xl p-5">
            <h2 className="font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
