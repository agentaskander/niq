import type { RoleScope } from "../lib/types";

type Props = {
  roles: RoleScope[];
  selected: RoleScope;
  onSelect: (role: RoleScope) => void;
};

export function RoleSelector({ roles, selected, onSelect }: Props) {
  return (
    <div className="grid gap-2">
      {roles.map((role) => (
        <button
          key={role.id}
          className={`rounded-2xl border p-4 text-left transition ${
            selected.id === role.id
              ? "border-blue bg-soft-blue shadow-lift"
              : "border-line bg-white hover:border-blue/30 hover:bg-hover"
          }`}
          onClick={() => onSelect(role)}
          type="button"
        >
          <div className="font-semibold text-ink">{role.name}</div>
          <p className="mt-1 text-xs leading-5 text-muted">{role.safetyDisclosure}</p>
        </button>
      ))}
    </div>
  );
}
