# Safarnak App

A modern full-stack travel application built with Expo React Native and Cloudflare Workers, featuring offline-first capabilities, real-time updates, and cross-platform support. The name "Safarnak" derives from Persian/Farsi, meaning "travel" or "journey."

## ✨ Key Features

- 🚀 **Serverless Backend** - Cloudflare Workers with GraphQL API and real-time subscriptions
- 📱 **Cross-Platform Client** - Expo React Native app for iOS, Android, and Web
- 🔐 **Secure Authentication** - PBKDF2 password hashing with offline fallback
- 💾 **Offline-First Design** - Local SQLite database with automatic sync
- 🌐 **Real-time Updates** - GraphQL subscriptions for live data synchronization
- 🗄️ **Unified Database Schema** - Shared Drizzle ORM across client and server
- 🌍 **Internationalization** - English and Persian (Farsi) with RTL support
- 🎨 **Modern UI** - Custom components with theme support
- 📦 **Monorepo Architecture** - Yarn workspaces with shared code and types
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

Before you begin, ensure you have the following installed:

- **Node.js 18+** - Required for all development
- **Yarn** - Package manager for workspace management
- **Expo CLI** - For React Native development (`npm install -g @expo/cli`)
- **Wrangler CLI** - For Cloudflare Worker deployment (`npm install -g wrangler`)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd safarnak.app
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up databases**
   ```bash
   # Generate database migrations
   yarn db:generate
   
   # Apply migrations to both databases
   yarn db:migrate
   ```

4. **Start development servers**
   ```bash
   yarn dev  # Starts both client and worker concurrently
   ```

### First Time Setup

For a complete fresh setup:

```bash
# Clear everything and start fresh
yarn db:purge:all

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

### App Navigation Flow

**Unauthenticated State:**
- Shows login screen with register option
- Secure authentication with PBKDF2 password hashing
- Offline fallback for authentication

**Authenticated State:**
- **Home Tab**: Interactive map with GPS location services using Leaflet
- **Tour Tab**: Placeholder for tour discovery (in development)
- **Profile Tab**: Placeholder for user profile management (in development)

**Offline Capabilities:**
- Works without internet connection
- Local SQLite database for data persistence
- Automatic sync when online
- Redux store with persistence

### Database
- **Type**: SQLite (Expo SQLite)
- **Schema**: Users table (id, name, username)
- **Migrations**: Handled automatically by Expo SQLite
- **Offline Sync**: Automatic synchronization when online

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
- **Features**: PBKDF2 password hashing, real-time subscriptions, secure token generation

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

**Start both services:**
```bash
yarn dev  # Starts both client and worker concurrently
```

**Start individually:**
```bash
yarn worker:dev    # Backend only (GraphQL API)
yarn client:start  # Frontend only (Expo app)
```

### Database Changes

When modifying database schemas:

1. **Make schema changes** in `drizzle/schemas/`
2. **Generate migrations**: `yarn db:generate`
3. **Apply migrations**: `yarn db:migrate`
4. **Inspect database** (optional): `yarn db:studio`

### Clean Slate Development

For a fresh start:
```bash
# Clear everything and start fresh
yarn db:purge:all
yarn db:generate
yarn db:migrate
yarn dev
```

### Testing Authentication Flow

1. **Start the app**: `yarn dev`
2. **Open client**: Navigate to `http://localhost:8081` (Expo)
3. **Test registration**: Create a new account
4. **Test login**: Login with existing credentials
5. **Test offline**: Disconnect network and verify offline functionality

## 📊 Current Implementation Status

### ✅ Completed Features

- **Authentication System** - Complete login/register with offline support
- **Database Architecture** - Unified Drizzle ORM setup with migrations
- **GraphQL API** - Full backend with subscriptions and real-time messaging
- **State Management** - Redux Toolkit with persistence and offline middleware
- **Internationalization** - English and Persian (Farsi) with RTL support
- **Location Services** - Interactive map with Leaflet and GPS integration
- **Theme System** - Light/dark mode with custom components
- **Offline-First Design** - Local SQLite with automatic sync
- **Security** - PBKDF2 password hashing and secure token generation

### 🔄 In Progress / Placeholder

