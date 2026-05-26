# Beta Deployment Boundaries

Beta deployment supports confidential preview workflows without exposing internal implementation assets.

Allowed:

- `/beta`
- `/beta/healthcare-cognition`
- `/demo`
- `/demo/healthcare-cognition`
- gated preview copy and NDA-oriented product discussion

Root behavior:

- `/` redirects to `/beta`
- `/` must not render the real NarrativeIQ app, module index, internal nav, lab/admin/ops/ideation surfaces, or app shell routes

Forbidden:

- admin routes
- ops routes
- module internals
- ideation boards
- raw ontology schemas or dumps
- prompt chains
- embeddings strategy
- scoring formulas
- internal route registries
- secrets, tokens, keys, or `.env` content

Cloudflare Pages or protected hosting:

- Build command: `npm run validate:beta`
- Output directory: `dist-beta`
