import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test, { after } from "node:test";
import path from "node:path";
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

test("offers ten newspaper templates including the five extended presets", async () => {
  const { newspaperPresets } = await vite.ssrLoadModule("/lib/news/presets.ts");
  assert.equal(newspaperPresets.length, 10);
  for (const id of ["silver-quill", "watchman", "mercantile", "arcane-herald", "frontier"]) {
    assert.ok(newspaperPresets.some((preset) => preset.id === id), `missing ${id}`);
  }
});

test("exposes expanded masthead, headline and body font families", async () => {
  const { mastheadFontOptions, headlineFontOptions, bodyFontOptions, fontFamilyFor } = await vite.ssrLoadModule("/lib/news/fonts.ts");
  assert.ok(mastheadFontOptions.length >= 30);
  assert.ok(headlineFontOptions.length >= 30);
  assert.ok(bodyFontOptions.length >= 20);
  assert.match(fontFamilyFor("masthead", "didone"), /Bodoni|Didot/);
  assert.match(fontFamilyFor("body", "typewriter"), /Courier/);
});

test("maps paper age monotonically across 25 weathering overlays", async () => {
  const { paperWeatheringOverlays, paperWeatheringRasters, weatheringLevelForAge, weatheringOverlayForAge } = await vite.ssrLoadModule("/lib/news/weathering.ts");
  assert.equal(paperWeatheringOverlays.length, 25);
  assert.equal(paperWeatheringRasters.length, 20);
  assert.equal(weatheringLevelForAge(0), 0);
  assert.equal(weatheringLevelForAge(1), 1);
  assert.equal(weatheringLevelForAge(4), 1);
  assert.equal(weatheringLevelForAge(5), 2);
  assert.equal(weatheringLevelForAge(100), 25);
  assert.equal(weatheringOverlayForAge(100)?.id, "weathering-25");

  let previous = 0;
  for (let age = 0; age <= 100; age += 1) {
    const current = weatheringLevelForAge(age);
    assert.ok(current >= previous, `weathering level regressed at paper age ${age}`);
    previous = current;
  }

  let previousCount = 0;
  for (const overlay of paperWeatheringOverlays) {
    assert.ok(overlay.elementCount >= previousCount, `weathering element count regressed at level ${overlay.level}`);
    previousCount = overlay.elementCount;
  }

  for (const raster of paperWeatheringRasters) {
    assert.match(raster.src, /^\/weathering\/[a-z0-9-]+\.webp$/);
    await access(path.join(root, "public", raster.src));
  }
});

test("uses masked raster weathering instead of generated SVG geometry", async () => {
  const source = await readFile(path.join(root, "components/studio/PaperWeatheringOverlay.tsx"), "utf8");
  assert.doesNotMatch(source, /<(?:svg|ellipse|path|circle|line)\b/);
  assert.match(source, /maskImage/);
  assert.match(source, /mixBlendMode/);
  assert.match(source, /data-weathering-effect/);
});

test("keeps browser-edited text outside React child reconciliation", async () => {
  const { editableTextHtml, storyBodyHtml } = await vite.ssrLoadModule("/lib/news/editable-html.ts");
  const source = await readFile(path.join(root, "components/studio/NewspaperPage.tsx"), "utf8");
  const controller = await readFile(path.join(root, "components/studio/InlineTextFormattingController.tsx"), "utf8");

  assert.equal(editableTextHtml('<New & "Improved">'), "&lt;New &amp; &quot;Improved&quot;&gt;");
  assert.equal(storyBodyHtml("First <dispatch>.\n\nSecond & final."), "<p>First &lt;dispatch&gt;.</p><p>Second &amp; final.</p>");
  assert.match(source, /dangerouslySetInnerHTML/);
  assert.match(source, /document\.activeElement === element/);
  assert.match(source, /onInput=/);
  assert.match(source, /dangerouslySetInnerHTML=\{finalized \?/);
  assert.match(source, /dangerouslySetInnerHTML=\{isBrowserEditable \?/);
  assert.doesNotMatch(source, /empty-copy-placeholder/);
  assert.doesNotMatch(controller, /collectRegions/);
  assert.match(controller, /regionFromElement/);
});
