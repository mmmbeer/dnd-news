import { z } from "zod";

export const SHARE_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;
export const MAX_SNAPSHOT_BYTES = 512 * 1024;

const storySchema = z.object({
  id: z.string().min(1).max(120),
  title: z.string().max(500),
  kicker: z.string().max(300),
  dek: z.string().max(2_000),
  byline: z.string().max(300),
  location: z.string().max(300),
  body: z.string().max(80_000),
  kind: z.enum(["lead", "news", "brief", "notice", "advert", "obituary", "comic"]),
  width: z.enum(["full", "wide", "standard"]),
  category: z.enum(["civic", "guilds", "crime", "arcane", "trade", "travel", "weather", "society", "culture", "adventure", "notices"]),
  generated: z.boolean(),
  locked: z.boolean(),
  illustrationId: z.string().max(160).nullable(),
  illustrationAlign: z.enum(["left", "right", "center"]),
  columnSpan: z.number().int().min(1).max(5).optional(),
  bodyColumns: z.number().int().min(1).max(5).optional(),
  minHeight: z.number().finite().min(0).max(10_000).optional(),
  illustrationScale: z.number().finite().min(1).max(100).optional(),
});

const issueSettingsSchema = z.object({
  newspaperName: z.string().max(300),
  motto: z.string().max(500),
  publicationDate: z.string().max(160),
  dateline: z.string().max(500),
  edition: z.string().max(160),
  price: z.string().max(100),
  volume: z.string().max(100),
  issueNumber: z.string().max(100),
  columns: z.number().int().min(2).max(5),
  pageSize: z.enum(["broadsheet", "tabloid", "letter"]),
  mastheadFont: z.string().max(100),
  headlineFont: z.string().max(100),
  bodyFont: z.string().max(100),
  bodySize: z.number().finite().min(6).max(24),
  lineHeight: z.number().finite().min(0.8).max(3),
  headlineScale: z.number().finite().min(0.5).max(2),
  colorTheme: z.enum(["charcoal", "oxblood", "navy", "forest"]),
  paperTone: z.number().finite().min(0).max(100),
  showRules: z.boolean(),
  justifyText: z.boolean(),
  showDropCaps: z.boolean(),
  presetId: z.enum(["blackwater", "crown-city", "lantern", "greenway", "adventurer"]),
});

export const newspaperIssueSchema = z.object({
  version: z.literal(1),
  seed: z.string().min(1).max(500),
  settings: issueSettingsSchema,
  stories: z.array(storySchema).min(1).max(100),
});

export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function snapshotByteLength(value: string) {
  return new TextEncoder().encode(value).byteLength;
}
