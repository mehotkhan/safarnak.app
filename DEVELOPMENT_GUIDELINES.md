# Safarnak App - Development Guidelines

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** - Required for all development
- **Yarn** - Package manager for workspace management
- **Expo CLI** - For React Native development (`npm install -g @expo/cli`)
- **Wrangler CLI** - For Cloudflare Worker deployment (`npm install -g wrangler`)

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd safarnak.app

# Install dependencies
yarn install

# Generate database migrations
yarn db:generate

# Apply migrations to worker database
yarn db:migrate

# Start development servers
yarn dev
```

## 📁 Project Structure

### Monorepo Organization
```
safarnak.app/
├── client/                    # 📱 Expo React Native mobile application
│   ├── app/                  # Expo Router pages (file-based routing)
│   ├── components/           # Reusable UI components
│   │   ├── context/         # React contexts (Theme, Language)
│   │   └── ui/              # UI components
│   ├── redux/               # Redux store and auth slice
│   ├── store/               # Additional store slices
│   ├── api/                 # GraphQL client and queries
│   ├── db/                  # Database configuration
│   ├── locales/             # Internationalization files
│   ├── hooks/               # Custom React hooks
│   └── drizzle.config.ts   # Client Drizzle configuration
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

## 🛠️ Development Commands

### Root Level Commands
| Command | Description |
|---------|-------------|
| `yarn dev` | Start both client and worker |
| `yarn build` | Build for production |
| `yarn clean` | Clear databases and cache |

### Client Commands
| Command | Description |
|---------|-------------|
| `yarn client:start` | Start Expo dev server |
| `yarn client:android` | Build Android app |
| `yarn client:ios` | Build iOS app |
| `yarn client:web` | Build web app |

### Worker Commands
| Command | Description |
|---------|-------------|
| `yarn worker:dev` | Start worker development server |
| `yarn worker:deploy` | Deploy worker to Cloudflare |

### Database Commands
| Command | Description |
|---------|-------------|
| `yarn db:generate` | Generate database migrations |
| `yarn db:migrate` | Apply migrations to worker |
| `yarn db:studio` | Open Drizzle Studio |

## 🔧 Development Workflow

### 1. Feature Development
```bash
# Create a new feature branch
git checkout -b feature/new-feature

# Start development servers
yarn dev

# Make your changes
# Test on multiple platforms
# Commit your changes
git commit -m "feat: add new feature"
```

### 2. Database Changes
```bash
# Modify schemas in worker/drizzle/schemas/
# Generate migrations
yarn db:generate

# Apply migrations
yarn db:migrate

# Test changes
yarn db:studio
```

### 3. Testing
```bash
# Test client on different platforms
yarn client:android  # Android
yarn client:ios      # iOS
yarn client:web      # Web

# Test worker locally
yarn worker:dev
```

## 📝 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use path aliases instead of relative imports
- Always type function parameters and return values

### React/React Native
- Use functional components with hooks
- Prefer `useCallback` and `useMemo` for performance
- Use TypeScript for all component props
- Follow Expo Router conventions for navigation

### Database
- Use Drizzle ORM for all database operations
- Follow shared schema patterns in `worker/drizzle/schemas/`
- Use migrations for schema changes
- Prefer type-safe queries over raw SQL

### GraphQL
- Use shared GraphQL definitions from `graphql/` directory
- Follow Apollo Client patterns for data fetching
- Use error policies for graceful error handling
- Implement proper loading states

## 🎯 Best Practices

### State Management
- Use Redux Toolkit for complex state
- Keep state normalized and flat
- Use selectors for computed values
- Implement proper error handling

### Component Design
- Create reusable components in `components/ui/`
- Use custom hooks for shared logic
- Implement proper prop validation
- Follow atomic design principles

### Performance
- Use lazy loading for routes and components
- Implement proper memoization
- Optimize images and assets
- Use efficient data structures

### Error Handling
- Implement error boundaries
- Use proper error messages
- Handle network errors gracefully
- Log errors for debugging

## 🔍 Debugging

### Client Debugging
- Use React Native Debugger
- Enable Flipper for advanced debugging
- Use console.log for simple debugging
- Implement proper error boundaries

### Worker Debugging
- Use Wrangler dev tools
- Check Cloudflare Workers dashboard
- Use console.log for server-side debugging
- Monitor worker performance

### Database Debugging
- Use Drizzle Studio for database inspection
- Check migration logs
- Verify schema changes
- Test queries manually

## 🧪 Testing

### Unit Testing
- Test utility functions
- Test custom hooks
- Test Redux reducers
- Test GraphQL resolvers

### Integration Testing
- Test API endpoints
- Test database operations
- Test authentication flow
- Test offline functionality

### E2E Testing
- Test complete user flows
- Test cross-platform compatibility
- Test offline scenarios
- Test real-time features

## 🚀 Deployment

### Development Deployment
```bash
# Deploy worker to development
yarn worker:deploy

# Test on development environment
# Verify all features work
```

### Production Deployment
```bash
# Build client for production
yarn build

# Deploy worker to production
yarn worker:deploy

# Deploy client to app stores
yarn client:android
yarn client:ios
```

## 📊 Monitoring

### Performance Monitoring
- Monitor worker performance
- Track client performance metrics
- Monitor database query performance
- Track user engagement

### Error Monitoring
- Set up error tracking
- Monitor crash reports
- Track API errors
- Monitor database errors

## 🔄 Maintenance

### Regular Tasks
- Update dependencies regularly
- Review and update documentation
- Monitor performance metrics
- Clean up unused code

### Database Maintenance
- Regular migration reviews
- Performance optimization
- Backup strategies
- Schema evolution planning