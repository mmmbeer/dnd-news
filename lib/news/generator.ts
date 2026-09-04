import {
  captionForStory,
  illustrationById,
  randomCartoon,
  randomIllustration,
  randomIllustrationForStory,
  type IllustrationKind,
} from "./illustrations";
import { getNewspaperPreset } from "./presets";
import {
  chance,
  pick,
  randomByline,
  randomDate,
  randomLocation,
  randomMotto,
  randomNewspaperName,
  renderStoryTemplate,
} from "./template-engine";
import { fittedLoremBody } from "./fitted-lorem";
import { storyTemplates, templatesForCategory } from "./templates";
import type { StoryTemplate } from "./story-template";
import type {
  GeneratorOptions,
  NewsStory,
  NewspaperIssue,
  StoryCategory,
} from "./types";

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeId(prefix = "story") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const categories: Exclude<StoryCategory, "any">[] = [
  "civic", "guilds", "crime", "arcane", "trade", "travel", "weather", "society", "culture", "adventure", "notices",
];

function resolveCategory(category: StoryCategory, rng: () => number) {
  return category === "any" ? pick(rng, categories) : category;
}

const comicTitles = [
  "The Week in Ink",
  "From the Editorial Desk",
  "A View from the Pressroom",
  "The Cartoonist's Corner",
  "This Week's Editorial Cartoon",
];

const comicKickers = ["Editorial Cartoon", "Opinion", "The Ink Desk"];

function comicCreator(creator?: string) {
  if (creator?.toLowerCase().includes("nast")) return "Thomas Nast";
  return creator || "Staff Artist";
}

function randomIllustrationAlignment(rng: () => number) {
  const roll = rng();
  if (roll < 0.46) return "left" as const;
  if (roll < 0.92) return "right" as const;
  return "center" as const;
}

function generateStoryFromTemplate(
  seed: string,
  options: GeneratorOptions,
  index: number,
  selectedTemplate?: StoryTemplate,
): NewsStory {
  const rng = seededRandom(`${seed}:${index}`);
  const category = resolveCategory(options.category, rng);
  const template = selectedTemplate ?? pick(rng, templatesForCategory(category));
  const copy = renderStoryTemplate(template, options.tone, rng, options.length);
  const kind = options.length === "brief" && !copy.kind ? "brief" : copy.kind ?? "news";
  const illustrationChance = kind === "brief" || kind === "notice" || kind === "advert" ? 0.05 : 0.12;
  const illustrationId = chance(rng, illustrationChance)
    ? randomIllustrationForStory(
      category,
      [copy.title, copy.dek, ...copy.paragraphs].join(" "),
      copy.illustrationId,
      rng,
    )
    : null;
  return {
    id: makeId("generated"),
    title: copy.title,
    kicker: copy.kicker,
    dek: copy.dek,
    byline: randomByline(options.tone, rng),
    location: copy.primaryLocation.toUpperCase(),
    body: copy.paragraphs.join("\n\n"),
    kind,
    width: kind === "brief" || kind === "notice" || kind === "advert" ? "standard" : chance(rng, 0.24) ? "wide" : "standard",
    category,
    generated: true,
    locked: false,
    illustrationId,
    illustrationAlign: randomIllustrationAlignment(rng),
    illustrationFlow: "wrap",
    illustrationCaption: illustrationId
      ? captionForStory(illustrationId, copy.title, copy.primaryLocation, rng)
      : undefined,
  };
}

export function generateStory(seed: string, options: GeneratorOptions, index = 0): NewsStory {
  return generateStoryFromTemplate(seed, options, index);
}

export function generateStories(seed: string, count: number, options: GeneratorOptions) {
  const usedTemplates = new Set<string>();
  return Array.from({ length: count }, (_, index) => {
    const rng = seededRandom(`${seed}:${index}`);
    const category = resolveCategory(options.category, rng);
    const available = templatesForCategory(category).filter((template) => !usedTemplates.has(template.id));
    const template = pick(rng, available.length ? available : templatesForCategory(category));
    usedTemplates.add(template.id);
    return generateStoryFromTemplate(seed, options, index, template);
  });
}

