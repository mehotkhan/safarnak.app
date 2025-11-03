# 🌍 Safarnak

> **سفرناک** - A modern offline-first travel companion built with Expo React Native and Cloudflare Workers

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-green)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54-purple)](https://expo.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![GraphQL Codegen](https://img.shields.io/badge/GraphQL-Codegen-purple)](https://the-guild.dev/graphql/codegen)
[![New Architecture](https://img.shields.io/badge/New%20Architecture-Enabled-green)](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Version](https://img.shields.io/badge/Version-0.17.0-blue)](https://github.com/mehotkhan/safarnak.app/releases)
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
- [Offline-First Plan (Summary)](#-offline-first-plan-summary)
- [Technical Review & Checklist (Summary)](#-technical-review--checklist-summary)
- [Contributing](#-contributing)
- [Code of Conduct](#-code-of-conduct)
- [Suggested Improvements](#-suggested-improvements)
- [License](#-license)
- [Resources](#-resources)

## 📚 What is This?

**Safarnak** (سفرناک) is a full-stack **offline-first travel companion** that helps users discover destinations, plan trips, and share travel experiences. Built with **React Native** (Expo) and **Cloudflare Workers**, it uses a **single-root monorepo** architecture with clear separation between client and server code.

### Key Concepts

- **Client** (React Native): Expo app with Redux state management, Apollo Client for GraphQL, NativeWind v4 for styling, and offline-first architecture
- **Server** (Cloudflare Workers): Serverless GraphQL API using GraphQL Yoga, with Cloudflare D1 (SQLite) database
- **Shared** (GraphQL): Type-safe GraphQL schema and operations shared between client and worker
- **Worker-Only** (Drizzle ORM): Database schemas only used in worker code, **never imported in client**
- **Styling**: NativeWind v4 (Tailwind CSS) for utility-first React Native styling
- **Codegen**: Auto-generates TypeScript types and React Apollo hooks from GraphQL schema

### 📖 Learning Path for New Developers

If you're new to this project, follow this path to get up to speed:

#### Day 1: Setup & Understanding
1. **Quick Start** (15 min) → Clone, install, and run the app locally
2. **Architecture Overview** (10 min) → Understand the system architecture and data flow
3. **Codebase Structure** (15 min) → Explore folder organization and key files

#### Day 2: Core Concepts
4. **GraphQL Workflow** (20 min) → Learn how schema → codegen → hooks works
5. **Key Concepts** (10 min) → Understand perfect separation (client/worker/shared)
6. **Routing & URLs** (10 min) → Learn Expo Router file-based routing

#### Day 3: Hands-On Practice
7. **How to Add Features** (30 min) → Follow the complete workflow example
8. **Styling with NativeWind** (15 min) → Learn Tailwind CSS for React Native
9. **Authentication Flow** (10 min) → Understand how auth works

#### Day 4: Advanced Topics
10. **Offline-First Plan** (15 min) → Understand the local-first architecture
11. **Technical Review** (20 min) → Be aware of current limitations and priorities
12. **Contributing Guide** → Read `CONTRIBUTING.md` for PR guidelines

#### Quick Reference
- **Need to add a feature?** → See "How to Add New Features"
- **Having issues?** → Check "Development Tips"
- **Want to understand architecture?** → Read "Architecture Overview"
- **Looking for what's next?** → Check "Suggested Improvements & Roadmap"

---

## 🏗️ Architecture Overview

### System Architecture

```mermaid
flowchart LR
  subgraph Client["React Native Client Expo"]
    A["app/ - Expo Router pages"]
    B["components/ - UI and contexts"]
    C["store/ - Redux with Persist"]
    D["api/ - Apollo Client with generated hooks"]
  end

  subgraph Shared["Shared"]
    E["graphql/ - Schema and Operations"]
    F["database/ - DB schemas"]
  end

  subgraph Worker["Cloudflare Worker GraphQL API"]
    G["worker/ - Resolvers and GraphQL Yoga"]
    H["D1 Database SQLite"]
  end

  A --> D
  B --> D
  C --> D
  D <-->|HTTPS GraphQL| G
  G --> H
  E --> D
  E --> G
  F --> G
  F --> H
```

### Runtime Data Flow (example: Login)

```mermaid
sequenceDiagram
  participant U as User
  participant RN as React Native App
  participant AP as Apollo Client
  participant API as GraphQL API Worker
  participant DB as D1 SQLite

  U->>RN: Tap Login
  RN->>AP: login username password
  AP->>API: POST graphql login
  API->>DB: Verify credentials PBKDF2
  DB-->>API: user row
  API-->>AP: user token
  AP->>RN: Update Redux and Persist
  RN-->>U: Navigate to tabs
```

### Dev-time GraphQL Pipeline

```mermaid
flowchart LR
  SCHEMA["graphql/schema.graphql"]
  OPS["graphql/queries/*.graphql"]
  CODEGEN["yarn codegen"]
  TYPES["api/types.ts"]
  HOOKS["api/hooks.ts"]
  APP["app/* uses @api hooks"]

  SCHEMA --> CODEGEN
  OPS --> CODEGEN
  CODEGEN --> TYPES
  CODEGEN --> HOOKS
  HOOKS --> APP
  TYPES --> APP
```

### Offline-first Flow (client)

```mermaid
flowchart LR
  MUT["Dispatch mutation"]
  MID["offlineMiddleware"]
  NET{"Online?"}
  QUEUE["Persist queue AsyncStorage"]
  SEND["Apollo mutate"]
  RETRY["On reconnect"]

  MUT --> MID
  MID --> NET
  NET -- No --> QUEUE
  NET -- Yes --> SEND
  QUEUE --> RETRY --> SEND
```

### How It Works

1. **Define GraphQL Schema** (`graphql/schema.graphql`) - Shared between client and worker
2. **Define Operations** (`graphql/queries/*.graphql`) - Queries and mutations
3. **Run Codegen** - Auto-generates TypeScript types and React hooks in `api/`
4. **Implement Resolvers** (`worker/queries/`, `worker/mutations/`) - Server-side logic
5. **Use in App** (`app/`, `components/`) - Import generated hooks from `@api`

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
# Android (New Architecture - recommended)
yarn android:newarch

# Android (Legacy Architecture)
yarn android

# Web browser
yarn web

# iOS (macOS only, not actively tested)
yarn ios
```

### First Time Setup Tips

- **Worker URL**: If you see connection errors, check that the worker is running on port 8787
- **GraphQL Playground**: Visit `http://localhost:8787/graphql` to test GraphQL queries
- **Metro Bundler**: If you see cache issues, run `yarn clean` and restart
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

components/                   # 🎨 Reusable UI components
├── AuthWrapper.tsx          # Authentication guard (redirects unauthenticated)
├── MapView.tsx              # Interactive map component (Leaflet-based)
├── context/                 # React contexts
│   ├── LanguageContext.tsx  # Language switching (EN/FA)
│   ├── LanguageSwitcher.tsx # Language selector UI
│   └── ThemeContext.tsx     # Dark/light theme management
└── ui/                      # Themed UI components
    ├── Themed.tsx           # Theme-aware View/Text
    ├── CustomText.tsx       # i18n-aware text with font weights
    ├── CustomButton.tsx     # Styled button component
    ├── InputField.tsx       # Form input with icons
    ├── TextArea.tsx         # Multi-line text input
    ├── DatePicker.tsx       # Date selection component
    ├── Divider.tsx          # Section divider
    ├── ThemeToggle.tsx      # Dark mode toggle
    └── OfflineIndicator.tsx # Network status indicator

api/                          # 🌐 GraphQL client layer
├── hooks.ts                 # ✨ Auto-generated React Apollo hooks
├── types.ts                 # ✨ Auto-generated TypeScript types
├── client.ts                # Apollo Client setup (auth, cache, links)
├── utils.ts                 # API utilities (storage, error handling)
├── api-types.ts             # API-specific types (ApiError, ApiResponse)
└── index.ts                 # Main exports (re-exports hooks)

store/                        # 📦 Redux Toolkit state management
├── index.ts                 # Store configuration with Redux Persist
├── hooks.ts                 # Typed hooks (useAppDispatch, useAppSelector)
├── slices/                  # Redux slices
│   ├── authSlice.ts         # Authentication state (user, token, isAuthenticated)
│   └── themeSlice.ts        # Theme state (isDark)
└── middleware/              # Redux middleware
    └── offlineMiddleware.ts # Offline mutation queue

constants/                    # 📋 App constants
├── app.ts                   # App-wide constants
├── Colors.ts                # Color palette (light/dark themes)
└── index.ts                 # Exports

hooks/                        # 🪝 Custom React hooks
├── useColorScheme.ts        # System color scheme hook
├── useClientOnlyValue.ts    # Platform-specific value hook
├── useFontFamily.ts         # Font family hook
└── useGraphBackendReachable.ts # Network connectivity hook

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
├── queries/           # Query resolvers (getMessages, me)
├── mutations/        # Mutation resolvers (register, login)
└── subscriptions/    # Subscription resolvers (newMessages)

graphql/               # 📡 Shared GraphQL
├── schema.graphql    # GraphQL schema (shared)
└── queries/          # Query definitions (.graphql files)

database/              # 🗄️ Database schemas (worker-only)
├── drizzle.ts        # Drizzle ORM schema
└── migrations/       # SQL migrations
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
    USERS ||--o{ SUBSCRIPTIONS : has
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
    TRIPS ||--o{ PLANS : based_on
    TRIPS ||--o{ THOUGHTS : generated_by
    TRIPS ||--o{ MESSAGES : discusses

    TOURS ||--o{ TRIPS : includes
    TOURS ||--o{ PAYMENTS : requires
    TOURS ||--o{ NOTIFICATIONS : sends

    PLANS ||--o{ LOCATIONS : includes
    PLANS ||--o{ PLACES : visits

    POSTS ||--o{ COMMENTS : has
    POSTS ||--o{ REACTIONS : has
    POSTS ||--|{ TRIPS : shares
    POSTS ||--|{ TOURS : shares
    POSTS ||--|{ PLANS : shares

    LOCATIONS ||--o{ PLACES : contains

    CACHE }|..|{ EXTERNAL_API : stores

    SUBSCRIPTIONS ||--|{ USERS : for
    SUBSCRIPTIONS ||--o{ PAYMENTS : via

    USERS {
        int id PK
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
        int id PK
        int userId FK
        json interests
        json budgetRange
        string travelStyle
        json preferredDestinations
        json dietaryRestrictions
        string embedding "Vectorize"
        timestamp updatedAt
    }

    TRIPS {
        int id PK
        int userId FK
        string title
        date startDate
        date endDate
        string destination
        int budget
        string status
        boolean aiGenerated
        json metadata
        timestamp createdAt
        timestamp updatedAt
    }

    ITINERARIES {
        int id PK
        int tripId FK
        int day
        json activities
        json accommodations
        json transport
        string notes
        int costEstimate
        timestamp createdAt
        timestamp updatedAt
    }

    PLANS {
        int id PK
        int tripId FK
        json mapData "stops, directions"
        json details
        string aiOutput
        timestamp createdAt
    }

    TOURS {
        int id PK
        int creatorId FK "USERS"
        string title
        text description
        int price
        json participants "array userIds"
        string groupChatId
        boolean isActive
        timestamp createdAt
        timestamp updatedAt
    }

    MESSAGES {
        string id PK
        text content
        int userId FK
        int tripId FK
        int tourId FK
        string type
        json metadata
        boolean isRead
        timestamp createdAt
    }

    POSTS {
        int id PK
        int userId FK
        text content
        json attachments "R2 URLs"
        string type "plan/trip/tour"
        int relatedId "trip/tour/plan Id"
        timestamp createdAt
    }

    COMMENTS {
        int id PK
        int postId FK
        int userId FK
        text content
        timestamp createdAt
    }

    REACTIONS {
        int id PK
        int postId FK
        int commentId FK
        int userId FK
        string emoji
        timestamp createdAt
    }

    PAYMENTS {
        int id PK
        int userId FK
        int tourId FK
        int subscriptionId FK
        string transactionId
        int amount
        string status
        timestamp createdAt
    }

    SUBSCRIPTIONS {
        int id PK
        int userId FK
        string tier "free/member/pro"
        date startDate
        date endDate
        boolean active
        timestamp createdAt
    }

    DEVICES {
        int id PK
        int userId FK
        string deviceId UK
        string type
        timestamp lastSeen
    }

    SESSIONS {
        string id PK "KV key"
        int userId FK
        string token
        timestamp expiresAt
    }

    NOTIFICATIONS {
        int id PK
        int userId FK
        string type "tour invite/payment/etc"
        json data
        boolean read
        timestamp createdAt
    }

    LOCATIONS {
        int id PK
        string name UK
        string country
        json coordinates
        text description
        json popularActivities
        int averageCost
        string embedding "Vectorize"
        string imageUrl "R2"
        timestamp createdAt
    }

    PLACES {
        int id PK
        string name
        int locationId FK
        string type "market/room/etc"
        text description
        int price
        string ownerId "userId"
        json coordinates
        string embedding "Vectorize"
        string imageUrl "R2"
        timestamp createdAt
    }

    THOUGHTS {
        int id PK
        int tripId FK
        text step "AI reasoning step"
        json data "logs/sources"
        timestamp createdAt
    }

    CACHE {
        string key PK "KV key"
        json value "cached API data"
        timestamp expiresAt
    }
```

### Data Storage Architecture

- **D1 (Relational DB with Drizzle)**: Users, user preferences, trips, itineraries, plans, tours, messages, posts, comments, reactions, payments, subscriptions (tiers), devices, notifications, locations, places, thoughts.
- **KV (Key-Value Store)**: Sessions (user tokens), cache (external API data like TripAdvisor, web searches).
- **Vectorize (Vector DB)**: Embeddings (user preferences, destinations, places, activities for similarity searches).
- **R2 (Object Storage)**: Avatars, image URLs, galleries, attachments (media, maps, docs).
- **Durable Objects**: Real-time subscriptions (connection state for GraphQL subs, notifications).

### Shared (Critical)

- **`graphql/`** - GraphQL schema and operations (shared between client & worker)
- **`database/`** - Database schemas (worker-only, used ONLY in worker code)
- **`api/`** - Auto-generated client code (run `yarn codegen` to update)

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
import { drizzle } from 'drizzle-orm/d1';
import { tours } from '@database/drizzle';
import { eq, and } from 'drizzle-orm';

export const getTours = async (
  _: any,
  { category, limit }: { category?: string; limit?: number },
  context: any
) => {
  const db = drizzle(context.env.DB);
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
import { useGetToursQuery } from '@api';
import { ActivityIndicator, View } from 'react-native';

export default function ToursScreen() {
  const { data, loading, error } = useGetToursQuery({
    variables: { category: 'adventure', limit: 10 }
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
// components/TourCard.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { CustomText } from '@components/ui/CustomText';

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
import { useAppDispatch } from '@store/hooks';
```

### Adding to Redux Store

1. **Create Slice**:
```typescript
// store/slices/toursSlice.ts
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
// store/index.ts
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
2. `process.env.GRAPHQL_URL` (development only)
3. `process.env.GRAPHQL_URL_DEV` when `__DEV__` is true
4. Fallback in dev to `http://192.168.1.51:8787/graphql`

Configure production and development endpoints via environment variables used by `app.config.js`:

```bash
# .env
GRAPHQL_URL=https://safarnak.app/graphql
# Optionally for local dev
GRAPHQL_URL_DEV=http://127.0.0.1:8787/graphql
```

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
import { useAppDispatch } from '@store/hooks';
import { login } from '@store/slices/authSlice';
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
yarn db:migrate       # Apply migrations
yarn db:studio        # Open Drizzle Studio

# GraphQL
yarn codegen          # Generate types & hooks
yarn codegen:watch    # Watch mode

# Build
yarn android          # Run on Android
yarn build:debug      # EAS debug build (Android)
yarn build:release    # Build release APK
yarn build:local      # Local gradle release build

# Utilities
yarn clean            # Clear caches
yarn lint             # Check code quality
yarn lint:fix         # Fix issues
 
# Versioning & Commits
yarn commit:generate  # Generate a conventional commit message
yarn version:minor    # Release-it minor bump (CI)
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React Native 0.81.5 | Mobile UI |
| **Backend** | Cloudflare Workers | Serverless API |
| **Database** | Cloudflare D1 (SQLite) | Server database |
| **GraphQL** | GraphQL Yoga 5.16.0 | API layer |
| **ORM** | Drizzle 0.44.7 | Type-safe queries (worker-only) |
| **Styling** | NativeWind 4.1.21 + Tailwind CSS 3.4.17 | Utility-first CSS |
| **State** | Redux Toolkit 2.9.2 | Client state |
| **Codegen** | GraphQL Codegen 6.0.1 | Auto-generate types |
| **Router** | Expo Router 6.0.13 | File-based routing |

**Full stack**: TypeScript 5.9, ESLint, Prettier, React i18next, New Architecture enabled

---

## 🧪 Development Tips

1. **Metro Cache Issues**: Run `yarn clean`
2. **Database Reset**: Delete `.wrangler/state/v3/d1/` and run `yarn db:migrate`
3. **Type Errors**: Run `yarn codegen` to regenerate types
4. **GraphQL Changes**: Always run `yarn codegen` after schema changes
5. **Worker Logs**: Check terminal running `yarn worker:dev`
6. **Worker URL**: `http://127.0.0.1:8787/graphql` (or `http://localhost:8787/graphql`)
7. **Styling Issues**: Ensure `global.css` is imported in `app/_layout.tsx`, check `tailwind.config.js` content paths
8. **NativeWind Not Working**: Clear Metro cache and restart: `yarn clean && yarn start`

---

## 🔐 Authentication Flow

1. User logs in → Client calls `login` mutation
2. Worker validates → Returns user + token
3. Client stores → Redux + AsyncStorage
4. Apollo adds token → Automatic auth headers
5. Auto-redirect → Logged-in users can't access auth pages

**Auth Pages**: `app/(auth)/login.tsx`, `app/(auth)/register.tsx`, `app/(auth)/welcome.tsx`  
**Auth Guard**: `components/AuthWrapper.tsx`

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
- **`api/`** - Auto-generated client code only (client-side GraphQL hooks)
- **`worker/`** - Server-only resolvers (entry: `worker/index.ts`)
- **`database/`** - Worker-only database schemas (never imported in client code)

### Auto-Generated Code

**Never manually edit**:
- `api/hooks.ts` - Generated React hooks
- `api/types.ts` - Generated TypeScript types

These are generated from `graphql/schema.graphql` and `graphql/queries/*.graphql`.

### Path Aliases

Always use aliases, never relative imports:
- ✅ `@api`, `@store/hooks`, `@hooks/useColorScheme`
- ❌ `../../api`, `../store/hooks`

---

## 📶 Offline-First Plan (Summary)

This app follows a local-first approach with background sync. Highlights:

- Shared SQLite-first schema: keep server D1 and client DB schemas aligned; consider a shared `@dbschema` later
- Platform DB adapters: expo-sqlite (native) and PGlite (web); strict platform gating
- Data access: read from local DB first; network fetch upserts into local; writes are optimistic with a pending queue
- Sync engine: push pending mutations (backoff, idempotent IDs) and pull deltas via server `since` params
- Conflict resolution: last-write-wins via `updatedAt`; server canonicalizes
- Apollo: treat as network layer; optional cache persistence if Drizzle fully backs UI
- Networking: NetInfo + HEAD probe to drive sync and gates
- Client schema/versioning: `schema_version`, `lastSyncAt` tracking and light migrations
- Security: avoid sensitive data in client DB; plan for encryption if needed

See `OFFLINE_PLAN.md` for full details.

---

## 🔍 Technical Review & Checklist (Summary)

Top risks (from v0.9.4 review):

- Auth verification missing on server; `x-user-id` is trusted; tokens unsigned and unverified
- Error exposure in prod (`maskedErrors: false`)
- Limited input validation beyond `createTrip`
- No unit/integration tests; relaxed linting rules

Priority actions:

- Implement signed token verification (HMAC or JWT) and derive `context.userId` from verified token only
- Remove `x-user-id` usage; enable `maskedErrors: true` in production
- Add zod validation to all resolvers and ownership checks to user-scoped ops
- Establish a minimal test suite (auth + trips) and tighten ESLint gradually

See `TECHNICAL_REVIEW.md` for the complete checklist.

---

## 🤝 Contributing

Please read `CONTRIBUTING.md` for setup, workflow, and PR checklist.

---

## 🧭 Code of Conduct

Community guidelines are in `CODE_OF_CONDUCT.md`.

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

The project is currently at **v0.17.0** (alpha stage). Our focus is on:

1. **Stability**: Fixing authentication security issues, adding input validation
2. **Core Features**: Completing trip planning, explore, and social features
3. **Offline Support**: Implementing the full offline-first architecture plan
4. **Testing**: Adding unit and integration tests
5. **Documentation**: Improving developer experience and onboarding

See `TECHNICAL_REVIEW.md` for current technical debt and priorities.

## 📄 License

MIT

---

## 🔗 Resources

- [Expo Docs](https://docs.expo.dev/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [GraphQL Codegen](https://the-guild.dev/graphql/codegen)
- [Drizzle ORM](https://orm.drizzle.team/)

Built with ❤️ using Expo, Cloudflare Workers, and GraphQL Codegen
