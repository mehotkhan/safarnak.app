-- Disable foreign key checks temporarily
PRAGMA foreign_keys = OFF;

-- Drop all existing tables (except system tables)
-- This ensures a clean slate before running migrations
DROP TABLE IF EXISTS d1_migrations;
DROP TABLE IF EXISTS apollo_cache_entries;
DROP TABLE IF EXISTS cached_messages;
DROP TABLE IF EXISTS cached_places;
DROP TABLE IF EXISTS cached_tours;
DROP TABLE IF EXISTS cached_trips;
DROP TABLE IF EXISTS cached_users;
DROP TABLE IF EXISTS pending_mutations;
DROP TABLE IF EXISTS sync_metadata;

-- Also drop any server tables that might exist
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS thoughts;
DROP TABLE IF EXISTS itineraries;
DROP TABLE IF EXISTS plans;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS user_subscriptions;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS tours;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS challenges;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
PRAGMA foreign_keys = ON;

