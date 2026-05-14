# Safarnak AI Agents and Think Migration Plan

Last reviewed: 2026-05-14

## Purpose

This document proposes a full redesign of Safarnak's AI platform around Cloudflare Agents, not only a migration of the existing create-trip workflow. The target is an agent-native backend where GraphQL remains the product API, Agents become the AI orchestration/runtime layer, and Workflows remain a lower-level durable execution primitive.

Create-trip is still the first implementation slice because it is the highest-value AI path and already has a durable workflow, but the architecture below is intentionally broader: every future AI capability should be modeled as a domain agent, tool set, memory contract, policy boundary, and optional agent-owned workflow.

## Hard Direction

Safarnak should completely replace the legacy direct-workflow AI system.

Final-state rule:

```text
GraphQL resolver must not directly create TRIP_CREATION_WORKFLOW or TRIP_UPDATE_WORKFLOW.
Domain service must not directly create AI workflows as a fallback.
Only an Agent-owned tool or Agent method may launch AI workflows.
```

Workflows are not removed from the platform. They are demoted from "AI orchestrator" to "durable job runner." Agents own the AI task lifecycle: intent, memory, tools, approval, workflow launch, progress, recovery, and user-facing explanation.

## Sources

- Cloudflare Think API: <https://developers.cloudflare.com/agents/api-reference/think/>
- Cloudflare Agents overview: <https://developers.cloudflare.com/agents/concepts/what-are-agents/>
- Cloudflare Agents tools: <https://developers.cloudflare.com/agents/concepts/tools/>
- Cloudflare Agents memory: <https://developers.cloudflare.com/agents/concepts/memory/>
- Cloudflare Agents state sync: <https://developers.cloudflare.com/agents/api-reference/store-and-sync-state/>
- Cloudflare Agents callable methods: <https://developers.cloudflare.com/agents/api-reference/callable-methods/>
- Cloudflare Agents WebSockets: <https://developers.cloudflare.com/agents/api-reference/websockets/>
- Cloudflare Agents HTTP and SSE: <https://developers.cloudflare.com/agents/api-reference/http-sse/>
- Cloudflare Agents patterns: <https://developers.cloudflare.com/agents/patterns/>
- Cloudflare Agents routing: <https://developers.cloudflare.com/agents/api-reference/routing/>
- Cloudflare Agents + Workflows concept guide: <https://developers.cloudflare.com/agents/concepts/workflows/>
- Cloudflare Run Workflows from Agents API: <https://developers.cloudflare.com/agents/api-reference/run-workflows/>
- Cloudflare Agents sub-agents: <https://developers.cloudflare.com/agents/api-reference/sub-agents/>
- Cloudflare Agents observability: <https://developers.cloudflare.com/agents/api-reference/observability/>
- Current create-trip resolver: `worker/mutations/createTrip.ts`
- Current create-trip workflow: `worker/workflows/tripCreationWorkflow.ts`
- Current trip update workflow: `worker/workflows/tripUpdateWorkflow.ts`
- Current AI utilities: `worker/utilities/ai/*`
- Current destination and semantic retrieval: `worker/utilities/destination/*`, `worker/utilities/semantic/*`

## Cloudflare Capabilities to Use

Cloudflare Agents are TypeScript classes backed by Durable Objects. Each named instance acts like a stateful micro-server with its own SQL database, state, WebSocket connections, scheduling, callable methods, and hibernation lifecycle. `AIChatAgent` adds persistent chat messages, stream resumption, and tool support. Think is an opinionated chat agent base class for agentic loops, message persistence, streaming, tool execution, client tools, extensions, and Durable Object SQLite-backed memory.

Agents/Think should be used for:

- Persistent per-user or per-trip AI sessions.
- Conversational trip intake and clarification.
- Tool-calling orchestration around Safarnak domain tools.
- Long-running user conversations with context blocks, compaction, and searchable memory.
- Callable RPC methods for GraphQL/backend bridges.
- WebSocket or SSE streams for interactive AI experiences.
- Client state sync for future planning UI.
- Schedules for agent-owned reminders, retries, cleanup, and follow-up.
- Sub-agent patterns where a parent agent delegates narrow tasks.

Important routing detail: Cloudflare's `@callable()` methods are for external WebSocket RPC from clients or services. Worker-to-Agent and Agent-to-Agent calls inside the same Worker should use Durable Object RPC and `getAgentByName()` patterns rather than exposing unnecessary public callables.

Important topology detail: Cloudflare sub-agents can run as child Durable Objects with isolated SQLite storage. Only the parent needs a Durable Object binding and migration; child agent classes are discovered from Worker exports. Safarnak should use this to avoid binding sprawl.

Agent-owned Workflows should remain responsible for:

- Multi-step background work that must survive failure.
- Automatic retries and recovery.
- Long-running create/edit trip operations.
- Durable DB writes, Vectorize updates, embeddings, feed/trending side effects, and notification completion.

Cloudflare frames Agents and Workflows as complementary: Agents handle real-time communication, state, tools, and coordination; Workflows handle durable multi-step processing. Safarnak should use that pairing, but remove every legacy path where GraphQL bypasses Agents and starts Workflows directly.

## Full Redesign Thesis

Safarnak should stop treating AI as a set of utility functions called from GraphQL resolvers or Workflows. The new model should treat AI as a first-class runtime:

