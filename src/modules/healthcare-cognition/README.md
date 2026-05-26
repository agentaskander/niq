# Healthcare Cognition Lab

Healthcare Cognition Lab is a synthetic module inside the flat NarrativeIQ Vite app. It demonstrates how healthcare workflow context can be organized into cognition surfaces without PHI, diagnosis, treatment guidance, or production scoring.

## Route

- `/modules/healthcare-cognition`
- `/narrativeiq/healthcare-cognition`

## Boundary

Every data record in the module carries the safety flags:

- `syntheticOnly: true`
- `containsPHI: false`
- `clinicalAdvice: false`
- `diagnosis: false`
- `investorDemoSafe: true`

## Contents

- Advantage pillar overview
- Synthetic case explorer
- Workflow entropy dashboard
- Longitudinal timeline
- Interoperability map
- Specialty cognition explorer
- Trust and provenance layer
- Agent orchestration map
- Investor roadmap panel
