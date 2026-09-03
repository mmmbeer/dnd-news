import { NextResponse } from "next/server";
import { getRawDb } from "@/db";
import {
  MAX_SNAPSHOT_BYTES,
  newspaperIssueSchema,
  SHARE_LIFETIME_MS,
  snapshotByteLength,
} from "@/lib/news/sharing";

export const runtime = "edge";

export async function POST(request: Request) {
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
    const id = crypto.randomUUID();
    const createdAt = Date.now();
    const expiresAt = createdAt + SHARE_LIFETIME_MS;

    await db.batch([
      db.prepare("DELETE FROM newspaper_snapshots WHERE expires_at <= ?").bind(createdAt),
      db.prepare(
        "INSERT INTO newspaper_snapshots (id, issue_json, created_at, expires_at) VALUES (?, ?, ?, ?)",
      ).bind(id, issueJson, createdAt, expiresAt),
    ]);

    const shareUrl = new URL(`/share/${id}`, request.url).toString();
    return NextResponse.json({ id, url: shareUrl, createdAt, expiresAt }, {
      status: 201,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Failed to save newspaper snapshot", error);
    return NextResponse.json(
      { error: "Sharing is temporarily unavailable. Your newspaper is still saved on this device." },
      { status: 503 },
    );
  }
}
