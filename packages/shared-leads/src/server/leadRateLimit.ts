const buckets = new Map<string, number[]>();

export function rateLimitKey(ip: string, email?: string) {
  return `${ip || "unknown"}:${email || "anonymous"}`.toLowerCase();
}

export function checkLeadRateLimit(key: string, now = Date.now()) {
  const windowMs = 10 * 60 * 1000;
  const maxAttempts = 4;
  const recent = (buckets.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length >= maxAttempts) {
    buckets.set(key, recent);
    return { allowed: false, retryAfterSeconds: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  buckets.set(key, recent);
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetLeadRateLimit() {
  buckets.clear();
}
