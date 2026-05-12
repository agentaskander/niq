import { universalObservations, universalSymptoms } from "./clinicalOntology";
import type { ClinicalObservation, ClinicalSymptom, ComplaintGroup, Specialty } from "../lib/types";

const symptoms = (...ids: string[]): ClinicalSymptom[] =>
  ids.map((id) => universalSymptoms.find((symptom) => symptom.id === id)).filter(Boolean) as ClinicalSymptom[];

const observations = (...ids: string[]): ClinicalObservation[] =>
  ids.map((id) => universalObservations.find((observation) => observation.id === id)).filter(Boolean) as ClinicalObservation[];

const abdominalPain: ComplaintGroup = {
  id: "abdominal-pain",
  name: "Abdominal Pain",
  symptoms: symptoms("ruq-pain", "nausea", "vomiting"),
  timingOptions: ["yesterday evening", "worsening today", "intermittent", "constant"],
  severityOptions: ["3/10", "5/10", "7/10", "9/10"],
  modifiers: ["worse after meals", "improves with rest", "worse with movement", "no clear trigger"],
  pertinentNegatives: ["fever", "chills", "chest pain", "shortness of breath", "syncope"],
  observations: observations("guarding", "warm-dry", "steady-gait"),
  interventions: ["Comfort measures offered", "Provider notified per protocol", "Patient placed in position of comfort"],
  reassessmentOptions: ["pain unchanged at reassessment", "patient resting", "symptoms documented for provider evaluation"],
  redFlags: ["severe pain", "syncope", "rigidity", "persistent vomiting"]
};

const nauseaVomiting: ComplaintGroup = {
  ...abdominalPain,
  id: "nausea-vomiting",
  name: "Nausea / Vomiting",
  symptoms: symptoms("nausea", "vomiting"),
  pertinentNegatives: ["fever", "chest pain", "shortness of breath", "blood in emesis", "syncope"],
  redFlags: ["persistent vomiting", "dehydration concern", "blood in emesis", "severe pain"]
};

const diarrhea: ComplaintGroup = {
  ...abdominalPain,
  id: "diarrhea",
  name: "Diarrhea",
  symptoms: symptoms("diarrhea", "nausea"),
  modifiers: ["watery stools reported", "after meals", "recent travel denied", "tolerating fluids"],
  pertinentNegatives: ["blood in stool", "fever", "severe abdominal pain", "syncope"],
  redFlags: ["blood in stool", "dehydration concern", "severe abdominal pain"]
};

const constipation: ComplaintGroup = {
  ...abdominalPain,
  id: "constipation",
  name: "Constipation",
  symptoms: symptoms("constipation"),
  modifiers: ["reduced bowel movement frequency", "bloating reported", "passing gas reported", "worse with meals"],
  pertinentNegatives: ["vomiting", "severe abdominal pain", "fever", "blood in stool"],
  redFlags: ["severe abdominal pain", "persistent vomiting", "rigidity"]
};

const giBleeding: ComplaintGroup = {
  ...abdominalPain,
  id: "gi-bleeding",
  name: "GI Bleeding",
  symptoms: symptoms("gi-bleeding", "dizziness"),
  modifiers: ["blood noted by patient", "dark stool reported", "one episode reported", "recurrent episodes reported"],
  pertinentNegatives: ["syncope", "chest pain", "shortness of breath", "severe abdominal pain"],
  redFlags: ["syncope", "large volume bleeding", "chest pain", "shortness of breath"]
};

const jaundiceConcern: ComplaintGroup = {
  ...abdominalPain,
  id: "jaundice",
  name: "Jaundice",
  symptoms: symptoms("jaundice", "ruq-pain", "nausea"),
  modifiers: ["yellowing reported", "dark urine reported", "after meals", "worsening today"],
  pertinentNegatives: ["fever", "chills", "confusion", "severe abdominal pain"],
  redFlags: ["confusion", "fever", "severe abdominal pain"]
};

