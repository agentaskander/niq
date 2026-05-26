# Publishing Governance

The CI/CD pipeline follows the OpenClaw/orchestrator model: publishing is a governed orchestration step, not a raw build.

## Gates

- Build with an explicit `VITE_DEPLOY_ZONE`
- Validate route boundaries with `scripts/validate-routes.mjs`
- Validate IP and secret boundaries with `scripts/validate-boundaries.mjs`
- Validate secret leakage with `scripts/validate-secrets.mjs`
- Generate a deployment manifest with file hashes and an aggregate artifact hash
- Stage publish artifacts through `publish:public` or `publish:beta`
- Preserve rollback checkpoints under `.deployment-artifacts`

## Commands

- Public: `npm run validate:public`
- Beta: `npm run validate:beta`
- Internal validation only: `npm run validate:internal`
- Public artifact staging: `npm run publish:public`
- Beta artifact staging: `npm run publish:beta`
- Public rollback: `npm run rollback:public`
- Beta rollback: `npm run rollback:beta`

No command in this repository deploys to production infrastructure. Cloudflare Pages should run validation commands and publish only the matching output directory.
