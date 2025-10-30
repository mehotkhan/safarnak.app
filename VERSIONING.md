# Versioning Guide

## Overview
This project uses **semantic versioning** with automated changelog generation via `release-it` and conventional commits.

## Versioning Commands

### Bump Version (Automated)
```bash
# Patch (0.9.1 → 0.9.2) - for bug fixes
yarn version:patch

# Minor (0.9.1 → 0.10.0) - for new features
yarn version:minor

# Major (0.9.1 → 1.0.0) - for breaking changes
yarn version:major

# Prerelease (0.9.1 → 0.9.2-0) - for beta/RC
yarn version:prerelease
```

### What These Commands Do
1. Analyze git commits since last tag (using conventional commits)
2. Generate comprehensive `CHANGELOG.md`
3. Bump version in `package.json`
4. Create git commit: `chore(release): v<new-version>`
5. Create git tag: `v<new-version>`
6. Push to GitHub (commit + tags)

## Conventional Commits

### Interactive Commit (Recommended)
```bash
yarn commit
```
Uses Commitizen for guided conventional commit format.

### Manual Commit Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat:` - New feature → **minor** version bump
- `fix:` - Bug fix → **patch** version bump
- `docs:` - Documentation
- `style:` - Code style (formatting, no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Tests
- `build:` - Build system changes
- `ci:` - CI/CD changes
- `chore:` - Maintenance

### Breaking Changes
Add `BREAKING CHANGE:` in commit footer → **major** version bump

## Workflow Example

```bash
# 1. Make changes
git add .

# 2. Commit with conventional format
yarn commit
# or manually:
git commit -m "feat(trips): add PDF export for itineraries"

# 3. Bump version (will auto-generate changelog)
yarn version:patch  # or minor/major

# Done! Version bumped, changelog generated, and pushed to GitHub
```

## Pre-commit Hooks

The project runs these checks automatically before each commit:
- TypeScript type check
- ESLint
- GraphQL codegen (if schema changed)
- Commit message validation (conventional commits format)

## Release Notes

Release notes are auto-generated from conventional commits and published to GitHub Releases by CI/CD on each version tag.

## Configuration

- `commitlint.config.js` - Commit message validation
- `package.json` → `release-it` - Versioning config
  - Git commit/tag messages
  - Conventional changelog plugin
  - Push behavior

## Notes

- Always ensure working directory is clean before versioning
- CI/CD builds are triggered automatically on version tags
- APK versionCode is derived from semver + build number

