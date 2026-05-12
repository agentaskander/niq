# NarrativeIQ Studio

Structured clinical narratives at the speed of care.

NarrativeIQ Studio is a clinical narrative workflow platform for nurses, NPs, PAs, physicians, urgent care, telehealth, and home health. It is not a generic AI scribe. The core workflow is:

Symptoms -> Patient Story Timeline -> Narrative Modes -> Review Gate -> Copy to EHR

## Architecture

### Clinical Story Engine

- Universal symptom ontology in `src/data/clinicalOntology.ts`
- Patient Story Timeline with linked symptoms and observations
- Event graph fields on every timeline event
- Symptom-to-narrative mapping
- Timeline-to-note generation

### Role + Scope Layer

Role scopes live in `src/data/roleScopes.ts`:

- RN / bedside nurse
- NP / PA
- Physician
- Urgent care
- Telehealth
- Home health

Each scope defines allowed modes, restricted language, default mode, safety disclosure, and whether assessment/plan draft sections are allowed.

### Narrative Mode Layer

Modes live in `src/data/narrativeModes.ts`:

- Bedside Nursing Note
- Advanced Clinical Narrative
- Provider Progress Note
- SOAP Note
- SBAR
- Handoff
- Triage Note
- Telehealth Note

The deterministic MVP generator is `generateNarrative(input): NarrativeOutput` in `src/lib/narrativeEngine.ts`.

### Safety + Governance Layer

- Review required before copy/export
- PHI warning visible in the Studio
- No autonomous diagnosis
- No treatment orders
- Copy-to-EHR only
- Mock audit log
- Approved phrase library and blocked RN language safeguards
- Client-side PHI warnings for email, phone, MRN-like strings, DOB patterns, and street-address-like text

### Workflow Capture Layer

The demo stores de-identified workflow telemetry locally in `localStorage` through `src/lib/workflowCapture.ts`.

Captured objects:

- `ClinicalStorySession`
- `WorkflowEvent`
- `NarrativeRevision`
- `OntologyUsageStats`
- `BetaFeedback`

Captured behavior includes role selection, specialty selection, symptom selection, timeline additions, narrative mode changes, narrative edits, review completion, copy-to-EHR events, time to first narrative, time to copy, and demo completion.

No backend is required for the demo. Future backend persistence should mirror these objects in a governed database with tenant isolation, audit controls, and PHI-safe policies.

## Safety Rules

Blocked RN examples:

- diagnosed with
- consistent with cholecystitis
- order ultrasound
- start antibiotics
- prescribe
- rule out MI

Safer alternatives:

- symptoms documented for provider evaluation
- provider notified per protocol
- further evaluation deferred to licensed provider
- assessment findings communicated to provider

Provider modes can show assessment and plan sections only as draft placeholders with clinician review required.

## Nurse Adoption Plan

The app includes a dedicated nurse adoption page at `/app/adoption`.

Plan:

- Start with nurse pain, not hospital AI hype
- 5-nurse beta cohort
- ED, med-surg, ICU, home health, urgent care
- 10 real-world mock scenarios per nurse
- Measure time to narrative
- Measure perceived confidence
- Measure copy/edit rate
- Capture "would you use this next shift?"
- Record testimonials with permission
- Build specialty packs from nurse feedback
- Create nurse champion referral loop

Adoption funnel:

1. Watch 30-second demo
2. Try sample scenario
3. Build first patient story
4. Copy narrative
5. Invite coworker
6. Join beta cohort
7. Team pilot

## Routes

- `/` marketing page
- `/demo` opens the Studio demo
- `/app` NarrativeIQ Studio
- `/app/new-session` NarrativeIQ Studio
- `/app/library` specialty library
- `/app/admin` mock metrics dashboard
- `/app/adoption` nurse adoption plan
- `/app/settings` governance and integration settings

## Running The Usable Demo

1. Open `/app/new-session`.
2. Select or preload a demo scenario.
3. Select role, specialty, and complaint group.
4. Tap symptoms, negatives, observations, interventions, timing, severity, and modifiers.
5. Add timeline events.
6. Switch narrative modes.
7. Edit the final narrative if needed.
8. Check the Review Gate.
9. Copy to EHR.
10. Submit optional beta feedback.

The demo includes seeded scenarios for GI abdominal pain, chest pain, shortness of breath, neuro headache/dizziness, pediatric fever, home health wound follow-up, behavioral health safety check, and ICU respiratory change.

## Local-Only Storage Note

Workflow data is stored in browser `localStorage` for MVP/demo purposes. It is not sent to a backend. Optional beta contact email is stored separately from workflow session records.

## No-PHI Demo Policy

Do not enter names, DOB, MRN, address, phone, email, exact facility, room number, insurance, or raw patient identifiers. The UI warns users if obvious PHI-like patterns are detected.

## Trade-Secret Architecture


Protected assets include the Clinical Story Engine, specialty ontology, Narrative Transformation Engine, Clinical Story Workflow Dataset, adoption dataset, and prompt/template library.

Do not publish these docs, expose them in marketing pages, or reveal ontology/scoring details beyond demo-safe subsets.

## Setup

```bash
npm install
npm run dev
```

Validation:

```bash
npm run validate
```

## Future EHR Integration

The MVP only copies reviewed text to the clipboard. A production EHR path should add authentication, authorization, review attestations, export logs, template governance, and health-system approval before any submission workflow.

## Future AI Integration

The current version has no OpenAI dependency. Future AI can be introduced behind the `generateNarrative(input): NarrativeOutput` boundary with approved prompts, role scope checks, safety filters, audit logs, and clinician review.

## Future BAA/HIPAA Pathway

Before PHI handling, the product needs enterprise identity, BAA coverage, HIPAA-aligned logging, data retention controls, access controls, incident response procedures, and security review.
