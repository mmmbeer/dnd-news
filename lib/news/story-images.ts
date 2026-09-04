import { captionForStory } from "./illustrations";
import type { NewsStory } from "./types";

export function withStoryIllustration(
  story: NewsStory,
  illustrationId: string | null,
  rng: () => number = Math.random,
): NewsStory {
  return {
    ...story,
    illustrationId,
    illustrationCaption: illustrationId
      ? captionForStory(illustrationId, story.title, story.location, rng)
      : "",
  };
}
