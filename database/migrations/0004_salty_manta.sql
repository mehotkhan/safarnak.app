PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tours` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`short_description` text,
	`price` integer NOT NULL,
	`currency` text DEFAULT 'USD',
	`rating` integer DEFAULT 0,
	`reviews` integer DEFAULT 0,
	`duration` integer NOT NULL,
	`duration_type` text DEFAULT 'days',
	`location` text NOT NULL,
	`coordinates` text,
	`category` text NOT NULL,
	`difficulty` text DEFAULT 'easy',
	`highlights` text,
	`inclusions` text,
	`max_participants` integer,
	`min_participants` integer DEFAULT 1,
	`image_url` text,
	`gallery` text,
	`tags` text,
	`is_active` integer DEFAULT true,
	`is_featured` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_tours`("id", "title", "description", "short_description", "price", "currency", "rating", "reviews", "duration", "duration_type", "location", "coordinates", "category", "difficulty", "highlights", "inclusions", "max_participants", "min_participants", "image_url", "gallery", "tags", "is_active", "is_featured", "created_at", "updated_at") SELECT "id", "title", "description", "short_description", "price", "currency", "rating", "reviews", "duration", "duration_type", "location", "coordinates", "category", "difficulty", "highlights", "inclusions", "max_participants", "min_participants", "image_url", "gallery", "tags", "is_active", "is_featured", "created_at", "updated_at" FROM `tours`;--> statement-breakpoint
DROP TABLE `tours`;--> statement-breakpoint
ALTER TABLE `__new_tours` RENAME TO `tours`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_trips` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`title` text,
	`destination` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
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
ALTER TABLE `places` ADD `location` text NOT NULL;--> statement-breakpoint
ALTER TABLE `places` ADD `distance` integer;--> statement-breakpoint
ALTER TABLE `places` ADD `rating` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `places` ADD `reviews` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `places` ADD `tips` text;--> statement-breakpoint
ALTER TABLE `places` ADD `is_open` integer DEFAULT true;--> statement-breakpoint
ALTER TABLE `places` ADD `hours` text;--> statement-breakpoint
ALTER TABLE `places` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `places` ADD `website` text;