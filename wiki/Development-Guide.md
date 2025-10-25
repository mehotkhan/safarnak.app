# 👨‍💻 Development Guide

This guide covers coding standards, workflows, and best practices for Safarnak development.

## 🎯 Development Philosophy

- **Developer-Friendly**: Relaxed TypeScript and ESLint rules for faster development
- **Type Safety**: GraphQL Codegen ensures end-to-end type safety
- **Offline-First**: Redux Persist and offline middleware for seamless UX
- **Semantic Versioning**: Automated versioning and release management
- **Perfect Separation**: Clear boundaries between client, server, and shared code

## 📝 Coding Standards

### TypeScript Configuration

**Balanced Approach** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noUncheckedIndexedAccess": false,
    "exactOptionalPropertyTypes": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Key Rules**:
- ✅ Use `any` type when needed for development flexibility
- ✅ Use `@ts-expect-error` with explanatory comments
- ✅ Type assertions are acceptable for development
- ✅ Focus on functionality over strict typing

### ESLint Configuration

**Developer-Friendly Rules** (`eslint.config.mjs`):
```javascript
rules: {
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  'react-native/no-unused-styles': 'off',
  'jsx-a11y/accessible-emoji': 'off',
  'prettier/prettier': 'off'
}
```

## 🏗️ Project Structure Guidelines

### File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `AuthWrapper.tsx`)
- **Hooks**: `camelCase.ts` starting with 'use' (e.g., `useAuth.ts`)
- **Utilities**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Constants**: `SCREAMING_SNAKE_CASE` inside files
- **Types**: Use descriptive interfaces (e.g., `interface UserProps`)

### Import Organization

**Good**:
```typescript
import { View } from '@components/ui/Themed';
import { LOGIN_MUTATION } from '@graphql/queries';
import { drizzle } from 'drizzle-orm/d1';
```

**Bad**:
```typescript
import { View } from '../../../components/ui/Themed';
import { LOGIN_MUTATION } from './graphql/queries';
```

### Path Aliases

```typescript
"@/*"           → "./*"              // Root files
"@components/*" → "./components/*"   // UI components
"@graphql/*"    → "./graphql/*"      // Shared GraphQL definitions
```

## 🔄 Development Workflows

### Adding New GraphQL Operations

1. **Define Schema**: Add types to `graphql/schema.graphql`
2. **Create Operations**: Add `.graphql` files to `graphql/queries/`
3. **Generate Code**: Run `yarn codegen`
4. **Create Resolvers**: Add resolver functions to `worker/mutations/` or `worker/queries/`
5. **Create Client Wrappers**: Add wrapper files to `api/mutations/` or `api/queries/`
6. **Use in Components**: Import generated hooks in React components

**Example**:

**1. Schema** (`graphql/schema.graphql`):
```graphql
type Mutation {
  createTour(name: String!, description: String!): Tour!
}
```

**2. Operation** (`graphql/queries/createTour.graphql`):
```graphql
mutation CreateTour($name: String!, $description: String!) {
  createTour(name: $name, description: $description) {
    id
    name
    description
    createdAt
  }
}
```

**3. Generate**:
```bash
yarn codegen
```

**4. Resolver** (`worker/mutations/createTour.ts`):
```typescript
export const createTour = async (_, { name, description }, context) => {
  const db = drizzle(context.env.DB);
  
  const tour = await db.insert(tours).values({
    name,
    description,
    createdAt: new Date().toISOString()
  }).returning().get();
  
  return tour;
};
```

**5. Client Wrapper** (`api/mutations/createTour.ts`):
```typescript
import { useCreateTourMutation } from '../hooks';

export const useCreateTour = () => {
  const [createTourMutation, { loading, error }] = useCreateTourMutation();
  
  const createTour = async (name: string, description: string) => {
    const result = await createTourMutation({
      variables: { name, description }
    });
    return result.data?.createTour;
  };
  
  return { createTour, loading, error };
};
```

### Adding New Database Tables

1. **Update Schema**: Add table to `drizzle/schema.ts`
2. **Generate Migration**: Run `yarn db:generate`
3. **Apply Migration**: Run `yarn db:migrate`
4. **Update Types**: Run `yarn codegen` if GraphQL schema changed

**Example**:

**1. Schema** (`drizzle/schema.ts`):
```typescript
export const tours = sqliteTable('tours', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});
```

**2. Generate Migration**:
```bash
yarn db:generate
```

**3. Apply Migration**:
```bash
yarn db:migrate
```

### Adding New UI Components

1. **Create Component**: Add to `components/ui/` or `components/`
2. **Add Types**: Define TypeScript interfaces
3. **Add Translations**: Update `locales/en/` and `locales/fa/`
4. **Test RTL**: Ensure Persian layout works correctly

**Example**:

**Component** (`components/ui/TourCard.tsx`):
```typescript
interface TourCardProps {
  tour: {
    id: string;
    name: string;
    description: string;
  };
  onPress?: () => void;
}

export default function TourCard({ tour, onPress }: TourCardProps) {
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{tour.name}</Text>
      <Text style={styles.description}>{tour.description}</Text>
    </TouchableOpacity>
  );
}
```

