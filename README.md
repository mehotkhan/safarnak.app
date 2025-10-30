# 🌍 Safarnak

> **سفرناک** - A modern offline-first travel companion built with Expo React Native and Cloudflare Workers

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-green)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54-purple)](https://expo.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![GraphQL Codegen](https://img.shields.io/badge/GraphQL-Codegen-purple)](https://the-guild.dev/graphql/codegen)
[![New Architecture](https://img.shields.io/badge/New%20Architecture-Enabled-green)](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Version](https://img.shields.io/badge/Version-0.8.0-blue)](https://github.com/mehotkhan/safarnak.app/releases)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Passing-green)](https://github.com/mehotkhan/safarnak.app/actions)

**Live Demo**: [safarnak.mohet.ir](https://safarnak.mohet.ir) | **Download APK**: [Latest Release](https://github.com/mehotkhan/safarnak.app/releases)

---

## Table of Contents
- [What is This?](#-what-is-this)
- [Architecture Overview](#-architecture-overview)
- [Quick Start](#-quick-start)
- [Codebase Structure](#-codebase-structure)
- [Template System](#-template-system)
- [How to Add New Features](#-how-to-add-new-features)
- [Configuration](#-configuration)
- [Common Commands](#-common-commands)
- [Technology Stack](#-technology-stack)
- [Development Tips](#-development-tips)
- [Authentication Flow](#-authentication-flow)
- [Internationalization](#-internationalization)
- [Key Concepts](#-key-concepts)
- [License](#-license)
- [Resources](#-resources)

## 📚 What is This?

A full-stack **Android-only** travel app with **perfect separation** between client (React Native) and server (Cloudflare Workers) code in a **single-root monorepo**.

### Key Concepts

- **Client** (React Native): Expo app with Redux, Apollo Client, NativeWind v4 styling, offline-first architecture
- **Server** (Cloudflare Workers): Serverless GraphQL API with Cloudflare D1 database
- **Shared** (GraphQL): Type-safe GraphQL schema shared between client and server
- **Worker-Only** (Drizzle): Database schema only used in worker, never in client
- **Styling**: NativeWind v4 (Tailwind CSS) for utility-first React Native styling
- **Codegen**: Auto-generates TypeScript types and React hooks from GraphQL schema

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

- Node.js 20+
- Yarn package manager

### Setup (5 minutes)

```bash
# Clone and install
git clone https://github.com/mehotkhan/safarnak.app.git
cd safarnak.app
yarn install

# Setup database
yarn db:migrate

# Generate GraphQL types
yarn codegen

# Start development
yarn dev  # Runs both worker (8787) and client (8081)
```

### Run on Device

```bash
yarn android           # Android (legacy)
yarn android:newarch   # Android (New Architecture)
yarn web               # Web browser
```

**Note**: This app primarily targets Android. iOS support is available but not actively tested. The codebase supports iOS/Android/Web through Expo.

---

## 📁 Codebase Structure

### Client-Side (What You'll Modify Most)

```
app/                    # 📱 Expo Router file-based pages
├── auth/              # Authentication pages
│   ├── login.tsx     # Login page (auto-redirect if logged in)
│   └── register.tsx   # Registration page
└── (tabs)/            # Main app tabs
    ├── index.tsx      # Home screen
    ├── tour.tsx       # Tours list
    └── profile.tsx    # User profile

components/            # 🎨 Reusable UI components
├── AuthWrapper.tsx    # Authentication guard
├── MapView.tsx        # Map component
└── context/           # React contexts (language, theme)

api/                    # 🌐 GraphQL client (auto-generated)
├── hooks.ts           # ✨ Generated React hooks
├── types.ts           # ✨ Generated TypeScript types
└── client.ts          # Apollo Client setup

store/                  # 📦 Redux state
├── slices/            # State slices
│   ├── authSlice.ts   # Auth state
│   └── themeSlice.ts  # Theme state
└── middleware/        # Redux middleware
    └── offlineMiddleware.ts  # Offline queue

constants/              # 📋 App configuration
hooks/                   # 🪝 Custom React hooks
locales/                 # 🌍 i18n translations (en, fa)
global.css              # 🎨 Tailwind CSS directives (NativeWind)
tailwind.config.js      # 🎨 Tailwind configuration
babel.config.js         # ⚙️ Babel config (NativeWind preset)
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

database/              # 🗄️ Database schemas (worker-only, not used by client)
├── drizzle.ts        # Drizzle ORM schema
└── migrations/       # SQL migrations
```

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

## 🧩 Template System

Safarnak leverages a local, untracked UI Template located at `Template/` for rapid UI scaffolding and visual consistency. This folder is intentionally ignored by Git (see `.gitignore`) so it remains a local-only resource during development.

- Source Template repo: `git@github.com:saurabhparyani/avent.git`
- Local path: `Template/`
- Purpose: Reference styles, flows, and components (e.g., `CustomButton`, `InputField`, `OAuth`, `(auth)` and `(tabs)` layouts) to redesign Safarnak screens.

Guidelines:

1. Do not import code directly from `Template/` into app modules. Instead, port patterns into `components/`, `constants/`, and `app/` with our path aliases and TypeScript style.
2. Keep `Template/` updated locally by recloning or pulling the upstream repo if needed. It will never be committed.
3. When adopting UI patterns, prefer shared components in `components/ui/` and align theme tokens in `constants/Colors.ts`.
4. Preserve our GraphQL, Redux, and offline-first architecture; UI changes should remain presentation-layer only.

Migration plan snapshot:

- Port `CustomButton`, `InputField`, `OAuth` into `components/ui/` with path aliases.
- Redesign `app/auth/login.tsx` and `app/auth/register.tsx` to match Template visuals.
- Align tab layout visuals to Template’s `(tabs)` screens while retaining our routes: `index`, `tour`, `profile`.
- Integrate primary/neutral colors from Template into `constants/Colors.ts` without breaking dark mode.

---

## 💡 How to Add New Features

### Adding a GraphQL Query/Mutation

1. **Define in GraphQL Schema**:
```graphql
# graphql/schema.graphql
type Query {
  getTours: [Tour!]!
}
```

2. **Create Operation File**:
```graphql
# graphql/queries/getTours.graphql
query GetTours {
  getTours {
      id
      name
    location
  }
}
```

3. **Run Codegen**:
```bash
yarn codegen
```

4. **Implement Resolver**:
```typescript
// worker/queries/getTours.ts
export const getTours = async (_: any, __: any, context: any) => {
  const db = drizzle(context.env.DB);
  return await db.select().from(tours).all();
};
```

5. **Use in Component**:
```typescript
import { useGetToursQuery } from '@api';

function ToursScreen() {
  const { data, loading } = useGetToursQuery();
  // ...use data
}
```

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
GRAPHQL_URL=https://safarnak.mohet.ir/graphql
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

**Auth Pages**: `app/auth/login.tsx` and `app/auth/register.tsx`  
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

Supports English and Persian (Farsi) with automatic RTL:

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

## 📄 License

MIT

---

## 🔗 Resources

- [Expo Docs](https://docs.expo.dev/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [GraphQL Codegen](https://the-guild.dev/graphql/codegen)
- [Drizzle ORM](https://orm.drizzle.team/)

Built with ❤️ using Expo, Cloudflare Workers, and GraphQL Codegen
