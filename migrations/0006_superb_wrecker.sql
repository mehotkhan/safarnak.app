CREATE TABLE `embeddings_meta` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`vector_id` text NOT NULL,
	`model` text NOT NULL,
	`lang` text,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
