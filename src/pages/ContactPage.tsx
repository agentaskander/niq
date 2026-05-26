import { ecosystemLeadConfigs, ProgressiveLeadForm } from "../../packages/shared-leads/src";

type Props = {
  kind: "contact" | "request-demo";
};

function currentRoute() {
  if (typeof window === "undefined") return "/contact";
  return `${window.location.pathname}${window.location.search}`;
}

export function ContactPage({ kind }: Props) {
  const isDemo = kind === "request-demo";

  return (
    <ProgressiveLeadForm
      config={{ ...ecosystemLeadConfigs.NarrativeIQ, defaultInterest: isDemo ? "Demo" : "Contact" }}
      eyebrow={isDemo ? "NarrativeIQ Demo" : "NarrativeIQ Contact"}
      title={isDemo ? "Request a NarrativeIQ demo." : "Contact the NarrativeIQ team."}
      description={isDemo
        ? "Tell us what you want to evaluate in a focused business or product conversation."
        : "Use this form for business, partnership, investor, or product questions."}
      ctaSource={isDemo ? "request-demo-page-primary" : "contact-page-primary"}
      sourceRoute={currentRoute()}
    />
  );
}
