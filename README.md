# Safarnak App

A full-stack travel application with a Cloudflare Worker backend and Expo React Native client, featuring unified database schema management and offline-first capabilities.

## ✨ Features

- 🚀 **Cloudflare Worker Backend** - Serverless GraphQL API with real-time subscriptions
- 📱 **Expo React Native Client** - Cross-platform mobile app with offline support
- 🗄️ **Unified Database Schema** - Shared Drizzle ORM setup across client and server
- 🔐 **Authentication System** - Login/register with offline fallback
- 🌐 **Real-time Updates** - GraphQL subscriptions for live data
- 📦 **Monorepo Structure** - Yarn workspaces with shared code
- 🎯 **TypeScript Path Aliases** - Clean imports with `@drizzle/*` and `@graphql/*`

## 🏗️ Project Structure

```
safarnak.app/
├── client/                    # 📱 Expo React Native mobile application
│   ├── app/                  # Expo Router pages (login, tabs)
│   ├── components/           # Reusable UI components
│   ├── db/                   # Database configuration
│   ├── redux/                # Redux store and auth slice
│   ├── api/                  # GraphQL client and queries
│   └── drizzle.config.ts     # Client Drizzle configuration
├── worker/                   # ⚡ Cloudflare Worker backend
│   ├── src/                  # Worker source code
│   ├── drizzle.config.ts     # Worker Drizzle configuration
│   └── wrangler.toml         # Cloudflare Worker configuration
├── drizzle/                  # 🗄️ Shared database schema management
│   ├── schemas/
│   │   ├── shared/          # Common types and utilities
│   │   ├── client/          # Client-specific schema
│   │   └── worker/          # Server-specific schema
│   └── migrations/
│       ├── client/          # Client migration files
│       └── worker/          # Worker migration files
├── graphql/                  # 📊 Shared GraphQL schema and queries
│   ├── schema/              # GraphQL type definitions
│   ├── queries/             # Shared query strings
│   └── types/               # TypeScript type definitions
├── drizzle.config.ts        # Root Drizzle configuration
└── package.json             # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - Required for all development
- **Yarn** - Package manager for workspace management
- **Expo CLI** - For React Native development (`npm install -g @expo/cli`)
- **Wrangler CLI** - For Cloudflare Worker deployment (`npm install -g wrangler`)

### Installation & Setup
```bash
# Clone and install dependencies
git clone <repository-url>
cd safarnak.app
yarn install

# Start development servers
yarn dev  # Starts both client and worker concurrently
```

### First Time Setup
```bash
# Generate database migrations
yarn db:generate

# Apply migrations to both databases
yarn db:migrate

