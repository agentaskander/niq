import { sendLeadNotification } from "./leadNotification";
import { persistSafeLead, type SafeLeadStore } from "./leadPersistence";
import { checkLeadRateLimit, rateLimitKey } from "./leadRateLimit";
import { validateLeadPayload } from "./leadValidation";

export type LeadEndpointEnv = {
  LEAD_NOTIFICATION_EMAIL?: string;
  LEAD_FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
  LEAD_DRY_RUN?: string;
  TURNSTILE_SECRET_KEY?: string;
  LEADS_KV?: SafeLeadStore;
};

type LeadRequest = {
  method: string;
  headers: Headers;
  json: () => Promise<unknown>;
};

const maxBodyBytes = 24_000;

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(init.headers ?? {})
    }
  });
}

function requestIp(headers: Headers) {
  return headers.get("CF-Connecting-IP") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function contentLength(headers: Headers) {
  const raw = headers.get("content-length");
  return raw ? Number.parseInt(raw, 10) : 0;
}

async function verifyTurnstile(token: string, ip: string, secret?: string) {
  if (!secret) return true;
  if (!token) return false;
  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  if (ip !== "unknown") body.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const result = await response.json() as { success?: boolean };
  return result.success === true;
}

export async function handleLeadRequest(request: LeadRequest, env: LeadEndpointEnv = {}) {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
  }
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return jsonResponse({ ok: false, error: "json_required" }, { status: 415 });
  }
  if (contentLength(request.headers) > maxBodyBytes) {
    return jsonResponse({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const validation = validateLeadPayload(payload);
  if (!validation.ok) {
    return jsonResponse({ ok: false, error: validation.code, message: validation.message }, { status: validation.status });
  }

  const ip = requestIp(request.headers);
  const ipRate = checkLeadRateLimit(rateLimitKey(ip));
  const emailRate = checkLeadRateLimit(rateLimitKey(ip, validation.lead.email));
  if (!ipRate.allowed || !emailRate.allowed) {
    const retryAfter = Math.max(ipRate.retryAfterSeconds, emailRate.retryAfterSeconds);
    return jsonResponse({ ok: false, error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
  }

  const turnstileToken = typeof (payload as Record<string, unknown>).turnstileToken === "string" ? (payload as Record<string, string>).turnstileToken : "";
  const turnstileOk = await verifyTurnstile(turnstileToken, ip, env.TURNSTILE_SECRET_KEY);
  if (!turnstileOk) {
    return jsonResponse({ ok: false, error: "turnstile_failed" }, { status: 400 });
  }

  const notification = await sendLeadNotification(validation.lead, {
    to: env.LEAD_NOTIFICATION_EMAIL || "niq@synkos.net",
    from: env.LEAD_FROM_EMAIL || "NarrativeIQ Leads <niq@synkos.net>",
    resendApiKey: env.RESEND_API_KEY,
    dryRun: env.LEAD_DRY_RUN === "true"
  });
  const persistence = await persistSafeLead(validation.lead, env.LEADS_KV);

  if (!notification.delivered && env.LEAD_DRY_RUN !== "true") {
    return jsonResponse({ ok: false, error: "notification_unavailable" }, { status: 503 });
  }

  return jsonResponse({
    ok: true,
    leadQueue: validation.lead.routing.leadQueue,
    notificationProvider: notification.provider,
    persisted: persistence.persisted
  });
}
