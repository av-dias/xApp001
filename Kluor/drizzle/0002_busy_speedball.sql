PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_objects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`rating` integer NOT NULL,
	`url` text NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_objects`("id", "name", "category", "description", "tags", "rating", "url", "createdAt") SELECT "id", "name", "category", "description", "tags", "rating", "url", "createdAt" FROM `objects`;--> statement-breakpoint
DROP TABLE `objects`;--> statement-breakpoint
ALTER TABLE `__new_objects` RENAME TO `objects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;