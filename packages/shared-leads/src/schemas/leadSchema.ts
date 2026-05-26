import type { LeadAppConfig, LeadInterestType, LeadProfileType } from "./leadTypes";

export const defaultProfileTypes: LeadProfileType[] = [
  "Founder / Builder",
  "Investor",
  "Healthcare operator",
  "Enterprise leader",
  "Researcher",
  "Partner / Integrator",
  "Curious individual"
];

export const defaultInterestTypes: LeadInterestType[] = ["Private beta", "Demo", "Partnership", "Investor conversation", "Healthcare cognition", "Narrative intelligence", "Research", "Other"];

export const defaultSharedLeadConfig: LeadAppConfig = {
  sourceApp: "NarrativeIQ",
  fallbackEmail: "niq@synkos.net",
  fallbackSubject: "NarrativeIQ Private Beta Interest",
  defaultInterest: "Private beta",
  trustChips: ["Narrative cognition", "Workflow intelligence", "Governance-aware AI", "Public-safe preview"],
  proofPoints: ["Investor and design-partner interest", "No clinical deployment claims"],
  successLinks: [
    { label: "Explore Healthcare Cognition", path: "/demo/healthcare-cognition" },
    { label: "View Public Modules", path: "/demo#public-module-previews" },
    { label: "Read Articles", path: "/articles" }
  ]
};

export function createLeadId(sourceApp: string) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${sourceApp.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}-${random}`;
}
