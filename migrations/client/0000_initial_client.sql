CREATE TABLE IF NOT EXISTS cached_users (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_sync_at INTEGER,
  pending INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cached_profiles (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  phone TEXT,
  home_base TEXT,
  travel_style TEXT,
  languages TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_sync_at INTEGER,
  pending INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cached_trips (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT,
  destination TEXT,
  start_date TEXT,
  end_date TEXT,
  budget INTEGER,
  travelers INTEGER NOT NULL DEFAULT 1,
  preferences TEXT,
  accommodation TEXT,
  status TEXT NOT NULL DEFAULT 'in_progress',
  ai_reasoning TEXT,
  itinerary TEXT,
  coordinates TEXT,
  waypoints TEXT,
  is_hosted INTEGER DEFAULT 0,
  location TEXT,
  price REAL,
  currency TEXT DEFAULT 'USD',
  rating REAL DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  duration INTEGER,
  duration_type TEXT DEFAULT 'days',
  category TEXT,
  difficulty TEXT,
  description TEXT,
  short_description TEXT,
  highlights TEXT,
  inclusions TEXT,
  max_participants INTEGER,
  min_participants INTEGER DEFAULT 1,
  host_intro TEXT,
  join_policy TEXT DEFAULT 'open',
  booking_instructions TEXT,
  image_url TEXT,
  gallery TEXT,
  tags TEXT,
  is_active INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  external_booking_url TEXT,
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_sync_at INTEGER,
  pending INTEGER DEFAULT 0,
  deleted_at INTEGER
);

CREATE TABLE IF NOT EXISTS cached_trip_participants (
  id TEXT PRIMARY KEY NOT NULL,
  trip_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  join_status TEXT NOT NULL DEFAULT 'REQUESTED',
  notes TEXT,
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_sync_at INTEGER,
  pending INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cached_trip_days (
  id TEXT PRIMARY KEY NOT NULL,
  trip_id TEXT NOT NULL,
  day_index INTEGER NOT NULL,
  date TEXT,
  title TEXT,
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_sync_at INTEGER,
  pending INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cached_trip_items (
  id TEXT PRIMARY KEY NOT NULL,
  trip_day_id TEXT NOT NULL,
  place_id TEXT,
  time TEXT,
  title TEXT NOT NULL,
  description TEXT,
  metadata TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_sync_at INTEGER,
  pending INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cached_places (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  distance REAL,
  rating REAL NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL,
  is_open INTEGER NOT NULL DEFAULT 1,
  description TEXT NOT NULL,
  tips TEXT,
  coordinates TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  hours TEXT,
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_sync_at INTEGER
);

CREATE TABLE IF NOT EXISTS cached_messages (
  id TEXT PRIMARY KEY NOT NULL,
  content TEXT NOT NULL,
  user_id TEXT,
  type TEXT DEFAULT 'text',
  metadata TEXT,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_sync_at INTEGER,
  pending INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cached_conversations (
  id TEXT PRIMARY KEY NOT NULL,
  kind TEXT NOT NULL,
  trip_id TEXT,
  title TEXT,
  last_message_preview TEXT,
  last_message_at TEXT,
  created_at TEXT,
  updated_at TEXT,
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_sync_at INTEGER,
  pending INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cached_conversation_members (
  id TEXT PRIMARY KEY NOT NULL,
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  joined_at TEXT,
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_sync_at INTEGER,
  pending INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cached_chat_messages (
  id TEXT PRIMARY KEY NOT NULL,
  conversation_id TEXT NOT NULL,
  sender_user_id TEXT NOT NULL,
  sender_device_id TEXT NOT NULL,
  ciphertext TEXT NOT NULL,
  ciphertext_meta TEXT,
  type TEXT DEFAULT 'text',
  metadata TEXT,
  created_at TEXT,
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_sync_at INTEGER,
  pending INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS local_conversation_keys (
  conversation_id TEXT PRIMARY KEY NOT NULL,
  key_id TEXT,
  encrypted_key TEXT NOT NULL,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS pending_mutations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operation_name TEXT NOT NULL,
  variables TEXT NOT NULL,
  mutation TEXT NOT NULL,
  queued_at INTEGER DEFAULT (strftime('%s', 'now')),
  retries INTEGER DEFAULT 0,
  last_error TEXT
);

CREATE TABLE IF NOT EXISTS sync_metadata (
  entity_type TEXT PRIMARY KEY NOT NULL,
  last_sync_at INTEGER,
  schema_version INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS apollo_cache_entries (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS cached_map_tiles (
  id TEXT PRIMARY KEY NOT NULL,
  layer TEXT NOT NULL,
  z INTEGER NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  cached_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_accessed INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_cached_profiles_user_id ON cached_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_cached_trips_user_id ON cached_trips(user_id);
CREATE INDEX IF NOT EXISTS idx_cached_trips_destination ON cached_trips(destination);
CREATE INDEX IF NOT EXISTS idx_cached_trips_status ON cached_trips(status);
CREATE INDEX IF NOT EXISTS idx_cached_trips_is_hosted ON cached_trips(is_hosted);
CREATE INDEX IF NOT EXISTS idx_cached_trips_cached_at ON cached_trips(cached_at);
CREATE INDEX IF NOT EXISTS idx_cached_trip_participants_trip_id ON cached_trip_participants(trip_id);
CREATE INDEX IF NOT EXISTS idx_cached_trip_participants_user_id ON cached_trip_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_cached_trip_days_trip_id ON cached_trip_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_cached_trip_days_day_index ON cached_trip_days(trip_id, day_index);
CREATE INDEX IF NOT EXISTS idx_cached_trip_items_trip_day_id ON cached_trip_items(trip_day_id);
CREATE INDEX IF NOT EXISTS idx_cached_trip_items_order ON cached_trip_items(trip_day_id, "order");
CREATE INDEX IF NOT EXISTS idx_cached_places_type ON cached_places(type);
CREATE INDEX IF NOT EXISTS idx_cached_places_location ON cached_places(location);
CREATE INDEX IF NOT EXISTS idx_cached_conversations_kind ON cached_conversations(kind);
CREATE INDEX IF NOT EXISTS idx_cached_conversations_last_message ON cached_conversations(last_message_at);
CREATE INDEX IF NOT EXISTS idx_cached_conversation_members_conversation ON cached_conversation_members(conversation_id);
CREATE INDEX IF NOT EXISTS idx_cached_conversation_members_user ON cached_conversation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_cached_chat_messages_conversation ON cached_chat_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_cached_chat_messages_sender ON cached_chat_messages(sender_user_id);
CREATE INDEX IF NOT EXISTS idx_pending_mutations_queued_at ON pending_mutations(queued_at);
CREATE INDEX IF NOT EXISTS idx_apollo_cache_entity ON apollo_cache_entries(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_apollo_cache_updated_at ON apollo_cache_entries(updated_at);
CREATE INDEX IF NOT EXISTS idx_cached_map_tiles_layer ON cached_map_tiles(layer);
CREATE INDEX IF NOT EXISTS idx_cached_map_tiles_coords ON cached_map_tiles(z, x, y);
CREATE INDEX IF NOT EXISTS idx_cached_map_tiles_cached_at ON cached_map_tiles(cached_at);
CREATE INDEX IF NOT EXISTS idx_cached_map_tiles_last_accessed ON cached_map_tiles(last_accessed);


