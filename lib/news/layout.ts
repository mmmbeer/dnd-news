import type { NewsStory } from "./types";

export function storyColumnSpan(story: NewsStory, pageColumns: number) {
  if (story.columnSpan) return Math.max(1, Math.min(story.columnSpan, pageColumns));
  if (story.kind === "lead" || story.width === "full") return pageColumns;
  if (story.width === "wide") return Math.min(2, pageColumns);
  return 1;
}

export function storyBodyColumns(story: NewsStory, pageColumns: number) {
  const availableColumns = storyColumnSpan(story, pageColumns);
  const requestedColumns = story.bodyColumns
    ?? (story.kind === "lead" ? Math.min(availableColumns, 3) : 1);
  return Math.max(1, Math.min(requestedColumns, availableColumns));
}
