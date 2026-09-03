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

test("ships ten distinct newspaper defaults", async () => {
  const { newspaperPresets } = await vite.ssrLoadModule("/lib/news/presets.ts");
  assert.equal(newspaperPresets.length, 10);
  assert.equal(new Set(newspaperPresets.map((preset) => preset.id)).size, 10);
  assert.equal(new Set(newspaperPresets.map((preset) => preset.settings.newspaperName)).size, 10);
  assert.ok(newspaperPresets.every((preset) => !preset.settings.showRules));
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

test("builds open-ended helper vocabularies with at least one hundred outcomes", async () => {
  const { openEndedHelperPoolSizes } = await vite.ssrLoadModule("/lib/news/vocabulary.ts");
  const { people, randomMotto, randomNewspaperName } = await vite.ssrLoadModule("/lib/news/template-engine.ts");
  const { seededRandom } = await vite.ssrLoadModule("/lib/news/generator.ts");

  assert.ok(people.length >= 100);
  for (const [helper, size] of Object.entries(openEndedHelperPoolSizes)) {
    assert.ok(size >= 100, `${helper} only has ${size} outcomes`);
  }

  const mastheads = new Set();
  const mottos = new Set();
  for (let index = 0; index < 500; index += 1) {
    const rng = seededRandom(`publication-${index}`);
    mastheads.add(randomNewspaperName(rng));
    mottos.add(randomMotto(rng));
  }
  assert.ok(mastheads.size >= 200);
  assert.ok(mottos.size >= 200);
});

test("links token modifiers and indexed facts without changing their identities", async () => {
  const { renderText } = await vite.ssrLoadModule("/lib/news/template-engine.ts");
  const { seededRandom } = await vite.ssrLoadModule("/lib/news/generator.ts");
  const values = new Map();
  const rendered = renderText(
    "{{location}}|{{location|upper}}|{{person}}|{{person|upper}}|{{person2}}|{{direction}}|{{direction2}}",
    seededRandom("linked-facts"),
    values,
  );
  const [location, upperLocation, person, upperPerson, secondPerson, direction, secondDirection] = rendered.split("|");

  assert.equal(upperLocation, location.toUpperCase());
  assert.equal(upperPerson, person.toUpperCase());
  assert.notEqual(person, secondPerson);
  assert.notEqual(direction, secondDirection);
  assert.equal(values.get("location"), location);
});

test("produces length-aware articles with shared datelines and deterministic facts", async () => {
  const { generateStory } = await vite.ssrLoadModule("/lib/news/generator.ts");
  const options = { category: "civic", tone: "ominous", length: "long" };
  const first = generateStory("linked-article", options, 4);
  const second = generateStory("linked-article", options, 4);
  const brief = generateStory("linked-article", { ...options, length: "brief" }, 4);
  const standard = generateStory("linked-article", { ...options, length: "standard" }, 4);

  assert.equal(brief.body.split("\n\n").length, 2);
  assert.equal(standard.body.split("\n\n").length, 5);
  assert.equal(first.body.split("\n\n").length, 8);
  assert.ok(first.body.split(/\s+/).length > standard.body.split(/\s+/).length);
  assert.ok(standard.body.split(/\s+/).length > brief.body.split(/\s+/).length);
  assert.deepEqual({ ...first, id: "stable" }, { ...second, id: "stable" });
});

test("varies article structures while keeping placed art tied to its story", async () => {
  const { generateStory } = await vite.ssrLoadModule("/lib/news/generator.ts");
  const { illustrationById } = await vite.ssrLoadModule("/lib/news/illustrations.ts");
  const stories = Array.from({ length: 600 }, (_, index) => (
    generateStory(`variety-${index}`, { category: "any", tone: "gossipy", length: "long" }, index)
  ));
  const bodies = new Set(stories.map((story) => story.body));
  const illustrated = stories.filter((story) => story.illustrationId);

  assert.ok(bodies.size >= 590);
  assert.ok(stories.filter((story) => story.body.includes('"')).length >= 150);
  for (const story of illustrated) {
    const illustration = illustrationById.get(story.illustrationId);
    assert.ok(illustration?.categories.includes(story.category));
    assert.ok(story.illustrationCaption);
    assert.ok(
      story.illustrationCaption.includes(story.title) || story.illustrationCaption.toUpperCase().includes(story.location),
      story.illustrationCaption,
    );
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

test("generates public-domain cartoons as standalone one-column comics", async () => {
  const { createInitialIssue, ensureComicColumn, generateComic, generateStories, generateStory } = await vite.ssrLoadModule("/lib/news/generator.ts");
  const { illustrationById } = await vite.ssrLoadModule("/lib/news/illustrations.ts");

  const generatedComics = Array.from({ length: 200 }, (_, index) => generateComic(`comic-${index}`, index));
  const cartoonIds = new Set(generatedComics.map((comic) => comic.illustrationId));

  assert.equal(cartoonIds.size, 13);
  for (const comic of generatedComics) {
    assert.equal(comic.kind, "comic");
    assert.equal(comic.width, "standard");
    assert.equal(comic.body, "");
    assert.equal(illustrationById.get(comic.illustrationId)?.kind, "cartoon");
    assert.equal(comic.illustrationAlign, "center");
  }

  const initialIssue = createInitialIssue();
  assert.equal(initialIssue.stories.filter((story) => story.kind === "comic").length, 1);

  const storiesOnly = generateStories("legacy-issue", 5, { category: "any", tone: "straight", length: "standard" });
  const migratedLineup = ensureComicColumn("legacy-issue", storiesOnly);
  assert.equal(migratedLineup.length, storiesOnly.length + 1);
  assert.equal(migratedLineup.filter((story) => story.kind === "comic").length, 1);

  for (let index = 0; index < 200; index += 1) {
    const story = generateStory(`story-${index}`, { category: "any", tone: "straight", length: "standard" }, index);
    if (story.illustrationId) assert.notEqual(illustrationById.get(story.illustrationId)?.kind, "cartoon");
  }
});

test("keeps randomized story art rare and usually aligned with flowing text", async () => {
  const { generateStory } = await vite.ssrLoadModule("/lib/news/generator.ts");
  const stories = Array.from({ length: 1_000 }, (_, index) => (
    generateStory(`rare-art-${index}`, { category: "any", tone: "straight", length: "standard" }, index)
  ));
  const illustrated = stories.filter((story) => story.illustrationId);
  const floated = illustrated.filter((story) => story.illustrationAlign === "left" || story.illustrationAlign === "right");

  assert.ok(illustrated.length >= 70 && illustrated.length <= 150);
  assert.ok(floated.length / illustrated.length >= 0.85);
});

test("validates share snapshots and fixes their lifetime at thirty days", async () => {
  const { createInitialIssue } = await vite.ssrLoadModule("/lib/news/generator.ts");
  const { MAX_SNAPSHOT_BYTES, newspaperIssueSchema, SHARE_LIFETIME_MS, snapshotByteLength, uuidPattern } = await vite.ssrLoadModule("/lib/news/sharing.ts");
  const issue = createInitialIssue("share-test-seed");

  assert.equal(newspaperIssueSchema.safeParse(issue).success, true);
  assert.equal(SHARE_LIFETIME_MS, 30 * 24 * 60 * 60 * 1000);
  assert.ok(snapshotByteLength(JSON.stringify(issue)) < MAX_SNAPSHOT_BYTES);
  assert.equal(uuidPattern.test("96cc8f56-c916-4c84-8bb0-76f7d60c0ef4"), true);
  assert.equal(uuidPattern.test("not-a-share-id"), false);
  assert.equal(newspaperIssueSchema.safeParse({ ...issue, version: 2 }).success, false);
});
