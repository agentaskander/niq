import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { hashDirectory, root, zones } from "./deployment/policy.mjs";

const zone = "beta";
const source = join(root, zones[zone].dist);
const releases = join(root, ".deployment-artifacts", zone);

if (!existsSync(source)) {
  console.error("Beta publish guard failed: dist-beta does not exist. Run npm run validate:beta first.");
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const artifactHash = hashDirectory(source);
const target = join(releases, `${timestamp}-${artifactHash.slice(0, 12)}`);
mkdirSync(releases, { recursive: true });
cpSync(source, target, { recursive: true });
writeFileSync(join(releases, "latest.json"), `${JSON.stringify({ zone, source: "dist-beta", target, artifactHash, publishedAt: new Date().toISOString() }, null, 2)}\n`);

console.log(`Beta artifact staged: ${target}`);
console.log(`Artifact hash: ${artifactHash}`);
