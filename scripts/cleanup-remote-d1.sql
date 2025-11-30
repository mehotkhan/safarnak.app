-- Disable foreign key checks temporarily
PRAGMA foreign_keys = OFF;

-- Drop all existing tables (except system tables)
-- This ensures a clean slate before running migrations
DROP TABLE IF EXISTS d1_migrations;
DROP TABLE IF EXISTS apollo_cache_entries;
DROP TABLE IF EXISTS cached_map_tiles;
DROP TABLE IF EXISTS cached_messages;
DROP TABLE IF EXISTS cached_places;
DROP TABLE IF EXISTS cached_tours;
DROP TABLE IF EXISTS cached_trips;
DROP TABLE IF EXISTS cached_users;
DROP TABLE IF EXISTS pending_mutations;
DROP TABLE IF EXISTS sync_metadata;

-- Also drop any server tables that might exist
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS chat_invites;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS close_friends;
DROP TABLE IF EXISTS conversation_members;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS embeddings_meta;
DROP TABLE IF EXISTS feed_events;
DROP TABLE IF EXISTS feed_preferences;
DROP TABLE IF EXISTS follow_edges;
DROP TABLE IF EXISTS thoughts;
DROP TABLE IF EXISTS itineraries;
DROP TABLE IF EXISTS plans;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS user_subscriptions;
DROP TABLE IF EXISTS message_receipts;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS search_index;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS tours;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS challenges;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
PRAGMA foreign_keys = ON;

