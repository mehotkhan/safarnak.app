# Docs Inventory Review

Date: 2026-05-14

## Purpose

This file records the docs cleanup pass that reorganized `docs/` around the new AI-agent architecture. It is a maintenance record, not an implementation guide.

## Cleanup Summary

The docs folder was reorganized into:

- `architecture/`: active architecture references.
- `planning/`: active checklists and roadmaps.
- `operations/`: build, release, contribution, and production operations docs.
- `design/`: image/design assets.
- `archive/`: historical docs that should not be treated as current.
- `archive/README.md`: archive usage notes.

## Active Docs

### Architecture

- `architecture/ai-agents-think-migration-plan.md`
- `architecture/worker-architecture.md`
- `architecture/social-feed-architecture.md`
- `architecture/offline-sqlite-architecture-review.md`

### Planning

- `planning/worker-refactor-checklist.md`
- `planning/feed-search-roadmap.md`
- `planning/messaging-phases.md`
- `planning/safarnak-messaging-checklist.md`
- `planning/refactor-work-report.md`

### Operations

- `operations/production-optimization-plan.md`
- `operations/android-build-migration.md`
- `operations/contributing.md`
- `operations/code-of-conduct.md`

## Archived Docs

### AI Archive

Superseded by `architecture/ai-agents-think-migration-plan.md`.

- `archive/ai/ai-implementation-summary.md`
- `archive/ai/ai-optimization-complete.md`
- `archive/ai/ai-redesign-checklist.md`
- `archive/ai/ai-testing-checklist.md`
- `archive/ai/ai-trip-generator.md`
- `archive/ai/ai-usage-guide.md`
- `archive/ai/ai-workflow-ready.md`
- `archive/ai/intelligent-ai-architecture.md`
- `archive/ai/test-results.md`

### Migration Archive

Historical broad migration plans. Useful for audit/context only.

- `archive/migrations/checklist-final-migration.md`
- `archive/migrations/migration-plan-v2.md`
- `archive/migrations/mvp-finalization-plan.md`
- `archive/migrations/safarnak-mvp.md`

### Optimization Archive

Superseded for active planning by `operations/production-optimization-plan.md` and `operations/android-build-migration.md`.

- `archive/optimization/apk-optimization-checklist.md`
- `archive/optimization/apk-size-reduction-masterplan.md`
- `archive/optimization/optimization-android-build.md`
- `archive/optimization/optimization-rn.md`

### Onboarding Archive

Historical onboarding implementation/checklist docs.

- `archive/onboarding/onboarding-implementation-guide.md`
- `archive/onboarding/onboarding-redesign-checklist.md`

### Reports and Snapshots

- `archive/reports/phases-verification.md`
- `archive/reports/ui-refactor-summary.md`
- `archive/snapshots/workers-tree-old.md`

## Cleanup Decisions

- Old AI trip generator/workflow docs were archived because they describe the pre-Agent architecture and can conflict with the new Cloudflare Agents plan.
- Old Worker tree snapshots were archived because `architecture/worker-architecture.md` is now the active target.
- Large migration/MVP plans were archived because they mix completed, stale, and contradictory work.
- Build optimization overlap was reduced by keeping active operations docs and archiving older masterplans/checklists.
- The active docs index is now `docs/README.md`.

## Maintenance Rules

- Add new architecture docs under `architecture/`.
- Add current execution checklists under `planning/`.
- Add build/release/contribution docs under `operations/`.
- Move completed historical plans to `archive/` instead of leaving them in the root.
- Update `README.md` whenever adding, moving, or archiving docs.
