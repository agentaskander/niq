import type { ClinicalObservation, ClinicalSymptom, ComplaintGroup, NarrativeClause, Specialty } from "../lib/types";

const now = "2026-05-11T00:00:00.000Z";

const symptom = (id: string, label: string, category: string, redFlag = false): ClinicalSymptom => ({
  id,
  label,
  category,
  synonyms: [label.toLowerCase()],
  redFlag,
  applicableRoles: ["rn", "np-pa", "physician", "urgent-care", "telehealth", "home-health"],
  createdAt: now,
  updatedAt: now
});

const observation = (id: string, label: string, category: string): ClinicalObservation => ({
  id,
  label,
  category
});

const baseModifiers = [
  "worse with activity",
  "improves with rest",
  "intermittent",
  "constant",
  "worsening today",
  "unchanged from baseline",
  "after meals",
  "no clear trigger"
];

const baseNegatives = [
  "fever",
  "chills",
  "chest pain",
  "shortness of breath",
  "syncope",
  "new weakness",
  "confusion",
  "uncontrolled pain"
];

const baseObservations = [
  observation("warm-dry", "skin warm and dry", "general"),
  observation("oriented", "alert and oriented", "neuro"),
  observation("steady-gait", "ambulates with steady gait", "mobility"),
  observation("no-distress", "no acute distress observed", "general"),
  observation("speaking-full", "speaking in full sentences", "respiratory"),
  observation("needs-assist", "requires assistance with activity", "mobility")
];

const baseInterventions = [
  "Comfort measures offered",
  "Patient placed in position of comfort",
  "Provider notified per protocol",
  "Assessment findings communicated to provider",
  "Safety precautions maintained",
  "Response documented for reassessment"
];

const baseReassessment = [
  "symptoms unchanged at reassessment",
  "patient resting in position of comfort",
  "response pending reassessment",
  "provider direction pending",
  "continued monitoring documented"
];

const baseRedFlags = [
  "syncope",
  "severe or worsening symptoms",
  "new confusion",
  "unstable appearance",
  "provider escalation required"
];

const timingOptions = [
  "started today",
  "started yesterday",
  "worsened over two days",
  "sudden onset",
  "gradual onset",
  "recurrent episode",
  "after activity",
  "during reassessment"
];

const severityOptions = ["mild", "moderate", "severe", "3/10", "5/10", "7/10", "9/10", "10/10"];

function narrativeClauses(specialtyId: string, groupId: string, name: string): NarrativeClause[] {
  return (["nursing", "advanced", "soap", "sbar", "handoff"] as const).map((mode, index) => ({
    id: `${groupId}-clause-${mode}`,
    clauseId: `${groupId}-clause-${mode}`,
    mode,
    role: mode === "soap" ? "physician" : "all",
    roleScope: mode === "soap" ? "physician" : "all",
    specialtyId,
    complaintGroupId: groupId,
    triggerItemIds: [],
    text: `${name} details documented from selected symptoms, observations, timeline events, interventions, and reassessment only.`,
    safetyLevel: index === 2 ? "review" : "approved",
    blockedForRoles: mode === "soap" ? ["rn"] : [],
    version: "1.0.0"
  } satisfies NarrativeClause));
}

function makeSymptoms(groupId: string, labels: string[], category: string): ClinicalSymptom[] {
  return labels.slice(0, 10).map((label, index) => symptom(`${groupId}-${index + 1}`, label, category, index >= 8));
}

const requiredSymptoms: Record<string, ClinicalSymptom[]> = {
  "abdominal-pain": [
    symptom("ruq-pain", "RUQ pain", "pain"),
    symptom("nausea", "nausea", "associated"),
    symptom("vomiting", "vomiting", "associated")
  ],
  "nausea-vomiting": [symptom("nausea", "nausea", "associated"), symptom("vomiting", "vomiting", "associated")],
  diarrhea: [symptom("diarrhea", "diarrhea", "gi")],
  constipation: [symptom("constipation", "constipation", "gi")],
  "gi-bleeding": [symptom("gi-bleeding", "GI bleeding concern", "gi", true), symptom("dizziness", "dizziness", "neuro")],
  jaundice: [symptom("jaundice", "jaundice concern", "gi", true), symptom("ruq-pain", "RUQ pain", "pain")],
  "chest-pain": [symptom("chest-pain", "chest pain", "cardiac", true), symptom("sob", "shortness of breath", "respiratory"), symptom("dizziness", "dizziness", "neuro")],
  "shortness-of-breath": [symptom("sob", "shortness of breath", "respiratory"), symptom("cough", "cough", "respiratory")],
  "respiratory-concern": [symptom("sob", "shortness of breath", "respiratory"), symptom("cough", "cough", "respiratory")],
  "neuro-change": [symptom("headache", "headache", "neuro"), symptom("dizziness", "dizziness", "neuro")],
  "wound-concern": [symptom("wound-pain", "localized wound pain", "wound")],
  "pediatric-fever": [symptom("poor-intake", "decreased intake", "pediatrics"), symptom("cough", "cough", "respiratory")],
  "behavioral-safety": [symptom("safety-concern", "safety concern", "behavioral")]
};

