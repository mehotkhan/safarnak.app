## Safarnak Messaging – Multi-Phase Implementation Plan

### Phase 0 – Pre-flight Discovery
- Inventory current messaging artifacts (`messages`, `chat`, `conversation`, `inbox`, `MessageBubble`, `messages/[id].tsx`).
- Audit existing GraphQL messaging operations (queries, mutations, subscriptions).
- Map active UI entry points (Inbox tab, trip detail, profile) to understand rewiring scope.

### Phase 1 – Server Data Layer (D1 + Drizzle)
- Extend `database/schema.ts` with `conversations`, `conversationMembers`, `chatMessages`, `messageReceipts`, `chatInvites`; export via `serverSchema` and `database/server.ts`.
- Add SQL migration (e.g., `migrations/013_messaging_conversations.sql`) mirroring the Drizzle definitions plus indexes (unique constraint on `conversation_id + user_id`).
- Run/verify `yarn db:migrate` once migration is ready.

### Phase 2 – GraphQL Schema & Types
- Update `graphql/schema.graphql` with `Conversation`, `ChatMessage`, queries (`myConversations`, `conversationMessagesPage`), mutations (`createConversation`, `sendMessage`, `createChatInvite`, `ackChatInvite`), and subscription (`conversationMessages`).
- Regenerate GraphQL types (`yarn codegen`) and resolve schema/type issues.

### Phase 3 – Worker Resolvers & Pub/Sub
- Implement messaging resolver module (e.g., `worker/resolvers/messaging.ts`) including helper `ensureUserInConversation`.
- Cover flows: `createConversation`, `sendMessage`, `myConversations`, `conversationMessagesPage`, chat invite mutations, and `conversationMessages` subscription.
- Register resolvers with Yoga server and enforce auth/status guards.

### Phase 4 – Client Data Layer (SQLite + Sync)
- Add cached tables in `database/client.ts`: `cachedConversations`, `cachedConversationMembers`, `cachedChatMessages`, `localConversationKeys`; ensure client schema exports and migrations.
- Extend cache storage/Drizzle sync mappings for Conversation & ChatMessage entities and pending mutation handling for `sendMessage`.

### Phase 5 – Crypto Utilities
- Create `crypto/conversationKeys.ts` implementing `getOrCreateConversationKey`, `encryptMessage`, `decryptMessage`, and invite payload helpers leveraging existing device keys.
- Persist symmetric keys via `localConversationKeys` table.

### Phase 6 – Client Hooks & UI Integration
- Inbox: add `useMyConversations` in `app/(app)/(inbox)/index.tsx` to hydrate list from Apollo + SQLite and navigate to `/messages/[conversationId]`.
- Chat screen: add hooks (`useConversation`, `useSendMessage`) to load details, subscribe, decrypt, and enqueue pending sends.
- Entry points: profile “Message” button via `openOrCreateDm`; trip detail “Group chat” via `openTripChat`/`ensureTripConversation`.

### Phase 7 – Offline & Subscription Validation
- Validate offline pending message flow, resend logic, and live subscription updates syncing to SQLite.
- Confirm ciphertext-only storage on server and add manual/automated test checklist for DM + trip chat.

### Phase 8 – Cleanup & Legacy Removal
- Remove deprecated message tables/resolvers/UI after new flow is stable.
- Update notifications/inbox references to new conversation IDs and document rollout considerations.

