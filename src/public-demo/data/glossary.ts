export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  related: string[];
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "narrative-intelligence",
    term: "Narrative Intelligence",
    definition:
      "The practice of organizing fragmented human context into a coherent, reviewable story that can carry across workflows and time.",
    related: ["context-continuity", "narrative-memory", "narrative-state"]
  },
  {
    slug: "context-continuity",
    term: "Context Continuity",
    definition:
      "The ability to preserve what changed, what persisted, and what still needs attention as work moves between people or moments.",
    related: ["semantic-continuity", "narrative-memory", "signal-drift"]
  },
  {
    slug: "narrative-memory",
    term: "Narrative Memory",
    definition:
      "A human-readable continuity layer that helps a system carry forward relevant story context without reducing it to isolated facts.",
    related: ["context-graph", "narrative-state", "relational-intelligence"]
  },
  {
    slug: "signal-drift",
    term: "Signal Drift",
    definition:
      "A visible change in emphasis, priority, ownership, or interpretation as a story evolves over time.",
    related: ["context-continuity", "semantic-continuity", "narrative-state"]
  },
  {
    slug: "semantic-continuity",
    term: "Semantic Continuity",
    definition: "The preservation of meaning across separate notes, conversations, summaries, and decisions.",
    related: ["context-continuity", "context-graph", "narrative-intelligence"]
  },
  {
    slug: "human-centered-ai",
    term: "Human-Centered AI",
    definition:
      "AI designed to support human judgment, review, accountability, and context transfer rather than replace responsibility.",
    related: ["narrative-intelligence", "relational-intelligence", "structured-context"]
  },
  {
    slug: "context-graph",
    term: "Context Graph",
    definition:
      "A public-safe concept for showing relationships between narrative elements such as events, roles, questions, and decisions.",
    related: ["narrative-memory", "semantic-continuity", "narrative-state"]
  },
  {
    slug: "relational-intelligence",
    term: "Relational Intelligence",
    definition:
      "An understanding of how people, roles, commitments, and constraints shape the meaning of work over time.",
    related: ["human-centered-ai", "context-continuity", "narrative-memory"]
  },
  {
    slug: "narrative-state",
    term: "Narrative State",
    definition:
      "A snapshot of the current story: what is known, what is unresolved, and what a reviewer should inspect next.",
    related: ["signal-drift", "narrative-intelligence", "structured-context"]
  },
  {
    slug: "behavioral-context",
    term: "Behavioral Context",
    definition:
      "Observable patterns in fictional workflow activity, such as repeated blockers, ownership changes, or recurring requests for clarity.",
    related: ["relational-intelligence", "signal-drift", "context-continuity"]
  },
  {
    slug: "structured-context",
    term: "Structured Context",
    definition:
      "Information arranged into themes, timeline events, relationships, open questions, and review-ready summaries.",
    related: ["context-graph", "human-centered-ai", "narrative-state"]
  }
];
