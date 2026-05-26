import type { SanitizedLead } from "./leadValidation";

export type LeadNotificationConfig = {
  to: string;
  from: string;
  resendApiKey?: string;
  dryRun?: boolean;
};

export function leadEmailSubject(lead: SanitizedLead) {
  const app = lead.metadata.sourceApp || "NarrativeIQ";
  const category = lead.interestType === "Demo" ? "Demo" : lead.interestType === "Contact" ? "Contact" : "Beta";
  return `[${app} ${category}] ${lead.profileType} - ${lead.interestType}`;
}

export function leadEmailText(lead: SanitizedLead) {
  return [
    "New NarrativeIQ lead request",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Organization: ${lead.organization || "-"}`,
    `Website: ${lead.website || "-"}`,
    `Profile: ${lead.profileType}`,
    `Interest: ${lead.interestType}`,
    `Context interest: ${lead.contextInterest || "-"}`,
    `Timeline: ${lead.timeline}`,
    `Queue: ${lead.routing.leadQueue}`,
    `Lifecycle: ${lead.routing.lifecycleStage}`,
    "",
    "Note:",
    lead.note || "-",
    "",
    "Metadata",
    `Source app: ${lead.metadata.sourceApp}`,
    `Domain: ${lead.metadata.sourceDomain || "-"}`,
    `Route: ${lead.metadata.sourceRoute || "-"}`,
    `Path: ${lead.metadata.sourcePath || "-"}`,
    `CTA: ${lead.metadata.ctaSource || "-"}`,
    `Page title: ${lead.metadata.pageTitle || "-"}`,
    `UTM: ${[lead.metadata.utmSource, lead.metadata.utmMedium, lead.metadata.utmCampaign].filter(Boolean).join(" / ") || "-"}`,
    `Referrer: ${lead.metadata.referrer || "-"}`,
    `Device: ${lead.metadata.deviceType || "-"} / ${lead.metadata.viewportClass || "-"}`,
    `Submitted: ${lead.metadata.submittedAt || lead.consentState.consentTimestamp}`,
    `Consent timestamp: ${lead.consentState.consentTimestamp}`
  ].join("\n");
}

export async function sendLeadNotification(lead: SanitizedLead, config: LeadNotificationConfig) {
  const subject = leadEmailSubject(lead);
  const text = leadEmailText(lead);

  if (config.dryRun) {
    return { delivered: false, provider: "dry-run", subject };
  }

  if (!config.resendApiKey) {
    return { delivered: false, provider: "none", subject };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      subject,
      text
    })
  });

  return { delivered: response.ok, provider: "resend", subject };
}