**Translations** (`locales/en/translation.json`):
```json
{
  "tour": {
    "title": "Tour Title",
    "description": "Tour Description"
  }
}
```

## 🧪 Testing Strategy

### Component Testing

**Test Structure**:
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import TourCard from '../TourCard';

describe('TourCard', () => {
  it('renders tour information correctly', () => {
    const tour = {
      id: '1',
      name: 'Test Tour',
      description: 'Test Description'
    };
    
    const { getByText } = render(<TourCard tour={tour} />);
    
    expect(getByText('Test Tour')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });
});
```

### GraphQL Testing

**Mock Apollo Client**:
```typescript
import { MockedProvider } from '@apollo/client/testing';
import { GET_TOURS_QUERY } from '../queries';

const mocks = [
  {
    request: {
      query: GET_TOURS_QUERY
    },
    result: {
      data: {
        getTours: [
          { id: '1', name: 'Test Tour', description: 'Test Description' }
        ]
      }
    }
  }
];

describe('TourList', () => {
  it('renders tours from GraphQL', () => {
    render(
      <MockedProvider mocks={mocks}>
        <TourList />
      </MockedProvider>
    );
  });
});
```

## 🔧 Development Tools

### Essential Commands

```bash
# Development
yarn dev                  # Start both worker and client
yarn start                # Expo dev server only
yarn worker:dev           # Worker only

# GraphQL Codegen
yarn codegen              # Generate types and hooks
yarn codegen:watch        # Watch mode for development

# Database
yarn db:generate          # Generate migration from schema
yarn db:migrate           # Apply migrations to local D1
yarn db:studio            # Open Drizzle Studio

# Code Quality
yarn lint                 # Run ESLint
yarn lint:fix             # Fix linting issues
yarn format               # Format with Prettier

# Build
yarn android              # Run on Android
yarn ios                  # Run on iOS
yarn build:release        # EAS build for production
```

### Debugging Tips

**Metro bundler issues**:
```bash
yarn clean
yarn start --clear
```

**Worker issues**:
```bash
# Check worker logs
yarn worker:dev

# Reset database
rm -rf .wrangler
yarn db:migrate
```

**Type errors**:
```bash
# Check all TypeScript errors
npx tsc --noEmit

# Regenerate types
yarn codegen
```

**GraphQL errors**:
```bash
# Test in GraphiQL
open http://localhost:8787/graphql

# Regenerate client code
yarn codegen
```

## 🌐 Internationalization (i18n)

### Adding Translations

**English** (`locales/en/translation.json`):
```json
{
  "common": {
    "welcome": "Welcome to Safarnak",
    "login": "Login",
    "register": "Register"
  },
  "tour": {
    "title": "Tours",
    "create": "Create Tour",
    "description": "Tour Description"
  }
}
```

**Persian** (`locales/fa/translation.json`):
```json
{
  "common": {
    "welcome": "به سفرنک خوش آمدید",
    "login": "ورود",
    "register": "ثبت نام"
  },
  "tour": {
    "title": "تورها",
    "create": "ایجاد تور",
    "description": "توضیحات تور"
  }
}
```

### Using Translations

```typescript
import { useTranslation } from 'react-i18next';

export default function TourScreen() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('common.welcome')}</Text>
      <Text>{t('tour.title')}</Text>
    </View>
  );
}
```

## 🎨 Theming

### Color System

**Light Theme** (`constants/Colors.ts`):
```typescript
export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#2f95dc',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2f95dc',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#fff',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
  },
};
```

### Using Themes

```typescript
import { useThemeColor } from '@components/ui/Themed';

export default function MyComponent() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  return (
    <View style={{ backgroundColor }}>
      <Text style={{ color: textColor }}>Themed Text</Text>
    </View>
  );
}
```

## 🚀 Performance Best Practices

### React Native Optimization

- **Use React.memo** for expensive components
- **Use useCallback** for functions passed as props
- **Use useMemo** for expensive calculations
- **Keep Redux state minimal**
- **Use Apollo Client cache effectively**

### GraphQL Optimization

- **Use fragments** for reusable field sets
- **Implement pagination** for large datasets
- **Use subscriptions** for real-time updates
- **Cache queries** appropriately

## 🔄 Git Workflow

### Commit Standards

**Conventional Commits**:
```bash
feat(auth): add user login functionality
fix(api): resolve GraphQL query error
docs: update README with new features
style: format code with prettier
refactor(store): reorganize Redux slices
```

### Branch Strategy

- **master**: Production-ready code
- **develop**: Integration branch
- **feature/**: New features
- **fix/**: Bug fixes
- **docs/**: Documentation updates

### Pre-commit Hooks

Automatically runs:
- TypeScript check
- ESLint check
- GraphQL codegen
- Database migration check

---

**Next**: Explore [API Documentation](API-Documentation) for GraphQL operations and types.
