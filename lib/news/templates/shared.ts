import type { StoryTemplate } from "../story-template";
import type { StoryCategory } from "../types";

type Category = Exclude<StoryCategory, "any">;
type TemplateSeed = Omit<StoryTemplate, "category">;

export function defineTemplates(category: Category, templates: TemplateSeed[]): StoryTemplate[] {
  return templates.map((template) => ({ ...template, category }));
}
