CREATE TABLE `checklists` (
	`id` integer PRIMARY KEY NOT NULL,
	`report_id` integer NOT NULL,
	`item` text NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `issues` (
	`id` integer PRIMARY KEY NOT NULL,
	`report_id` integer NOT NULL,
	`description` text NOT NULL,
	`is_resolved` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` integer PRIMARY KEY NOT NULL,
	`report_id` integer NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `reports` DROP COLUMN `checklists`;--> statement-breakpoint
ALTER TABLE `reports` DROP COLUMN `issues`;--> statement-breakpoint
ALTER TABLE `reports` DROP COLUMN `photos`;