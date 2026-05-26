import { join } from "node:path";
import { assertZone, formatFailures, root, scanFiles, walkFiles, zones } from "./deployment/policy.mjs";

const zone = process.argv[2] ?? process.env.VITE_DEPLOY_ZONE ?? "internal";
const policy = assertZone(zone);
const distRoot = join(root, policy.dist);
const files = walkFiles(distRoot);

if (files.length === 0) {
  console.error(`No build artifacts found for ${zone} at ${policy.dist}. Run npm run build:${zone} first.`);
  process.exit(1);
}

const routePatterns = policy.forbiddenRoutes.map((route) => ({
  name: `forbidden route ${route}`,
  pattern: new RegExp(`${route.replaceAll("/", "\\/")}(?:\\/|["'\`<\\s?#]|$)`, "i")
}));

const failures = scanFiles(files, routePatterns, {
  skip: (file) => file.endsWith("robots.txt") || file.endsWith("deployment-manifest.json")
});

if (failures.length > 0) {
  console.error(formatFailures(`${zone} route validation failed:`, failures));
  process.exit(1);
}

console.log(`${zone} route validation passed.`);
console.log(`Allowed routes: ${policy.allowedRoutes.join(", ")}`);
