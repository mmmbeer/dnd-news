import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const catalogUrl = new URL("../lib/news/public-domain-art.json", import.meta.url);
const projectUrl = new URL("../", import.meta.url);
const validCategories = new Set([
  "civic", "guilds", "crime", "arcane", "trade", "travel",
  "weather", "society", "culture", "adventure", "notices",
]);

test("ships a provenance-tracked public-domain art pool", async () => {
  const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
  const illustrations = catalog.filter((artwork) => artwork.kind === "illustration");
  const cartoons = catalog.filter((artwork) => artwork.kind === "cartoon");

  assert.ok(catalog.length >= 50 && catalog.length <= 100);
  assert.ok(illustrations.length >= 50);
  assert.ok(cartoons.length >= 10);
  assert.equal(new Set(catalog.map((artwork) => artwork.id)).size, catalog.length);
  assert.equal(new Set(catalog.map((artwork) => artwork.src)).size, catalog.length);

  for (const artwork of catalog) {
    assert.match(artwork.sourcePage, /^https:\/\/commons\.wikimedia\.org\//);
    assert.ok(artwork.license === "Public domain" || artwork.license === "CC0");
    assert.ok(artwork.categories.length >= 2);
    assert.ok(artwork.categories.every((category) => validCategories.has(category)));

    const imageUrl = new URL(`public${artwork.src}`, projectUrl);
    const image = await readFile(imageUrl);
    assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(image.readUInt32BE(16), 512);
    assert.equal(image.readUInt32BE(20), 512);
    assert.equal(image[24], 8, `${artwork.id} must preserve 8-bit tonal shading`);
    assert.ok([4, 6].includes(image[25]), `${artwork.id} must include alpha rather than one-bit grayscale`);
    assert.match(artwork.transformation, /tonal grayscale shading/);
  }
});
