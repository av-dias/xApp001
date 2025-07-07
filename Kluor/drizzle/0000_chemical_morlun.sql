CREATE TABLE `objects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`rating` integer NOT NULL,
	`url` text NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
