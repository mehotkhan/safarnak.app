# Safarnak App - Design Patterns & Architecture

## 🏛️ Architectural Patterns

### 1. Monorepo Architecture Pattern
**Pattern**: Yarn Workspaces with Shared Code
**Implementation**: 
- Root package.json manages workspace dependencies
- Shared code in `drizzle/` and `graphql/` directories
- TypeScript path aliases for clean imports (`@drizzle/*`, `@graphql/*`)

**Benefits**:
- Code reuse between client and worker
- Consistent type definitions
- Simplified dependency management
- Single source of truth for schemas

### 2. Offline-First Architecture Pattern
**Pattern**: Local-First with Sync Capabilities
**Implementation**:
- Local SQLite database (Expo SQLite)
- Redux Persist for state persistence
- AsyncStorage for user session data
- Graceful degradation when offline

**Benefits**:
- Works without internet connection
- Improved user experience
- Reduced server load
- Better performance

### 3. Serverless Backend Pattern
**Pattern**: Cloudflare Workers with GraphQL
**Implementation**:
- Stateless serverless functions
- GraphQL API with subscriptions
- D1 database (SQLite-compatible)
- Edge computing distribution

**Benefits**:
- Auto-scaling
- Global distribution
- Cost-effective
- No server management

## 🎯 Design Patterns

### 1. Authentication Pattern
**Pattern**: Token-Based Authentication with Offline Fallback

```typescript
// AuthWrapper.tsx - Authentication Guard Pattern
export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    checkAuthStatus(); // Check local storage + database
  }, []);

  useEffect(() => {
    if (!isLoading) {
      router.replace(isAuthenticated ? '/(tabs)' : '/login');
    }
  }, [isAuthenticated, isLoading]);

  return isLoading ? <LoadingScreen /> : <>{children}</>;
}
```

**Key Components**:
- `AuthWrapper`: Route protection component
- `authSlice`: Redux state management
- `checkAuthStatus()`: Multi-source authentication check
- Token persistence in AsyncStorage

### 2. State Management Pattern
**Pattern**: Redux Toolkit with Persistence

```typescript
// store.ts - Centralized State Management
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'theme'], // Selective persistence
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(offlineMiddleware),
});
```

**Pattern Benefits**:
- Predictable state updates
- Time-travel debugging
- Middleware support for offline handling
- Selective persistence for performance

### 3. Database Schema Pattern
**Pattern**: Shared Schema with Environment Extensions

```typescript
// drizzle/schemas/shared/users.ts - Base Schema
export const usersBase = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
});

// drizzle/schemas/worker/users.ts - Extended Schema
export const users = sqliteTable('users', {
  ...usersBase, // Inherit base fields
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Pattern Benefits**:
- DRY principle (Don't Repeat Yourself)
- Type safety across environments
- Consistent data models
- Easy schema evolution

### 4. GraphQL Integration Pattern
**Pattern**: Apollo Client with Offline Support

```typescript
// api/client.ts - GraphQL Client Setup
const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all', // Handle partial data
    },
  },
});
```

**Pattern Benefits**:
- Declarative data fetching
- Automatic caching
- Real-time subscriptions
- Type-safe queries

### 5. Component Composition Pattern
**Pattern**: Atomic Design with Custom Hooks

```typescript
// Custom Hook Pattern
export function useAuth() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  const login = useCallback((userData: User, token: string) => {
    dispatch(login({ user: userData, token }));
  }, [dispatch]);
  
  return { isAuthenticated, user, login };
}

// Component Usage
function LoginScreen() {
  const { login } = useAuth();
  // Component logic...
}
```

**Pattern Benefits**:
- Reusable business logic
- Clean component separation
- Easy testing
- Consistent API across components

## 🎨 UI/UX Patterns

### 1. Theme System Pattern
**Pattern**: Context-Based Theme Management

```typescript
// ThemeContext.tsx - Theme Provider Pattern
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 2. Internationalization Pattern
**Pattern**: i18next with Dynamic Loading

```typescript
// i18n.ts - Internationalization Setup
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      fa: { translation: faTranslations },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
```

### 3. Navigation Pattern
**Pattern**: File-Based Routing with Guards

```typescript
// app/_layout.tsx - Root Layout Pattern
export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <ThemeProvider>
            <LanguageProvider>
              <AuthWrapper>
                <Stack>
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
              </AuthWrapper>
            </LanguageProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
}
```

## 🔧 Development Patterns

### 1. Error Handling Pattern
**Pattern**: Comprehensive Error Boundaries

```typescript
// Error Boundary Component
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 2. Loading State Pattern
**Pattern**: Consistent Loading Indicators

```typescript
// Loading Component Pattern
export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2f95dc" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

