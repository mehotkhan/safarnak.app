# Safarnak Messaging – Multi-Phase Implementation Plan

## Phase 0 – Pre-flight Discovery
- Inventory current messaging code paths (`messages`, `chat`, `conversation`, `inbox`, `MessageBubble`, `messages/[id].tsx`).
- Capture all worker-side messaging resolvers/operations (queries, mutations, subscriptions).
- Document UI entry points (Inbox tab, trip detail, user profile) to understand future rewiring.

## Phase 1 – Server Data Layer (D1 + Drizzle)
- Extend `database/schema.ts` with `conversations`, `conversationMembers`, `chatMessages`, `messageReceipts`, `chatInvites`.
- Export new tables via `serverSchema` and `database/server.ts`.
- Generate matching SQL migration (`migrations/013_messaging_conversations.sql`) with required indexes, mirroring Drizzle definitions.
- Apply migration locally (`yarn db:migrate`) once authored.

## Phase 2 – GraphQL Schema & Types
- Update `graphql/schema.graphql` with `Conversation`, `ChatMessage` types and new queries/mutations/subscriptions.
- Run `yarn codegen` to refresh generated types; resolve schema validation issues.

## Phase 3 – Worker Resolvers & Pub/Sub
- Implement messaging resolver module (`worker/resolvers/messaging.ts`).
- Add helpers like `ensureUserInConversation`.
- Implement resolvers for `createConversation`, `sendMessage`, `myConversations`, `conversationMessagesPage`, `createChatInvite`, `ackChatInvite`, and subscription wiring.
- Register resolvers with Yoga server and enforce auth/status guards.

## Phase 4 – Client Data Layer (SQLite + Sync)
- Add cached tables in `database/client.ts` (`cachedConversations`, `cachedConversationMembers`, `cachedChatMessages`, `localConversationKeys`) and corresponding migration.
- Update cache storage/Drizzle sync mappings to persist Conversation & ChatMessage entities and support `sendMessage` pending mutations.

## Phase 5 – Crypto Utilities
- Create `crypto/conversationKeys.ts` providing `getOrCreateConversationKey`, `encryptMessage`, `decryptMessage`, and invite helpers leveraging device keys.
- Store encrypted conversation keys via `localConversationKeys`.

## Phase 6 – Client Hooks & UI Integration
- Inbox: implement `useMyConversations` to hydrate data from Apollo + SQLite and wire navigation to `/messages/[conversationId]`.
- Chat screen: implement `useConversation`, `useSendMessage`, subscription handling, optimistic pending rows, and message decryption.
- Entry points: add `openOrCreateDm` from profile view and trip chat CTA (`ensureTripConversation` + `openTripChat`).

## Phase 7 – Offline & Subscription Validation
- Verify offline pending messages, retry behavior, and subscription-driven updates syncing to SQLite.
- Confirm server stores only ciphertext; plaintext exists only client-side post-decrypt.
- Add manual QA/test checklist for DM + trip chat flows.

## Phase 8 – Cleanup & Legacy Removal
- Remove deprecated message APIs, tables, and UI flows once new model is stable.
- Update notification/inbox linking to new conversation IDs.
- Document migration path, rollout considerations, and remaining feature flags.

