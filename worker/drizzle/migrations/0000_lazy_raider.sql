CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`tour_id` integer,
	`booking_date` text NOT NULL,
	`tour_date` text NOT NULL,
	`status` text DEFAULT 'pending',
	`total_price` integer NOT NULL,
	`participants` integer DEFAULT 1,
	`special_requests` text,
	`notes` text,
	`payment_status` text DEFAULT 'pending',
	`payment_method` text,
	`payment_id` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`icon` text,
	`color` text,
	`is_active` integer DEFAULT true,
	`sort_order` integer DEFAULT 0,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`tour_id` integer,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `guides` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`bio` text,
	`experience` integer,
	`languages` text,
	`specialties` text,
	`rating` integer DEFAULT 0,
	`total_tours` integer DEFAULT 0,
	`is_verified` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`country` text NOT NULL,
	`city` text,
	`coordinates` text,
	`timezone` text,
	`currency` text,
	`language` text,
	`description` text,
	`image_url` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`user_id` integer,
	`type` text DEFAULT 'text',
	`metadata` text,
	`is_read` integer DEFAULT false,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`data` text,
	`is_read` integer DEFAULT false,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`tour_id` integer,
	`booking_id` integer,
	`rating` integer NOT NULL,
	`title` text,
	`comment` text,
	`photos` text,
	`is_verified` integer DEFAULT false,
	`helpful` integer DEFAULT 0,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`type` text DEFAULT 'string',
	`description` text,
	`is_public` integer DEFAULT false,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`connection_id` text NOT NULL,
	`connection_pool_id` text NOT NULL,
	`subscription` text NOT NULL,
	`topic` text NOT NULL,
	`filter` text,
	`user_id` integer,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`expires_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tour_guides` (
	`id` integer PRIMARY KEY NOT NULL,
	`tour_id` integer,
	`guide_id` integer,
	`is_primary` integer DEFAULT false,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`guide_id`) REFERENCES `guides`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`short_description` text,
	`price` integer NOT NULL,
	`currency` text DEFAULT 'USD',
	`duration` integer,
	`duration_type` text DEFAULT 'hours',
	`location` text NOT NULL,
	`coordinates` text,
	`category` text,
	`difficulty` text DEFAULT 'easy',
	`max_participants` integer,
	`min_participants` integer DEFAULT 1,
	`image_url` text,
	`gallery` text,
	`tags` text,
	`is_active` integer DEFAULT true,
	`is_featured` integer DEFAULT false,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`email` text,
	`phone` text,
	`avatar` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);