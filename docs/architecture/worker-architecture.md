# Worker Architecture Refactor Plan

Last reviewed: 2026-05-14

This document defines the target Cloudflare Worker architecture for Safarnak after the AI platform redesign described in [AI Agents and Think Migration Plan](ai-agents-think-migration-plan.md).

The goal is not only to make `worker/index.ts` smaller. The goal is to turn the Worker into a layered backend where GraphQL is the stable product API, Agents own AI orchestration and memory, Workflows are agent-owned durable execution jobs, and domain services own business logic.

## Hard Direction

Safarnak should remove the legacy direct-workflow AI system.

Final-state rule:

```text
GraphQL resolvers do not call env.TRIP_CREATION_WORKFLOW.create().
GraphQL resolvers do not call env.TRIP_UPDATE_WORKFLOW.create().
Generic domain services do not launch AI workflows as fallback behavior.
Only agent-owned workflow tools may launch AI workflows.
```

Workflows remain in `worker/workflows`, but they are no longer the AI orchestration boundary. They are durable job runners launched by Agents.

## Current State

The current Worker is still mostly single-entrypoint oriented:

- `worker/index.ts` builds GraphQL schema/resolvers.
- `worker/index.ts` configures Yoga, auth context, GraphQL logging, subscription cleanup, and subscription retry behavior.
- `worker/index.ts` serves static routes, landing page, favicon/logo assets, and R2 avatars.
- `worker/index.ts` handles `EMBED_QUEUE` and scheduled trending compaction.
- `worker/index.ts` exports Durable Objects and Workflows.
- GraphQL resolvers live in flat `worker/queries/*` and `worker/mutations/*` files.
- AI logic lives mostly in `worker/utilities/ai/*`, destination/semantic utilities, and Workflows.
- `worker/server`, `worker/domains`, and `worker/storage` are not yet implemented as real architecture boundaries.

This shape works, but it will not scale cleanly to an agent-native AI platform. Adding Cloudflare Agents directly into the current entrypoint would make the Worker harder to reason about.

## Target Architecture

```text
worker/
  index.ts
  server/
    handlers.ts
    router.ts
    graphqlServer.ts
    context.ts
    assets.ts
    auth.ts
  agents/
    UserOrchestratorAgent.ts    # top-level bound parent agent
    subagents/
      TripPlanningAgent.ts
      TripEditingAgent.ts
      ProfileAgent.ts
      DiscoveryAgent.ts
      MediaAgent.ts
      SafetyReviewAgent.ts
    base/
      BaseSafarnakAgent.ts
      agentContext.ts
      modelRouter.ts
      memoryPolicy.ts
      toolPolicy.ts
    contracts/
      tripPlanning.ts
      tripEditing.ts
      profile.ts
      discovery.ts
      media.ts
    tools/
      authTools.ts
      tripTools.ts
      destinationTools.ts
      searchTools.ts
      profileTools.ts
      mediaTools.ts
      workflowTools.ts       # only allowed place to create AI workflows
      policyTools.ts
  domains/
    trips/
      createTripService.ts
      updateTripService.ts
      tripMappers.ts
      tripSideEffects.ts
    ai/
      auditService.ts
      quotaService.ts
      redactionService.ts
    explore/
    feed/
    profile/
    media/
    social/
    auth/
  storage/
    d1.ts
    kv.ts
    r2.ts
    vector.ts
  jobs/
    embeddingQueue.ts
    scheduled.ts
  workflows/
    tripCreationWorkflow.ts
    tripUpdateWorkflow.ts
  queries/
  mutations/
  subscriptions/
  utilities/
```

## Layer Responsibilities

### `worker/index.ts`

Final responsibility:

- Export Worker `fetch`, `queue`, and `scheduled` handlers.
- Export Durable Objects, Agents, and Workflows required by Wrangler.
- Avoid owning GraphQL setup, routing, auth, assets, queue internals, or AI logic.

Target shape:

```ts
import { fetchHandler, queueHandler, scheduledHandler } from './server/handlers';

export default {
  fetch: fetchHandler,
  queue: queueHandler,
  scheduled: scheduledHandler,
};

export { SubscriptionPool } from './server/graphqlServer';
export { TrendingRollup } from './durable/TrendingRollup';
export { UserOrchestratorAgent } from './agents/UserOrchestratorAgent';
export { TripPlanningAgent } from './agents/subagents/TripPlanningAgent';
export { TripCreationWorkflow } from './workflows/tripCreationWorkflow';
export { TripUpdateWorkflow } from './workflows/tripUpdateWorkflow';
```

### `worker/server`

Owns request lifecycle and platform plumbing.

- `handlers.ts`: top-level `fetchHandler`, `queueHandler`, `scheduledHandler`.
- `router.ts`: routes requests in this order:
  1. Cloudflare Agent routes via `routeAgentRequest()`.
  2. Static assets and landing page.
  3. R2 media routes.
  4. GraphQL/subscriptions.
