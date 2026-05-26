export type Scenario = {
  id: string;
  label: string;
  sector: string;
  summary: string;
  conversation: string[];
  themes: string[];
  continuity: string[];
  signals: string[];
  timeline: Array<{ time: string; event: string; intensity: number }>;
  state: string;
  relationship: string;
};

export const scenarios: Scenario[] = [
  {
    id: "support-continuity",
    label: "Customer support continuity",
    sector: "Enterprise support",
    summary: "A fictional support team carries context across three handoffs without losing the customer story.",
    conversation: [
      "Monday: The customer reports intermittent import failures after a workspace migration.",
      "Tuesday: Support confirms the issue appears only on records with legacy category names.",
      "Thursday: The success lead notes renewal timing and asks for a concise continuity brief."
    ],
    themes: ["handoff clarity", "renewal risk", "migration follow-up"],
    continuity: ["Workspace migration", "Legacy category naming", "Executive summary needed"],
    signals: ["Escalation risk rising", "Owner change detected", "Resolution dependency identified"],
    timeline: [
      { time: "Mon", event: "Initial report captured", intensity: 42 },
      { time: "Tue", event: "Pattern isolated in sample records", intensity: 58 },
      { time: "Thu", event: "Continuity brief requested", intensity: 74 }
    ],
    state: "Stable but time-sensitive",
    relationship: "Customer, support lead, success lead"
  },
  {
    id: "healthcare-continuity",
    label: "Care continuity",
    sector: "Health operations",
    summary: "A fictional care coordination team organizes non-clinical follow-up context for a review meeting.",
    conversation: [
      "Intake note: The family asks who owns the next follow-up and what information should be ready.",
      "Coordinator note: Transportation timing and document availability are the main blockers.",
      "Review note: The team needs a neutral summary for the next planning conversation."
    ],
    themes: ["care coordination", "family communication", "handoff readiness"],
    continuity: ["Follow-up owner", "Transportation timing", "Document readiness"],
    signals: ["Missing owner", "Repeated scheduling friction", "High need for plain-language summary"],
    timeline: [
      { time: "Intake", event: "Question set captured", intensity: 38 },
      { time: "Coordination", event: "Blockers clarified", intensity: 66 },
      { time: "Review", event: "Summary prepared", intensity: 71 }
    ],
    state: "Needs ownership clarity",
    relationship: "Family, coordinator, review team"
  },
  {
    id: "executive-context",
    label: "Executive decision context",
    sector: "Operating cadence",
    summary: "A fictional leadership team turns fragmented updates into a decision-ready brief.",
    conversation: [
      "Product update: The release is technically ready but customer enablement is behind.",
      "Finance update: Budget is available this quarter if rollout timing stays predictable.",
      "Operations update: Two regions need additional training before launch."
    ],
    themes: ["decision readiness", "launch sequencing", "cross-functional alignment"],
    continuity: ["Enablement gap", "Budget window", "Regional readiness"],
    signals: ["Timing constraint", "Dependency cluster", "Decision pending"],
    timeline: [
      { time: "Product", event: "Release readiness stated", intensity: 55 },
      { time: "Finance", event: "Budget window identified", intensity: 62 },
      { time: "Ops", event: "Training dependency added", intensity: 79 }
    ],
    state: "Ready for structured decision review",
    relationship: "Product, finance, operations"
  },
  {
    id: "project-collaboration",
    label: "Project collaboration continuity",
    sector: "Delivery team",
    summary: "A fictional project team keeps goals, blockers, and working agreements visible over time.",
    conversation: [
      "Kickoff: The team agrees the first milestone is a working prototype for partner review.",
      "Midpoint: Design clarifies scope while engineering flags integration timing.",
      "Review: The team wants one shared summary of decisions and unresolved dependencies."
    ],
    themes: ["project memory", "decision capture", "dependency awareness"],
    continuity: ["Prototype milestone", "Scope boundary", "Integration timing"],
    signals: ["Scope clarified", "Dependency unresolved", "Shared summary requested"],
    timeline: [
      { time: "Kickoff", event: "Milestone set", intensity: 35 },
      { time: "Midpoint", event: "Scope and timing updated", intensity: 68 },
      { time: "Review", event: "Decision brief assembled", intensity: 76 }
    ],
    state: "Aligned with one unresolved dependency",
    relationship: "Design, engineering, partner lead"
  }
];

export const graphClusters = [
  { id: "narrative", label: "Narrative state", color: "#f4c76b" },
  { id: "memory", label: "Continuity", color: "#75d0c2" },
  { id: "workflow", label: "Workflow signals", color: "#9fb7ff" },
  { id: "relationship", label: "Relationship context", color: "#ef9f88" }
] as const;

export const graphNodes = [
  { id: "brief", label: "Brief", cluster: "narrative", x: 50, y: 46, size: 18 },
  { id: "timeline", label: "Timeline", cluster: "memory", x: 28, y: 33, size: 13 },
  { id: "handoff", label: "Handoff", cluster: "workflow", x: 70, y: 31, size: 13 },
  { id: "owner", label: "Owner", cluster: "relationship", x: 78, y: 63, size: 12 },
  { id: "gap", label: "Gap", cluster: "workflow", x: 39, y: 71, size: 11 },
  { id: "context", label: "Context", cluster: "memory", x: 18, y: 58, size: 12 },
  { id: "review", label: "Review", cluster: "narrative", x: 59, y: 77, size: 12 }
] as const;

export const graphEdges = [
  ["brief", "timeline"],
  ["brief", "handoff"],
  ["brief", "review"],
  ["timeline", "context"],
  ["handoff", "owner"],
  ["gap", "review"],
  ["context", "gap"],
  ["owner", "review"]
] as const;

export const continuityMoments = [
  {
    title: "Conversation starts",
    detail: "The system captures the initial question, participants, and desired outcome from a fictional exchange.",
    strength: 34
  },
  {
    title: "Context carries forward",
    detail: "Later updates are linked to the same synthetic narrative thread instead of becoming isolated notes.",
    strength: 58
  },
  {
    title: "Signals reinforce",
    detail: "Repeated references to timing, ownership, and open questions become visible for review.",
    strength: 76
  },
  {
    title: "Drift is surfaced",
    detail: "The timeline highlights where the story changed so a human can decide what matters.",
    strength: 64
  }
];
