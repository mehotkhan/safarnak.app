# 🌍 Safarnak

> **سفرناک** - A modern offline-first travel companion built with Expo React Native and Cloudflare Workers

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-green)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54-purple)](https://expo.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![GraphQL Codegen](https://img.shields.io/badge/GraphQL-Codegen-purple)](https://the-guild.dev/graphql/codegen)
[![New Architecture](https://img.shields.io/badge/New%20Architecture-Enabled-green)](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Version](https://img.shields.io/badge/Version-0.5.0-blue)](https://github.com/mehotkhan/safarnak.app/releases)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Passing-green)](https://github.com/mehotkhan/safarnak.app/actions)

**Live Demo**: [safarnak.mohet.ir](https://safarnak.mohet.ir) | **Download APK**: [Latest Release](https://github.com/mehotkhan/safarnak.app/releases)

## ✨ Key Features

- **🌐 Offline-First** - Works seamlessly without internet connection
- **⚡ Real-Time** - GraphQL subscriptions for live updates
- **📱 Cross-Platform** - iOS, Android, and Web support
- **🌍 Bilingual** - English and Persian (Farsi) with RTL support
- **🔐 Secure** - PBKDF2 password hashing with token-based authentication
- **🎨 Modern UI** - Custom components with dark mode support
- **📊 Type-Safe** - Full TypeScript coverage with auto-generated GraphQL types
- **🚀 Performance** - React Native New Architecture (Fabric + TurboModules)
- **🔄 Auto-Generated** - GraphQL Codegen for type-safe client-server communication

## 🔧 Environment Variables

The app uses environment variables for configuration. Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

### Available Variables

- `GRAPHQL_URL` - Production GraphQL endpoint (default: `https://safarnak.mohet.ir/graphql`)
- `GRAPHQL_URL_DEV` - Development GraphQL endpoint (default: `http://192.168.1.51:8787/graphql`)
- `APP_NAME` - Application name
- `APP_SCHEME` - Deep linking scheme
- `BUNDLE_IDENTIFIER` - App bundle identifier
- `NEW_ARCH` - Force enable New Architecture (`1` or `true`)

### Environment Priority

1. **EAS Build Variables** - Set in `eas.json` for builds
2. **Process Environment** - From `.env` file
3. **Hardcoded Fallbacks** - Development/production defaults

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Yarn package manager
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

```bash
# Clone the repository
git clone https://github.com/mehotkhan/safarnak.app.git
cd safarnak.app

# Install dependencies
yarn install

# Apply database migrations
yarn db:migrate

# Generate GraphQL types and hooks
yarn codegen

# Start development server (both client & worker)
yarn dev
```

### Development Commands

```bash
# Start services separately
yarn worker:dev  # Cloudflare Worker (port 8787)
yarn start       # Expo dev server (port 8081)

# Run on devices
yarn android     # Android (Legacy Architecture)
yarn android:newarch  # Android (New Architecture)
yarn ios         # iOS (macOS only)
yarn web         # Web browser

# GraphQL Codegen
yarn codegen     # Generate types and hooks
yarn codegen:watch # Watch mode for development
```

## 🏗️ Architecture

Safarnak uses a **unified single-root monorepo** architecture with **perfect separation** between client and server code:

```
┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│   React Native      │       │  Cloudflare Worker  │       │   SQLite/D1 DB      │
│   Client App        │◄─────►│   GraphQL API       │◄─────►│   Drizzle ORM       │
│                     │       │                     │       │                     │
│ • Expo Router       │       │ • GraphQL Yoga      │       │ • Shared Schema     │
│ • Redux + Persist   │       │ • Subscriptions     │       │ • Migrations        │
│ • Apollo Client     │       │ • Resolvers         │       │ • Type Safety       │
│ • Auto-Generated    │       │ • Auth Middleware   │       │                     │
│ • Offline SQLite    │       │ • Root Redirect     │       │                     │
└─────────────────────┘       └─────────────────────┘       └─────────────────────┘
```

### 🎯 Perfect Separation

- **📁 GraphQL Folder**: Shared schema and query definitions only
- **📁 API Folder**: All client-specific code including auto-generated hooks
- **📁 Worker Folder**: All server-specific resolvers and logic

## 📁 Project Structure

```
safarnak.app/
├── worker/                    # ⚡ Cloudflare Worker (server-side only)
│   ├── index.ts              # Worker entry point + resolver exports
│   ├── types.ts              # Server-specific types
│   ├── queries/               # Query resolvers (getMessages, me)
│   ├── mutations/            # Mutation resolvers (register, login, addMessage)
│   ├── subscriptions/        # Subscription resolvers (newMessages)
│   └── utilities/            # Password hashing, token generation
├── graphql/                   # 📡 Shared GraphQL (client & worker)
│   ├── schema.graphql        # Pure GraphQL schema definition
│   ├── queries/              # Query definitions (.graphql files)
│   │   ├── addMessage.graphql
│   │   ├── getMessages.graphql
│   │   ├── login.graphql
│   │   ├── me.graphql
│   │   └── register.graphql
│   ├── generated/
│   │   └── schema.d.ts       # Worker schema declarations
│   ├── schema-loader.ts      # Worker schema loader
│   └── index.ts              # Shared exports only
├── api/                       # 🌐 Client API layer (CLIENT-SIDE ONLY)
│   ├── client.ts             # Apollo Client setup with auth link
│   ├── hooks.ts              # 🤖 Auto-generated React Apollo hooks (queries, mutations, subscriptions)
│   ├── types.ts              # 🤖 Auto-generated GraphQL types
│   ├── api-types.ts          # API-specific types (ApiError, ApiResponse)
│   ├── utils.ts              # Client utility functions (storage, error handling, network checks)
│   └── index.ts              # Main API exports (re-exports all hooks and utilities)
├── drizzle/                   # 🗄️ Database layer (shared)
│   ├── schema.ts             # Database schema (users, messages, tours)
│   └── migrations/           # SQL migration files
├── store/                     # 📦 Redux state management
│   ├── index.ts              # Store configuration with persist
│   ├── hooks.ts              # Typed Redux hooks
│   ├── slices/               # Redux slices
│   │   ├── authSlice.ts      # Authentication state
│   │   └── themeSlice.ts     # Theme state
│   └── middleware/           # Redux middleware
│       └── offlineMiddleware.ts # Offline queue handling
├── app/                       # 📱 Expo Router pages
│   ├── _layout.tsx           # Root layout with providers
│   ├── auth/                  # 🔐 Authentication pages
│   │   ├── _layout.tsx      # Auth routing layout
│   │   ├── login.tsx        # Login page
│   │   └── register.tsx     # Registration page
│   └── (tabs)/               # Tab navigation
│       ├── index.tsx         # Home/Map screen
│       ├── tour.tsx          # Tours screen
│       └── profile.tsx       # User profile
├── components/                # 🎨 UI Components
│   ├── AuthWrapper.tsx       # Authentication guard
│   ├── MapView.tsx          # Interactive map component
│   ├── context/              # React contexts
│   │   ├── LanguageContext.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ThemeContext.tsx
│   └── ui/                   # Themed UI components
│       ├── Themed.tsx
│       ├── ThemeToggle.tsx
│       ├── CustomText.tsx
│       └── ...
├── constants/                 # 📋 App constants
│   ├── app.ts                # App configuration
│   ├── Colors.ts             # Theme colors
│   └── index.ts              # Constants exports
├── hooks/                     # 🪝 Custom React hooks
├── locales/                   # 🌍 i18n translations (en, fa)
├── metro.config.js            # Metro bundler config
├── wrangler.toml              # Cloudflare Workers config
├── drizzle.config.ts          # Database configuration
├── codegen.yml                # GraphQL Codegen configuration
├── eslint.config.mjs          # ESLint flat config
├── app.config.js              # Expo configuration
└── tsconfig.json              # TypeScript configuration
```

## 🛠️ Tech Stack

### Frontend

| Technology        | Version | Purpose                |
| ----------------- | ------- | ---------------------- |
| **Expo**          | ~54.0.19| React Native framework |
| **React Native**  | 0.81.5  | Mobile UI framework    |
| **React**         | 19.1.0  | UI library            |
| **Expo Router**   | ~6.0.13 | File-based navigation  |
| **Redux Toolkit** | ^2.9.2  | State management       |
| **Redux Persist** | ^6.0.0  | State persistence      |
| **Apollo Client** | 3.8.0   | GraphQL client         |
| **react-i18next** | ^16.1.5 | Internationalization   |
| **Drizzle ORM**   | ^0.44.6 | Client-side SQLite     |

### Backend

| Technology                        | Version | Purpose                 |
| --------------------------------- | ------- | ----------------------- |
| **Cloudflare Workers**            | Latest  | Serverless runtime      |
| **GraphQL Yoga**                  | ^5.16.0 | GraphQL server          |
| **Cloudflare D1**                 | Latest  | SQLite database         |
| **Drizzle ORM**                   | ^0.44.6 | Type-safe ORM           |
| **Wrangler**                      | ^4.43.0 | Cloudflare CLI          |
| **graphql-workers-subscriptions** | ^0.1.6  | Real-time subscriptions |

### Code Generation

| Technology                  | Version | Purpose                        |
| --------------------------- | ------- | ------------------------------ |
| **GraphQL Codegen**         | ^6.0.1  | Auto-generate TypeScript types |
| **typescript-operations**   | ^5.0.2  | Generate operation types       |
| **typescript-react-apollo** | ^4.3.3  | Generate React Apollo hooks    |

### Shared

| Technology     | Version | Purpose                            |
| -------------- | ------- | ---------------------------------- |
| **TypeScript** | ~5.9    | Type safety with enhanced checking |
| **ESLint**     | ^9.38   | Code linting                       |
| **Prettier**   | ^3.6    | Code formatting                    |

## 📋 Available Scripts

### Development

```bash
yarn dev              # Start both worker and client concurrently
yarn start            # Start Expo dev server only
yarn worker:dev       # Start Cloudflare Worker only
yarn android          # Run on Android (Legacy Architecture)
yarn android:newarch  # Run on Android (New Architecture)
yarn ios              # Run on iOS
yarn web              # Run on web
```

### GraphQL Codegen

```bash
yarn codegen          # Generate types and hooks from GraphQL schema
yarn codegen:watch    # Watch mode for development
```

### Database

```bash
yarn db:generate      # Generate migrations from schema
yarn db:migrate       # Apply migrations to local D1
yarn db:studio        # Open Drizzle Studio (port 4983)
```

### Code Quality

```bash
yarn lint             # Run ESLint with developer-friendly rules
yarn lint:fix         # Fix ESLint issues automatically
yarn format           # Format code with Prettier (optional)
```

**ESLint Configuration:**
- **Developer Friendly**: Disabled strict rules that hinder development
- **TypeScript Support**: Full TypeScript integration with relaxed rules
- **React Native Optimized**: Disabled accessibility rules not applicable to mobile
- **Flexible**: Allows `any` type and `@ts-ignore` comments for development

### Build

```bash
yarn build:debug      # Build debug APK with EAS
yarn build:release    # Build release APK with EAS
yarn build:local      # Build release APK locally
```

### Utilities

```bash
yarn clean            # Clear all caches and build artifacts
```

## 🔧 Configuration

### Path Aliases

TypeScript and Metro are configured with the following path aliases:

```typescript
"@/*"           → "./*"              // Root files
"@components/*" → "./components/*"   // UI components
"@graphql/*"    → "./graphql/*"      // Shared GraphQL
"@drizzle/*"    → "./drizzle/*"      // Database schema
"@worker/*"     → "./worker/*"       // Worker resolvers
```

### TypeScript Configuration

The project uses a balanced TypeScript configuration for development efficiency:

```json
{
  "strict": true,
  "noUnusedLocals": false,        // Disabled for easier development
  "noUnusedParameters": false,    // Disabled for easier development
  "noImplicitReturns": true,      // Ensures functions return values
  "noFallthroughCasesInSwitch": true, // Prevents switch fallthrough bugs
  "noUncheckedIndexedAccess": false,  // Disabled for easier development
  "exactOptionalPropertyTypes": false, // Disabled for easier development
  "noImplicitOverride": true,     // Ensures proper override usage
  "allowUnusedLabels": false,     // Prevents unreachable code
  "allowUnreachableCode": false   // Prevents unreachable code
}
```

**Configuration Philosophy:**
- **Strict Core**: Maintains type safety with `strict: true`
- **Developer Friendly**: Disables overly strict rules that hinder development
- **Essential Safety**: Keeps important rules like `noImplicitReturns` and `noFallthroughCasesInSwitch`

### GraphQL Codegen Configuration

Auto-generates TypeScript types and React Apollo hooks:

```yaml
schema: './graphql/schema.graphql'
documents: './graphql/queries/*.graphql'
generates:
  ./api/types.ts: # Base GraphQL types
    plugins: [typescript]
  ./api/hooks.ts: # React Apollo hooks
    plugins: [typescript-operations, typescript-react-apollo]
  ./graphql/generated/schema.d.ts: # Worker schema declarations
    plugins: [typescript-graphql-files-modules]
```

### New Architecture Configuration

The app supports React Native's New Architecture (Fabric + TurboModules):

```javascript
// In app.config.js
newArchEnabled: process.env.NEW_ARCH === '1' ||
  process.env.NEW_ARCH === 'true' ||
  isDebug ||
  isDevelopment;
```

**Benefits:**

- Faster app startup
- Smoother animations
- Better memory usage
- Future-proofing

**Usage:**

```bash
# Enable New Architecture
yarn android:newarch
# or
NEW_ARCH=1 yarn android
```

## 🗄️ Database Schema

The app uses a unified SQLite schema managed by Drizzle ORM:

- **users** - User accounts with authentication
- **messages** - Real-time messaging
- **tours** - Travel tour listings
- **subscriptions** - GraphQL subscription management

Migrations are stored in `drizzle/migrations/` and applied automatically.

## 🔐 Authentication

- **Password Hashing**: PBKDF2 with 100,000 iterations
- **Token Generation**: SHA-256 based secure tokens
- **Offline Support**: Credentials cached in AsyncStorage
- **Token Storage**: Redux persist + AsyncStorage

## 🌍 Internationalization

Supports English and Persian (Farsi) with automatic RTL layout:

```typescript
// Change language
import { useTranslation } from 'react-i18next';
const { t, i18n } = useTranslation();
await i18n.changeLanguage('fa'); // or 'en'
```

## 📱 Offline-First Architecture

1. **Client-Side SQLite** - Expo SQLite for local data storage
2. **Redux Persist** - State persistence across app restarts
3. **Offline Queue** - Mutations queued when offline
4. **Sync on Reconnect** - Automatic sync when connection restored

## 🔄 GraphQL Codegen Workflow

The project uses GraphQL Codegen for type-safe client-server communication:

### 1. Define Schema

```graphql
# graphql/schema.graphql
type User {
  id: ID!
  name: String!
  username: String!
}

type AuthPayload {
  user: User!
  token: String!
}
```

### 2. Define Operations

```graphql
# graphql/queries/login.graphql
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    user {
      id
      name
      username
    }
    token
  }
}
```

### 3. Generate Types & Hooks

```bash
yarn codegen
```

### 4. Use Generated Code

```typescript
// Import directly from api/ - all hooks and types available
import { useLoginMutation, useMeQuery, useAddMessageMutation } from '@/api';

const [loginMutation] = useLoginMutation();
const { data } = useMeQuery();
```

## 📱 Download APK

Get the latest release directly from GitHub:

[![Download APK](https://img.shields.io/badge/Download-APK-green?style=for-the-badge)](https://github.com/mehotkhan/safarnak.app/releases/latest)

### Installation Instructions

1. Download the APK from the latest release
2. Enable "Install from unknown sources" in Android settings
3. Install the APK file
4. Launch Safarnak and start exploring!

## 🚀 Deployment

### Deploy Worker

```bash
yarn worker:deploy
```

### Build Mobile App

```bash
# Configure EAS (first time only)
eas login
eas build:configure

# Build for Android
yarn build:release
```

### Automated Builds

- **GitHub Actions**: Automatically builds APK on every push to master
- **Releases**: APK automatically uploaded to GitHub Releases
- **Artifacts**: Build artifacts available for 30 days

## 🧪 Development Tips

1. **Metro Cache Issues**: Run `yarn clean` if you encounter bundling errors
2. **Database Reset**: Delete `.wrangler/state/v3/d1/` and run `yarn db:migrate`
3. **Worker Logs**: Check terminal where `yarn worker:dev` is running
4. **Type Errors**: Ensure both client and worker are using shared types from `graphql/`
5. **New Architecture**: Use `yarn android:newarch` to test with Fabric + TurboModules
6. **Worker Root**: Visit `http://127.0.0.1:8787/` - redirects to `/graphql`
7. **GraphQL Changes**: Run `yarn codegen` after modifying schema or operations
8. **TypeScript Errors**: Use `any` type or `@ts-ignore` when needed for development
9. **ESLint Issues**: Most strict rules are disabled for easier development
10. **Pre-commit Hooks**: TypeScript and ESLint checks run automatically on commit

## 📝 Code Style

- **ESLint**: Developer-friendly config with TypeScript, React, and React Native rules
- **Prettier**: Single quotes, no semicolons, trailing commas (optional formatting)
- **TypeScript**: Balanced configuration prioritizing development efficiency
- **Imports**: Use path aliases (`@/`, `@components/`, `@graphql/`)
- **GraphQL**: Use `.graphql` files for operations, auto-generate types

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/safarnak.app.git`
3. Install dependencies: `yarn install`
4. Apply migrations: `yarn db:migrate`
5. Generate GraphQL types: `yarn codegen`
6. Start development: `yarn dev`

### Code Standards

- Follow existing code style and patterns
- Use path aliases (`@/`, `@components/`, `@graphql/`)
- **Import from `api/` directly**: `import { useLoginMutation } from '@/api'`
- Run `yarn lint:fix` before committing
- Ensure TypeScript types are correct
- Test both online and offline scenarios
- Test both Legacy and New Architecture
- Update GraphQL schema and operations as needed
- **Always run `yarn codegen` after GraphQL changes**

### Pull Request Process

1. Create a feature branch from `master`
2. Make your changes with clear commit messages
3. Test thoroughly on both platforms
4. Submit a pull request with a clear description
5. Ensure all CI checks pass

## 📄 License

MIT

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)
- [GraphQL Codegen](https://the-guild.dev/graphql/codegen)
- [React Navigation](https://reactnavigation.org/)
- [React Native New Architecture](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)

---

Built with ❤️ using Expo, Cloudflare Workers, and GraphQL Codegen
