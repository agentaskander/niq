import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const distRoot = join(root, "dist");
const scannedExtensions = new Set([".html", ".js", ".css", ".json", ".txt", ".xml", ".svg"]);

const blockedPatterns = [
  /\/modules(?:\/|["'`]|$)/,
  /\/modules\/new-patient-story/,
  /\/modules\/healthcare-cognition/,
  /\/beta(?:\/|["'`]|$)/,
  /\/app(?:\/|["'`]|$)/,
  /\/lab(?:\/|["'`]|$)/,
  /Internal Ideation Board/i,
  /Internal NarrativeIQ module preview/i,
  /private builder/i,
  /ontology schema/i,
  /score formula/i,
  /routing policy/i,
  /internal prompt/i,
  /embedding/i,
  /OPENAI_API_KEY/,
  /ANTHROPIC_API_KEY/,
  /\.env/
];

function walk(path) {
  const entries = readdirSync(path, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) files.push(...walk(child));
    if (entry.isFile() && scannedExtensions.has(extname(entry.name))) files.push(child);
  }

  return files;
}

const failures = [];

for (const file of walk(distRoot)) {
  if (file.endsWith("robots.txt")) continue;
  const text = readFileSync(file, "utf8");
  for (const pattern of blockedPatterns) {
    if (pattern.test(text)) {
      failures.push(`${relative(root, file)} contains ${pattern}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Public build audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Public build audit passed: internal route and implementation markers were not found in dist.");
