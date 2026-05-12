import type { ClinicalObservation, ClinicalSymptom } from "../lib/types";

export const universalSymptoms: ClinicalSymptom[] = [
  { id: "ruq-pain", label: "RUQ pain", category: "pain", synonyms: ["right upper quadrant pain"] },
  { id: "nausea", label: "nausea", category: "associated", synonyms: ["queasy"] },
  { id: "vomiting", label: "vomiting", category: "associated", synonyms: ["emesis"] },
  { id: "sob", label: "shortness of breath", category: "respiratory", synonyms: ["dyspnea"] },
  { id: "cough", label: "cough", category: "respiratory", synonyms: ["coughing"] },
  { id: "headache", label: "headache", category: "neuro", synonyms: ["head pain"] },
  { id: "dizziness", label: "dizziness", category: "neuro", synonyms: ["lightheaded"] },
  { id: "wound-pain", label: "localized wound pain", category: "wound", synonyms: ["wound discomfort"] },
  { id: "poor-intake", label: "decreased intake", category: "pediatrics", synonyms: ["poor appetite"] }
  ,{ id: "chest-pain", label: "chest pain", category: "cardiac", synonyms: ["chest discomfort"] }
  ,{ id: "diarrhea", label: "diarrhea", category: "gi", synonyms: ["loose stools"] }
  ,{ id: "constipation", label: "constipation", category: "gi", synonyms: ["infrequent stool"] }
  ,{ id: "gi-bleeding", label: "GI bleeding concern", category: "gi", synonyms: ["blood in stool"] }
  ,{ id: "jaundice", label: "jaundice concern", category: "gi", synonyms: ["yellowing"] }
  ,{ id: "safety-concern", label: "safety concern", category: "behavioral", synonyms: ["safety check"] }
];

export const universalObservations: ClinicalObservation[] = [
  { id: "guarding", label: "mild guarding observed", category: "abdominal" },
  { id: "warm-dry", label: "skin warm and dry", category: "general" },
  { id: "labored", label: "labored respirations", category: "respiratory" },
  { id: "wheezing", label: "wheezing noted", category: "respiratory" },
  { id: "oriented", label: "alert and oriented", category: "neuro" },
  { id: "periwound-redness", label: "periwound redness", category: "wound" },
  { id: "consolable", label: "consolable with caregiver", category: "pediatrics" },
  { id: "steady-gait", label: "ambulates with steady gait", category: "mobility" }
];
