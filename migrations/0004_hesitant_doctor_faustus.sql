CREATE TABLE `challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`nonce` text NOT NULL,
	`is_register` integer DEFAULT false,
	`expires_at` integer NOT NULL,
	`used` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`email` text,
	`phone` text,
	`avatar` text,
	`is_active` integer DEFAULT true,
	`password_hash` text,
	`public_key` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "username", "email", "phone", "avatar", "is_active", "password_hash", "public_key", "created_at", "updated_at") SELECT "id", "name", "username", "email", "phone", "avatar", "is_active", "password_hash", NULL, "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);