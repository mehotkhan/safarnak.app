# README and Cursor Rules – Multi‑Phase Review Plan

## Phase 1 – Baseline Audits and Critical Fixes
- Sync versions with `package.json` (badges, inline mentions, `.cursorrules` “Current Stack”).
- Replace all “Enhanced Hook(s)” with “Generated Hook(s)”; remove any `enhanced-hooks.ts` references.
- Replace `apollo_cache.db` with “safarnak_local.db: apollo_cache_entries” (clarify it’s a table).
- Update architecture and sequence diagrams labels to reflect `DrizzleCacheStorage.setItem()` and “Generated Hook(s)” participants.
- Ensure `api/` structure reflects actual files: `client.ts`, `cache-storage.ts`, `hooks.ts`, `types.ts`, `utils.ts`, `index.ts`, `globals.d.ts` (no `api-types.ts`).
- Ensure examples use path aliases (`@api`, `@database/*`, `@graphql/*`, etc.).
- Remove mentions of manual sync or `syncApolloToDrizzle()`; describe automatic dual‑write.
- Quick smoke for obviously broken anchors and links in README.
- Commit with a clear docs scope.

## Phase 2 – Section Deep Refresh (Content Accuracy)
- Rewrite Quick Start to be concise and accurate; verify each command exists in `package.json`.
- Refresh Configuration: GraphQL URL resolution order, env names, dev fallback, Android identity envs.
- Update Common Commands from `package.json`; remove obsolete entries.
- Refresh Tech Stack table (versions: RN, Expo, React, Router, NativeWind, Tailwind, Apollo, Yoga, Drizzle, ESLint, Prettier).
- Update Codebase Structure trees (client, shared, worker) to match repo.
- Ensure “Never edit generated files” is present for `api/hooks.ts`, `api/types.ts`.

## Phase 3 – Architecture and Storage Diagrams
- Validate all mermaid diagrams render and reflect current components and flows.
- Ensure Storage layer shows raw cache table `apollo_cache_entries` and structured tables.
- Ensure Client Architecture points to `api/cache-storage.ts` and not wrappers.

## Phase 4 – Offline‑First Narrative and Examples
- Explain DrizzleCacheStorage behavior: event‑driven, dual‑write, no wrapper hooks required.
- Provide updated examples: generated hooks usage, and optional direct Drizzle queries.
- Clarify AsyncStorage queue behavior and reconnect flow.

## Phase 5 – Cursor Rules Alignment
- Update “Current Stack” and all technology versions.
- Replace `enhanced-hooks.ts`/manual sync references with `cache-storage.ts` auto‑sync.
- Confirm Critical Rules and Path Aliases match `tsconfig.json`/Metro config.
- Ensure GraphQL endpoint configuration and env order match README.
- Ensure Database patterns: unified schema, separate adapters, client auto‑migration note.

## Phase 6 – QA Validation
- Grep for: `Enhanced Hook`, `enhanced-hooks.ts`, `apollo_cache.db`, `syncApolloToDrizzle`, `v0.17`, `api-types.ts`.
- Check for relative import examples in README and replace with path aliases.
- Validate internal anchors (headings match TOC), and quick link sanity.
- Final lints/format, and commit.

---

Status: Phase 1 in progress.


