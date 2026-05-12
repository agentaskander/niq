const events = [
  ["07:52", "Patient statement", "Pain started after meals and worsened today."],
  ["08:10", "Assessment", "Severity 7/10, nausea present, fever denied."],
  ["08:18", "Escalation", "Provider notified per protocol."],
  ["08:45", "Reassessment", "Resting in position of comfort, response documented."]
];

export function MarketingTimelineMock() {
  return (
    <div className="clinical-card rounded-[2rem] p-6">
      <p className="section-kicker">Patient Story Timeline</p>
      <div className="relative mt-6 space-y-5 before:absolute before:left-4 before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-line">
        {events.map(([time, title, detail], index) => (
          <div key={time} className="relative flex gap-4">
            <div className={`z-10 mt-1 h-8 w-8 rounded-full border-4 border-white shadow-lift ${
              index === 0 ? "bg-blue" : index === 1 ? "bg-teal" : index === 2 ? "bg-amber" : "bg-green"
            }`} />
            <div>
              <p className="text-xs font-semibold text-blue">{time}</p>
              <h3 className="font-semibold text-ink">{title}</h3>
              <p className="text-sm leading-6 text-muted">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
