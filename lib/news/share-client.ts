import type { NewspaperIssue } from "@/lib/news/types";

export interface ShareSnapshot {
  id: string;
  url: string;
  expiresAt: number;
}

export interface ShareReference extends ShareSnapshot {
  updateToken: string;
  issueDigest: string;
}

export type ShareAction = "create" | "replace";
export type ShareDestination = "create" | "existing" | "decide";

export function isShareReference(value: unknown): value is ShareReference {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ShareReference>;
  return typeof candidate.id === "string"
    && typeof candidate.url === "string"
    && typeof candidate.expiresAt === "number"
    && typeof candidate.updateToken === "string"
    && typeof candidate.issueDigest === "string";
}

export async function issueDigest(issue: NewspaperIssue) {
  const bytes = new TextEncoder().encode(JSON.stringify(issue));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function shareDestination(
  reference: ShareReference | null,
  currentDigest: string,
  now = Date.now(),
): ShareDestination {
  if (!reference || reference.expiresAt <= now) return "create";
  return reference.issueDigest === currentDigest ? "existing" : "decide";
}
