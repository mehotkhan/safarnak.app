CREATE TABLE `apollo_cache_entries` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