// Usage in Components
function TourScreen() {
  const { loading, data } = useQuery(GET_TOURS);
  
  if (loading) return <LoadingScreen />;
  if (!data) return <ErrorScreen />;
  
  return <TourList tours={data.tours} />;
}
```

### 3. Form Handling Pattern
**Pattern**: Controlled Components with Validation

```typescript
// Form Hook Pattern
export function useForm<T>(initialValues: T, validationSchema: Schema<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});
  
  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);
  
  const validate = useCallback(() => {
    const newErrors = validationSchema.validate(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);
  
  return { values, errors, handleChange, validate };
}
```

## 🗄️ Data Management Patterns

### 1. Database Migration Pattern
**Pattern**: Version-Controlled Schema Changes

```typescript
// Migration Generation
yarn db:generate  // Creates migration files
yarn db:migrate   // Applies migrations

// Migration File Structure
export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### 2. Caching Pattern
**Pattern**: Multi-Level Caching Strategy

```typescript
// Apollo Client Cache Configuration
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        tours: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});
```

### 3. Offline Sync Pattern
**Pattern**: Optimistic Updates with Conflict Resolution

```typescript
// Offline Middleware Pattern
export const offlineMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Queue actions when offline
  if (!navigator.onLine) {
    store.dispatch(queueAction(action));
  } else {
    // Sync queued actions when online
    store.dispatch(syncQueuedActions());
  }
  
  return result;
};
```

## 🔒 Security Patterns

### 1. Authentication Security Pattern
**Pattern**: Secure Token Management

```typescript
// Token Generation (Worker)
async function generateToken(userId: number, username: string): Promise<string> {
  const payload = { userId, username, exp: Date.now() + 86400000 }; // 24h
  return await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(JSON.stringify(payload)));
}

// Token Validation (Client)
function validateToken(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}
```

### 2. Input Validation Pattern
**Pattern**: Comprehensive Input Sanitization

```typescript
// Validation Schema Pattern
const userSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(100),
  email: z.string().email(),
});

// Usage in Resolvers
const register = async (parent: any, { username, password }: RegisterInput) => {
  const validatedInput = userSchema.parse({ username, password });
  // Process validated input...
};
```

## 📱 Mobile-Specific Patterns

### 1. Platform Adaptation Pattern
**Pattern**: Platform-Specific Implementations

```typescript
// Platform-specific hooks
export const useColorScheme = Platform.select({
  ios: () => require('./useColorScheme.ios').useColorScheme,
  android: () => require('./useColorScheme.android').useColorScheme,
  web: () => require('./useColorScheme.web').useColorScheme,
})();
```

### 2. Performance Optimization Pattern
**Pattern**: Lazy Loading and Memoization

```typescript
// Lazy Component Loading
const TourScreen = lazy(() => import('./TourScreen'));
const ProfileScreen = lazy(() => import('./ProfileScreen'));

// Memoized Components
const TourCard = memo(({ tour }: { tour: Tour }) => {
  return <View>{/* Tour card content */}</View>;
});
```

## 🧪 Testing Patterns

### 1. Component Testing Pattern
**Pattern**: React Testing Library with Mock Providers

```typescript
// Test Setup Pattern
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <Provider store={store}>
      <ApolloProvider client={mockClient}>
        {ui}
      </ApolloProvider>
    </Provider>
  );
}

// Test Example
test('renders login form', () => {
  renderWithProviders(<LoginScreen />);
  expect(screen.getByText('Login')).toBeInTheDocument();
});
```

### 2. Integration Testing Pattern
**Pattern**: End-to-End Testing with Real Dependencies

```typescript
// Integration Test Pattern
describe('Authentication Flow', () => {
  test('user can login and access protected routes', async () => {
    // Setup test database
    await setupTestDatabase();
    
    // Perform login
    await loginUser('testuser', 'password');
    
    // Verify navigation
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
});
```

## 📊 Monitoring Patterns

### 1. Error Tracking Pattern
**Pattern**: Comprehensive Error Monitoring

```typescript
// Error Tracking Hook
export function useErrorTracking() {
  const trackError = useCallback((error: Error, context?: any) => {
    console.error('Error tracked:', error, context);
    // Send to error tracking service
  }, []);
  
  return { trackError };
}
```

### 2. Performance Monitoring Pattern
**Pattern**: Real-time Performance Tracking

```typescript
// Performance Monitoring
export function usePerformanceMonitoring() {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`Component render time: ${duration}ms`);
    };
  }, []);
}
```

---

*This document outlines the key design patterns and architectural decisions used in the Safarnak application. These patterns ensure maintainability, scalability, and consistency across the codebase.*