- `graphqlServer.ts`: schema, Yoga setup, resolvers, subscription wrapper.
- `context.ts`: GraphQL context creation and auth token resolution.
- `auth.ts`: request auth parsing shared by GraphQL and Agents.
- `assets.ts`: landing page, favicon/logo, R2 avatar responses.

Agent routes should be checked before GraphQL fallback so direct agent clients can connect to `/agents/...`. GraphQL remains available for product screens, but AI mutations delegate to Agent methods through Durable Object RPC.

### `worker/agents`

Owns AI runtime and agent orchestration.

Agents should:

- Hold AI session state and memory.
- Classify intent and select tools.
- Ask clarifying questions.
- Launch Workflows for durable work.
- Mirror Workflow progress into agent state.
- Use tools for all reads/writes.

Agents should not:

- Import React Native/client code.
- Perform raw SQL directly.
- Mutate product tables without tools.
- Store secrets or sensitive raw prompts in memory.
- Replace GraphQL product queries.

Top-level vs sub-agent rule:

- `UserOrchestratorAgent` is the first top-level bound Durable Object.
- Domain agents start as sub-agents exported from the Worker entrypoint.
- Add separate top-level bindings only for independently routable or shared multi-user state.
- Sub-agent classes still need to be exported, but they do not need Wrangler bindings unless promoted to top-level agents.

### `worker/agents/base`

Shared infrastructure for all agents:

- model routing,
- tool policy,
- auth/session helpers,
- memory read/write policy,
- audit event emission,
- structured logging,
- approval state helpers.

This prevents each agent from inventing its own security and memory behavior.

### `worker/agents/tools`

Typed server-side tools around product capabilities.

Tool categories:

- Auth/quota: check active user, subscription, AI quota.
- Trips: create pending trip, load trip, apply patch, persist feedback.
- Destination/search: research destination, semantic attraction search, place lookup.
- Profile: read/update preferences and profile fields.
- Media: generate/upload avatar and trip images.
- Workflow: launch/query/cancel Workflows. Workflow launch tools are agent-owned and are the only allowed launch boundary.
- Policy: redact sensitive input, classify safety, record audit event, require approval.

Every write tool needs auth, schema validation, idempotency, audit metadata, and a narrow return object.

Workflow launch tool requirements:

- Require `agentSessionId`.
- Require `aiTaskId`.
- Require `userId`.
- Require an idempotency key.
- Write audit metadata before and after launch.
- Return a task-oriented response, not a raw internal-only Workflow object.

### `worker/domains`

Owns business logic independent of GraphQL and Agents.

Examples:

- `domains/trips/createTripService.ts`
  - pending trip insert,
  - placeholder itinerary,
  - agent submission DTO building,
  - final side effects after activation.
- `domains/trips/tripSideEffects.ts`
  - feed event,
  - search index upsert,
  - trending increment,
  - embedding enqueue.
- `domains/ai/auditService.ts`
  - common AI audit event persistence.
- `domains/ai/quotaService.ts`
  - subscription/AI usage gates.

GraphQL resolvers, Agents, and Workflows should call these services instead of duplicating logic. Domain services can prepare workflow payloads but cannot launch AI workflows unless they are specifically inside `agents/tools/workflowTools.ts`.

### `worker/storage`

Owns storage adapters only:

- D1 helpers for subscription cleanup and repeated SQL patterns.
- KV helpers for session tokens, destination cache, and agent-side compact memory if needed.
- R2 helpers for media get/put responses.
- Vectorize helpers for embedding upsert/query.

No product policy should live here.

### `worker/jobs`

Owns non-Workflow background handlers:

- `embeddingQueue.ts`: current `EMBED_QUEUE` logic.
- `scheduled.ts`: current trending compaction.

Workflows remain under `worker/workflows`.

Workflow modules should expose durable execution classes only. They should not import GraphQL resolvers or decide user-facing AI policy.

## GraphQL After Refactor

GraphQL resolvers should become adapters.

Target pattern:

```ts
export const createTrip = async (_: unknown, args: Args, context: GraphQLContext) => {
  return submitCreateTripRequest(args.input, context);
};
```

`submitCreateTripRequest` can decide whether to:

- call `TripPlanningAgent.submitCreateTrip`,
- return an existing `AiTask`/trip state for idempotent retries,
- or call non-AI pure domain services for non-agent behavior.

It must not create `TRIP_CREATION_WORKFLOW` directly.

The schema and generated client hooks should stay stable unless the product experience actually changes.

## Agent Integration Points

### Direct Agent Routes

Use direct `/agents/{agent-name}/{instance-name}` routes only for interactive AI experiences:

- planning chat,
- edit-trip chat,
- live discovery chat,
- profile assistant.

### GraphQL-to-Agent Bridge

Use GraphQL for existing product flows:

- `createTrip`,
- `updateTrip`,
- `generateAvatar`,
- future profile update mutations.

Resolver calls should delegate to a domain service that calls an Agent method through Durable Object RPC. For AI paths, there is no production fallback that bypasses the Agent and launches a Workflow directly.

### Workflow-to-Agent Progress

Workflows should continue to publish GraphQL subscription events, but should also update agent state when an `agentSessionId` is present.

