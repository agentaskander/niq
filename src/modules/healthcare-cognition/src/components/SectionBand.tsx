import type { ReactNode } from "react";

type SectionBandProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function SectionBand({ eyebrow, title, description, children }: SectionBandProps) {
  return (
    <section className="px-5 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 max-w-3xl">
          <p className="section-kicker">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h2>
          {description && <p className="mt-3 text-sm leading-7 text-muted">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
