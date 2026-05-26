import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BetaSignupPage } from "./BetaSignupPage";
import { ContactPage } from "./ContactPage";

describe("lead capture pages", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/beta");
    window.sessionStorage.clear();
    delete (globalThis as { __NIQ_LEAD_ENDPOINT__?: string }).__NIQ_LEAD_ENDPOINT__;
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("renders private beta form with safety controls and fallback email", () => {
    render(<BetaSignupPage onNavigate={() => undefined} />);

    expect(screen.getByRole("heading", { name: "Join the Narrative Intelligence beta." })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Organization/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Interest type/i)).not.toBeInTheDocument();
    expect(screen.getByText("Start with a few quick details.")).toBeInTheDocument();
    expect(screen.queryByText("Optional")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Private beta" })).toHaveClass("lead-choice-tile-selected");
    expect(document.querySelector('input[name="companyFax"]')).toBeInTheDocument();
    expect(screen.queryByText(/What best describes you/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Add more context/i }));
    expect(screen.getByText(/What best describes you/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Healthcare operator" })).toBeInTheDocument();
    expect(screen.queryByLabelText(/Referral/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/business\/demo interest only/i)).toBeInTheDocument();
    expect(screen.getByText(/Prefer email/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "niq@synkos.net" })).toHaveAttribute("href", "mailto:niq@synkos.net?subject=NarrativeIQ%20Private%20Beta%20Interest");
    expect(screen.queryByText(/No cook/i)).not.toBeInTheDocument();
    expect(screen.queryByText(new RegExp(["VITE", "LEAD_ENDPOINT"].join("_")))).not.toBeInTheDocument();
  });

  it("personalizes copy and adapts CTA from profile and interest", () => {
    render(<BetaSignupPage onNavigate={() => undefined} />);

    fireEvent.click(screen.getByRole("button", { name: /Add more context/i }));
    fireEvent.click(screen.getByRole("button", { name: "Healthcare operator" }));
    expect(screen.getByText("Explore workflow-aware narrative cognition.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Investor conversation" }));
    expect(screen.getByRole("button", { name: /Start investor conversation/i })).toBeInTheDocument();
  });

  it("validates required fields, accepts personal email, and keeps organization optional", () => {
    render(<BetaSignupPage onNavigate={() => undefined} />);

    fireEvent.click(screen.getByRole("button", { name: /Request beta access/i }));
    expect(screen.getByText("Enter your name and a valid email to continue.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Alex Demo" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "alex@gmail.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Request beta access/i }));
    expect(screen.getByText(/Confirm that this form will not include sensitive clinical data/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Add more context/i }));
    fireEvent.change(screen.getByLabelText(/Anything useful to know/i), { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: /Request beta access/i }));
    expect(screen.getByText("Add a little more context or leave the optional section blank.")).toBeInTheDocument();
  });

  it("preserves draft in sessionStorage only", () => {
    const { unmount } = render(<BetaSignupPage onNavigate={() => undefined} />);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Alex Session" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "alex.session@gmail.com" } });
    unmount();
    render(<BetaSignupPage onNavigate={() => undefined} />);

    expect(screen.getByLabelText(/Name/i)).toHaveValue("Alex Session");
    expect(screen.getByLabelText(/Email/i)).toHaveValue("alex.session@gmail.com");
    expect(window.sessionStorage.length).toBeGreaterThan(0);
  });

  it("submits metadata without localStorage or cookies", async () => {
    const setItem = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubEnv(["VITE", "LEAD_ENDPOINT"].join("_"), "/api/leads");
    vi.stubGlobal("fetch", fetchMock);
    window.history.pushState({}, "", "/beta?utm_source=linkedin&utm_medium=social&utm_campaign=beta");
    Object.defineProperty(document, "referrer", { configurable: true, value: "https://example.com/ref" });
    document.title = "NarrativeIQ Beta";
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: vi.fn(), setItem, removeItem: vi.fn(), clear: vi.fn() }
    });

    render(<BetaSignupPage onNavigate={() => undefined} />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Alex Demo" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "alex@gmail.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Add more context/i }));
    fireEvent.click(screen.getByRole("button", { name: "Investor" }));
    fireEvent.click(screen.getByRole("button", { name: "Healthcare cognition" }));
    fireEvent.click(screen.getByRole("button", { name: "This month" }));
    fireEvent.change(screen.getByLabelText(/Anything useful to know/i), { target: { value: "Private beta workflow review" } });
    fireEvent.click(screen.getByLabelText(/business\/demo interest only/i));
    fireEvent.click(screen.getByRole("button", { name: /Preview healthcare cognition/i }));

    expect(await screen.findByText(/Request received/i)).toBeInTheDocument();
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.sourceApp).toBe("NarrativeIQ");
    expect(payload.leadId).toMatch(/^narrativeiq-/);
    expect(payload.organization).toBe("");
    expect(payload.profileType).toBe("Investor");
    expect(payload.interestType).toBe("Healthcare cognition");
    expect(payload.contextInterest).toBeUndefined();
    expect(payload.timeline).toBe("This month");
    expect(payload.lifecycleStage).toBe("beta_waitlist");
    expect(payload.investorLikelihood).toBeGreaterThan(50);
    expect(payload.metadata).toMatchObject({
      sourceApp: "NarrativeIQ",
      sourceDomain: "localhost",
      sourcePath: "/beta",
      sourceRoute: "/beta?utm_source=linkedin&utm_medium=social&utm_campaign=beta",
      referrer: "https://example.com/ref",
      utmSource: "linkedin",
      utmMedium: "social",
      utmCampaign: "beta",
      ctaSource: "beta-page-primary",
      pageTitle: "NarrativeIQ Beta"
    });
    expect(payload.metadata.submittedAt).toEqual(expect.any(String));
    expect(payload.metadata.deviceType).toEqual(expect.any(String));
    expect(payload.metadata.viewportClass).toEqual(expect.any(String));
    expect(window.sessionStorage.length).toBe(0);
    expect(setItem).not.toHaveBeenCalled();
    expect(document.cookie).toBe("");
  });

  it("renders contact and request demo forms", () => {
    window.history.pushState({}, "", "/contact");
    const { unmount } = render(<ContactPage kind="contact" />);
    expect(screen.getByRole("heading", { name: "Contact the NarrativeIQ team." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Other" })).toBeInTheDocument();

    unmount();
    window.sessionStorage.clear();
    window.history.pushState({}, "", "/request-demo");
    render(<ContactPage kind="request-demo" />);
    expect(screen.getByRole("heading", { name: "Request a NarrativeIQ demo." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Demo" })).toHaveClass("lead-choice-tile-selected");
  });
});