export function generateComic(seed: string, index = 0): NewsStory {
  const rng = seededRandom(`${seed}:comic:${index}`);
  const illustrationId = randomCartoon(rng);
  const illustration = illustrationById.get(illustrationId);
  return {
    id: makeId("comic"),
    title: pick(rng, comicTitles),
    kicker: pick(rng, comicKickers),
    dek: "",
    byline: comicCreator(illustration?.creator),
    location: "",
    body: "",
    kind: "comic",
    width: "standard",
    category: illustration?.category ?? "civic",
    generated: true,
    locked: false,
    illustrationId,
    illustrationAlign: "center",
    illustrationFlow: "block",
    illustrationCaption: "Editorial cartoon",
  };
}

export function ensureComicColumn(seed: string, stories: NewsStory[]) {
  if (stories.some((story) => story.kind === "comic")) return stories;
  return [...stories, generateComic(seed, stories.length)];
}

export function createBlankStory(): NewsStory {
  return {
    id: makeId("custom"),
    title: "Untitled Story",
    kicker: "Local News",
    dek: "Add a short summary that tells readers why this story matters.",
    byline: "Your Name, Staff Writer",
    location: "YOUR CITY",
    body: "Write the story here. Separate paragraphs with a blank line.",
    kind: "news",
    width: "standard",
    category: "civic",
    generated: false,
    locked: true,
    illustrationId: null,
    illustrationAlign: "right",
    illustrationFlow: "wrap",
    illustrationCaption: "",
  };
}

export function createInitialIssue(seed = "blackwater-press"): NewspaperIssue {
  const filler = generateStories(seed, 5, { category: "any", tone: "straight", length: "standard" });
  const comic = generateComic(seed);
  const preset = getNewspaperPreset("blackwater");
  const lead: NewsStory = {
    id: "custom-lead",
    title: "DM: Replace This Title With Your Lead Story",
    kicker: "Dungeon Master's Lead Story",
    dek: "Replace this summary with the essential setup, stakes, and hook for your campaign's lead story.",
    byline: "Your Name, Dungeon Master",
    location: "YOUR CAMPAIGN LOCATION",
    body: fittedLoremBody(250, "dm-lead-placeholder"),
    bodyMode: "story",
    kind: "lead",
    width: "full",
    category: "adventure",
    generated: false,
    locked: true,
    illustrationId: "dungeon-stairs",
    illustrationAlign: "left",
    illustrationFlow: "wrap",
    illustrationCaption: "The drowned chapel steps beneath Blackwater, from an artist's reconstruction.",
  };

  return {
    version: 1,
    seed,
    settings: {
      ...preset.settings,
      publicationDate: "17 Harvestwane, 742 Common Era",
      volume: "XLII",
      issueNumber: "118",
    },
    stories: [lead, filler[0], filler[1], comic, ...filler.slice(2)],
  };
}

export function randomIllustrationForCategory(
  category: Exclude<StoryCategory, "any">,
  rng: () => number = Math.random,
  kind?: IllustrationKind,
) {
  return randomIllustration(category, rng, kind);
}

export {
  randomByline,
  randomDate,
  randomLocation,
  randomMotto,
  randomNewspaperName,
  storyTemplates,
};

export const categoryLabels: Record<StoryCategory, string> = {
  any: "Surprise me",
  civic: "Council & Crown",
  guilds: "Guilds & labor",
  crime: "Crime & watch",
  arcane: "Arcane affairs",
  trade: "Trade & markets",
  travel: "Roads & travel",
  weather: "Weather & almanac",
  society: "Society & gossip",
  culture: "Arts & culture",
  adventure: "Adventure hooks",
  notices: "Notices & adverts",
};
