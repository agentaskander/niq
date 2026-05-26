import { inferLeadQueue } from "../lib/routing";
import { inferLifecycleStage, inferPersona, scoreLeadSignals } from "../lib/scoring";
import { isValidEmail, sanitizeLeadText } from "../lib/validation";
import type { LeadInterestType, LeadProfileType } from "../schemas/leadTypes";

const profileTypes = new Set<LeadProfileType>([
  "Founder / Builder",
  "Investor",
  "Healthcare operator",
  "Enterprise leader",
  "Researcher",
  "Partner / Integrator",
  "Curious individual"
]);

const interestTypes = new Set<LeadInterestType>([
  "Private beta",
  "Demo",
  "Contact",
  "Investor conversation",
  "Partnership",
  "Healthcare cognition",
  "Narrative intelligence",
  "Research",
  "Other"
]);

const timelines = new Set(["Exploring", "This month", "This quarter", "Later"]);
const sensitivePatterns = [
  /\b\d{3}-\d{2}-\d{4}\b/,
  /\b(password|passcode|api key|private key|access token|secret token)\b/i,
  /\b(patient id|medical record|mrn|date of birth|dob)\b/i,
  /\b(diagnosis|treatment plan|prescription|medication order)\b/i
];

export type SanitizedLead = {
  name: string;
  email: string;
  organization: string;
  website: string;
  profileType: LeadProfileType;
  interestType: LeadInterestType;
  contextInterest: string;
  timeline: string;
  note: string;
  consentState: {
    safetyAccepted: boolean;
    consentTimestamp: string;
  };
  metadata: {
    sourceApp: string;
    sourceDomain: string;
    sourceRoute: string;
    sourcePath: string;
    referrer: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    ctaSource: string;
    pageTitle: string;
    deviceType: string;
    viewportClass: string;
    submittedAt: string;
  };
  routing: {
    lifecycleStage: string;
    leadQueue: string;
    inferredPersona: string;
    engagementScore: number;
    investorLikelihood: number;
    partnershipPotential: number;
    enterpriseReadiness: number;
  };
};

export type LeadValidationResult =
  | { ok: true; lead: SanitizedLead }
  | { ok: false; status: number; code: string; message: string };

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRecord : {};
}

function text(value: unknown, max = 240) {
  return sanitizeLeadText(typeof value === "string" ? value : "").slice(0, max);
}

function pickMetadata(payload: UnknownRecord) {
  const nested = asRecord(payload.metadata);
  return {
    sourceApp: text(payload.sourceApp ?? nested.sourceApp, 80) || "NarrativeIQ",
    sourceDomain: text(payload.sourceDomain ?? nested.sourceDomain, 120),
    sourceRoute: text(payload.sourceRoute ?? nested.sourceRoute, 160),
    sourcePath: text(payload.sourcePath ?? nested.sourcePath, 160),
    referrer: text(nested.referrer, 240),
    utmSource: text(nested.utmSource, 80),
    utmMedium: text(nested.utmMedium, 80),
    utmCampaign: text(nested.utmCampaign, 120),
    ctaSource: text(payload.ctaSource ?? nested.ctaSource, 120),
    pageTitle: text(nested.pageTitle, 160),
    deviceType: text(nested.deviceType, 40),
    viewportClass: text(nested.viewportClass, 40),
    submittedAt: text(payload.submittedAt ?? nested.submittedAt, 80)
  };
}

function containsSensitiveText(...values: string[]) {
  const combined = values.join("\n");
  return sensitivePatterns.some((pattern) => pattern.test(combined));
}

function looksLikeSpam(lead: Pick<SanitizedLead, "name" | "email" | "website" | "note" | "organization">) {
  const linkCount = (lead.note.match(/https?:\/\//gi) ?? []).length;
  const repeated = /(.)\1{8,}/.test(`${lead.name} ${lead.note}`);
  const disposable = /\b(mailinator|10minutemail|guerrillamail|tempmail)\./i.test(lead.email);
  const seoSpam = /\b(crypto|casino|forex|loan|backlink|viagra)\b/i.test(`${lead.organization} ${lead.website} ${lead.note}`);
  return linkCount > 2 || repeated || disposable || seoSpam;
}

export function validateLeadPayload(payload: unknown): LeadValidationResult {
  const data = asRecord(payload);
  const companyFax = text(data.companyFax, 80);
  if (companyFax) {
    return { ok: false, status: 400, code: "honeypot", message: "Submission rejected." };
  }

  const consent = asRecord(data.consentState);
  const profileType = text(data.profileType, 80) as LeadProfileType;
  const interestType = text(data.interestType, 80) as LeadInterestType;
  const timeline = text(data.timeline, 80) || "Exploring";
  const note = text(data.note ?? data.notes, 1400);
  const lead: SanitizedLead = {
    name: text(data.name, 120),
    email: text(data.email, 160).toLowerCase(),
    organization: text(data.organization, 160),
    website: text(data.website, 240),
    profileType,
    interestType,
    contextInterest: text(data.contextInterest, 120),
    timeline,
    note,
    consentState: {
      safetyAccepted: consent.safetyAccepted === true,
      consentTimestamp: text(consent.consentTimestamp, 80) || new Date().toISOString()
    },
    metadata: pickMetadata(data),
    routing: {
      lifecycleStage: inferLifecycleStage(interestType),
      leadQueue: inferLeadQueue(interestType),
      inferredPersona: inferPersona(profileType),
      ...scoreLeadSignals(profileType, interestType)
    }
  };

  if (!lead.name || !isValidEmail(lead.email)) {
    return { ok: false, status: 400, code: "invalid_contact", message: "Enter your name and a valid email." };
  }
  if (!interestTypes.has(lead.interestType) || !profileTypes.has(lead.profileType)) {
    return { ok: false, status: 400, code: "invalid_tags", message: "Select a valid interest and profile." };
  }
  if (!timelines.has(lead.timeline)) {
    return { ok: false, status: 400, code: "invalid_timeline", message: "Select a valid timeline." };
  }
  if (!lead.consentState.safetyAccepted) {
    return { ok: false, status: 400, code: "missing_consent", message: "Safety acknowledgement is required." };
  }
  if (containsSensitiveText(lead.name, lead.organization, lead.website, lead.note)) {
    return { ok: false, status: 400, code: "sensitive_content", message: "Remove sensitive clinical, credential, or confidential details." };
  }
  if (looksLikeSpam(lead)) {
    return { ok: false, status: 400, code: "spam", message: "Submission rejected." };
  }

  return { ok: true, lead };
}
