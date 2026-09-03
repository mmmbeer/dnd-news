#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const selectionPath = path.resolve(process.argv[2]);
const outputDirectory = path.resolve(process.argv[3]);
const requestedIndexes = process.argv
  .find((argument) => argument.startsWith("--indexes="))
  ?.slice("--indexes=".length)
  .split(",")
  .map(Number);

function thumbnailUrl(candidate) {
  const original = new URL(candidate.downloadUrl);
  const parts = original.pathname.split("/").filter(Boolean);
  const commonsIndex = parts.indexOf("commons");
  const relativeParts = parts.slice(commonsIndex + 1);
  const filename = relativeParts.at(-1);
  const width = candidate.width > 960 ? 960 : 500;
  return `https://thumb.wikimedia.org/wikipedia/commons/thumb/${relativeParts.join("/")}/${width}px-${filename}`;
}

async function mapWithConcurrency(values, limit, mapper) {
  const output = new Array(values.length);
  let cursor = 0;
  async function worker() {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      output[index] = await mapper(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker));
  return output;
}

async function download(candidate) {
  const url = thumbnailUrl(candidate);
  const extension = candidate.title.toLowerCase().endsWith(".png") ? ".png" : ".jpg";
  const candidateFile = `${String(candidate.sourceIndex).padStart(3, "0")}-${candidate.kind}${extension}`;
  const response = await fetch(url, { headers: { "user-agent": "BroadsheetPublicDomainImporter/1.0" } });
  if (!response.ok) throw new Error(`Image download failed (${response.status}): ${url}`);
  await writeFile(path.join(outputDirectory, candidateFile), Buffer.from(await response.arrayBuffer()));
  return { ...candidate, candidateFile, fetchedThumbnailUrl: url };
}

await mkdir(outputDirectory, { recursive: true });
const selections = JSON.parse(await readFile(selectionPath, "utf8"));
const indexedSelections = selections
  .map((candidate, index) => ({ ...candidate, sourceIndex: index + 1 }))
  .filter((candidate) => !requestedIndexes || requestedIndexes.includes(candidate.sourceIndex));
const catalog = await mapWithConcurrency(indexedSelections, 4, download);
await writeFile(path.join(outputDirectory, "candidates.json"), `${JSON.stringify(catalog, null, 2)}\n`);
process.stdout.write(`Downloaded ${catalog.length} candidates to ${outputDirectory}\n`);
