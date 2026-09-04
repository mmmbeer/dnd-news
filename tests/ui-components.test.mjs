import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true },
});

after(async () => {
  await vite.close();
});

async function readCssTree(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const contents = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return readCssTree(entryPath);
      }
      return entry.name.endsWith(".css") ? readFile(entryPath, "utf8") : "";
    }),
  );
  return contents.join("\n");
}

test("emits the application and print styles", async () => {
  const css = await readCssTree(path.join(root, "dist"));

  assert.match(css, /\.studio-shell/);
  assert.match(css, /\.newspaper-page/);
  assert.match(css, /scrollbar-width:\s*thin/);
  assert.match(css, /grid-auto-rows:\s*2px/);
  assert.match(css, /@media print/);
  assert.match(css, /\.shared-newspaper-shell/);
  assert.match(css, /\.share-qr-panel/);
});

test("converts measured story heights into compact masonry rows", async () => {
  const { masonryRowSpan } = await vite.ssrLoadModule("/lib/news/masonry.ts");

  assert.equal(masonryRowSpan(1), 1);
  assert.equal(masonryRowSpan(240), 120);
  assert.equal(masonryRowSpan(241), 121);
  assert.equal(masonryRowSpan(0), 1);
});

test("adapts lead copy columns to its story span and accepts overrides", async () => {
  const { storyBodyColumns, storyColumnSpan } = await vite.ssrLoadModule("/lib/news/layout.ts");
  const lead = { kind: "lead", width: "full" };

  assert.equal(storyColumnSpan(lead, 5), 5);
  assert.equal(storyBodyColumns(lead, 5), 3);
  assert.equal(storyBodyColumns({ ...lead, columnSpan: 2 }, 5), 2);
  assert.equal(storyBodyColumns({ ...lead, columnSpan: 2, bodyColumns: 1 }, 5), 1);
  assert.equal(storyBodyColumns({ ...lead, columnSpan: 2, bodyColumns: 4 }, 5), 2);
});

test("forwards progress semantics to the primitive", async () => {
  const { Progress } = await vite.ssrLoadModule("/components/ui/progress.tsx");
  const html = renderToStaticMarkup(React.createElement(Progress, { value: 37 }));

  assert.match(html, /aria-valuenow="37"/);
  assert.match(html, /aria-valuetext="37%"/);
  assert.match(html, /data-state="loading"/);
});

test("emits chart themes for the starter's media dark mode", async () => {
  const { ChartStyle } = await vite.ssrLoadModule("/components/ui/chart.tsx");
  const html = renderToStaticMarkup(
    React.createElement(ChartStyle, {
      id: "contract",
      config: {
        latency: { theme: { light: "#ffffff", dark: "#000000" } },
      },
    }),
  );

  assert.match(html, /\[data-chart=contract\]/);
  assert.match(html, /@media \(prefers-color-scheme: dark\)/);
  assert.doesNotMatch(html, /\.dark/);
});

test("renders sidebar skeletons deterministically", async () => {
  const { SidebarMenuSkeleton } = await vite.ssrLoadModule(
    "/components/ui/sidebar.tsx",
  );
  const first = renderToStaticMarkup(React.createElement(SidebarMenuSkeleton));
  const second = renderToStaticMarkup(React.createElement(SidebarMenuSkeleton));

  assert.equal(first, second);
  assert.match(first, /--skeleton-width:70%/);
});

test("serves local newspaper artwork without the unsupported image optimizer", async () => {
  const checks = [
    ["components/studio/ImagePickerDialog.tsx", "src={artwork.src}"],
    ["components/studio/StoryEditorDialog.tsx", "src={artwork.src}"],
    ["components/studio/NewspaperPage.tsx", "src={illustration.src}"],
  ];

  for (const [file, sourceExpression] of checks) {
    const source = await readFile(path.join(root, file), "utf8");
    const imageTag = source.match(new RegExp(`<Image[^>]*${sourceExpression.replace(/[{}]/g, "\\$&")}[^>]*/>`))?.[0];
    assert.ok(imageTag, `missing local artwork image in ${file}`);
    assert.match(imageTag, /\bunoptimized\b/, `${file} would route local artwork through /image`);
  }
});

test("selects rendered images before offering replace and remove controls", async () => {
  const pageSource = await readFile(path.join(root, "components/studio/NewspaperPage.tsx"), "utf8");
  const appSource = await readFile(path.join(root, "app/page.tsx"), "utf8");
  const css = await readFile(path.join(root, "app/globals.css"), "utf8");

  assert.match(pageSource, /const \[selectedImageId, setSelectedImageId\]/);
  assert.match(pageSource, /function StoryArtwork/);
  assert.match(pageSource, /onSelect=\{\(\) => \{[\s\S]*setSelectedImageId\(story\.id\);[\s\S]*onSelect\(story\.id\)/);
  assert.match(pageSource, /selected\s*&&\s*\([\s\S]*className="image-replace-button"/);
  assert.match(pageSource, /className="image-replace-button"[\s\S]*onReplace\(\)/);
  assert.match(pageSource, /className="image-delete-button"[\s\S]*onRemove\(\)/);
  assert.match(pageSource, /onRemoveImage\(story\.id\)/);
  assert.match(appSource, /illustrationId:\s*null,\s*illustrationCaption:\s*""/);
  assert.match(css, /\.story-art\.is-selected/);
  assert.match(css, /\.image-selection-tools\s*\{/);
  assert.match(css, /\.image-replace-button/);
  assert.match(css, /\.image-delete-button\s*\{/);
  assert.match(css, /@media print[\s\S]*\.image-selection-tools/);
});

test("supports newspaper-style copy wrapping around story images", async () => {
  const pageSource = await readFile(path.join(root, "components/studio/NewspaperPage.tsx"), "utf8");
  const editorSource = await readFile(path.join(root, "components/studio/StoryEditorDialog.tsx"), "utf8");
  const sharingSource = await readFile(path.join(root, "lib/news/sharing.ts"), "utf8");
  const css = await readFile(path.join(root, "app/globals.css"), "utf8");

  assert.match(pageSource, /\(story\.illustrationFlow \?\? "wrap"\) === "wrap"/);
  assert.match(pageSource, /className="newspaper-copy-flow"/);
  assert.match(pageSource, /leadingContent=\{wrapsWithCopy \? artwork : undefined\}/);
  assert.match(editorSource, /Newspaper wrap/);
  assert.match(editorSource, /Reserved image block/);
  assert.match(sharingSource, /illustrationFlow: z\.enum\(\["wrap", "block"\]\)\.optional\(\)/);
  assert.match(css, /\.story-art\.is-copy-wrapped/);
  assert.match(css, /shape-outside:\s*margin-box/);
});
