export function parseAttributionTags(sourceApp: string, utmSource: string, utmCampaign: string) {
  return [sourceApp, utmSource, utmCampaign].filter(Boolean).map((item) => item.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
}
