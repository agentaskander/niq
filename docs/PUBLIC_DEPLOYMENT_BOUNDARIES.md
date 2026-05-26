# Public Deployment Boundaries

Public deployment is limited to safe product visibility.

Allowed:

- `/demo`
- `/demo/healthcare-cognition`
- `/beta`
- `/contact`
- `/request-demo`
- Public-safe demo content
- Sanitized Healthcare Cognition preview
- lead capture forms without sensitive-data collection

Root behavior:

- `/` redirects to `/demo`
- `/` must not render the real NarrativeIQ app, module index, internal nav, lab/admin/ops/ideation surfaces, or app shell routes

Forbidden:

- `/modules/*`
- `/beta/*`
- `/admin/*`
- `/ops/*`
- `/app/*`
- `/lab/*`
- ontology schema dumps
- prompts or prompt-chain references
- embeddings references
- routing policies or route registries
- scoring formulas
- secrets, tokens, keys, or `.env` content

Cloudflare Pages:

- Build command: `npm run validate:public`
- Output directory: `dist-public`
