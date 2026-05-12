type Props = {
  symptoms: string[];
  negatives: string[];
  observations: string[];
  interventions: string[];
};

export function SelectedFactsPanel({ symptoms, negatives, observations, interventions }: Props) {
  const groups = [
    ["Symptoms", symptoms],
    ["Negatives", negatives],
    ["Observations", observations],
    ["Interventions", interventions]
  ];
  return (
    <div className="clinical-card rounded-[2rem] p-4">
      <p className="section-kicker">Selected Facts</p>
      <div className="mt-4 space-y-3">
        {groups.map(([label, items]) => (
          <div key={label as string}>
            <p className="text-xs font-semibold text-muted">{label as string}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(items as string[]).length ? (items as string[]).map((item) => (
                <span key={item} className="rounded-full border border-line bg-slate-50 px-2.5 py-1 text-xs text-slate-600">{item}</span>
              )) : <span className="text-xs text-muted">None selected</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
