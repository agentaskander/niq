import type { EntropySignal, SyntheticCase, TimelineMoment } from "../types";

export function summarizeCase(selectedCase: SyntheticCase) {
  return {
    headline: `${selectedCase.setting} cognition surface`,
    fragmentCount: selectedCase.fragments.length,
    reviewerQuestionCount: selectedCase.reviewerQuestions.length,
    continuityScore: Math.round(
      selectedCase.provenance.reduce((total, item) => total + item.confidence, 0) / selectedCase.provenance.length
    ),
    reviewNeeds: selectedCase.provenance.filter((item) => item.reviewerStatus === "needs review").length
  };
}

export function entropyAverage(signals: EntropySignal[]) {
  return Math.round(signals.reduce((total, signal) => total + signal.value, 0) / signals.length);
}

export function timelineContinuityAverage(moments: TimelineMoment[]) {
  return Math.round(moments.reduce((total, moment) => total + moment.continuityImpact, 0) / moments.length);
}
