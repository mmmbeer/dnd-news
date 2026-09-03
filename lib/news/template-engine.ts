import type { RenderedStoryTemplate, StoryTemplate } from "./story-template";
import { titleForTone } from "./story-template";
import type { StoryTone } from "./types";

export type Rng = () => number;

export const firstNames = [
  "Aldren", "Anja", "Bramble", "Calder", "Cassia", "Dain", "Delphine", "Edda", "Elian", "Fen",
  "Garrick", "Hesta", "Ilyra", "Jory", "Kael", "Liora", "Marden", "Mira", "Nim", "Odette",
  "Orin", "Pella", "Quill", "Rook", "Sabine", "Tamsin", "Ulric", "Vesper", "Wren", "Ysabet",
];

export const surnames = [
  "Ashdown", "Bellweather", "Blackbriar", "Brassworth", "Candlewick", "Copperhand", "Crowhurst",
  "Deepwell", "Dusk", "Emberlain", "Fairlock", "Fallow", "Gannet", "Grey", "Hart", "Kestrel",
  "Morrow", "Nettle", "Pike", "Quarry", "Reed", "Rookwood", "Sable", "Thorne", "Vale", "Vintner",
  "Wicker", "Wolfe",
];

export const locations = [
  "Blackwater", "Brasshaven", "Candlecross", "Dunmarrow", "Eastmere", "Emberwatch", "Fallowgate",
  "Gloamford", "Greyhaven", "High Bell", "Ironhollow", "Kingsfall", "Mistbridge", "Mournstead",
  "Northpass", "Old Barrow", "Ravensport", "Red Quarry", "Saint Orra", "Saltmere", "Thornwall",
  "Westreach", "White Lantern", "Wyrmford",
];

const regions = [
  "the Ash March", "the Bracken Coast", "the Crownlands", "the Frostward", "the Green Expanse",
  "the Iron Vale", "the Low Kingdoms", "the Moonweald", "the Sable Reach", "the Shattered Hills",
  "the Western Cantons",
];

const organizations = [
  "the Alchemists' Compact", "the Bellfounders' Guild", "the Bronze Council", "the Cartographers' Society",
  "the Chandlers' Union", "the Crown Office", "the Eastgate Watch", "the Ferrymen's League",
  "the Lantern Court", "the Masons' Chapter", "the Royal Menagerie", "the Salt Consortium",
  "the Sapphire Collegium", "the Teamsters' Guild", "the Third Archive",
];

const creatures = [
  "basilisk", "blink dog", "cockatrice", "displacer beast", "griffon", "hippogriff", "mimic", "owlbear",
  "pseudodragon", "rust monster", "specter", "troll", "wyvern",
];

const artifacts = [
  "an oracular brass key", "a crown of blue glass", "a door with no hinges", "a map that redraws itself",
  "a moon-silver reliquary", "a singing sword", "a stone egg warm to the touch", "a watch that counts backward",
  "the missing seal of Saint Vey", "three pages from an impossible atlas",
];

const goods = [
  "barley", "blue salt", "candle wax", "dragon pepper", "lamp oil", "oak", "river pearls", "saffron",
  "spell paper", "tin", "wool", "wyvern leather",
];

const phenomena = [
  "green lightning", "a rain of silver minnows", "bells ringing underground", "a second moon at dawn",
  "fog that whispers names", "warm snow", "shadows pointing north", "stars visible at midday",
];

const professions = [
  "apothecary", "armorer", "baker", "barrister", "carter", "chandler", "cooper", "ferryman", "glassblower",
  "herbalist", "innkeeper", "mason", "scribe", "surveyor", "tanner", "weaver",
];

const inns = [
  "the Brass Griffin", "the Crooked Candle", "the Drowned Bell", "the Fox and Flagon", "the Golden Goose",
  "the Moon & Mortar", "the Queen's Lantern", "the Sleeping Wyvern", "the Three Badgers", "the White Stag",
];

const streets = [
  "Abbey Lane", "Bellfounders Row", "Candle Street", "Copper Court", "Dock Road", "Gallows End",
  "Lantern Walk", "Old King Street", "Saint Vey Square", "Weavers Close",
];

const temples = [
  "the Dawn Chapel", "the House of Seven Lamps", "the Moon Basilica", "Saint Orra's Shrine",
  "the Temple of the Turning Wheel", "the Vigilant Hall",
];

const colors = ["amber", "black", "blue", "crimson", "emerald", "gold", "ivory", "silver", "violet", "white"];
const weekdays = ["Moonday", "Towerday", "Windsday", "Godsday", "Fireday", "Starday", "Sunday"];
const directions = ["north", "south", "east", "west", "upriver", "downriver"];
const spellSchools = ["abjuration", "conjuration", "divination", "enchantment", "evocation", "illusion", "necromancy", "transmutation"];
const festivals = ["Founders' Day", "Lantern Night", "Midsummer Fair", "River Blessing", "Saint Orra's Feast", "Wintermarket"];

const helperPools: Record<string, readonly string[]> = {
  artifact: artifacts,
  color: colors,
  creature: creatures,
  direction: directions,
  festival: festivals,
  good: goods,
  inn: inns,
  location: locations,
  organization: organizations,
  phenomenon: phenomena,
  profession: professions,
  region: regions,
  spellSchool: spellSchools,
  street: streets,
  temple: temples,
  weekday: weekdays,
};

