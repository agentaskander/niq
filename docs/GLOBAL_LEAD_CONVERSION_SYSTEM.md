# Global Lead Conversion System

The Askander ecosystem lead system is standardized around `packages/shared-leads`.

## Architecture

Apps import shared infrastructure and configure it. They should not fork form implementations.

Shared package:

- `components/`: progressive form, guided tiles, success state, trust signals
- `hooks/`: metadata, scoring, soft personalization
- `lib/`: attribution, metadata, routing, scoring, validation
- `schemas/`: lead ontology and app config types
- `styles/`: shared conversion system CSS

NarrativeIQ now consumes this shared package as the reference implementation.

## UX Principles

- Premium, calm, intelligent, invitation-oriented
- Low-friction required fields
- Progressive disclosure
- High trust without compliance-wall copy
- Public-safe language
- No technical implementation leakage in customer UI

Avoid generic SaaS spam aesthetics, giant blank forms, fake urgency, fake customer claims, and invasive tracking.

## Lead Ontology

Core fields:

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

User fields:

- `name`
- `email`
- `organization`
- `website`
- `notes`

Metadata:

- `referrer`
- `utmSource`
- `utmMedium`
- `utmCampaign`
- `pageTitle`
- `deviceType`
- `viewportClass`

Future hooks:

- `ecosystemInterests`
- `inferredPersona`
- `engagementScore`
- `investorLikelihood`
- `partnershipPotential`
- `enterpriseReadiness`

## Personalization

Profile selection lightly adjusts supporting copy:

- Founder / Builder: integration and ecosystem potential
- Investor: emerging narrative intelligence layer
- Healthcare operator: workflow-aware narrative cognition
- Enterprise leader: governed intelligence for complex operating environments
- Researcher: research-grade narrative intelligence patterns
- Partner / Integrator: interoperability and partnership potential
- Curious individual: clear public-safe preview

## CTA Adaptation

Interest selection adjusts CTA copy:

- Private beta: Request beta access
- Demo: Request a guided preview
- Investor: Start investor conversation
- Partnership: Explore partnership
- Research: Join research preview

## Safety

The shared form requires a safety acknowledgement and prohibits PHI, clinical data, passwords, secrets, and confidential customer data. Fallback email must use owned domains only.

## Session Persistence

Session draft persistence may use `sessionStorage` only. Do not use cookies or `localStorage` for lead details. Drafts clear after submission.

## Migration Readiness

Each app should configure:

- `sourceApp`
- fallback email and subject
- trust chips
- proof points
- default interest
- CTA source
- success links
- app-specific route targets

Prepared apps: NarrativeIQ, SoulGraph, SynkHeart, YANAMSA, CraftSure, PipeFlow, Web4 sites, and future ontology/platform properties.
