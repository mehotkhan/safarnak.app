# Worker Refactor Checklist

## Phase 1 – Directory Bootstrap
- [x] Create `worker/server`, `worker/domains`, `worker/storage`, and `worker/jobs`.
- [x] Create query subfolders: `home`, `explore`, `create`, `notifications`, `me`.
- [x] Create mutation subfolders: `auth`, `trips`, `posts`, `tours`, `places`, `locations`, `social`, `avatars`.

## Phase 2 – Index Split
- [x] Trim `worker/index.ts` to only wire `fetchHandler`, `queueHandler`, `scheduledHandler`.
- [x] Move Yoga setup into `worker/server/graphqlServer.ts`.
- [x] Move HTTP routing into `worker/server/router.ts`.
- [x] Move handler exports into `worker/server/handlers.ts`.

## Phase 3 – Query Reorg
- [x] Relocate query resolver files into their new `worker/queries/*` folders.
- [x] Update `worker/queries/index.ts` to merge exports from each folder without renaming schema fields.

## Phase 4 – Mutation Reorg
- [x] Relocate mutation resolver files into their new `worker/mutations/*` folders.
- [x] Update `worker/mutations/index.ts` to merge exports from each folder without renaming schema fields.

## Phase 5 – Storage Helpers
- [x] Extract shared D1 helpers into `worker/storage/d1.ts`.
- [x] Extract KV helpers into `worker/storage/kv.ts`.
- [x] Extract Vectorize helpers into `worker/storage/vector.ts`.

## Phase 6 – Domain Services
- [x] For each domain (`home`, `explore`, `notifications`, `me`, `social`, `create`), add `services.ts` (and `mappers.ts` when helpful).
- [x] Refactor resolvers to delegate to domain services, keeping them thin.
- [x] Ensure services stay framework-agnostic (pure TypeScript, Env + DTOs in/out).

