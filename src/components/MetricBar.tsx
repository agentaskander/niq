type Props = {
  label: string;
  value: number;
  max?: number;
  description?: string;
  tone?: "blue" | "green" | "teal" | "amber";
};

const fillColor = {
  blue: "#2563EB",
  green: "#16A34A",
  teal: "#0D9488",
  amber: "#D97706"
};

function clampMetricPercent(value: number, max = 100) {
  if (!Number.isFinite(value) || max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

export function MetricBar({ label, value, max = 100, description, tone = "blue" }: Props) {
  const percent = clampMetricPercent(value, max);
  const width = `${percent}%`;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-muted">{label}</span>
        <span className="font-semibold" style={{ color: "#2563EB" }} data-testid="metric-bar-percent">{percent}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ backgroundColor: "#E2E8F0" }} aria-label={`${label} progress`} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="h-2 rounded-full transition-all" data-testid="metric-bar-fill" style={{ width, backgroundColor: fillColor[tone], display: "block" }} />
      </div>
      {description && <p className="mt-2 text-xs leading-5 text-muted">{description}</p>}
    </div>
  );
}
