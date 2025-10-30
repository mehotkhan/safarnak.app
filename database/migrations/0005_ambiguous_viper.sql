PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trips` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`title` text,
	`destination` text,
	`start_date` text,
	`end_date` text,
	`budget` integer,
	`travelers` integer DEFAULT 1,
	`preferences` text,
	`accommodation` text,
	`status` text DEFAULT 'in_progress',
	`ai_reasoning` text,
	`itinerary` text,
	`coordinates` text,
	`ai_generated` integer DEFAULT true,
	`metadata` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_trips`("id", "user_id", "title", "destination", "start_date", "end_date", "budget", "travelers", "preferences", "accommodation", "status", "ai_reasoning", "itinerary", "coordinates", "ai_generated", "metadata", "created_at", "updated_at") SELECT "id", "user_id", "title", "destination", "start_date", "end_date", "budget", "travelers", "preferences", "accommodation", "status", "ai_reasoning", "itinerary", "coordinates", "ai_generated", "metadata", "created_at", "updated_at" FROM `trips`;--> statement-breakpoint
DROP TABLE `trips`;--> statement-breakpoint
ALTER TABLE `__new_trips` RENAME TO `trips`;--> statement-breakpoint
PRAGMA foreign_keys=ON;