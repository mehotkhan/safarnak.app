CREATE TABLE `cached_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`type` text DEFAULT 'text',
	`metadata` text,
	`is_read` integer DEFAULT false,
	`user_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`cached_at` integer DEFAULT (strftime('%s', 'now')),
	`last_sync_at` integer,
	`pending` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `cached_places` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`distance` real,
	`rating` real DEFAULT 0,
	`reviews` integer DEFAULT 0,
	`type` text NOT NULL,
	`is_open` integer DEFAULT true,
	`description` text NOT NULL,
	`tips` text,
	`coordinates` text NOT NULL,
	`phone` text,
	`website` text,
	`hours` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`cached_at` integer DEFAULT (strftime('%s', 'now')),
	`last_sync_at` integer
);
--> statement-breakpoint
CREATE TABLE `cached_tours` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`short_description` text,
	`price` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`rating` real DEFAULT 0,
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
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`cached_at` integer DEFAULT (strftime('%s', 'now')),
	`last_sync_at` integer
);
--> statement-breakpoint
CREATE TABLE `cached_trips` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text,
	`destination` text,
	`start_date` text,
	`end_date` text,
	`budget` real,
	`travelers` integer DEFAULT 1,
	`preferences` text,
	`accommodation` text,
	`status` text DEFAULT 'in_progress',
	`ai_reasoning` text,
	`itinerary` text,
	`coordinates` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`cached_at` integer DEFAULT (strftime('%s', 'now')),
	`last_sync_at` integer,
	`pending` integer DEFAULT false,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `cached_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`email` text,
	`phone` text,
	`avatar` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`cached_at` integer DEFAULT (strftime('%s', 'now')),
	`last_sync_at` integer,
	`pending` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `pending_mutations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`operation_name` text NOT NULL,
	`variables` text NOT NULL,
	`mutation` text NOT NULL,
	`queued_at` integer DEFAULT (strftime('%s', 'now')),
	`retries` integer DEFAULT 0,
	`last_error` text
);
--> statement-breakpoint
CREATE TABLE `sync_metadata` (
	`entity_type` text PRIMARY KEY NOT NULL,
	`last_sync_at` integer,
	`schema_version` integer DEFAULT 1
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_places` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`distance` real,
	`rating` integer DEFAULT 0,
	`reviews` integer DEFAULT 0,
	`type` text NOT NULL,
	`is_open` integer DEFAULT true,
	`description` text NOT NULL,
	`tips` text,
	`coordinates` text NOT NULL,
	`phone` text,
	`website` text,
	`hours` text,
	`location_id` integer,
	`price` integer,
	`owner_id` integer,
	`embedding` text,
	`image_url` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_places`("id", "name", "location", "distance", "rating", "reviews", "type", "is_open", "description", "tips", "coordinates", "phone", "website", "hours", "location_id", "price", "owner_id", "embedding", "image_url", "created_at") SELECT "id", "name", "location", "distance", "rating", "reviews", "type", "is_open", "description", "tips", "coordinates", "phone", "website", "hours", "location_id", "price", "owner_id", "embedding", "image_url", "created_at" FROM `places`;--> statement-breakpoint
DROP TABLE `places`;--> statement-breakpoint
ALTER TABLE `__new_places` RENAME TO `places`;--> statement-breakpoint
PRAGMA foreign_keys=ON;