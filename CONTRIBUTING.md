# 🤝 Contributing to Safarnak

Thank you for your interest in contributing to Safarnak! This document provides guidelines and information for contributors.

## 🌍 About Safarnak

Safarnak is a modern offline-first travel companion built with:

- **Frontend**: Expo React Native (iOS/Android/Web)
- **Backend**: Cloudflare Workers with GraphQL
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Code Generation**: GraphQL Codegen for type-safe client-server communication
- **Architecture**: Unified monorepo with perfect separation

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Yarn package manager
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/safarnak.app.git
   cd safarnak.app
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Setup Database**

   ```bash
   yarn db:migrate
   ```

4. **Generate GraphQL Types and Hooks**

   ```bash
   yarn codegen  # Auto-generates api/hooks.ts and api/types.ts
   ```

5. **Start Development**
   ```bash
   yarn dev  # Starts both worker and client
   ```

## 🏗️ Architecture Overview

### Perfect Separation

- **📁 GraphQL Folder**: Shared schema and query definitions only
- **📁 API Folder**: All client-specific code including auto-generated hooks
- **📁 Worker Folder**: All server-specific resolvers and logic

### Key Directories

```
safarnak.app/
├── worker/          # Server-side GraphQL resolvers
├── graphql/         # Shared GraphQL schema and operations
├── api/             # Client-side API layer with auto-generated hooks
├── drizzle/         # Database schema and migrations
├── store/           # Redux state management
├── app/             # Expo Router pages
├── components/      # React components
└── constants/       # App constants
```

## 🔧 Development Workflow

### Adding New Features

#### 1. GraphQL Operations

```bash
# 1. Define schema
# Edit graphql/schema.graphql

# 2. Create operations
# Add .graphql files to graphql/queries/

# 3. Generate types and hooks
yarn codegen

# 4. Create resolvers
# Add resolver functions to worker/mutations/ or worker/queries/

# 5. Create client wrappers
# Add wrapper files to api/mutations/ or api/queries/

# 6. Use in components
# Import generated hooks in React components
```

#### 2. Database Changes

```bash
# 1. Update schema
# Edit drizzle/schema.ts

# 2. Generate migration
yarn db:generate

# 3. Apply migration
yarn db:migrate

# 4. Update GraphQL schema if needed
yarn codegen
```

#### 3. UI Components

```bash
# 1. Create component
# Add to components/ui/ or components/

# 2. Add TypeScript interfaces
# Define proper types

# 3. Add translations
# Update locales/en/ and locales/fa/

# 4. Test RTL layout
# Ensure Persian layout works correctly
```

## 📋 Code Standards

### TypeScript

- **Strict Mode**: Enhanced checking enabled
- **No `any`**: Use `unknown` if type is truly unknown
- **Path Aliases**: Use `@/`, `@components/`, `@graphql/`
- **Type Everything**: Parameters, return values, props

### GraphQL

- **Schema First**: Define in `graphql/schema.graphql`
- **Operations**: Use `.graphql` files in `graphql/queries/`
- **Codegen**: Always run `yarn codegen` after changes
- **Never Edit Generated**: Don't manually edit `api/hooks.ts` or `api/types.ts`

### React Native

- **Functional Components**: Use hooks and TypeScript
- **Performance**: Use `React.memo`, `useCallback`, `useMemo`
- **Accessibility**: Add proper accessibility props
- **RTL Support**: Test with Persian language

### File Naming

- **Components**: `PascalCase.tsx` (e.g., `AuthWrapper.tsx`)
- **Hooks**: `camelCase.ts` starting with 'use' (e.g., `useAuth.ts`)
- **Utilities**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Constants**: `SCREAMING_SNAKE_CASE` inside files

## 🧪 Testing Guidelines

### Platform Testing

- [ ] **Android** (Legacy Architecture)
- [ ] **Android** (New Architecture - Fabric + TurboModules)
- [ ] **iOS** (macOS only)
- [ ] **Web** browser

### Feature Testing

- [ ] **Online functionality** works correctly
- [ ] **Offline functionality** works correctly
- [ ] **Authentication** works correctly
- [ ] **Real-time features** (subscriptions) work correctly
- [ ] **Dark/Light theme** switching works
- [ ] **Language switching** works (English ↔ Persian)
- [ ] **RTL layout** works for Persian

### Code Quality

- [ ] **TypeScript**: No errors (`npx tsc --noEmit`)
- [ ] **ESLint**: Passed checks (`yarn lint`)
- [ ] **Prettier**: Code formatted (`yarn format`)
- [ ] **GraphQL**: Schema and operations are valid
- [ ] **Database**: Migrations applied successfully

## 🔄 Pull Request Process

### Before Submitting

1. **Fork** the repository
2. **Create** a feature branch from `master`
3. **Make** your changes with clear commit messages
4. **Test** thoroughly on all platforms
5. **Run** code quality checks
6. **Update** documentation if needed

### PR Checklist

- [ ] **Description**: Clear description of changes
- [ ] **Testing**: Tested on all platforms and scenarios
- [ ] **Code Quality**: Passes all linting and type checks
- [ ] **Documentation**: Updated if needed
- [ ] **Breaking Changes**: Documented if any
- [ ] **Related Issues**: Linked if applicable

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add user profile editing functionality
fix: resolve offline sync issue with messages
docs: update GraphQL schema documentation
refactor: reorganize API folder structure
```

## 🐛 Bug Reports

When reporting bugs, please include:

- **Platform**: Android/iOS/Web
- **Architecture**: Legacy/New Architecture
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details**
- **Screenshots/videos** if applicable

## ✨ Feature Requests

When requesting features, please consider:

- **Problem statement**: What problem does it solve?
- **Platform support**: Which platforms should support it?
- **Internationalization**: Does it need Persian/RTL support?
- **Technical impact**: GraphQL/database changes needed?
- **Offline support**: Should it work offline?

## 🌍 Internationalization

Safarnak supports English and Persian (Farsi) with RTL layout:

### Adding Translations

1. **English**: Update `locales/en/translation.json`
2. **Persian**: Update `locales/fa/translation.json`
3. **Usage**: `const { t } = useTranslation(); <Text>{t('key')}</Text>`

### RTL Considerations

- Test layout with Persian language
- Use proper RTL-aware components
- Consider text direction and alignment

## 🔐 Security

### Authentication

- **Password Hashing**: PBKDF2 with 100k iterations
- **Token Generation**: SHA-256 based secure tokens
- **Validation**: Always validate input in resolvers

### Best Practices

- Never commit sensitive data
- Use environment variables for configuration
- Validate all user inputs
- Follow secure coding practices

## 📚 Resources

### Documentation

- [README.md](README.md) - Project overview and setup
- [.cursorrules](.cursorrules) - Development guidelines
- [Architecture Guide](README.md#architecture) - Technical architecture

### External Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [GraphQL Codegen](https://the-guild.dev/graphql/codegen)
- [Drizzle ORM](https://orm.drizzle.team/)
- [React Native New Architecture](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)

## 🆘 Getting Help

- **Issues**: [GitHub Issues](https://github.com/mehotkhan/safarnak.app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mehotkhan/safarnak.app/discussions)
- **Email**: mehotkhan@gmail.com

## 📄 License

By contributing to Safarnak, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Safarnak!** 🌍✨

Together, we're building a better travel companion for everyone.
