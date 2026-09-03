export type NewspaperFontRole = "masthead" | "headline" | "body";

export interface NewspaperFontOption {
  id: string;
  label: string;
  family: string;
}

export const mastheadFontOptions: NewspaperFontOption[] = [
  { id: "blackletter", label: "Old World", family: "Georgia, 'Times New Roman', serif" },
  { id: "roman", label: "Roman", family: "'Palatino Linotype', Palatino, Georgia, serif" },
  { id: "modern", label: "Modern", family: "'Arial Narrow', Arial, sans-serif" },
  { id: "baskerville", label: "Baskerville", family: "Baskerville, 'Baskerville Old Face', 'Times New Roman', serif" },
  { id: "didone", label: "Didone", family: "Didot, 'Bodoni MT', 'Bodoni 72', 'Times New Roman', serif" },
  { id: "slab", label: "Slab Serif", family: "Rockwell, 'Rockwell Extra Bold', 'Courier New', serif" },
  { id: "bookman", label: "Bookman", family: "'Bookman Old Style', Bookman, Georgia, serif" },
  { id: "copperplate", label: "Copperplate", family: "Copperplate, 'Copperplate Gothic Light', Georgia, serif" },
  { id: "poster", label: "Poster", family: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" },
  { id: "typewriter", label: "Typewriter", family: "'Courier New', Courier, monospace" },
];

export const headlineFontOptions: NewspaperFontOption[] = [
  { id: "classic", label: "Classic", family: "Georgia, 'Times New Roman', serif" },
  { id: "condensed", label: "Condensed", family: "'Arial Narrow', 'Roboto Condensed', Arial, sans-serif" },
  { id: "elegant", label: "Elegant", family: "'Palatino Linotype', Palatino, Georgia, serif" },
  { id: "baskerville", label: "Baskerville", family: "Baskerville, 'Baskerville Old Face', 'Times New Roman', serif" },
  { id: "didone", label: "Didone", family: "Didot, 'Bodoni MT', 'Bodoni 72', 'Times New Roman', serif" },
  { id: "slab", label: "Slab Serif", family: "Rockwell, 'Rockwell Extra Bold', 'Courier New', serif" },
  { id: "franklin", label: "Franklin", family: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" },
  { id: "schoolbook", label: "Schoolbook", family: "'Century Schoolbook', Century, Georgia, serif" },
  { id: "poster", label: "Poster", family: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" },
  { id: "typewriter", label: "Typewriter", family: "'Courier New', Courier, monospace" },
];

export const bodyFontOptions: NewspaperFontOption[] = [
  { id: "news", label: "News serif", family: "Georgia, 'Times New Roman', serif" },
  { id: "book", label: "Book serif", family: "'Palatino Linotype', Palatino, Georgia, serif" },
  { id: "clean", label: "Clean sans", family: "Arial, Helvetica, sans-serif" },
  { id: "garamond", label: "Garamond", family: "Garamond, 'EB Garamond', Georgia, serif" },
  { id: "baskerville", label: "Baskerville", family: "Baskerville, 'Baskerville Old Face', 'Times New Roman', serif" },
  { id: "schoolbook", label: "Schoolbook", family: "'Century Schoolbook', Century, Georgia, serif" },
  { id: "times", label: "Times", family: "'Times New Roman', Times, serif" },
  { id: "franklin", label: "Franklin sans", family: "'Franklin Gothic Book', 'Arial Narrow', Arial, sans-serif" },
  { id: "humanist", label: "Humanist sans", family: "Optima, Candara, 'Segoe UI', sans-serif" },
  { id: "typewriter", label: "Typewriter", family: "'Courier New', Courier, monospace" },
];

const fontOptionsByRole: Record<NewspaperFontRole, NewspaperFontOption[]> = {
  masthead: mastheadFontOptions,
  headline: headlineFontOptions,
  body: bodyFontOptions,
};

export function fontFamilyFor(role: NewspaperFontRole, id: string) {
  const options = fontOptionsByRole[role];
  return options.find((option) => option.id === id)?.family ?? options[0].family;
}
