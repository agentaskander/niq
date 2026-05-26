import type { LeadInterestType } from "../schemas/leadTypes";

export function inferLeadQueue(interestType: LeadInterestType) {
  if (interestType === "Investor conversation") return "investor-review";
  if (interestType === "Partnership") return "partnership-review";
  if (interestType === "Demo") return "demo-review";
  if (interestType === "Research") return "research-preview";
  return "beta-waitlist";
}
