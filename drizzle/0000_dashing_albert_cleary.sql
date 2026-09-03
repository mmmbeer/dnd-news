CREATE TABLE `newspaper_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`issue_json` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_newspaper_snapshots_expires_at` ON `newspaper_snapshots` (`expires_at`);
--> statement-breakpoint
PRAGMA optimize;
