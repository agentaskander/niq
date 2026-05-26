import type { SanitizedLead } from "./leadValidation";

export type SafeLeadStore = {
  put?: (key: string, value: string) => Promise<unknown>;
};

export function serializeSafeLead(lead: SanitizedLead) {
  return JSON.stringify({
    name: lead.name,
    email: lead.email,
    organization: lead.organization,
    website: lead.website,
    profileType: lead.profileType,
    interestType: lead.interestType,
    contextInterest: lead.contextInterest,
    timeline: lead.timeline,
    note: lead.note,
    consentState: lead.consentState,
    metadata: lead.metadata,
    routing: lead.routing
  });
}

export async function persistSafeLead(lead: SanitizedLead, store?: SafeLeadStore) {
  if (!store?.put) {
    return { persisted: false, store: "none" };
  }
  const key = `lead:${lead.metadata.sourceApp || "narrativeiq"}:${Date.now()}:${lead.email}`;
  await store.put(key, serializeSafeLead(lead));
  return { persisted: true, store: "kv" };
}
