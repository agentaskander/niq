# NarrativeIQ Lead Endpoint Deployment

NarrativeIQ uses a private Cloudflare Pages Function for MQL capture at `/api/lead`.

The public GitHub artifact repo must continue to receive only `dist-public/`. Do not copy `functions/`, `packages/`, `src/`, `docs/`, or backend source into the public artifact repo.

## Endpoint

- Route: `/api/lead`
- Runtime: Cloudflare Pages Functions
- Source: `functions/api/lead.ts`
- Shared server logic: `packages/shared-leads/src/server/`

## Required Environment Variables

- `VITE_LEAD_ENDPOINT=/api/lead`
- `LEAD_NOTIFICATION_EMAIL=niq@synkos.net`
- `LEAD_FROM_EMAIL=<verified sender on owned domain>`
- `RESEND_API_KEY=<Resend API key>`

## Optional Environment Variables

- `LEAD_DRY_RUN=true` for local/staging endpoint testing without sending email
- `TURNSTILE_SECRET_KEY=<Cloudflare Turnstile secret>` to enable Turnstile verification
- `LEADS_KV=<Cloudflare KV binding>` to persist safe MQL rows

## Validation Rules

The endpoint accepts JSON `POST` requests only. It validates and sanitizes:

- name
- email
- organization
- website
- profile type
- interest type
- context interest
- timeline
- note
- consent state
- source metadata

The endpoint rejects honeypot submissions, malformed contact data, missing consent, oversized payloads, rapid repeated submissions, obvious spam, credential-like content, sensitive clinical details, and confidential customer data.

## Email Provider

Resend is the initial provider because it can be called directly from a Cloudflare runtime with `fetch`.

The provider is abstracted in `packages/shared-leads/src/server/leadNotification.ts` so Postmark, SendGrid, MailChannels, or a queue-based notifier can be added later without changing frontend forms.

## Persistence

Email notification is the primary production path. Optional persistence uses a safe KV-style `put` binding and stores only sanitized MQL fields. No customer secrets, clinical details, files, or private ontology content should ever be stored by this endpoint.

## Local Testing

Run the app with an endpoint configured:

```bash
VITE_LEAD_ENDPOINT=/api/lead npm run dev
```

For local function testing, run the private Pages project with equivalent environment variables and `LEAD_DRY_RUN=true`.

## Public/Private Boundary

The backend is private source. Public deployment remains artifact-only:

1. Build and validate `dist-public/`.
2. Copy only `dist-public/` into the public artifact repo.
3. Never publish `functions/`, `packages/`, backend code, internal app routes, ontology engineering assets, scoring internals, or environment files to public GitHub.
