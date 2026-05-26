import type { LeadInterestType, LeadLifecycleStage, LeadProfileType } from "../schemas/leadTypes";

export function inferLifecycleStage(interestType: LeadInterestType): LeadLifecycleStage {
  if (interestType === "Demo") return "demo_requested";
  if (interestType === "Investor conversation") return "investor_review";
  if (interestType === "Partnership") return "partnership_review";
  if (interestType === "Research") return "research_preview";
  return "beta_waitlist";
}

export function inferPersona(profileType: LeadProfileType) {
  return profileType.toLowerCase().replace(/ \/ /g, "_").replace(/\s+/g, "_");
}

export function scoreLeadSignals(profileType: LeadProfileType, interestType: LeadInterestType) {
  return {
    engagementScore: interestType === "Private beta" ? 58 : 50,
    investorLikelihood: profileType === "Investor" || interestType === "Investor conversation" ? 72 : 20,
    partnershipPotential: profileType === "Partner / Integrator" || interestType === "Partnership" ? 68 : 24,
    enterpriseReadiness: profileType === "Enterprise leader" ? 64 : 28
  };
}
