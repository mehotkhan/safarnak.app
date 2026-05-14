# Safarnak Docs

This folder contains architecture notes, cleanup reports, migration plans, and historical implementation records.

Source code is the authority when docs disagree with implementation. Before using an older plan or checklist, verify it against current files such as `package.json`, `app/`, `ui/`, `api/`, `database/`, `graphql/`, and `worker/`.

## Current Cleanup Reports

- `offline-sqlite-architecture-review.md`: review of the hybrid Apollo/SQLite offline system.
- `docs-inventory-review.md`: inventory of docs with keep, refresh, merge, and archive recommendations.
- `refactor-work-report.md`: moved root refactor report for MVP/codebase cleanup planning.

## Suggested Cleanup Flow

1. Use `docs-inventory-review.md` to decide what stays active.
2. Merge overlapping plans into one source of truth per domain.
3. Move historical completion reports into an archive folder in a separate cleanup commit.
4. Refresh active docs after each major architecture cleanup.

