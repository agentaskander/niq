import type { ComplaintGroup } from "../lib/types";
import { SelectableChip } from "./SelectableChip";

type Props = {
  groups: ComplaintGroup[];
  selected: ComplaintGroup;
  onSelect: (group: ComplaintGroup) => void;
};

export function ComplaintGroupSelector({ groups, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {groups.map((group) => (
        <SelectableChip
          key={group.id}
          label={group.name}
          selected={selected.id === group.id}
          onClick={() => onSelect(group)}
        />
      ))}
    </div>
  );
}
