import { roleScopes } from "./roleScopes";
import { specialties } from "./specialties";
import type { NarrativeInput, TimelineEvent } from "../lib/types";

export type DemoScenario = {
  id: string;
  title: string;
  description: string;
  roleCoverage: ScenarioRoleCoverage[];
  clinicalSetting: string;
  acuity: ScenarioAcuity;
  frequency: ScenarioFrequency;
  input: NarrativeInput;
};

export type ScenarioRoleCoverage = "Nursing" | "Provider" | "SOAP" | "SBAR" | "Handoff" | "Triage" | "Telehealth" | "Advanced";
export type ScenarioAcuity = "low" | "moderate" | "high";
export type ScenarioFrequency = "high" | "medium" | "low";

type ScenarioMetadata = {
  roleCoverage: ScenarioRoleCoverage[];
  clinicalSetting: string;
  acuity: ScenarioAcuity;
  frequency: ScenarioFrequency;
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
  linkedObservationIds: string[] = [],
  linkedInterventionIds: string[] = [],
  linkedReassessmentIds: string[] = []
): TimelineEvent => ({
  id,
  timestamp,
  eventType: sourceType,
  sourceType,
  title,
  description,
  linkedSymptomIds,
  linkedObservationIds,
  linkedInterventionIds,
  linkedReassessmentIds
});

