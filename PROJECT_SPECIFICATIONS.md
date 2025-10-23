# Safarnak App - Project Specifications

## 🎯 Project Overview

**Safarnak** is a full-stack travel application that enables users to discover and book tours worldwide. The app features a modern architecture with offline-first capabilities, real-time updates, and cross-platform support.

### Core Purpose
- **Travel Discovery**: Help users find and book tours and experiences
- **Offline-First**: Works seamlessly without internet connection
- **Real-time Updates**: Live notifications and data synchronization
- **Cross-Platform**: Native mobile experience on iOS, Android, and Web

## 🏗️ Architecture Overview

### High-Level Architecture
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

### Technology Stack

#### Frontend (Client)
- **Framework**: Expo React Native (v54)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Redux Toolkit + Redux Persist
- **Database**: Expo SQLite (offline-first)
- **UI**: Custom components with theme support
- **Internationalization**: react-i18next (English/Persian)
- **Styling**: React Native StyleSheet + Custom components

#### Backend (Worker)
- **Runtime**: Cloudflare Workers (serverless)
- **API**: GraphQL with Yoga Server
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Authentication**: PBKDF2 password hashing
- **Subscriptions**: GraphQL Workers Subscriptions
- **Deployment**: Wrangler CLI

#### Shared Infrastructure
- **Database ORM**: Drizzle ORM (unified schema)
- **TypeScript**: Full type safety across client/server
- **Package Manager**: Yarn Workspaces (monorepo)
- **Path Aliases**: `@drizzle/*`, `@graphql/*`

## 📁 Project Structure

### Monorepo Organization
```
safarnak.app/
├── client/                    # 📱 Expo React Native mobile application
│   ├── app/                  # Expo Router pages (file-based routing)
│   │   ├── (tabs)/           # Tab-based navigation
│   │   └── login.tsx         # Authentication screen
│   ├── components/           # Reusable UI components
│   │   ├── context/         # React contexts (Theme, Language)
│   │   └── ui/              # UI components
│   ├── redux/               # Redux store and auth slice
│   ├── store/               # Additional store slices
│   ├── api/                 # GraphQL client and queries
│   ├── db/                  # Database configuration
│   ├── locales/             # Internationalization files
│   ├── hooks/               # Custom React hooks
│   └── drizzle.config.ts    # Client Drizzle configuration
├── worker/                   # ⚡ Cloudflare Worker backend
│   ├── src/                 # Worker source code
│   ├── drizzle/             # Database schemas and migrations
│   │   ├── schemas/         # Database schema definitions
│   │   └── migrations/      # Database migration files
│   ├── drizzle.config.ts    # Worker Drizzle configuration
│   └── wrangler.toml        # Cloudflare Worker configuration
├── graphql/                  # 📡 Shared GraphQL definitions
│   ├── schema/              # GraphQL schema definitions
│   ├── queries/             # GraphQL queries and mutations
│   └── types/               # TypeScript type definitions
└── package.json              # Root workspace configuration
```

## 🔧 Development Environment

### Prerequisites
- **Node.js 18+** - Required for all development
- **Yarn** - Package manager for workspace management
- **Expo CLI** - For React Native development (`npm install -g @expo/cli`)
- **Wrangler CLI** - For Cloudflare Worker deployment (`npm install -g wrangler`)

### Development Workflow
1. **Setup**: `yarn install` - Install all dependencies
2. **Database**: `yarn db:generate` - Generate migrations
3. **Migration**: `yarn db:migrate` - Apply migrations
4. **Development**: `yarn dev` - Start both client and worker
5. **Testing**: Test on multiple platforms (iOS, Android, Web)

## 🎯 Key Features

### Offline-First Architecture
- **Local Database**: Expo SQLite for offline data storage
- **State Persistence**: Redux Persist for app state
- **Sync Strategy**: Background sync when online
- **Graceful Degradation**: App works without internet

### Real-time Updates
- **GraphQL Subscriptions**: Live data updates
- **WebSocket Support**: Real-time communication
- **Push Notifications**: User engagement
- **Conflict Resolution**: Handle concurrent updates

### Cross-Platform Support
- **iOS**: Native iOS app via Expo
- **Android**: Native Android app via Expo
- **Web**: Progressive Web App
- **Responsive Design**: Adapts to different screen sizes

### Internationalization
- **Languages**: English and Persian (Farsi)
- **RTL Support**: Right-to-left text layout
- **Dynamic Switching**: Runtime language changes
- **Localized Content**: Region-specific content

## 🔐 Security Features

### Authentication
- **Password Hashing**: PBKDF2 with salt
- **Token-Based Auth**: JWT tokens for sessions
- **Offline Auth**: Local authentication fallback
- **Session Management**: Secure token handling

### Data Protection
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Drizzle ORM protection
- **XSS Protection**: React Native built-in protection
- **HTTPS Only**: Secure communication

## 📊 Performance Considerations

### Client Performance
- **Lazy Loading**: Code splitting for better performance
- **Image Optimization**: Optimized asset loading
- **Memory Management**: Efficient state management
- **Bundle Size**: Optimized JavaScript bundles

### Server Performance
- **Edge Computing**: Global distribution via Cloudflare
- **Caching**: Intelligent caching strategies
- **Database Optimization**: Efficient queries
- **Auto-scaling**: Serverless scaling

## 🚀 Deployment Strategy

### Development
- **Local Development**: Full local environment
- **Hot Reloading**: Fast development cycles
- **Debug Tools**: Comprehensive debugging support

### Production
- **Worker Deployment**: `yarn worker:deploy`
- **Client Builds**: Platform-specific builds
- **Environment Variables**: Secure configuration
- **Monitoring**: Performance and error tracking

## 📈 Scalability Considerations

### Horizontal Scaling
- **Serverless Architecture**: Auto-scaling workers
- **Database Sharding**: Future database scaling
- **CDN Integration**: Global content delivery
- **Load Balancing**: Distributed traffic handling

### Vertical Scaling
- **Code Optimization**: Efficient algorithms
- **Database Indexing**: Query optimization
- **Caching Layers**: Multiple caching strategies
- **Resource Management**: Efficient resource usage

## 🔄 Future Enhancements

### Planned Features
- **Advanced Search**: AI-powered tour recommendations
- **Social Features**: User reviews and ratings
- **Payment Integration**: Secure payment processing
- **Analytics**: User behavior tracking

### Technical Improvements
- **Performance Monitoring**: Real-time performance metrics
- **Error Tracking**: Comprehensive error reporting
- **A/B Testing**: Feature experimentation
- **Automated Testing**: Comprehensive test coverage