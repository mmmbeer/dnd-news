import assert from "node:assert/strict";
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

test("offers ten newspaper templates including the five extended presets", async () => {
  const { newspaperPresets } = await vite.ssrLoadModule("/lib/news/presets.ts");
  assert.equal(newspaperPresets.length, 10);
  for (const id of ["silver-quill", "watchman", "mercantile", "arcane-herald", "frontier"]) {
    assert.ok(newspaperPresets.some((preset) => preset.id === id), `missing ${id}`);
  }
});

test("exposes expanded masthead, headline and body font families", async () => {
  const { mastheadFontOptions, headlineFontOptions, bodyFontOptions, fontFamilyFor } = await vite.ssrLoadModule("/lib/news/fonts.ts");
  assert.equal(mastheadFontOptions.length, 10);
  assert.equal(headlineFontOptions.length, 10);
  assert.equal(bodyFontOptions.length, 10);
  assert.match(fontFamilyFor("masthead", "didone"), /Bodoni|Didot/);
  assert.match(fontFamilyFor("body", "typewriter"), /Courier/);
});

test("maps paper age monotonically across 25 weathering overlays", async () => {
  const { paperWeatheringOverlays, weatheringLevelForAge, weatheringOverlayForAge } = await vite.ssrLoadModule("/lib/news/weathering.ts");
  assert.equal(paperWeatheringOverlays.length, 25);
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
});