This gives:

- reconnect recovery,
- live agent status,
- future "continue planning" behavior,
- better error explanations.

## Refactor Phases

### Phase 1: Server Split

Move platform plumbing out of `worker/index.ts`.

Tasks:

- Create `worker/server/handlers.ts`.
- Create `worker/server/router.ts`.
- Create `worker/server/graphqlServer.ts`.
- Create `worker/server/context.ts`.
- Create `worker/server/assets.ts`.
- Move Yoga setup unchanged.
- Move auth context unchanged.
- Move static asset/R2 routes unchanged.
- Move subscription cleanup/retry unchanged.
- Move queue/scheduled internals into `worker/jobs`.

No behavior changes in this phase.

### Phase 2: Storage Adapters

Extract repeated storage primitives.

Tasks:

- `storage/kv.ts` for token read/write/delete.
- `storage/vector.ts` for Vectorize upsert/query.
- `storage/r2.ts` for media get/put helpers.
- `storage/d1.ts` for subscription cleanup.
- Update GraphQL context and queue handlers to use adapters.

### Phase 3: Trip Domain Services

Extract create/edit trip business logic before adding Agents, but do not preserve direct workflow launch as the final boundary.

Tasks:

- Move pending trip creation from `mutations/createTrip.ts` to `domains/trips/createTripService.ts`.
- Move duplicated search-index upsert into `domains/trips/tripSideEffects.ts`.
- Move feed/trending/embedding side effects into shared services.
- Add `buildTripCreationAgentInput`.
- Keep `createTrip` GraphQL response unchanged.

This is the critical preparation for agent integration.

### Phase 4: Agent Platform Skeleton

Add Cloudflare Agents without product behavior changes.

Tasks:

- Add packages from the AI architecture doc.
- Add `UserOrchestratorAgent` binding/migration.
- Export `TripPlanningAgent` and other domain agents as sub-agent classes.
- Export agent classes from `worker/index.ts`.
- Add `routeAgentRequest()` to `server/router.ts`.
- Add base agent utilities and tool policy helpers.
- Add no-op or read-only tools first.

### Phase 5: Create-Trip Agent Cutover

Connect the new Worker architecture to the AI platform and remove resolver-owned workflow creation behind a feature flag.

Tasks:

- GraphQL `createTrip` calls trip domain service.
- Trip domain service invokes `TripPlanningAgent.submitCreateTrip`.
- Agent extracts `TripDraft`, validates, creates an `AiTask`, and records audit metadata.
- Agent creates/receives the pending trip through tools.
- Agent launches `TripCreationWorkflow` through `workflowTools.ts`.
- The resolver no longer references `TRIP_CREATION_WORKFLOW.create()`.

### Phase 6: Agent-Owned Create Trip

Harden `TripPlanningAgent` as the only create-trip AI orchestrator.

Tasks:

- Agent creates/receives pending trip through `createPendingTripTool`.
- Agent launches `TripCreationWorkflow`.
- Workflow consumes `TripDraft` and `agentSessionId`.
- Workflow progress updates GraphQL subscriptions and agent state.
- Move public feed/search/trending side effects to final active-trip save.
- Add code-search guard in review: no resolver may call `TRIP_CREATION_WORKFLOW.create`.

### Phase 7: Edit/Profile/Discovery/Media Domains

Repeat the pattern for other AI systems.

Order:

1. Trip editing.
2. Profile preferences.
3. Discovery/search assistant.
4. Avatar/media generation.
5. Safety review agent for public/high-risk actions.

## Migration Rules

- Do not change Worker entrypoint config casually; keep `worker/index.ts` as the configured entry.
- Do not move GraphQL schema fields during infrastructure refactors.
- Do not manually edit generated `api/hooks.ts` or `api/types.ts`.
- Keep old GraphQL API shape working while replacing internals with Agents behind flags.
- Add Durable Object migrations only with new tags.
- Never rename an already-migrated Durable Object class without a migration plan.
- Keep Workflows for durable multi-step operations, but only Agents may launch AI workflows.
- Keep server/client boundaries strict: Worker cannot import client `api/`, React Native, Expo, or UI modules.
- Treat `context.env.TRIP_CREATION_WORKFLOW.create` and `context.env.TRIP_UPDATE_WORKFLOW.create` in resolver files as architecture violations after cutover.

## Recommended First Slice

The first implementation slice should be:

1. Split `worker/index.ts` into `worker/server/*` and `worker/jobs/*` with no behavior change.
2. Extract `storage/kv.ts`, `storage/vector.ts`, and `storage/r2.ts`.
3. Extract trip creation domain services.
4. Add agent platform skeleton and route support.
5. Route create-trip through `TripPlanningAgent` behind `AI_AGENT_TRIP_CREATE_ENABLED`.
6. Move workflow launch into `agents/tools/workflowTools.ts`.
7. Remove resolver-owned workflow creation.

This sequence reduces risk because the Worker becomes modular before Agents are introduced, and the first agent integration is observable without changing production behavior.