```text
GraphQL = stable product API and typed client contract
Agents = mandatory AI control plane, memory, tool routing, live interaction
Workflows = agent-owned durable execution jobs
Tools = explicit capability boundary around Safarnak domain services
Memory = user/trip/task context with privacy rules
Policies = approval, safety, auth, rate limits, observability
```

This is a different architecture from the current "resolver starts workflow, workflow calls prompts" model. The current model is deterministic backend automation with LLM calls inside it. The target model is agentic orchestration with deterministic backend services behind explicit tools. The direct workflow model should be removed after the agent control plane is ready.

## Platform Principles

1. GraphQL is not the agent.
   GraphQL resolvers should authenticate, validate API-level input, call an agent or domain service, and return typed product state. They should not contain prompt logic, model selection, tool orchestration, or AI session state.

2. Agents own AI state.
   A user's planning context, clarification history, draft preferences, previous edits, and current AI task progress should live in agent state/session memory, not scattered across trip metadata and resolver-local strings.

3. Agents own AI lifecycle; Workflows own durable execution.
   Anything that must survive failure, write final DB state, retry external APIs, or complete in the background can run in Workflows, but the decision to launch it must come through an Agent-owned tool or Agent method.

4. Tools are the only way an agent touches the product.
   Agents should never directly construct SQL, mutate arbitrary tables, or call unbounded external APIs. They call typed tools with Zod/JSON schemas, auth checks, idempotency, and permission policy.

5. AI output is never trusted directly.
   Structured outputs must pass schema validation, repair, normalization, and product-specific validators before persistence.

6. Memory is curated, not a transcript dump.
   Persist concise, useful user/trip facts. Do not store sensitive raw inputs indefinitely. Keep precise location and personal data out of long-term memory unless the feature truly requires it.

7. User confirmation is a product boundary.
   Creating trips may be low-risk after form submit. Publishing public content, changing profile data, booking, payment, deleting, sharing, or messaging must require approval.

## Target System Model

### Runtime Layers

```text
React Native / Expo Client
  |
  | GraphQL queries/mutations/subscriptions
  | Agent WebSocket/SSE/HTTP for live AI experiences
  v
Worker API Gateway
  |
  | GraphQL Yoga for product API
  | routeAgentRequest() for Agent HTTP/WebSocket/SSE/RPC
  v
Agent Runtime (mandatory AI control plane)
  |
  | UserOrchestratorAgent
  | TripPlanningAgent
  | TripEditingAgent
  | ProfileAgent
  | DiscoveryAgent
  | MediaAgent
  | SafetyReviewAgent
  v
Tool Layer
  |
  | typed server-side tools around DB, KV, R2, Vectorize, external APIs
  | approval policies
  | model-routing policies
  v
Workflow Layer (agent-owned durable jobs)
  |
  | TripCreationWorkflow
  | TripUpdateWorkflow
  | ProfileUpdateWorkflow
  | MediaGenerationWorkflow
  | IndexingWorkflow
  v
Domain Services and Storage
  |
  | D1, KV, R2, Vectorize, Queues, Workers AI, Durable Objects
```

### GraphQL Role After Redesign

GraphQL remains important. It should be the stable contract used by the mobile app for product state:

- `createTrip` becomes "submit a trip planning request to TripPlanningAgent."
- `updateTrip` becomes "submit a trip edit request to TripEditingAgent."
- Queries read trips, workflow status, agent task status, and user state.
- Subscriptions continue to stream trip/workflow updates.

GraphQL should not be replaced wholesale by Agents because the app already depends on generated Apollo types/hooks, offline cache behavior, and typed product screens. But GraphQL must stop being an AI orchestrator. For AI mutations, GraphQL is only an authenticated adapter to Agent methods/tools.

### Agent Routing Model

Use explicit agent instance naming:

- `user:{userId}` -> `UserOrchestratorAgent`, the long-lived user AI identity.
- `trip-planning:{userId}` -> `TripPlanningAgent` sub-agent, active trip creation conversations and drafts.
- `trip:{tripId}` -> `TripSessionAgent` top-level or sub-agent, trip-specific edit/recovery/status context.
- `profile:{userId}` -> `ProfileAgent` sub-agent, profile and preference changes.
- `discovery:{userId}` -> `DiscoveryAgent` sub-agent, search/discovery personalization.

Per-user and per-trip instances give isolated state, easier cleanup, and clearer privacy boundaries.

Routing policy:

- GraphQL adapters call Agent methods through Durable Object RPC for product-integrated AI tasks.
- Direct Agent routes serve live chat/planning experiences.
- Agent-to-Agent delegation uses sub-agent calls for specialized tasks.
- No public route can call a write tool without auth and policy checks.

Recommended topology:

- Bind `UserOrchestratorAgent` first. It is the stable per-user parent agent.
- Implement `TripPlanningAgent`, `TripEditingAgent`, `ProfileAgent`, `DiscoveryAgent`, `MediaAgent`, and `SafetyReviewAgent` as exported sub-agent classes first.
- Add separate top-level bindings only when a domain needs direct public routing, shared multi-user state, or entity ownership outside a single user.
- Consider `TripSessionAgent` as a top-level binding later if hosted/collaborative trips need shared multi-user agent state.

This keeps Wrangler migrations small while still giving each domain agent isolated state.

## Agent Portfolio

### `UserOrchestratorAgent`

Top-level router for user AI requests.

Responsibilities:

