import { useMemo } from "react";
import type { LeadInterestType, LeadProfileType } from "../schemas/leadTypes";

const profileSubcopy: Record<LeadProfileType, string> = {
  "Founder / Builder": "Evaluate integration and ecosystem potential.",
  Investor: "Preview the emerging narrative intelligence layer.",
  "Healthcare operator": "Explore workflow-aware narrative cognition.",
  "Enterprise leader": "Assess governed intelligence for complex operating environments.",
  Researcher: "Explore research-grade narrative intelligence patterns.",
  "Partner / Integrator": "Evaluate interoperability and partnership potential.",
  "Curious individual": "Get a clear public-safe preview of the platform direction."
};

const interestCtas: Record<LeadInterestType, string> = {
  "Private beta": "Request beta access",
  Demo: "Request a guided preview",
  Contact: "Send request",
  "Investor conversation": "Start investor conversation",
  Partnership: "Explore partnership",
  "Healthcare cognition": "Preview healthcare cognition",
  "Narrative intelligence": "Preview narrative intelligence",
  Research: "Join research preview",
  Other: "Send request"
};

export function useLeadPersonalization(profileType: LeadProfileType, interestType: LeadInterestType) {
  return useMemo(() => ({
    subcopy: profileSubcopy[profileType],
    ctaLabel: interestCtas[interestType],
    optionalPrompt: profileType === "Healthcare operator" ? "Anything useful about your workflow context?" : "Anything useful to know?"
  }), [interestType, profileType]);
}
