# Safarnak App

A full-stack travel application with offline-first capabilities, built with Expo React Native and Cloudflare Workers.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development
yarn dev

# Build for production
yarn build
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
│   └── drizzle.config.ts  # Client DB config
├── worker/                # ⚡ Cloudflare Worker
│   ├── src/               # Worker source
│   ├── drizzle/           # Database schemas & migrations
│   ├── drizzle.config.ts  # Worker DB config
│   └── wrangler.toml      # Cloudflare config
├── graphql/               # 📡 Shared GraphQL definitions
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

| Command | Description |
|---------|-------------|
| `yarn dev` | Start both client and worker |
| `yarn build` | Build for production |
| `yarn worker:dev` | Start worker only |
| `yarn worker:deploy` | Deploy worker to Cloudflare |
| `yarn client:start` | Start Expo dev server |
| `yarn client:android` | Build Android app |
| `yarn client:ios` | Build iOS app |
| `yarn client:web` | Build web app |
| `yarn db:generate` | Generate database migrations |
| `yarn db:migrate` | Apply migrations |
| `yarn db:studio` | Open Drizzle Studio |
| `yarn clean` | Clear databases and cache |

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
- `@drizzle/*` → `../worker/drizzle/*` (database schemas)
- `@graphql/*` → `../graphql/*` (GraphQL definitions)
- `@/*` → `./*` (client-specific files)

## 🌐 Deployment

### Worker (Backend)
```bash
yarn worker:deploy
```

### Client (Mobile/Web)
```bash
# Android
yarn client:android

# iOS
yarn client:ios

# Web
yarn client:web
```

## 📚 Documentation

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