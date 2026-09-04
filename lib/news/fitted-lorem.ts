const loremWords = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua " +
  "ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute " +
  "irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat " +
  "cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum praesent sapien massa convallis " +
  "pellentesque nec egestas non nisi vivamus suscipit tortor eget felis porttitor volutpat curabitur aliquet quam id dui " +
  "posuere blandit donec sollicitudin molestie malesuada vestibulum ante ipsum primis in faucibus orci luctus et ultrices " +
  "posuere cubilia curae maecenas sed diam eget risus varius blandit sit amet non magna"
).split(" ");

function seedHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function finishSentence(words: string[]) {
  if (!words.length) return "";
  const next = [...words];
  next[0] = `${next[0][0].toUpperCase()}${next[0].slice(1)}`;
  next[next.length - 1] = `${next[next.length - 1].replace(/[.,;:]$/, "")}.`;
  return next.join(" ");
}

/**
 * Produces deterministic lorem copy with an exact word count. Paragraph lengths
 * vary by story so neighboring fitted articles do not repeat the same texture.
 */
export function fittedLoremBody(wordCount: number, seed: string) {
  const count = Math.max(1, Math.floor(wordCount));
  const hash = seedHash(seed);
  const offset = hash % loremWords.length;
  const paragraphLength = 34 + (hash % 19);
  const words = Array.from({ length: count }, (_, index) => loremWords[(offset + index) % loremWords.length]);
  const paragraphs: string[] = [];

  for (let index = 0; index < words.length; index += paragraphLength) {
    paragraphs.push(finishSentence(words.slice(index, index + paragraphLength)));
  }

  return paragraphs.join("\n\n");
}
