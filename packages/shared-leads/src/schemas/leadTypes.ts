export type LeadInterestType =
  | "Private beta"
  | "Demo"
  | "Contact"
  | "Investor conversation"
  | "Partnership"
  | "Healthcare cognition"
  | "Narrative intelligence"
  | "Research"
  | "Other";

export type LeadProfileType =
  | "Founder / Builder"
  | "Investor"
  | "Healthcare operator"
  | "Enterprise leader"
  | "Researcher"
  | "Partner / Integrator"
  | "Curious individual";

export type LeadLifecycleStage = "new" | "beta_waitlist" | "demo_requested" | "investor_review" | "partnership_review" | "research_preview";

export type ConsentState = {
  safetyAccepted: boolean;
  consentTimestamp: string;
};

export type LeadMetadata = {
  sourceApp: string;
  sourceDomain: string;
  sourcePath: string;
  sourceRoute: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  ctaSource: string;
  pageTitle: string;
  deviceType: "mobile" | "tablet" | "desktop";
  viewportClass: "compact" | "standard" | "wide";
  submittedAt: string;
};

export type LeadPayload = {
  leadId: string;
  sourceApp: string;
  sourceDomain: string;
  sourceRoute: string;
  ctaSource: string;
  interestType: LeadInterestType;
  profileType: LeadProfileType;
  timeline: string;
  lifecycleStage: LeadLifecycleStage;
  submittedAt: string;
  consentState: ConsentState;
  name: string;
  email: string;
  organization: string;
  website: string;
  notes: string;
  metadata: LeadMetadata;
  ecosystemInterests: string[];
  inferredPersona: string;
  engagementScore: number;
  investorLikelihood: number;
  partnershipPotential: number;
  enterpriseReadiness: number;
};

export type LeadAppConfig = {
  sourceApp: string;
  fallbackEmail: string;
  fallbackSubject: string;
  defaultInterest: LeadInterestType;
  trustChips: string[];
  proofPoints: string[];
  successLinks?: Array<{ label: string; path: string }>;
};
