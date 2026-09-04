import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const newspaperSnapshots = sqliteTable(
  "newspaper_snapshots",
  {
    id: text("id").primaryKey(),
    issueJson: text("issue_json").notNull(),
    editTokenHash: text("edit_token_hash"),
    createdAt: integer("created_at").notNull(),
    expiresAt: integer("expires_at").notNull(),
  },
  (table) => [index("idx_newspaper_snapshots_expires_at").on(table.expiresAt)],
);
