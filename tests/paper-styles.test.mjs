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

test("changes template style and layout without replacing newspaper information", async () => {
  const { applyNewspaperPreset, getNewspaperPreset } = await vite.ssrLoadModule("/lib/news/presets.ts");
  const current = {
    ...getNewspaperPreset("blackwater").settings,
    newspaperName: "The User's Gazette",
    motto: "Facts Before Breakfast",
    publicationDate: "4 Emberfall",
    dateline: "Orlumbor and the Moonshae Isles",
    edition: "Dragon Extra",
    price: "7 Silver",
    volume: "IX",
    issueNumber: "44",
    footerLeft: "Printed by the party",
    footerRight: "Visit our campaign archive",
  };
  const updated = applyNewspaperPreset(current, "frontier");

  for (const key of ["newspaperName", "motto", "publicationDate", "dateline", "edition", "price", "volume", "issueNumber", "footerLeft", "footerRight"]) {
    assert.equal(updated[key], current[key], `${key} changed with the template`);
  }
  assert.equal(updated.presetId, "frontier");
  assert.equal(updated.columns, 3);
  assert.equal(updated.pageSize, "letter");
  assert.equal(updated.paperColor, "parchment");
});

test("offers expanded ink and paper palettes with balanced weathering profiles", async () => {
  const { colorThemeOptions, paperColorOptions, paperColorFor } = await vite.ssrLoadModule("/lib/news/paper-styles.ts");
  assert.equal(colorThemeOptions.length, 10);
  assert.equal(new Set(colorThemeOptions.map((option) => option.id)).size, colorThemeOptions.length);
  assert.equal(paperColorOptions.length, 8);
  assert.equal(paperColorFor(undefined).id, "white");
  assert.equal(paperColorOptions[0].id, "white");
  assert.ok(paperColorOptions.some((option) => option.id === "parchment"));
  assert.ok(paperColorOptions.filter((option) => option.id.includes("gray") || option.id === "newsprint").length >= 4);
  assert.ok(paperColorOptions.every((option) => option.weatheringOpacity > 0 && option.weatheringOpacity <= 1));
  assert.ok(paperColorOptions.every((option) => option.weatheringSaturation >= 0 && option.weatheringSaturation <= 1));
  assert.ok(
    paperColorOptions
      .filter((option) => option.id.includes("gray") || option.id === "newsprint")
      .every((option) => option.weatheringSaturation === 0),
  );
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
    assert.ok(raster.blendMode === "multiply" || raster.blendMode === "soft-light");
    await access(path.join(root, "public", raster.src));
  }
});

test("uses masked raster weathering instead of generated SVG geometry", async () => {
  const source = await readFile(path.join(root, "components/studio/PaperWeatheringOverlay.tsx"), "utf8");
  assert.doesNotMatch(source, /<(?:svg|ellipse|path|circle|line)\b/);
  assert.match(source, /maskImage/);
  assert.match(source, /mixBlendMode/);
  assert.match(source, /data-weathering-effect/);
  assert.match(source, /data-weathering-coverage/);
  assert.match(source, /opacityScale/);
  assert.match(source, /saturate\(\$\{saturation\}\)/);
  assert.match(source, /if \(isTexture\)/);
  assert.match(source, /width: "100%"/);
  assert.match(source, /height: "100%"/);
  assert.match(source, /objectFit: asset\.kind === "texture" \? "cover" : "contain"/);
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
