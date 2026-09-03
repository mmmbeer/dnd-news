import assert from "node:assert/strict";
import { access } from "node:fs/promises";
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

after(async () => {
  await vite.close();
});

test("ships five distinct newspaper defaults", async () => {
  const { newspaperPresets } = await vite.ssrLoadModule("/lib/news/presets.ts");
  assert.equal(newspaperPresets.length, 5);
  assert.equal(new Set(newspaperPresets.map((preset) => preset.id)).size, 5);
  assert.equal(new Set(newspaperPresets.map((preset) => preset.settings.newspaperName)).size, 5);
});

test("ships at least one hundred resolvable story templates", async () => {
  const { storyTemplates } = await vite.ssrLoadModule("/lib/news/templates/index.ts");
  const { renderStoryTemplate } = await vite.ssrLoadModule("/lib/news/template-engine.ts");
  const { seededRandom } = await vite.ssrLoadModule("/lib/news/generator.ts");

  assert.ok(storyTemplates.length >= 100);
  assert.equal(storyTemplates.length, 110);
  assert.equal(new Set(storyTemplates.map((template) => template.id)).size, storyTemplates.length);

  for (const template of storyTemplates) {
    const rendered = renderStoryTemplate(template, "ominous", seededRandom(template.id));
    const completeCopy = [rendered.title, rendered.kicker, rendered.dek, ...rendered.paragraphs].join("\n");
    assert.doesNotMatch(completeCopy, /\{\{[^{}]+\}\}/, template.id);
  }
});

test("maps the generated and public-domain art pools across the complete story library", async () => {
  const { storyIllustrations } = await vite.ssrLoadModule("/lib/news/illustrations.ts");
  const { storyTemplates } = await vite.ssrLoadModule("/lib/news/templates/index.ts");
  const known = new Set(storyIllustrations.map((illustration) => illustration.id));
  const used = new Set(storyTemplates.map((template) => template.illustrationId));
  const counts = Object.groupBy(storyIllustrations, (illustration) => illustration.kind);

  assert.equal(storyIllustrations.length, 124);
  assert.equal(known.size, storyIllustrations.length);
  assert.equal(counts.generated?.length, 50);
  assert.equal(counts.historical?.length, 61);
  assert.equal(counts.cartoon?.length, 13);
  assert.deepEqual([...used].filter((id) => !known.has(id)), []);
  assert.deepEqual(
    storyIllustrations
      .filter((illustration) => illustration.kind === "generated" && !used.has(illustration.id))
      .map((illustration) => illustration.id),
    [],
  );

  await Promise.all(storyIllustrations.map((illustration) => access(`${root}/public${illustration.src}`)));
});
