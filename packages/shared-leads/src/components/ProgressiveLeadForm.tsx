import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { parseAttributionTags } from "../lib/attribution";
import { inferLeadQueue } from "../lib/routing";
import { sanitizeLeadText, isValidEmail, validateOptionalNote } from "../lib/validation";
import { createLeadId, defaultInterestTypes, defaultProfileTypes, defaultSharedLeadConfig } from "../schemas/leadSchema";
import type { LeadAppConfig, LeadInterestType, LeadPayload, LeadProfileType } from "../schemas/leadTypes";
import { useLeadMetadata } from "../hooks/useLeadMetadata";
import { useLeadPersonalization } from "../hooks/useLeadPersonalization";
import { useLeadScoring } from "../hooks/useLeadScoring";
import { LeadInterestTiles } from "./LeadInterestTiles";
import { LeadProgressiveSection } from "./LeadProgressiveSection";
import { LeadSuccessState } from "./LeadSuccessState";
import { LeadTrustSignals } from "./LeadTrustSignals";
import "../styles/lead-system.css";

type ProgressiveLeadFormProps = {
  config?: Partial<LeadAppConfig>;
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaSource?: string;
  sourceRoute: string;
  onNavigate?: (path: string) => void;
};

type LeadStatus = "idle" | "submitting" | "submitted";
type LeadDraft = Pick<LeadPayload, "name" | "email" | "organization" | "website" | "notes" | "interestType" | "profileType"> & {
  timeline: string;
};

const timelines = ["Exploring", "This month", "This quarter", "Later"];
let lastSubmissionAt = 0;

