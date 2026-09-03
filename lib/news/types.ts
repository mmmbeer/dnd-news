export type StoryKind =
  | "lead"
  | "news"
  | "brief"
  | "notice"
  | "advert"
  | "obituary";

export type StoryWidth = "full" | "wide" | "standard";

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
