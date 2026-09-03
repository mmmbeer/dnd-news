export function editableTextHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("\n", "<br>");
}

export function storyBodyHtml(value: string) {
  return value
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => `<p>${editableTextHtml(paragraph)}</p>`)
    .join("");
}
