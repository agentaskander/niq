import { join } from "node:path";
import { root, walkFiles, writeManifest } from "./deployment/policy.mjs";

const distRoot = join(root, "dist-internal");
const files = walkFiles(distRoot);

if (files.length === 0) {
  console.error("Internal build audit failed: dist-internal is missing or empty.");
  process.exit(1);
}

const manifest = writeManifest("internal", {
  policy: "internal-validation-only",
  deployment: "blocked",
  validation: {
    internalBuild: "passed",
    filesScanned: files.length
  }
});

console.log("Internal build audit passed: full internal artifact generated for validation only.");
console.log(`Artifact hash: ${manifest.artifactHash}`);