const mottos = [
  "Truth Before Torchlight", "All the News Fit for the Realm", "The Realm, Recorded",
  "An Honest Account of Unquiet Times", "From Gatehouse to Great Hall", "News Without Fear or Favor",
  "Printed Each Marketday", "The Watchful Voice of the Ward",
];
const mastheadPrefixes = [
  "The Argent", "The Brass", "The Crown", "The Daily", "The Emberwatch", "The Free", "The Grand",
  "The Lantern", "The Northward", "The Royal", "The Seven Bells", "The Silver", "The Wandering", "The Westreach",
];
const mastheadSuffixes = [
  "Broadsheet", "Chronicle", "Clarion", "Courier", "Gazette", "Herald", "Ledger", "Post", "Register",
  "Sentinel", "Standard", "Times", "Trumpet",
];
const titlesByTone: Record<StoryTone, string[]> = {
  straight: ["Correspondent", "Desk Reporter", "Staff Writer", "Civic Editor"],
  sensational: ["Special Investigator", "Night Editor", "Eye-Witness Reporter"],
  gossipy: ["Society Correspondent", "Your Faithful Observer", "Court Whisperer"],
  ominous: ["Special Correspondent", "Watch Desk", "Reporter at Large"],
};

export function pick<T>(rng: Rng, values: readonly T[]) {
  return values[Math.floor(rng() * values.length)];
}

export function chance(rng: Rng, threshold = 0.5) {
  return rng() < threshold;
}

export function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/(['’])S\b/g, "$1s");
}

function pluralize(value: string) {
  if (/[^aeiou]y$/i.test(value)) return `${value.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/i.test(value)) return `${value}es`;
  return `${value}s`;
}

function withArticle(value: string) {
  return `${/^[aeiou]/i.test(value) ? "an" : "a"} ${value}`;
}

function applyModifier(value: string, modifier?: string) {
  if (modifier === "title") return titleCase(value);
  if (modifier === "upper") return value.toUpperCase();
  if (modifier === "lower") return value.toLowerCase();
  if (modifier === "article") return withArticle(value);
  if (modifier === "plural") return pluralize(value);
  return value;
}

function resolveToken(token: string, rng: Rng) {
  const [expression, ...modifiers] = token.split("|");
  const [helperWithIndex, argument] = expression.split(":", 2);
  const helper = helperWithIndex.replace(/\d+$/, "");
  let value: string;
  if (helper === "person") value = randomPerson(rng);
  else if (helper === "number") {
    const [minimum, maximum] = (argument ?? "1-20").split("-").map(Number);
    value = String(minimum + Math.floor(rng() * (maximum - minimum + 1)));
  } else if (helper === "choice") value = pick(rng, (argument ?? "one/two").split("/"));
  else if (helper === "bell") {
    const bell = 1 + Math.floor(rng() * 12);
    const suffix = bell === 1 ? "st" : bell === 2 ? "nd" : bell === 3 ? "rd" : "th";
    value = `${bell}${suffix} bell`;
  }
  else if (helper === "gold") value = `${10 + Math.floor(rng() * 241)} gold crowns`;
  else if (helper === "silver") value = `${2 + Math.floor(rng() * 19)} silver pieces`;
  else if (helper === "percent") value = `${5 + Math.floor(rng() * 36)} percent`;
  else if (helper === "distance") value = `${2 + Math.floor(rng() * 29)} miles`;
  else value = pick(rng, helperPools[helper] ?? [helper]);
  return modifiers.reduce((current, modifier) => applyModifier(current, modifier), value);
}

export function renderText(source: string, rng: Rng, values = new Map<string, string>()) {
  return source.replace(/\{\{([^{}]+)\}\}/g, (_match, token: string) => {
    if (!values.has(token)) values.set(token, resolveToken(token, rng));
    return values.get(token) ?? token;
  });
}

export function renderStoryTemplate(template: StoryTemplate, tone: StoryTone, rng: Rng): RenderedStoryTemplate {
  const values = new Map<string, string>();
  return {
    title: renderText(titleForTone(template, tone), rng, values),
    kicker: renderText(template.kicker, rng, values),
    dek: renderText(template.dek, rng, values),
    paragraphs: template.paragraphs.map((paragraph) => renderText(paragraph, rng, values)),
    illustrationId: template.illustrationId,
    kind: template.kind,
  };
}

export function randomPerson(rng: Rng = Math.random) {
  return `${pick(rng, firstNames)} ${pick(rng, surnames)}`;
}

export function randomLocation(rng: Rng = Math.random) {
  return pick(rng, locations);
}

export function randomNewspaperName(rng: Rng = Math.random) {
  return `${pick(rng, mastheadPrefixes)} ${pick(rng, mastheadSuffixes)}`;
}

export function randomMotto(rng: Rng = Math.random) {
  return pick(rng, mottos);
}

export function randomByline(tone: StoryTone = "straight", rng: Rng = Math.random) {
  return `${randomPerson(rng)}, ${pick(rng, titlesByTone[tone])}`;
}

export function randomDate(rng: Rng = Math.random) {
  const eras = ["Year of the Crown", "Dragonfall Reckoning", "Common Era", "Age of Embers"];
  const months = ["Deepfrost", "Rainmoot", "Greengrowth", "Highsun", "Harvestwane", "Longnight"];
  return `${1 + Math.floor(rng() * 28)} ${pick(rng, months)}, ${112 + Math.floor(rng() * 888)} ${pick(rng, eras)}`;
}