function scenario(
  id: string,
  title: string,
  description: string,
  roleId: string,
  specialtyId: string,
  complaintGroupId: string,
  metadata: ScenarioMetadata,
  patch: Partial<NarrativeInput>
): DemoScenario {
  const selectedRole = role(roleId);
  const selectedSpecialty = specialty(specialtyId);
  const selectedGroup = group(specialtyId, complaintGroupId);
  return {
    id,
    title,
    description,
    ...metadata,
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
  scenario("gi-abdominal-pain", "GI abdominal pain", "Common urgent-care and ED abdominal pain workflow with RUQ symptoms and reassessment.", "rn", "gi-liver", "abdominal-pain", {
    roleCoverage: ["Nursing", "Provider", "SOAP", "SBAR", "Handoff", "Triage", "Advanced"],
    clinicalSetting: "Urgent care / ED",
    acuity: "moderate",
    frequency: "high"
  }, {
    selectedSymptoms: ["ruq-pain", "nausea"],
    timelineEvents: [
      event("gi1", "07:42", "patient-stated", "RUQ pain began after meal", "Patient reports RUQ pain beginning after meal yesterday.", ["ruq-pain"]),
      event("gi2", "07:50", "symptom-change", "Nausea worsened", "Patient reports nausea worsened this morning.", ["nausea"]),
      event("gi3", "07:55", "clinician-observed", "Mild guarding observed", "Mild guarding observed; skin warm and dry.", ["ruq-pain"], ["guarding", "warm-dry"]),
      event("gi4", "08:10", "provider-notified", "Provider notified", "Provider notified per protocol.", ["ruq-pain", "nausea"], ["guarding"], ["Provider notified per protocol"])
    ]
  }),
  scenario("chest-pain", "Chest pain", "High-risk urgent evaluation workflow with chest discomfort, negatives, and escalation-ready documentation.", "urgent-care", "cardiac", "chest-pain", {
    roleCoverage: ["Provider", "SOAP", "SBAR", "Triage", "Advanced"],
    clinicalSetting: "Urgent care / ED",
    acuity: "high",
    frequency: "high"
  }, {
    selectedSymptoms: ["chest-pain", "dizziness"],
    selectedMode: "provider"
  }),
  scenario("shortness-of-breath", "Shortness of breath", "Respiratory concern with intervention, reassessment, and escalation-aware handoff.", "rn", "respiratory", "respiratory-concern", {
    roleCoverage: ["Nursing", "Provider", "SBAR", "Handoff", "Triage", "Telehealth", "Advanced"],
    clinicalSetting: "Clinic / ED / inpatient",
    acuity: "high",
    frequency: "high"
  }, {
    selectedSymptoms: ["sob", "cough"],
    timelineEvents: [
      event("sob1", "11:05", "patient-stated", "Breathing concern", "Patient reports shortness of breath worse with exertion.", ["sob"]),
      event("sob2", "11:12", "intervention", "Comfort positioning", "Position adjusted for comfort.", ["sob"], [], ["Position adjusted for comfort."])
    ]
  }),
  scenario("headache-dizziness", "Headache / dizziness", "Neuro timeline with baseline-aware observations and red-flag review.", "np-pa", "neuro", "headache-dizziness", {
    roleCoverage: ["Provider", "SOAP", "SBAR", "Triage", "Telehealth", "Advanced"],
    clinicalSetting: "Primary care / urgent care",
    acuity: "moderate",
    frequency: "high"
  }, {}),
  scenario("pediatric-fever", "Pediatric fever", "Caregiver statement, intake context, and pediatric triage concern.", "urgent-care", "pediatrics", "pediatric-fever", {
    roleCoverage: ["Nursing", "Provider", "SOAP", "SBAR", "Triage", "Telehealth"],
    clinicalSetting: "Pediatrics / urgent care",
    acuity: "moderate",
    frequency: "high"
  }, {}),
  scenario("back-pain", "Back pain", "Common musculoskeletal visit with function, mobility, and safety context.", "urgent-care", "med-surg", "medsurg-pain", {
    roleCoverage: ["Nursing", "Provider", "SOAP", "Handoff", "Triage"],
    clinicalSetting: "Primary care / urgent care",
    acuity: "moderate",
    frequency: "high"
  }, {}),
  scenario("sore-throat-uri", "Sore throat / URI symptoms", "High-volume respiratory workflow for URI symptoms and follow-up guidance.", "telehealth", "respiratory", "cough", {
    roleCoverage: ["Provider", "SOAP", "Triage", "Telehealth"],
    clinicalSetting: "Primary care / telehealth",
    acuity: "low",
    frequency: "high"
  }, {
    selectedMode: "telehealth"
  }),
  scenario("uti-symptoms", "UTI symptoms", "High-volume urinary symptom workflow using general symptom capture and follow-up context.", "urgent-care", "ed", "ed-abdominal-pain", {
    roleCoverage: ["Provider", "SOAP", "Triage", "Telehealth"],
    clinicalSetting: "Primary care / urgent care",
    acuity: "moderate",
    frequency: "high"
  }, {
    chiefComplaint: "urinary symptoms"
  }),
  scenario("rash-allergic-reaction", "Rash / allergic reaction", "Skin concern workflow with symptom timing, exposure context, and escalation review.", "urgent-care", "pediatrics", "peds-rash", {
    roleCoverage: ["Nursing", "Provider", "SOAP", "SBAR", "Triage", "Telehealth"],
    clinicalSetting: "Primary care / urgent care",
    acuity: "moderate",
    frequency: "high"
  }, {}),
  scenario("nausea-vomiting-diarrhea", "Nausea / vomiting / diarrhea", "GI intake workflow for hydration, symptom course, and reassessment.", "rn", "gi-liver", "nausea-vomiting", {
    roleCoverage: ["Nursing", "Provider", "SOAP", "SBAR", "Triage", "Telehealth"],
    clinicalSetting: "Primary care / urgent care",
    acuity: "moderate",
    frequency: "high"
  }, {}),
  scenario("minor-injury-fall", "Minor injury / fall", "Injury workflow for mechanism, mobility, pain reassessment, and safety review.", "rn", "ed", "ed-trauma", {
    roleCoverage: ["Nursing", "Provider", "SOAP", "SBAR", "Handoff", "Triage"],
    clinicalSetting: "Urgent care / ED",
    acuity: "moderate",
    frequency: "high"
  }, {}),
  scenario("wound-follow-up", "Wound follow-up", "Clinic wound follow-up with dressing status, drainage observations, and reassessment.", "rn", "wound-care", "wound-concern", {
    roleCoverage: ["Nursing", "Provider", "SOAP", "Handoff", "Advanced"],
    clinicalSetting: "Wound clinic",
    acuity: "moderate",
    frequency: "medium"
  }, {}),
  scenario("diabetes-follow-up", "Diabetes follow-up", "Longitudinal chronic-care visit using general symptom and medication context.", "np-pa", "cardiac", "hypertension-concern", {
    roleCoverage: ["Provider", "SOAP", "Telehealth", "Advanced"],
    clinicalSetting: "Primary care",
    acuity: "low",
    frequency: "high"
  }, {
    chiefComplaint: "diabetes follow-up",
    patientStatements: ["Reports diabetes follow-up with medication and home monitoring questions."]
  }),
  scenario("hypertension-follow-up", "Hypertension follow-up", "Longitudinal blood pressure follow-up with medication and risk review.", "np-pa", "cardiac", "hypertension-concern", {
    roleCoverage: ["Provider", "SOAP", "Telehealth", "Advanced"],
    clinicalSetting: "Primary care",
    acuity: "low",
    frequency: "high"
  }, {}),
  scenario("medication-refill-reconciliation", "Medication refill / reconciliation", "Medication workflow for refill context, adherence, reconciliation, and follow-up.", "telehealth", "home-health", "home-health-medication", {
    roleCoverage: ["Nursing", "Provider", "SOAP", "Telehealth", "Advanced"],
    clinicalSetting: "Primary care / telehealth",
    acuity: "low",
    frequency: "high"
  }, {
    selectedMode: "telehealth"
  }),
  scenario("post-discharge-follow-up", "Post-discharge follow-up", "Continuity workflow for open issues, pending actions, and follow-up needs.", "home-health", "home-health", "home-health-safety", {
    roleCoverage: ["Nursing", "Provider", "Handoff", "Telehealth", "Advanced"],
    clinicalSetting: "Home health / clinic",
    acuity: "moderate",
    frequency: "medium"
  }, {}),
  scenario("home-health-wound", "Home health wound follow-up", "Home visit wound concern and care coordination.", "home-health", "home-health", "wound-concern", {
    roleCoverage: ["Nursing", "Handoff", "Telehealth", "Advanced"],
    clinicalSetting: "Home health",
    acuity: "moderate",
    frequency: "medium"
  }, {}),
  scenario("fall-risk-mobility-check", "Fall risk / mobility check", "Home or inpatient mobility workflow with safety observations and handoff detail.", "home-health", "home-health", "home-health-mobility", {
    roleCoverage: ["Nursing", "Provider", "SBAR", "Handoff", "Advanced"],
    clinicalSetting: "Home health / med-surg",
    acuity: "moderate",
    frequency: "medium"
  }, {}),
  scenario("pain-reassessment", "Pain reassessment", "Nursing reassessment workflow for response, timing, and continuity.", "rn", "med-surg", "medsurg-pain", {
    roleCoverage: ["Nursing", "SBAR", "Handoff", "Advanced"],
    clinicalSetting: "Med-surg",
    acuity: "moderate",
    frequency: "medium"
  }, {}),
  scenario("medication-administration-issue", "Medication administration issue", "Nursing workflow for medication concern, provider communication, and follow-up.", "rn", "home-health", "home-health-medication", {
    roleCoverage: ["Nursing", "SBAR", "Handoff", "Advanced"],
    clinicalSetting: "Med-surg / home health",
    acuity: "moderate",
    frequency: "medium"
  }, {}),
  scenario("anxiety-panic-symptoms", "Anxiety / panic symptoms", "Behavioral and urgent-care workflow for patient-reported distress and safety context.", "telehealth", "behavioral-health", "anxiety-distress", {
    roleCoverage: ["Nursing", "Provider", "SOAP", "SBAR", "Triage", "Telehealth"],
    clinicalSetting: "Urgent care / telehealth",
    acuity: "moderate",
    frequency: "high"
  }, {
    selectedMode: "telehealth"
  }),
  scenario("behavioral-safety", "Behavioral health safety check", "Objective safety handoff and provider notification workflow.", "rn", "behavioral-health", "behavioral-safety", {
    roleCoverage: ["Nursing", "Provider", "SBAR", "Handoff", "Triage", "Telehealth", "Advanced"],
    clinicalSetting: "Behavioral health",
    acuity: "high",
    frequency: "medium"
  }, {}),
  scenario("telehealth-uri-medication-question", "Telehealth URI / medication question", "Remote visit workflow for URI symptoms, medication question, and follow-up constraints.", "telehealth", "respiratory", "cough", {
    roleCoverage: ["Provider", "SOAP", "Telehealth", "Triage"],
    clinicalSetting: "Telehealth",
    acuity: "low",
    frequency: "high"
  }, {
    selectedMode: "telehealth",
    patientStatements: ["Reports URI symptoms and a medication question during remote visit."]
  }),
  scenario("icu-respiratory-change", "ICU respiratory change", "ICU respiratory change with escalation-ready timeline.", "rn", "icu", "icu-respiratory", {
    roleCoverage: ["Nursing", "Provider", "SBAR", "Handoff", "Advanced"],
    clinicalSetting: "ICU",
    acuity: "high",
    frequency: "low"
  }, {
    timelineEvents: [
      event("icu1", "02:15", "clinician-observed", "Respiratory change", "Labored respirations noted during reassessment.", ["sob"], ["labored"], [], ["Labored respirations noted during reassessment."]),
      event("icu2", "02:18", "provider-notified", "Escalation", "Provider notified per protocol.", ["sob"], ["labored"], ["Provider notified per protocol"])
    ]
  })
];
