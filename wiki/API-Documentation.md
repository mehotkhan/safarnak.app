# 📚 API Documentation

Complete documentation for Safarnak's GraphQL API, including schema definitions, operations, and type references.

## 🎯 GraphQL Schema Overview

Safarnak uses GraphQL for type-safe client-server communication. The schema is defined in `graphql/schema.graphql` and shared between client and worker.

### Base Types

```graphql
scalar String
scalar Int
scalar Float
scalar Boolean
scalar ID
scalar Date
```

## 👤 User Management

### User Type

```graphql
type User {
  id: ID!
  username: String!
  createdAt: String!
}
```

### Authentication Types

```graphql
type AuthPayload {
  user: User!
  token: String!
}

input RegisterInput {
  username: String!
  password: String!
}

input LoginInput {
  username: String!
  password: String!
}
```

### User Operations

#### Register User

**Mutation**:
```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    user {
      id
      username
      createdAt
    }
    token
  }
}
```

**Variables**:
```json
{
  "input": {
    "username": "john_doe",
    "password": "secure_password"
  }
}
```

**Response**:
```json
{
  "data": {
    "register": {
      "user": {
        "id": "1",
        "username": "john_doe",
        "createdAt": "2024-01-01T00:00:00Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### Login User

**Mutation**:
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    user {
      id
      username
      createdAt
    }
    token
  }
}
```

**Variables**:
```json
{
  "input": {
    "username": "john_doe",
    "password": "secure_password"
  }
}
```

#### Get Current User

**Query**:
```graphql
query Me {
  me {
    id
    username
    createdAt
  }
}
```

