# Architecture

The module is intentionally local and frontend-only.

## Layers

1. `data/`: synthetic cases, workflow signals, interoperability nodes, specialties, and roadmap records.
2. `ontology/`: public-safe ontology categories and relations.
3. `engines/`: deterministic helpers that compute display summaries from synthetic inputs.
4. `components/`: reusable visualization panels.
5. `HealthcareCognitionHome.tsx`: route-level composition.

## Runtime

No external APIs are called. No user input is persisted. No clinical inference is performed.

## Routing

The flat app route switch imports `HealthcareCognitionHome` through `src/modules/healthcare-cognition/src/index.ts`.
