export type PhiWarning = {
  type: "email" | "phone" | "mrn" | "dob" | "address";
  message: string;
};

const detectors: Array<{ type: PhiWarning["type"]; pattern: RegExp; message: string }> = [
  { type: "email", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, message: "Possible email detected. Keep optional contact separate from clinical workflow data." },
  { type: "phone", pattern: /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/, message: "Possible phone number detected. Remove patient identifiers from demo notes." },
  { type: "mrn", pattern: /\b(?:MRN|medical record)\s*#?:?\s*[A-Z0-9-]{5,}\b/i, message: "Possible MRN detected. Do not enter medical record numbers." },
  { type: "dob", pattern: /\b(?:DOB|date of birth)\s*[:#]?\s*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/i, message: "Possible date of birth detected. Use de-identified timing only." },
  { type: "address", pattern: /\b\d{2,5}\s+[A-Za-z0-9.'-]+\s+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b/i, message: "Possible street address detected. Remove addresses from demo content." }
];

export function detectPhi(text: string): PhiWarning[] {
  return detectors
    .filter((detector) => detector.pattern.test(text))
    .map(({ type, message }) => ({ type, message }));
}
