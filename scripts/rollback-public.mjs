import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { root, zones } from "./deployment/policy.mjs";

const zone = "public";
const releases = join(root, ".deployment-artifacts", zone);
const target = join(root, zones[zone].dist);
const releasesList = existsSync(releases)
  ? readdirSync(releases, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
  : [];

const selected = process.argv[2] ?? releasesList.at(-2) ?? releasesList.at(-1);
if (!selected) {
  console.error("Public rollback failed: no staged public artifacts found.");
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
cpSync(join(releases, selected), target, { recursive: true });
console.log(`Public rollback restored ${selected} into dist-public.`);
