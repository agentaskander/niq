import { roleScopes } from "./roleScopes";
import { specialties } from "./specialties";
import type { NarrativeInput, TimelineEvent } from "../lib/types";

export type DemoScenario = {
  id: string;
  title: string;
  description: string;
  input: NarrativeInput;
};

const role = (id: string) => roleScopes.find((item) => item.id === id) ?? roleScopes[0];
const specialty = (id: string) => specialties.find((item) => item.id === id) ?? specialties[0];
const group = (specialtyId: string, groupId: string) =>
  specialty(specialtyId).complaintGroups.find((item) => item.id === groupId) ?? specialty(specialtyId).complaintGroups[0];

const event = (
  id: string,
  timestamp: string,
  sourceType: TimelineEvent["sourceType"],
  title: string,
  description: string,
  linkedSymptomIds: string[] = [],
  linkedObservationIds: string[] = []
): TimelineEvent => ({
  id,
  timestamp,
  eventType: sourceType,
  sourceType,
  title,
  description,
  linkedSymptomIds,
  linkedObservationIds
});

function scenario(
  id: string,
  title: string,
  description: string,
  roleId: string,
  specialtyId: string,
  complaintGroupId: string,
  patch: Partial<NarrativeInput>
): DemoScenario {
  const selectedRole = role(roleId);
  const selectedSpecialty = specialty(specialtyId);
  const selectedGroup = group(specialtyId, complaintGroupId);
  return {
    id,
    title,
    description,
    input: {
      role: selectedRole,
      specialty: selectedSpecialty,
      complaintGroup: selectedGroup,
      selectedSymptoms: selectedGroup.symptoms.slice(0, 2).map((symptom) => symptom.id),
      selectedNegatives: selectedGroup.pertinentNegatives.slice(0, 3),
      observations: selectedGroup.observations.slice(0, 2).map((observation) => observation.id),
      interventions: selectedGroup.interventions.slice(0, 1),
      timelineEvents: [],
      selectedMode: selectedRole.defaultMode,
      chiefComplaint: selectedGroup.name.toLowerCase(),
      onset: selectedGroup.timingOptions[0],
      severity: selectedGroup.severityOptions[1] ?? selectedGroup.severityOptions[0],
      modifiers: selectedGroup.modifiers.slice(0, 2),
      patientStatements: [`Reports ${selectedGroup.name.toLowerCase()} with change from baseline.`],
      responseToIntervention: selectedGroup.reassessmentOptions[0] ?? "",
      providerNotification: selectedGroup.interventions.find((item) => item.toLowerCase().includes("provider")) ?? "",
      disposition: "Awaiting provider direction.",
      ...patch
    }
  };
}

export const demoScenarios: DemoScenario[] = [
  scenario("gi-abdominal-pain", "GI abdominal pain", "ED abdominal pain story with RUQ symptoms and reassessment.", "rn", "gi-liver", "abdominal-pain", {
    selectedSymptoms: ["ruq-pain", "nausea"],
    timelineEvents: [
      event("gi1", "07:42", "patient-stated", "RUQ pain began after meal", "Patient reports RUQ pain beginning after meal yesterday.", ["ruq-pain"]),
      event("gi2", "07:50", "symptom-change", "Nausea worsened", "Patient reports nausea worsened this morning.", ["nausea"]),
      event("gi3", "07:55", "clinician-observed", "Mild guarding observed", "Mild guarding observed; skin warm and dry.", ["ruq-pain"], ["guarding", "warm-dry"]),
      event("gi4", "08:10", "provider-notified", "Provider notified", "Provider notified per protocol.", ["ruq-pain"])
    ]
  }),
  scenario("chest-pain", "Chest pain", "Urgent evaluation workflow with chest discomfort and negatives.", "urgent-care", "cardiac", "chest-pain", {
    selectedSymptoms: ["chest-pain", "dizziness"],
    selectedMode: "provider"
  }),
  scenario("shortness-of-breath", "Shortness of breath", "Respiratory concern with intervention and reassessment.", "rn", "respiratory", "respiratory-concern", {
    selectedSymptoms: ["sob", "cough"],
    timelineEvents: [
      event("sob1", "11:05", "patient-stated", "Breathing concern", "Patient reports shortness of breath worse with exertion.", ["sob"]),
      event("sob2", "11:12", "intervention", "Comfort positioning", "Position adjusted for comfort.", ["sob"])
    ]
  }),
  scenario("neuro-headache", "Neuro headache/dizziness", "Neuro timeline with baseline-aware observations.", "np-pa", "neuro", "neuro-change", {}),
  scenario("pediatric-fever", "Pediatric fever", "Caregiver statement and pediatric intake concern.", "urgent-care", "pediatrics", "pediatric-fever", {}),
  scenario("home-health-wound", "Home health wound follow-up", "Home visit wound concern and care coordination.", "home-health", "home-health", "wound-concern", {}),
  scenario("behavioral-safety", "Behavioral health safety check", "Objective safety handoff and provider notification workflow.", "rn", "behavioral-health", "behavioral-safety", {}),
  scenario("icu-respiratory-change", "ICU respiratory change", "ICU respiratory change with escalation-ready timeline.", "rn", "icu", "respiratory-concern", {
    timelineEvents: [
      event("icu1", "02:15", "clinician-observed", "Respiratory change", "Labored respirations noted during reassessment.", ["sob"], ["labored"]),
      event("icu2", "02:18", "provider-notified", "Escalation", "Provider notified per protocol.", ["sob"])
    ]
  })
];
