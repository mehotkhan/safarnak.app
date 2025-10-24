# Safarnak App

A full-stack travel application with offline-first capabilities, built with Expo React Native and Cloudflare Workers in a unified single-root architecture.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development (both worker and client)
yarn dev

# Run on Android device
yarn android

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
- **ESLint + Prettier** - Code quality and formatting
- **Drizzle ORM** - Unified database schema

## 📁 Project Structure

```
safarnak.app/
├── app/                   # 📱 Expo Router pages
├── components/            # UI components
├── api/                   # GraphQL client utilities
├── hooks/                 # Custom React hooks
├── store/                 # Redux store
├── redux/                 # Redux slices
├── assets/                # Images, fonts, etc.
├── android/               # Android native code
├── ios/                   # iOS native code
├── worker.ts              # ⚡ Cloudflare Worker entry
├── drizzle/               # 🗄️ Database schemas & migrations
├── graphql/               # 📡 Shared GraphQL definitions
├── app.config.js          # Dynamic app configuration
├── eas.json               # EAS build profiles
├── wrangler.toml          # Cloudflare Worker config
├── drizzle.config.ts      # Database config
├── eslint.config.js       # ESLint flat config
├── .prettierrc            # Prettier config
└── package.json           # Root package config
```

## 🎯 Key Features

- **Offline-First**: Works without internet connection
- **Real-time Updates**: GraphQL subscriptions
- **Cross-Platform**: iOS, Android, and Web support
- **Internationalization**: English and Persian (RTL)
- **Type Safety**: Full TypeScript coverage
- **Modern UI**: Custom components with theme support
- **Unified Architecture**: Single-root monorepo structure

## 📋 Available Scripts

### 🚀 Development Commands

| Command               | Description                                     |
| --------------------- | ----------------------------------------------- |
| `yarn dev`            | Start both worker and client (full development) |
| `yarn start`          | Start Expo dev server only                      |
| `yarn android`        | Run on Android device/emulator                  |
| `yarn ios`            | Run on iOS device/simulator                     |
| `yarn web`            | Run in web browser                              |

### 📱 Build Commands (Persian Apps)

| Command                  | Description                |
| ------------------------ | -------------------------- |
| `yarn build:debug`       | Build debug APK (تسفرناک)  |
| `yarn build:release`     | Build release APK (سقرناک) |
| `yarn build:debug:ios`   | Build debug iOS (تسفرناک)  |
| `yarn build:release:ios` | Build release iOS (سقرناک) |

### 🔧 Worker & Database Commands

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `yarn wrangler:dev` | Start Cloudflare Worker dev server |
| `yarn wrangler:deploy` | Deploy worker to Cloudflare        |
| `yarn db:generate`  | Generate database migrations       |
| `yarn db:migrate`   | Run database migrations            |
| `yarn db:studio`    | Open Drizzle Studio                |

### 🔍 Code Quality Commands

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `yarn lint`          | Run ESLint on all files           |
| `yarn lint:fix`      | Fix ESLint issues automatically   |
| `yarn lint:worker`   | Lint worker code only             |
| `yarn lint:client`   | Lint client code only             |
| `yarn format`        | Format code with Prettier         |
| `yarn format:check`  | Check code formatting             |
| `yarn type-check`    | Run TypeScript type checking      |

### 🧹 Utility Commands

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `yarn clean`     | Clear databases, cache, and build artifacts    |
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

- `@/*` → `./*` (root files)
- `@components/*` → `./components/*` (UI components)
- `@graphql/*` → `./graphql/*` (shared GraphQL definitions)

### App Configurations

The app supports different configurations based on the build mode:

#### Development Mode (تسفرناک)
- **Command**: `yarn android`, `yarn ios`, `yarn web`
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
yarn wrangler:deploy
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
yarn android

# Run on iOS device/simulator
yarn ios

# Run in web browser
yarn web
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
- **GraphQL connection issues**: Verify worker is running with `yarn wrangler:dev`
- **Metro bundler issues**: Clear cache with `yarn clean` and restart
- **Linting issues**: Run `yarn lint:fix` to auto-fix problems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `yarn lint:fix` and `yarn format` to ensure code quality
5. Test thoroughly
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.