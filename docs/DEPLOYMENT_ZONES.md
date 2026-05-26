# Deployment Zones

NarrativeIQ now publishes through three policy-governed zones.

## Public

- Output: `dist-public`
- Purpose: SEO, thought leadership, safe previews, sanitized product visibility
- Allowed routes: `/demo`, `/demo/healthcare-cognition`, `/beta`, `/contact`, `/request-demo`
- Root behavior: `/` redirects to `/demo` and must not render the real NarrativeIQ root app
- Forbidden routes: `/modules/*`, `/beta/*`, `/admin/*`, `/ops/*`, `/app/*`, `/lab/*`
- Command: `npm run validate:public`

## Beta

- Output: `dist-beta`
- Purpose: gated previews, investor demos, design partners, NDA review
- Allowed routes: `/beta`, `/beta/healthcare-cognition`, `/demo`, `/demo/healthcare-cognition`, `/contact`, `/request-demo`
- Root behavior: `/` redirects to `/beta` and must not render the real NarrativeIQ root app
- Forbidden routes: admin, ops, module internals, raw ontology views, route registries
- Command: `npm run validate:beta`

## Internal

- Output: `dist-internal`
- Purpose: ops, admin, ideation, ontology engineering, experiments, module internals
- Root behavior: `/` may render the real NarrativeIQ app only in this zone
- Deployment: never public deploy
- Command: `npm run validate:internal`

Every zone emits `deployment-manifest.json` with artifact hashes, route policy, timestamp, and file metadata.
