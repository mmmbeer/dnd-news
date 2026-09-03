import type { StoryTemplate } from "../story-template";
import type { StoryCategory } from "../types";
import { adventureTemplates } from "./adventure";
import { arcaneTemplates } from "./arcane";
import { civicTemplates } from "./civic";
import { crimeTemplates } from "./crime";
import { cultureTemplates } from "./culture";
import { guildTemplates } from "./guilds";
import { noticeTemplates } from "./notices";
import { societyTemplates } from "./society";
import { tradeTemplates } from "./trade";
import { travelTemplates } from "./travel";
import { weatherTemplates } from "./weather";

export const storyTemplates: StoryTemplate[] = [
  ...civicTemplates,
  ...guildTemplates,
  ...crimeTemplates,
  ...arcaneTemplates,
  ...tradeTemplates,
  ...travelTemplates,
  ...weatherTemplates,
  ...societyTemplates,
  ...cultureTemplates,
  ...adventureTemplates,
  ...noticeTemplates,
];

export function templatesForCategory(category: Exclude<StoryCategory, "any">) {
  return storyTemplates.filter((template) => template.category === category);
}
