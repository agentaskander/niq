type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: Props) {
  return (
    <div className="space-y-2">
      {eyebrow && <p className="section-kicker">{eyebrow}</p>}
      <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h2>
      {description && <p className="max-w-2xl text-sm leading-6 text-muted md:text-base">{description}</p>}
    </div>
  );
}
