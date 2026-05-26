import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

type LeadTrustSignalsProps = {
  trustChips: string[];
  proofPoints: string[];
};

export function LeadTrustSignals({ trustChips, proofPoints }: LeadTrustSignalsProps) {
  return (
    <>
      <div className="lead-badge"><Sparkles size={15} /> Early access preview</div>
      <div className="lead-trust-grid" aria-label="Lead trust signals">
        {trustChips.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="lead-proof-points">
        {proofPoints.map((point, index) => {
          const Icon = index === 0 ? ShieldCheck : LockKeyhole;
          return <p key={point}><Icon size={17} /> {point}</p>;
        })}
      </div>
    </>
  );
}
