import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminGate } from "./AdminGate";

describe("AdminGate", () => {
  it("locks admin routes without admin demo query param", () => {
    window.history.pushState({}, "", "/app/admin");
    render(<AdminGate><div>Secret dashboard</div></AdminGate>);

    expect(screen.getByText("Admin access required")).toBeInTheDocument();
    expect(screen.queryByText("Secret dashboard")).not.toBeInTheDocument();
  });

  it("allows admin routes with admin demo query param", () => {
    window.history.pushState({}, "", "/app/admin?admin=demo");
    render(<AdminGate><div>Secret dashboard</div></AdminGate>);

    expect(screen.getByText("Secret dashboard")).toBeInTheDocument();
  });
});
