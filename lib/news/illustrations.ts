import type { StoryCategory } from "./types";

export interface StoryIllustration {
  id: string;
  label: string;
  alt: string;
  category: Exclude<StoryCategory, "any">;
  src: string;
}

const rows: Array<[string, string, string, Exclude<StoryCategory, "any">]> = [
  ["council-chamber", "Council chamber", "A city council debating beneath a crown crest", "civic"],
  ["city-gates", "City gates", "Guards standing at fortified city gates", "civic"],
  ["royal-decree", "Royal decree", "A sealed royal decree with a quill", "civic"],
  ["justice-scales", "Justice scales", "Scales of justice beside a civic seal", "civic"],
  ["public-works", "Public works", "A stone arch and builders' measuring tools", "civic"],
  ["guild-hammer", "Guild hammer", "A guild hammer crossed with a chisel", "guilds"],
  ["weavers-loom", "Weaver's loom", "A hand loom with patterned cloth", "guilds"],
  ["masons-tools", "Mason's tools", "A trowel, mallet and carved stone", "guilds"],
  ["bakers-oven", "Baker's oven", "A brick oven with loaves and a peel", "guilds"],
  ["dock-crane", "Dock crane", "A timber dock crane lifting a cargo net", "guilds"],
  ["watch-lantern", "Watch lantern", "A watch lantern with old keys and a warrant", "crime"],
  ["thieves-mask", "Thief's mask", "A hooded mask beside lockpicks", "crime"],
  ["prison-bars", "Prison bars", "A barred cell door with a hanging key", "crime"],
  ["evidence-dagger", "Evidence dagger", "A dagger, footprint and evidence marker", "crime"],
  ["rooftop-chase", "Rooftop chase", "Two figures running across steep rooftops", "crime"],
  ["wizard-tower", "Wizard tower", "A crooked wizard tower struck by arcane energy", "arcane"],
  ["magic-circle", "Magic circle", "A glowing ritual circle with candles", "arcane"],
  ["crystal-ball", "Crystal ball", "A crystal ball on an ornate stand", "arcane"],
  ["alchemy-flask", "Alchemy flask", "An alchemical flask bubbling beside herbs", "arcane"],
  ["enchanted-book", "Enchanted book", "An open spellbook with floating pages", "arcane"],
  ["merchant-scales", "Merchant scales", "Scales weighing coins against a spice sack", "trade"],
  ["market-stall", "Market stall", "A market stall piled with fantasy goods", "trade"],
  ["coin-purse", "Coin purse", "An open coin purse beside stacked coins", "trade"],
  ["cargo-ship", "Cargo ship", "A laden sailing ship at a busy quay", "trade"],
  ["spice-sack", "Spice sack", "A tied spice sack, scoop and scattered seeds", "trade"],
  ["caravan-road", "Caravan road", "A covered wagon traveling toward city walls", "travel"],
  ["stone-bridge", "Stone bridge", "An old stone bridge over a swift river", "travel"],
  ["river-barge", "River barge", "A flat river barge with cargo and ferryman", "travel"],
  ["road-sign", "Road sign", "A many-armed road sign at a crossroads", "travel"],
  ["mountain-pass", "Mountain pass", "A narrow mountain pass with a distant traveler", "travel"],
  ["enchanted-weather", "Enchanted weather", "A cloud raining tiny fish above farm fields", "weather"],
  ["sun-and-moon", "Sun and moon", "A stylized sun and crescent moon over a horizon", "weather"],
  ["lightning-tree", "Lightning-struck tree", "Lightning splitting an old tree", "weather"],
  ["flooded-river", "Flooded river", "A swollen river overtopping its banks", "weather"],
  ["masked-ball", "Masked ball", "Two masked nobles whispering behind a fan", "society"],
  ["noble-carriage", "Noble carriage", "An ornate horse-drawn noble carriage", "society"],
  ["feast-table", "Feast table", "A grand banquet table with goblets and candles", "society"],
  ["wedding-rings", "Wedding rings", "Two rings tied with ribbon beneath flowers", "society"],
  ["theatre-stage", "Theatre stage", "Comedy and tragedy masks before curtains", "culture"],
  ["bard-lute", "Bard's lute", "A lute with curling musical notes", "culture"],
  ["painter-easel", "Painter's easel", "An easel, palette and paintbrushes", "culture"],
  ["printing-press", "Printing press", "A hand-operated wooden printing press", "culture"],
  ["dungeon-stairs", "Dungeon stairs", "Stairs descending into a torchlit ruin", "adventure"],
  ["treasure-map", "Treasure map", "A rolled treasure map with compass and key", "adventure"],
  ["monster-footprint", "Monster footprint", "A large clawed footprint beside a boot print", "adventure"],
  ["adventurers-camp", "Adventurers' camp", "Bedrolls, packs and a campfire beneath pines", "adventure"],
  ["notice-board", "Notice board", "A wooden notice board covered with blank bills", "notices"],
  ["town-crier", "Town crier", "A town crier ringing a handbell", "notices"],
  ["lost-pet", "Lost familiar", "A small winged cat wearing a collar", "notices"],
  ["auction-gavel", "Auction gavel", "A wooden gavel beside a numbered placard", "notices"],
];

export const storyIllustrations: StoryIllustration[] = rows.map(([id, label, alt, category]) => ({
  id, label, alt, category, src: `/illustrations/${id}.png`,
}));

export const illustrationById = new Map(storyIllustrations.map((illustration) => [illustration.id, illustration]));

export function randomIllustration(category: Exclude<StoryCategory, "any">, rng: () => number = Math.random) {
  const matches = storyIllustrations.filter((illustration) => illustration.category === category);
  return matches[Math.floor(rng() * matches.length)]?.id ?? storyIllustrations[0].id;
}
