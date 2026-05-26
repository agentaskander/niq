import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const scanRoots = ["src/public-demo", "public/robots.txt", "public/sitemap.xml"];
const allowedExtensions = new Set([".css", ".ts", ".tsx", ".txt", ".xml"]);

const blockedContentPatterns = [
  /\/Users\/askander/,
  /\.env/,
  /OPENAI_API_KEY/,
  /ANTHROPIC_API_KEY/,
  /SECRET/i,
  /TOKEN=/,
  /private ontology/i,
  /internal prompt/i,
  /embeddings/i,
  /orchestration/i,
  /memory weighting/i,
  /behavioral heuristic/i,
  /recovery-staging/i
];

function walk(path) {
  const fullPath = join(root, path);
  const entries = readdirSync(fullPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) files.push(...walk(child));
    if (entry.isFile()) files.push(child);
  }

  return files;
}

const files = scanRoots.flatMap((path) => {
  if (extname(path)) return [path];
  return walk(path);
});

const failures = [];

for (const file of files) {
  if (!allowedExtensions.has(extname(file))) continue;
  const text = readFileSync(join(root, file), "utf8");
  for (const pattern of blockedContentPatterns) {
    if (pattern.test(text)) failures.push(`Blocked content pattern ${pattern} in ${relative(root, join(root, file))}`);
  }
}

if (failures.length > 0) {
  console.error("Public demo audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Public demo audit passed for ${files.length} public demo files.`);
