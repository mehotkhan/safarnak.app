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

# Apply migrations to both databases
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
│   ├── drizzle.config.ts    # Worker Drizzle configuration
│   └── wrangler.toml        # Cloudflare Worker configuration
├── drizzle/                  # 🗄️ Shared database schema management
│   ├── schemas/
│   │   ├── shared/          # Common types and utilities
│   │   ├── client/          # Client-specific schema
│   │   └── worker/          # Server-specific schema
│   └── migrations/
│       ├── client/          # Client migration files
│       └── worker/          # Worker migration files
├── graphql/                  # 📊 Shared GraphQL schema and queries
│   ├── schema/              # GraphQL type definitions
│   ├── queries/             # Shared query strings
│   └── types/               # TypeScript type definitions
├── drizzle.config.ts        # Root Drizzle configuration
└── package.json             # Root workspace configuration
```

## 🛠️ Development Workflow

### Daily Development Commands
```bash
# Start both client and worker in development mode
yarn dev

# Start only client (Expo React Native)
yarn client:start

# Start only worker (Cloudflare Worker)
yarn worker:dev

# Run on specific platforms
yarn client:android    # Android device/emulator
yarn client:ios        # iOS device/simulator
yarn client:web        # Web browser
```

### Database Management
```bash
# Generate migrations for both client and worker
yarn db:generate

# Apply migrations to both databases
yarn db:migrate

# Apply migrations to worker only
yarn worker:db:migrate

# Open Drizzle Studio for database inspection
yarn db:studio

# Clear all database files (development only)
yarn db:purge
```

### Building and Deployment
```bash
# Build both client and worker
yarn build

# Deploy worker to Cloudflare
yarn worker:deploy

# Build client for specific platforms
yarn client:android    # Android APK
yarn client:ios        # iOS build
yarn client:web         # Web build
```

## 📝 Coding Standards

### TypeScript Guidelines
- **Strict Mode**: Always use strict TypeScript configuration
- **Type Safety**: Avoid `any` type; use proper type definitions
- **Interfaces**: Prefer interfaces over types for object shapes
- **Path Aliases**: Use `@drizzle/*` and `@graphql/*` instead of relative imports
- **Return Types**: Always specify return types for functions

```typescript
// ✅ Good
interface UserProps {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): Promise<UserProps | null> {
  // Implementation
}

// ❌ Bad
function getUser(id: any): any {
  // Implementation
}
```

### React/React Native Guidelines
- **Functional Components**: Use functional components with hooks
- **Performance**: Use `useCallback` and `useMemo` for expensive operations
- **Props**: Always type component props with interfaces
- **Hooks**: Extract reusable logic into custom hooks
- **Navigation**: Follow Expo Router conventions

```typescript
// ✅ Good
interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  
  const handleLogin = useCallback(async () => {
    // Login logic
  }, [username]);
  
  return (
    <View>
      {/* Component JSX */}
    </View>
  );
}

// ❌ Bad
export default function LoginScreen(props: any) {
  // Implementation without proper typing
}
```

### Database Guidelines
- **Drizzle ORM**: Use Drizzle for all database operations
- **Shared Schemas**: Follow shared schema patterns in `drizzle/schemas/`
- **Migrations**: Always use migrations for schema changes
- **Type Safety**: Use type-safe queries instead of raw SQL

```typescript
// ✅ Good
import { users } from '@drizzle/schemas/client';
import { eq } from 'drizzle-orm';

const user = await db.select().from(users).where(eq(users.id, userId)).get();

// ❌ Bad
const user = await db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
```

### GraphQL Guidelines
- **Shared Definitions**: Use shared GraphQL definitions from `graphql/` directory
- **Apollo Client**: Follow Apollo Client patterns for data fetching
- **Error Handling**: Use error policies for graceful error handling
- **Loading States**: Implement proper loading states

```typescript
// ✅ Good
const { data, loading, error } = useQuery(GET_TOURS, {
  errorPolicy: 'all',
});

if (loading) return <LoadingScreen />;
if (error) return <ErrorScreen error={error} />;

// ❌ Bad
const { data } = useQuery(GET_TOURS);
// No error handling or loading states
```

## 🎨 UI/UX Guidelines

### Component Design
- **Atomic Design**: Organize components by complexity (atoms, molecules, organisms)
- **Reusability**: Create reusable components in `components/ui/`
- **Props Interface**: Use consistent prop naming conventions
- **Accessibility**: Implement proper ARIA labels and semantic HTML

### Theme System
- **Light/Dark Mode**: Support both light and dark themes
- **Consistent Colors**: Use design tokens for consistent colors
- **Responsive Design**: Ensure components work on different screen sizes
- **Platform Adaptation**: Adapt UI for iOS, Android, and Web

### Internationalization
- **Multi-language**: Support English and Persian (Farsi)
- **RTL Support**: Implement right-to-left text direction for Persian
- **Translation Keys**: Use descriptive translation keys
- **Fallback**: Provide fallback translations

```typescript
// ✅ Good
const { t } = useTranslation();
return <Text>{t('login.welcome', { name: user.name })}</Text>;

