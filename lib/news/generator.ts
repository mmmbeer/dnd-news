import { storyIllustrations } from "./illustrations";
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
import { storyTemplates, templatesForCategory } from "./templates";
import type {
  GeneratorOptions,
  NewsStory,
  NewspaperIssue,
  StoryCategory,
  StoryLength,
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

function paragraphsFor(length: StoryLength, paragraphs: string[]) {
  const count = length === "brief" ? 1 : length === "standard" ? 2 : 3;
  return paragraphs.slice(0, count).join("\n\n");
}

export function generateStory(seed: string, options: GeneratorOptions, index = 0): NewsStory {
  const rng = seededRandom(`${seed}:${index}`);
  const category = resolveCategory(options.category, rng);
  const template = pick(rng, templatesForCategory(category));
  const copy = renderStoryTemplate(template, options.tone, rng);
  const kind = options.length === "brief" && !copy.kind ? "brief" : copy.kind ?? "news";

  return {
    id: makeId("generated"),
    title: copy.title,
    kicker: copy.kicker,
    dek: copy.dek,
    byline: randomByline(options.tone, rng),
    location: randomLocation(rng).toUpperCase(),
    body: paragraphsFor(options.length, copy.paragraphs),
    kind,
    width: kind === "brief" || kind === "notice" || kind === "advert" ? "standard" : chance(rng, 0.24) ? "wide" : "standard",
    category,
    generated: true,
    locked: false,
    illustrationId: copy.illustrationId,
  };
}

export function generateStories(seed: string, count: number, options: GeneratorOptions) {
  return Array.from({ length: count }, (_, index) => generateStory(seed, options, index));
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
  };
}

export function createInitialIssue(): NewspaperIssue {
  const seed = "blackwater-press";
  const filler = generateStories(seed, 5, { category: "any", tone: "straight", length: "standard" });
  const preset = getNewspaperPreset("blackwater");
  const lead: NewsStory = {
    id: "custom-lead",
    title: "The Bell Beneath Blackwater Rings Again",
    kicker: "Late Edition · Exclusive",
    dek: "After eighty silent years, the drowned bell has sounded three times. The river watch has closed the lower quay.",
    byline: "Mira Bellweather, Senior Correspondent",
    location: "BLACKWATER",
    body: "The bell beneath the old river chapel rang at thirteen minutes past midnight, waking residents from Dock Ward to Lantern Hill. There is no surviving rope, tower or dry passage to the chamber where the bell is believed to rest.\n\nHarbormaster Elian Reed ordered the lower quay closed after patrol boats reported lights moving beneath the water. The Watch has requested assistance from divers, priests and anyone familiar with pre-imperial wards.\n\nNo one is missing, officials say. At press time, however, every dog along the south bank was facing the river.",
    kind: "lead",
    width: "full",
    category: "adventure",
    generated: false,
    locked: true,
    illustrationId: "dungeon-stairs",
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
    stories: [lead, ...filler],
  };
}

export function randomIllustrationForCategory(category: Exclude<StoryCategory, "any">, rng: () => number = Math.random) {
  return pick(rng, storyIllustrations.filter((illustration) => illustration.category === category)).id;
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
