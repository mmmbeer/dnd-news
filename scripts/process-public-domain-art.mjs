#!/usr/bin/env node

import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const selectionPath = path.resolve(process.argv[2]);
const rawDirectory = path.resolve(process.argv[3]);
const projectRoot = path.resolve(process.argv[4] ?? process.cwd());
const artDirectory = path.join(projectRoot, "public/art/public-domain");
const catalogPath = path.join(projectRoot, "lib/news/public-domain-art.json");

const curatedCartoonIndexes = new Set([62, 63, 64, 66, 70, 71, 73, 75, 76, 78, 83, 84, 86]);

const generalCategoryPairs = [
  ["adventure", "travel"],
  ["culture", "society"],
  ["crime", "civic"],
  ["guilds", "trade"],
  ["arcane", "adventure"],
  ["weather", "travel"],
  ["notices", "society"],
];

const cartoonDetails = {
  62: { categories: ["civic", "culture"], alt: "Editorial cartoon about civil-service reform" },
  63: { categories: ["crime", "civic"], alt: "Editorial cartoon of vultures waiting for a political storm to pass" },
  64: { categories: ["crime", "trade"], alt: "Editorial caricature of a corrupt political boss wearing a money bag" },
  66: { categories: ["crime", "civic"], alt: "Editorial caricature of a powerful political boss beside a ballot box" },
  70: { categories: ["society", "culture"], alt: "Newspaper cartoon showing a series of scenes at a seaside resort" },
  71: { categories: ["civic", "crime"], alt: "Allegorical editorial cartoon about the fall of a false ruler" },
  73: { categories: ["civic", "society"], alt: "Editorial cartoon about reform and public responsibility" },
  75: { categories: ["civic", "society"], alt: "Editorial cartoon of a politician making an abrupt exit" },
  76: { categories: ["civic", "trade"], alt: "Editorial cartoon about an election and political influence" },
  78: { categories: ["crime", "trade"], alt: "Editorial cartoon about a corrupt whiskey ring" },
  83: { categories: ["civic", "crime"], alt: "Editorial cartoon contrasting two impeachment votes" },
  84: { categories: ["civic", "crime"], alt: "Editorial cartoon about the government of New York City" },
  86: { categories: ["crime", "civic"], alt: "Editorial cartoon of an official confronted by corruption" },
};

function stableNumber(value) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function illustrationAlt(title) {
  const normalized = title.toLowerCase();
  if (/windmill|moinho/.test(normalized)) return "Black-and-white engraving of riders approaching towering windmills";
  if (/luta|ataca|acomete|exército|exercito|armado|cavaleiro/.test(normalized)) return "Black-and-white engraving of a chaotic clash between armed travelers";
  if (/estalagem|inn|beber|casa|cabreiro/.test(normalized)) return "Black-and-white engraving of travelers gathered at an inn or village";
  if (/livro|alucina|encant|notions|imagination/.test(normalized)) return "Black-and-white engraving of a scholar surrounded by fantastical visions";
  if (/rio|desfiladeiro|mula|jumento|coche|horse/.test(normalized)) return "Black-and-white engraving of travelers crossing a rugged landscape";
  if (/funeral|crowd|discurso|pessoas/.test(normalized)) return "Black-and-white engraving of a crowd gathered for a public event";
  return "Black-and-white historical engraving of riders, travelers, and villagers";
}

function categoriesFor(candidate) {
  if (candidate.kind === "cartoon") return cartoonDetails[candidate.sourceIndex].categories;
  return generalCategoryPairs[stableNumber(candidate.title) % generalCategoryPairs.length];
}

function findRawFile(index, kind, files) {
  const prefix = `${String(index).padStart(3, "0")}-${kind}`;
  return files.find((file) => file.startsWith(prefix));
}

await mkdir(artDirectory, { recursive: true });
const selections = JSON.parse(await readFile(selectionPath, "utf8"));
const rawFiles = await import("node:fs/promises").then(({ readdir }) => readdir(rawDirectory));
const selected = selections
  .map((candidate, index) => ({ ...candidate, sourceIndex: index + 1 }))
  .filter((candidate) => candidate.kind === "illustration" || curatedCartoonIndexes.has(candidate.sourceIndex));

const catalog = [];
for (const [index, candidate] of selected.entries()) {
  const rawFile = findRawFile(candidate.sourceIndex, candidate.kind, rawFiles);
  if (!rawFile) throw new Error(`Missing raw image for source index ${candidate.sourceIndex}`);
  const id = `public-domain-${String(index + 1).padStart(3, "0")}`;
  const outputFile = `${id}.png`;
  await run("convert", [
    path.join(rawDirectory, rawFile),
    "-auto-orient",
    "-colorspace", "Gray",
    "-contrast-stretch", "1%x1%",
    "-fuzz", "8%",
    "-trim", "+repage",
    "-resize", "472x472>",
    "-gravity", "center",
    "-background", "white",
    "-extent", "512x512",
    "-lat", "25x25+4%",
    "-negate",
    "-type", "bilevel",
    "-strip",
    path.join(artDirectory, outputFile),
  ]);

  catalog.push({
    id,
    kind: candidate.kind,
    src: `/art/public-domain/${outputFile}`,
    alt: candidate.kind === "cartoon" ? cartoonDetails[candidate.sourceIndex].alt : illustrationAlt(candidate.title),
    categories: categoriesFor(candidate),
    sourceTitle: candidate.title,
    creator: candidate.creator,
    creationDate: candidate.date,
    collection: candidate.kind === "cartoon"
      ? "Harper's Weekly illustrations by Thomas Nast"
      : "Gustave Doré illustrations for Don Quixote (1863), Volume I",
    sourcePage: candidate.sourcePage,
    license: candidate.license,
    usageTerms: candidate.usageTerms,
    licenseUrl: candidate.licenseUrl || null,
    transformation: "Square 512×512 crop-safe fit, grayscale normalization, and locally adaptive one-bit line treatment.",
  });
}

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
process.stdout.write(`Prepared ${catalog.length} square public-domain assets and wrote ${catalogPath}\n`);
