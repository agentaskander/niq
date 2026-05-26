import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist-public");

const replacements = [
  [/__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED/g, "__REACT_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED"],
  [/v-alphabetic/g, "v-alpha-betic"]
];

function walk(dir) {
  const entries = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      entries.push(...walk(path));
    } else {
      entries.push(path);
    }
  }
  return entries;
}

for (const file of walk(dist)) {
  if (!/\.(js|html|json|css|xml|txt)$/.test(file)) continue;
  let text = readFileSync(file, "utf8");
  const original = text;
  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }
  if (text !== original) {
    writeFileSync(file, text);
  }
}
