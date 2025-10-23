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
- **Code Sharing**: Shared schemas, types, GraphQL definitions

## 📱 Client Application Details

### App Structure
```
client/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with AuthWrapper
│   ├── login.tsx          # Authentication screen
│   └── (tabs)/            # Tab navigation group
│       ├── _layout.tsx    # Tab layout
│       ├── index.tsx      # Home tab
│       ├── tour.tsx       # Tour discovery tab
│       └── profile.tsx    # User profile tab
├── components/            # Reusable UI components
│   ├── AuthWrapper.tsx    # Authentication guard
│   ├── context/           # React contexts
│   └── ui/                # UI components
├── redux/                 # Redux store and slices
├── store/                 # Additional store slices
├── api/                   # GraphQL client and queries
├── db/                    # Database configuration
├── locales/               # Internationalization files
└── hooks/                 # Custom React hooks
```

### Key Features

#### Authentication System
- **Offline-First**: Works without internet connection
- **Dual Storage**: AsyncStorage + Local SQLite database
- **Token-Based**: Secure authentication with JWT-like tokens
- **Auto-Restore**: Automatic session restoration on app launch
- **Error Handling**: Comprehensive error messages and fallbacks

#### Navigation Flow
- **Unauthenticated**: Login screen with register option
- **Authenticated**: Tab navigation (Home, Tour, Profile)
- **Loading States**: Smooth transitions with loading indicators
- **Deep Linking**: Support for app scheme URLs

#### State Management
- **Redux Toolkit**: Modern Redux with RTK Query
- **Persistence**: Redux Persist for offline state
- **Offline Middleware**: Custom middleware for offline handling
- **Type Safety**: Full TypeScript integration

#### Database Layer
- **Local SQLite**: Expo SQLite for offline storage
- **Drizzle ORM**: Type-safe database operations
- **Schema Sync**: Shared schema with backend
- **Migrations**: Automatic migration handling

## ⚡ Worker Backend Details

### API Structure
```
worker/
├── src/
│   └── index.ts           # Main worker entry point
├── drizzle.config.ts     # Database configuration
└── wrangler.toml         # Cloudflare configuration
```

### GraphQL Schema
- **Queries**: User authentication, tour data
- **Mutations**: User registration, login, tour booking
- **Subscriptions**: Real-time updates (messages, notifications)
- **Type Safety**: Shared TypeScript types

### Authentication
- **Password Hashing**: PBKDF2 with secure salt
- **Token Generation**: Custom token system
- **Session Management**: Stateless authentication
- **Security**: Input validation and sanitization

### Database Operations
- **Drizzle ORM**: Type-safe SQL operations
- **Migrations**: Version-controlled schema changes
- **Connection Pooling**: Efficient database connections
- **Error Handling**: Comprehensive error responses

## 🗄️ Database Architecture

### Schema Design
```
drizzle/
├── schemas/
│   ├── shared/           # Common types and base schemas
│   │   ├── base.ts      # Base table definitions
│   │   └── users.ts     # User schema (shared)
│   ├── client/          # Client-specific schemas
│   │   └── client.ts    # Client database schema
│   └── worker/          # Server-specific schemas
│       ├── server.ts    # Server database schema
│       └── users.ts     # Extended user schema
└── migrations/          # Database migration files
    ├── client/         # Client migrations
    └── worker/         # Worker migrations
```

### Data Models

#### Users Table (Shared)
```typescript
{
  id: number (primary key)
  name: string (not null)
  username: string (unique, not null)
}
```

#### Extended User Schema (Worker)
```typescript
{
  // Inherits from shared users
  passwordHash: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Migration Strategy
- **Shared Schema**: Common fields in shared schemas
- **Environment-Specific**: Extended schemas per environment
- **Version Control**: Git-tracked migration files
- **Rollback Support**: Reversible migrations

## 🌐 GraphQL Integration

### Schema Organization
```
graphql/
├── schema/
│   └── schema.ts        # GraphQL type definitions
├── queries/
│   └── queries.ts       # Shared query strings
└── types/
    └── types.ts         # TypeScript type definitions
