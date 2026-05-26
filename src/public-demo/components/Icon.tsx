type IconProps = {
  name: string;
};

const labels: Record<string, string> = {
  arrow: "->",
  book: "B",
  braces: "{}",
  branch: "Y",
  check: "OK",
  chevron: ">",
  dot: "o",
  file: "F",
  link: "#",
  network: "N",
  shield: "S",
  spark: "*",
  workflow: "W"
};

export function Icon({ name }: IconProps) {
  return (
    <span className={`niq-icon niq-icon-${name}`} aria-hidden="true">
      {labels[name] ?? "*"}
    </span>
  );
}
