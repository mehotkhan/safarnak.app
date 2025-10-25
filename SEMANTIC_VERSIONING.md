# 🚀 Semantic Versioning & Release Management

Safarnak uses a comprehensive semantic versioning system with automated commit message generation, changelog creation, and release management.

## 📋 Version Strategy

### Current Version: `0.5.0` (Alpha)
- **Target Stable**: `1.0.0`
- **Progress**: 0% → 100% (0.5 → 0.6 → 0.7 → 0.8 → 0.9 → 1.0)

### Version Stages
| Version | Stage | Description |
|---------|-------|-------------|
| 0.5.0 | Alpha | Initial development version |
| 0.6.0 | Alpha | Core features implementation |
| 0.7.0 | Alpha | UI/UX improvements |
| 0.8.0 | Beta | Feature completion |
| 0.9.0 | Beta | Testing and bug fixes |
| 1.0.0 | Stable | First stable release |

## 🔧 Tools & Configuration

### Installed Packages
- **release-it**: Automated release management
- **@commitlint/cli**: Commit message validation
- **@commitlint/config-conventional**: Conventional commits standard
- **commitizen**: Interactive commit tool
- **cz-conventional-changelog**: Conventional changelog for commitizen
- **conventional-changelog-cli**: Automated changelog generation

### Configuration Files
- **commitlint.config.js**: Commit message validation rules
- **.release-it.json**: Release automation configuration
- **scripts/version-manager.js**: Custom version management
- **scripts/generate-commit-message.js**: AI commit message generator
- **scripts/release-it-plugins/update-app-version.js**: App version updater

## 🎯 Usage Commands

### Version Management
```bash
# Show current version info
yarn version:info

# Create releases
yarn version:patch      # 0.5.0 → 0.5.1
yarn version:minor      # 0.5.0 → 0.6.0
yarn version:major      # 0.5.0 → 1.0.0
yarn version:prerelease # 0.5.0 → 0.5.1-alpha.1

# Manual version management
yarn version:create patch
yarn version:create minor
yarn version:create major
```

### Commit Management
```bash
# Interactive commit with conventional commits
yarn commit

# Generate commit message automatically
yarn commit:generate

# Validate commit message
yarn commit:check
```

### Changelog Management
```bash
# Generate changelog for current release
yarn changelog

# Generate complete changelog
yarn changelog:all
```

## 📝 Conventional Commits

### Commit Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
| Type | Description | Emoji | Example |
|------|-------------|-------|---------|
| `feat` | A new feature | ✨ | `feat(auth): add user login` |
| `fix` | A bug fix | 🐛 | `fix(api): resolve GraphQL error` |
| `docs` | Documentation changes | 📚 | `docs: update README` |
| `style` | Code style changes | 🎨 | `style: format code` |
| `refactor` | Code refactoring | ♻️ | `refactor(api): reorganize structure` |
| `perf` | Performance improvements | ⚡ | `perf: optimize database queries` |
| `test` | Test changes | 🧪 | `test: add unit tests` |
| `build` | Build system changes | 🏗️ | `build: update dependencies` |
| `ci` | CI/CD changes | 🔧 | `ci: update GitHub Actions` |
| `chore` | Other changes | 🔨 | `chore: clean up files` |

### Scopes (Safarnak-specific)
- `auth` - Authentication system
- `api` - Client API layer
- `worker` - Cloudflare Worker
- `client` - React Native client
- `graphql` - GraphQL schema and operations
- `database` - Database schema and migrations
- `ui` - User interface components
- `i18n` - Internationalization
- `theme` - Theme and styling
- `maps` - Map functionality
- `offline` - Offline functionality
- `redux` - State management
- `expo` - Expo configuration
- `android` - Android-specific
- `ios` - iOS-specific
- `web` - Web-specific

### Examples
```bash
# Feature commits
feat(auth): add biometric authentication
feat(api): implement GraphQL subscriptions
feat(ui): add dark mode toggle

# Bug fixes
fix(worker): resolve authentication error
fix(offline): fix sync queue issue
fix(i18n): correct Persian translations

# Documentation
docs: update contributing guidelines
docs(api): add GraphQL schema documentation

# Refactoring
refactor(api): reorganize mutation structure
refactor(ui): simplify component hierarchy

# Performance
perf(database): optimize query performance
perf(ui): improve rendering performance

# Testing
test(auth): add authentication tests
test(api): add GraphQL operation tests

# Build and CI
build: update Expo SDK to v54
ci: add automated testing workflow

# Chores
chore: update dependencies
chore: clean up unused files
```

## 🔄 Release Process

### Automated Release (Recommended)
```bash
# Patch release (bug fixes)
yarn version:patch

# Minor release (new features)
yarn version:minor

# Major release (breaking changes)
yarn version:major

# Prerelease (alpha/beta)
yarn version:prerelease
```

### Manual Release Process
1. **Pre-release checks**:
   ```bash
   yarn version:info
   yarn codegen
   yarn db:migrate
   npx tsc --noEmit
   yarn lint
   yarn format
   ```

