import { CheckCircle2 } from "lucide-react";

type LeadSuccessStateProps = {
  sourceApp: string;
  fallbackEmail: string;
  fallbackMailto: string;
  links?: Array<{ label: string; path: string }>;
  onNavigate?: (path: string) => void;
};

export function LeadSuccessState({ sourceApp, fallbackEmail, fallbackMailto, links = [], onNavigate }: LeadSuccessStateProps) {
  return (
    <div className="lead-success-state">
      <p className="lead-success">
        <CheckCircle2 size={18} /> Request received.
      </p>
      <p>{sourceApp} reviews beta, design-partner, demo, and research interest manually.</p>
      <p>Qualified requests are reviewed by the team before any private follow-up or gated preview access.</p>
      {links.length > 0 && (
        <div className="lead-success-links">
          {links.map((link) => (
            <button key={link.path} onClick={() => onNavigate?.(link.path)} type="button">{link.label}</button>
          ))}
        </div>
      )}
      <p className="lead-email-fallback">Prefer email? <a href={fallbackMailto}>{fallbackEmail}</a></p>
    </div>
  );
}
