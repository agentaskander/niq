import type { ComplaintGroup } from "../lib/types";

type Props = {
  groups: ComplaintGroup[];
  selected: ComplaintGroup;
  onSelect: (group: ComplaintGroup) => void;
};

export function ComplaintGroupSelector({ groups, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {groups.map((group) => (
        <button
          key={group.id}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
            selected.id === group.id
              ? "border-blue bg-blue text-white shadow-lift"
              : "border-line bg-white text-muted hover:bg-hover hover:text-ink"
          }`}
          onClick={() => onSelect(group)}
          type="button"
        >
          {group.name}
        </button>
      ))}
    </div>
  );
}
