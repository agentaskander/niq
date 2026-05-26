export type SafetyFlags = {
  syntheticOnly: true;
  containsPHI: false;
  clinicalAdvice: false;
  diagnosis: false;
  investorDemoSafe: true;
};

export type AdvantagePillar = SafetyFlags & {
  id: string;
  title: string;
  summary: string;
  signal: string;
  proofPoint: string;
};

export type OntologyNode = SafetyFlags & {
  id: string;
  label: string;
  domain: string;
  description: string;
  relationships: string[];
};

export type SyntheticCase = SafetyFlags & {
  id: string;
  title: string;
  setting: string;
  acuity: "low" | "moderate" | "high";
  story: string;
  fragments: string[];
  reviewerQuestions: string[];
  continuitySignals: string[];
  provenance: Array<{ source: string; confidence: number; reviewerStatus: "ready" | "needs review" }>;
};

export type EntropySignal = SafetyFlags & {
  id: string;
  label: string;
  value: number;
  trend: "improving" | "stable" | "watch";
  explanation: string;
};

export type TimelineMoment = SafetyFlags & {
  id: string;
  time: string;
  role: string;
  event: string;
  continuityImpact: number;
};

export type InteroperabilityNode = SafetyFlags & {
  id: string;
  system: string;
  payload: string;
  friction: string;
  demoBridge: string;
};

export type SpecialtyProfile = SafetyFlags & {
  id: string;
  specialty: string;
  cognitiveLoad: string;
  documentationPattern: string;
  moduleFit: string;
};

export type AgentStep = SafetyFlags & {
  id: string;
  agent: string;
  input: string;
  output: string;
  humanGate: string;
};

export type RoadmapItem = SafetyFlags & {
  id: string;
  horizon: string;
  title: string;
  investorFrame: string;
  riskControl: string;
};
