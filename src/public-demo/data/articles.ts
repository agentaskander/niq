export type PublicArticle = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

export const articles: PublicArticle[] = [
  {
    slug: "what-is-narrative-intelligence",
    title: "What Is Narrative Intelligence?",
    description: "A practical definition of narrative intelligence for teams building human-centered AI systems.",
    date: "2026-05-25",
    readTime: "5 min",
    tags: ["Narrative Intelligence", "Context", "AI Systems"],
    sections: [
      {
        heading: "A working definition",
        body:
          "Narrative intelligence is the ability to preserve human context across time, roles, decisions, and relationships. It treats a story as operational context, not decoration."
      },
      {
        heading: "Why it matters",
        body:
          "Teams rarely fail because a single note is missing. They fail because the continuity between notes, meetings, decisions, and handoffs disappears."
      },
      {
        heading: "What NiQ demonstrates",
        body:
          "This public demo shows a synthetic version of that idea: scattered inputs become themes, timeline moments, open questions, and a reviewable narrative state."
      }
    ]
  },
  {
    slug: "why-ai-systems-lose-human-context",
    title: "Why AI Systems Lose Human Context",
    description: "Why stateless interactions often miss the continuity that makes human work understandable.",
    date: "2026-05-25",
    readTime: "6 min",
    tags: ["Context Continuity", "Human-Centered AI", "Workflows"],
    sections: [
      {
        heading: "The gap is continuity",
        body:
          "A useful answer can still be disconnected from the longer human story. The missing layer is often continuity: what changed, what stayed true, and who needs to know."
      },
      {
        heading: "Context is relational",
        body:
          "Human work depends on relationships between events, people, constraints, commitments, and unresolved questions. A single transcript or task list cannot carry that alone."
      },
      {
        heading: "Public-safe demonstration",
        body:
          "NiQ's demo uses fictional scenarios to show how continuity can be made visible without making claims about private production systems."
      }
    ]
  },
  {
    slug: "continuity-vs-stateless-ai",
    title: "Continuity vs Stateless AI",
    description: "A plain-language comparison between one-off AI interactions and continuity-aware systems.",
    date: "2026-05-25",
    readTime: "4 min",
    tags: ["Continuity", "AI Workflows", "Narrative Memory"],
    sections: [
      {
        heading: "Stateless systems answer the moment",
        body:
          "One-off interactions can summarize a message or draft a response. They are less suited to work that depends on what happened before and what should carry forward."
      },
      {
        heading: "Continuity-aware systems organize the story",
        body:
          "A continuity-aware system tracks how context evolves. It makes assumptions visible and gives humans a clearer surface for review."
      },
      {
        heading: "The practical test",
        body:
          "If a team can understand why a summary changed over time, the system is supporting continuity rather than merely producing text."
      }
    ]
  },
  {
    slug: "human-centered-intelligence-infrastructure",
    title: "Human-Centered Intelligence Infrastructure",
    description: "How infrastructure for AI systems can be designed around human review, context, and accountability.",
    date: "2026-05-25",
    readTime: "5 min",
    tags: ["Infrastructure", "Review", "Enterprise AI"],
    sections: [
      {
        heading: "Infrastructure should clarify responsibility",
        body:
          "The more powerful an AI system becomes, the more important it is to clarify what it knows, what it inferred, and what still requires human judgment."
      },
      {
        heading: "Narratives create shared operating surfaces",
        body:
          "A strong narrative surface helps teams compare facts, unresolved questions, and decisions without hiding uncertainty."
      },
      {
        heading: "Enterprise value",
        body:
          "For organizations, the value is not novelty. It is repeatable context transfer across teams, workflows, and decision cycles."
      }
    ]
  },
  {
    slug: "narrative-memory-in-intelligent-systems",
    title: "Narrative Memory in Intelligent Systems",
    description: "How narrative memory can help AI systems carry forward context in a human-reviewable way.",
    date: "2026-05-25",
    readTime: "5 min",
    tags: ["Narrative Memory", "Context Graph", "Review"],
    sections: [
      {
        heading: "Memory is not just storage",
        body:
          "A list of saved facts does not explain why a story matters. Narrative memory organizes what changed, what persisted, and what remains unresolved."
      },
      {
        heading: "The review layer matters",
        body:
          "Useful memory should support human inspection. Teams need to see where continuity comes from before relying on a generated draft."
      },
      {
        heading: "Public demo boundary",
        body:
          "This site uses synthetic content and simple deterministic interactions to illustrate the concept without exposing non-public systems."
      }
    ]
  },
  {
    slug: "structured-context-for-ai-workflows",
    title: "Structured Context for AI Workflows",
    description: "Why AI workflows need structured context, clear boundaries, and human-readable continuity.",
    date: "2026-05-25",
    readTime: "4 min",
    tags: ["Structured Context", "Workflow", "Enterprise AI"],
    sections: [
      {
        heading: "Context needs shape",
        body:
          "Teams need more than raw text. They need themes, ownership, timing, constraints, decisions, and open questions arranged in a form that supports action."
      },
      {
        heading: "Structure improves review",
        body:
          "When context is structured, reviewers can find gaps quickly and decide whether a draft is ready to share."
      },
      {
        heading: "The NiQ preview",
        body:
          "The public preview shows a lightweight version of this workflow with fictional examples and transparent boundaries."
      }
    ]
  }
];
