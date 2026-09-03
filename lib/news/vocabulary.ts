const combine = (
  left: readonly string[],
  right: readonly string[],
  join: (first: string, second: string) => string,
) => left.flatMap((first) => right.map((second) => join(first, second)));

export const firstNames = [
  "Aldren", "Anja", "Aric", "Beatrix", "Bramble", "Calder", "Cassia", "Corin", "Dain", "Delphine",
  "Edda", "Elian", "Elowen", "Fen", "Garrick", "Hesta", "Ilyra", "Isolde", "Jory", "Kael",
  "Leora", "Liora", "Marden", "Mira", "Nim", "Odette", "Orin", "Pella", "Quill", "Rook",
  "Sabine", "Tamsin", "Thea", "Ulric", "Vesper", "Wren", "Ysabet", "Zara", "Zev", "Zosia",
] as const;

export const surnames = [
  "Ashdown", "Bellweather", "Blackbriar", "Brassworth", "Candlewick", "Copperhand", "Crowhurst", "Deepwell",
  "Dusk", "Emberlain", "Fairlock", "Fallow", "Gannet", "Grey", "Hart", "Kestrel", "Lockmere", "March",
  "Morrow", "Nettle", "Pike", "Quarry", "Reed", "Rookwood", "Sable", "Thorne", "Vale", "Vintner",
  "Ward", "Wicker", "Wolfe", "Yarrow", "Alder", "Bexley", "Cobb", "Drake", "Fenn", "Hollow", "Moss", "Pryce",
] as const;

const locationPrefixes = [
  "Amber", "Ash", "Black", "Bracken", "Brass", "Candle", "Crow", "Dun", "East", "Ember", "Fallow", "Frost",
  "Gloam", "Grey", "High", "Iron", "King", "Lantern", "Mist", "Moon", "Mourn", "North", "Raven", "Red",
  "Salt", "Silver", "Stone", "Thorn", "West", "White", "Wind", "Wyrm",
] as const;
const locationSuffixes = [
  "barrow", "bridge", "cross", "fall", "ford", "gate", "haven", "hollow", "keep", "mere", "pass", "port",
  "quarry", "reach", "rest", "stead", "wall", "watch", "water", "wick",
] as const;
export const locations = combine(locationPrefixes, locationSuffixes, (prefix, suffix) => `${prefix}${suffix}`);

const regionAdjectives = [
  "Ashen", "Bracken", "Broken", "Cinder", "Crown", "Eastern", "Frost", "Golden", "Green", "Iron", "Low",
  "Moonlit", "Northern", "Old", "Sable", "Salt", "Shattered", "Silver", "Southern", "Western",
] as const;
const regionForms = [
  "Cantons", "Coast", "Crownlands", "Downs", "Expanse", "Fens", "Hearthlands", "Highlands", "March",
  "Moors", "Principalities", "Reach", "Shires", "Steppes", "Vales",
] as const;
export const regions = combine(regionAdjectives, regionForms, (adjective, form) => `the ${adjective} ${form}`);

const organizationQualifiers = [
  "Argent", "Blackwater", "Brass", "Civic", "Crown", "Eastern", "Free", "Grand", "Lantern", "Northern",
  "Old", "Provincial", "Royal", "Sable", "Salt", "Sevenfold", "Silver", "United", "Western", "White",
] as const;
const organizationBodies = [
  "Alchemists' Compact", "Bellfounders' Guild", "Bronze Council", "Cartographers' Society", "Chandlers' Union",
  "Clerks' Assembly", "Administrative Office", "Factors' League", "Ferrymen's League", "Glassworkers' Chapter",
  "Magistrates' Court", "Masons' Chapter", "Merchants' Council", "Porters' Company", "Menagerie Office",
  "Salt Consortium", "Scholars' Collegium", "Teamsters' Guild", "Archive Society", "Wardens' Circle",
] as const;
export const organizations = combine(organizationQualifiers, organizationBodies, (qualifier, body) => `the ${qualifier} ${body}`);