- Classify user intent: create trip, edit trip, search, profile, media, support, unknown.
- Route to the correct domain agent.
- Maintain lightweight user preference memory.
- Enforce account state, subscription limits, and safety policy before delegating.
- Provide a single future chat entrypoint if the app adds an "Ask Safarnak" surface.

This is the agent equivalent of an API gateway for AI tasks.

Callable methods:

- `submitUserRequest(input)` for the future "Ask Safarnak" surface.
- `routeIntent(input)` for GraphQL/backend bridges.
- `getUserAiState()` for client recovery.

It should not launch trip workflows directly. It routes to domain agents.

### `TripPlanningAgent`

Creates new trips from free-form or form-based input.

Responsibilities:

- Convert raw user input into a `TripDraft`.
- Ask clarifying questions when critical fields are missing.
- Call destination research, semantic matching, budget validation, weather preview, and safety tools.
- Prepare a confirmed `TripCreationRequest`.
- Launch `TripCreationWorkflow`.
- Track and explain progress.
- Store useful planning memory for future trips.

Callable methods:

- `submitCreateTrip(input)` receives form or natural-language create-trip input.
- `updateDraft(input)` updates an in-progress draft.
- `confirmDraft(input)` records explicit confirmation for interactive planning.
- `launchCreateTrip(input)` runs the agent-owned workflow launch tool.
- `getPlanningState()` returns draft/progress/recovery state.

This agent replaces the legacy `createTrip -> TRIP_CREATION_WORKFLOW.create()` path.

### `TripEditingAgent`

Owns changes to existing trips.

Responsibilities:

- Understand edit intent: minor tweak, day reorder, destination change, budget change, accessibility change, language change, hosted-trip conversion.
- Read current trip context through tools.
- Decide whether a lightweight patch or full workflow regeneration is needed.
- Launch `TripUpdateWorkflow` only when durable recomputation is needed.
- Preserve user-approved itinerary parts.

This may start as a mode inside `TripPlanningAgent`, but it should become separate once edit behavior grows.

Callable methods:

- `submitTripEdit(input)` receives natural-language or structured edit requests.
- `classifyEdit(input)` returns patch/regenerate/manual-review.
- `applyPatch(input)` handles safe local edits through tools.
- `launchTripUpdate(input)` launches the agent-owned durable update workflow.
- `getEditState()` returns current edit/progress state.

This agent replaces the legacy `updateTrip(userMessage) -> TRIP_UPDATE_WORKFLOW.create()` path.

### `DiscoveryAgent`

Conversational explore/search agent.

Responsibilities:

- Search destinations, places, public trips, users, and posts.
- Combine lexical search, semantic Vectorize search, trending data, and personalization.
- Return GraphQL-safe result objects.
- Avoid hallucinated places by requiring search-backed output.

### `ProfileAgent`

Manages user AI profile and preference changes.

Responsibilities:

- Summarize stable travel preferences.
- Suggest profile completion fields.
- Apply profile updates only after confirmation.
- Keep private/sensitive fields out of long-term agent memory.

### `MediaAgent`

Owns AI-generated or AI-assisted media.

Responsibilities:

- Generate avatars.
- Suggest trip cover images.
- Validate media safety and storage metadata.
- Upload outputs to R2 through tools.

### `SafetyReviewAgent`

Optional cross-cutting agent for high-risk outputs.

Responsibilities:

- Validate public content before publishing.
- Check generated trip advice for unsafe travel, illegal activity, or sensitive claims.
- Gate booking/payment/share flows later.

## Core Tool Platform

Tools should be grouped by capability, not by agent. Agents compose tools.

### Read Tools

- `getUserProfile`
- `getUserTravelMemory`
- `getTrip`
- `getTripItinerary`
- `researchDestination`
- `searchAttractions`
- `searchTrips`
- `searchPlaces`
- `getWeatherPreview`
- `validateTripDraft`
- `estimateTripCost`

### Write Tools

- `createPendingTrip`
- `launchTripCreationWorkflow`
- `launchTripUpdateWorkflow`
- `updateTripDraft`
- `applyTripPatch`
- `updateProfilePreferences`
- `enqueueEmbeddingJob`
- `uploadGeneratedMedia`

### Policy Tools

- `checkUserCanUseAI`
- `checkSubscriptionQuota`
- `requireApproval`
- `redactSensitiveInput`
- `classifySafety`
- `recordAuditEvent`

### Tool Contract Rules

- Every tool has an input schema and output schema.
- Every write tool has an auth check.
- Every write tool has an idempotency key.
- Every tool returns structured errors that the agent can reason about.
- Tools return compact summaries to the model, not entire DB rows unless needed.
- Workflow launch tools are not exported to GraphQL resolvers or generic domain services.
- Workflow launch tools require `agentSessionId`, `agentName`, `userId`, `intentId`, and an idempotency key.
- Workflow launch tools write an audit event before launch and after terminal status.
- Workflow launch tools return a product task ID, not raw internal-only workflow details, unless the caller is another Worker service.

## Modern AI Control Plane

The core architectural object is an `AiTask`, not a raw Workflow instance.

```ts
type AiTaskStatus =
  | 'drafting'
  | 'needs_confirmation'
  | 'approved'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

interface AiTask {
  id: string;
  userId: string;
  agentName: string;
  agentInstance: string;
  intent: 'create_trip' | 'edit_trip' | 'profile_update' | 'discovery' | 'media';
  status: AiTaskStatus;
  workflowId?: string;
  entityType?: 'TRIP' | 'USER' | 'MEDIA';
  entityId?: string;
  createdAt: string;
  updatedAt: string;
}
```

