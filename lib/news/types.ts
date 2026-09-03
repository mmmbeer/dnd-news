export type StoryKind =
  | "lead"
  | "news"
  | "brief"
  | "notice"
  | "advert"
  | "obituary"
  | "comic";

export type StoryWidth = "full" | "wide" | "standard";
export type IllustrationAlignment = "left" | "right" | "center";

export type StoryCategory =
  | "any"
  | "civic"
  | "guilds"
  | "crime"
  | "arcane"
  | "trade"
  | "travel"
  | "weather"
  | "society"
  | "culture"
  | "adventure"
  | "notices";

export type StoryTone = "straight" | "sensational" | "gossipy" | "ominous";
export type StoryLength = "brief" | "standard" | "long";
export type ColorTheme = "charcoal" | "oxblood" | "navy" | "forest";
export type PageSize = "broadsheet" | "tabloid" | "letter";
export type NewspaperPresetId = "blackwater" | "crown-city" | "lantern" | "greenway" | "adventurer";

export interface NewsStory {
  id: string;
  title: string;
  kicker: string;
  dek: string;
  byline: string;
  location: string;
  body: string;
  kind: StoryKind;
  width: StoryWidth;
  category: Exclude<StoryCategory, "any">;
  generated: boolean;
  locked: boolean;
  illustrationId: string | null;
  illustrationAlign: IllustrationAlignment;
}

export interface IssueSettings {
  newspaperName: string;
  motto: string;
  publicationDate: string;
  dateline: string;
  edition: string;
  price: string;
  volume: string;
  issueNumber: string;
  columns: number;
  pageSize: PageSize;
  mastheadFont: string;
  headlineFont: string;
  bodyFont: string;
  bodySize: number;
  lineHeight: number;
  headlineScale: number;
  colorTheme: ColorTheme;
  paperTone: number;
  showRules: boolean;
  justifyText: boolean;
  showDropCaps: boolean;
  presetId: NewspaperPresetId;
}

export interface NewspaperIssue {
  version: 1;
  seed: string;
  settings: IssueSettings;
  stories: NewsStory[];
}

export interface GeneratorOptions {
  category: StoryCategory;
  tone: StoryTone;
  length: StoryLength;
}