function group(id: string, specialtyId: string, name: string, category: string, labels: string[], related: string[] = []): ComplaintGroup {
  const seeded = requiredSymptoms[id] ?? [];
  const generated = makeSymptoms(id, labels, category).filter((item) => !seeded.some((existing) => existing.id === item.id || existing.label === item.label));
  const symptoms = [...seeded, ...generated].slice(0, 10);
  return {
    id,
    specialtyId,
    name,
    description: `${name} workflow pack for structured clinical story capture.`,
    symptoms,
    timingOptions,
    severityOptions,
    modifiers: baseModifiers,
    pertinentNegatives: baseNegatives,
    observations: [
      ...baseObservations,
      observation(`${id}-obs-1`, `${name.toLowerCase()} pattern observed`, category),
      observation(`${id}-obs-2`, `${name.toLowerCase()} status documented`, category)
    ].slice(0, 8),
    interventions: baseInterventions,
    reassessmentOptions: baseReassessment,
    reassessmentPrompts: baseReassessment,
    redFlags: baseRedFlags,
    escalationPrompts: baseRedFlags,
    narrativeClauses: narrativeClauses(specialtyId, id, name),
    roleRestrictions: {
      rn: ["diagnosed with", "order", "prescribe"],
      physician: [],
      "np-pa": ["final diagnosis without review"],
      "urgent-care": [],
      telehealth: ["complete physical exam language"],
      "home-health": ["acute treatment orders"]
    },
    relatedComplaintGroups: related
  };
}

const labelBank = {
  gi: ["abdominal pain", "RUQ pain", "nausea", "vomiting", "bloating", "cramping", "poor appetite", "reflux symptoms", "dark stool", "yellowing concern", "diarrhea", "constipation"],
  cardiac: ["chest pressure", "palpitations", "dizziness", "near syncope", "edema", "fatigue", "shortness of breath", "diaphoresis", "activity intolerance", "blood pressure concern", "radiating discomfort", "orthopnea"],
  respiratory: ["shortness of breath", "cough", "wheezing", "chest tightness", "sputum change", "fatigue", "activity intolerance", "orthopnea", "nasal congestion", "pleuritic discomfort", "hypoxia concern", "feverish feeling"],
  neuro: ["headache", "dizziness", "weakness", "numbness", "vision change", "speech concern", "balance change", "confusion", "tremor", "near fall", "memory concern", "seizure-like activity"],
  wound: ["localized wound pain", "drainage", "odor concern", "periwound redness", "swelling", "bleeding", "dressing saturation", "delayed healing", "warmth", "new numbness", "mobility pain", "skin breakdown"],
  peds: ["fever reported", "decreased intake", "cough", "vomiting", "diarrhea", "rash", "ear pain", "sore throat", "fatigue", "fewer wet diapers", "irritability", "sleep change"],
  behavioral: ["safety concern", "anxiety", "withdrawn behavior", "agitation", "sleep disturbance", "poor intake", "medication concern", "support need", "tearfulness", "environmental stressor", "confusion", "substance concern"],
  general: ["pain", "fatigue", "weakness", "mobility concern", "intake concern", "sleep change", "dizziness", "nausea", "skin concern", "safety concern", "medication concern", "functional decline"]
};

function specialty(id: string, name: string, description: string, careSettings: string[], groups: Array<[string, string, keyof typeof labelBank]>): Specialty {
  return {
    id,
    name,
    description,
    careSettings,
    version: "1.0.0",
    updatedAt: now,
    complaintGroups: groups.map(([groupId, groupName, category], index) => group(groupId, id, groupName, category, labelBank[category], groups.filter((_, i) => i !== index).map(([other]) => other)))
  };
}

