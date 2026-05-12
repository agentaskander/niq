import { describe, expect, it } from "vitest";
import { detectPhi } from "./phiDetection";

describe("detectPhi", () => {
  it("detects email, phone, MRN-like strings, DOB, and address patterns", () => {
    const warnings = detectPhi("Email test@example.com phone 555-123-4567 MRN: A12345 DOB 01/02/1970 123 Main St");
    const types = warnings.map((warning) => warning.type);

    expect(types).toContain("email");
    expect(types).toContain("phone");
    expect(types).toContain("mrn");
    expect(types).toContain("dob");
    expect(types).toContain("address");
  });
});
