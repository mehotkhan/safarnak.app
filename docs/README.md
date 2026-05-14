# Safarnak Docs

This folder is organized around the new Safarnak architecture: GraphQL as the product API, Cloudflare Agents as the AI runtime, Workflows as durable execution, and domain services as the backend business layer.

Source code remains the authority when docs disagree with implementation. Treat archived files as historical context only.

## Current Structure

```txt
docs/
  README.md
  docs-inventory-review.md
  architecture/
  planning/
  operations/
  design/
  archive/
```

## Active Architecture

- [AI Agents and Think Migration Plan](architecture/ai-agents-think-migration-plan.md)  
  Source of truth for the new AI platform architecture.
- [Worker Architecture Refactor Plan](architecture/worker-architecture.md)  
  Source of truth for refactoring the Cloudflare Worker around Agents, GraphQL, Workflows, and domain services.
- [Social Feed Architecture](architecture/social-feed-architecture.md)  
  Feed/search/trending architecture reference.
- [Offline SQLite Architecture Review](architecture/offline-sqlite-architecture-review.md)  
  Offline-first Apollo/SQLite architecture review and cleanup plan.

## Active Planning

- [Worker Refactor Checklist](planning/worker-refactor-checklist.md)
- [Feed/Search Roadmap](planning/feed-search-roadmap.md)
- [Messaging Phases](planning/messaging-phases.md)
- [Messaging Checklist](planning/safarnak-messaging-checklist.md)
- [Refactor Work Report](planning/refactor-work-report.md)

## Operations

- [Production Optimization Plan](operations/production-optimization-plan.md)
- [Android Build Migration](operations/android-build-migration.md)
- [Contributing](operations/contributing.md)
- [Code of Conduct](operations/code-of-conduct.md)

## Design Assets

- `design/logo-beta.png`
- `design/logo-beta-transparent.png`

## Archive Policy

[`archive/`](archive/README.md) contains old implementation summaries, stale AI workflow docs, historical migration plans, old optimization plans, onboarding drafts, reports, and snapshots. Do not use archived files as implementation guidance without checking current source files first.

Archived AI docs were superseded by [AI Agents and Think Migration Plan](architecture/ai-agents-think-migration-plan.md).

Archived worker snapshots were superseded by [Worker Architecture Refactor Plan](architecture/worker-architecture.md).

## Cleanup Notes

The cleanup record lives in [Docs Inventory Review](docs-inventory-review.md).
