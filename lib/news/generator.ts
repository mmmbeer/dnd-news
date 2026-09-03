import type {
  GeneratorOptions,
  NewsStory,
  NewspaperIssue,
  StoryCategory,
  StoryKind,
  StoryLength,
  StoryTone,
} from "./types";

type Rng = () => number;

const firstNames = [
  "Aldren", "Anja", "Bramble", "Calder", "Cassia", "Dain", "Delphine",
  "Edda", "Elian", "Fen", "Garrick", "Hesta", "Ilyra", "Jory", "Kael",
  "Liora", "Marden", "Mira", "Nim", "Odette", "Orin", "Pella", "Quill",
  "Rook", "Sabine", "Tamsin", "Ulric", "Vesper", "Wren", "Ysabet",
];

const surnames = [
  "Ashdown", "Bellweather", "Blackbriar", "Brassworth", "Candlewick",
  "Copperhand", "Crowhurst", "Deepwell", "Dusk", "Emberlain", "Fairlock",
  "Fallow", "Gannet", "Grey", "Hart", "Kestrel", "Morrow", "Nettle",
  "Pike", "Quarry", "Reed", "Rookwood", "Sable", "Thorne", "Vale",
  "Vintner", "Wicker", "Wolfe",
];

const locations = [
  "Blackwater", "Brasshaven", "Candlecross", "Dunmarrow", "Eastmere",
  "Emberwatch", "Fallowgate", "Gloamford", "Greyhaven", "High Bell",
  "Ironhollow", "Kingsfall", "Mistbridge", "Mournstead", "Northpass",
  "Old Barrow", "Ravensport", "Red Quarry", "Saint Orra", "Saltmere",
  "Thornwall", "Westreach", "White Lantern", "Wyrmford",
];

const regions = [
  "the Ash March", "the Bracken Coast", "the Crownlands", "the Frostward",
  "the Green Expanse", "the Iron Vale", "the Low Kingdoms", "the Moonweald",
  "the Sable Reach", "the Shattered Hills", "the Western Cantons",
];

const organizations = [
  "the Alchemists' Compact", "the Bellfounders' Guild", "the Bronze Council",
  "the Cartographers' Society", "the Chandlers' Union", "the Crown Office",
  "the Eastgate Watch", "the Ferrymen's League", "the Lantern Court",
  "the Masons' Chapter", "the Royal Menagerie", "the Salt Consortium",
  "the Sapphire Collegium", "the Teamsters' Guild", "the Third Archive",
];

const creatures = [
  "basilisk", "blink dog", "cockatrice", "displacer beast", "griffon",
  "hippogriff", "mimic", "owlbear", "pseudodragon", "rust monster",
  "specter", "troll", "wyvern",
];

const artifacts = [
  "an oracular brass key", "a crown of blue glass", "a door with no hinges",
  "a map that redraws itself", "a moon-silver reliquary", "a singing sword",
  "a stone egg warm to the touch", "a watch that counts backward",
  "the missing seal of Saint Vey", "three pages from an impossible atlas",
];

const goods = [
  "barley", "blue salt", "candle wax", "dragon pepper", "lamp oil", "oak",
  "river pearls", "saffron", "spell paper", "tin", "wool", "wyvern leather",
];

const phenomena = [
  "green lightning", "a rain of silver minnows", "bells ringing underground",
  "a second moon at dawn", "fog that whispers names", "warm snow",
  "shadows pointing north", "stars visible at midday",
];

const mottos = [
  "Truth Before Torchlight", "All the News Fit for the Realm", "The Realm, Recorded",
  "An Honest Account of Unquiet Times", "From Gatehouse to Great Hall",
  "News Without Fear or Favor", "Printed Each Marketday", "The Watchful Voice of the Ward",
];

const mastheadPrefixes = [
  "The Argent", "The Brass", "The Crown", "The Daily", "The Emberwatch",
  "The Free", "The Grand", "The Lantern", "The Northward", "The Royal",
  "The Seven Bells", "The Silver", "The Wandering", "The Westreach",
];

const mastheadSuffixes = [
  "Broadsheet", "Chronicle", "Clarion", "Courier", "Gazette", "Herald",
  "Ledger", "Post", "Register", "Sentinel", "Standard", "Times", "Trumpet",
];

