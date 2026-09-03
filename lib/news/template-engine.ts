import { arrangeParagraphs, recipeParagraphs } from "./story-recipes";
import type { RenderedStoryTemplate, StoryTemplate } from "./story-template";
import { titleForTone } from "./story-template";
import type { StoryLength, StoryTone } from "./types";
import { firstNames, helperPools, locations, surnames } from "./vocabulary";

export type Rng = () => number;

const mottoOpeners = [
  "A Clear Account", "A Faithful Record", "All the News", "At Every Bell", "From Gate to Hall", "From Quay to Crown",
  "In Service to the Realm", "Ink Before Rumor", "News Before Nightfall", "No Fear, No Favor", "The City Recorded",
  "The Public Chronicle", "The Realm in Print", "The Record Endures", "The Watchful Press", "Truth Before Torchlight",
] as const;
const mottoClosers = [
  "Each Marketday", "For Every Ward", "For Hearth and Hall", "For the Common Good", "From Dawn to Dusk", "In Unquiet Times",
  "Set Down in Ink", "Since the First Bell", "Through Storm and Spell", "Under the Public Seal", "Without Fear or Favor",
  "Worth Knowing", "Written Plainly", "Across the Provinces", "Before the Ink Dries", "For Readers Near and Far",
] as const;
const mottos = mottoOpeners.flatMap((opening) => mottoClosers.map((closing) => `${opening} · ${closing}`));

const mastheadPrefixes = [
  "The Argent", "The Blackwater", "The Brass", "The Crown", "The Daily", "The Emberwatch", "The Free", "The Grand",
  "The Iron", "The Lantern", "The Northward", "The Provincial", "The Royal", "The Seven Bells", "The Silver",
  "The Wandering", "The Watchful", "The Westreach", "The White", "The Wyrmford",
] as const;
const mastheadSuffixes = [
  "Broadsheet", "Chronicle", "Clarion", "Courier", "Dispatch", "Gazette", "Herald", "Journal", "Ledger", "Post",
  "Register", "Sentinel", "Standard", "Times", "Tribune", "Trumpet",
] as const;

const titlesByTone: Record<StoryTone, readonly string[]> = {
  straight: [
    "City Correspondent", "Civic Editor", "Court Reporter", "Desk Reporter", "District Reporter", "Guild Correspondent",
    "Markets Editor", "Morning Reporter", "Provincial Correspondent", "Quayside Reporter", "Road Correspondent", "Staff Writer",
  ],
  sensational: [
    "Breaking News Editor", "Chief Investigator", "Eye-Witness Reporter", "Late Edition Correspondent", "Night Editor",
    "Pressroom Investigator", "Special Investigator", "Torchlight Correspondent", "Watch-House Reporter", "Weekend Investigator",
  ],
  gossipy: [
    "Assembly Rooms Correspondent", "Court Observer", "Court Whisperer", "Fashionable Intelligence Editor", "Palace Correspondent",
    "Salon Observer", "Society Correspondent", "Supper Desk", "Theatre Correspondent", "Your Faithful Observer",
  ],
  ominous: [
    "After-Dark Correspondent", "Archive Investigator", "Night Watch Desk", "Reporter at Large", "Special Correspondent",
    "Twilight Desk", "Unusual Affairs Editor", "Watch Desk", "Weather Eye", "West Gate Correspondent",
  ],
};

const eras = [
  "Age of Embers", "Common Era", "Dragonfall Reckoning", "King's Calendar", "Revised Crown Calendar", "Third Compact",
  "Year of the Crown", "Years Since the Concord",
] as const;
const months = [
  "Deepfrost", "Frostwane", "Rainmoot", "Greengrowth", "Bloomtide", "Highsun", "Midsummer", "Reaping",
  "Harvestwane", "Leafturn", "Longnight", "Emberend",
] as const;

