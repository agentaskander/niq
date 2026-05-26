# Global Lead Capture Standard

This standard starts in NarrativeIQ and should be reused across Askander ecosystem apps.

## Pattern

- Primary lead CTAs route to forms, not direct email links.
- Secondary fallback is visible owned-domain email text: `niq@synkos.net` for NarrativeIQ beta/demo/product leads.
- Generic fallback may use `hello@synkos.net`; `niq@askander.net` is fallback only.
- Do not use non-owned or unverified legacy domains.

## Routes

- `/beta`: private beta interest
- `/contact`: general NarrativeIQ contact
- `/request-demo`: demo and investor/product conversations

## Data Rules

- Do not collect PHI, clinical data, secrets, passwords, or confidential customer data.
- Do not store lead details in cookies or localStorage.
- Use progressive profiling: collect only enough context to route the conversation.
- Current frontend behavior is a safe placeholder unless `VITE_LEAD_ENDPOINT` is configured.

## Form Controls

- Required fields: name, email, organization, interest type.
- Optional fields: role/title, website, use case, timeline, referral source, notes.
- Required safety confirmation: business/demo interest only and no sensitive data.
- Honeypot field hidden from humans.
- Basic email format validation.
- Minimum message quality check.
- In-memory submission cooldown.
- Server/API rate-limit placeholder when `VITE_LEAD_ENDPOINT` is implemented.
- Optional Turnstile hook via `TURNSTILE_SITE_KEY`; disabled unless configured.

## Backend Plan

When backend lead capture is added, submit to `VITE_LEAD_ENDPOINT`, validate and sanitize server-side, rate-limit requests, verify Turnstile if configured, and notify `LEAD_NOTIFICATION_EMAIL` with `niq@synkos.net` as the NarrativeIQ default.

## Future CRM Architecture

TODO: centralize lead capture into a shared lead DB or CRM with source domain attribution, consent timestamp, ecosystem interest tags, lifecycle stage, deduplication by email, and cross-app progressive profiling.
