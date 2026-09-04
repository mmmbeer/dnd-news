export type NewspaperFontRole = "masthead" | "headline" | "body";

export interface NewspaperFontOption {
  id: string;
  label: string;
  family: string;
}

interface GoogleNewspaperFont extends NewspaperFontOption {
  roles: NewspaperFontRole[];
  style: "blackletter" | "display" | "serif" | "script";
}

function googleFont(
  id: string,
  label: string,
  family: string,
  roles: NewspaperFontRole[],
  style: GoogleNewspaperFont["style"],
): GoogleNewspaperFont {
  return { id: `google-${id}`, label, family: `'${family}', Georgia, serif`, roles, style };
}

/** Google Fonts selected for fantasy broadsheets, handouts, and period newsletters. */
export const googleNewspaperFonts: GoogleNewspaperFont[] = [
  googleFont("almendra", "Almendra", "Almendra", ["masthead", "headline", "body"], "serif"),
  googleFont("almendra-display", "Almendra Display", "Almendra Display", ["masthead", "headline"], "display"),
  googleFont("almendra-sc", "Almendra Small Caps", "Almendra SC", ["masthead", "headline"], "display"),
  googleFont("alegreya", "Alegreya", "Alegreya", ["masthead", "headline", "body"], "serif"),
  googleFont("cardo", "Cardo", "Cardo", ["masthead", "headline", "body"], "serif"),
  googleFont("caudex", "Caudex", "Caudex", ["masthead", "headline", "body"], "serif"),
  googleFont("cinzel", "Cinzel", "Cinzel", ["masthead", "headline"], "display"),
  googleFont("cinzel-decorative", "Cinzel Decorative", "Cinzel Decorative", ["masthead", "headline"], "display"),
  googleFont("cormorant-garamond", "Cormorant Garamond", "Cormorant Garamond", ["masthead", "headline", "body"], "serif"),
  googleFont("cormorant-sc", "Cormorant Small Caps", "Cormorant SC", ["masthead", "headline"], "display"),
  googleFont("crimson-pro", "Crimson Pro", "Crimson Pro", ["headline", "body"], "serif"),
  googleFont("eb-garamond", "EB Garamond", "EB Garamond", ["masthead", "headline", "body"], "serif"),
  googleFont("forum", "Forum", "Forum", ["masthead", "headline", "body"], "display"),
  googleFont("gentium-book-plus", "Gentium Book Plus", "Gentium Book Plus", ["headline", "body"], "serif"),
  googleFont("goudy-bookletter", "Goudy Bookletter 1911", "Goudy Bookletter 1911", ["masthead", "headline", "body"], "serif"),
  googleFont("grenze", "Grenze", "Grenze", ["masthead", "headline", "body"], "serif"),
  googleFont("grenze-gotisch", "Grenze Gotisch", "Grenze Gotisch", ["masthead", "headline"], "blackletter"),
  googleFont("im-fell-english", "IM FELL English", "IM FELL English", ["masthead", "headline", "body"], "serif"),
  googleFont("im-fell-english-sc", "IM FELL English Small Caps", "IM FELL English SC", ["masthead", "headline"], "display"),
  googleFont("libre-baskerville", "Libre Baskerville", "Libre Baskerville", ["headline", "body"], "serif"),
  googleFont("lora", "Lora", "Lora", ["headline", "body"], "serif"),
  googleFont("medievalsharp", "MedievalSharp", "MedievalSharp", ["masthead", "headline"], "display"),
  googleFont("merriweather", "Merriweather", "Merriweather", ["headline", "body"], "serif"),
  googleFont("metamorphous", "Metamorphous", "Metamorphous", ["masthead", "headline"], "display"),
  googleFont("old-standard-tt", "Old Standard TT", "Old Standard TT", ["masthead", "headline", "body"], "serif"),
  googleFont("pirata-one", "Pirata One", "Pirata One", ["masthead", "headline"], "blackletter"),
  googleFont("spectral", "Spectral", "Spectral", ["headline", "body"], "serif"),
  googleFont("uncial-antiqua", "Uncial Antiqua", "Uncial Antiqua", ["masthead", "headline"], "display"),
  googleFont("unifraktur-cook", "UnifrakturCook", "UnifrakturCook", ["masthead", "headline"], "blackletter"),
  googleFont("unifraktur-maguntia", "UnifrakturMaguntia", "UnifrakturMaguntia", ["masthead", "headline"], "blackletter"),
  googleFont("vollkorn", "Vollkorn", "Vollkorn", ["headline", "body"], "serif"),
  googleFont("berkshire-swash", "Berkshire Swash", "Berkshire Swash", ["masthead", "headline"], "script"),
  googleFont("bilbo-swash-caps", "Bilbo Swash Caps", "Bilbo Swash Caps", ["masthead", "headline"], "script"),
  googleFont("charm", "Charm", "Charm", ["masthead", "headline"], "script"),
  googleFont("eagle-lake", "Eagle Lake", "Eagle Lake", ["masthead", "headline"], "script"),
  googleFont("fondamento", "Fondamento", "Fondamento", ["masthead", "headline", "body"], "script"),
  googleFont("italianno", "Italianno", "Italianno", ["masthead", "headline"], "script"),
  googleFont("tangerine", "Tangerine", "Tangerine", ["masthead", "headline"], "script"),
];

export const googleFontStylesheetHref = `https://fonts.googleapis.com/css2?${googleNewspaperFonts
  .map((font) => `family=${encodeURIComponent(font.family.match(/^'([^']+)'/)?.[1] ?? font.label).replaceAll("%20", "+")}`)
  .join("&")}&display=swap`;

const localMastheadFonts: NewspaperFontOption[] = [
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

const localHeadlineFonts: NewspaperFontOption[] = [
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

const localBodyFonts: NewspaperFontOption[] = [
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

function googleOptionsFor(role: NewspaperFontRole) {
  return googleNewspaperFonts
    .filter((font) => font.roles.includes(role))
    .map(({ id, label, family }) => ({ id, label, family }));
}

export const mastheadFontOptions: NewspaperFontOption[] = [...localMastheadFonts, ...googleOptionsFor("masthead")];
export const headlineFontOptions: NewspaperFontOption[] = [...localHeadlineFonts, ...googleOptionsFor("headline")];
export const bodyFontOptions: NewspaperFontOption[] = [...localBodyFonts, ...googleOptionsFor("body")];

const fontOptionsByRole: Record<NewspaperFontRole, NewspaperFontOption[]> = {
  masthead: mastheadFontOptions,
  headline: headlineFontOptions,
  body: bodyFontOptions,
};

export function fontFamilyFor(role: NewspaperFontRole, id: string) {
  const options = fontOptionsByRole[role];
  return options.find((option) => option.id === id)?.family ?? options[0].family;
}
