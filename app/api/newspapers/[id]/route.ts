import { NextResponse } from "next/server";
import { getRawDb } from "@/db";
import {
  hashShareUpdateToken,
  MAX_SNAPSHOT_BYTES,
  newspaperIssueSchema,
  SHARE_LIFETIME_MS,
  snapshotByteLength,
  uuidPattern,
} from "@/lib/news/sharing";

export const runtime = "edge";

interface SnapshotRow {
  issue_json: string;
  created_at: number;
  expires_at: number;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!uuidPattern.test(id)) {
    return NextResponse.json({ error: "This newspaper link is invalid." }, { status: 404 });
  }

  let row: SnapshotRow | null;
  try {
    const db = getRawDb();
    const now = Date.now();
    await db.prepare("DELETE FROM newspaper_snapshots WHERE expires_at <= ?").bind(now).run();

    row = await db.prepare(
      "SELECT issue_json, created_at, expires_at FROM newspaper_snapshots WHERE id = ? AND expires_at > ? LIMIT 1",
    ).bind(id, now).first<SnapshotRow>();
  } catch (error) {
    console.error("Failed to load newspaper snapshot", error);
    return NextResponse.json({ error: "Shared newspapers are temporarily unavailable." }, { status: 503 });
  }

  if (!row) {
    return NextResponse.json({ error: "This newspaper is unavailable or its 30-day link has expired." }, { status: 404 });
  }

  let issue: unknown;
  try {
    issue = JSON.parse(row.issue_json);
  } catch {
    return NextResponse.json({ error: "This newspaper could not be opened." }, { status: 500 });
  }

  const parsed = newspaperIssueSchema.safeParse(issue);
  if (!parsed.success) {
    return NextResponse.json({ error: "This newspaper could not be opened." }, { status: 500 });
  }

  return NextResponse.json(
    { issue: parsed.data, createdAt: row.created_at, expiresAt: row.expires_at },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const updateToken = request.headers.get("x-share-update-token") ?? "";
  if (!uuidPattern.test(id) || !uuidPattern.test(updateToken)) {
    return NextResponse.json({ error: "This shared newspaper cannot be updated." }, { status: 404 });
  }

  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > MAX_SNAPSHOT_BYTES) {
    return NextResponse.json({ error: "This newspaper is too large to share." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The newspaper data could not be read." }, { status: 400 });
  }

  const parsed = newspaperIssueSchema.safeParse(
    body && typeof body === "object" && "issue" in body ? (body as { issue: unknown }).issue : undefined,
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "The newspaper data is incomplete or invalid." }, { status: 400 });
  }

  const issueJson = JSON.stringify(parsed.data);
  if (snapshotByteLength(issueJson) > MAX_SNAPSHOT_BYTES) {
    return NextResponse.json({ error: "This newspaper is too large to share." }, { status: 413 });
  }

  try {
    const db = getRawDb();
    const updatedAt = Date.now();
    const expiresAt = updatedAt + SHARE_LIFETIME_MS;
    const editTokenHash = await hashShareUpdateToken(updateToken);
    const result = await db.prepare(
      "UPDATE newspaper_snapshots SET issue_json = ?, expires_at = ? WHERE id = ? AND edit_token_hash = ? AND expires_at > ?",
    ).bind(issueJson, expiresAt, id, editTokenHash, updatedAt).run();

    if (!result.meta.changes) {
      return NextResponse.json({ error: "This shared newspaper is unavailable or can no longer be updated." }, { status: 404 });
    }

    const shareUrl = new URL(`/share/${id}`, request.url).toString();
    return NextResponse.json(
      { id, url: shareUrl, updatedAt, expiresAt },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Failed to update newspaper snapshot", error);
    return NextResponse.json(
      { error: "Sharing is temporarily unavailable. Your newspaper is still saved on this device." },
      { status: 503 },
    );
  }
}
