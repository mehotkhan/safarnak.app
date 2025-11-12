CREATE TABLE `search_index` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`title` text,
	`text` text,
	`tags` text,
	`location_name` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`lang` text,
	`tokens` text,
	`trigrams` text
);
