# Safarnak App

A full-stack travel application with offline-first capabilities, built with Expo React Native and Cloudflare Workers.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development (both worker and client)
yarn dev

# Run on Android device
yarn client:android

# Build Persian apps
yarn build:debug      # تسفرناک (debug APK)
yarn build:release     # سقرناک (release APK)
```

## 📱 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   Worker API    │    │   Database      │
│   (React Native)│◄──►│  (Cloudflare)   │◄──►│   (D1/SQLite)   │
│                 │    │                 │    │                 │
│ • Expo Router   │    │ • GraphQL API   │    │ • Drizzle ORM   │
│ • Redux Store   │    │ • Subscriptions │    │ • Shared Schema │
│ • Offline DB    │    │ • Authentication│    │ • Migrations    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Expo React Native** - Cross-platform mobile development
- **Redux Toolkit** - State management with persistence
- **Apollo Client** - GraphQL client
- **Expo Router** - File-based navigation
- **react-i18next** - Internationalization (EN/FA)

### Backend
- **Cloudflare Workers** - Serverless runtime
- **GraphQL Yoga** - GraphQL server
- **Cloudflare D1** - SQLite database
- **Drizzle ORM** - Type-safe database queries

### Shared
- **TypeScript** - Full type safety
- **Yarn Workspaces** - Monorepo management
- **Drizzle ORM** - Unified database schema

## 📁 Project Structure

```
safarnak.app/
├── client/                 # 📱 Expo React Native app
│   ├── app/               # Expo Router pages
│   ├── components/         # UI components
│   ├── redux/             # Redux store
│   ├── api/               # GraphQL client
│   ├── app.config.js      # Dynamic app configuration
│   ├── eas.json           # EAS build profiles
│   └── android/           # Android native code
├── worker/                # ⚡ Cloudflare Worker
│   ├── src/               # Worker source
│   ├── drizzle/           # Database schemas & migrations
│   ├── drizzle.config.ts  # Worker DB config
│   └── wrangler.toml      # Cloudflare config
├── graphql/               # 📡 Shared GraphQL definitions
├── drizzle/               # 🗄️ Shared database schemas
└── package.json           # Root workspace config
```

## 🎯 Key Features

- **Offline-First**: Works without internet connection
- **Real-time Updates**: GraphQL subscriptions
- **Cross-Platform**: iOS, Android, and Web support
- **Internationalization**: English and Persian (RTL)
- **Type Safety**: Full TypeScript coverage
- **Modern UI**: Custom components with theme support

## 📋 Available Scripts

### 🚀 Development Commands
| Command | Description |
|---------|-------------|
| `yarn dev` | Start both worker and client (full development) |
| `yarn client:start` | Start Expo dev server only |
| `yarn client:android` | Run on Android device/emulator |
| `yarn client:ios` | Run on iOS device/simulator |
| `yarn client:web` | Run in web browser |

### 📱 Build Commands (Persian Apps)
| Command | Description |
|---------|-------------|
| `yarn build:debug` | Build debug APK (تسفرناک) |
| `yarn build:release` | Build release APK (سقرناک) |
| `yarn build:debug:ios` | Build debug iOS (تسفرناک) |
| `yarn build:release:ios` | Build release iOS (سقرناک) |

### 🔧 Worker & Database Commands
| Command | Description |
|---------|-------------|
| `yarn worker:dev` | Start Cloudflare Worker dev server |
| `yarn worker:deploy` | Deploy worker to Cloudflare |
| `yarn db:generate` | Generate database migrations |
| `yarn db:migrate` | Run database migrations |
| `yarn db:studio` | Open Drizzle Studio |

### 🧹 Utility Commands
| Command | Description |
|---------|-------------|
| `yarn clean` | Clear databases, cache, and build artifacts |
| `yarn clean:all` | Clear everything including global Gradle cache |

## 🔧 Development

### Prerequisites
- Node.js 18+
- Yarn
- Expo CLI (`npm install -g @expo/cli`)
- Wrangler CLI (`npm install -g wrangler`)

### Setup
```bash
# Install dependencies
yarn install

# Generate database migrations
yarn db:generate

# Apply migrations
yarn db:migrate

# Start development
yarn dev
```

### Path Aliases
- `@drizzle/*` → `../drizzle/*` (shared database schemas)
- `@graphql/*` → `../graphql/*` (shared GraphQL definitions)
- `@/*` → `./*` (client-specific files)

### App Configurations
The app supports different configurations based on the build mode:

#### Development Mode (تسفرناک)
- **Command**: `yarn client:android`, `yarn client:ios`, `yarn client:web`
- **App Name**: تسفرناک (Persian)
- **Package ID**: `ir.mohet.safarnak_debug`
- **GraphQL URL**: `http://192.168.1.51:8787/graphql` (local development)

#### Debug Build (تسفرناک)
- **Command**: `yarn build:debug`
- **App Name**: تسفرناک (Persian)
- **Package ID**: `ir.mohet.safarnak_debug`
- **GraphQL URL**: `http://192.168.1.51:8787/graphql` (local development)

#### Release Build (سقرناک)
- **Command**: `yarn build:release`
- **App Name**: سقرناک (Persian)
- **Package ID**: `ir.mohet.safarnak`
- **GraphQL URL**: `https://safarnak.mohet.ir/graphql` (production)

**Note**: Development and Debug builds use the same package ID, so you can only have one installed at a time. Release builds use a different package ID and can coexist with debug builds.

## 🌐 Deployment

### Worker (Backend)
```bash
yarn worker:deploy
```

### Client Apps (Persian Names)
```bash
# Build debug APK (تسفرناک)
yarn build:debug

# Build release APK (سقرناک)
yarn build:release

# Build iOS versions
yarn build:debug:ios
yarn build:release:ios
```

### Development Testing
```bash
# Run on Android device/emulator
yarn client:android

# Run on iOS device/simulator
yarn client:ios

# Run in web browser
yarn client:web
```

## 🔧 Troubleshooting

### Build Issues
```bash
# Clear all caches and build artifacts
yarn clean:all

# Rebuild from scratch
yarn build:debug
```

### Development Issues
```bash
# Clear project cache
yarn clean

# Restart development server
yarn dev
```

### Common Problems
- **Build fails**: Run `yarn clean:all` before building
- **App won't install**: Check if both debug/release apps are installed (different package IDs)
- **GraphQL connection issues**: Verify worker is running with `yarn worker:dev`
- **Metro bundler issues**: Clear cache with `yarn clean` and restart

## 📚 Documentation

- [Commands Reference](./COMMANDS.md) - Complete command reference
- [Project Specifications](./PROJECT_SPECIFICATIONS.md) - Detailed project overview
- [Development Guidelines](./DEVELOPMENT_GUIDELINES.md) - Development setup and practices
- [Design Patterns](./DESIGN_PATTERNS.md) - Architecture patterns and best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.