- **Tour Discovery** - Tour tab is currently a placeholder
- **Profile Management** - Profile tab needs implementation
- **Real-time Messaging** - Basic implementation exists, needs enhancement
- **Payment Integration** - Not yet implemented
- **Push Notifications** - Not yet implemented

### 🚀 Planned Features

- **Enhanced Tour Features** - Advanced tour discovery and booking
- **Social Features** - User reviews and recommendations
- **AI Recommendations** - Machine learning-powered suggestions
- **AR Integration** - Augmented reality tour previews
- **Multi-language Expansion** - Support for additional languages

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
- **Authentication**: PBKDF2 password hashing with Web Crypto API

### Frontend (Client)
- **Framework**: Expo React Native v54 (cross-platform)
- **Navigation**: Expo Router (file-based routing)
- **State**: Redux Toolkit with persistence
- **Database**: Expo SQLite (offline-first)
- **ORM**: Drizzle ORM (shared with backend)
- **UI**: Custom components with theme support
- **Internationalization**: react-i18next (English/Persian)
- **Location**: Expo Location with Leaflet maps

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

# Or restart with clean cache
yarn dev:clean
```

**Worker Development Issues**
```bash
# Restart worker with fresh database
yarn worker:dev --compatibility-date=2023-05-18

# Check worker logs
yarn worker:dev --local
```

**Path Alias Not Working**
- Ensure `tsconfig.json` has correct paths configuration
- For client: check `metro.config.js` has `extraNodeModules`
- Restart TypeScript server in your IDE
- Clear Metro cache: `yarn client:start --clear`

**Authentication Issues**
- Check if both client and worker are running
- Verify database migrations are applied: `yarn db:migrate`
- Test with fresh user registration
- Check network connectivity for GraphQL requests

**Location Services Not Working**
- Ensure location permissions are granted
- Test on physical device (location services don't work in simulator)
- Check Expo Location configuration in `app.json`

### Getting Help

- **Database Issues**: Use `yarn db:studio` to inspect database state
- **Schema Problems**: Review `drizzle/schemas/` for schema definitions
- **GraphQL Issues**: Check `graphql/schema/schema.ts` for API definitions
- **Client Issues**: Review `client/app/` for navigation structure
- **Worker Issues**: Check `worker/src/index.ts` for API implementation

## 🏆 Architecture Highlights

### Offline-First Design
- **Local SQLite Database**: Full offline functionality with Expo SQLite
- **Redux Persistence**: State persistence across app restarts
- **Automatic Sync**: Seamless synchronization when online
- **Graceful Degradation**: App works without internet connection

### Security & Performance
- **PBKDF2 Password Hashing**: 100,000 iterations with secure salt
- **Web Crypto API**: Native browser/Node.js crypto for token generation
- **Serverless Architecture**: Auto-scaling Cloudflare Workers
- **Edge Computing**: Global CDN distribution for optimal performance

### Developer Experience
- **TypeScript Path Aliases**: Clean imports with `@drizzle/*` and `@graphql/*`
- **Unified Schema**: Shared Drizzle ORM across client and server
- **Monorepo Structure**: Yarn workspaces with shared code
- **Hot Reloading**: Fast development with Expo and Wrangler

### Modern Tech Stack
- **React Native 0.81.5**: Latest stable version with Expo 54
- **GraphQL**: Type-safe API with real-time subscriptions
- **Drizzle ORM**: Type-safe database operations
- **Redux Toolkit**: Modern state management patterns

---

## 🎯 Project Vision

**Safarnak** aims to revolutionize travel discovery by providing a seamless, offline-first experience that works anywhere in the world. Built with modern technologies and a focus on user experience, the app combines the power of serverless architecture with the reliability of local data storage.

### Core Principles
- **Offline-First**: Works without internet connection
- **Cross-Platform**: Native experience on iOS, Android, and Web
- **Real-time**: Live updates and notifications
- **Secure**: Enterprise-grade security and privacy
- **Scalable**: Serverless architecture that grows with users

### Target Users
- **Travelers**: Discover and book tours worldwide
- **Tour Operators**: Manage and promote their services
- **Travel Enthusiasts**: Share experiences and recommendations

---

*Built with ❤️ using Expo React Native, Cloudflare Workers, and modern web technologies.*