// ❌ Bad
return <Text>Welcome {user.name}</Text>;
```

## 🔒 Security Guidelines

### Authentication
- **Token Security**: Use secure token generation and validation
- **Password Hashing**: Use PBKDF2 for password hashing
- **Input Validation**: Validate all user inputs
- **Session Management**: Implement proper session handling

### Data Protection
- **Local Storage**: Encrypt sensitive data in local storage
- **Network Security**: Use HTTPS/TLS for all communications
- **API Security**: Implement proper API security measures
- **Error Handling**: Don't expose sensitive information in errors

## 🧪 Testing Guidelines

### Unit Testing
- **Component Tests**: Test components with React Testing Library
- **Hook Tests**: Test custom hooks with React Hooks Testing Library
- **Utility Tests**: Test utility functions with Jest
- **Mocking**: Mock external dependencies properly

### Integration Testing
- **API Tests**: Test GraphQL resolvers and mutations
- **Database Tests**: Test database operations with test database
- **Authentication Tests**: Test authentication flows
- **Offline Tests**: Test offline functionality

### Test Structure
```typescript
// ✅ Good test structure
describe('LoginScreen', () => {
  beforeEach(() => {
    renderWithProviders(<LoginScreen />);
  });

  it('should render login form', () => {
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  });

  it('should handle login success', async () => {
    // Test implementation
  });
});
```

## 📊 Performance Guidelines

### Client Performance
- **Lazy Loading**: Use lazy loading for routes and components
- **Memoization**: Use React.memo for expensive components
- **Redux Selectors**: Use selectors for efficient state access
- **Image Optimization**: Optimize images and assets

### Backend Performance
- **Database Queries**: Optimize database queries
- **Caching**: Implement proper caching strategies
- **Error Handling**: Handle errors efficiently
- **Monitoring**: Monitor performance metrics

## 🚀 Deployment Guidelines

### Worker Deployment
- **Environment Variables**: Configure environment variables in `wrangler.toml`
- **Database Migrations**: Apply migrations before deployment
- **Health Checks**: Implement health check endpoints
- **Rollback Plan**: Have a rollback plan ready

### Client Deployment
- **EAS Build**: Use EAS Build for app builds
- **Environment Configuration**: Configure different environments
- **Asset Optimization**: Optimize assets for production
- **App Store Guidelines**: Follow platform-specific guidelines

## 🔧 Troubleshooting

### Common Issues

#### Database Migration Errors
```bash
# Clear everything and start fresh
yarn db:purge
yarn db:generate
yarn db:migrate
```

#### Metro Bundler Issues
```bash
# Clear Metro cache
yarn client:start --clear
```

#### Worker Development Issues
```bash
# Restart worker with fresh database
yarn worker:dev --compatibility-date=2023-05-18
```

#### Path Alias Issues
- Ensure `tsconfig.json` has correct paths configuration
- For client: check `metro.config.js` has `extraNodeModules`
- Restart TypeScript server in your IDE

### Debugging Tips
- Use React DevTools for component debugging
- Use Redux DevTools for state debugging
- Use Apollo DevTools for GraphQL debugging
- Use Drizzle Studio for database inspection

## 📚 Documentation Guidelines

### Code Documentation
- **JSDoc Comments**: Document complex functions and components
- **README Files**: Keep README files up to date
- **Type Definitions**: Use descriptive type names
- **Comments**: Add comments for complex logic

### API Documentation
- **GraphQL Schema**: Document GraphQL schema with descriptions
- **Resolver Documentation**: Document resolver functions
- **Error Codes**: Document error codes and messages
- **Examples**: Provide usage examples

## 🤝 Contributing Guidelines

### Pull Request Process
1. **Fork Repository**: Fork the repository
2. **Create Branch**: Create a feature branch
3. **Make Changes**: Implement your changes
4. **Test Changes**: Test your changes thoroughly
5. **Submit PR**: Submit a pull request with description

### Code Review Process
- **Review Checklist**: Use the code review checklist
- **Testing**: Ensure all tests pass
- **Documentation**: Update documentation if needed
- **Performance**: Consider performance implications

### Commit Message Format
```
type(scope): description

feat(auth): add password reset functionality
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
```

## 📋 Development Checklist

### Before Starting Development
- [ ] Read project documentation
- [ ] Set up development environment
- [ ] Understand project architecture
- [ ] Review coding standards

### During Development
- [ ] Follow TypeScript guidelines
- [ ] Implement proper error handling
- [ ] Add loading states
- [ ] Test offline functionality
- [ ] Ensure i18n support
- [ ] Follow security guidelines

### Before Submitting
- [ ] Run all tests
- [ ] Check for linting errors
- [ ] Test on multiple platforms
- [ ] Update documentation
- [ ] Review security implications
- [ ] Test offline scenarios

---

*These guidelines ensure consistent, high-quality development practices across the Safarnak application. Follow these standards to maintain code quality and project consistency.*