Agent state is the fast/session state. D1 task records are the product/audit state. Workflow state is the durable execution state. The app should be able to recover a task from any of the three.

Recommended state ownership:

- Agent state: draft, conversation, approval state, tool results, active task IDs.
- D1: product rows, audit rows, task rows, final status.
- Workflow: retryable execution steps and terminal durable result.
- GraphQL subscriptions: product-friendly progress stream.

## Transport Strategy

Use multiple transports deliberately:

- GraphQL mutations for current app flows and offline-friendly product contracts.
- Agent methods through Durable Object RPC for GraphQL-to-Agent backend delegation.
- Agent WebSockets for future live planning/edit chat.
- HTTP/SSE for React Native streaming if the web React hooks are not a clean fit.
- GraphQL subscriptions for existing trip progress UI until agent UI replaces that screen.

This avoids forcing Cloudflare's web-first React helpers into Expo React Native before validating compatibility.

## Memory Design

### User Memory

Store stable preferences:

- preferred language,
- travel pace,
- common budget level,
- food preferences if user explicitly provides them,
- accessibility needs if explicitly provided,
- favorite destinations/categories,
- dislike patterns.

Do not store:

- auth tokens,
- private keys,
- full raw prompts with PII,
- exact live location history,
- payment data,
- private messages.

### Trip Memory

Store task-specific context:

- draft fields,
- decisions already confirmed,
- rejected options,
- workflow ID,
- final itinerary summary,
- edit history summary.

### Searchable Knowledge

Use Vectorize and agent/session search differently:

- Vectorize: destination/place/trip embeddings and retrieval.
- Think/Session search: previous conversation/tool context for the same user/trip.
- D1: source of truth for product entities.

## Execution Patterns

Cloudflare's agent patterns map well to Safarnak:

- Routing: `UserOrchestratorAgent` classifies input and delegates to domain agents.
- Prompt chaining: draft extraction -> validation -> itinerary generation -> critique/repair.
- Parallelization: research destination, semantic match, weather, and budget estimation can run together.
- Orchestrator-workers: trip agent delegates place matching, safety review, and media generation to specialized agents/tools.
- Evaluator-optimizer: generated itinerary is checked by a validator and repaired before save.

## Redesign of AI Features

### Create Trip

Agent-led intake, agent-owned workflow execution.

```text
User input/form
  -> GraphQL or Agent route
  -> UserOrchestratorAgent routes create-trip
  -> TripPlanningAgent builds TripDraft
  -> tools run research + validation preview
  -> confirmation if needed
  -> create pending trip
  -> TripPlanningAgent launches TripCreationWorkflow through workflow tool
  -> workflow generates/finalizes/saves
  -> agent and GraphQL subscriptions expose progress
```

Forbidden final-state path:

```text
createTrip resolver -> TRIP_CREATION_WORKFLOW.create()
```

### Edit Trip

Agent decides whether to patch or run an agent-owned durable update.

```text
User edit request
  -> TripEditingAgent reads trip
  -> classify edit size
  -> small patch: applyTripPatch tool + validate
  -> large change: TripEditingAgent launches TripUpdateWorkflow through workflow tool
  -> store edit summary in trip memory
```

Forbidden final-state path:

```text
updateTrip resolver -> TRIP_UPDATE_WORKFLOW.create()
```

### Update Profile

Agent requires confirmation for persistent changes.

```text
User says "I prefer slow trips and boutique hotels"
  -> ProfileAgent extracts preference update
  -> show diff/confirmation
  -> update profile/preferences
  -> update user memory
```

### Discovery

Agent as search planner, not answer fabricator.

```text
User asks "find family-friendly north Iran trips"
  -> DiscoveryAgent queries lexical + semantic + trending
  -> reranks with model if useful
  -> returns real entities only
```

### Avatar and Media

Media generation moves out of direct resolver logic.

```text
User requests avatar
  -> MediaAgent builds safe prompt
  -> image generation workflow/tool
  -> R2 upload
  -> optional ProfileAgent confirmation before applying
```

## New Backend Boundary

Current pattern:

```text
GraphQL resolver -> Workflow -> AI utilities -> DB
```

Target pattern:

```text
GraphQL resolver -> Agent method via Durable Object RPC -> Agent tools -> optional Workflow -> domain services -> DB
Direct agent route -> Agent -> tools/sub-agents -> optional Workflow -> domain services -> DB
Workflow -> domain services -> DB -> Agent task state update
```

GraphQL remains available for all app screens. Direct agent routes should be added for interactive AI experiences where streaming, memory, or bidirectional state are worth it. Legacy direct workflow launch paths must be removed when agent-owned launch is active.

## Current Safarnak Create-Trip System

### Entry Point

`createTrip` in `worker/mutations/createTrip.ts` currently:

1. Validates active user and input.
2. Parses `Current Location:` from the free-text preferences.
3. Inserts a pending `trips` row with a placeholder itinerary.
4. Starts `TRIP_CREATION_WORKFLOW` with trip/user/destination/preferences/date/budget/language parameters.
5. Publishes feed/search/trending side effects.
6. Enqueues an embedding job.
7. Returns immediately so the client can navigate to the trip detail page.

### Workflow

`TripCreationWorkflow` in `worker/workflows/tripCreationWorkflow.ts` currently runs four durable steps:

