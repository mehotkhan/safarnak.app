# Docs Inventory Review

Date: 2026-05-14

## Purpose

This inventory reviews the current `docs/` folder so cleanup work can happen deliberately. It does not claim every historical note is current. Source files remain the authority for implementation details.

## Root Documentation Moves

Moved into `docs/`:

- `reports.md` -> `docs/refactor-work-report.md`
- `CODE_OF_CONDUCT.md` -> `docs/CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md` -> `docs/CONTRIBUTING.md`

Kept at repo root:

- `README.md`: repository entry point.
- `AGENTS.md`: active coding-agent instructions.
- Tooling/config JSON files such as `package.json`, `tsconfig.json`, `eas.json`, and `wrangler.jsonc`.
- Locale JSON files under `locales/`, because those are runtime app data.

## Recommended Doc Categories

### Keep Active

These are closest to current architecture or useful for near-term cleanup:

- `offline-sqlite-architecture-review.md`
- `refactor-work-report.md`
- `worker-architecture.md`
- `worker-refactor-checklist.md`
- `feed-search-roadmap.md`
- `messaging-phases.md`
- `safarnak-messaging-checklist.md`
- `SOCIAL_FEED_ARCHITECTURE.md`
- `PRODUCTION_OPTIMIZATION_PLAN.md`
- `android-build-migration.md`

### Refresh Before Trusting

These contain useful intent but likely include stale paths, completed phases, or old assumptions:

- `MIGRATION_PLAN_V2.md`
- `CHECKLIST_FINAL_MIGRATION.md`
- `MVP_FINALIZATION_PLAN.md`
- `safarnak-mpv.md`
- `UI_REFACTOR_SUMMARY.md`
- `ONBOARDING_IMPLEMENTATION_GUIDE.md`
- `ONBOARDING_REDESIGN_CHECKLIST.md`
- `PHASES_VERIFICATION.md`

### Archive Candidates

These appear to be historical completion summaries or deep old snapshots. Keep them only if they are useful audit history:

- `AI_IMPLEMENTATION_SUMMARY.md`
- `AI_OPTIMIZATION_COMPLETE.md`
- `AI_REDESIGN_CHECKLIST.md`
- `AI_TESTING_CHECKLIST.md`
- `AI_TRIP_GENERATOR.md`
- `AI_USAGE_GUIDE.md`
- `AI_WORKFLOW_READY.md`
- `INTELLIGENT_AI_ARCHITECTURE.md`
- `TEST_RESULTS.md`
- `workers-tree-old.md`

### Build Optimization Set

These overlap and should eventually be merged into one current build-size plan:

- `APK_OPTIMIZATION_CHECKLIST.md`
- `APK_SIZE_REDUCTION_MASTERPLAN.md`
- `OPTIMIZATION_ANDROID_BUILD.md`
- `OPTIMIZATION_RN.md`

## File Notes

