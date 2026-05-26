import type { LeadMetadata } from "../schemas/leadTypes";
import { sanitizeLeadText } from "./validation";

function getUtmParam(searchParams: URLSearchParams, key: string) {
  return sanitizeLeadText(searchParams.get(key) ?? "");
}

function viewportClass(width: number): LeadMetadata["viewportClass"] {
  if (width < 640) return "compact";
  if (width < 1280) return "standard";
  return "wide";
}

function deviceType(width: number): LeadMetadata["deviceType"] {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function captureLeadMetadata(sourceApp: string, sourceRoute: string, ctaSource?: string): LeadMetadata {
  const searchParams = new URLSearchParams(window.location.search);
  const width = window.innerWidth || 1024;
  const submittedAt = new Date().toISOString();

  return {
    sourceApp,
    sourceDomain: sanitizeLeadText(window.location.hostname),
    sourcePath: sanitizeLeadText(window.location.pathname),
    sourceRoute: sanitizeLeadText(sourceRoute),
    referrer: sanitizeLeadText(document.referrer),
    utmSource: getUtmParam(searchParams, "utm_source"),
    utmMedium: getUtmParam(searchParams, "utm_medium"),
    utmCampaign: getUtmParam(searchParams, "utm_campaign"),
    ctaSource: sanitizeLeadText(ctaSource ?? sourceRoute),
    pageTitle: sanitizeLeadText(document.title),
    deviceType: deviceType(width),
    viewportClass: viewportClass(width),
    submittedAt
  };
}