1. Research + Match:
   - `researchDestination` fetches and caches destination data.
   - `searchAttractionsByPreferences` embeds preferences and queries Vectorize.
   - Fallback uses all destination attractions if semantic matches are thin.
2. Validate:
   - `validateTripRequest` produces non-blocking warnings.
3. Generate Itinerary:
   - `generateItineraryFromPreferences` performs preference analysis and itinerary generation through Workers AI.
   - Prompting lives in `worker/utilities/ai/prompts.ts`.
4. Finalize + Save:
   - `finalizeItineraryForSave` translates, enriches activities with coordinates, extracts waypoints, normalizes DB days, updates the trip, and sends completion notification.

### Strengths

- The app already separates quick mutation acknowledgement from long-running generation.
- Destination research is cache-first and uses external data before AI.
- Vectorize/BGE-M3 supports multilingual semantic matching.
- Create and update workflows already share `finalizeItineraryForSave`.
- Client UX already expects pending trips and workflow progress.

### Problems to Fix

- AI state is not modeled as an agent session; user intent is flattened into a single `preferences` string.
- Preference analysis and itinerary generation are opaque one-shot AI calls.
- There is no durable conversation memory per user or per trip beyond metadata feedback.
- Workflows publish progress, but no agent owns the interaction, clarification, or recovery conversation.
- Prompt logic, model selection, tool boundaries, and JSON parsing are still hand-wired utilities.
- `createTrip` has duplicated search-index upsert logic and mixes trip creation with feed/search/trending side effects.
- The update path is closer to chat, but it still bypasses agent memory and uses one-shot prompting.

## Target Architecture

Use agent-owned layers:

```text
Client
  |
  | GraphQL product API
  | Agent WebSocket/SSE/RPC for interactive AI
  v
Safarnak AI Agent Layer (mandatory AI control plane)
  |
  | Agents/Think with tools, state, sessions, memory, approval, sub-agents
  v
Agent-Owned Durable Workflow Layer
  |
  | TripCreationWorkflow, TripUpdateWorkflow, future media/profile workflows
  v
Domain Services
  |
  | destination research, semantic search, validation, finalization, persistence, side effects
  v
D1 / KV / R2 / Vectorize / Queues / Workers AI
```

## Proposed Agents

### 1. `TripPlanningAgent`

Primary owner for create-trip and later edit-trip conversations.

Responsibilities:

- Maintain user planning context in Think session memory.
- Classify whether the user intent is create, edit, clarify, or cancel.
- Ask missing critical questions before launching expensive workflows.
- Call tools for destination research, validation preview, semantic place preview, and workflow launch.
- Persist structured planning drafts.
- Track workflow IDs and surface progress.

Create-trip is the first supported skill. Edit-trip can later become another mode in the same agent because both share destination context, user preferences, and itinerary memory.

### 2. `ProfileAgent`

Later phase.

Responsibilities:

- Update profile preferences from natural language.
- Suggest profile/travel-style improvements.
- Trigger avatar generation or other profile AI tools after approval.

### 3. `MediaAgent`

Later phase.

Responsibilities:

- Avatar generation.
- Trip cover image suggestions.
- R2 media metadata and safety checks.

### 4. `SearchDiscoveryAgent`

Later phase.

Responsibilities:

- Conversational discovery over trips, places, users, and destinations.
- Semantic search over Vectorize plus GraphQL-friendly result shaping.

## Create-Trip Target Flow

### Phase 1 Flow: Agent-Assisted, Existing UI Compatible

Keep the current GraphQL mutation UX while replacing direct workflow launch behind the worker boundary.

```text
createTrip mutation
  -> call TripPlanningAgent.submitCreateTrip(...)
  -> agent validates, stores draft/session/task state
  -> agent creates pending trip through tool
  -> agent starts TripCreationWorkflow through workflow tool
  -> workflow runs durable generation
  -> workflow updates trip, agent state, and progress subscriptions
```

This gives backend modernization without a large client rewrite. The resolver remains for product compatibility, but it no longer starts workflows.

### Phase 2 Flow: Interactive Planning

Add a chat-like planning route after the backend is stable.

```text
Trip planning screen
  -> user sends "5 days in Shiraz with my family, halal food, not too expensive"
  -> TripPlanningAgent extracts draft
  -> agent calls validation and destination preview tools
  -> agent asks only for missing required fields
  -> user confirms
  -> agent launches TripCreationWorkflow
  -> client shows workflow progress and final trip
```

## Agent Tools

Think supports custom tools using AI SDK `tool()` definitions with Zod schemas. Safarnak should expose narrow tools instead of letting the model call persistence or external APIs directly.

### Create-Trip Tools

`normalizeTripDraft`

- Input: raw user text plus optional app form fields.
- Output: structured `TripDraft`.
- No DB writes.

`researchDestinationTool`

- Wraps `researchDestination`.
- Read-only.
- Returns compact facts, attraction counts, food counts, and warnings.

`matchAttractionsTool`

- Wraps `searchAttractionsByPreferences`.
- Read-only.
- Returns a limited preview of place names/types, not full metadata blobs.

`validateTripDraftTool`

- Wraps `validateTripRequest`.
- Read-only.
- Returns feasibility, warnings, suggested adjustments.

`createPendingTripTool`

- Inserts the pending trip only after final confirmation.
- Writes D1.
- Should require explicit user confirmation in interactive mode.

`launchTripCreationWorkflowTool`

