import { NextResponse } from "next/server";
import { getRawDb } from "@/db";
import { newspaperIssueSchema, uuidPattern } from "@/lib/news/sharing";

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
