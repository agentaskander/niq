import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CopyToEhrButton } from "./CopyToEhrButton";
import { SafetyBanner } from "./SafetyBanner";

describe("safety UI", () => {
  it("shows the PHI warning", () => {
    render(<SafetyBanner />);
    expect(screen.getByText(/Do not enter PHI/i)).toBeInTheDocument();
  });

  it("requires review before copy to EHR", () => {
    render(<CopyToEhrButton reviewed={false} narrative="demo narrative" />);
    const button = screen.getByRole("button", { name: /review required before export/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("bg-slate-100", "text-slate-700", "border-slate-200");
    expect(button.className).not.toContain("text-white");
  });
});
