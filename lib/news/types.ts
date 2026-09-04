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
export type IllustrationFlow = "wrap" | "block";

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
export type StoryBodyMode = "story" | "fit-lorem";
export type ColorTheme =
  | "charcoal"
  | "oxblood"
  | "rust"
  | "sepia"
  | "navy"
  | "royal"
  | "plum"
  | "forest"
  | "teal"
  | "olive";
export type PaperColor =
  | "white"
  | "ivory"
  | "parchment"
  | "aged-parchment"
  | "mist-gray"
  | "newsprint"
  | "silver-gray"
  | "ash-gray";
export type PageSize = "broadsheet" | "tabloid" | "letter";
export type NewspaperPresetId =
  | "blackwater"
  | "crown-city"
  | "lantern"
  | "greenway"
  | "adventurer"
  | "silver-quill"
  | "watchman"
  | "mercantile"
  | "arcane-herald"
  | "frontier";

export interface TextRegionStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right" | "justify";
}

export type TextRegionStyles = Record<string, TextRegionStyle>;

export interface NewsStory {
  id: string;
  title: string;
  kicker: string;
  dek: string;
  byline: string;
  location: string;
  body: string;
  /** Render the saved story copy or preserve it while fitting lorem ipsum to the story frame. */
  bodyMode?: StoryBodyMode;
  kind: StoryKind;
  width: StoryWidth;
  category: Exclude<StoryCategory, "any">;
  generated: boolean;
  locked: boolean;
  illustrationId: string | null;
  illustrationAlign: IllustrationAlignment;
  /** Wrap article copy around the image or reserve a separate rectangular block. */
  illustrationFlow?: IllustrationFlow;
  illustrationCaption?: string;
  textStyles?: TextRegionStyles;
  /** Explicit layout overrides set by the handles in the page editor. */
  columnSpan?: number;
  bodyColumns?: number;
  minHeight?: number;
  illustrationScale?: number;
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
  footerLeft?: string;
  footerRight?: string;
  columns: number;
  pageSize: PageSize;
  mastheadFont: string;
  headlineFont: string;
  bodyFont: string;
  bodySize: number;
  lineHeight: number;
  headlineScale: number;
  colorTheme: ColorTheme;
  paperColor: PaperColor;
  paperTone: number;
  paperWeathering: boolean;
  showRules: boolean;
  justifyText: boolean;
  showDropCaps: boolean;
  presetId: NewspaperPresetId;
  textStyles?: TextRegionStyles;
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