const chestPain: ComplaintGroup = {
  id: "chest-pain",
  name: "Chest Pain",
  symptoms: symptoms("chest-pain", "sob", "dizziness"),
  timingOptions: ["started this morning", "began during activity", "intermittent", "constant"],
  severityOptions: ["mild", "moderate", "7/10", "10/10"],
  modifiers: ["worse with exertion", "improves with rest", "radiation denied", "associated nausea"],
  pertinentNegatives: ["shortness of breath", "syncope", "diaphoresis", "new weakness"],
  observations: observations("warm-dry", "oriented"),
  interventions: ["Provider notified per protocol", "Patient placed in position of comfort", "Assessment findings communicated to provider"],
  reassessmentOptions: ["symptoms unchanged", "awaiting provider direction", "patient resting"],
  redFlags: ["syncope", "severe chest pain", "shortness of breath", "diaphoresis"]
};

const respiratoryConcern: ComplaintGroup = {
  id: "respiratory-concern",
  name: "Respiratory Concern",
  symptoms: symptoms("sob", "cough"),
  timingOptions: ["started this morning", "worsened over two days", "sudden onset", "after activity"],
  severityOptions: ["mild", "moderate", "severe", "8/10 distress"],
  modifiers: ["worse with exertion", "improves with rest", "productive sputum", "dry cough"],
  pertinentNegatives: ["chest pain", "hemoptysis", "syncope", "fever", "known allergen exposure"],
  observations: observations("labored", "wheezing", "warm-dry"),
  interventions: ["Respiratory status reassessed", "Provider evaluation requested", "Position adjusted for comfort"],
  reassessmentOptions: ["work of breathing unchanged", "patient speaking in full sentences", "awaiting provider direction"],
  redFlags: ["cyanosis", "severe work of breathing", "syncope", "chest pain"]
};

const neuroChange: ComplaintGroup = {
  id: "neuro-change",
  name: "Neurologic Change",
  symptoms: symptoms("headache", "dizziness"),
  timingOptions: ["started today", "last known baseline documented", "intermittent episodes", "worsening"],
  severityOptions: ["mild", "moderate", "severe", "10/10 headache"],
  modifiers: ["worse standing", "improves lying down", "associated with nausea", "no reported trauma"],
  pertinentNegatives: ["fall", "loss of consciousness", "chest pain", "shortness of breath", "seizure activity"],
  observations: observations("oriented", "steady-gait"),
  interventions: ["Safety precautions maintained", "Provider notified per protocol", "Baseline status documented"],
  reassessmentOptions: ["no new changes reported", "requires continued observation", "awaiting provider direction"],
  redFlags: ["new weakness", "speech change", "loss of consciousness", "seizure activity"]
};

const woundConcern: ComplaintGroup = {
  id: "wound-concern",
  name: "Wound Concern",
  symptoms: symptoms("wound-pain"),
  timingOptions: ["noted during dressing change", "worsened since prior shift", "present on arrival"],
  severityOptions: ["mild", "moderate", "severe", "6/10"],
  modifiers: ["localized discomfort", "increased drainage reported", "worse with movement", "stable from prior visit"],
  pertinentNegatives: ["fever", "chills", "new numbness", "uncontrolled pain", "increased drainage"],
  observations: observations("periwound-redness", "warm-dry"),
  interventions: ["Dressing assessed", "Wound findings documented for provider review", "Patient tolerated care"],
  reassessmentOptions: ["dressing intact", "no change in discomfort", "follow-up pending"],
  redFlags: ["rapid spreading redness", "fever", "uncontrolled pain", "new numbness"]
};

const pediatricFever: ComplaintGroup = {
  id: "pediatric-fever",
  name: "Fever / Illness",
  symptoms: symptoms("poor-intake", "cough"),
  timingOptions: ["started overnight", "started today", "two days duration", "after school/daycare"],
  severityOptions: ["mild", "moderate", "high fever reported", "parent concerned"],
  modifiers: ["decreased intake", "more tired than usual", "consolable", "normal wet diapers reported"],
  pertinentNegatives: ["difficulty breathing", "lethargy", "seizure activity", "poor urine output", "neck stiffness"],
  observations: observations("consolable", "warm-dry"),
  interventions: ["Caregiver statement documented", "Provider evaluation requested", "Intake/output concerns documented"],
  reassessmentOptions: ["caregiver updated", "child remains consolable", "awaiting provider direction"],
  redFlags: ["lethargy", "difficulty breathing", "seizure activity", "poor urine output"]
};

