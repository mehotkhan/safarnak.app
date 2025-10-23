// Shared base types and utilities for Drizzle schemas
export type Timestamp = string; // SQLite stores timestamps as text
export type UUID = string; // For text-based IDs

// Common field definitions
export const timestampField = () => ({
  type: 'text' as const,
  default: 'CURRENT_TIMESTAMP' as const,
});

export const uuidField = () => ({
  type: 'text' as const,
  primaryKey: true as const,
});