const titlesByTone: Record<StoryTone, string[]> = {
  straight: ["Correspondent", "Desk Reporter", "Staff Writer", "Civic Editor"],
  sensational: ["Special Investigator", "Night Editor", "Eye-Witness Reporter"],
  gossipy: ["Society Correspondent", "Your Faithful Observer", "Court Whisperer"],
  ominous: ["Special Correspondent", "Watch Desk", "Reporter at Large"],
};

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed: string): Rng {
  let state = hashSeed(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: Rng, values: readonly T[]) {
  return values[Math.floor(rng() * values.length)];
}

function chance(rng: Rng, threshold = 0.5) {
  return rng() < threshold;
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function makeId(prefix = "story") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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

const categories: Exclude<StoryCategory, "any">[] = [
  "civic", "guilds", "crime", "arcane", "trade", "travel", "weather",
  "society", "culture", "adventure", "notices",
];

function resolveCategory(category: StoryCategory, rng: Rng) {
  return category === "any" ? pick(rng, categories) : category;
}

function toneHeadline(tone: StoryTone, direct: string, dramatic: string) {
  return tone === "straight" ? direct : dramatic;
}

function paragraphsFor(length: StoryLength, paragraphs: string[]) {
  const count = length === "brief" ? 1 : length === "standard" ? 2 : 3;
  return paragraphs.slice(0, count).join("\n\n");
}

interface StoryCopy {
  title: string;
  kicker: string;
  dek: string;
  paragraphs: string[];
  kind?: StoryKind;
}

function civicStory(rng: Rng, tone: StoryTone): StoryCopy {
  const place = randomLocation(rng);
  const org = pick(rng, organizations);
  const official = randomPerson(rng);
  const subject = pick(rng, ["curfew", "bridge toll", "market charter", "night watch budget", "street-mage registry"]);
  return {
    title: toneHeadline(tone, `${titleCase(subject)} Measure Advances`, `Council Erupts Over ${titleCase(subject)}`),
    kicker: "Council & Crown",
    dek: `${place} officials set a final vote for the next full council session.`,
    paragraphs: [
      `${place}'s council heard four hours of testimony before advancing a measure concerning the ${subject}. ${official}, speaking for ${org}, said the proposal would bring “order and plain accounting” to a matter long governed by custom.`,
      `Opponents packed the west gallery and answered each favorable speech with stamped boots. The clerk recorded three amendments, one broken quill and a request that all references to “reasonable magical interference” be defined before the vote.`,
      `The measure returns on Moonday. Until then, the old rules remain in force and the Watch has been instructed to use discretion, a phrase neither side found comforting.`,
    ],
  };
}

function guildStory(rng: Rng, tone: StoryTone): StoryCopy {
  const org = pick(rng, organizations);
  const good = pick(rng, goods);
  const place = randomLocation(rng);
  return {
    title: toneHeadline(tone, `${org} Reaches Accord`, `Guild Ultimatum Could Empty ${place}`),
    kicker: "Labor & Guilds",
    dek: `A late agreement may avert shortages of ${good} before marketday.`,
    paragraphs: [
      `Negotiators for ${org} emerged shortly before dawn with a provisional compact covering apprenticeship terms, night rates and the handling of enchanted tools. The agreement follows nine days of work stoppages across ${place}.`,
      `Journeymen will return to their shops after the first bell, though stewards warned that stockpiles of ${good} remain thin. Merchants have been asked not to raise prices while deliveries resume.`,
      `The compact must still be ratified in each guild hall. Two smaller chapters have already promised to reject it unless meal allowances include “food recognizably from this plane.”`,
    ],
  };
}

function crimeStory(rng: Rng, tone: StoryTone): StoryCopy {
  const place = randomLocation(rng);
  const item = pick(rng, artifacts);
  const creature = pick(rng, creatures);
  return {
    title: toneHeadline(tone, `Watch Seeks Leads in Archive Theft`, `${titleCase(item)} Vanishes Behind Locked Doors`),
    kicker: "Watch Report",
    dek: `No locks were broken, but witnesses report the unmistakable odor of a ${creature}.`,
    paragraphs: [
      `The night watch has sealed the lower archive in ${place} after the disappearance of ${item}. According to the duty scribe, the vault was checked at midnight and found empty one hour later.`,
      `Investigators recovered a ring of blue wax, several wet footprints and a feather that refuses to fall when dropped. Captain ${randomPerson(rng)} declined to name a suspect but asked apothecaries to report unusual purchases of lampblack.`,
      `A reward of ${20 + Math.floor(rng() * 80)} gold crowns has been posted. Citizens are warned not to approach anyone offering to sell historical objects that whisper after sunset.`,
    ],
  };
}

function arcaneStory(rng: Rng, tone: StoryTone): StoryCopy {
  const phenomenon = pick(rng, phenomena);
  const place = randomLocation(rng);
  const scholar = randomPerson(rng);
  return {
    title: toneHeadline(tone, `Collegium Studies ${titleCase(phenomenon)}`, `Experts Baffled as ${titleCase(phenomenon)} Engulfs ${place}`),
    kicker: "Arcane Affairs",
    dek: `Residents are urged to avoid mirrors, unattended circles and confident amateur explanations.`,
    paragraphs: [
      `${phenomenon} was observed over ${place} shortly after the third bell, prompting the Sapphire Collegium to close two courtyards and issue a notice of “managed scholarly concern.”`,
      `Professor ${scholar} said the event is probably natural, although that statement was revised after a nearby statue began answering questions in an unknown dialect. Samples have been collected in sealed lead jars.`,
      `No injuries have been confirmed. The Collegium asks anyone experiencing prophetic dreams to write them down in the present tense and deliver them before noon.`,
    ],
  };
}

function tradeStory(rng: Rng, tone: StoryTone): StoryCopy {
  const good = pick(rng, goods);
  const region = pick(rng, regions);
  const amount = 8 + Math.floor(rng() * 31);
  return {
    title: toneHeadline(tone, `${titleCase(good)} Prices Rise ${amount} Percent`, `${titleCase(good)} Panic Grips the Markets`),
    kicker: "Markets",
    dek: `Caravan delays in ${region} squeeze supplies while brokers dispute the cause.`,
    paragraphs: [
      `${titleCase(good)} opened at ${amount} percent above last marketday's close after three caravans failed to arrive from ${region}. Trading was orderly until midday, when a rumor of royal requisition emptied two warehouses.`,
      `Factors blamed weather, banditry and “unhelpful divination” in equal measure. The Salt Consortium expects prices to settle once the south road reopens.`,
      `Households are advised that substitutes remain available. The Gazette's kitchen desk confirms that ordinary pepper cannot replace dragon pepper in either quantity or legal liability.`,
    ],
  };
}

function travelStory(rng: Rng, tone: StoryTone): StoryCopy {
  const origin = randomLocation(rng);
  const destination = randomLocation(rng);
  const hazard = pick(rng, ["bandit activity", "a washed-out bridge", "giant spoor", "living fog", "unlicensed toll collectors"]);
  return {
    title: toneHeadline(tone, `${origin} Road Reopens Under Escort`, `Travelers Vanish Between ${origin} and ${destination}`),
    kicker: "Roads & Rivers",
    dek: `Officials advise daylight travel and groups of six or more.`,
    paragraphs: [
      `The post road from ${origin} to ${destination} has reopened with armed escorts after reports of ${hazard}. Coaches will depart at first and fifth bell until further notice.`,
      `The Teamsters' Guild says freight will be given priority for three days. Independent travelers may join a convoy for two silver pieces, not including feed or resurrection expenses.`,
      `Scouts mark the old mill at mile twelve as the last safe stopping point. Lantern signals from the northern wood are not official and should not be answered.`,
    ],
  };
}

function weatherStory(rng: Rng, tone: StoryTone): StoryCopy {
  const phenomenon = pick(rng, phenomena);
  const region = pick(rng, regions);
  return {
    title: toneHeadline(tone, `Unseasonable Conditions Cross ${region}`, `${titleCase(phenomenon)} Forecast Through Godsday`),
    kicker: "Weather & Almanac",
    dek: `Temple augurs disagree on timing but recommend securing livestock and loose memories.`,
    paragraphs: [
      `A band of ${phenomenon} is expected to cross ${region} by evening, according to the combined temple almanac. Temperatures will remain ordinary, except in cellars and rooms containing portraits.`,
      `River traffic may be delayed. Farmers should cover young plants with undyed cloth and bring any familiars indoors before the second bell.`,
      `The forecast carries a confidence of six rooks in ten. Readers who observe contradictory weather are asked to send particulars to the almanac desk.`,
    ],
    kind: "brief",
  };
}

function societyStory(rng: Rng, tone: StoryTone): StoryCopy {
  const host = randomPerson(rng);
  const place = randomLocation(rng);
  const guest = randomPerson(rng);
  return {
    title: toneHeadline(tone, `${host} Opens Winter Salon`, `Masks, Missteps and a Midnight Departure`),
    kicker: "Society",
    dek: `${place}'s season begins with seven courses and one conspicuously empty chair.`,
    paragraphs: [
      `${host} opened the winter season with a candlelit salon at the family residence in ${place}. Musicians from the Lantern Court performed while guests traded news beneath an illusion of a summer sky.`,
      `${guest} arrived after the soup course wearing mourning blue, then departed at midnight without cloak or carriage. Those nearest the east terrace claim a sealed letter changed hands.`,
      `The hostess described the evening as a complete success. Her steward asked this paper to clarify that the peacock was invited and the duelist was not.`,
    ],
  };
}

function cultureStory(rng: Rng, tone: StoryTone): StoryCopy {
  const place = randomLocation(rng);
  const work = pick(rng, ["The Duchess of Daggers", "A Map of Empty Rooms", "The Goblin's Almanac", "Seven Funerals for Spring"]);
  return {
    title: toneHeadline(tone, `${work} Opens at the Old Crown`, `Triumph or Treason? ${work} Divides ${place}`),
    kicker: "Arts & Letters",
    dek: `A crowded premiere earns loud applause, three walkouts and a formal complaint.`,
    paragraphs: [
      `${work} opened last night at the Old Crown Theatre before a full house. The new production favors spare scenery, practical thunder and a chorus positioned among the audience.`,
      `The second act drew the strongest response when lead player ${randomPerson(rng)} delivered the trial speech from atop the royal box. Critics praised the costumes but questioned whether the live gelatinous cube added meaning.`,
      `Performances continue through the month, subject to repairs. Patrons seated in the first two rows will be issued protective capes.`,
    ],
  };
}

function adventureStory(rng: Rng, tone: StoryTone): StoryCopy {
  const item = pick(rng, artifacts);
  const place = randomLocation(rng);
  const region = pick(rng, regions);
  return {
    title: toneHeadline(tone, `Expedition Sought for ${place} Survey`, `Who Will Brave the Ruins Beneath ${place}?`),
    kicker: "Beyond the Walls",
    dek: `Patrons offer coin and salvage rights for the recovery of ${item}.`,
    paragraphs: [
      `A private expedition is forming to inspect newly exposed chambers beneath ${place}. Floodwater receded last week, revealing a stair marked with the seal of a dynasty absent from every accepted history of ${region}.`,
      `The sponsors seek four to six capable persons familiar with traps, dead languages and tactful retreat. Payment begins at ${50 + Math.floor(rng() * 200)} gold crowns, with verified salvage divided by written agreement.`,
      `Interested parties should leave a copper feather at the White Lantern inn. Applicants who hear knocking from inside the feather are not to answer.`,
    ],
  };
}

function noticeStory(rng: Rng, tone: StoryTone): StoryCopy {
  const place = randomLocation(rng);
  const creature = pick(rng, creatures);
  const missing = pick(rng, ["an apprentice", "a ceremonial mace", "six homing pigeons", "a tax ledger", `a trained ${creature}`]);
  return {
    title: tone === "sensational" ? `REWARD! ${titleCase(missing)} Wanted` : `Public Notice: Missing ${titleCase(missing)}`,
    kicker: "Notices",
    dek: `Last seen near ${place}. Discretion requested; questions expected.`,
    paragraphs: [
      `${titleCase(missing)} has been missing since the final bell on Starday. A reward of ${5 + Math.floor(rng() * 45)} gold crowns is offered for safe return or information leading directly to recovery.`,
      `Do not approach if glowing, reciting legal doctrine or traveling in duplicate. Inquiries may be left with ${randomPerson(rng)} at the west gate.`,
    ],
    kind: chance(rng, 0.45) ? "advert" : "notice",
  };
}

const storyFactories: Record<Exclude<StoryCategory, "any">, (rng: Rng, tone: StoryTone) => StoryCopy> = {
  civic: civicStory,
  guilds: guildStory,
  crime: crimeStory,
  arcane: arcaneStory,
  trade: tradeStory,
  travel: travelStory,
  weather: weatherStory,
  society: societyStory,
  culture: cultureStory,
  adventure: adventureStory,
  notices: noticeStory,
};

export function generateStory(seed: string, options: GeneratorOptions, index = 0): NewsStory {
  const rng = seededRandom(`${seed}:${index}`);
  const category = resolveCategory(options.category, rng);
  const copy = storyFactories[category](rng, options.tone);
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
  };
}

export function createInitialIssue(): NewspaperIssue {
  const seed = "blackwater-press";
  const filler = generateStories(seed, 5, { category: "any", tone: "straight", length: "standard" });
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
  };

  return {
    version: 1,
    seed,
    settings: {
      newspaperName: "The Blackwater Chronicle",
      motto: "An Honest Account of Unquiet Times",
      publicationDate: "17 Harvestwane, 742 Common Era",
      dateline: "Blackwater & the Western Cantons",
      edition: "Evening Edition",
      price: "2 Copper",
      volume: "XLII",
      issueNumber: "118",
      columns: 4,
      pageSize: "broadsheet",
      mastheadFont: "blackletter",
      headlineFont: "classic",
      bodyFont: "news",
      bodySize: 10,
      lineHeight: 1.32,
      headlineScale: 1,
      colorTheme: "oxblood",
      paperTone: 35,
      showRules: true,
      justifyText: true,
      showDropCaps: true,
    },
    stories: [lead, ...filler],
  };
}

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