```

### Client Integration
- **Apollo Client**: GraphQL client with caching
- **Offline Support**: Apollo Cache with persistence
- **Error Handling**: Comprehensive error boundaries
- **Type Safety**: Generated TypeScript types

### Real-time Features
- **Subscriptions**: GraphQL subscriptions for live updates
- **Connection Pool**: Efficient WebSocket management
- **Fallback**: Graceful degradation when offline

## 🔧 Development Environment

### Prerequisites
- **Node.js 18+**: Required for all development
- **Yarn**: Package manager for workspace management
- **Expo CLI**: React Native development (`npm install -g @expo/cli`)
- **Wrangler CLI**: Cloudflare Worker deployment (`npm install -g wrangler`)

### Workspace Structure
- **Monorepo**: Yarn workspaces with shared dependencies
- **Path Aliases**: Clean imports with `@drizzle/*` and `@graphql/*`
- **TypeScript**: Full type safety across all packages
- **Shared Code**: Common schemas, types, and utilities

### Development Commands
```bash
# Development
yarn dev                    # Start both client and worker
yarn client:start          # Start Expo development server
yarn worker:dev            # Start worker development server

# Database
yarn db:generate           # Generate migrations for both
yarn db:migrate            # Apply migrations to both
yarn db:studio             # Open Drizzle Studio

# Deployment
yarn worker:deploy         # Deploy worker to Cloudflare
yarn client:android        # Build Android app
yarn client:ios            # Build iOS app
```

## 🎨 UI/UX Design System

### Theme System
- **Light/Dark Mode**: Automatic system theme detection
- **Custom Components**: Reusable UI components
- **Consistent Styling**: Standardized design tokens
- **Accessibility**: WCAG compliance considerations

### Internationalization
- **Multi-language**: English and Persian (Farsi) support
- **RTL Support**: Right-to-left text direction
- **Dynamic Loading**: Lazy-loaded translation files
- **Fallback**: Graceful fallback to default language

### Component Architecture
- **Atomic Design**: Components organized by complexity
- **Composition**: Flexible component composition patterns
- **Props Interface**: Consistent prop naming conventions
- **Type Safety**: Full TypeScript prop validation

## 🔒 Security Considerations

### Authentication Security
- **Password Hashing**: PBKDF2 with secure salt generation
- **Token Security**: Secure token generation and validation
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: Protection against brute force attacks

### Data Protection
- **Local Storage**: Secure local data encryption
- **Network Security**: HTTPS/TLS for all communications
- **API Security**: GraphQL query depth limiting
- **Error Handling**: Secure error messages without data leaks

### Privacy
- **Data Minimization**: Only collect necessary user data
- **Local Processing**: Offline-first data processing
- **User Control**: User data export and deletion
- **Transparency**: Clear privacy policy and data usage

## 📊 Performance Considerations

### Client Performance
- **Offline-First**: Reduced network dependency
- **Lazy Loading**: Component and route lazy loading
- **Image Optimization**: Optimized asset loading
- **Bundle Splitting**: Efficient code splitting

### Backend Performance
- **Serverless**: Auto-scaling Cloudflare Workers
- **Edge Computing**: Global CDN distribution
- **Database Optimization**: Efficient query patterns
- **Caching**: Strategic caching at multiple levels

### Monitoring
- **Error Tracking**: Comprehensive error monitoring
- **Performance Metrics**: Real-time performance tracking
- **User Analytics**: Privacy-focused usage analytics
- **Health Checks**: Automated system health monitoring

## 🚀 Deployment Strategy

### Worker Deployment
- **Cloudflare Workers**: Serverless deployment
- **Environment Management**: Separate dev/staging/prod environments
- **Database Migrations**: Automated migration deployment
- **Rollback Support**: Quick rollback capabilities

### Client Deployment
- **Expo Application Services**: EAS Build and Submit
- **Platform Support**: iOS App Store, Google Play Store, Web
- **OTA Updates**: Over-the-air updates for non-native changes
- **Version Management**: Semantic versioning strategy

### CI/CD Pipeline
- **Automated Testing**: Unit and integration tests
- **Code Quality**: ESLint, Prettier, TypeScript checks
- **Security Scanning**: Dependency vulnerability scanning
- **Deployment Automation**: Automated deployment workflows

## 📈 Future Roadmap

### Short-term Goals
- **Enhanced Tour Features**: Advanced tour discovery and booking
- **Social Features**: User reviews and recommendations
- **Payment Integration**: Secure payment processing
- **Push Notifications**: Real-time notification system

### Long-term Vision
- **AI Recommendations**: Machine learning-powered tour suggestions
- **AR Integration**: Augmented reality tour previews
- **Multi-language Expansion**: Support for additional languages
- **Enterprise Features**: Business account management

### Technical Improvements
- **Performance Optimization**: Further performance enhancements
- **Security Hardening**: Advanced security measures
- **Scalability**: Enhanced scalability for growing user base
- **Developer Experience**: Improved development tools and workflows

---

*This document serves as the comprehensive specification for the Safarnak travel application. It should be updated as the project evolves and new features are added.*
