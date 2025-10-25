# 🌍 Safarnak - Offline-First Travel Companion

Welcome to **Safarnak**, a modern offline-first travel application built with Expo React Native, Cloudflare Workers, and GraphQL Codegen. Safarnak provides seamless travel experiences with real-time messaging, bilingual support, and type-safe client-server communication.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/mehotkhan/safarnak.app.git
cd safarnak.app

# Install dependencies
yarn install

# Start development
yarn dev
```

## ✨ Key Features

- **🌍 Offline-First**: Works seamlessly without internet connection
- **📡 GraphQL API**: Type-safe client-server communication with auto-generated hooks
- **🌐 Bilingual Support**: English and Persian (Farsi) with RTL layout
- **🌙 Dark Mode**: System preference and manual toggle
- **🗺️ Interactive Maps**: Leaflet-based with multiple layers (standard, satellite, terrain)
- **💬 Real-Time Messaging**: Live messaging with GraphQL subscriptions
- **🔐 Secure Authentication**: PBKDF2 password hashing and token-based auth
- **📱 Cross-Platform**: iOS, Android, and Web support

## 🏗️ Technical Stack

### Frontend (Client)
- **Expo** ~54.0.19 - React Native framework with file-based routing
- **React Native** 0.81.5 - Mobile framework
- **React** 19.1.0 - UI library
- **Redux Toolkit** ^2.9.2 - State management with persistence
- **Apollo Client** 3.8.0 - GraphQL client
- **react-i18next** ^16.1.5 - Internationalization

### Backend (Worker)
- **Cloudflare Workers** - Serverless edge runtime
- **GraphQL Yoga** ^5.16.0 - GraphQL server
- **Cloudflare D1** - Serverless SQLite database
- **Drizzle ORM** ^0.44.6 - Type-safe ORM

### Development Tools
- **GraphQL Codegen** ^6.0.1 - Auto-generate TypeScript types and React Apollo hooks
- **TypeScript** ~5.9.3 - Enhanced type checking
- **ESLint** ^9.38.0 - Developer-friendly linting
- **Semantic Versioning** - Automated versioning with release-it

## 📁 Project Structure

```
safarnak.app/
├── worker.ts                    # Cloudflare Worker entry
├── worker/                      # GraphQL resolvers (SERVER-SIDE ONLY)
├── graphql/                     # SHARED GraphQL schema and queries
├── api/                         # CLIENT-SIDE generated hooks and types
├── drizzle/                     # Database schema and migrations
├── store/                       # Redux state management
├── app/                         # Expo Router pages
├── components/                  # React components
├── constants/                   # App configuration and theme
├── locales/                     # i18n translations
└── scripts/                     # Utility scripts
```

## 🎯 Development Philosophy

- **Developer-Friendly**: Relaxed TypeScript and ESLint rules for faster development
- **Type Safety**: GraphQL Codegen ensures end-to-end type safety
- **Offline-First**: Redux Persist and offline middleware for seamless UX
- **Semantic Versioning**: Automated versioning from 0.5.0 → 1.0.0 stable
- **Perfect Separation**: Clear boundaries between client, server, and shared code

## 📚 Documentation

- [Getting Started](Getting-Started) - Setup and installation guide
- [Architecture](Architecture) - System design and patterns
- [Development Guide](Development-Guide) - Coding standards and workflows
- [API Documentation](API-Documentation) - GraphQL schema and operations
- [Deployment Guide](Deployment-Guide) - CI/CD and release process

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/mehotkhan/safarnak.app/blob/master/CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/mehotkhan/safarnak.app/blob/master/LICENSE) file for details.

## 🐛 Bug Reports

Found a bug? Please report it on [GitHub Issues](https://github.com/mehotkhan/safarnak.app/issues).

---

**Built with ❤️ using Expo, Cloudflare Workers, and GraphQL Codegen**
