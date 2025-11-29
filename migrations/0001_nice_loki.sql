ALTER TABLE `users` ADD `email_verified` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `phone_verified` integer DEFAULT false;--> statement-breakpoint
CREATE INDEX `chat_invites_conversation_id_idx` ON `chat_invites` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `chat_invites_to_user_id_idx` ON `chat_invites` (`to_user_id`);--> statement-breakpoint
CREATE INDEX `chat_messages_conversation_id_created_at_idx` ON `chat_messages` (`conversation_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `conversation_members_conversation_id_idx` ON `conversation_members` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `conversation_members_user_id_idx` ON `conversation_members` (`user_id`);--> statement-breakpoint
CREATE INDEX `message_receipts_message_id_idx` ON `message_receipts` (`message_id`);