type LeadInterestTilesProps<T extends string> = {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
};

export function LeadInterestTiles<T extends string>({ label, options, value, onChange }: LeadInterestTilesProps<T>) {
  return (
    <fieldset className="lead-tile-group">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button className={value === option ? "lead-choice-tile lead-choice-tile-selected" : "lead-choice-tile"} key={option} onClick={() => onChange(option)} type="button">
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