export function pick<T>(rng: Rng, values: readonly T[]) {
  return values[Math.min(values.length - 1, Math.floor(rng() * values.length))];
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
  if (/^(a|an|the)\s/i.test(value)) return value;
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

function helperName(expression: string) {
  return expression.split(":", 1)[0].replace(/\d+$/, "");
}

function valueAlreadyUsed(helper: string, value: string, values: ReadonlyMap<string, string>) {
  return [...values.entries()].some(([key, existing]) => helperName(key) === helper && existing === value);
}

function drawUnique(helper: string, pool: readonly string[], rng: Rng, values: ReadonlyMap<string, string>) {
  let value = pick(rng, pool);
  for (let attempt = 0; attempt < 24 && valueAlreadyUsed(helper, value, values); attempt += 1) value = pick(rng, pool);
  return valueAlreadyUsed(helper, value, values)
    ? pool.find((candidate) => !valueAlreadyUsed(helper, candidate, values)) ?? value
    : value;
}

function resolveToken(expression: string, rng: Rng, values: ReadonlyMap<string, string>) {
  const [helperWithIndex, argument] = expression.split(":", 2);
  const helper = helperWithIndex.replace(/\d+$/, "");
  if (helper === "person") return drawUnique(helper, people, rng, values);
  if (helper === "number") {
    const [minimum, maximum] = (argument ?? "1-20").split("-").map(Number);
    return String(minimum + Math.floor(rng() * (maximum - minimum + 1)));
  }
  if (helper === "choice") return pick(rng, (argument ?? "one/two").split("/"));
  if (helper === "bell") {
    const bell = 1 + Math.floor(rng() * 12);
    const suffix = bell === 1 ? "st" : bell === 2 ? "nd" : bell === 3 ? "rd" : "th";
    return `${bell}${suffix} bell`;
  }
  if (helper === "gold") return `${10 + Math.floor(rng() * 491)} gold crowns`;
  if (helper === "silver") return `${2 + Math.floor(rng() * 39)} silver pieces`;
  if (helper === "percent") return `${5 + Math.floor(rng() * 46)} percent`;
  if (helper === "distance") return `${2 + Math.floor(rng() * 59)} miles`;
  const pool = helperPools[helper as keyof typeof helperPools];
  return pool ? drawUnique(helper, pool, rng, values) : helper;
}

export const people = firstNames.flatMap((firstName) => surnames.map((surname) => `${firstName} ${surname}`));

export function renderText(source: string, rng: Rng, values = new Map<string, string>()) {
  const rendered = source.replace(/\{\{([^{}]+)\}\}/g, (_match, token: string) => {
    const [expression, ...modifiers] = token.split("|");
    if (!values.has(expression)) values.set(expression, resolveToken(expression, rng, values));
    return modifiers.reduce((current, modifier) => applyModifier(current, modifier), values.get(expression) ?? expression);
  });
  return rendered.replace(/(^|[.!?]\s+)(the)\b/g, "$1The");
}

export function renderStoryTemplate(
  template: StoryTemplate,
  tone: StoryTone,
  rng: Rng,
  length: StoryLength = "standard",
): RenderedStoryTemplate {
  const values = new Map<string, string>();
  const title = renderText(titleForTone(template, tone), rng, values);
  const kicker = renderText(template.kicker, rng, values);
  const dek = renderText(template.dek, rng, values);
  const baseParagraphs = template.paragraphs.map((paragraph) => renderText(paragraph, rng, values));
  const extras = recipeParagraphs(template.category, tone, rng).map((paragraph) => renderText(paragraph, rng, values));
  const primaryLocation = values.get("location") ?? drawUnique("location", locations, rng, values);
  values.set("location", primaryLocation);

  return {
    title,
    kicker,
    dek,
    paragraphs: arrangeParagraphs(baseParagraphs, extras, length, rng),
    illustrationId: template.illustrationId,
    kind: template.kind,
    facts: Object.fromEntries(values),
    primaryLocation,
  };
}

export function randomPerson(rng: Rng = Math.random) {
  return pick(rng, people);
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
  return `${1 + Math.floor(rng() * 28)} ${pick(rng, months)}, ${112 + Math.floor(rng() * 888)} ${pick(rng, eras)}`;
}