**Response**:
```json
{
  "data": {
    "me": {
      "id": "1",
      "username": "john_doe",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

## 💬 Messaging System

### Message Type

```graphql
type Message {
  id: ID!
  content: String!
  user: User!
  createdAt: String!
}
```

### Message Operations

#### Get Messages

**Query**:
```graphql
query GetMessages {
  getMessages {
    id
    content
    user {
      id
      username
    }
    createdAt
  }
}
```

**Response**:
```json
{
  "data": {
    "getMessages": [
      {
        "id": "1",
        "content": "Hello, world!",
        "user": {
          "id": "1",
          "username": "john_doe"
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### Add Message

**Mutation**:
```graphql
mutation AddMessage($content: String!) {
  addMessage(content: $content) {
    id
    content
    user {
      id
      username
    }
    createdAt
  }
}
```

**Variables**:
```json
{
  "content": "Hello, everyone!"
}
```

#### New Messages Subscription

**Subscription**:
```graphql
subscription NewMessages {
  newMessages {
    id
    content
    user {
      id
      username
    }
    createdAt
  }
}
```

## 🗺️ Tour Management (Future)

### Tour Type

```graphql
type Tour {
  id: ID!
  name: String!
  description: String!
  createdAt: String!
  updatedAt: String!
}
```

### Tour Operations

#### Get Tours

**Query**:
```graphql
query GetTours {
  getTours {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

#### Create Tour

**Mutation**:
```graphql
mutation CreateTour($name: String!, $description: String!) {
  createTour(name: $name, description: $description) {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

## 🔧 Client-Side Usage

### Generated Hooks

Safarnak uses GraphQL Codegen to automatically generate TypeScript types and React Apollo hooks.

#### Using Generated Hooks

**Login Hook**:
```typescript
import { useLoginMutation } from '../api/hooks';

export function LoginForm() {
  const [loginMutation, { loading, error }] = useLoginMutation();
  
  const handleLogin = async (username: string, password: string) => {
    try {
      const result = await loginMutation({
        variables: { username, password }
      });
      
      if (result.data?.login) {
        // Handle successful login
        console.log('Login successful:', result.data.login.user);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  
  return (
    // Login form JSX
  );
}
```

**Messages Query Hook**:
```typescript
import { useGetMessagesQuery } from '../api/hooks';

export function MessagesList() {
  const { data, loading, error } = useGetMessagesQuery();
  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  
  return (
    <View>
      {data?.getMessages.map(message => (
        <View key={message.id}>
          <Text>{message.user.username}: {message.content}</Text>
        </View>
      ))}
    </View>
  );
}
```

**New Messages Subscription**:
```typescript
import { useNewMessagesSubscription } from '../api/hooks';

export function MessagesContainer() {
  const { data, loading } = useNewMessagesSubscription();
  
  useEffect(() => {
    if (data?.newMessages) {
      // Handle new message
      console.log('New message:', data.newMessages);
    }
  }, [data]);
  
  return (
    // Messages container JSX
  );
}
```

### Type Safety

**Generated Types**:
```typescript
// Auto-generated from GraphQL schema
export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['ID']['output'];
  content: Scalars['String']['output'];
  user: User;
  createdAt: Scalars['String']['output'];
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;

export type LoginMutation = {
  __typename?: 'Mutation';
  login: {
    __typename?: 'AuthPayload';
    user: User;
    token: Scalars['String']['output'];
  };
};
```

## 🔐 Authentication

### Token-Based Authentication

Safarnak uses JWT-like tokens for authentication. Tokens are generated server-side and stored client-side.

#### Token Generation

**Server-side** (`worker/utilities/utils.ts`):
```typescript
export function generateToken(userId: string, username: string): string {
  const timestamp = Date.now().toString();
  const payload = `${userId}:${username}:${timestamp}`;
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload))
    .then(hash => Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''));
}
```

#### Token Storage

**Client-side** (`store/slices/authSlice.ts`):
```typescript
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    }
  }
});
```

#### Apollo Client Authentication

**Client Setup** (`api/client.ts`):
```typescript
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => {
  const token = store.getState().auth.token;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

## 🚨 Error Handling

### GraphQL Errors

**Error Types**:
```typescript
interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: Array<string | number>;
  extensions?: {
    code: string;
    [key: string]: any;
  };
}
```

**Error Handling Example**:
```typescript
const [loginMutation, { loading, error }] = useLoginMutation();

const handleLogin = async (username: string, password: string) => {
  try {
    const result = await loginMutation({
      variables: { username, password }
    });
    
    if (result.errors) {
      // Handle GraphQL errors
      result.errors.forEach(error => {
        console.error('GraphQL Error:', error.message);
      });
    }
    
    if (result.data?.login) {
      // Handle success
    }
  } catch (err) {
    // Handle network errors
    console.error('Network Error:', err);
  }
};
```

### Common Error Codes

- `UNAUTHENTICATED`: User not logged in
- `FORBIDDEN`: User lacks permissions
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error

## 🔄 Real-time Updates

### WebSocket Subscriptions

Safarnak uses GraphQL subscriptions for real-time updates.

#### Subscription Setup

**Client Configuration**:
```typescript
import { WebSocketLink } from '@apollo/client/link/ws';

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8787/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      authorization: `Bearer ${token}`,
    },
  },
});
```

#### Using Subscriptions

**New Messages Subscription**:
```typescript
const { data, loading, error } = useNewMessagesSubscription();

useEffect(() => {
  if (data?.newMessages) {
    // Update messages list
    dispatch(addMessage(data.newMessages));
  }
}, [data]);
```

## 📊 Performance Optimization

### Query Optimization

**Fragment Usage**:
```graphql
fragment UserInfo on User {
  id
  username
  createdAt
}

query GetMessages {
  getMessages {
    id
    content
    user {
      ...UserInfo
    }
    createdAt
  }
}
```

**Pagination**:
```graphql
query GetMessages($first: Int, $after: String) {
  getMessages(first: $first, after: $after) {
    edges {
      node {
        id
        content
        user {
          username
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Caching Strategy

**Apollo Client Cache**:
```typescript
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getMessages: {
          merge(existing, incoming) {
            return [...existing, ...incoming];
          }
        }
      }
    }
  }
});
```

---

**Next**: Learn about [Deployment Guide](Deployment-Guide) for production setup and CI/CD.
