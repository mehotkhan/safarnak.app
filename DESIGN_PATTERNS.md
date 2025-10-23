# Safarnak App - Design Patterns & Architecture

## 🏛️ Architectural Patterns

### 1. Monorepo Architecture Pattern
**Pattern**: Yarn Workspaces with Shared Code
**Implementation**: 
- Root package.json manages workspace dependencies
- Shared code in `worker/drizzle/` and `graphql/` directories
- TypeScript path aliases for clean imports (`@drizzle/*`, `@graphql/*`)

**Benefits**:
- Code reuse between client and worker
- Consistent type definitions
- Simplified dependency management
- Single source of truth for schemas

### 2. Offline-First Architecture Pattern
**Pattern**: Local-First with Sync Capabilities
**Implementation**:
- Redux Persist for state persistence
- AsyncStorage for user session data
- Graceful degradation when offline
- Background sync when online

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

**Implementation**:
```typescript
// Redux auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false, user: null, token: null },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    }
  }
});
```

**Benefits**:
- Secure token-based authentication
- Offline authentication support
- Centralized auth state management
- Easy session management

### 2. State Management Pattern
**Pattern**: Redux Toolkit with Persistence

**Implementation**:
```typescript
// Store configuration
const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(offlineMiddleware),
});

// Persistence configuration
const persistedReducer = persistReducer(persistConfig, rootReducer);
```

**Benefits**:
- Predictable state updates
- Time-travel debugging
- State persistence
- Offline state management

### 3. Component Composition Pattern
**Pattern**: Atomic Design with Custom Components

**Implementation**:
```typescript
// Base component
export const CustomText = ({ children, weight, style }) => (
  <Text style={[styles.base, styles[weight], style]}>
    {children}
  </Text>
);

// Composed component
export const Header = ({ title }) => (
  <View style={styles.header}>
    <CustomText weight="bold" style={styles.title}>
      {title}
    </CustomText>
  </View>
);
```

**Benefits**:
- Reusable components
- Consistent design system
- Easy maintenance
- Scalable architecture

### 4. Database Access Pattern
**Pattern**: Drizzle ORM with Type Safety

**Implementation**:
```typescript
// Schema definition
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
});

// Type-safe queries
const user = await db.select().from(users).where(eq(users.id, userId));
```

**Benefits**:
- Type-safe database operations
- Shared schema between client and server
- Migration support
- Query optimization

### 5. API Communication Pattern
**Pattern**: GraphQL with Apollo Client

**Implementation**:
```typescript
// GraphQL query
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      username
    }
  }
`;

// Apollo Client usage
const { data, loading, error } = useQuery(GET_USER, {
  variables: { id: userId }
});
```

**Benefits**:
- Type-safe API calls
- Efficient data fetching
- Real-time subscriptions
- Error handling

## 🔄 Data Flow Patterns

### 1. Unidirectional Data Flow
**Pattern**: Redux + React Components

**Flow**:
```
Action → Reducer → Store → Component → UI
```

**Implementation**:
```typescript
// Action
const loginUser = (user, token) => ({
  type: 'auth/login',
  payload: { user, token }
});

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'auth/login':
      return { ...state, isAuthenticated: true, user: action.payload.user };
    default:
      return state;
  }
};

// Component
const LoginComponent = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  const handleLogin = (user, token) => {
    dispatch(loginUser(user, token));
  };
};
```

### 2. Offline-First Data Flow
**Pattern**: Local Storage + Sync

**Flow**:
```
User Action → Local Storage → Background Sync → Server
```

**Implementation**:
```typescript
// Offline middleware
const offlineMiddleware = (store) => (next) => (action) => {
  if (action.meta?.offline) {
    // Store locally
    AsyncStorage.setItem('offlineActions', JSON.stringify(action));
    // Sync when online
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        syncOfflineActions();
      }
    });
  }
  return next(action);
};
```

## 🎨 UI/UX Patterns

### 1. Theme Pattern
**Pattern**: Context-Based Theme Management

**Implementation**:
```typescript
// Theme context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 2. Internationalization Pattern
**Pattern**: react-i18next with RTL Support

**Implementation**:
```typescript
// Translation hook
const { t, i18n } = useTranslation();

// Component usage
const LoginScreen = () => (
  <View>
    <Text>{t('login.title')}</Text>
    <Text>{t('login.subtitle')}</Text>
  </View>
);
```

### 3. Navigation Pattern
**Pattern**: Expo Router File-Based Routing

**Implementation**:
```
app/
├── _layout.tsx          # Root layout
├── login.tsx            # Login screen
└── (tabs)/              # Tab group
    ├── _layout.tsx      # Tab layout
    ├── index.tsx        # Home tab
    ├── profile.tsx      # Profile tab
    └── tour.tsx         # Tour tab
```

## 🔧 Error Handling Patterns

### 1. Error Boundary Pattern
**Pattern**: React Error Boundaries

**Implementation**:
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
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

### 2. Graceful Degradation Pattern
**Pattern**: Fallback UI for Offline State

**Implementation**:
```typescript
const OfflineWrapper = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });
    return unsubscribe;
  }, []);
  
  if (!isOnline) {
    return <OfflineScreen />;
  }
  
  return children;
};
```

## 📱 Performance Patterns

### 1. Lazy Loading Pattern
**Pattern**: Code Splitting with React.lazy

**Implementation**:
```typescript
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

const App = () => (
  <Suspense fallback={<LoadingScreen />}>
    <LazyComponent />
  </Suspense>
);
```

### 2. Memoization Pattern
**Pattern**: React.memo and useMemo

**Implementation**:
```typescript
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);
  
  return <View>{processedData}</View>;
});
```

### 3. Virtualization Pattern
**Pattern**: FlatList for Large Lists

**Implementation**:
```typescript
const LargeList = ({ data }) => (
  <FlatList
    data={data}
    renderItem={({ item }) => <ListItem item={item} />}
    keyExtractor={item => item.id}
    getItemLayout={(data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    })}
  />
);
```

## 🔐 Security Patterns

### 1. Input Validation Pattern
**Pattern**: Server-Side Validation

**Implementation**:
```typescript
// GraphQL resolver with validation
const createUser = async (parent, args, context) => {
  // Validate input
  const { error } = userSchema.validate(args);
  if (error) {
    throw new Error(`Validation error: ${error.message}`);
  }
  
  // Process request
  return await db.insert(users).values(args);
};
```

### 2. Authentication Pattern
**Pattern**: JWT with Refresh Tokens

**Implementation**:
```typescript
// Token validation middleware
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

## 📊 Monitoring Patterns

### 1. Performance Monitoring
**Pattern**: Custom Performance Hooks

**Implementation**:
```typescript
const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`${componentName} render time: ${end - start}ms`);
    };
  });
};
```

### 2. Error Tracking
**Pattern**: Centralized Error Logging

**Implementation**:
```typescript
const errorLogger = {
  log: (error, context) => {
    console.error('Error:', error);
    console.error('Context:', context);
    // Send to error tracking service
  }
};
```

These patterns provide a solid foundation for building scalable, maintainable, and performant applications with the Safarnak architecture.