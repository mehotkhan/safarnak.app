# Worker Refactor Checklist

This checklist tracks the Worker refactor needed before and during the Cloudflare Agents AI redesign. It reflects the current repository state as of 2026-05-14: the target `worker/server`, `worker/domains`, `worker/storage`, `worker/jobs`, and `worker/agents` architecture is not implemented yet.

Final-state rule: GraphQL resolvers must not directly launch AI workflows. `TRIP_CREATION_WORKFLOW.create()` and `TRIP_UPDATE_WORKFLOW.create()` belong behind agent-owned workflow tools only.

## Phase 1: Server Split

- [ ] Create `worker/server/handlers.ts`.
- [ ] Create `worker/server/router.ts`.
- [ ] Create `worker/server/graphqlServer.ts`.
- [ ] Create `worker/server/context.ts`.
- [ ] Create `worker/server/assets.ts`.
- [ ] Move GraphQL Yoga setup from `worker/index.ts` to `worker/server/graphqlServer.ts`.
- [ ] Move JSON scalar and union resolvers from `worker/index.ts` to GraphQL server/resolver modules.
- [ ] Move auth context creation from `worker/index.ts` to `worker/server/context.ts`.
- [ ] Move landing page, favicon/logo, and R2 avatar routes to `worker/server/assets.ts`.
- [ ] Move request routing to `worker/server/router.ts`.
- [ ] Keep `worker/index.ts` as the configured Worker entrypoint, but reduce it to exports/wiring.

## Phase 2: Jobs

- [ ] Create `worker/jobs/embeddingQueue.ts`.
- [ ] Move `EMBED_QUEUE` handling out of `worker/index.ts`.
- [ ] Create `worker/jobs/scheduled.ts`.
- [ ] Move scheduled `TrendingRollup` compaction out of `worker/index.ts`.
- [ ] Keep retry behavior for failed embedding jobs.

## Phase 3: Storage Adapters

- [ ] Create `worker/storage/d1.ts` for subscription cleanup helpers.
- [ ] Create `worker/storage/kv.ts` for token/session helpers.
- [ ] Create `worker/storage/vector.ts` for Vectorize upsert/query helpers.
- [ ] Create `worker/storage/r2.ts` for media get/put helpers.
- [ ] Update GraphQL context auth to use `storage/kv.ts`.
- [ ] Update embedding queue to use `storage/vector.ts`.
- [ ] Update avatar route and avatar generation to use `storage/r2.ts`.

## Phase 4: Trip Domain Services

- [ ] Create `worker/domains/trips/createTripService.ts`.
- [ ] Create `worker/domains/trips/updateTripService.ts`.
- [ ] Create `worker/domains/trips/tripSideEffects.ts`.
- [ ] Create `worker/domains/trips/tripMappers.ts`.
- [ ] Move pending trip insert and placeholder itinerary creation out of `mutations/createTrip.ts`.
- [ ] Move agent submission DTO building into a shared service.
- [ ] Deduplicate search-index upsert currently repeated in `createTrip.ts`.
- [ ] Move feed event, trending increment, and embedding enqueue into side-effect helpers.
- [ ] Keep GraphQL `createTrip` return shape unchanged.
- [ ] Keep GraphQL `updateTrip` return shape unchanged.

## Phase 5: AI Domain Services

- [ ] Create `worker/domains/ai/auditService.ts`.
- [ ] Create `worker/domains/ai/quotaService.ts`.
- [ ] Create `worker/domains/ai/redactionService.ts`.
- [ ] Add compact AI audit metadata for agent/workflow runs.
- [ ] Add shared model task names aligned with `worker/utilities/ai/models.ts`.

## Phase 6: Agent Platform Skeleton

