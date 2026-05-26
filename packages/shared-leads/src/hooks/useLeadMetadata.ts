import { useCallback } from "react";
import { captureLeadMetadata } from "../lib/metadata";

export function useLeadMetadata(sourceApp: string, sourceRoute: string, ctaSource?: string) {
  return useCallback(() => captureLeadMetadata(sourceApp, sourceRoute, ctaSource), [ctaSource, sourceApp, sourceRoute]);
}