- Starts `TRIP_CREATION_WORKFLOW`.
- Can only be called from `TripPlanningAgent` or a trusted agent-owned service.
- Writes workflow and `AiTask` state.
- Idempotency key: `trip-${tripId}`.

`getTripWorkflowStatusTool`

- Reads workflow/agent state and trip status.
- Used for recovery and reconnect flows.

### Tool Approval Rules

Require approval for tools that:

- Create a trip.
- Modify an existing trip.
- Update profile data.
- Spend money, book, publish publicly, or change visibility.

Do not require approval for:

- Destination research.
- Validation previews.
- Semantic matching previews.
- Read-only trip status checks.

## Data Contracts

Introduce typed contracts under `worker/agents/contracts` or `worker/utilities/ai/contracts`.

```ts
export interface TripDraft {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelers: number;
  preferences: string;
  accommodation?: string;
  userLocation?: string;
  lang?: string;
}

export interface TripPlanningSessionState {
  userId: string;
  activeTripId?: string;
  draft?: TripDraft;
  workflowId?: string;
  lastValidation?: unknown;
  lastResearchSummary?: unknown;
  phase: 'collecting' | 'ready_to_confirm' | 'workflow_running' | 'completed' | 'error';
}
```

The workflow payload can stay close to the current `TripCreationParams`, but it should receive an agent/session ID once the agent layer exists:

```ts
interface TripCreationParams {
  tripId: string;
  userId: string;
  agentSessionId?: string;
  aiTaskId?: string;
  draft: TripDraft;
}
```

## Worker Layout

Recommended structure:

```text
worker/
  agents/
    UserOrchestratorAgent.ts
    subagents/
      TripPlanningAgent.ts
      TripEditingAgent.ts
      ProfileAgent.ts
      DiscoveryAgent.ts
      MediaAgent.ts
      SafetyReviewAgent.ts
    tools/
      tripDraftTools.ts
      destinationTools.ts
      workflowTools.ts
    contracts/
      tripPlanning.ts
    prompts/
      tripPlanningSystem.ts
  workflows/
    tripCreationWorkflow.ts
    tripUpdateWorkflow.ts
  utilities/
    ai/
    destination/
    semantic/
    trip/
```

Do not move domain services into the agent class. Agents should orchestrate. Domain modules should remain testable and callable from workflows.

## Wrangler and Dependency Migration

Cloudflare Think requires packages similar to:

```bash
yarn add @cloudflare/think @cloudflare/ai-chat agents ai @cloudflare/shell workers-ai-provider
```

`zod` already exists in this app.

`wrangler.jsonc` should start with the parent agent binding:

```jsonc
{
  "compatibility_flags": ["nodejs_compat"],
  "durable_objects": {
    "bindings": [
      {
        "class_name": "UserOrchestratorAgent",
        "name": "USER_ORCHESTRATOR_AGENT"
      }
    ]
  },
  "migrations": [
    {
      "tag": "v3",
      "new_sqlite_classes": ["UserOrchestratorAgent"]
    }
  ]
}
```

`TripPlanningAgent`, `TripEditingAgent`, `ProfileAgent`, `DiscoveryAgent`, `MediaAgent`, and `SafetyReviewAgent` should initially be exported sub-agent classes. They do not need separate Durable Object bindings unless they become independently routable top-level agents.

If later adding separate top-level profile/media/discovery/trip-session agents, add them in new migration tags instead of editing the already-applied tag.

`worker/types.ts` will need a Durable Object namespace binding for each top-level bound agent class, not for sub-agent-only classes.

`worker/index.ts` will need to export the agent class and route agent requests before falling back to GraphQL/assets. Keep `worker/index.ts` as the entrypoint.

## Platform Replacement Plan

This is a platform replacement in controlled phases. Create-trip is the first vertical slice, not the final architecture. The objective is to remove the legacy direct workflow launch model, not keep it as a fallback.

### Phase 0: AI Platform Foundations

Build the shared substrate all agents will use:

- Add Cloudflare Agents/Think dependencies.
- Add one initial Durable Object migration tag for `UserOrchestratorAgent`.
- Add `worker/agents` with base agent utilities, contracts, tool policy helpers, and model routing.
- Add `routeAgentRequest()` in `worker/index.ts` while preserving GraphQL and static asset routes.
- Add typed tool wrappers for auth, quota, redaction, audit logging, D1 reads/writes, KV memory, Vectorize search, R2 media, and workflow launch.
- Add an `ai_audit_events` or metadata-based audit trail before broad write-tool rollout.

Exit criteria:

- `wrangler dev` starts with agent routes and GraphQL routes together.
- A simple authenticated agent method can read/write its own state.
- No product behavior changes yet.

### Phase 1: Orchestrator and Create-Trip Agent

Build `UserOrchestratorAgent` and `TripPlanningAgent`, but keep the current mobile UX.

- GraphQL `createTrip` delegates to `TripPlanningAgent.submitCreateTrip`.
- Agent extracts a structured draft, validates it, creates an `AiTask`, and creates/receives the pending trip through tools.
- Agent owns `TRIP_CREATION_WORKFLOW.create()`.
- Store agent/session/task IDs in metadata for traceability.

Exit criteria:

- No direct `TRIP_CREATION_WORKFLOW.create()` call remains in the GraphQL resolver.
- Agent failures return a controlled product error or create a failed `AiTask`; they do not bypass the agent and launch the old path.
- No regression in create-trip success rate.

