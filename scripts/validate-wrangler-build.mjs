import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = process.env.SITES_PROJECT_ROOT ?? process.cwd();
const configPath = resolve(projectRoot, "dist", "server", "wrangler.json");
const config = JSON.parse(await readFile(configPath, "utf8"));

const seen = new Set();
const duplicates = new Set();

for (const database of config.d1_databases ?? []) {
  if (seen.has(database.binding)) {
    duplicates.add(database.binding);
  }
  seen.add(database.binding);
}

if (duplicates.size > 0) {
  throw new Error(
    `Generated Wrangler configuration contains duplicate D1 bindings: ${[
      ...duplicates,
    ].join(", ")}`,
  );
}

console.log("Validated generated Wrangler D1 bindings.");
