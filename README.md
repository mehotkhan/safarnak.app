# 🌍 Safarnak App

> A full-stack offline-first travel application built with Expo React Native and Cloudflare Workers

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-green)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54-purple)](https://expo.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)

## ✨ Features

- **🌐 Offline-First** - Works seamlessly without internet connection
- **⚡ Real-Time** - GraphQL subscriptions for live updates
- **📱 Cross-Platform** - iOS, Android, and Web support
- **🌍 i18n** - English and Persian (Farsi) with RTL support
- **🔐 Secure Auth** - PBKDF2 password hashing with token-based authentication
- **🎨 Modern UI** - Custom components with dark mode support
- **📊 Type-Safe** - Full TypeScript coverage across client and server

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

### Environment Priority

1. **EAS Build Variables** - Set in `eas.json` for builds
2. **Process Environment** - From `.env` file
3. **Hardcoded Fallbacks** - Development/production defaults

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Apply database migrations
yarn db:migrate

# Start development server (both client & worker)
yarn dev

# Or start separately:
yarn worker:dev  # Start Cloudflare Worker (port 8787)
yarn start       # Start Expo dev server (port 8081)
```

### Run on Device

```bash
# Android
yarn android

# iOS  
yarn ios

# Web
yarn web
```

## 🏗️ Architecture

Safarnak uses a **unified single-root monorepo** architecture where both client and worker share the same codebase:

```
┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│   React Native      │       │  Cloudflare Worker  │       │   SQLite/D1 DB      │
│   Client App        │◄─────►│   GraphQL API       │◄─────►│   Drizzle ORM       │
│                     │       │                     │       │                     │
│ • Expo Router       │       │ • GraphQL Yoga      │       │ • Shared Schema     │
│ • Redux + Persist   │       │ • Subscriptions     │       │ • Migrations        │
│ • Apollo Client     │       │ • Resolvers         │       │ • Type Safety       │
│ • Offline SQLite    │       │ • Auth Middleware   │       │                     │
└─────────────────────┘       └─────────────────────┘       └─────────────────────┘
```

## 📁 Project Structure

```
safarnak.app/
├── worker.ts              # ⚡ Cloudflare Worker entry point
├── resolvers/             # 🔧 GraphQL resolvers (server-side only)
│   ├── queries.ts         # Query resolvers (getMessages, me)
│   ├── mutations.ts       # Mutation resolvers (register, login, addMessage)
│   ├── subscriptions.ts   # Subscription resolvers (newMessages)
│   ├── utils.ts           # Password hashing, token generation
│   └── index.ts           # Combined resolver exports
├── graphql/               # 📡 Shared GraphQL (client & worker)
│   ├── schema.ts          # GraphQL type definitions
│   ├── queries.ts         # Client-side query strings
│   ├── types.ts           # TypeScript interfaces
│   └── index.ts           # Shared exports
├── drizzle/               # 🗄️ Database layer
│   ├── schema.ts          # Database schema (users, messages, tours, etc.)
│   └── migrations/        # SQL migration files
├── app/                   # 📱 Expo Router pages
│   ├── _layout.tsx        # Root layout with providers
│   ├── login.tsx          # Login screen
│   └── (tabs)/            # Tab navigation
│       ├── index.tsx      # Home/Map screen
│       ├── tour.tsx       # Tours screen
│       └── profile.tsx    # User profile
├── components/            # 🎨 UI Components
│   ├── AuthWrapper.tsx    # Authentication guard
│   ├── MapView.tsx        # Interactive map component
│   ├── context/           # React contexts
│   └── ui/                # Themed UI components
├── api/                   # 🌐 Apollo Client setup
│   ├── client.ts          # Apollo Client configuration
│   └── queries.ts         # Wrapped GraphQL queries
├── redux/                 # 📦 Redux state management
│   ├── store.ts           # Redux store with persist
│   ├── authSlice.ts       # Authentication state
│   └── offlineMiddleware.ts # Offline queue handling
├── hooks/                 # 🪝 Custom React hooks
├── constants/             # 📋 App constants
├── locales/               # 🌍 i18n translations (en, fa)
├── metro.config.js        # Metro bundler config
├── wrangler.toml          # Cloudflare Workers config
├── drizzle.config.ts      # Database configuration
├── eslint.config.mjs      # ESLint flat config
└── tsconfig.json          # TypeScript configuration
```

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo** | ~54 | React Native framework |
| **React Native** | 0.81.5 | Mobile UI framework |
| **Expo Router** | ~6 | File-based navigation |
| **Redux Toolkit** | ^2.9 | State management |
| **Apollo Client** | 3.8 | GraphQL client |
| **react-i18next** | ^16.1 | Internationalization |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Cloudflare Workers** | - | Serverless runtime |
| **GraphQL Yoga** | ^5.16 | GraphQL server |
| **Cloudflare D1** | - | SQLite database |
| **Drizzle ORM** | ^0.44 | Type-safe ORM |
| **graphql-workers-subscriptions** | ^0.1.6 | Real-time subscriptions |

### Shared
| Technology | Version | Purpose |
|------------|---------|---------|
| **TypeScript** | ~5.9 | Type safety |
| **ESLint** | ^9.38 | Code linting |
| **Prettier** | ^3.6 | Code formatting |

## 📋 Available Scripts

### Development
```bash
yarn dev              # Start both worker and client concurrently
yarn start            # Start Expo dev server only
yarn worker:dev       # Start Cloudflare Worker only
yarn android          # Run on Android
yarn ios              # Run on iOS
yarn web              # Run on web
```

### Database
```bash
yarn db:generate      # Generate migrations from schema
yarn db:migrate       # Apply migrations to local D1
yarn db:studio        # Open Drizzle Studio (port 4983)
```

### Code Quality
```bash
yarn lint             # Run ESLint
yarn lint:fix         # Fix ESLint issues
yarn format           # Format code with Prettier
```

### Build
```bash
yarn build:debug      # Build debug APK with EAS
yarn build:release    # Build release APK with EAS
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
```

### Environment Variables

Create `app.config.js` with your configuration:

```javascript
export default {
  extra: {
    APP_NAME: "Safarnak",
    APP_SCHEME: "safarnak",
    graphqlUrl: "http://192.168.1.51:8787/graphql"
  }
};
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

## 🧪 Development Tips

1. **Metro Cache Issues**: Run `yarn clean` if you encounter bundling errors
2. **Database Reset**: Delete `.wrangler/state/v3/d1/` and run `yarn db:migrate`
3. **Worker Logs**: Check terminal where `yarn worker:dev` is running
4. **Type Errors**: Ensure both client and worker are using shared types from `graphql/`

## 📝 Code Style

- **ESLint**: Flat config with TypeScript, React, and React Native rules
- **Prettier**: Single quotes, no semicolons, trailing commas
- **TypeScript**: Strict mode enabled
- **Imports**: Use path aliases, avoid relative imports

## 🤝 Contributing

1. Follow the existing code style
2. Use path aliases (`@/`, `@components/`, `@graphql/`)
3. Run `yarn lint:fix` before committing
4. Ensure TypeScript types are correct
5. Test both online and offline scenarios

## 📄 License

MIT

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)
- [React Navigation](https://reactnavigation.org/)

---

Built with ❤️ using Expo and Cloudflare Workers
