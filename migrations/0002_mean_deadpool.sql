ALTER TABLE `locations` ADD `best_time_to_visit` text;--> statement-breakpoint
ALTER TABLE `locations` ADD `population` text;--> statement-breakpoint
ALTER TABLE `locations` ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP);