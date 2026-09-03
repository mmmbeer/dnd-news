import type { IssueSettings, NewspaperPresetId } from "./types";

export interface NewspaperPreset {
  id: NewspaperPresetId;
  name: string;
  description: string;
  settings: Omit<IssueSettings, "publicationDate" | "volume" | "issueNumber">;
}

export const newspaperPresets: NewspaperPreset[] = [
  {
    id: "blackwater",
    name: "Blackwater Chronicle",
    description: "Old-world broadsheet · formal and atmospheric",
    settings: {
      presetId: "blackwater", newspaperName: "The Blackwater Chronicle", motto: "An Honest Account of Unquiet Times",
      dateline: "Blackwater & the Western Cantons", edition: "Evening Edition", price: "2 Copper", columns: 4,
      pageSize: "broadsheet", mastheadFont: "blackletter", headlineFont: "classic", bodyFont: "news", bodySize: 10,
      lineHeight: 1.32, headlineScale: 1, colorTheme: "oxblood", paperTone: 35, paperWeathering: true, showRules: false,
      justifyText: true, showDropCaps: true,
    },
  },
  {
    id: "crown-city",
    name: "Crown City Gazette",
    description: "Dense metropolitan daily · authoritative and restrained",
    settings: {
      presetId: "crown-city", newspaperName: "The Crown City Gazette", motto: "The Realm, Recorded",
      dateline: "Crown City & the Royal Provinces", edition: "Morning Edition", price: "1 Copper", columns: 5,
      pageSize: "broadsheet", mastheadFont: "roman", headlineFont: "condensed", bodyFont: "news", bodySize: 9,
      lineHeight: 1.24, headlineScale: 0.9, colorTheme: "navy", paperTone: 18, paperWeathering: true, showRules: false,
      justifyText: true, showDropCaps: false,
    },
  },
  {
    id: "lantern",
    name: "Lantern Ledger",
    description: "Compact city tabloid · bold leads and quick briefs",
    settings: {
      presetId: "lantern", newspaperName: "The Lantern Ledger", motto: "News Without Fear or Favor",
      dateline: "Lantern Ward & the Lower City", edition: "Late Edition", price: "3 Copper", columns: 3,
      pageSize: "tabloid", mastheadFont: "modern", headlineFont: "condensed", bodyFont: "clean", bodySize: 10.5,
      lineHeight: 1.28, headlineScale: 1.15, colorTheme: "charcoal", paperTone: 8, paperWeathering: true, showRules: false,
      justifyText: false, showDropCaps: false,
    },
  },
  {
    id: "greenway",
    name: "Greenway Courier",
    description: "Provincial weekly · open, readable and civic-minded",
    settings: {
      presetId: "greenway", newspaperName: "The Greenway Courier", motto: "From Gatehouse to Great Hall",
      dateline: "Greenway & the Market Towns", edition: "Marketday Edition", price: "2 Copper", columns: 3,
      pageSize: "letter", mastheadFont: "roman", headlineFont: "elegant", bodyFont: "book", bodySize: 11,
      lineHeight: 1.42, headlineScale: 1.05, colorTheme: "forest", paperTone: 24, paperWeathering: true, showRules: false,
      justifyText: false, showDropCaps: true,
    },
  },
  {
    id: "adventurer",
    name: "Adventurer's Dispatch",
    description: "Expedition tabloid · energetic, practical and hook-forward",
    settings: {
      presetId: "adventurer", newspaperName: "The Adventurer's Dispatch", motto: "Beyond the Walls, Before the Rest",
      dateline: "The Free Roads & Borderlands", edition: "Expedition Edition", price: "Free at Guild Halls", columns: 4,
      pageSize: "tabloid", mastheadFont: "modern", headlineFont: "classic", bodyFont: "clean", bodySize: 10,
      lineHeight: 1.3, headlineScale: 1.2, colorTheme: "oxblood", paperTone: 12, paperWeathering: true, showRules: false,
      justifyText: false, showDropCaps: true,
    },
  },
  {
    id: "silver-quill",
    name: "Silver Quill Review",
    description: "Literary weekly · elegant display type and generous reading measure",
    settings: {
      presetId: "silver-quill", newspaperName: "The Silver Quill Review", motto: "Letters, Learning & the Life of the Realm",
      dateline: "Highcourt, University Ward & Abroad", edition: "Seventh-Day Review", price: "4 Copper", columns: 4,
      pageSize: "broadsheet", mastheadFont: "didone", headlineFont: "baskerville", bodyFont: "garamond", bodySize: 10.5,
      lineHeight: 1.4, headlineScale: 1.02, colorTheme: "navy", paperTone: 28, paperWeathering: true, showRules: false,
      justifyText: true, showDropCaps: true,
    },
  },
  {
    id: "watchman",
    name: "Night Watchman",
    description: "Crime tabloid · hard headlines, dark ink and battered paper",
    settings: {
      presetId: "watchman", newspaperName: "The Night Watchman", motto: "What the Watch Knows by Dawn, You Know by Breakfast",
      dateline: "Dock Ward, Old City & the River Gates", edition: "Dawn Extra", price: "1 Copper", columns: 3,
      pageSize: "tabloid", mastheadFont: "poster", headlineFont: "slab", bodyFont: "news", bodySize: 10,
      lineHeight: 1.25, headlineScale: 1.22, colorTheme: "oxblood", paperTone: 56, paperWeathering: true, showRules: false,
      justifyText: true, showDropCaps: false,
    },
  },
  {
    id: "mercantile",
    name: "Mercantile Register",
    description: "Trade daily · compact columns for prices, notices and guild reports",
    settings: {
      presetId: "mercantile", newspaperName: "The Mercantile Register", motto: "Markets Open. Ledgers Balanced. News Delivered.",
      dateline: "Exchange Square & the Merchant Roads", edition: "Opening Bell Edition", price: "2 Copper", columns: 5,
      pageSize: "broadsheet", mastheadFont: "baskerville", headlineFont: "condensed", bodyFont: "schoolbook", bodySize: 9,
      lineHeight: 1.22, headlineScale: 0.88, colorTheme: "forest", paperTone: 16, paperWeathering: true, showRules: false,
      justifyText: true, showDropCaps: false,
    },
  },
  {
    id: "arcane-herald",
    name: "Arcane Herald",
    description: "Scholarly broadsheet · ceremonial masthead with crisp learned copy",
    settings: {
      presetId: "arcane-herald", newspaperName: "The Arcane Herald", motto: "Verified by Witness, Seal and Sigil",
      dateline: "The Collegium, Crown City & Associated Towers", edition: "Second Bell Edition", price: "5 Copper", columns: 4,
      pageSize: "broadsheet", mastheadFont: "copperplate", headlineFont: "didone", bodyFont: "baskerville", bodySize: 10,
      lineHeight: 1.34, headlineScale: 1.06, colorTheme: "navy", paperTone: 38, paperWeathering: true, showRules: false,
      justifyText: true, showDropCaps: true,
    },
  },
  {
    id: "frontier",
    name: "Borderlands Bulletin",
    description: "Rugged frontier sheet · practical type on heavily traveled paper",
    settings: {
      presetId: "frontier", newspaperName: "The Borderlands Bulletin", motto: "News from the Last Safe Road",
      dateline: "Northroad, Outlying Keeps & the Marches", edition: "Caravan Edition", price: "Pay What You Can", columns: 3,
      pageSize: "letter", mastheadFont: "slab", headlineFont: "typewriter", bodyFont: "typewriter", bodySize: 10.5,
      lineHeight: 1.34, headlineScale: 1.08, colorTheme: "charcoal", paperTone: 72, paperWeathering: true, showRules: false,
      justifyText: false, showDropCaps: false,
    },
  },
];

export function getNewspaperPreset(id: NewspaperPresetId) {
  return newspaperPresets.find((preset) => preset.id === id) ?? newspaperPresets[0];
}

export function applyNewspaperPreset(current: IssueSettings, id: NewspaperPresetId): IssueSettings {
  const preset = getNewspaperPreset(id);
  return { ...current, ...preset.settings, presetId: id };
}