const behavioralSafety: ComplaintGroup = {
  id: "behavioral-safety",
  name: "Behavioral Health Safety Check",
  symptoms: symptoms("safety-concern", "dizziness"),
  timingOptions: ["reported today", "during shift assessment", "after change in behavior", "ongoing concern"],
  severityOptions: ["low concern", "moderate concern", "high concern", "requires close observation"],
  modifiers: ["patient cooperative", "patient withdrawn", "support person present", "environmental stressor reported"],
  pertinentNegatives: ["acute medical complaint", "loss of consciousness", "injury reported", "substance use reported"],
  observations: observations("oriented", "warm-dry"),
  interventions: ["Safety precautions maintained", "Provider notified per protocol", "Assessment findings communicated to provider"],
  reassessmentOptions: ["patient remains cooperative", "no new safety concerns observed", "awaiting provider direction"],
  redFlags: ["active safety threat", "agitation escalation", "new confusion", "injury reported"]
};

export const specialties: Specialty[] = [
  {
    id: "ed",
    name: "Emergency Department",
    careSettings: ["ED", "triage", "rapid assessment"],
    description: "Rapid symptom capture, triage-ready timelines, and review-gated EHR copy.",
    complaintGroups: [abdominalPain, chestPain, respiratoryConcern, neuroChange]
  },
  {
    id: "gi-liver",
    name: "GI / Liver",
    careSettings: ["specialty clinic", "inpatient consult"],
    description: "Abdominal, nutrition, post-procedure, and hepatobiliary storytelling support.",
    complaintGroups: [abdominalPain, nauseaVomiting, diarrhea, constipation, giBleeding, jaundiceConcern]
  },
  {
    id: "med-surg",
    name: "Med-Surg",
    careSettings: ["inpatient", "shift handoff"],
    description: "Shift narrative consistency for pain, wounds, mobility, and reassessment.",
    complaintGroups: [abdominalPain, chestPain, woundConcern, respiratoryConcern]
  },
  {
    id: "icu",
    name: "ICU",
    careSettings: ["critical care", "escalation"],
    description: "Event-based narratives for status changes, interventions, and escalation.",
    complaintGroups: [respiratoryConcern, neuroChange]
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    careSettings: ["peds clinic", "ED", "urgent care"],
    description: "Caregiver statements, age-aware observations, and triage summaries.",
    complaintGroups: [pediatricFever, respiratoryConcern]
  },
  {
    id: "home-health",
    name: "Home Health",
    careSettings: ["home visit", "remote follow-up"],
    description: "Visit notes, safety observations, symptom changes, and follow-up context.",
    complaintGroups: [woundConcern, respiratoryConcern]
  },
  {
    id: "behavioral-health",
    name: "Behavioral Health",
    careSettings: ["inpatient", "urgent evaluation"],
    description: "Objective patient statements, safety observations, and handoff structure.",
    complaintGroups: [behavioralSafety, neuroChange]
  },
  {
    id: "cardiac",
    name: "Cardiac",
    careSettings: ["clinic", "ED", "telehealth"],
    description: "Symptom timelines and escalation documentation for cardiopulmonary concerns.",
    complaintGroups: [chestPain, respiratoryConcern]
  },
  {
    id: "respiratory",
    name: "Respiratory",
    careSettings: ["clinic", "inpatient", "telehealth"],
    description: "Breathing concern capture with reassessment and provider notification support.",
    complaintGroups: [respiratoryConcern]
  },
  {
    id: "neuro",
    name: "Neuro",
    careSettings: ["clinic", "ED", "inpatient"],
    description: "Baseline-aware neurologic symptom and observation narrative support.",
    complaintGroups: [neuroChange]
  },
  {
    id: "wound-care",
    name: "Wound Care",
    careSettings: ["clinic", "home health", "med-surg"],
    description: "Wound observations, dressing events, response, and follow-up summaries.",
    complaintGroups: [woundConcern]
  }
];

export const defaultSpecialty = specialties[0];
export const defaultComplaintGroup = defaultSpecialty.complaintGroups[0];
