import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricBar } from "./MetricBar";

describe("MetricBar", () => {
  it.each([
    [31, "31%"],
    [56, "56%"],
    [0, "0%"],
    [100, "100%"],
    [130, "100%"]
  ])("renders %s as matching displayed percent and width", (value, expected) => {
    render(<MetricBar label="Timeline completeness" value={value} />);

    expect(screen.getByTestId("metric-bar-percent")).toHaveTextContent(expected);
    expect(screen.getByTestId("metric-bar-fill")).toHaveStyle({ width: expected });
  });

  it("uses a visible fill color distinct from the track", () => {
    render(<MetricBar label="Patient story completeness" value={56} />);

    expect(screen.getByRole("meter")).toHaveStyle({ backgroundColor: "#E2E8F0" });
    expect(screen.getByTestId("metric-bar-fill")).toHaveStyle({ backgroundColor: "#2563EB", display: "block", width: "56%" });
  });
});