export const creatures = [
  "ankheg", "ape", "basilisk", "bat swarm", "blink dog", "boar", "bog serpent", "bone hound", "brass drake", "brown bear",
  "bugbear", "carrion beetle", "cave fisher", "centaur", "chimera", "cockatrice", "crag cat", "crocodile", "dire badger", "dire wolf",
  "displacer beast", "dragon turtle", "dread raven", "dust mephit", "ettercap", "faerie dragon", "fire beetle", "flesh golem", "flying snake", "forest troll",
  "frost spider", "gargoyle", "gelatinous cube", "ghoul", "giant badger", "giant bat", "giant boar", "giant crab", "giant eagle", "giant elk",
  "giant frog", "giant goat", "giant lizard", "giant owl", "giant rat", "giant scorpion", "giant spider", "giant toad", "giant vulture", "gnoll",
  "goblin", "griffon", "grick", "harpy", "hell hound", "hippogriff", "hobgoblin", "hook horror", "hydra", "ice toad",
  "imp", "iron cobra", "jackalwere", "kobold", "lamia", "manticore", "merrow", "mimic", "minotaur", "moss hulk",
  "nightmare", "ochre jelly", "ogre", "owlbear", "phase spider", "pseudodragon", "purple worm", "razor boar", "reef shark", "roc",
  "rust monster", "saber cat", "sahuagin", "satyr", "sea hag", "shadow mastiff", "shambling mound", "skeleton", "specter", "sprite",
  "stone giant", "stirge", "swamp drake", "troll", "unicorn", "vampire spawn", "water weird", "wereboar", "wererat", "werewolf",
  "wight", "will-o'-wisp", "winter wolf", "worg", "wraith", "wyvern", "xorn", "young drake", "zombie", "zombie ogre",
] as const;

const artifactQualities = [
  "amber", "backward-counting", "black-iron", "blood-warm", "blue-glass", "bone", "bronze", "clockwork", "copper",
  "crown-marked", "crystal", "dreaming", "ember-lit", "folding", "gilded", "glass", "hingeless", "ivory", "moon-silver",
  "obsidian", "oracular", "singing", "star-metal", "whispering",
] as const;
const artifactForms = [
  "astrolabe", "bell", "book", "bottle", "box", "bracelet", "chalice", "compass", "crown", "door", "egg", "figurine",
  "key", "lantern", "map", "mask", "mirror", "needle", "reliquary", "ring", "seal", "sword", "tablet", "watch",
] as const;
export const artifacts = combine(artifactQualities, artifactForms, (quality, form) => {
  const phrase = `${quality} ${form}`;
  return `${/^[aeiou]/i.test(phrase) ? "an" : "a"} ${phrase}`;
});

export const goods = [
  "alchemical charcoal", "amber beads", "apples", "arrow shafts", "barley", "beeswax", "black tea", "blue salt", "brass buckles", "brick",
  "bronze wire", "buckwheat", "candle wax", "canvas", "cedar planks", "chalk", "cheese wheels", "chestnuts", "cider", "clay jars",
  "coal", "cocoa", "copper ingots", "cork", "cotton", "dried beans", "dried fish", "dyer's alum", "enchanted ink", "feathers",
  "felt", "figs", "fine paper", "firewood", "flax", "flour", "fruit preserves", "glass beads", "glass panes", "goat hides",
  "grain", "grindstones", "healing herbs", "hemp rope", "honey", "iron nails", "iron ore", "ivory buttons", "lamp oil", "lead sheets",
  "leather", "linen", "marble", "medicinal roots", "molasses", "oak", "oats", "olive oil", "onions", "parchment",
  "pearls", "pepper", "pine resin", "potash", "pottery", "quill pens", "raw silk", "red dye", "rice", "river pearls",
  "roof slate", "rope", "saffron", "salt beef", "sandstone", "sealing wax", "ship timber", "silver ore", "soap", "spell paper",
  "spice wine", "steel tools", "sugar", "tallow", "tar", "tea bricks", "tin", "tobacco leaf", "undyed yarn", "vellum",
  "vinegar", "walnuts", "wheat", "white pepper", "willow baskets", "wine", "wool", "worked copper", "wyvern leather", "yellow ochre",
  "yew staves", "zinc", "ceramic tiles", "dried mushrooms", "salt cod", "quartz", "charcoal ink", "barrel hoops", "window glass", "wool blankets",
] as const;

const phenomenonSubjects = [
  "amber rain", "bells", "blue fire", "cold sunlight", "crimson mist", "falling stars", "fog", "glass hail", "green lightning",
  "moon shadows", "pale flames", "river lights", "silver minnows", "singing frost", "warm snow", "white thunder",
] as const;
const phenomenonActions = [
  "drifting against the wind", "falling upward", "forming letters in the air", "gathering around doorways", "moving only at noon",
  "pointing north", "repeating forgotten names", "rising from dry wells", "running along rooftops", "standing still above the river",
  "vanishing when counted", "visible only in mirrors",
] as const;
export const phenomena = combine(phenomenonSubjects, phenomenonActions, (subject, action) => `${subject} ${action}`);

