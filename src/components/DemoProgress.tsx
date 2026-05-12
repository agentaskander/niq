type Props = {
  completeness: number;
  timelineCompleteness: number;
  quality: number;
  interactions: number;
};

export function DemoProgress({ completeness, timelineCompleteness, quality, interactions }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {[
        ["Patient story completeness", completeness],
        ["Timeline completeness", timelineCompleteness],
        ["Narrative quality", quality]
      ].map(([label, value]) => (
        <div key={label as string} className="rounded-3xl border border-line bg-white p-4 shadow-lift">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-muted">{label as string}</span>
            <span className="font-semibold text-blue">{value as number}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-blue transition-all" style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
      <div className="rounded-3xl border border-line bg-white p-4 shadow-lift">
        <p className="text-xs font-semibold text-muted">Workflow interactions</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{interactions}</p>
      </div>
    </div>
  );
}
