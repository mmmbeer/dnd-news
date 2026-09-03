#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const outputDirectory = path.resolve(process.argv[2] ?? ".cache/public-domain-collections");
const metadataOnly = process.argv.includes("--metadata-only");

const collections = [
  {
    id: "dore-quixote",
    category: "Category:Illustrations by Gustave Doré in L'ingénieux hidalgo don Quichotte de la Manche (1863), Volume I",
    kind: "illustration",
    limit: 72,
  },
  {
    id: "nast-cartoons",
    category: "Category:Harper's Weekly illustrations by Thomas Nast",
    kind: "cartoon",
    limit: 40,
  },
];

const cartoonTerms = [
  "ballot", "boss", "business", "campaign", "congress", "corrupt", "currency",
  "election", "finance", "government", "labor", "money", "office", "panic",
  "politic", "reform", "ring", "senate", "tax", "thief", "tiger", "treasury",
  "trust", "tweed", "vote", "vulture",
];

const cartoonExclusions = [
  "catholic", "chinese", "colored", "emancipation", "freedmen", "immigrant",
  "indian", "irish", "ku klux", "massacre", "negro", "race", "rebel",
  "reconstruction", "slave", "suffrage",
];

function apiUrl(parameters) {
  const url = new URL(COMMONS_API);
  for (const [key, value] of Object.entries({ action: "query", format: "json", ...parameters })) {
    url.searchParams.set(key, value);
  }
  return url;
}

async function fetchJson(url) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(url, { headers: { "user-agent": "BroadsheetPublicDomainImporter/1.0" } });
    if (response.ok) return response.json();
    if (response.status !== 429) throw new Error(`Request failed (${response.status}): ${url}`);
    const seconds = Number(response.headers.get("retry-after") ?? 2 + attempt * 2);
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
  throw new Error(`Commons rate limit persisted: ${url}`);
}

async function getCategoryMembers(category) {
  const members = [];
  let continuation;
  do {
    const payload = await fetchJson(apiUrl({
      list: "categorymembers",
      cmtitle: category,
      cmtype: "file",
      cmlimit: "500",
      ...(continuation ? { cmcontinue: continuation } : {}),
    }));
    members.push(...(payload.query?.categorymembers ?? []));
    continuation = payload.continue?.cmcontinue;
  } while (continuation);
  return members;
}

function chunk(values, size) {
  return Array.from({ length: Math.ceil(values.length / size) }, (_, index) => values.slice(index * size, (index + 1) * size));
}

function textFromHtml(value = "") {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function metadataValue(metadata, key) {
  return textFromHtml(metadata?.[key]?.value ?? "");
}

function isPublicDomain(metadata) {
  const license = metadataValue(metadata, "LicenseShortName").toLowerCase();
  const usage = metadataValue(metadata, "UsageTerms").toLowerCase();
  return license === "public domain" || license === "cc0" || usage.includes("public domain");
}

async function getImageInfo(titles) {
  const pages = [];
  for (const titleBatch of chunk(titles, 40)) {
    const payload = await fetchJson(apiUrl({
      prop: "imageinfo",
      titles: titleBatch.join("|"),
      iiprop: "url|size|mime|extmetadata",
      iiurlwidth: "1200",
    }));
    pages.push(...Object.values(payload.query?.pages ?? {}));
  }
  return pages;
}

function stableNumber(value) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function sourcePage(title) {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`;
}

function candidateFromPage(page, collection) {
  const info = page.imageinfo?.[0];
  if (!info || !isPublicDomain(info.extmetadata)) return null;
  if (!/^image\/(?:jpeg|png|webp)$/i.test(info.mime)) return null;
  if (info.width < 600 || info.height < 600) return null;
  const ratio = Math.max(info.width, info.height) / Math.min(info.width, info.height);
  if (ratio > 2.2) return null;

  const metadata = info.extmetadata;
  return {
    collection: collection.id,
    kind: collection.kind,
    title: page.title.replace(/^File:/, ""),
    creator: metadataValue(metadata, "Artist") || "Unknown",
    date: metadataValue(metadata, "DateTimeOriginal") || "Unknown",
    source: metadataValue(metadata, "Credit") || metadataValue(metadata, "Source") || "Wikimedia Commons",
    license: metadataValue(metadata, "LicenseShortName"),
    usageTerms: metadataValue(metadata, "UsageTerms"),
    licenseUrl: metadataValue(metadata, "LicenseUrl"),
    sourcePage: info.descriptionurl ?? sourcePage(page.title),
    downloadUrl: info.url,
    thumbnailUrl: info.thumburl ?? info.url,
    width: info.width,
    height: info.height,
  };
}

function selectCandidates(candidates, collection) {
  let filtered = candidates;
  if (collection.kind === "cartoon") {
    filtered = candidates.filter((candidate) => {
      const title = candidate.title.toLowerCase();
      return cartoonTerms.some((term) => title.includes(term))
        && !cartoonExclusions.some((term) => title.includes(term));
    });
  }
  return filtered
    .sort((left, right) => stableNumber(left.title) - stableNumber(right.title))
    .slice(0, collection.limit);
}

function preselectMembers(members, collection) {
  let filtered = members.filter((member) => /\.(?:jpe?g|png|webp)$/i.test(member.title));
  if (collection.kind === "cartoon") {
    filtered = filtered.filter((member) => {
      const title = member.title.toLowerCase();
      return cartoonTerms.some((term) => title.includes(term))
        && !cartoonExclusions.some((term) => title.includes(term));
    });
  }
  const metadataAllowance = collection.kind === "cartoon" ? 80 : 110;
  return filtered
    .sort((left, right) => stableNumber(left.title) - stableNumber(right.title))
    .slice(0, metadataAllowance);
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

async function download(candidate, index) {
  const extension = candidate.thumbnailUrl.toLowerCase().includes(".png") ? ".png" : ".jpg";
  const candidateFile = `${String(index + 1).padStart(3, "0")}-${candidate.kind}${extension}`;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetch(candidate.thumbnailUrl, { headers: { "user-agent": "BroadsheetPublicDomainImporter/1.0" } });
    if (response.ok) {
      await writeFile(path.join(outputDirectory, candidateFile), Buffer.from(await response.arrayBuffer()));
      return { ...candidate, candidateFile };
    }
    if (response.status !== 429) throw new Error(`Image download failed (${response.status}): ${candidate.thumbnailUrl}`);
    const seconds = Number(response.headers.get("retry-after") ?? 3 + attempt * 3);
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
  throw new Error(`Image rate limit persisted: ${candidate.thumbnailUrl}`);
}

async function main() {
  await mkdir(outputDirectory, { recursive: true });
  const selections = [];
  for (const collection of collections) {
    const members = await getCategoryMembers(collection.category);
    const preselected = preselectMembers(members, collection);
    const pages = await getImageInfo(preselected.map((member) => member.title));
    const candidates = pages.map((page) => candidateFromPage(page, collection)).filter(Boolean);
    selections.push(...selectCandidates(candidates, collection));
  }

  await writeFile(path.join(outputDirectory, "selections.json"), `${JSON.stringify(selections, null, 2)}\n`);
  if (metadataOnly) {
    process.stdout.write(`Selected ${selections.length} public-domain candidates in ${outputDirectory}\n`);
    return;
  }

  const catalog = await mapWithConcurrency(selections, 2, download);
  await writeFile(path.join(outputDirectory, "candidates.json"), `${JSON.stringify(catalog, null, 2)}\n`);
  process.stdout.write(`Downloaded ${catalog.length} public-domain candidates to ${outputDirectory}\n`);
}

await main();