| File | Current Use | Cleanup Recommendation |
| --- | --- | --- |
| `AI_IMPLEMENTATION_SUMMARY.md` | Historical AI implementation summary. | Archive after extracting any still-valid workflow notes. |
| `AI_OPTIMIZATION_COMPLETE.md` | Historical completion report. | Archive. |
| `AI_REDESIGN_CHECKLIST.md` | AI redesign verification checklist. | Archive or merge into active AI architecture doc if AI work resumes. |
| `AI_TESTING_CHECKLIST.md` | Large manual AI testing checklist. | Refresh before use; likely stale but useful as test inspiration. |
| `AI_TRIP_GENERATOR.md` | Technical AI trip generator documentation. | Refresh against current Worker code before treating as current. |
| `AI_USAGE_GUIDE.md` | AI usage/testing guide. | Refresh or archive; commands and behavior may drift. |
| `AI_WORKFLOW_READY.md` | Historical "ready" note. | Archive. |
| `APK_OPTIMIZATION_CHECKLIST.md` | APK size checklist. | Merge with masterplan or keep as task checklist only. |
| `APK_SIZE_REDUCTION_MASTERPLAN.md` | APK size reduction masterplan. | Keep one build-size source of truth, then archive overlaps. |
| `CHECKLIST_FINAL_MIGRATION.md` | Large final migration checklist. | Refresh carefully; contains completed and contradictory sections. |
| `CODE_OF_CONDUCT.md` | Contributor/community policy. | Keep if project accepts public contributions. |
| `CONTRIBUTING.md` | Contributor guide. | Refresh commands and architecture wording before publishing externally. |
| `INTELLIGENT_AI_ARCHITECTURE.md` | AI architecture proposal. | Archive or refresh when AI pipeline work restarts. |
| `MIGRATION_PLAN_V2.md` | Broad migration/refactor plan. | Refresh into a current cleanup roadmap or archive. |
| `MVP_FINALIZATION_PLAN.md` | MVP plan with old gaps. | Refresh against current source before using. |
| `ONBOARDING_IMPLEMENTATION_GUIDE.md` | Onboarding implementation guide. | Refresh after checking current auth/onboarding routes. |
| `ONBOARDING_REDESIGN_CHECKLIST.md` | Onboarding checklist. | Refresh or archive after source verification. |
| `OPTIMIZATION_ANDROID_BUILD.md` | Short Android build optimization note. | Merge into build optimization source of truth. |
| `OPTIMIZATION_RN.md` | Short React Native optimization note. | Merge into production optimization plan. |
| `PHASES_VERIFICATION.md` | Phase verification summary. | Archive unless used as audit history. |
| `PRODUCTION_OPTIMIZATION_PLAN.md` | Runtime/build/CI optimization plan. | Keep active, but refresh specific config references before execution. |
| `SOCIAL_FEED_ARCHITECTURE.md` | Social/feed architecture doc. | Keep as architecture reference; verify before implementation. |
| `TEST_RESULTS.md` | Historical AI test results. | Archive. |
| `UI_REFACTOR_SUMMARY.md` | UI refactor summary. | Refresh current route/component references or archive. |
| `android-build-migration.md` | Android build cleanup plan. | Keep active if Android build cleanup remains planned. |
| `docs-inventory-review.md` | Current docs cleanup inventory. | Keep active during cleanup. |
| `feed-search-roadmap.md` | Feed/search roadmap. | Keep active if feed/search stays in scope. |
| `messaging-phases.md` | Short messaging phase plan. | Keep as compact roadmap; reconcile with checklist. |
| `offline-sqlite-architecture-review.md` | Current offline SQLite review. | Keep active for offline cleanup. |
| `refactor-work-report.md` | Existing refactor work report moved from root. | Keep active if MVP cleanup remains the main direction. |
| `safarnak-messaging-checklist.md` | Messaging implementation checklist. | Keep, but reconcile with current messaging source. |
| `safarnak-mpv.md` | Merged MVP finalization plan. | Refresh or merge with `refactor-work-report.md`. |
| `worker-architecture.md` | Worker architecture design. | Keep active. |
| `worker-refactor-checklist.md` | Worker refactor checklist. | Keep active. |
| `workers-tree-old.md` | Old Worker tree snapshot. | Archive. |

## Suggested Cleanup Structure

Use this structure if the docs folder continues to grow:

```txt
docs/
  architecture/
  cleanup/
  operations/
  archive/
```

Suggested first pass:

- Move active architecture docs into `docs/architecture/`.
- Move cleanup plans and reviews into `docs/cleanup/`.
- Move build/release docs into `docs/operations/`.
- Move historical completion reports and old snapshots into `docs/archive/`.

Do this as a separate commit because many links may need updating.

## Immediate Cleanup Tasks

1. Pick one source of truth for MVP/refactor planning.
2. Pick one source of truth for APK/build optimization.
3. Archive historical AI completion docs after checking whether current AI code still matches them.
4. Refresh `CONTRIBUTING.md` before relying on it for outside contributors.
5. Keep `docs/README.md` current as active docs are merged, archived, or moved.
