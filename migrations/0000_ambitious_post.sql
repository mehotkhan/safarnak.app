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
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `devices` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`device_id` text NOT NULL,
	`type` text,
	`last_seen` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `devices_device_id_unique` ON `devices` (`device_id`);--> statement-breakpoint
CREATE TABLE `itineraries` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`day` integer NOT NULL,
	`activities` text,
	`accommodations` text,
	`transport` text,
	`notes` text,
	`cost_estimate` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`country` text NOT NULL,
	`coordinates` text,
	`description` text,
	`popular_activities` text,
	`average_cost` integer,
	`embedding` text,
	`image_url` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `locations_name_unique` ON `locations` (`name`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`type` text DEFAULT 'text',
	`metadata` text,
	`is_read` integer DEFAULT false,
	`user_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`data` text,
	`read` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tour_id` text,
	`subscription_id` text,
	`transaction_id` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'IRR',
	`status` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `user_subscriptions`(`id`) ON UPDATE no action ON DELETE no action
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
CREATE TABLE `places` (
	`id` text PRIMARY KEY NOT NULL,
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
	`location_id` text,
	`price` integer,
	`owner_id` text,
	`embedding` text,
	`image_url` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text,
	`map_data` text,
	`details` text,
	`ai_output` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`content` text,
	`attachments` text,
	`type` text,
	`related_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reactions` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text,
	`comment_id` text,
	`user_id` text NOT NULL,
	`emoji` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`connection_id` text NOT NULL,
	`connection_pool_id` text NOT NULL,
	`subscription` text NOT NULL,
	`topic` text NOT NULL,
	`filter` text,
	`user_id` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`expires_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sync_metadata` (
	`entity_type` text PRIMARY KEY NOT NULL,
	`last_sync_at` integer,
	`schema_version` integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `thoughts` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`step` text NOT NULL,
	`data` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` text PRIMARY KEY NOT NULL,
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
CREATE TABLE `trips` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
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
CREATE TABLE `user_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`interests` text,
	`budget_range` text,
	`travel_style` text,
	`preferred_destinations` text,
	`dietary_restrictions` text,
	`embedding` text,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_preferences_user_id_unique` ON `user_preferences` (`user_id`);--> statement-breakpoint
CREATE TABLE `user_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tier` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`active` integer DEFAULT true,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`email` text,
	`phone` text,
	`avatar` text,
	`is_active` integer DEFAULT true,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);