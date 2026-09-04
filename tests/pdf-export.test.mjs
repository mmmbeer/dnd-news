import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true },
});

after(async () => vite.close());

test("builds safe PDF names and page dimensions", async () => {
  const { fitWithin, pageFormatPoints, safePdfFilename } = await vite.ssrLoadModule("/lib/pdf/export-newspaper.ts");

  assert.equal(safePdfFilename(" The Blackwater Ledger.pdf "), "the-blackwater-ledger.pdf");
  assert.equal(safePdfFilename("***"), "newspaper.pdf");
  assert.deepEqual(pageFormatPoints("letter", "portrait", 980, 1230), [612, 792]);
  assert.deepEqual(pageFormatPoints("letter", "landscape", 980, 1230), [792, 612]);
  assert.deepEqual(pageFormatPoints("newspaper", "portrait", 800, 1200), [600, 900]);
  assert.deepEqual(fitWithin(1000, 2000, 500, 500), { width: 250, height: 500 });
});

test("uses browser-side PDF libraries without invoking print", async () => {
  const exportSource = await readFile(path.join(root, "lib/pdf/export-newspaper.ts"), "utf8");
  const appSource = await readFile(path.join(root, "app/page.tsx"), "utf8");
  const sharedSource = await readFile(path.join(root, "components/studio/SharedNewspaperView.tsx"), "utf8");

  assert.match(exportSource, /import\("jspdf"\)/);
  assert.match(exportSource, /import\("html2canvas"\)/);
  assert.match(exportSource, /pdf\.save/);
  assert.doesNotMatch(appSource, /window\.print/);
  assert.doesNotMatch(sharedSource, /window\.print/);
});
