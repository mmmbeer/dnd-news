import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("exports a complete static application shell", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

  assert.match(html, /^<!DOCTYPE html>/i);
  assert.match(html, /<title>Broadsheet — Fantasy Newspaper Studio<\/title>/);
  assert.match(html, /class="studio-shell"/);
  assert.match(html, /\/_next\/static\/chunks\//);
});
