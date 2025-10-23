# Safarnak App

A full-stack application with a Cloudflare Worker backend and Expo React Native client, featuring a unified database schema management system.

## 🏗️ Project Structure

```
safarnak.app/
├── client/                    # Expo React Native mobile application
│   ├── app/                  # Expo Router pages
│   ├── components/           # Reusable UI components
│   ├── db/                   # Database configuration (legacy)
│   ├── drizzle.config.ts     # Client Drizzle configuration
│   └── package.json          # Client dependencies
├── worker/                   # Cloudflare Worker backend
│   ├── src/                  # Worker source code
│   ├── drizzle.config.ts     # Worker Drizzle configuration
│   └── package.json          # Worker dependencies
├── drizzle/                  # 🆕 Shared database schema management
│   ├── schemas/
│   │   ├── shared/          # Common types and utilities
│   │   ├── client/          # Client-specific schema
│   │   └── worker/          # Server-specific schema
│   └── migrations/
│       ├── client/          # Client migration files
│       └── worker/          # Worker migration files
├── drizzle.config.ts        # Root Drizzle configuration
└── package.json             # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Yarn package manager
- Expo CLI (for mobile development)
- Wrangler CLI (for Cloudflare Worker)

### Installation
```bash
# Install all dependencies
yarn install

# Start both services
yarn dev
```

## 📱 Client (React Native)

The Expo React Native application with offline-first capabilities.

### Commands
```bash
yarn client:start    # Start Expo development server
yarn client:android  # Run on Android device/emulator
yarn client:ios      # Run on iOS device/simulator
yarn client:web      # Run in web browser
```

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
- **Runtime**: Cloudflare Workers
- **API**: GraphQL with Yoga
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Subscriptions**: GraphQL Workers Subscriptions

### Frontend (Client)
- **Framework**: Expo React Native
- **Navigation**: Expo Router
- **State**: Redux Toolkit
- **Database**: Expo SQLite
- **ORM**: Drizzle ORM
- **UI**: Gluestack UI

### Shared
- **Database**: Drizzle ORM with SQLite
- **TypeScript**: Full type safety
- **Package Manager**: Yarn Workspaces

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

1. Make schema changes in `drizzle/schemas/`
2. Generate migrations: `yarn db:generate`
3. Apply migrations: `yarn db:migrate`
4. Test both client and worker: `yarn dev`
5. Deploy: `yarn worker:deploy`

## 📝 Notes

- Client and worker use separate migration folders to avoid conflicts
- Client database is handled automatically by Expo SQLite
- Worker database requires manual migration with Wrangler
- Use `yarn db:purge` to clear all database data for testing