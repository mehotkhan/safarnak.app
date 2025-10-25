# 🚀 Deployment Guide

Complete guide for deploying Safarnak to production, including CI/CD setup, environment configuration, and release management.

## 🎯 Deployment Overview

Safarnak uses a modern CI/CD pipeline with:
- **Cloudflare Workers** for serverless backend
- **Cloudflare D1** for serverless database
- **GitHub Actions** for automated builds and deployments
- **EAS Build** for mobile app distribution
- **Semantic Versioning** for automated releases

## 🏗️ CI/CD Pipeline

### GitHub Actions Workflows

#### 1. Quality Assurance (`ci.yml`)

**Triggers**: Push to master/main/develop, Pull requests

**Jobs**:
- 🔍 **Code Quality**: TypeScript check, ESLint, Prettier
- 🗄️ **Database & GraphQL**: Schema validation, codegen
- ⚡ **Worker Testing**: Type checking, linting
- 📱 **Client Testing**: Type checking, linting
- 🔐 **Security Scan**: Dependency audit, security checks
- 🏗️ **Build Test**: Metro bundler, Worker dry-run

#### 2. Worker Deployment (`deploy-worker.yml`)

**Triggers**: Push to master, Manual dispatch

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Deploy to Cloudflare Workers

#### 3. Mobile Build & Deploy (`build-and-deploy.yml`)

**Triggers**: Push to master, Manual dispatch

**Steps**:
1. Setup Android build environment
2. Build APK with EAS
3. Create GitHub release with APK
4. Upload artifacts

## 🌐 Environment Configuration

### Development Environment

**Local Setup**:
```bash
# Environment variables
EXPO_PUBLIC_GRAPHQL_URI=http://localhost:8787/graphql
CLOUDFLARE_D1_DATABASE_ID=my-d1-db

# Start development
yarn dev
```

### Staging Environment

**Cloudflare Workers Preview**:
```bash
# Deploy to preview
wrangler deploy --env staging

# Environment variables
EXPO_PUBLIC_GRAPHQL_URI=https://safarnak-staging.your-subdomain.workers.dev/graphql
CLOUDFLARE_D1_DATABASE_ID=staging-d1-db
```

### Production Environment

**Cloudflare Workers Production**:
```bash
# Deploy to production
wrangler deploy --env production

# Environment variables
EXPO_PUBLIC_GRAPHQL_URI=https://safarnak.your-subdomain.workers.dev/graphql
CLOUDFLARE_D1_DATABASE_ID=production-d1-db
```

## 🔧 Cloudflare Configuration

### Wrangler Configuration

**`wrangler.toml`**:
```toml
name = "safarnak"
main = "worker/index.ts"
compatibility_date = "2024-01-01"

[env.staging]
name = "safarnak-staging"
vars = { ENVIRONMENT = "staging" }

[env.production]
name = "safarnak-production"
vars = { ENVIRONMENT = "production" }

[[d1_databases]]
binding = "DB"
database_name = "my-d1-db"
database_id = "your-database-id"

[[d1_databases]]
binding = "DB"
database_name = "staging-d1-db"
database_id = "your-staging-database-id"

[[d1_databases]]
binding = "DB"
database_name = "production-d1-db"
database_id = "your-production-database-id"
```

### D1 Database Setup

**Create Databases**:
```bash
# Create staging database
wrangler d1 create staging-d1-db

# Create production database
wrangler d1 create production-d1-db
```

**Apply Migrations**:
```bash
# Staging
wrangler d1 migrations apply staging-d1-db --env staging

# Production
wrangler d1 migrations apply production-d1-db --env production
```

## 📱 Mobile App Deployment

### EAS Build Configuration

**`eas.json`**:
```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Build Commands

**Development Build**:
```bash
eas build --profile development --platform android
```

**Preview Build**:
```bash
eas build --profile preview --platform android
```

**Production Build**:
```bash
eas build --profile production --platform android
```

### App Store Deployment

**Google Play Store**:
```bash
# Build AAB for Play Store
eas build --profile production --platform android

