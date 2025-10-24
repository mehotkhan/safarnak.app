# 🌍 Safarnak

> **سفرناک** - A modern offline-first travel companion built with Expo React Native and Cloudflare Workers

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-green)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54-purple)](https://expo.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![New Architecture](https://img.shields.io/badge/New%20Architecture-Enabled-green)](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**Live Demo**: [safarnak.mohet.ir](https://safarnak.mohet.ir) | **Download APK**: [Latest Release](https://github.com/mehotkhan/safarnak.app/releases)

## ✨ Key Features

- **🌐 Offline-First** - Works seamlessly without internet connection
- **⚡ Real-Time** - GraphQL subscriptions for live updates  
- **📱 Cross-Platform** - iOS, Android, and Web support
- **🌍 Bilingual** - English and Persian (Farsi) with RTL support
- **🔐 Secure** - PBKDF2 password hashing with token-based authentication
- **🎨 Modern UI** - Custom components with dark mode support
- **📊 Type-Safe** - Full TypeScript coverage across client and server
- **🚀 Performance** - React Native New Architecture (Fabric + TurboModules)

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
│ • New Architecture  │       │ • Auth Middleware   │       │                     │
│ • Offline SQLite    │       │ • Root Redirect     │       │                     │
└─────────────────────┘       └─────────────────────┘       └─────────────────────┘
```

## 📁 Project Structure

```
safarnak.app/
├── worker/                # ⚡ Cloudflare Worker (server-side only)
│   ├── index.ts           # Worker entry point + resolver exports + root redirect
│   ├── types.ts           # Shared resolver types
│   ├── queries/           # Query resolvers (getMessages, me)
│   ├── mutations/         # Mutation resolvers (register, login, addMessage)
│   ├── subscriptions/     # Subscription resolvers (newMessages)
│   └── utilities/         # Password hashing, token generation
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
├── store/                 # 📦 Additional Redux slices
│   ├── hooks.ts           # Typed Redux hooks
│   ├── index.ts           # Store exports
│   └── slices/            # Additional slices (theme, user)
├── hooks/                 # 🪝 Custom React hooks
├── constants/             # 📋 App constants
├── locales/               # 🌍 i18n translations (en, fa)
├── metro.config.js        # Metro bundler config
├── wrangler.toml          # Cloudflare Workers config
├── drizzle.config.ts      # Database configuration
├── eslint.config.mjs      # ESLint flat config
├── app.config.js          # Expo configuration with New Architecture
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
| **Redux Persist** | ^6.0 | State persistence |
| **Apollo Client** | 3.8 | GraphQL client |
| **react-i18next** | ^16.1 | Internationalization |
| **Drizzle ORM** | ^0.44 | Client-side SQLite |

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
yarn android          # Run on Android (Legacy Architecture)
yarn android:newarch  # Run on Android (New Architecture)
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

### New Architecture Configuration

The app supports React Native's New Architecture (Fabric + TurboModules) for better performance:

```javascript
// In app.config.js
newArchEnabled: 
  (process.env.NEW_ARCH === '1' || process.env.NEW_ARCH === 'true') || 
  isDebug || 
  isDevelopment
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

## 📝 Code Style

- **ESLint**: Flat config with TypeScript, React, and React Native rules
- **Prettier**: Single quotes, no semicolons, trailing commas
- **TypeScript**: Strict mode enabled
- **Imports**: Use path aliases, avoid relative imports

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/safarnak.app.git`
3. Install dependencies: `yarn install`
4. Apply migrations: `yarn db:migrate`
5. Start development: `yarn dev`

### Code Standards
- Follow existing code style and patterns
- Use path aliases (`@/`, `@components/`, `@graphql/`)
- Run `yarn lint:fix` before committing
- Ensure TypeScript types are correct
- Test both online and offline scenarios
- Test both Legacy and New Architecture

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
- [React Navigation](https://reactnavigation.org/)
- [React Native New Architecture](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)

---

Built with ❤️ using Expo and Cloudflare Workers