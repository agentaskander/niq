import type { LeadAppConfig } from "../schemas/leadTypes";

const commonTrustChips = ["Governance-aware AI systems", "Interoperability-first architecture", "Cross-domain intelligence layer"];

export const ecosystemLeadConfigs: Record<string, LeadAppConfig> = {
  NarrativeIQ: {
    sourceApp: "NarrativeIQ",
    fallbackEmail: "niq@synkos.net",
    fallbackSubject: "NarrativeIQ Private Beta Interest",
    defaultInterest: "Private beta",
    trustChips: ["Narrative cognition research", "Workflow intelligence", ...commonTrustChips],
    proofPoints: ["Early design-partner conversations", "Public-safe conceptual preview"],
    successLinks: [
      { label: "Explore Healthcare Cognition", path: "/demo/healthcare-cognition" },
      { label: "View Public Modules", path: "/demo#public-module-previews" },
      { label: "Read Articles", path: "/articles" }
    ]
  },
  SoulGraph: {
    sourceApp: "SoulGraph",
    fallbackEmail: "hello@synkos.net",
    fallbackSubject: "SoulGraph Interest",
    defaultInterest: "Private beta",
    trustChips: ["Relationship intelligence", ...commonTrustChips],
    proofPoints: ["Public-safe conceptual preview", "No private graph data requested"]
  },
  SynkHeart: {
    sourceApp: "SynkHeart",
    fallbackEmail: "hello@synkos.net",
    fallbackSubject: "SynkHeart Interest",
    defaultInterest: "Private beta",
    trustChips: ["Human-centered systems", ...commonTrustChips],
    proofPoints: ["Invitation-oriented preview", "No confidential data requested"]
  },
  YANAMSA: {
    sourceApp: "YANAMSA",
    fallbackEmail: "hello@synkos.net",
    fallbackSubject: "YANAMSA Interest",
    defaultInterest: "Contact",
    trustChips: ["Cultural intelligence", ...commonTrustChips],
    proofPoints: ["Public-safe inquiry", "No sensitive data requested"]
  },
  CraftSure: {
    sourceApp: "CraftSure",
    fallbackEmail: "hello@synkos.net",
    fallbackSubject: "CraftSure Interest",
    defaultInterest: "Demo",
    trustChips: ["Operational quality", ...commonTrustChips],
    proofPoints: ["Demo-oriented inquiry", "No confidential project data requested"]
  },
  PipeFlow: {
    sourceApp: "PipeFlow",
    fallbackEmail: "hello@synkos.net",
    fallbackSubject: "PipeFlow Interest",
    defaultInterest: "Demo",
    trustChips: ["Workflow intelligence", ...commonTrustChips],
    proofPoints: ["Pipeline preview", "No customer secrets requested"]
  },
  Web4: {
    sourceApp: "Web4",
    fallbackEmail: "hello@synkos.net",
    fallbackSubject: "Web4 Ecosystem Interest",
    defaultInterest: "Partnership",
    trustChips: ["Ecosystem coordination", ...commonTrustChips],
    proofPoints: ["Partnership-oriented inquiry", "No private ecosystem data requested"]
  }
};
