# 🌍 Safarnak

> **سفرناک** - A modern offline-first travel companion built with Expo React Native and Cloudflare Workers

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-green)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54-purple)](https://expo.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![GraphQL Codegen](https://img.shields.io/badge/GraphQL-Codegen-purple)](https://the-guild.dev/graphql/codegen)
[![New Architecture](https://img.shields.io/badge/New%20Architecture-Enabled-green)](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.13.0-blue)](https://github.com/mehotkhan/safarnak.app/releases)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Passing-green)](https://github.com/mehotkhan/safarnak.app/actions)

**Live Demo**: [safarnak.app](https://safarnak.app) | **Download APK**: [Latest Release](https://github.com/mehotkhan/safarnak.app/releases)

---

## Table of Contents
- [What is This?](#-what-is-this)
- [Architecture Overview](#-architecture-overview)
- [Quick Start](#-quick-start)
- [Codebase Structure](#-codebase-structure)
- [Routing & URLs](#-routing--urls)
- [Database Model](#-database-model-er-diagram)
- [How to Add New Features](#-how-to-add-new-features)
- [Configuration](#-configuration)
- [Common Commands](#-common-commands)
- [Technology Stack](#-technology-stack)
- [Development Tips](#-development-tips)
- [Authentication Flow](#-authentication-flow)
- [Internationalization](#-internationalization)
- [Key Concepts](#-key-concepts)
- [Offline-First Architecture](#-offline-first-architecture)
- [Technical Review & Checklist (Summary)](#-technical-review--checklist-summary)
- [Contributing](#-contributing)
- [Code of Conduct](#-code-of-conduct)
- [Suggested Improvements](#-suggested-improvements)
- [License](#-license)
- [Resources](#-resources)

## 📚 What is This?

**Safarnak** (سفرناک) is a full‑stack, offline‑first travel companion. It helps users discover destinations, plan trips, and share experiences. The project is a single‑root monorepo with a clean separation of concerns and shared types across client and server.

### Highlights

- **Offline‑first by design**: Automatic Apollo → Drizzle sync via `DrizzleCacheStorage` on every cache write. Works seamlessly offline with SQL queries over cached data.
- **Shared GraphQL + Codegen**: One schema in `graphql/` powers both the Worker and the client. Codegen produces strongly‑typed hooks in `api/`.
- **Unified Drizzle schema**: A single `database/schema.ts` defines both server tables (Cloudflare D1) and client cached tables (Expo SQLite), all with UUID IDs. Separate adapters (`server.ts`, `client.ts`) consume the same schema.
- **Edge backend**: Cloudflare Workers with GraphQL Yoga, Cloudflare D1 (SQLite), KV, R2, and Durable Objects for real‑time subscriptions.
- **Modern RN stack**: React 19, Expo Router 6, NativeWind 4 (Tailwind), New Architecture enabled.
- **Great DX**: Path aliases, one‑command dev, `yarn codegen`, `yarn db:migrate`, friendly linting.

### Onboarding roadmap

- Start with [Quick Start](#-quick-start) (install, migrate DB, codegen, run dev)
- Skim [Architecture Overview](#-architecture-overview) (keep charts; refer often)
- Learn the [Schema → Codegen → Hooks](#-how-to-add-new-features) workflow
- Review [Offline‑First Architecture](#-offline-first-architecture) and local DB usage

---

## 🏗️ Architecture Overview

### System Architecture (High-Level)

```mermaid
flowchart TB
  subgraph Client["📱 Client Layer (React Native + Expo)"]
    subgraph UI["UI Layer"]
      A["app/ - Expo Router Pages"]
      B["ui/ - UI Components, Hooks, State, Utils"]
    end
    subgraph State["State Management"]
      C["ui/state/ - Redux + Persist"]
      D["api/ - Apollo Client + DrizzleCacheStorage"]
    end
    subgraph Local["Local Storage"]
      E["Apollo Cache<br/>(raw)"]
      F["Drizzle Cache<br/>(structured)"]
      G["AsyncStorage<br/>(Mutation Queue)"]
    end
  end

  subgraph Shared["🔗 Shared Layer"]
    H["graphql/ - Schema + Operations"]
    I["database/schema.ts - Shared Drizzle Schema<br/>(Server + Client Tables)"]
  end

  subgraph Worker["⚡ Server Layer (Cloudflare Workers)"]
    J["worker/ - GraphQL Resolvers"]
    K["GraphQL Yoga Server"]
    L["D1 Database<br/>(SQLite)"]
    M["KV Store<br/>(Sessions/Cache)"]
    N["Vectorize<br/>(Embeddings)"]
    O["R2 Storage<br/>(Media Files)"]
  end

  A --> C
  B --> C
  C --> D
  D --> E
  D --> F
  D --> G
  D <-->|HTTPS GraphQL<br/>Auth Headers| K
  K --> J
  J --> L
  J --> M
  J --> N
  J --> O
  H --> D
  H --> K
  I --> F
  I --> L
  I --> J
```

### Client Architecture (Detailed)

```mermaid
flowchart TB
  subgraph Component["React Components"]
    C1["app/*.tsx<br/>Pages"]
    C2["ui/*.tsx<br/>UI Components"]
  end

  subgraph Hooks["Hook Layer"]
    H1["DrizzleCacheStorage<br/>api/cache-storage.ts"]
    H2["Custom Hooks<br/>ui/hooks/*.ts"]
    H3["Redux Hooks<br/>ui/state/hooks.ts"]
  end

  subgraph Data["Data Layer"]
    D1["Apollo Client<br/>api/client.ts"]
    D2["Redux Store<br/>ui/state/index.ts"]
      D3["Local DB<br/>database/client.ts"]
  end

  subgraph Storage["Storage Layer"]
    S1["Apollo Cache (raw)<br/>safarnak_local.db: apollo_cache_entries"]
    S2["Drizzle Cache<br/>(structured)"]
    S3["AsyncStorage<br/>Mutation Queue"]
    S4["Redux Persist<br/>AsyncStorage"]
  end

  C1 --> H1
  C2 --> H1
  C1 --> H3
  H1 --> D1
  H2 --> D3
  H3 --> D2
  D1 --> S1
  D1 --> S2
  D2 --> S4
  D3 --> S2
  D1 --> S3
```

### Data Flow Architecture

```mermaid
flowchart LR
  subgraph Query["Query Flow"]
    Q1["Component"] --> Q2["Generated Hook"]
    Q2 --> Q3["Apollo Client"]
    Q3 --> Q4["GraphQL Server"]
    Q4 --> Q5["D1 Database"]
    Q5 --> Q4
    Q4 --> Q3
    Q3 --> Q6["Apollo Cache (raw)"]
    Q6 --> Q7["Auto Sync"]
    Q7 --> Q8["Drizzle Cache (structured)"]
    Q2 --> Q1
  end

  subgraph Mutation["Mutation Flow"]
    M1["Component"] --> M2["Generated Hook"]
    M2 --> M3{"Online?"}
    M3 -->|Yes| M4["Apollo Client"]
    M3 -->|No| M5["Queue in<br/>AsyncStorage"]
    M4 --> M6["GraphQL Server"]
    M6 --> M7["D1 Database"]
    M7 --> M6
    M6 --> M4
    M4 --> M8["Apollo Cache"]
    M8 --> M9["Auto Sync"]
    M9 --> M10["Drizzle Cache"]
    M5 --> M11["Process Queue<br/>on Reconnect"]
    M11 --> M4
  end
```

### Offline-First Sync Architecture

```mermaid
sequenceDiagram
  participant UI as UI Component
  participant AH as Generated Hook
  participant AC as Apollo Client
  participant API as GraphQL API
  participant ACache as Apollo Cache<br/>(SQLite)
  participant DCache as Drizzle Cache<br/>(SQLite)
  participant Queue as Mutation Queue<br/>(AsyncStorage)

  Note over UI,Queue: Online Scenario
  UI->>AH: useGetTripsQuery()
  AH->>AC: Query with cache-and-network
  AC->>API: GraphQL Request
  API-->>AC: Response Data
  AC->>ACache: Persist to SQLite
  AC-->>AH: onCompleted callback
    AC->>DCache: DrizzleCacheStorage.setItem() (automatic)
  DCache-->>AH: Sync complete
  AH-->>UI: Return data

  Note over UI,Queue: Offline Mutation
  UI->>AH: useCreateTripMutation()
  AH->>AC: Mutation request
  AC->>API: GraphQL Request
  API-->>AC: Network Error
  AC->>Queue: Queue mutation
  AC-->>AH: Error (handled)
  AH->>DCache: Optimistic update
  DCache-->>AH: Update complete
  AH-->>UI: Optimistic UI update

  Note over UI,Queue: Online Sync
  AC->>Queue: Check pending mutations
  Queue-->>AC: Return queued mutations
  AC->>API: Process queued mutations
  API-->>AC: Success
  AC->>Queue: Remove from queue
  AC->>DCache: Mark as synced
```

### Storage Layer Architecture

```mermaid
flowchart TB
  subgraph ClientStorage["Client Storage"]
    subgraph Apollo["Apollo Cache"]
      A1["safarnak_local.db<br/>(apollo_cache_entries table)"]
      A2["Normalized Cache<br/>Key-Value Pairs"]
    end
    subgraph Drizzle["Drizzle Cache"]
      D1["safarnak_local.db<br/>(SQLite)"]
      D2["cachedTrips"]
      D3["cachedUsers"]
      D4["cachedTours"]
      D5["syncMetadata"]
      D6["pendingMutations"]
    end
    subgraph Async["AsyncStorage"]
      AS1["@safarnak_user<br/>(Auth Data)"]
      AS2["Mutation Queue<br/>(Offline)"]
      AS3["Redux Persist<br/>(UI State)"]
    end
  end

  subgraph ServerStorage["Server Storage"]
    subgraph D1DB["Cloudflare D1"]
      S1["users"]
      S2["trips"]
      S3["tours"]
      S4["messages"]
    end
    subgraph KV["Cloudflare KV"]
      K1["token:xxx<br/>(Sessions)"]
      K2["cache:xxx<br/>(API Cache)"]
    end
    subgraph Vector["Vectorize"]
      V1["User Preferences<br/>Embeddings"]
      V2["Locations<br/>Embeddings"]
    end
    subgraph R2Storage["R2 Storage"]
      R2Avatars["avatars/"]
      R2Images["images/"]
      R2Attachments["attachments/"]
    end
  end

  A1 --> A2
  D1 --> D2
  D1 --> D3
  D1 --> D4
  D1 --> D5
  D1 --> D6
  A2 -.->|Auto Sync| D2
  A2 -.->|Auto Sync| D3
  A2 -.->|Auto Sync| D4
  D2 -.->|Sync| S2
  D3 -.->|Sync| S1
  D4 -.->|Sync| S3
```

### Authentication Flow

```mermaid
sequenceDiagram
  participant U as User
  participant UI as Login Screen
  participant AC as Apollo Client
  participant AL as Auth Link
  participant API as GraphQL API
  participant KV as KV Store
  participant DB as D1 Database
  participant RS as Redux Store
  participant AS as AsyncStorage

  U->>UI: Enter credentials
  UI->>AC: useLoginMutation()
  AC->>AL: Add Bearer token header
  AL->>API: POST /graphql (login)
  API->>DB: Verify user (PBKDF2)
  DB-->>API: User record
  API->>API: Generate token (SHA-256)
  API->>KV: Store token:userId (30 days)
  KV-->>API: Stored
  API-->>AC: Return user + token
  AC->>RS: Dispatch login action
  RS->>AS: Persist user data
  AC->>AS: Store token
  RS-->>UI: Update auth state
  UI-->>U: Navigate to app

  Note over AC,API: Subsequent Requests
  UI->>AC: useGetTripsQuery()
  AC->>AL: Get token from AsyncStorage
  AL->>API: POST /graphql (Authorization: Bearer token)
  API->>KV: Verify token:userId
  KV-->>API: userId
  API->>DB: Query trips for userId
  DB-->>API: Trips data
  API-->>AC: Return trips
```

### Error Handling Architecture

```mermaid
flowchart TB
  subgraph Network["Network Errors"]
    N1["Apollo Request"] --> N2{"Network<br/>Available?"}
    N2 -->|No| N3["Catch Network Error"]
    N2 -->|Yes| N4{"Backend<br/>Reachable?"}
    N4 -->|No| N3
    N4 -->|Yes| N5["Process Request"]
    N3 --> N6["Error Link"]
    N6 --> N7["Suppress Network Errors<br/>(Expected when offline)"]
    N7 --> N8["Use Cached Data<br/>(errorPolicy: all)"]
  end

  subgraph GraphQL["GraphQL Errors"]
    G1["GraphQL Response"] --> G2{"Has<br/>Errors?"}
    G2 -->|Yes| G3["Error Link"]
    G3 --> G4["Log in Dev Mode"]
    G4 --> G5["Return Partial Data<br/>(if available)"]
    G2 -->|No| G6["Process Successfully"]
  end

  subgraph Component["Component Error Handling"]
    C1["Generated Hook"] --> C2{"Error<br/>Present?"}
    C2 -->|Yes| C3["onError Callback"]
    C3 --> C4["Display Error UI"]
    C4 --> C5["Show Retry Button"]
    C2 -->|No| C6["Render Data"]
  end

  N8 --> C1
  G5 --> C1
  G6 --> C1
```

### Network Status & Connectivity

```mermaid
flowchart TB
  subgraph Detection["Status Detection"]
    D1["NetInfo<br/>Listener"] --> D2["Network State"]
    D3["Backend Probe<br/>checkBackendReachable()"] --> D4["Backend State"]
    D2 --> D5["useSystemStatus Hook"]
    D4 --> D5
  end

  subgraph UI["UI Updates"]
    D5 --> U1["Update isOnline"]
    D5 --> U2["Update isBackendReachable"]
    U1 --> U3["Offline Icon<br/>(Home Page)"]
    U2 --> U3
    U3 --> U4["System Status Page"]
  end

  subgraph Actions["Offline Actions"]
    U1 --> A1{"isOnline = false?"}
    A1 -->|Yes| A2["Disable Mutations"]
    A1 -->|Yes| A3["Queue Mutations"]
    A2 --> A4["Show Offline Indicator"]
    A3 --> A4
    A1 -->|No| A5{"isBackendReachable = false?"}
    A5 -->|Yes| A2
    A5 -->|Yes| A3
    A5 -->|No| A6["Normal Operation"]
  end

  subgraph Sync["Auto Sync on Reconnect"]
    A2 --> S1["Monitor Network"]
    S1 --> S2{"Connection<br/>Restored?"}
    S2 -->|Yes| S3["processQueue()"]
    S3 --> S4["Retry Queued Mutations"]
    S4 --> S5["Update UI"]
  end
```

### Dev-time GraphQL Codegen Pipeline

```mermaid
flowchart TB
  subgraph Input["Source Files"]
    I1["graphql/schema.graphql<br/>Type Definitions"]
    I2["graphql/queries/*.graphql<br/>Operations"]
  end

  subgraph Codegen["Code Generation"]
    C1["yarn codegen"] --> C2["GraphQL Codegen"]
    C2 --> C3["Parse Schema"]
    C2 --> C4["Parse Operations"]
    C3 --> C5["Generate Types"]
    C4 --> C6["Generate Hooks"]
  end

  subgraph Output["Generated Files"]
    C5 --> O1["api/types.ts<br/>TypeScript Types"]
    C6 --> O2["api/hooks.ts<br/>React Apollo Hooks"]
  end

  subgraph Enhancement["Hook Enhancement"]
    O2 --> E1["api/cache-storage.ts"]
    E1 --> E2["DrizzleCacheStorage"]
    E2 --> E3["Automatic Sync on Write"]
    E3 --> E4["Dual-Write: Raw + Structured"]
  end

  subgraph Usage["App Usage"]
    E4 --> U1["Export from @api"]
    U1 --> U2["Import in Components"]
    U2 --> U3["Use Generated Hooks"]
  end

  I1 --> C1
  I2 --> C1
  U3 --> U4["Automatic Offline Support"]
```

### Complete Request Lifecycle

```mermaid
sequenceDiagram
  participant C as Component
  participant AH as Generated Hook
  participant AC as Apollo Client
  participant EL as Error Link
  participant AL as Auth Link
  participant API as GraphQL API
  participant DB as D1 Database
  participant Cache as Apollo Cache
  participant Drizzle as Drizzle Cache

  C->>AH: useGetTripsQuery()
  AH->>AC: Query with cache-and-network
  AC->>Cache: Check cache first
  Cache-->>AC: Return cached data (if available)
  AC-->>C: Render with cached data (optimistic)
  AC->>AL: Add auth headers
  AL->>API: POST /graphql
  API-->>AC: Response or Error
  alt Success
    AC->>Cache: Update cache
    Cache->>AH: onCompleted callback
    AC->>Drizzle: DrizzleCacheStorage.setItem() (automatic)
    Drizzle-->>AH: Sync complete
    AH->>AC: Update with network data
    AC-->>C: Re-render with fresh data
  else Network Error
    AC->>EL: Network error detected
    EL->>EL: Suppress error (offline expected)
    EL-->>AC: Continue with cached data
    AC-->>C: Use cached data (errorPolicy: all)
  else GraphQL Error
    AC->>EL: GraphQL error detected
    EL->>EL: Log error (dev mode)
    EL-->>AC: Return partial data
    AC-->>C: Render with partial data
  end
```

### How It Works

1. **Define GraphQL Schema** (`graphql/schema.graphql`) - Shared between client and worker
2. **Define Operations** (`graphql/queries/*.graphql`) - Queries and mutations
3. **Run Codegen** - Auto-generates TypeScript types and React hooks in `api/`
4. **DrizzleCacheStorage** (`api/cache-storage.ts`) - Automatically syncs Apollo cache to Drizzle on every cache write
5. **Implement Resolvers** (`worker/queries/`, `worker/mutations/`) - Server-side logic using `getServerDB()` from `@database/server`
6. **Use in App** (`app/`, `ui/`) - Import hooks from `@api` (automatic sync via DrizzleCacheStorage)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** (check with `node --version`)
- **Yarn** package manager (install via `npm install -g yarn`)
- **Android Studio** (for Android development)
- **Git** (for cloning the repository)

### Setup (5-10 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/mehotkhan/safarnak.app.git
cd safarnak.app

# 2. Install dependencies
yarn install

# 3. Setup local database (Cloudflare D1)
yarn db:migrate

# 4. Generate GraphQL types and hooks
yarn codegen

# 5. Start development servers
yarn dev  # Runs both worker (port 8787) and Expo client (port 8081)
```

This will start:
- **Cloudflare Worker** on `http://localhost:8787` (GraphQL API)
- **Expo Dev Server** on `http://localhost:8081` (React Native app)

### Run on Device/Emulator

```bash
# Android
yarn android

# Web browser
yarn web

# iOS (macOS only, not actively tested)
yarn ios
```

### First Time Setup Tips

- **Worker URL**: If you see connection errors, check that the worker is running on port 8787
- **GraphQL Playground**: Visit `http://localhost:8787/graphql` to test GraphQL queries
- **Metro Bundler**: If you see cache issues, clear `.expo`, `node_modules/.cache`, and `android/app/build`, then restart
- **Database**: The local D1 database is stored in `.wrangler/state/v3/d1/`

### Verify Installation

1. Check worker is running: Visit `http://localhost:8787/graphql` - you should see GraphQL Playground
2. Check Expo: Open Expo Go app on your phone or press `w` for web
3. Try a query: In GraphQL Playground, run `{ me { id username } }` (after logging in)

---

## 📁 Codebase Structure

### Client-Side (React Native - What You'll Modify Most)

```
app/                          # 📱 Expo Router pages (file-based routing)
├── _layout.tsx              # Root layout with providers
├── (auth)/                  # Auth route group (public routes)
│   ├── _layout.tsx         # Auth stack layout
│   ├── welcome.tsx         # /auth/welcome
│   ├── login.tsx           # /auth/login
│   └── register.tsx        # /auth/register
└── (app)/                   # Main app group (protected routes)
    ├── _layout.tsx         # Tab bar layout (4 tabs: feed, explore, trips, profile)
    ├── (feed)/             # Feed tab
    │   ├── index.tsx       # / (home feed)
    │   ├── [id].tsx        # /:id (post detail)
    │   └── new.tsx         # /new (create post)
    ├── (explore)/          # Explore tab
    │   ├── index.tsx       # /explore
    │   ├── places/[id].tsx # /explore/places/:id
    │   ├── tours/[id].tsx  # /explore/tours/:id
    │   ├── tours/[id]/book.tsx # /explore/tours/:id/book
    │   ├── locations/[id].tsx  # /explore/locations/:id
    │   └── users/[id].tsx  # /explore/users/:id
    ├── (trips)/            # Trips tab
    │   ├── index.tsx       # /trips (trip list)
    │   ├── new.tsx         # /trips/new (create trip)
    │   └── [id]/           # /trips/:id
    │       ├── index.tsx   # Trip details
    │       └── edit.tsx    # Edit trip
    └── (profile)/          # Profile tab
        ├── index.tsx       # /profile
        ├── edit.tsx        # /profile/edit
        ├── trips.tsx       # /profile/trips
        ├── messages.tsx    # /profile/messages
        ├── messages/[id].tsx # /profile/messages/:id
        ├── notifications/[id].tsx # /profile/notifications/:id
        ├── payments.tsx    # /profile/payments
        ├── subscription.tsx # /profile/subscription
        └── settings.tsx    # /profile/settings

ui/                           # 🎨 All client UI code
├── auth/                    # Authentication components
│   └── AuthWrapper.tsx      # Authentication guard
├── maps/                    # Map components
│   ├── MapView.tsx          # MapLibre GL map (native, replaces Leaflet)
│   ├── MapLibreView.tsx     # MapLibre GL map component
│   └── MapLibreLayerSelector.tsx  # Map layer selector UI
├── forms/                   # Form components
│   ├── CustomButton.tsx
│   ├── InputField.tsx
│   ├── TextArea.tsx
│   └── ...
├── display/                 # Display components
│   ├── CustomText.tsx
│   ├── UserAvatar.tsx
│   └── ...
├── feedback/                # Loading/error states
│   ├── LoadingState.tsx
│   ├── ErrorState.tsx
│   └── ...
├── context/                 # React contexts
│   ├── LanguageContext.tsx
│   ├── LanguageSwitcher.tsx
│   └── ThemeContext.tsx
├── hooks/                   # 🪝 Custom React hooks
│   ├── useColorScheme.ts
│   ├── useAuth.ts
│   └── ...
├── state/                   # 📦 Redux Toolkit state management
│   ├── index.ts             # Store configuration
│   ├── hooks.ts             # Typed hooks (useAppDispatch, useAppSelector)
│   ├── slices/              # Redux slices
│   │   ├── authSlice.ts
│   │   └── themeSlice.ts
│   └── middleware/          # Redux middleware
│       └── offlineMiddleware.ts
└── utils/                   # Client utilities
    ├── clipboard.ts
    ├── validation.ts
    └── ...

api/                          # 🌐 GraphQL client layer
├── hooks.ts                 # ✨ Auto-generated React Apollo hooks (never edit manually)
├── types.ts                 # ✨ Auto-generated TypeScript types (never edit manually)
├── cache-storage.ts         # DrizzleCacheStorage - automatic Apollo → Drizzle sync
├── client.ts                # Apollo Client setup
├── utils.ts                 # API utilities
├── globals.d.ts             # TypeScript global declarations
└── index.ts                 # Main exports

constants/                    # 📋 App constants
├── app.ts                   # App-wide constants
├── Colors.ts                # Color palette (light/dark themes)
└── index.ts                 # Exports

locales/                      # 🌍 i18n translation files
├── en/translation.json      # English translations
└── fa/translation.json      # Persian (Farsi) translations

global.css                    # 🎨 Tailwind CSS directives (@tailwind base/components/utilities)
tailwind.config.js           # 🎨 Tailwind configuration (NativeWind v4)
babel.config.js              # ⚙️ Babel config (NativeWind preset)
metro.config.js              # 📦 Metro bundler config (path aliases, NativeWind)
```

### Server-Side

```
worker/                 # ⚡ Cloudflare Worker
├── queries/           # Query resolvers (myConversations, me)
├── mutations/        # Mutation resolvers (register, login)
└── subscriptions/    # Subscription resolvers (conversationMessages, tripUpdates)

graphql/               # 📡 Shared GraphQL
├── schema.graphql    # GraphQL schema (shared)
└── queries/          # Query definitions (.graphql files)

database/              # 🗄️ Shared database schema and adapters
├── schema.ts         # Unified schema with UUIDs (server + client tables in one file)
├── server.ts         # Server adapter (Cloudflare D1) - exports getServerDB()
├── client.ts         # Client adapter (Expo SQLite) - exports getLocalDB(), sync utilities
├── index.ts          # Main exports (re-exports from schema, server, client)
├── types.ts          # Database types
└── utils.ts          # UUID utilities (createId, isValidId)
migrations/           # Server-only migrations (Cloudflare D1, at project root)
```

## 🧭 Routing & URLs

Safarnak uses **Expo Router** with file-based routing. Routes are organized into groups using parentheses (which don't appear in URLs).

### Auth Routes (Public)
- `/auth/welcome` – Onboarding/Welcome screen
- `/auth/login` – User login
- `/auth/register` – User registration

### App Routes (Protected - Requires Authentication)

#### Feed Tab (`(feed)`)
- `/` – Home feed (social posts from community)
- `/:id` – Post detail view with comments
- `/new` – Create new post

#### Explore Tab (`(explore)`)
- `/explore` – Main explore/search page
- `/explore/places/:id` – Place details page
- `/explore/tours/:id` – Tour details page
- `/explore/tours/:id/book` – Tour booking page
- `/explore/locations/:id` – Location details page
- `/explore/users/:id` – User profile (public view)

#### Trips Tab (`(trips)`)
- `/trips` – User's trip list
- `/trips/new` – Create new trip (AI-powered)
- `/trips/:id` – Trip details view
- `/trips/:id/edit` – Edit trip

#### Profile Tab (`(profile)`)
- `/profile` – User profile home
- `/profile/edit` – Edit profile
- `/profile/trips` – User's trips list
- `/profile/messages` – Messages inbox
- `/profile/messages/:id` – Individual message/conversation
- `/profile/notifications` – Notifications list
- `/profile/notifications/:id` – Notification detail
- `/profile/payments` – Payment history
- `/profile/subscription` – Subscription management
- `/profile/settings` – App settings

### Route Organization
- Route groups `(auth)` and `(app)` don't appear in URLs
- Tab groups `(feed)`, `(explore)`, `(trips)`, `(profile)` don't appear in URLs
- Dynamic routes use `[id]` in file names
- Nested routes create URL paths (e.g., `trips/[id]/edit.tsx` → `/trips/:id/edit`)

## 🗄️ Database Model (ER Diagram)

```mermaid
erDiagram
    USERS ||--o{ MESSAGES : sends
    USERS ||--o{ USER_SUBSCRIPTIONS : has
    USERS ||--o{ SUBSCRIPTIONS : has "GraphQL subscriptions"
    USERS ||--o{ USER_PREFERENCES : has
    USERS ||--o{ TRIPS : creates
    USERS ||--o{ TOURS : creates
    USERS ||--o{ POSTS : authors
    USERS ||--o{ COMMENTS : writes
    USERS ||--o{ REACTIONS : adds
    USERS ||--o{ PAYMENTS : makes
    USERS ||--o{ DEVICES : owns
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ NOTIFICATIONS : receives

    TRIPS ||--o{ ITINERARIES : has
    TRIPS ||--o{ PLANS : has
    TRIPS ||--o{ THOUGHTS : generated_by
    TRIPS ||--o{ MESSAGES : discusses

    TOURS ||--o{ PAYMENTS : requires

    LOCATIONS ||--o{ PLACES : contains

    POSTS ||--o{ COMMENTS : has
    POSTS ||--o{ REACTIONS : has
    POSTS ||--o| TRIPS : references "via relatedId"
    POSTS ||--o| TOURS : references "via relatedId"
    POSTS ||--o| PLANS : references "via relatedId"

    CACHE }|..|{ EXTERNAL_API : stores

    USER_SUBSCRIPTIONS ||--|{ USERS : for
    USER_SUBSCRIPTIONS ||--o{ PAYMENTS : via

    USERS {
        uuid id PK "UUID (text)"
        string name
        string username UK
        string passwordHash
        string email UK
        string phone
        string avatar "R2 URL"
        boolean isActive
        timestamp createdAt
        timestamp updatedAt
    }

    USER_PREFERENCES {
        uuid id PK "UUID (text)"
        uuid userId FK "UUID (text)"
        json interests
        json budgetRange
        string travelStyle
        json preferredDestinations
        json dietaryRestrictions
        string embedding "Vectorize"
        timestamp updatedAt
    }

    TRIPS {
        uuid id PK "UUID (text)"
        uuid userId FK "UUID (text)"
        string title
        date startDate
        date endDate
        string destination
        integer budget "cents/stored units"
        string status
        boolean aiGenerated
        json metadata
        timestamp createdAt
        timestamp updatedAt
    }

    ITINERARIES {
        uuid id PK "UUID (text)"
        uuid tripId FK "UUID (text)"
        integer day
        json activities
        json accommodations
        json transport
        string notes
        integer costEstimate
        timestamp createdAt
        timestamp updatedAt
    }

    PLANS {
        uuid id PK "UUID (text)"
        uuid tripId FK "UUID (text)"
        json mapData "stops, directions"
        json details
        string aiOutput
        timestamp createdAt
    }

    TOURS {
        uuid id PK "UUID (text)"
        string title
        text description
        integer price "cents"
        integer rating
        string location
        string category
        boolean isActive
        timestamp createdAt
        timestamp updatedAt
    }

    MESSAGES {
        uuid id PK "UUID (text)"
        text content
        uuid userId FK "UUID (text)"
        string type
        json metadata
        boolean isRead
        timestamp createdAt
    }

    POSTS {
        uuid id PK "UUID (text)"
        uuid userId FK "UUID (text)"
        text content
        json attachments "R2 URLs"
        string type "plan/trip/tour"
        uuid relatedId "trip/tour/plan UUID"
        timestamp createdAt
    }

    COMMENTS {
        uuid id PK "UUID (text)"
        uuid postId FK "UUID (text)"
        uuid userId FK "UUID (text)"
        text content
        timestamp createdAt
    }

    REACTIONS {
        uuid id PK "UUID (text)"
        uuid postId FK "UUID (text)"
        uuid commentId FK "UUID (text)"
        uuid userId FK "UUID (text)"
        string emoji
        timestamp createdAt
    }

    PAYMENTS {
        uuid id PK "UUID (text)"
        uuid userId FK "UUID (text)"
        uuid tourId FK "UUID (text)"
        uuid subscriptionId FK "UUID (text)"
        string transactionId
        integer amount
        string currency "default: IRR"
        string status
        timestamp createdAt
    }

    USER_SUBSCRIPTIONS {
        uuid id PK "UUID (text)"
        uuid userId FK "UUID (text)"
        string tier "free/member/pro"
        date startDate
        date endDate
        boolean active
        timestamp createdAt
    }

    DEVICES {
        uuid id PK "UUID (text)"
        uuid userId FK "UUID (text)"
        string deviceId UK
        string type
        timestamp lastSeen
    }

    SESSIONS {
        string id PK "KV key (not in D1)"
        uuid userId FK "UUID (text)"
        string token
        timestamp expiresAt
    }

    NOTIFICATIONS {
        uuid id PK "UUID (text)"
        uuid userId FK "UUID (text)"
        string type "tour invite/payment/etc"
        json data
        boolean read
        timestamp createdAt
    }

    LOCATIONS {
        uuid id PK "UUID (text)"
        string name UK
        string country
        json coordinates
        text description
        json popularActivities
        integer averageCost
        string embedding "Vectorize"
        string imageUrl "R2"
        timestamp createdAt
    }

    PLACES {
        uuid id PK "UUID (text)"
        string name
        uuid locationId FK "UUID (text)"
        uuid ownerId FK "UUID (text)"
        string type "market/room/etc"
        text description
        integer price
        integer rating
        json coordinates
        string embedding "Vectorize"
        string imageUrl "R2"
        timestamp createdAt
    }

    THOUGHTS {
        uuid id PK "UUID (text)"
        uuid tripId FK "UUID (text)"
        text step "AI reasoning step"
        json data "logs/sources"
        timestamp createdAt
    }

    SUBSCRIPTIONS {
        uuid id PK "UUID (text)"
        string connectionId "GraphQL subscription"
        string connectionPoolId "Durable Object"
        string subscription "GraphQL query"
        string topic
        string filter
        uuid userId FK "UUID (text)"
        boolean isActive
        timestamp createdAt
        timestamp expiresAt
    }

    CACHE {
        string key PK "KV key"
        json value "cached API data"
        timestamp expiresAt
    }
```

### Data Storage Architecture

- **D1 (Relational DB with Drizzle)**: 
  - **Server Tables**: Users, user preferences, trips, itineraries, plans, tours, messages, posts, comments, reactions, payments, user subscriptions (tiers), devices, notifications, locations, places, thoughts, subscriptions (GraphQL subscriptions).
  - **All IDs are UUID (text)** - consistent across server and client
  - **Shared Schema**: Same schema definitions used by both server (D1) and client (expo-sqlite) adapters
- **KV (Key-Value Store)**: Sessions (user tokens stored as `token:userId`), cache (external API data like TripAdvisor, web searches).
- **Vectorize (Vector DB)**: Embeddings (user preferences, destinations, places, activities for similarity searches).
- **R2 (Object Storage)**: Avatars, image URLs, galleries, attachments (media, maps, docs).
- **Durable Objects**: Real-time subscriptions (connection state for GraphQL subs via `SubscriptionPool`).

**Note**: The ER diagram above shows the server-side D1 database schema. The client uses cached versions of these tables (e.g., `cachedUsers`, `cachedTrips`) with additional sync metadata fields (`cachedAt`, `lastSyncAt`, `pending`) for offline-first functionality.

### Shared (Critical)

- **`graphql/`** - GraphQL schema and operations (shared between client & worker)
- **`database/schema.ts`** - Unified Drizzle schema (shared between client & worker - same table definitions, different adapters)
  - Server tables: `users`, `trips`, `tours`, etc. (used by worker via `database/server.ts`)
  - Client cached tables: `cachedUsers`, `cachedTrips`, etc. (used by client via `database/client.ts`)
  - Both use UUID (text) IDs for consistency
- **`api/`** - Auto-generated client code (run `yarn codegen` to update)

## 📡 Social Feed & Streaming (How it Works)

### Overview
- Unified feed via normalized `feed_events` for all entities (Post/Trip/Tour/Place/Location).
- Semi‑realtime: GraphQL `feedNewEvents` subscription with server‑side filters; client shows “Show 3 new” banner (capped), merges on tap.
- Personalization: Per‑user `feed_preferences` (topics, entity types, following‑only, close‑friends‑only, mutes).
- Follow graph: `follow_edges`, `close_friends` with filters and boosts (following +1, close‑friends +2, topic matches +0.5 each).
- Trending: KV counters updated on writes; Durable Object `TrendingRollup` compacts/decays periodically; `getTrending` prefers KV (fallback to D1 for ENTITY).
- Search: `search` (lexical) and `searchSemantic` (Vectorize + Workers AI + Queues). Writers upsert into `search_index`; producers enqueue embeddings; consumer upserts vectors.
- Offline‑first: Queries work from Apollo/Drizzle cache; subscriptions no‑op when offline.

### Key GraphQL APIs
- Feed:
  - `getFeed(first, after, filter: FeedFilter)` → paginated `FeedConnection`
  - `feedNewEvents(filter: FeedFilter)` → subscription (server filters applied)
  - `getFeedPreferences` / `updateFeedPreferences(input: FeedFilter!)`
- Search:
  - `search(query, entityTypes, topics, first, after)` (lexical)
  - `searchSuggest(prefix, limit)`
  - `searchSemantic(query, entityTypes, first, after)` (Vectorize KNN)
- Trending:
  - `getTrending(type: TrendingType!, window: TimeWindow!, entityTypes?, limit)` (KV preferred)

### Storage & Infra
- D1: `feed_events`, `feed_preferences`, `search_index`, `follow_edges`, `close_friends`, `embeddings_meta`.
- KV: `top:entity:<window>`, `top:topic:<window>` lists.
- DO: `SubscriptionPool` (subs), `TrendingRollup` (decay/trim); cron every 10 minutes.
- Queues: `EMBED_QUEUE` producer/consumer; Workers AI (`@cf/baai/bge-m3`) to embed.
- Vectorize: upsert vectors with metadata `{ entityType, entityId, lang }`.


---



## 💡 How to Add New Features

### Complete Workflow: Adding a GraphQL Query/Mutation

This is the **standard workflow** for adding new features. Follow these steps:

#### Step 1: Define in GraphQL Schema
```graphql
# graphql/schema.graphql
type Query {
  getTours(category: String, limit: Int): [Tour!]!
}

type Tour {
  id: ID!
  title: String!
  location: String!
  price: Float!
  # ... other fields
}
```

#### Step 2: Create Operation File
```graphql
# graphql/queries/getTours.graphql
query GetTours($category: String, $limit: Int) {
  getTours(category: $category, limit: $limit) {
      id
    title
    location
    price
    rating
    reviews
  }
}
```

#### Step 3: Run GraphQL Codegen
```bash
yarn codegen
```

This generates:
- `api/types.ts` - TypeScript types for `Tour`, `GetToursQuery`, etc.
- `api/hooks.ts` - React hooks like `useGetToursQuery()`

#### Step 4: Implement Resolver (Worker)
```typescript
// worker/queries/getTours.ts
import { getServerDB, tours } from '@database/server';
import { eq, and } from 'drizzle-orm';

export const getTours = async (
  _: any,
  { category, limit }: { category?: string; limit?: number },
  context: any
) => {
  const db = getServerDB(context.env.DB);
  let query = db.select().from(tours).where(eq(tours.isActive, true));
  
  if (category) {
    query = query.where(eq(tours.category, category));
  }
  
  const results = await query.limit(limit || 100).all();
  return results;
};
```

Don't forget to export it:
```typescript
// worker/queries/index.ts
export * from './getTours';
```

#### Step 5: Use in Component
```typescript
// app/(app)/(explore)/tours/index.tsx
import { useGetToursQuery } from '@api'; // Auto-generated hook with automatic Drizzle sync
import { ActivityIndicator, View, Text } from 'react-native';

export default function ToursScreen() {
  // DrizzleCacheStorage automatically syncs to Drizzle on every cache write
  const { data, loading, error } = useGetToursQuery({
    variables: { category: 'adventure', limit: 10 }
    // fetchPolicy defaults to 'cache-and-network' for offline support
  });

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {data?.getTours.map(tour => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </View>
  );
}
```

**Important**: After changing the GraphQL schema or operations, **always run `yarn codegen`** before using the new hooks.

### Adding a New UI Component

1. **Create Component** (using NativeWind/Tailwind):
```typescript
// ui/cards/TourCard.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { CustomText } from '@ui/CustomText';

interface TourCardProps {
  tour: { id: string; name: string };
  onPress?: () => void;
}

export default function TourCard({ tour, onPress }: TourCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-3"
    >
      <Text className="text-lg font-semibold text-gray-900 dark:text-white">
        {tour.name}
      </Text>
    </TouchableOpacity>
  );
}
```

2. **Use Path Aliases**:
```typescript
import { useColorScheme } from '@hooks/useColorScheme';
import { colors } from '@constants/Colors';
import { useAppDispatch } from '@state/hooks';
```

### Adding to Redux Store

1. **Create Slice**:
```typescript
// ui/state/slices/toursSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const toursSlice = createSlice({
  name: 'tours',
  initialState: { tours: [] },
  reducers: {
    setTours: (state, action) => {
      state.tours = action.payload;
    },
  },
});

export const { setTours } = toursSlice.actions;
export default toursSlice.reducer;
```

2. **Add to Store**:
```typescript
// ui/state/index.ts
import toursReducer from './slices/toursSlice';

// Add to combineReducers
tours: toursReducer,
```

---

## 🔧 Configuration

### Environment & Configuration

#### GraphQL Endpoint

The client determines the GraphQL URL in this order:

1. `app.config.js` → `expo.extra.graphqlUrl` (recommended)
2. `process.env.EXPO_PUBLIC_GRAPHQL_URL`
3. Fallback in dev to the Expo dev-server host on port `8787`

Use one public client endpoint name everywhere. `APP_VARIANT` controls the native app identity; `EXPO_PUBLIC_GRAPHQL_URL` controls the API endpoint embedded into the JavaScript bundle.

```bash
# .env.local
APP_VARIANT=dev
EXPO_PUBLIC_APP_VARIANT=dev
EXPO_PUBLIC_GRAPHQL_URL=http://127.0.0.1:8787/graphql
GRAPHQL_URL=http://127.0.0.1:8787/graphql
```

For EAS builds, prefer the `environment` field in `eas.json` (`development`, `preview`, `production`) and keep matching values in EAS environment variables. Production builds fail fast if `EXPO_PUBLIC_GRAPHQL_URL` points at a local network URL.

Relevant sources:
- `api/client.ts` (URI resolution and auth link)
- `app.config.js` (`expo.extra.graphqlUrl` derived from env)

#### App Identity (Android)

Customize via env for EAS or local builds:

```bash
APP_NAME="سفرناک"
BUNDLE_IDENTIFIER=ir.mohet.safarnak
APP_SCHEME=safarnak
ANDROID_VERSION_CODE=800   # optional override
```

### Path Aliases

```typescript
import { useLoginMutation } from '@api';
import { useAppDispatch } from '@state/hooks';
import { login } from '@state/slices/authSlice';
import { useColorScheme } from '@hooks/useColorScheme';
import Colors from '@constants/Colors';
```

**Never use relative imports** (`../../api`, `../store`). Always use path aliases.

### GraphQL Codegen

Auto-generates TypeScript types and React hooks from GraphQL schema:

1. **Schema** (`graphql/schema.graphql`) defines types
2. **Operations** (`graphql/queries/*.graphql`) define queries/mutations
3. **Run** `yarn codegen` to generate `api/hooks.ts` and `api/types.ts`
4. **Use** generated hooks: `import { useLoginMutation } from '@api'`

**Important**: Always run `yarn codegen` after modifying GraphQL schema or operations.

---

## 📋 Common Commands

```bash
# Development
yarn dev              # Start both worker & client
yarn start            # Expo dev server only
yarn worker:dev       # Worker only

# Database
yarn db:generate      # Generate migration from schema changes (server tables only)
yarn db:migrate       # Apply migrations to local D1 (server database)
yarn db:studio        # Open Drizzle Studio

# GraphQL
yarn codegen          # Generate types & hooks
yarn codegen:watch    # Watch mode

# Build
yarn android          # Run on Android
yarn build:local      # Local gradle release build

# Utilities
yarn lint             # Check code quality
yarn lint:fix         # Fix issues
 
# Commits
yarn commit           # Commitizen conventional commit prompt
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React Native 0.81.5 | Mobile UI |
| **Backend** | Cloudflare Workers | Serverless API |
| **Server Database** | Cloudflare D1 (SQLite) | Server database via Drizzle |
| **Client Database** | Expo SQLite | Local offline database via Drizzle |
| **GraphQL** | GraphQL Yoga 5.16.0 | API layer |
| **ORM** | Drizzle 0.44.7 | Type-safe queries (shared schema for both server & client) |
| **Styling** | NativeWind 4.1.21 + Tailwind CSS 3.4.17 | Utility-first CSS |
| **State** | Redux Toolkit 2.9.2 | Client state |
| **Codegen** | GraphQL Codegen 6.0.1 | Auto-generate types |
| **Router** | Expo Router 6.0.13 | File-based routing |

**Full stack**: TypeScript 5.9, ESLint, Prettier, React i18next, New Architecture enabled

---

## 🧪 Development Tips

1. **Metro Cache Issues**: Clear `.expo`, `node_modules/.cache`, and `android/app/build`
2. **Database Reset**: Delete `.wrangler/state/v3/d1/` and run `yarn db:migrate`
3. **Type Errors**: Run `yarn codegen` to regenerate types
4. **GraphQL Changes**: Always run `yarn codegen` after schema changes
5. **Worker Logs**: Check terminal running `yarn worker:dev`
6. **Worker URL**: `http://127.0.0.1:8787/graphql` (or `http://localhost:8787/graphql`)
7. **Styling Issues**: Ensure `global.css` is imported in `app/_layout.tsx`, check `tailwind.config.js` content paths
8. **NativeWind Not Working**: Clear Metro cache and restart `yarn start`

---

## 🔐 Authentication Flow

1. User logs in → Client calls `login` mutation
2. Worker validates → Returns user + token
3. Client stores → Redux + AsyncStorage
4. Apollo adds token → Automatic auth headers
5. Auto-redirect → Logged-in users can't access auth pages

**Auth Pages**: `app/(auth)/login.tsx`, `app/(auth)/register.tsx`, `app/(auth)/welcome.tsx`  
**Auth Guard**: `ui/auth/AuthWrapper.tsx`

---

## 🎨 Styling with NativeWind (Tailwind CSS)

Safarnak uses **NativeWind v4** for utility-first styling with Tailwind CSS. This provides a consistent, maintainable styling approach across the app.

### Key Features

- **Utility-first CSS**: Use Tailwind classes directly via `className` prop
- **Dark mode**: Automatic dark mode support with `dark:` prefix
- **Theme integration**: Automatically syncs with Redux theme state
- **Responsive**: Built-in responsive utilities

### Usage Example

```typescript
import { View, Text } from 'react-native';

export default function MyScreen() {
  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to Safarnak
      </Text>
      <View className="bg-primary rounded-lg p-3">
        <Text className="text-white text-center">Primary Button</Text>
      </View>
    </View>
  );
}
```

### Configuration Files

- `tailwind.config.js` - Tailwind configuration with custom colors and fonts
- `global.css` - Tailwind directives (imported in `app/_layout.tsx`)
- `babel.config.js` - NativeWind Babel preset
- `metro.config.js` - NativeWind Metro integration

### Custom Colors

The app uses custom colors defined in `tailwind.config.js`:
- `primary` - Main brand color (#30D5C8)
- `danger` - Error/warning color (#ef4444)
- `success` - Success color (#10b981)
- `neutral` - Neutral grays

---

## 🌍 Internationalization

Supports English and Persian (Farsi). Note: RTL layout toggling is currently disabled (Android `supportsRtl=false`); translations work without forcing RTL.

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<CustomText>{t('common.welcome')}</CustomText>
```

**Translation files**: `locales/en/translation.json`, `locales/fa/translation.json`

---

## 🎯 Key Concepts

### Perfect Separation

- **`graphql/`** - Shared schema and operations (used by both client & worker)
- **`api/`** - Auto-generated client code only (client-side GraphQL hooks with automatic Drizzle sync)
- **`worker/`** - Server-only resolvers (entry: `worker/index.ts`)
- **`database/`** - **Shared** database schema with separate adapters for server and client
  - `schema.ts` - **Unified schema** defining both server tables (users, trips, etc.) and client cached tables (cachedUsers, cachedTrips, etc.) with UUID IDs
  - `server.ts` - Server adapter: `getServerDB(d1)` for Cloudflare D1 (worker resolvers use this)
  - `client.ts` - Client adapter: `getLocalDB()` for Expo SQLite (client components use this)
  - Both adapters import from the same `schema.ts` file, ensuring schema consistency
  - `migrations/` - Server-only migrations (located at project root, for D1 database)

### Auto-Generated Code

**Never manually edit**:
- `api/hooks.ts` - Auto-generated React Apollo hooks (from GraphQL operations)
- `api/types.ts` - Auto-generated TypeScript types (from GraphQL schema)

**Use these instead**:
- `api/cache-storage.ts` - DrizzleCacheStorage automatically syncs on every Apollo cache write
- `api/index.ts` - Main exports (re-exports hooks + utilities)

**Generation Process**:
1. Define schema in `graphql/schema.graphql`
2. Define operations in `graphql/queries/*.graphql`
3. Run `yarn codegen` to generate `api/hooks.ts` and `api/types.ts`
4. Use generated hooks directly; DrizzleCacheStorage handles sync automatically

### Path Aliases

Always use aliases, never relative imports:
- ✅ `@api`, `@ui/*`, `@hooks/useColorScheme`, `@state/*`, `@utils/*`
- ❌ `../../api`, `../store/hooks`, `@components/*`, `@store/*`

---

## 📶 Offline-First Architecture

Safarnak implements a comprehensive **offline-first architecture** with automatic data synchronization. The system uses a **shared Drizzle schema** that works seamlessly between client and server, with automatic Apollo cache synchronization to enable advanced SQL queries on cached data.

### Shared Drizzle Schema Architecture

The app uses a **unified Drizzle schema** (`database/schema.ts`) that is **shared between worker and client**. This single source of truth ensures schema consistency across both environments:

#### Schema Structure

1. **Single Schema File** (`database/schema.ts`):
   - Contains **all table definitions** in one file
   - Defines both server tables and client cached tables
   - Uses **UUID (text) IDs** throughout for consistency
   - Shared field definitions reduce duplication (`userFields`, `tripFields`, etc.)

2. **Server Tables** (for Cloudflare D1):
   - Tables: `users`, `trips`, `tours`, `messages`, `subscriptions`, etc.
   - Used by worker resolvers via `database/server.ts` → `getServerDB(d1)`
   - All IDs are UUIDs: `text('id').primaryKey().$defaultFn(() => createId())`
   - No ID conversions needed - UUIDs work seamlessly with GraphQL `ID!` type
   - Server-only fields: `passwordHash` (users), `aiGenerated` (trips), etc.

3. **Client Cached Tables** (for Expo SQLite):
   - Tables: `cachedUsers`, `cachedTrips`, `cachedTours`, `cachedPlaces`, `cachedMessages`
   - Used by client components via `database/client.ts` → `getLocalDB()`
   - Same UUID format as server tables - perfect consistency
   - Reuses shared field definitions from server tables via spread operator
   - Includes sync metadata: `cachedAt`, `lastSyncAt`, `pending`, `deletedAt`
   - Sync management tables: `pendingMutations`, `syncMetadata`

4. **Shared Field Definitions**:
   - Common columns extracted into reusable objects: `userFields`, `tripFields`, `tourFields`, `placeFields`, `messageFields`
   - Metadata columns: `timestampColumns`, `syncMetadataColumns`, `pendingColumn`
   - Reduces duplication and improves maintainability

5. **Separate Adapters**:
   - **Server**: `database/server.ts` exports `getServerDB(d1)` - uses Cloudflare D1
   - **Client**: `database/client.ts` exports `getLocalDB()` - uses Expo SQLite
   - Both import from the same `schema.ts` file, ensuring perfect schema alignment

6. **UUID Generation** (`database/utils.ts`):
   - **Cloudflare Workers**: Uses native `crypto.randomUUID()` (fastest, most secure)
   - **React Native Expo**: Uses `crypto.getRandomValues()` with manual UUID construction
   - **Fallback**: Math.random() only if crypto APIs unavailable (with dev warning)
   - RFC 4122 compliant UUID v4 format

### Folder Structure

```
database/
├── schema.ts         # Unified schema with UUIDs (server + client tables)
├── server.ts         # Server adapter (Cloudflare D1)
├── client.ts         # Client utilities (db, sync, stats)
├── index.ts          # Main exports
├── types.ts          # TypeScript types and enums
└── utils.ts          # UUID utilities
migrations/           # Server-only migrations (Cloudflare D1, at project root)
```

**Important Architecture Points**: 
- **Shared Schema**: Both worker and client import from the same `database/schema.ts` file
- **Separate Adapters**: Server uses `getServerDB(d1)` (D1), client uses `getLocalDB()` (expo-sqlite)
- **UUID Consistency**: All tables use UUID (text) IDs - no conversions needed between server/client
- **Migrations**: 
  - Server migrations at project root (`migrations/`) for D1 database
  - Client cached tables auto-migrated on app initialization (see `database/client.ts`)
- **Schema Exports**: `drizzle.config.ts` points to `schema.ts` (exports `serverSchema` as `schema` for migrations)
- **UUID Generation**: `createId()` from `database/utils.ts` (runtime-optimized for each platform)

### GraphQL Query System with Automatic Sync

All GraphQL queries and mutations automatically sync to the local Drizzle database:

1. **Query Flow**:
   ```
   Component → Generated Hook (useGetTripsQuery) → Apollo Client → GraphQL Server
                                                       ↓
                                                  Apollo Cache (raw)
                                                       ↓
                                              Automatic Sync
                                                       ↓
                                                  Drizzle DB (structured)
   ```

2. **DrizzleCacheStorage** (`api/cache-storage.ts`):
   - Implements Apollo's PersistentStorage interface
   - Automatically syncs on every Apollo cache write (via `setItem()`)
   - Dual-write: raw cache (`apollo_cache_entries`) + structured tables (cachedUsers, cachedTrips, etc.)
   - No wrapper hooks needed - all Apollo hooks automatically benefit

3. **Sync Mechanism**:
   - **Event-driven**: Triggers on every Apollo cache write (via `DrizzleCacheStorage.setItem()`)
   - **Automatic**: No manual sync calls needed - happens transparently
   - **Background**: Sync runs in background, doesn't block UI
   - **Dual-write**: Single transaction writes to both raw cache and structured tables

### Data Storage

The app uses three storage layers:

1. **Apollo Cache (SQLite)**: Normalized GraphQL cache
   - Stored in `apollo_cache_entries` table via DrizzleCacheStorage
   - Stored as JSON string in SQLite
   - Handles GraphQL query responses automatically

2. **Drizzle Cache (SQLite)**: Structured relational cache
   - Separate tables per entity type (`cachedTrips`, `cachedUsers`, etc.)
   - Enables advanced SQL queries (filtering, sorting, aggregations)
   - Sync metadata for offline management

3. **AsyncStorage**: Mutation queue
   - Stores pending mutations when offline
   - Automatically processed when connection restored

### Offline Capabilities

- **Read**: Query local Drizzle database even when offline
- **Write**: Queue mutations when offline, sync when online
- **Sync**: Automatic bidirectional sync when connection restored
- **Statistics**: Real-time database statistics (entity counts, sync status, pending mutations)

#### Reconnect & Queue Behavior

- When offline, mutations are persisted to an AsyncStorage-backed queue.
- On reconnect, the queue is processed in order; successful mutations are removed and corresponding cached entities are marked synced.
- DrizzleCacheStorage continues to dual-write on every Apollo cache update; no wrapper hooks are required.
- Network status is derived from NetInfo plus a lightweight backend reachability probe.

### Usage Examples

#### Query with Automatic Sync

```typescript
import { useGetTripsQuery } from '@api';

function TripsScreen() {
  // DrizzleCacheStorage automatically syncs to Drizzle on every cache write
  const { data, loading, error } = useGetTripsQuery({
    fetchPolicy: 'cache-and-network', // Recommended for offline support
  });
  
  // Data is automatically synced to both Apollo cache and Drizzle database
}
```

#### Query Local Database (Offline)

```typescript
import { getLocalDB, cachedTrips } from '@database/client';
import { eq, desc } from 'drizzle-orm';

// Works offline - queries local SQLite database
const db = await getLocalDB();
const trips = await db
  .select()
  .from(cachedTrips)
  .where(eq(cachedTrips.userId, userId))
  .orderBy(desc(cachedTrips.cachedAt));
```

#### Worker Resolver Usage (Server)

```typescript
import { getServerDB, trips } from '@database/server';
import { eq } from 'drizzle-orm';

export const getTrips = async (_: any, args: any, context: any) => {
  const db = getServerDB(context.env.DB);
  const userTrips = await db
    .select()
    .from(trips)
    .where(eq(trips.userId, context.userId));
  return userTrips;
};
```

#### Get Database Statistics

```typescript
import { getDatabaseStats } from '@database/client';

const stats = await getDatabaseStats();
console.log(stats.entities.trips.count); // Number of cached trips
console.log(stats.pendingMutations.total); // Pending mutations
```

### System Status

The app includes a comprehensive system status page (`app/(app)/(profile)/system-status.tsx`) that shows:
- Network connectivity status
- Backend reachability
- Database statistics (entity counts, sync status, storage usage)
- Pending mutations queue
- Sync timestamps per entity type

### Technical Details

- **Sync Triggers**: On query/mutation completion (event-driven, no polling)
- **Performance**: Sync runs in background, doesn't block UI
- **Storage**: 
  - Apollo Cache: stored in `apollo_cache_entries` table (normalized GraphQL cache)
  - Drizzle Cache: `safarnak_local.db` (structured relational cache)
  - Server: Cloudflare D1 (SQLite via Drizzle)
- **ID Types**: All tables use UUID (text) IDs - consistent across server, client, and GraphQL
- **Schema Consistency**: Single source of truth (`database/schema.ts`) ensures server and client schemas stay in sync

For more details, see the offline architecture implementation in `database/` folder.

---
 
---

## 🤝 Contributing

Please read `docs/CONTRIBUTING.md` for setup, workflow, and PR checklist.

---

## 🧭 Code of Conduct

Community guidelines are in `docs/CODE_OF_CONDUCT.md`.

---

## 📝 Suggested Improvements & Roadmap

This section outlines potential features and improvements. These are suggestions, not commitments.

### 🎯 Priority Features (Near-term)

#### Offline & Sync Management
- **Offline Downloads Manager**: UI to manage cached trips, tours, and places for offline access
- **Sync Queue Screen**: View pending offline mutations with retry controls
- **Data Management**: Clear cache, view storage usage, selective data purge

#### Trip Planning Enhancements
- **Itinerary Editor**: Day-by-day editable view using `itineraries` table
- **AI Planner Chat**: Conversational interface for refining trips using `thoughts` table
- **Trip Map View**: Visual map showing trip activities and locations
- **Trip Export/Share**: Export itinerary as PDF or ICS calendar file

#### Explore & Discovery
- **Global Search**: Unified search across tours, places, locations, and users
- **Advanced Filters**: Price range, rating, duration, distance with saved filter sets
- **Bookmarks System**: Implement UI for `bookmarkTour` and `bookmarkPlace` mutations
- **Location/Tour/Place Indexes**: Dedicated browse pages for each content type

### 🚀 Future Enhancements

#### Social Features
- **Rich Post Composer**: Multi-image upload, location tagging, trip linking
- **Comments Thread**: Full-screen comment view with reactions
- **Enhanced User Profiles**: Public profiles with posts, trips, and places showcase

#### Profile & Settings
- **Travel Preferences**: Edit `user_preferences` (interests, budget, style, dietary)
- **Device Management**: View and revoke logged-in devices using `devices` table
- **Billing History**: Detailed payment history with receipts from `payments` table
- **Notification Settings**: Per-category notification preferences

#### Commerce
- **My Bookings**: List of purchased tours from `payments.tourId`
- **Booking Details**: Receipt, cancellation, refund status
- **Checkout Flow**: Dedicated checkout page with payment integration

### 💡 Where We're Going

The project is currently at **v1.13.0**. Our focus is on:

1. **Stability**: Fixing authentication security issues, adding input validation
2. **Core Features**: Completing trip planning, explore, and social features
3. **Offline Support**: ✅ **Implemented** - Shared Drizzle schema with automatic Apollo → Drizzle sync (see [Offline-First Architecture](#-offline-first-architecture) section)
4. **Testing**: Adding unit and integration tests
5. **Documentation**: ✅ **Updated** - Comprehensive docs in README

See `docs/refactor-work-report.md` and `docs/docs-inventory-review.md` for current cleanup priorities.

## 📄 License

MIT

---

## 🔗 Resources

- [Expo Docs](https://docs.expo.dev/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [GraphQL Codegen](https://the-guild.dev/graphql/codegen)
- [Drizzle ORM](https://orm.drizzle.team/)

Built with ❤️ using Expo, Cloudflare Workers, and GraphQL Codegen
