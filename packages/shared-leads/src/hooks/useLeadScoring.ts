import { useMemo } from "react";
import { inferLifecycleStage, inferPersona, scoreLeadSignals } from "../lib/scoring";
import type { LeadInterestType, LeadProfileType } from "../schemas/leadTypes";

export function useLeadScoring(profileType: LeadProfileType, interestType: LeadInterestType) {
  return useMemo(() => ({
    lifecycleStage: inferLifecycleStage(interestType),
    inferredPersona: inferPersona(profileType),
    ...scoreLeadSignals(profileType, interestType)
  }), [interestType, profileType]);
}
