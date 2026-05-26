import { describe, expect, it, vi } from "vitest";
import { handleLeadRequest } from "./leadEndpoint";
import { resetLeadRateLimit } from "./leadRateLimit";

function payload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Alex Demo",
    email: "alex@example.com",
    organization: "Demo Org",
    website: "https://example.com",
    profileType: "Founder / Builder",
    interestType: "Private beta",
    timeline: "Exploring",
    notes: "Interested in a safe private beta preview.",
    consentState: { safetyAccepted: true, consentTimestamp: "2026-05-25T00:00:00.000Z" },
    metadata: {
      sourceApp: "NarrativeIQ",
      sourceDomain: "niq.synkos.net",
      sourcePath: "/beta",
      sourceRoute: "/beta",
      referrer: "",
      utmSource: "linkedin",
      utmMedium: "social",
      utmCampaign: "beta",
      ctaSource: "beta-page-primary",
      pageTitle: "NarrativeIQ Beta",
      deviceType: "desktop",
      viewportClass: "wide",
      submittedAt: "2026-05-25T00:00:00.000Z"
    },
    ...overrides
  };
}

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://niq.synkos.net/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.10", ...headers },
    body: JSON.stringify(body)
  });
}

describe("lead endpoint", () => {
  it("validates, notifies, and optionally persists safe leads", async () => {
    resetLeadRateLimit();
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const put = vi.fn().mockResolvedValue(undefined);

    const response = await handleLeadRequest(request(payload()), {
      LEAD_NOTIFICATION_EMAIL: "niq@synkos.net",
      LEAD_FROM_EMAIL: "NarrativeIQ Leads <leads@synkos.net>",
      RESEND_API_KEY: "test-resend-key",
      LEADS_KV: { put }
    });
    const json = await response.json() as { ok: boolean; persisted: boolean; notificationProvider: string };

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.persisted).toBe(true);
    expect(json.notificationProvider).toBe("resend");
    expect(fetchMock).toHaveBeenCalledWith("https://api.resend.com/emails", expect.objectContaining({ method: "POST" }));
    expect(put).toHaveBeenCalled();
  });

  it("rejects honeypot, sensitive content, and rapid repeats", async () => {
    resetLeadRateLimit();
    await expect(handleLeadRequest(request(payload({ companyFax: "bot" }), {}))).resolves.toHaveProperty("status", 400);
    await expect(handleLeadRequest(request(payload({ notes: "patient id 123 with treatment plan" }), {}))).resolves.toHaveProperty("status", 400);

    const env = { LEAD_DRY_RUN: "true" };
    for (let index = 0; index < 4; index += 1) {
      await handleLeadRequest(request(payload({ email: `alex${index}@example.com` }), { "CF-Connecting-IP": "203.0.113.20" }), env);
    }
    const limited = await handleLeadRequest(request(payload({ email: "alex4@example.com" }), { "CF-Connecting-IP": "203.0.113.20" }), env);
    expect(limited.status).toBe(429);
  });

  it("requires json post and safety consent", async () => {
    resetLeadRateLimit();
    const getResponse = await handleLeadRequest(new Request("https://niq.synkos.net/api/lead") as Request);
    expect(getResponse.status).toBe(405);

    const missingConsent = await handleLeadRequest(request(payload({ consentState: { safetyAccepted: false } })));
    expect(missingConsent.status).toBe(400);
  });
});
