import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { extname, join, relative } from "node:path";

export const root = process.cwd();

export const zones = {
  public: {
    dist: "dist-public",
    allowedRoutes: ["/demo", "/demo/healthcare-cognition"],
    rootBehavior: "redirect:/demo",
    forbiddenRoutes: ["/modules", "/beta", "/admin", "/ops", "/app", "/lab"],
    blockedPatterns: [
      { name: "modules route", pattern: /\/modules(?:\/|["'`<\s]|$)/i },
      { name: "beta route", pattern: /\/beta(?:\/|["'`<\s]|$)/i },
      { name: "new patient story", pattern: /new-patient-story/i },
      { name: "internal marker", pattern: /\binternal\b/i },
      { name: "admin marker", pattern: /\badmin\b/i },
      { name: "ontology schema dump", pattern: /ontology\s+(schema|dump)|schema\s+dump/i },
      { name: "prompt reference", pattern: /\b(prompt|prompt chain|prompt logic)\b/i },
      { name: "embedding reference", pattern: /\bembedding(s)?\b/i },
      { name: "routing policy", pattern: /routing\s+polic(y|ies)|route\s+registr(y|ies)/i },
      { name: "scoring formula", pattern: /scor(e|ing)\s+formula/i },
      { name: "ideation", pattern: /\bideation\b/i },
      { name: "real root landing copy", pattern: /Structured clinical narratives at the speed of care|Narrative Style Engine|Clinical Story Engine architecture|Nurse Adoption Strategy/i },
      { name: "module index copy", pattern: /Root app preserved|Choose a focused NarrativeIQ lab/i }
    ]
  },
  beta: {
    dist: "dist-beta",
    allowedRoutes: ["/beta", "/beta/healthcare-cognition", "/demo", "/demo/healthcare-cognition"],
    rootBehavior: "redirect:/beta",
    forbiddenRoutes: ["/modules", "/admin", "/ops", "/app/admin", "/app/ontology", "/app/settings", "/lab"],
    blockedPatterns: [
      { name: "admin marker", pattern: /\badmin\b/i },
      { name: "admin route", pattern: /\/(?:app\/)?admin(?:\/|["'`<\s]|$)/i },
      { name: "ops route", pattern: /\/ops(?:\/|["'`<\s]|$)/i },
      { name: "module internals", pattern: /\/modules(?:\/|["'`<\s]|$)/i },
      { name: "ideation board", pattern: /\bideation\b|Internal Ideation Board/i },
      { name: "raw ontology dump", pattern: /raw\s+ontology|ontology\s+(schema|dump)|schema\s+dump|relation\s+taxonomy/i },
      { name: "prompt chain", pattern: /\b(prompt chain|prompt logic|internal prompt)\b/i },
      { name: "embedding strategy", pattern: /\bembedding(s)?\s+(strategy|reference|model)?\b/i },
      { name: "scoring formula", pattern: /scor(e|ing)\s+formula/i },
      { name: "internal route registry", pattern: /internal\s+route\s+registr(y|ies)|route\s+registr(y|ies)/i }
    ]
  },
  internal: {
    dist: "dist-internal",
    allowedRoutes: ["*"],
    forbiddenRoutes: [],
    blockedPatterns: []
  }
};

export const secretPatterns = [
  { name: ".env leakage", pattern: /\.env(?:\.|["'`\s/]|$)/i },
  { name: "secret assignment", pattern: /(^|[^A-Z0-9_])(SECRET|TOKEN|API_KEY|PRIVATE_KEY|ACCESS_KEY|CLIENT_SECRET)\s*[:=]/i },
  { name: "OpenAI key", pattern: /sk-[A-Za-z0-9_-]{20,}/ },
  { name: "GitHub token", pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/ },
  { name: "JWT", pattern: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/ },
  { name: "AWS key", pattern: /AKIA[0-9A-Z]{16}/ }
];

export const scannedExtensions = new Set([".html", ".js", ".css", ".json", ".txt", ".xml", ".svg", ".map"]);

export function assertZone(zone) {
  if (!zones[zone]) throw new Error(`Unknown deployment zone: ${zone}`);
  return zones[zone];
}

export function walkFiles(dir, extensions = scannedExtensions) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const child = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(child, extensions));
    if (entry.isFile() && extensions.has(extname(entry.name))) files.push(child);
  }
  return files;
}

export function scanFiles(files, patterns, { skip = () => false } = {}) {
  const failures = [];
  for (const file of files) {
    if (skip(file)) continue;
    const text = readFileSync(file, "utf8");
    for (const { name, pattern } of patterns) {
      if (pattern.test(text)) failures.push({ file, name, pattern: String(pattern) });
    }
  }
  return failures;
}

export function hashFile(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

export function hashDirectory(dir) {
  const hash = createHash("sha256");
  for (const file of walkFiles(dir).sort()) {
    hash.update(relative(dir, file));
    hash.update(hashFile(file));
  }
  return hash.digest("hex");
}

export function writeManifest(zone, extra = {}) {
  const policy = assertZone(zone);
  const distRoot = join(root, policy.dist);
  const files = walkFiles(distRoot).sort();
  const manifest = {
    zone,
    dist: policy.dist,
    generatedAt: new Date().toISOString(),
    deployZoneEnv: process.env.VITE_DEPLOY_ZONE ?? zone,
    allowedRoutes: policy.allowedRoutes,
    rootBehavior: policy.rootBehavior ?? "zone-owned",
    forbiddenRoutes: policy.forbiddenRoutes,
    artifactHash: hashDirectory(distRoot),
    files: files.map((file) => ({
      path: relative(root, file),
      bytes: statSync(file).size,
      sha256: hashFile(file)
    })),
    ...extra
  };
  writeFileSync(join(distRoot, "deployment-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

export function formatFailures(title, failures) {
  if (failures.length === 0) return "";
  const lines = [title];
  for (const failure of failures) {
    const file = failure.file ? relative(root, failure.file) : failure.scope;
    lines.push(`- ${file}: ${failure.name}`);
  }
  return lines.join("\n");
}
