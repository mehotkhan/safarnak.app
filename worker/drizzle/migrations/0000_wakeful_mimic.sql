CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`connectionId` text NOT NULL,
	`connectionPoolId` text NOT NULL,
	`subscription` text NOT NULL,
	`topic` text NOT NULL,
	`filter` text
);
