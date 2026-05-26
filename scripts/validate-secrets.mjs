import { join, relative } from "node:path";
import { formatFailures, root, scanFiles, secretPatterns, walkFiles, zones } from "./deployment/policy.mjs";

const zone = process.argv[2];
const dirs = zone && zones[zone] ? [zones[zone].dist] : Object.values(zones).map((policy) => policy.dist);
const failures = [];

for (const dir of dirs) {
  const distRoot = join(root, dir);
  const files = walkFiles(distRoot);
  failures.push(...scanFiles(files, secretPatterns, {
    skip: (file) => file.endsWith("deployment-manifest.json")
  }));
}

if (failures.length > 0) {
  console.error(formatFailures("Secret validation failed:", failures));
  process.exit(1);
}

console.log(`Secret validation passed for ${dirs.map((dir) => relative(root, join(root, dir))).join(", ")}.`);
