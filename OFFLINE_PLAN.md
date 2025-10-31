## Offline-First Architecture Plan (Apollo + Drizzle + Redux)

This document captures the agreed plan to implement a robust offline system using a shared Drizzle schema, Apollo Client for networking, and Redux for UI state only.

### 1) Shared Drizzle schema (SQLite-first)
- Create a new shared folder for table definitions, e.g., `dbschema/` with alias `@dbschema/*`.
- Keep schema strictly SQLite-compatible so it works for both Cloudflare D1 (server) and expo-sqlite/PGlite (client).
- Include sync-related fields:
  - `createdAt`, `updatedAt` (already present in GraphQL types)
  - Optional: `deletedAt` (soft delete)
  - Optional: local `pending` flag or a `pending_mutations` table

### 2) Platform DB adapters (client)
- Expose a single `db` from `@localdb` that internally selects adapter by platform:
  - Native: `drizzle-orm/expo-sqlite` with `expo-sqlite`
  - Web: `drizzle-orm/pglite` with `@electric-sql/pglite` (IndexedDB persistence)
- Strictly platform-gate imports so PGlite/WASM never bundles into native builds.
- Worker keeps using Drizzle with D1; both worker and client import schema from `@dbschema` (not from `database/`).

### 3) Data access: local-first
- Introduce thin data-access helpers/hooks per domain (e.g., trips/messages):
  - Reads: Query Drizzle first; if online and data is missing/stale, fetch via Apollo → upsert into Drizzle → return.
  - Writes: Save optimistically to Drizzle immediately (set `pending` or insert into `pending_mutations`). Queue network push and reconcile on success.
- Keep Redux for UI/ephemeral state only (forms, theme, auth token, sync status).

### 4) Sync engine
- Triggers: app start, app foreground, connectivity regain (NetInfo), and a periodic timer. Add background fetch later.
- Push: drain `pending_mutations` in order (exponential backoff on failure). Use client-generated IDs for idempotency.
- Pull: add delta support on server (e.g., `getTrips(since: String)` returning rows with `updatedAt > since`). On sync, fetch deltas and upsert into Drizzle.
- Subscriptions: keep `newMessages`; consider `tripUpdated`. Subscriptions complement but do not replace delta pulls.

### 5) Conflict resolution
- Start with last-write-wins based on `updatedAt`.
- Server returns canonical rows; client overwrites local on success.
- Prefer client-generated UUIDs so IDs are stable across offline/online.

### 6) Apollo integration
- Treat Apollo as the network layer; Drizzle is the UI source of truth.
- Apollo cache persistence is optional if Drizzle fully backs UI. If desired, use `apollo3-cache-persist` with AsyncStorage and adjust fetch policies (e.g., `cache-and-network` for selected ops).
- Replace the current Redux offline middleware queue with either:
  - A Drizzle-backed `pending_mutations` table (recommended), or
  - A custom Apollo link that gates requests while offline. The Drizzle queue provides clearer control and observability.

### 7) Networking and reachability
- Standardize on `@react-native-community/netinfo` plus a lightweight HEAD probe to the GraphQL endpoint.
- Use the same signal to trigger sync runs and to open any request gates.

### 8) Web considerations
- PGlite is heavier; gate it to web-only and validate WASM/IDB setup in Expo Web.
- If timeline is tight, ship mobile-first and add PGlite later.

### 9) Schema/versioning
- Track a local `schema_version`. If schema changes, run simple versioned migration scripts (client-side) before opening the DB.
- Track `lastSyncAt` per dataset (key-value table or settings row).

### 10) Security and privacy
- `expo-sqlite` is not encrypted. Avoid storing sensitive fields or plan for encrypted storage later.

### 11) Removal and consolidation
- Retire the current Redux offline middleware queue to avoid double-queueing.
- Keep Redux limited to UI/ephemeral concerns.

### 12) Minimal rollout plan (order of work; no code here)
1. Add `dbschema/` with shared tables and `@dbschema` alias; create `@localdb` that exports platform `db`.
2. Implement a `sync` module: push (queue drain) + pull (delta) with `lastSyncAt` tracking.
3. Create data-access helpers for one feature (e.g., trips) using local-first reads and optimistic writes.
4. Extend server queries to support delta pulls (e.g., `getTrips(since)`) and return canonical rows; run codegen.
5. Replace Redux offline middleware queue with Drizzle queue; integrate NetInfo triggers.
6. Gradually migrate other features (messages, etc.) to the same pattern; optionally add Apollo cache persistence.

### Key risks
- Double sources of truth: Drizzle is the UI source of truth; Apollo is for network.
- ID collisions: Standardize on client-generated UUIDs and ensure mutations accept them.
- PGlite bundling: Strict platform gating to keep native bundles slim.
- Background fetch limits: Foreground triggers must provide correctness; background is best-effort.


