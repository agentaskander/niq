import { ecosystemLeadConfigs, ProgressiveLeadForm } from "../../packages/shared-leads/src";

type Props = {
  onNavigate: (path: string) => void;
};

function currentRoute() {
  if (typeof window === "undefined") return "/beta";
  return `${window.location.pathname}${window.location.search}`;
}

export function BetaSignupPage({ onNavigate }: Props) {
  void onNavigate;
  return (
    <ProgressiveLeadForm
      config={ecosystemLeadConfigs.NarrativeIQ}
      eyebrow="NarrativeIQ Beta"
      title="Join the Narrative Intelligence beta."
      description="Preview the NarrativeIQ cognition layer for workflow intelligence, continuity, and governed AI experiences."
      ctaSource="beta-page-primary"
      onNavigate={onNavigate}
      sourceRoute={currentRoute()}
    />
  );
}
