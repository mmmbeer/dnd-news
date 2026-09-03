import type { StoryCategory, StoryKind, StoryTone } from "./types";

export interface StoryTemplate {
  id: string;
  category: Exclude<StoryCategory, "any">;
  title: string;
  dramaticTitle?: string;
  gossipTitle?: string;
  ominousTitle?: string;
  kicker: string;
  dek: string;
  paragraphs: [string, string, string];
  illustrationId: string;
  kind?: StoryKind;
}

export interface RenderedStoryTemplate {
  title: string;
  kicker: string;
  dek: string;
  paragraphs: string[];
  illustrationId: string;
  kind?: StoryKind;
  facts: Readonly<Record<string, string>>;
  primaryLocation: string;
}

export function titleForTone(template: StoryTemplate, tone: StoryTone) {
  if (tone === "sensational") return template.dramaticTitle ?? template.title;
  if (tone === "gossipy") return template.gossipTitle ?? template.dramaticTitle ?? template.title;
  if (tone === "ominous") return template.ominousTitle ?? template.dramaticTitle ?? template.title;
  return template.title;
}
