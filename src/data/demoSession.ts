import { defaultRoleScope } from "./roleScopes";
import { defaultComplaintGroup, defaultSpecialty } from "./specialties";
import type { AuditEntry, NarrativeInput } from "../lib/types";

export const demoSession: NarrativeInput = {
  role: defaultRoleScope,
  specialty: defaultSpecialty,
  complaintGroup: defaultComplaintGroup,
  selectedSymptoms: ["ruq-pain", "nausea"],
  selectedNegatives: ["fever", "chills", "chest pain", "shortness of breath"],
  observations: ["guarding", "warm-dry"],
  interventions: ["Comfort measures offered", "Provider notified per protocol"],
  selectedMode: defaultRoleScope.defaultMode,
  chiefComplaint: "right upper quadrant abdominal pain",
  onset: "yesterday evening",
  severity: "7/10",
  modifiers: ["worse after meals", "improves with rest"],
  patientStatements: ["Pain started after dinner and is worse today."],
  responseToIntervention: "Patient resting in position of comfort; pain unchanged at reassessment.",
  providerNotification: "Provider notified per protocol.",
  disposition: "Awaiting provider direction.",
  timelineEvents: [
    {
      id: "t1",
      timestamp: "18:40",
      eventType: "symptom-onset",
      sourceType: "patient-stated",
      title: "Symptom onset",
      description: "Patient reports RUQ abdominal pain beginning after dinner yesterday.",
      linkedSymptomIds: ["ruq-pain"],
      linkedObservationIds: [],
      linkedInterventionIds: [],
      linkedReassessmentIds: []
    },
    {
      id: "t2",
      timestamp: "08:10",
      eventType: "assessment",
      sourceType: "clinician-observed",
      title: "Assessment",
      description: "Pain rated 7/10 with nausea. Mild guarding observed.",
      linkedSymptomIds: ["ruq-pain", "nausea"],
      linkedObservationIds: ["guarding"],
      linkedInterventionIds: [],
      linkedReassessmentIds: []
    },
    {
      id: "t3",
      timestamp: "08:18",
      eventType: "escalation",
      sourceType: "provider-notified",
      title: "Provider notification",
      description: "Provider notified per protocol. Symptoms documented for provider evaluation.",
      linkedSymptomIds: ["ruq-pain", "nausea"],
      linkedObservationIds: ["guarding"],
      linkedInterventionIds: ["Provider notified per protocol"],
      linkedReassessmentIds: []
    },
    {
      id: "t4",
      timestamp: "08:45",
      eventType: "reassessment",
      sourceType: "reassessment",
      title: "Reassessment",
      description: "Patient resting in position of comfort. Pain unchanged.",
      linkedSymptomIds: ["ruq-pain"],
      linkedObservationIds: [],
      linkedInterventionIds: ["Comfort measures offered"],
      linkedReassessmentIds: ["Patient resting in position of comfort; pain unchanged at reassessment."]
    }
  ]
};

export const auditEntries: AuditEntry[] = [
  {
    id: "a1",
    time: "08:12",
    actor: "RN Demo",
    action: "Created Studio session",
    detail: "RN / Emergency Department / Abdominal Pain"
  },
  {
    id: "a2",
    time: "08:18",
    actor: "RN Demo",
    action: "Review gate opened",
    detail: "Review required before copy to EHR"
  },
  {
    id: "a3",
    time: "08:21",
    actor: "Charge RN Demo",
    action: "Phrase library warning acknowledged",
    detail: "No PHI storage in MVP"
  },
  {
    id: "a4",
    time: "08:22",
    actor: "RN Demo",
    action: "Copy to EHR",
    detail: "Narrative copied after review status set"
  }
];
