export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeLeadText(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export function validateOptionalNote(notes: string) {
  return notes.trim().length === 0 || notes.trim().length >= 8;
}