2. **Create release**:
   ```bash
   yarn version:create minor
   ```

3. **Commit and push**:
   ```bash
   git add .
   yarn commit
   git push origin master
   ```

4. **Create GitHub release**:
   ```bash
   yarn version:patch --ci
   ```

### Release Automation
The release process automatically:
- ✅ Runs pre-release checks (TypeScript, ESLint, Prettier)
- ✅ Updates `package.json` version
- ✅ Updates `app.config.js` version (for APK)
- ✅ Generates changelog entry
- ✅ Creates Git tag
- ✅ Creates GitHub release
- ✅ Updates CHANGELOG.md

## 📱 APK Version Management

### Version Synchronization
- **package.json**: Main version source
- **app.config.js**: APK version (automatically synced)
- **Git tags**: Release versions
- **GitHub releases**: Public releases

### Version Updates
The release process automatically updates:
1. `package.json` version
2. `app.config.js` version
3. Git tag creation
4. GitHub release
5. CHANGELOG.md entry

## 🤖 AI Commit Message Generator

### Automatic Analysis
The AI commit message generator analyzes:
- **File changes**: Added, modified, deleted files
- **File types**: Components, API, GraphQL, database, etc.
- **Change patterns**: New features, bug fixes, refactoring
- **Scope detection**: Automatic scope assignment

### Usage
```bash
# Generate commit message for staged changes
yarn commit:generate

# Interactive commit with AI suggestions
yarn commit
```

### Example Output
```
🤖 AI Commit Message Generator for Safarnak

📁 Analyzing 3 file(s):
   api/mutations/login.ts
   components/AuthWrapper.tsx
   graphql/queries/login.graphql

🎯 Generated Commit Message:
   ✨ feat(auth): add user login functionality

📋 Analysis:
   Type: feat (A new feature)
   Scope: auth
   Description: add user login functionality
```

## 🔍 Quality Checks

### Pre-commit Hooks
Automatically runs before each commit:
- ✅ TypeScript compilation check
- ✅ ESLint validation
- ✅ Prettier formatting check
- ✅ GraphQL codegen (if schema changed)
- ✅ Database migration check (if schema changed)

### Pre-release Checks
Automatically runs before each release:
- ✅ TypeScript compilation
- ✅ ESLint validation
- ✅ Prettier formatting
- ✅ GraphQL codegen
- ✅ Database migration

## 📊 Progress Tracking

### Version Progress
```bash
yarn version:info
```

Output:
```
📋 Safarnak Version Information

Current Version: 0.5.0
Stage: alpha
Description: Initial development version
Target Stable: 1.0.0
Progress: 0%

🔄 Available Commands:
  yarn version:patch     - Patch release (0.5.0 → 0.5.1)
  yarn version:minor     - Minor release (0.5.0 → 0.6.0)
  yarn version:major     - Major release (0.5.0 → 1.0.0)
  yarn version:prerelease - Prerelease (0.5.0 → 0.5.1-alpha.1)
```

### Changelog Generation
```bash
yarn changelog
```

Generates changelog entries with:
- Version information
- Change descriptions
- Stage information
- APK version
- Worker version
- Target stable version

## 🚀 Best Practices

### Commit Messages
1. **Use conventional commits**: Follow the format strictly
2. **Be descriptive**: Clear, concise descriptions
3. **Include scope**: Specify the affected area
4. **Use present tense**: "add feature" not "added feature"
5. **Lowercase**: No capital letters in descriptions

### Version Releases
1. **Patch releases**: Bug fixes only
2. **Minor releases**: New features, backwards compatible
3. **Major releases**: Breaking changes
4. **Prereleases**: Alpha/beta testing

### Release Frequency
- **Patch**: As needed for bug fixes
- **Minor**: Every 2-4 weeks for new features
- **Major**: When breaking changes are needed
- **Prerelease**: For testing new features

## 🔧 Troubleshooting

### Common Issues

#### Commit Message Validation Failed
```bash
# Use interactive commit
yarn commit

# Generate automatic message
yarn commit:generate

# Check message format
yarn commit:check
```

#### Pre-commit Hook Failed
```bash
# Fix TypeScript errors
npx tsc --noEmit

# Fix ESLint issues
yarn lint:fix

# Fix formatting
yarn format
```

#### Release Failed
```bash
# Check version info
yarn version:info

# Run pre-release checks manually
yarn codegen
yarn db:migrate
npx tsc --noEmit
yarn lint
yarn format
```

### Git Hooks Not Working
```bash
# Make hooks executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg

# Test hooks
git add .
git commit -m "test: test commit message"
```

## 📚 Additional Resources

### Documentation
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Release-it Documentation](https://github.com/release-it/release-it)
- [Commitlint Documentation](https://commitlint.js.org/)

### Safarnak-specific
- [README.md](README.md) - Project overview
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [.cursorrules](.cursorrules) - Development guidelines

---

**🎉 Happy coding with semantic versioning!** 

Remember: Good commit messages make great releases! 🚀