### Phase 2: Agent-Owned Create Trip

Remove legacy direct-workflow assumptions from the generation path.

- Workflow consumes the agent's `TripDraft`, `AiTask`, and intent profile.
- Preference analysis moves out of `generateItineraryFromPreferences` and into `TripPlanningAgent`.
- Workflow progress mirrors into agent state as well as GraphQL subscriptions.
- Workflow side effects are moved to final activation, not the initial mutation.

Exit criteria:

- Existing form flow works.
- Pending/active/error states work.
- Trip metadata includes `pipeline: create-agent-v1`.

### Phase 3: Interactive Planning Surface

Add a user-facing planning conversation.

- Use direct agent transport if React Native integration is clean.
- Otherwise expose a GraphQL/HTTP bridge to agent methods.
- Support clarification, draft preview, validation warnings, confirmation, launch, and reconnect.

Exit criteria:

- A user can create a trip without filling a rigid form.
- The same backend path handles both form submit and chat-based planning.

### Phase 4: Trip Editing Agent

Move edit-trip AI to an agentic model.

- `TripEditingAgent` classifies edits as patch vs regenerate.
- Lightweight edits use patch tools.
- Large edits launch `TripUpdateWorkflow` through an agent-owned workflow tool.
- User-approved itinerary parts are preserved in trip memory.

Exit criteria:

- Existing `updateTrip(userMessage)` behavior is preserved or improved.
- No direct `TRIP_UPDATE_WORKFLOW.create()` call remains in the GraphQL resolver.
- Edit memory survives reconnects.

### Phase 5: Profile, Discovery, and Media Agents

Add new AI domains only after create/edit are stable:

- `ProfileAgent` for preference/profile updates.
- `DiscoveryAgent` for conversational search over real entities.
- `MediaAgent` for avatar and trip media generation.
- `SafetyReviewAgent` as a shared review tool/agent where needed.

Exit criteria:

- Each new capability uses explicit tools, approvals, and memory policy.
- No new production prompt-only resolver paths are added.

## Create-Trip First Slice

### Step 0: Preparation

- Add dependencies.
- Add `UserOrchestratorAgent` Durable Object binding and migration tag.
- Export `UserOrchestratorAgent` and sub-agent classes from `worker/index.ts`.
- Confirm `wrangler dev` starts.

### Step 1: Extract Create-Trip Services

Move logic out of `createTrip.ts` into narrow services:

- `createPendingTrip`
- `publishTripCreatedFeedEvent`
- `upsertTripSearchIndex`
- `enqueueTripEmbedding`
- `launchTripCreationWorkflowTool`

This is required before agent integration because GraphQL and Agents need the same trip persistence behavior, while workflow launch remains agent-owned.

### Step 2: Add Agent Contracts and Tools

Implement:

- `TripDraft`
- `TripPlanningSessionState`
- `normalizeTripDraft`
- read-only destination/validation/matching tools
- workflow launch tool

Keep the first tools server-side only; no client tool approval UI is needed for Phase 1 if GraphQL remains the entrypoint.

### Step 3: Add Agent-Assisted GraphQL Path

Update `createTrip` to:

1. Authenticate and perform API-level input validation only.
2. Call `TripPlanningAgent.submitCreateTrip`.
3. Let the agent create/receive the pending trip and launch the workflow through tools.
4. Keep existing GraphQL return shape unchanged.

Feature-flag this path with a Worker variable such as `AI_AGENT_TRIP_CREATE_ENABLED`.

Failure rule: if agent dispatch fails, return a safe error or failed task. Do not launch the workflow directly from the resolver.

### Step 4: Move Preference Analysis Into Agent

Replace `generateItineraryFromPreferences`'s internal preference-analysis call with a structured draft produced by the agent.

Current:

```text
workflow step 3 -> preference analysis LLM -> itinerary generation LLM
```

Target:

```text
agent -> draft + intent profile
workflow step 3 -> itinerary generation LLM using agent profile + destination data
```

This reduces duplicate reasoning and gives later edit-trip sessions durable context.

### Step 5: Workflow Progress Back to Agent State

Keep existing `TRIP_UPDATE` GraphQL subscription, but also mirror workflow progress into agent state. This enables:

- reconnect recovery,
- future chat status messages,
- better error handling,
- "continue planning" flows.

### Step 6: Interactive Client

After backend stability:

- Add a create-trip planning conversation screen.
- Use Cloudflare agent chat transport if it fits React Native constraints.
- If the official React helper is web-first, expose a Worker HTTP/SSE or GraphQL bridge around the agent instead of forcing web-only hooks into React Native.

## Workflow Changes

Keep `TripCreationWorkflow` durable, but make it agent-owned. Refactor its internals and remove any assumption that GraphQL launched it.

Target workflow steps:

1. Load Agent Draft + AiTask + Destination Research
2. Match Places
3. Validate
4. Generate Itinerary
5. Finalize + Save
6. Publish Side Effects

Move feed/search/trending/embedding side effects from the initial mutation to the final workflow stage when the trip is active. The current behavior publishes a public feed event for a pending placeholder trip, which can expose low-quality data before generation completes.

Enforcement:

- `worker/mutations/createTrip.ts` must not reference `context.env.TRIP_CREATION_WORKFLOW.create`.
- `worker/mutations/updateTrip.ts` must not reference `context.env.TRIP_UPDATE_WORKFLOW.create`.
- Workflow creation belongs in `worker/agents/tools/workflowTools.ts` or a tightly scoped agent-owned service only.

