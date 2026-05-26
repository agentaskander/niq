# Internal Deployment Boundaries

Internal deployment is for validation and internal operation only.

Contains:

- `/modules/*`
- `/admin/*`
- `/ops/*`
- `/app/*`
- ideation boards
- ontology engineering surfaces
- operational dashboards
- experiments

Policy:

- Never configure `dist-internal` as a public Cloudflare Pages output.
- Use `npm run validate:internal` for CI validation only.
- Keep internal artifacts out of public and beta publish paths.
- Treat the internal manifest as an artifact verification record, not a release approval.
