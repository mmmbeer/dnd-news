import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("builds the newspaper application as a share-capable Worker", async () => {
  const worker = await readFile(new URL("../dist/server/index.js", import.meta.url), "utf8");

  assert.match(worker, /Broadsheet — Fantasy Newspaper Studio/);
  assert.match(worker, /newspaper_snapshots/);
  assert.match(worker, /async scheduled\(/);
  await access(new URL("../dist/client/favicon.svg", import.meta.url));
  await access(new URL("../drizzle/0000_dashing_albert_cleary.sql", import.meta.url));
  await access(new URL("../drizzle/0001_share_update_tokens.sql", import.meta.url));
});
