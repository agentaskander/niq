import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { TimePicker } from "./TimePicker";

function Harness({ initial = "07:00 AM" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return <TimePicker value={value} onChange={setValue} />;
}

describe("TimePicker", () => {
  it("persists typed compact keyboard values", () => {
    render(<Harness />);

    const input = screen.getByLabelText("Time");
    fireEvent.change(input, { target: { value: "742a" } });
    fireEvent.blur(input);

    expect(screen.getByDisplayValue("07:42 AM")).toBeInTheDocument();
  });

  it("resolves now to the current local time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-12T14:42:00"));
    render(<Harness />);

    const input = screen.getByLabelText("Time");
    fireEvent.change(input, { target: { value: "now" } });
    fireEvent.blur(input);

    expect(screen.getByDisplayValue(/02:42 PM|2:42 PM/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("formats 24-hour entry", () => {
    render(<Harness />);

    const input = screen.getByLabelText("Time");
    fireEvent.change(input, { target: { value: "13:05" } });
    fireEvent.blur(input);

    expect(screen.getByDisplayValue("01:05 PM")).toBeInTheDocument();
  });

  it("quick option updates time", () => {
    render(<Harness initial="08:00 AM" />);

    fireEvent.click(screen.getByRole("button", { name: /Time quick options/i }));
    fireEvent.click(screen.getByRole("button", { name: "Shift start" }));

    expect(screen.getByDisplayValue("07:00 AM")).toBeInTheDocument();
  });

  it("renders compact forward quick options", () => {
    render(<Harness initial="08:00 AM" />);

    fireEvent.click(screen.getByRole("button", { name: /Time quick options/i }));

    expect(screen.getByRole("button", { name: "Now" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+15m" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+30m" })).toBeInTheDocument();
  });
});