- [ ] Add Cloudflare Agents/Think dependencies.
- [ ] Add `worker/agents/base/BaseSafarnakAgent.ts`.
- [ ] Add `worker/agents/base/modelRouter.ts`.
- [ ] Add `worker/agents/base/memoryPolicy.ts`.
- [ ] Add `worker/agents/base/toolPolicy.ts`.
- [ ] Add `worker/agents/contracts/tripPlanning.ts`.
- [ ] Add `worker/agents/tools/policyTools.ts`.
- [ ] Add `worker/agents/tools/workflowTools.ts`.
- [ ] Add top-level `UserOrchestratorAgent`.
- [ ] Add `TripPlanningAgent` as an exported sub-agent class.
- [ ] Add placeholders/contracts for `TripEditingAgent`, `ProfileAgent`, `DiscoveryAgent`, `MediaAgent`, and `SafetyReviewAgent` as sub-agent classes when needed.
- [ ] Export parent and sub-agent classes from `worker/index.ts`.
- [ ] Add Durable Object binding and a new Wrangler migration tag for `UserOrchestratorAgent`.
- [ ] Add `routeAgentRequest()` to the Worker router.
- [ ] Confirm GraphQL and Agent routes can coexist under `wrangler dev`.

## Phase 7: Create-Trip Agent Cutover

- [ ] Add `AI_AGENT_PLATFORM_ENABLED`.
- [ ] Add `AI_AGENT_TRIP_CREATE_ENABLED`.
- [ ] Call `TripPlanningAgent.submitCreateTrip` from the trip creation service.
- [ ] Extract a structured `TripDraft`.
- [ ] Create an `AiTask`.
- [ ] Create/receive pending trip through agent tools.
- [ ] Launch `TripCreationWorkflow` through `worker/agents/tools/workflowTools.ts`.
- [ ] Remove `TRIP_CREATION_WORKFLOW.create()` from `worker/mutations/createTrip.ts`.
- [ ] Return safe failed-task/error state if agent dispatch fails.

## Phase 8: Agent-Owned Create Trip

- [ ] Let `TripPlanningAgent` create/receive the pending trip through a tool.
- [ ] Let `TripPlanningAgent` launch `TripCreationWorkflow`.
- [ ] Add `agentSessionId` to workflow params.
- [ ] Add `aiTaskId` to workflow params.
- [ ] Update `TripCreationWorkflow` to consume `TripDraft`.
- [ ] Mirror workflow progress into agent state when `agentSessionId` exists.
- [ ] Move public feed/search/trending side effects to final active-trip save.
- [ ] Add code-search verification that no resolver launches `TRIP_CREATION_WORKFLOW`.

## Phase 9: Expand Agent Domains

- [ ] Add `TripEditingAgent`.
- [ ] Move AI trip edits behind agent classification: patch vs regenerate.
- [ ] Remove `TRIP_UPDATE_WORKFLOW.create()` from `worker/mutations/updateTrip.ts`.
- [ ] Launch `TripUpdateWorkflow` through `worker/agents/tools/workflowTools.ts`.
- [ ] Add `ProfileAgent`.
- [ ] Add profile preference update approval flow.
- [ ] Add `DiscoveryAgent`.
- [ ] Ensure discovery agent returns real entities only.
- [ ] Add `MediaAgent`.
- [ ] Move avatar/media generation behind media tools/workflows.
- [ ] Add `SafetyReviewAgent` or shared safety tools for public/high-risk AI outputs.

## Phase 10: Verification

- [ ] `yarn lint`
- [ ] `./node_modules/.bin/tsc --noEmit`
- [ ] `yarn worker:dev`
- [ ] Existing GraphQL create-trip API shape works through `TripPlanningAgent`.
- [ ] Existing GraphQL update-trip API shape works through `TripEditingAgent` after edit cutover.
- [ ] Create-trip agent cutover creates an `AiTask`.
- [ ] Agent routes authenticate correctly.
- [ ] `rg -n "TRIP_CREATION_WORKFLOW\\.create|TRIP_UPDATE_WORKFLOW\\.create" worker/mutations worker/queries` returns no resolver-owned launch after cutover.
- [ ] Subscription progress still reaches the trip detail screen.
- [ ] Embedding queue still upserts BGE-M3 1024-dim vectors.
- [ ] Scheduled trending compaction still runs.
