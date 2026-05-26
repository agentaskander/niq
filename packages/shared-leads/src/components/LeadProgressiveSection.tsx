import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type LeadProgressiveSectionProps = {
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function LeadProgressiveSection({ open, onToggle, children }: LeadProgressiveSectionProps) {
  return (
    <>
      <button className="lead-more-button" aria-expanded={open} onClick={onToggle} type="button">
        Add more context <span>(optional)</span>
        <ChevronDown className={open ? "lead-chevron lead-chevron-open" : "lead-chevron"} size={17} />
      </button>
      <div aria-hidden={!open} className={open ? "lead-optional-fields lead-optional-fields-open" : "lead-optional-fields"}>
        {open && children}
      </div>
    </>
  );
}
