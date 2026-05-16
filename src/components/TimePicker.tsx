import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

function formatDate(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normalizeTimeInput(value: string, now = new Date()) {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "";
  if (trimmed === "now") return formatDate(now);

  const compact = trimmed.match(/^(\d{1,2})(\d{2})([ap])?$/);
  if (compact) {
    const hour = Number(compact[1]);
    const minute = Number(compact[2]);
    const period = compact[3];
    return formatClock(hour, minute, period);
  }

  const colon = trimmed.match(/^(\d{1,2}):(\d{2})\s*([ap]m?|am|pm)?$/);
  if (colon) {
    const hour = Number(colon[1]);
    const minute = Number(colon[2]);
    const period = colon[3]?.[0];
    return formatClock(hour, minute, period);
  }

  return value;
}

function formatClock(hour: number, minute: number, period?: string) {
  if (!Number.isFinite(hour) || !Number.isFinite(minute) || minute < 0 || minute > 59) return "";
  let hour24 = hour;
  if (period === "p" && hour < 12) hour24 = hour + 12;
  if (period === "a" && hour === 12) hour24 = 0;
  const inferredPeriod = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${inferredPeriod}`;
}

export function TimePicker({ value, onChange, label = "Time" }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const commit = (nextValue = draft) => {
    const normalized = normalizeTimeInput(nextValue);
    onChange(normalized || nextValue);
    setDraft(normalized || nextValue);
  };

  const quick = (minutesOffset: number) => {
    const next = formatDate(new Date(Date.now() + minutesOffset * 60_000));
    onChange(next);
    setDraft(next);
    setOpen(false);
  };

  return (
    <label className="relative grid gap-1 text-xs font-semibold text-muted">
      <span>{label}</span>
      <span className="inline-flex w-[112px] items-center rounded-xl border border-line bg-white shadow-sm focus-within:border-blue">
        <input
          aria-label={label}
          className="h-9 w-[84px] rounded-l-xl px-2 text-sm font-semibold text-ink outline-none"
          inputMode="text"
          onBlur={() => commit()}
          onChange={(event) => {
            setDraft(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          value={draft}
        />
        <button
          aria-label={`${label} quick options`}
          className="flex h-9 w-8 items-center justify-center rounded-r-xl text-muted transition hover:bg-hover hover:text-ink"
          onClick={() => setOpen(!open)}
          type="button"
        >
          <Clock3 size={15} />
        </button>
      </span>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-36 rounded-2xl border border-line bg-white p-1.5 shadow-soft">
          <QuickButton label="Now" onClick={() => quick(0)} />
          <QuickButton label="+15m" onClick={() => quick(15)} />
          <QuickButton label="+30m" onClick={() => quick(30)} />
          <QuickButton label="Shift start" onClick={() => { onChange("07:00 AM"); setDraft("07:00 AM"); setOpen(false); }} />
        </div>
      )}
    </label>
  );
}

function QuickButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="block min-h-9 w-full rounded-xl px-3 text-left text-xs font-semibold text-slate-700 hover:bg-hover" onClick={onClick} type="button">
      {label}
    </button>
  );
}