export const specialties: Specialty[] = [
  specialty("gi-liver", "GI / Liver", "Abdominal, hepatobiliary, bowel-pattern, and GI symptom workflow packs.", ["specialty clinic", "inpatient consult", "ED"], [
    ["abdominal-pain", "Abdominal Pain", "gi"],
    ["nausea-vomiting", "Nausea / Vomiting", "gi"],
    ["diarrhea", "Diarrhea", "gi"],
    ["constipation", "Constipation", "gi"],
    ["gi-bleeding", "GI Bleeding", "gi"],
    ["jaundice", "Jaundice", "gi"]
  ]),
  specialty("cardiac", "Cardiac", "Cardiopulmonary symptom timelines, escalation cues, and handoff-ready narratives.", ["clinic", "ED", "telehealth"], [
    ["chest-pain", "Chest Pain", "cardiac"],
    ["palpitations", "Palpitations", "cardiac"],
    ["syncope-near-syncope", "Syncope / Near Syncope", "cardiac"],
    ["edema", "Edema", "cardiac"],
    ["hypertension-concern", "Hypertension Concern", "cardiac"]
  ]),
  specialty("respiratory", "Respiratory", "Breathing concern capture with reassessment, interventions, and escalation prompts.", ["clinic", "inpatient", "telehealth"], [
    ["shortness-of-breath", "Shortness of Breath", "respiratory"],
    ["respiratory-concern", "Respiratory Concern", "respiratory"],
    ["cough", "Cough", "respiratory"],
    ["wheezing", "Wheezing", "respiratory"],
    ["chest-tightness", "Chest Tightness", "respiratory"],
    ["hypoxia", "Hypoxia", "respiratory"]
  ]),
  specialty("neuro", "Neuro", "Baseline-aware neurologic symptom and observation narrative support.", ["clinic", "ED", "inpatient"], [
    ["neuro-change", "Neurologic Change", "neuro"],
    ["headache-dizziness", "Headache / Dizziness", "neuro"],
    ["weakness-numbness", "Weakness / Numbness", "neuro"],
    ["vision-speech-change", "Vision / Speech Change", "neuro"],
    ["fall-risk", "Fall Risk", "neuro"]
  ]),
  specialty("ed", "Emergency Department", "Rapid symptom capture, triage-ready timelines, and review-gated EHR copy.", ["ED", "triage", "rapid assessment"], [
    ["ed-abdominal-pain", "ED Abdominal Pain", "gi"],
    ["ed-chest-pain", "ED Chest Pain", "cardiac"],
    ["ed-respiratory", "ED Respiratory Concern", "respiratory"],
    ["ed-neuro", "ED Neurologic Change", "neuro"],
    ["ed-trauma", "Trauma / Injury", "general"]
  ]),
  specialty("med-surg", "Med-Surg", "Shift narrative consistency for pain, wounds, mobility, and reassessment.", ["inpatient", "shift handoff"], [
    ["medsurg-pain", "Pain Reassessment", "general"],
    ["medsurg-mobility", "Mobility / Fall Risk", "general"],
    ["medsurg-wound", "Wound / Skin Concern", "wound"],
    ["medsurg-respiratory", "Respiratory Change", "respiratory"],
    ["medsurg-intake", "Intake / Output Concern", "general"]
  ]),
  specialty("icu", "ICU", "Event-based narratives for status changes, interventions, and escalation.", ["critical care", "escalation"], [
    ["icu-respiratory", "ICU Respiratory Change", "respiratory"],
    ["icu-neuro", "ICU Neuro Change", "neuro"],
    ["icu-hemodynamic", "Hemodynamic Concern", "cardiac"],
    ["icu-sedation", "Sedation / Agitation", "behavioral"],
    ["icu-skin", "ICU Skin / Device Concern", "wound"]
  ]),
  specialty("pediatrics", "Pediatrics", "Caregiver statements, age-aware observations, and triage summaries.", ["peds clinic", "ED", "urgent care"], [
    ["pediatric-fever", "Fever / Illness", "peds"],
    ["peds-respiratory", "Pediatric Respiratory", "respiratory"],
    ["peds-gi", "Pediatric GI Symptoms", "gi"],
    ["peds-rash", "Rash / Skin Concern", "peds"],
    ["peds-intake", "Intake / Hydration", "peds"]
  ]),
  specialty("home-health", "Home Health", "Visit notes, safety observations, symptom changes, adherence, and follow-up context.", ["home visit", "remote follow-up"], [
    ["home-health-wound", "Home Wound Follow-up", "wound"],
    ["home-health-safety", "Home Safety Check", "general"],
    ["home-health-mobility", "Mobility / Function", "general"],
    ["home-health-medication", "Medication Adherence", "general"],
    ["home-health-respiratory", "Home Respiratory Check", "respiratory"]
  ]),
  specialty("behavioral-health", "Behavioral Health", "Objective patient statements, safety observations, and handoff structure.", ["inpatient", "urgent evaluation", "telehealth"], [
    ["behavioral-safety", "Behavioral Health Safety Check", "behavioral"],
    ["anxiety-distress", "Anxiety / Distress", "behavioral"],
    ["agitation", "Agitation / Escalation", "behavioral"],
    ["sleep-intake", "Sleep / Intake Change", "behavioral"],
    ["support-needs", "Support / Resource Need", "behavioral"]
  ]),
  specialty("wound-care", "Wound Care", "Wound observations, dressing events, response, and follow-up summaries.", ["clinic", "home health", "med-surg"], [
    ["wound-concern", "Wound Concern", "wound"],
    ["pressure-injury", "Pressure Injury", "wound"],
    ["dressing-change", "Dressing Change", "wound"],
    ["drainage-odor", "Drainage / Odor", "wound"],
    ["skin-breakdown", "Skin Breakdown", "wound"]
  ])
];

export const defaultSpecialty = specialties.find((item) => item.id === "gi-liver") ?? specialties[0];
export const defaultComplaintGroup = defaultSpecialty.complaintGroups.find((item) => item.id === "abdominal-pain") ?? defaultSpecialty.complaintGroups[0];
