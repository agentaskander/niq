import { CalendarDays } from "lucide-react";
import { TimePicker } from "./TimePicker";

type Props = {
  timestamp: string;
  onChange: (timestamp: string) => void;
};

const todayValue = () => new Date().toISOString().slice(0, 10);

function parseTimestamp(timestamp: string) {
  const match = timestamp.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)$/);
  return {
    date: match?.[1] ?? todayValue(),
    time: match?.[2] ?? timestamp
  };
}

export function EventDateTimeSelector({ timestamp, onChange }: Props) {
  const { date, time } = parseTimestamp(timestamp);
  const update = (nextDate: string, nextTime: string) => onChange(`${nextDate} ${nextTime}`.trim());

  return (
    <div className="grid gap-2 sm:grid-cols-[150px_112px]" data-testid="event-date-time-selector">
      <label className="grid gap-1 text-xs font-semibold text-muted">
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> Date</span>
        <input
          aria-label="Date"
          className="h-9 rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-blue"
          onChange={(event) => update(event.target.value, time)}
          type="date"
          value={date}
        />
      </label>
      <TimePicker value={time} onChange={(nextTime) => update(date, nextTime)} />
    </div>
  );
}