## Model Strategy

Keep `worker/utilities/ai/models.ts` as the central source of model identifiers.

Add task-level routing:

- `INTENT_EXTRACTION`: small deterministic model.
- `DRAFT_NORMALIZATION`: small deterministic model with strict JSON.
- `ITINERARY_GENERATION`: current dynamic small/large choice.
- `TRIP_REPAIR`: small model for JSON repair and partial retries.
- `SAFETY`: optional Llama Guard before public publishing or profile changes.
- `EMBEDDINGS`: keep BGE-M3 at 1024 dimensions.

Think's `getModel()` should return the default model for conversational turns. Tool implementations can still call `env.AI.run` with task-specific models where needed.

## Safety and Privacy

- Never put tokens, private keys, phone numbers, email addresses, or full user PII into agent memory.
- Store only planning-relevant preference summaries.
- Redact `Current Location:` to city/region unless precise coordinates are required for route planning.
- Add explicit approval before public publish, profile mutation, booking, payment, or destructive trip edits.
- Mask internal AI and workflow errors in client-facing messages.
- Do not expose raw prompt text or full model responses in production logs.

## Observability

Add consistent trace metadata:

- `agentSessionId`
- `tripId`
- `workflowId`
- `userId`
- `pipeline`
- `model`
- `step`
- `durationMs`
- `cacheHit`
- `generationFallbackUsed`

Store compact diagnostics in trip metadata:

```json
{
  "pipeline": "create-agent-v1",
  "agentSessionId": "...",
  "workflowId": "...",
  "language": "fa",
  "validationWarningCount": 1,
  "attractionsCount": 32,
  "waypointsCount": 18,
  "generationFallbackUsed": false
}
```

## Rollout Strategy

Use staged flags:

- `AI_AGENT_PLATFORM_ENABLED=false`
- `AI_AGENT_DIRECT_ROUTES_ENABLED=false`
- `AI_AGENT_TRIP_CREATE_ENABLED=false`
- `AI_AGENT_INTERACTIVE_PLANNING=false`
- `AI_AGENT_TRIP_EDIT_ENABLED=false`
- `AI_AGENT_PROFILE_ENABLED=false`
- `AI_AGENT_DISCOVERY_ENABLED=false`
- `AI_AGENT_MEDIA_ENABLED=false`

Pre-cutover validation can run in non-production environments or behind internal-only flags, but the production target is not a permanent dual path. Once agent create-trip is enabled, direct workflow launch is disabled.

Roll out by domain, not by technology:

1. Platform routes and state with no user-visible behavior.
2. Create-trip agent cutover behind `AI_AGENT_TRIP_CREATE_ENABLED`.
3. Remove direct create-trip workflow launch.
4. Interactive planning.
5. Edit-trip agent.
6. Remove direct edit-trip workflow launch.
7. Profile/discovery/media agents.

## Testing Checklist

Backend:

- `yarn lint`
- `./node_modules/.bin/tsc --noEmit`
- `yarn worker:dev`
- create-trip mutation with agent flag on
- direct workflow launch guard verified by code search
- workflow retry after simulated AI failure
- workflow reconnect/status after client closes

Data:

- D1 pending trip inserted once.
- Workflow ID is idempotent per trip.
- Final trip status becomes `active`.
- Itinerary remains valid JSON.
- Coordinates and waypoints remain JSON strings in DB and parsed objects in GraphQL.
- Feed/search/trending side effects happen only after final save in the target design.

AI:

- English create trip.
- Persian create trip.
- Missing destination.
- Flexible dates.
- Long 20-30 day trip.
- No OpenTripMap results.
- Vectorize empty results.
- AI invalid JSON response.

Client:

- Existing create-trip form still works.
- Trip detail pending state still works.
- Subscription progress still works.
- Final refetch shows active trip.
- Error banner appears when workflow fails.

## Risks

- Cloudflare Think and Agents are newer moving pieces; package APIs may shift. Pin versions and avoid broad refactors in the first pass.
- React Native may not use the official web React chat helpers directly. Keep GraphQL compatibility and add an agent transport bridge if needed.
- Durable Object SQLite migrations are one-way in production. Add classes with new tags and avoid renaming without a migration plan.
- Agent memory can become a privacy liability if raw user input is stored indefinitely. Summarize aggressively and avoid sensitive fields.
- Moving feed/search side effects from mutation to workflow changes when public visibility happens. This is desirable, but should be tested against feed UX.
- Removing direct workflow fallback means agent-route failures become product failures. Mitigate with canary rollout, strong tests, idempotency, retries, and clear failed-task recovery UI.

## Recommended First Implementation Slice

1. Add the agent platform skeleton: `worker/agents`, base contracts, tool policy helpers, routing, and DO bindings.
2. Add `UserOrchestratorAgent` with intent routing but no production writes.
3. Extract create-trip service helpers without behavior changes.
4. Add `TripPlanningAgent` with a minimal `submitCreateTrip` method.
5. Route `createTrip` through `TripPlanningAgent.submitCreateTrip` behind a flag.
6. Move workflow launch into `workflowTools.ts`.
7. Remove direct `TRIP_CREATION_WORKFLOW.create()` from the resolver.

This slice starts the full AI platform redesign while preserving the app's current UX and keeping the durable workflow guarantees that already fit the product.
