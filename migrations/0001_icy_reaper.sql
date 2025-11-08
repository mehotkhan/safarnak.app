CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`tour_id` text NOT NULL,
	`user_id` text NOT NULL,
	`participants` integer DEFAULT 1 NOT NULL,
	`selected_date` text NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`special_requests` text,
	`total_price` real NOT NULL,
	`status` text DEFAULT 'pending',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