# Submit to Play Store
eas submit --platform android
```

**Apple App Store**:
```bash
# Build for App Store
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios
```

## 🔄 Release Management

### Semantic Versioning

Safarnak uses semantic versioning with automated releases:

**Version Stages**:
- **0.5.0 - 0.7.x**: Alpha (Core features implementation)
- **0.8.0 - 0.9.x**: Beta (Feature completion and stabilization)
- **1.0.0+**: Stable (Production ready)

### Release Commands

**Patch Release** (0.5.0 → 0.5.1):
```bash
yarn version:patch
```

**Minor Release** (0.5.0 → 0.6.0):
```bash
yarn version:minor
```

**Major Release** (0.5.0 → 1.0.0):
```bash
yarn version:major
```

**Prerelease** (0.5.0 → 0.5.1-alpha.1):
```bash
yarn version:prerelease
```

### Automated Release Process

**Pre-release Hooks**:
1. Run linting and formatting
2. Generate GraphQL types
3. Generate database migrations
4. Apply migrations

**Post-release Hooks**:
1. Update app.config.js version
2. Create GitHub release
3. Upload APK artifacts
4. Send notifications

## 🔐 Security Configuration

### Environment Variables

**Production Secrets**:
```bash
# Cloudflare API Token
CLOUDFLARE_API_TOKEN=your-api-token

# Database IDs
CLOUDFLARE_D1_DATABASE_ID=your-database-id

# App Store Credentials
EXPO_APPLE_ID=your-apple-id
EXPO_APPLE_ID_PASSWORD=your-apple-password
GOOGLE_SERVICE_ACCOUNT_KEY=your-service-account-key
```

### GitHub Secrets

**Required Secrets**:
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token
- `EXPO_TOKEN`: Expo authentication token
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Google Play Console service account
- `APPLE_ID`: Apple Developer account ID
- `APPLE_ID_PASSWORD`: Apple Developer account password

## 📊 Monitoring & Analytics

### Cloudflare Analytics

**Worker Analytics**:
- Request count and duration
- Error rates and types
- Geographic distribution
- Cache hit rates

**D1 Analytics**:
- Query performance
- Database size
- Connection metrics

### Mobile Analytics

**Expo Analytics**:
- App usage statistics
- Crash reports
- Performance metrics
- User engagement

## 🚨 Troubleshooting

### Common Deployment Issues

**1. Worker Deployment Fails**:
```bash
# Check wrangler configuration
wrangler whoami

# Verify database bindings
wrangler d1 list

# Check environment variables
wrangler secret list
```

**2. Database Migration Fails**:
```bash
# Check database status
wrangler d1 info my-d1-db

# Reset database (development only)
wrangler d1 execute my-d1-db --command="DROP TABLE IF EXISTS users;"
yarn db:migrate
```

**3. Mobile Build Fails**:
```bash
# Check EAS configuration
eas build:list

# Clear build cache
eas build --clear-cache

# Check app configuration
eas app:list
```

**4. CI/CD Pipeline Fails**:
```bash
# Check GitHub Actions logs
# Verify secrets are set correctly
# Check branch protection rules
# Ensure required status checks pass
```

### Performance Optimization

**Worker Optimization**:
- Use Cloudflare Cache API for static content
- Implement request deduplication
- Optimize GraphQL resolvers
- Use D1 connection pooling

**Mobile Optimization**:
- Implement code splitting
- Use lazy loading for screens
- Optimize images and assets
- Implement proper caching strategies

## 🔄 Rollback Procedures

### Worker Rollback

**Quick Rollback**:
```bash
# Deploy previous version
wrangler deploy --env production --compatibility-date=2024-01-01
```

**Database Rollback**:
```bash
# Revert to previous migration
wrangler d1 migrations apply production-d1-db --env production --to=0001
```

### Mobile App Rollback

**Google Play Store**:
1. Go to Play Console
2. Select previous version
3. Promote to production
4. Notify users of rollback

**Apple App Store**:
1. Go to App Store Connect
2. Select previous build
3. Submit for review
4. Wait for approval

## 📈 Scaling Considerations

### Database Scaling

**D1 Limitations**:
- 100MB database size limit
- 1000 requests per second
- 100 concurrent connections

**Scaling Strategies**:
- Implement database sharding
- Use read replicas for queries
- Cache frequently accessed data
- Optimize query performance

### Worker Scaling

**Cloudflare Workers Limits**:
- 10ms CPU time per request
- 128MB memory limit
- 1000 requests per second

**Scaling Strategies**:
- Implement request batching
- Use Cloudflare Cache API
- Optimize GraphQL resolvers
- Implement proper error handling

---

**Next**: Return to [Home](Home) for project overview and quick start guide.
