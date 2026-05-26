import { join } from "node:path";
import { assertZone, formatFailures, root, scanFiles, secretPatterns, walkFiles, writeManifest, zones } from "./deployment/policy.mjs";

const zone = process.argv[2] ?? process.env.VITE_DEPLOY_ZONE ?? "internal";
const policy = assertZone(zone);
const distRoot = join(root, policy.dist);
const files = walkFiles(distRoot);

if (files.length === 0) {
  console.error(`No build artifacts found for ${zone} at ${policy.dist}. Run npm run build:${zone} first.`);
  process.exit(1);
}

const boundaryFailures = scanFiles(files, [...policy.blockedPatterns, ...secretPatterns], {
  skip: (file) => file.endsWith("robots.txt") || file.endsWith("deployment-manifest.json")
});

if (boundaryFailures.length > 0) {
  console.error(formatFailures(`${zone} boundary validation failed:`, boundaryFailures));
  process.exit(1);
}

const manifest = writeManifest(zone, {
  policy: "three-zone-deployment-governance",
  validation: {
    boundaryScan: "passed",
    filesScanned: files.length
  }
});

console.log(`${zone} boundary validation passed.`);
console.log(`Artifact hash: ${manifest.artifactHash}`);
console.log(`Manifest: ${policy.dist}/deployment-manifest.json`);