export const professions = [
  "accountant", "advocate", "alchemist", "animal handler", "apothecary", "architect", "armorer", "astrologer", "auctioneer", "baker",
  "barber", "barrister", "beekeeper", "bellfounder", "blacksmith", "boatwright", "bookbinder", "brewer", "brickmaker", "butcher",
  "cabinetmaker", "candlemaker", "carpenter", "carter", "cartographer", "chandler", "clerk", "clockmaker", "cloth merchant", "cobbler",
  "cooper", "copyist", "courier", "cutler", "diplomat", "distiller", "dockmaster", "draper", "dyer", "engraver",
  "factor", "farrier", "ferryman", "fishmonger", "fletcher", "gardener", "glassblower", "goldsmith", "grocer", "haberdasher",
  "healer", "herald", "herbalist", "innkeeper", "jeweler", "joiner", "lampmaker", "leatherworker", "locksmith", "mapmaker",
  "mason", "mercer", "messenger", "miller", "miner", "moneychanger", "navigator", "notary", "papermaker", "perfumer",
  "physician", "potter", "printer", "provisioner", "ratcatcher", "roofer", "rope-maker", "saddler", "scribe", "shipwright",
  "silversmith", "soapmaker", "stablemaster", "stonemason", "surveyor", "tailor", "tanner", "teamster", "tinsmith", "translator",
  "undertaker", "vintner", "watchmaker", "weaver", "wheelwright", "woodcarver", "wool merchant", "warder", "breeder", "herdsman",
  "guide", "interpreter", "librarian", "magistrate", "porter", "quartermaster", "schoolmaster", "steward", "tax collector", "town crier",
] as const;

const innAdjectives = [
  "Amber", "Black", "Brass", "Broken", "Copper", "Crooked", "Drowned", "Golden", "Green", "Laughing", "Moonlit",
  "Old", "Painted", "Queen's", "Red", "Royal", "Silver", "Sleeping", "Three", "White",
] as const;
const innNouns = [
  "Anchor", "Badgers", "Bell", "Boar", "Candle", "Crown", "Cup", "Dragon", "Drum", "Fox", "Flagon", "Goose",
  "Griffin", "Harp", "Hound", "Lantern", "Mortar", "Pike", "Stag", "Wyvern",
] as const;
export const inns = combine(innAdjectives, innNouns, (adjective, noun) => `the ${adjective} ${noun}`);

const streetNames = [
  "Abbey", "Anchor", "Bellfounders", "Candle", "Chapel", "Copper", "Crown", "Dock", "Gallows", "Garden", "Guild",
  "King", "Lantern", "Market", "Masons", "Mill", "Old Queen", "River", "Saint Vey", "Silver", "Tanners", "Temple", "Watch", "Weavers",
] as const;
const streetForms = ["Alley", "Close", "Court", "End", "Lane", "Passage", "Place", "Road", "Row", "Square", "Street", "Walk"] as const;
export const streets = combine(streetNames, streetForms, (name, form) => `${name} ${form}`);

const templeDedications = [
  "Ash and Oak", "Dawn", "Merciful Stars", "Saint Arlen", "Saint Orra", "Seven Lamps", "Silver Mercy", "Still Waters",
  "the Crowned Sun", "the First Flame", "the Open Hand", "the Turning Wheel", "the Vigilant Moon", "Winter's End",
] as const;
const templeForms = ["Abbey", "Basilica", "Chapel", "Hall", "House", "Oratory", "Sanctuary", "Shrine", "Temple", "Vigil"] as const;
export const temples = combine(templeDedications, templeForms, (dedication, form) => `the ${form} of ${dedication}`);

const festivalThemes = [
  "Apple", "Bell", "Candle", "Founders'", "Harvest", "Lantern", "Midsummer", "Moon", "River", "Saints'", "Silver",
  "Spring", "Star", "Summer", "Winter", "Wyvern",
] as const;
const festivalForms = ["Assembly", "Blessing", "Carnival", "Fair", "Feast", "Games", "Market", "Night", "Procession", "Revel", "Vigil"] as const;
export const festivals = combine(festivalThemes, festivalForms, (theme, form) => `${theme} ${form}`);

export const colors = [
  "amber", "ash", "azure", "black", "blue", "brass", "bronze", "carmine", "cobalt", "copper", "crimson", "emerald",
  "gold", "green", "indigo", "ivory", "ochre", "pearl", "plum", "red", "saffron", "silver", "slate", "teal", "violet", "white",
] as const;
export const weekdays = ["Moonday", "Towerday", "Windsday", "Godsday", "Fireday", "Starday", "Sunday"] as const;
export const directions = ["north", "south", "east", "west", "upriver", "downriver"] as const;
export const spellSchools = ["abjuration", "conjuration", "divination", "enchantment", "evocation", "illusion", "necromancy", "transmutation"] as const;

export const helperPools = {
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
} as const;

export const openEndedHelperPoolSizes = Object.fromEntries(
  Object.entries(helperPools)
    .filter(([name]) => !["color", "direction", "spellSchool", "weekday"].includes(name))
    .map(([name, values]) => [name, values.length]),
);
