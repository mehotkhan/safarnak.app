# 🚀 Getting Started

This guide will help you set up Safarnak on your local development environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Yarn** 1.22+ ([Install Guide](https://yarnpkg.com/getting-started/install))
- **Git** ([Download](https://git-scm.com/))
- **Expo CLI** (`npm install -g @expo/cli`)
- **Wrangler CLI** (`npm install -g wrangler`)

### Mobile Development (Optional)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mehotkhan/safarnak.app.git
cd safarnak.app
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# GraphQL API URL
EXPO_PUBLIC_GRAPHQL_URI=http://localhost:8787/graphql

# Cloudflare D1 Database (for local development)
CLOUDFLARE_D1_DATABASE_ID=my-d1-db
```

### 4. Database Setup

```bash
# Generate database migrations
yarn db:generate

# Apply migrations to local D1 database
yarn db:migrate
```

### 5. GraphQL Codegen

```bash
# Generate TypeScript types and React Apollo hooks
yarn codegen
```

## 🏃‍♂️ Running the Application

### Development Mode

Start both the worker and client in development mode:

```bash
yarn dev
```

This will start:
- **Worker**: Cloudflare Worker at `http://localhost:8787`
- **Client**: Expo development server

### Individual Services

**Start only the worker:**
```bash
yarn worker:dev
```

**Start only the client:**
```bash
yarn start
```

### Mobile Development

**Android:**
```bash
yarn android
```

**iOS:**
```bash
yarn ios
```

**Web:**
```bash
yarn web
```

## 🧪 Testing the Setup

### 1. Verify Worker is Running

Visit `http://localhost:8787/graphql` in your browser. You should see the GraphQL playground.

### 2. Test GraphQL Operations

Try this query in the GraphQL playground:

```graphql
query {
  me {
    id
    username
  }
}
```

### 3. Verify Client Connection

The Expo app should automatically connect to the GraphQL endpoint. Check the console for any connection errors.

## 🛠️ Development Tools

### Database Management

**Drizzle Studio** (Database GUI):
```bash
yarn db:studio
```
Opens at `http://localhost:4983`

### Code Quality

**Linting:**
```bash
yarn lint
yarn lint:fix
```

**Type Checking:**
```bash
npx tsc --noEmit
```

**Formatting:**
```bash
yarn format
```

### GraphQL Development

**Watch Mode** (Auto-regenerate on schema changes):
```bash
yarn codegen:watch
```

## 🐛 Troubleshooting

### Common Issues

**1. Metro bundler cache issues:**
```bash
yarn clean
yarn start --clear
```

**2. Database connection errors:**
```bash
yarn db:migrate
```

**3. GraphQL type errors:**
```bash
yarn codegen
```

**4. Worker not starting:**
```bash
# Check if port 8787 is available
lsof -i :8787
# Kill any processes using the port
kill -9 <PID>
```

### Reset Everything

If you encounter persistent issues:

```bash
# Clean all caches and dependencies
yarn clean
rm -rf node_modules
yarn install

# Reset database
rm -rf .wrangler
yarn db:migrate

# Regenerate everything
yarn codegen
```

## 📱 Mobile Setup

### Android

1. Install Android Studio
2. Set up Android SDK
3. Create a virtual device or connect a physical device
4. Run `yarn android`

### iOS (macOS only)

1. Install Xcode from App Store
2. Install Xcode command line tools: `xcode-select --install`
3. Install CocoaPods: `sudo gem install cocoapods`
4. Run `yarn ios`

## 🌐 Web Development

The app runs on web using React Native Web. Simply run:

```bash
yarn web
```

The app will open in your default browser at `http://localhost:8081`.

## 🔄 Next Steps

Now that you have Safarnak running locally:

1. Read the [Architecture](Architecture) guide to understand the system design
2. Check out the [Development Guide](Development-Guide) for coding standards
3. Explore the [API Documentation](API-Documentation) for GraphQL operations
4. Learn about [Deployment](Deployment-Guide) for production setup

## 💡 Tips

- Use `yarn dev` for full-stack development
- Keep `yarn codegen:watch` running during GraphQL development
- Use Drizzle Studio for database inspection
- Check the browser console for client-side errors
- Monitor the worker terminal for server-side logs

---

**Need help?** Check our [GitHub Issues](https://github.com/mehotkhan/safarnak.app/issues) or create a new one!