# Start development
yarn dev
```

## 📱 Client (React Native)

The Expo React Native application with offline-first capabilities and modern authentication flow.

### Features
- 🔐 **Authentication System** - Login/register with offline fallback
- 📱 **Tab Navigation** - Home, Tour, Profile tabs for authenticated users
- 💾 **Offline Support** - Local SQLite database with sync capabilities
- 🎨 **Modern UI** - Custom components with theme support
- 🌍 **Internationalization** - Multi-language support

### Commands
```bash
yarn client:start    # Start Expo development server
yarn client:android  # Run on Android device/emulator
yarn client:ios      # Run on iOS device/simulator
yarn client:web      # Run in web browser
```

### Authentication Flow
- **Not logged in**: Shows login screen with register option
- **Logged in**: Shows tabs (Home, Tour, Profile) with user data
- **Offline mode**: Works without internet connection
- **State management**: Redux store with persistence

### Database
- **Type**: SQLite (Expo SQLite)
- **Schema**: Users table (id, name, email)
- **Migrations**: Handled automatically by Expo SQLite

## ⚡ Worker (Cloudflare Backend)

GraphQL API server with real-time subscriptions using Cloudflare Workers.

### Commands
```bash
yarn worker:dev          # Start local development server
yarn worker:deploy       # Deploy to Cloudflare
yarn worker:db:generate  # Generate database migrations
yarn worker:db:migrate   # Apply migrations to local D1
yarn worker:db:migrate:prod # Apply migrations to production D1
yarn worker:db:studio    # Open Drizzle Studio
```

### Database
- **Type**: Cloudflare D1 (SQLite-compatible)
- **Schema**: Users (with auth), Messages, Subscriptions
- **Features**: Password hashing, real-time subscriptions

## 🎯 TypeScript Path Aliases

The project uses TypeScript path aliases for clean, maintainable imports across both client and worker.

### Available Aliases

| Alias | Path | Description |
|-------|------|-------------|
| `@drizzle/*` | `../drizzle/*` | Shared database schemas and migrations |
| `@graphql/*` | `../graphql/*` | Shared GraphQL schema and queries |
| `@/*` | `./*` | Client-specific files (client only) |

### Usage Examples

**Before (relative paths):**
```typescript
import { users } from '../../drizzle/schemas/client';
import { typeDefs } from '../../graphql/schema/schema';
```

**After (with aliases):**
```typescript
import { users } from '@drizzle/schemas/client';
import { typeDefs } from '@graphql/schema/schema';
```

### Configuration

- **Client**: `client/tsconfig.json` + `client/metro.config.js`
- **Worker**: `worker/tsconfig.json`
- **IDE Support**: Full autocomplete and IntelliSense
- **Type Safety**: TypeScript understands all path mappings

### Benefits

- ✅ **Cleaner imports** - No more `../../` relative paths
- ✅ **Better maintainability** - Easy to refactor folder structure  
- ✅ **Consistent across projects** - Same aliases work in both client and worker
- ✅ **IDE support** - Full autocomplete and IntelliSense
- ✅ **Type safety** - TypeScript understands the path mappings

## 🗄️ Database Management

### Unified Schema System

The project uses a shared Drizzle ORM setup with environment-specific schemas:

- **Shared**: Common types and utilities
- **Client**: Simple users table for offline sync
- **Worker**: Extended users table + messages + subscriptions

### Database Commands

#### Generate Migrations
```bash
yarn db:generate           # Generate migrations for both client and worker
yarn db:generate:worker    # Generate only worker migrations
yarn db:generate:client    # Generate only client migrations
```

#### Apply Migrations
```bash
yarn db:migrate           # Apply migrations to both databases
yarn db:migrate:worker     # Apply only worker migrations
yarn db:migrate:client     # Info about client migrations
```

#### Database Studio
```bash
yarn db:studio            # Open Drizzle Studio for database inspection
```

#### Purge Commands
```bash
yarn db:purge             # Clear migrations, databases, and caches
yarn db:purge:all         # Complete purge including workspace caches
yarn db:purge:migrations  # Clear only migration files
yarn db:purge:worker      # Clear only worker database and cache
yarn db:purge:client      # Clear only client database files
yarn db:purge:cache       # Clear only node modules cache
```

## 🛠️ Development Workflow

### Starting Development
```bash
# Start both client and worker
yarn dev

# Or start individually
yarn worker:dev    # Backend only
yarn client:start   # Frontend only
```

### Database Changes
```bash
# 1. Make schema changes in drizzle/schemas/
# 2. Generate migrations
yarn db:generate

# 3. Apply migrations
yarn db:migrate

# 4. Inspect database (optional)
yarn db:studio
```

### Clean Slate Development
```bash
# Clear everything and start fresh
yarn db:purge:all
yarn db:generate
yarn db:migrate
```

## 📦 Workspace Commands

### Root Level
```bash
yarn dev              # Start both services concurrently
yarn build            # Build both client and worker
yarn db:generate      # Generate migrations for both
yarn db:migrate       # Apply migrations to both
yarn db:purge         # Clear all database files
```

### Worker Specific
```bash
yarn worker:dev       # Start worker development server
yarn worker:deploy    # Deploy to Cloudflare
yarn worker:db:*      # Worker database operations
```

### Client Specific
```bash
yarn client:start     # Start Expo development server
yarn client:android  # Run on Android
yarn client:ios      # Run on iOS
yarn client:web      # Run on web
```

## 🔧 Configuration

### Environment Variables
- **Worker**: Configure in `worker/wrangler.toml`
- **Client**: Configure in `client/app.json` and environment files

### Database Configuration
- **Root**: `drizzle.config.ts` - Server schema generation
- **Client**: `client/drizzle.config.ts` - Client schema (Expo SQLite)
- **Worker**: `worker/drizzle.config.ts` - Worker schema (Cloudflare D1)

## 📚 Tech Stack

### Backend (Worker)
- **Runtime**: Cloudflare Workers (serverless)
- **API**: GraphQL with Yoga Server
- **Database**: Cloudflare D1 (SQLite-compatible)
- **ORM**: Drizzle ORM with type-safe queries
- **Subscriptions**: GraphQL Workers Subscriptions
- **Authentication**: Password hashing with bcrypt

### Frontend (Client)
- **Framework**: Expo React Native (cross-platform)
- **Navigation**: Expo Router (file-based routing)
- **State**: Redux Toolkit with persistence
- **Database**: Expo SQLite (offline-first)
- **ORM**: Drizzle ORM (shared with backend)
- **UI**: Custom components with theme support
- **Internationalization**: react-i18next

### Shared Architecture
- **Database**: Drizzle ORM with SQLite (unified schema)
- **TypeScript**: Full type safety across client/server
- **Package Manager**: Yarn Workspaces (monorepo)
- **Path Aliases**: Clean imports with `@drizzle/*` and `@graphql/*`
- **Code Sharing**: Shared schemas, types, and GraphQL definitions

## 🚀 Deployment

### Worker Deployment
```bash
yarn worker:deploy
```

### Client Deployment
```bash
# Android
yarn client:android

# iOS
yarn client:ios

# Web
yarn client:web
```

## 🤝 Contributing

### Development Workflow
1. **Make schema changes** in `drizzle/schemas/`
2. **Generate migrations**: `yarn db:generate`
3. **Apply migrations**: `yarn db:migrate`
4. **Test both services**: `yarn dev`
5. **Deploy worker**: `yarn worker:deploy`

### Code Style
- Use TypeScript path aliases (`@drizzle/*`, `@graphql/*`)
- Follow existing patterns for database schemas
- Test both online and offline authentication flows
- Ensure type safety across client and worker

## 🔧 Troubleshooting

### Common Issues

**Database Migration Errors**
```bash
# Clear everything and start fresh
yarn db:purge:all
yarn db:generate
yarn db:migrate
```

**Metro Bundler Issues**
```bash
# Clear Metro cache
yarn client:start --clear
```

**Worker Development Issues**
```bash
# Restart worker with fresh database
yarn worker:dev --compatibility-date=2023-05-18
```

**Path Alias Not Working**
- Ensure `tsconfig.json` has correct paths configuration
- For client: check `metro.config.js` has `extraNodeModules`
- Restart TypeScript server in your IDE

### Getting Help
- Check the [Issues](https://github.com/your-repo/issues) page
- Review the database schema in `drizzle/schemas/`
- Test with `yarn db:studio` to inspect database state