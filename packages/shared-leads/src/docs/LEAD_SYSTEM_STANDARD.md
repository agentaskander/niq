# Shared Lead System Standard

`packages/shared-leads` is the reusable conversion layer for Askander ecosystem apps. Apps import the shared form, schemas, metadata helpers, scoring hooks, and styles, then configure branding, trust copy, interest options, and success links.

## Core Model

The normalized lead model includes:

- `leadId`
- `sourceApp`
- `sourceDomain`
- `sourceRoute`
- `ctaSource`
- `interestType`
- `profileType`
- `lifecycleStage`
- `submittedAt`
- `consentState`
- `name`
- `email`
- `organization`
- `website`
- `notes`
- `metadata`
- `ecosystemInterests`
- `inferredPersona`
- `engagementScore`
- `investorLikelihood`
- `partnershipPotential`
- `enterpriseReadiness`

## UX Rules

- Forms are primary; fallback email is secondary.
- Required fields stay minimal: name, email, interest, safety acknowledgement.
- Organization, website, and notes are optional.
- Optional context uses guided tiles before free text.
- No PHI, secrets, passwords, clinical data, or confidential customer data.
- No fake urgency, fake metrics, or fake customers.

## Attribution

The package captures route, domain, referrer, UTM fields, CTA source, page title, device type, viewport class, app identifier, and submission timestamp.

No fingerprinting, cookies, or invasive tracking are used.

## Session Drafts

Draft persistence is session-only through `sessionStorage`. It exists for accidental refresh/navigation continuity and clears after submission. It is not tracking and must not use cookies or `localStorage` for lead details.

## Future Hooks

Scoring and routing helpers are intentionally lightweight. They provide placeholders for future CRM queues, ecosystem relationship graph enrichment, design-partner review, investor routing, partnership review, enterprise readiness, and research cohort routing.
