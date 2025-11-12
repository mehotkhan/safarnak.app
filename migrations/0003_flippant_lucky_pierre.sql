CREATE TABLE `feed_events` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`actor_id` text NOT NULL,
	`verb` text NOT NULL,
	`topics` text,
	`visibility` text DEFAULT 'PUBLIC',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`rank` real DEFAULT 0,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `feed_preferences` (
	`user_id` text PRIMARY KEY NOT NULL,
	`entity_types` text,
	`topics` text,
	`following_only` integer DEFAULT false,
	`circle_only` integer DEFAULT false,
	`muted_user_ids` text,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
