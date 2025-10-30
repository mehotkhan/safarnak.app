## Safarnak App – Technical Review and Future Checklist (v0.9.4)

### Overall Score
- 7.5/10

### Highlights (Strengths)
- Architecture
  - Clear separation of client (`app/`, `components/`), shared GraphQL (`graphql/`), server (`worker/`), and DB (`database/`).
  - Simple, correct GraphQL codegen pipeline (`graphql/schema.graphql` + `graphql/queries` → `api/types.ts`, `api/hooks.ts`).
  - Worker uses GraphQL Yoga + Durable Objects for subscriptions; schema loaded from shared source.
- Developer Experience
  - `app.config.js` centralizes GraphQL endpoint via `expo.extra.graphqlUrl` with sensible dev/prod fallbacks.
  - Apollo client normalizes dev URIs across emulators/devices and injects auth header.
  - One-command dev (`yarn dev`) runs worker and Expo; migrations/codegen are straightforward.
- Data Modeling
  - Drizzle schemas are thorough; JSON-in-text with resolver-side parsing is pragmatic for D1.
  - Trip resolvers enforce ownership and parse JSON fields consistently.
- Security Primitives
  - PBKDF2 100k iterations, 16-byte salt, constant-time compare for passwords.

### Key Risks and Gaps
- Authentication Trust Boundary (critical)
  - Context trusts `x-user-id` header; token is not verified server-side. Anyone can impersonate by setting headers.
  - Token format is SHA-256 of `userId-username-timestamp` without a server secret, no expiry/verification.
- Error Exposure
  - `maskedErrors: false` exposes internal messages in production.
- Input Validation
  - Limited validation beyond `createTrip`; fields like budget/dates/status need stricter constraints.
- Testing
  - No unit/integration tests for auth/resolvers/client hooks → higher regression risk.
- Lint Posture
  - Many rules relaxed (unused vars, prettier off). OK for velocity; tighten as team grows.

### Priority Action Checklist (Security & Auth)
- [ ] Replace token scheme with signed verification (choose one):
  - [ ] HMAC-signed opaque token using `env.AUTH_SECRET`
  - [ ] JWT (HS256) with short TTL and optional refresh
- [ ] Parse and verify `Authorization: Bearer <token>` in Yoga `context`
- [ ] Derive `context.userId` strictly from verified token; ignore/remove `x-user-id`
- [ ] Add token expiry, rotation, and optional revocation list (KV/D1)
- [ ] Set `maskedErrors: true` for production; keep internal logging for diagnostics

### Resolver and Schema Quality Checklist
- [ ] Add zod-based input validation for all mutations/queries (normalize, bounds, formats)
- [ ] Harmonize GraphQL types with DB shapes; document JSON fields (`itinerary`, `coordinates`)
- [ ] Ensure ownership checks exist for all user-scoped reads/writes
- [ ] Add indices where needed (e.g., `trips.user_id`, `users.username` already unique)

### Observability & Ops
- [ ] Keep Yoga plugin for error logging; route logs to Cloudflare logs with structured fields
- [ ] Add request IDs and user IDs in logs post-auth verification
- [ ] Consider rate limiting for `login` attempts; add small artificial delay on failures

### Client/API Improvements
- [ ] Revisit Apollo fetch policies: use cache-first or cache-and-network for read-most queries (`getTrips`, `getTrip`)
- [ ] Remove `x-user-id` header from client once server-side verification is enforced
- [ ] Add offline queuing policies per mutation (already have offline middleware; document usage)

### Testing Roadmap
- [ ] Unit tests: password hashing/verification, token signing/verification
- [ ] Integration tests: `register`, `login`, `createTrip` (happy paths + edge cases)
- [ ] Contract tests: ensure GraphQL schema and generated hooks stay in sync

### Linting and Code Quality
- [ ] Re-enable Prettier via ESLint (`prettier/prettier`) when formatting stabilizes
- [ ] Gradually enforce `@typescript-eslint/no-unused-vars` and basic hygiene rules

### Performance Considerations
- [ ] Add D1 indices for frequent filters/sorts (e.g., trips by `user_id`, `created_at` desc)
- [ ] Memoize expensive UI components and consider virtualization on large lists
- [ ] Review JSON column sizes and consider splitting if they grow (D1 limits)

### Next Steps (Suggested Order)
1) Implement server-side token verification (HMAC/JWT) and remove `x-user-id` trust
2) Enable masked errors in prod, keep internal structured logging
3) Add zod validation to all resolver inputs
4) Introduce minimal test suite (auth + trips)
5) Tune Apollo cache policies for better UX
6) Tighten ESLint rules incrementally

---

Notes
- After changing GraphQL schema or operations, always run `yarn codegen` and never edit `api/types.ts` or `api/hooks.ts` manually.
- Before local API testing, run `yarn db:migrate` to keep D1 in sync.