function fallbackMailto(email: string, subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject).replace(/%20/g, "%20")}`;
}

function leadEndpoint() {
  return import.meta.env.VITE_LEAD_ENDPOINT || (globalThis as { __NIQ_LEAD_ENDPOINT__?: string }).__NIQ_LEAD_ENDPOINT__;
}

function draftKey(sourceApp: string, sourceRoute: string) {
  return `shared-lead-draft:${sourceApp}:${sourceRoute}`;
}

function readSessionDraft(key: string): Partial<LeadDraft> {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? "{}") as Partial<LeadDraft>;
  } catch {
    return {};
  }
}

function writeSessionDraft(key: string, draft: LeadDraft) {
  try {
    sessionStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // Session-only draft continuity is a UX helper, not tracking or required storage.
  }
}

function clearSessionDraft(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Ignore storage failures; submission state is authoritative.
  }
}

export function ProgressiveLeadForm({
  config,
  eyebrow = "NarrativeIQ lead capture",
  title = "Explore the future of narrative intelligence.",
  description = "Request a focused preview of NarrativeIQ's cognition layer for workflow intelligence, continuity, and governed AI experiences.",
  ctaLabel,
  ctaSource,
  sourceRoute,
  onNavigate
}: ProgressiveLeadFormProps) {
  const leadConfig = { ...defaultSharedLeadConfig, ...config };
  const storageKey = draftKey(leadConfig.sourceApp, sourceRoute);
  const initialDraft = useMemo(() => readSessionDraft(storageKey), [storageKey]);
  const [name, setName] = useState(initialDraft.name ?? "");
  const [email, setEmail] = useState(initialDraft.email ?? "");
  const [organization, setOrganization] = useState(initialDraft.organization ?? "");
  const [interestType, setInterestType] = useState<LeadInterestType>(initialDraft.interestType ?? leadConfig.defaultInterest);
  const [profileType, setProfileType] = useState<LeadProfileType>(initialDraft.profileType ?? "Founder / Builder");
  const [website, setWebsite] = useState(initialDraft.website ?? "");
  const [timeline, setTimeline] = useState(initialDraft.timeline ?? timelines[0]);
  const [notes, setNotes] = useState(initialDraft.notes ?? "");
  const [safetyAccepted, setSafetyAccepted] = useState(false);
  const [companyFax, setCompanyFax] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<LeadStatus>("idle");
  const [optionalOpen, setOptionalOpen] = useState(false);
  const metadataForSubmit = useLeadMetadata(leadConfig.sourceApp, sourceRoute, ctaSource);
  const scoring = useLeadScoring(profileType, interestType);
  const personalization = useLeadPersonalization(profileType, interestType);
  const emailHref = fallbackMailto(leadConfig.fallbackEmail, leadConfig.fallbackSubject);
  const submitLabel = ctaLabel ?? personalization.ctaLabel;

  useEffect(() => {
    if (status === "submitted") return;
    writeSessionDraft(storageKey, { name, email, organization, website, notes, interestType, profileType, timeline });
  }, [email, interestType, name, notes, organization, profileType, status, storageKey, timeline, website]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const now = Date.now();

    if (companyFax) return;
    if (now - lastSubmissionAt < 20_000) {
      setError("Please wait a moment before submitting another request.");
      return;
    }
    if (!name.trim() || !isValidEmail(email)) {
      setError("Enter your name and a valid email to continue.");
      return;
    }
    if (!validateOptionalNote(notes)) {
      setError("Add a little more context or leave the optional section blank.");
      return;
    }
    if (!safetyAccepted) {
      setError("Confirm that this form will not include sensitive clinical data, passwords, or confidential customer data.");
      return;
    }

    const metadata = metadataForSubmit();
    const submittedAt = metadata.submittedAt;
    const payload: LeadPayload & { leadQueue: string } = {
      leadId: createLeadId(leadConfig.sourceApp),
      sourceApp: leadConfig.sourceApp,
      sourceDomain: metadata.sourceDomain,
      sourceRoute: metadata.sourceRoute,
      ctaSource: metadata.ctaSource,
      interestType,
      profileType,
      timeline,
      lifecycleStage: scoring.lifecycleStage,
      submittedAt,
      consentState: {
        safetyAccepted: true,
        consentTimestamp: submittedAt
      },
      name: sanitizeLeadText(name),
      email: sanitizeLeadText(email),
      organization: sanitizeLeadText(organization),
      website: sanitizeLeadText(website),
      notes: sanitizeLeadText(notes),
      metadata,
      ecosystemInterests: parseAttributionTags(leadConfig.sourceApp, metadata.utmSource, metadata.utmCampaign),
      inferredPersona: scoring.inferredPersona,
      engagementScore: scoring.engagementScore,
      investorLikelihood: scoring.investorLikelihood,
      partnershipPotential: scoring.partnershipPotential,
      enterpriseReadiness: scoring.enterpriseReadiness,
      leadQueue: inferLeadQueue(interestType)
    };

    setStatus("submitting");
    setError("");
    lastSubmissionAt = now;

    const endpoint = leadEndpoint();
    if (!endpoint) {
      setStatus("idle");
      setError("Submission endpoint is not configured. Prefer email for now.");
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        setStatus("idle");
        setError("Submission endpoint did not accept the request. Prefer email for now.");
        return;
      }
    } catch {
      setStatus("idle");
      setError("Submission endpoint is unavailable. Prefer email for now.");
      return;
    }

    clearSessionDraft(storageKey);
    setStatus("submitted");
  };

  return (
    <section className="lead-capture-shell">
      <div className="lead-capture-layout">
        <div className="lead-capture-copy">
          <LeadTrustSignals proofPoints={leadConfig.proofPoints} trustChips={leadConfig.trustChips} />
          <p className="section-kicker">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lead-capture-lede">{description}</p>
          <p className="lead-personalized-copy">{personalization.subcopy}</p>
        </div>

        <form className="lead-form-card" onSubmit={submit}>
          <label className="hidden" aria-hidden="true">
            Company fax
            <input autoComplete="off" name="companyFax" tabIndex={-1} value={companyFax} onChange={(event) => setCompanyFax(event.target.value)} />
          </label>

          {status === "submitted" ? (
            <LeadSuccessState fallbackEmail={leadConfig.fallbackEmail} fallbackMailto={emailHref} links={leadConfig.successLinks} onNavigate={onNavigate} sourceApp={leadConfig.sourceApp} />
          ) : (
            <>
              <div className="lead-form-heading">
                <span>Private preview request</span>
                <strong>Start with a few quick details.</strong>
              </div>

              <div className="lead-fast-fields">
                <label>
                  Name
                  <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
                </label>
                <label>
                  Email
                  <input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>
                <label>
                  Organization
                  <input autoComplete="organization" value={organization} onChange={(event) => setOrganization(event.target.value)} />
                </label>
              </div>
              <LeadInterestTiles label="What are you interested in?" onChange={setInterestType} options={defaultInterestTypes} value={interestType} />

              <LeadProgressiveSection onToggle={() => setOptionalOpen((value) => !value)} open={optionalOpen}>
                <LeadInterestTiles label="What best describes you?" onChange={setProfileType} options={defaultProfileTypes} value={profileType} />
                <LeadInterestTiles label="Timeline" onChange={setTimeline} options={timelines} value={timeline} />
                <div className="lead-optional-grid">
                  <label>
                    Website
                    <input inputMode="url" value={website} onChange={(event) => setWebsite(event.target.value)} />
                  </label>
                </div>
                <label>
                  {personalization.optionalPrompt}
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
                </label>
              </LeadProgressiveSection>

              <label className="lead-safety-check">
                <input checked={safetyAccepted} onChange={(event) => setSafetyAccepted(event.target.checked)} type="checkbox" />
                <span>Business/demo interest only. Do not submit sensitive clinical data, passwords, or confidential customer data.</span>
              </label>

              {error && <p className="lead-error">{error}</p>}

              <button className="lead-submit-button" disabled={status === "submitting"} type="submit">
                {status === "submitting" ? "Requesting..." : submitLabel} <ArrowRight size={18} />
              </button>

              <p className="lead-email-fallback">Prefer email? <a href={emailHref}>{leadConfig.fallbackEmail}</a></p>

              <div className="lead-ops-note">
                <LockKeyhole size={14} />
                <span>Your request is used only to evaluate beta, demo, or partnership fit.</span>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
