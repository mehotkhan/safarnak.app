# GitHub Actions Environment Setup Guide

## Required Secrets Configuration

### 1. Expo Token (for Android builds)
- **Secret Name**: `EXPO_TOKEN`
- **How to get**: 
  1. Go to https://expo.dev/accounts/[your-username]/settings/access-tokens
  2. Create a new token with appropriate permissions
  3. Copy the token value
- **Required Permissions**: 
  - `build:read` - to check build status
  - `build:write` - to create builds
  - `project:read` - to access project settings

### 2. Cloudflare API Token (for Worker deployment)
- **Secret Name**: `CLOUDFLARE_API_TOKEN`
- **How to get**:
  1. Go to https://dash.cloudflare.com/profile/api-tokens
  2. Create a custom token with the following permissions:
     - **Account**: `Cloudflare Workers:Edit`
     - **Zone**: `Zone:Read` (if using custom domain)
     - **Zone**: `Zone Settings:Edit` (if using custom domain)
  3. Include your account and zone resources
  4. Copy the token value

## Environment Variables (Optional)

### For Enhanced Logging
- `EXPO_DEBUG`: Set to `1` for verbose Expo CLI output
- `WRANGLER_LOG_LEVEL`: Set to `debug` for verbose Wrangler output

### For Custom Build Configurations
- `ANDROID_BUILD_PROFILE`: Override default build profile (default: `preview`)
- `WORKER_ENVIRONMENT`: Override worker environment (default: `production`)

## Repository Settings

### 1. Branch Protection Rules
Configure branch protection for `master`/`main`:
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Include administrators in protection rules

### 2. Actions Permissions
In repository settings → Actions → General:
- Allow all actions and reusable workflows
- Allow GitHub Actions to create and approve pull requests
- Allow actions to read and write permissions

### 3. Workflow Permissions
Ensure the following permissions are enabled:
- **Contents**: Read (for code checkout)
- **Actions**: Read (for workflow status)
- **Metadata**: Read (for repository information)
- **Pull requests**: Write (for PR comments/status)

## Workflow Triggers

### Production Workflow (`build-and-deploy.yml`)
- **Triggers**: 
  - Push to `master`/`main` branches
  - Release publication
  - Pull requests to `master`/`main`
- **Actions**:
  - Builds Android APK and publishes to releases
  - Deploys Cloudflare Worker to production
  - Runs comprehensive tests

### Development Workflow (`dev-build.yml`)
- **Triggers**:
  - Push to `develop`/`dev` branches
  - Pull requests to `develop`/`dev`
- **Actions**:
  - Builds development Android APK
  - Deploys Worker to development environment
  - Runs type checking

### Database Migration Workflow (`database-migrations.yml`)
- **Triggers**:
  - Manual workflow dispatch only
- **Actions**:
  - Runs database migrations on demand
  - Supports dry-run mode
  - Works with both production and development environments

## Build Profiles Configuration

### Android Build Profiles (in `client/eas.json`)
- **`preview`**: Production-ready APK for testing
- **`preview2`**: Alternative production build
- **`preview3`**: Development client build
- **`preview4`**: Internal distribution build
- **`production`**: App store release build

### Worker Environments (in `worker/wrangler.toml`)
- **Production**: Default environment for live deployment
- **Development**: Separate environment for testing (configure separately)

## Monitoring and Alerts

### 1. Build Status Monitoring
- Set up notifications for failed builds
- Monitor build times and optimize if needed
- Track artifact download counts

### 2. Deployment Monitoring
- Monitor Cloudflare Worker deployment success
- Set up alerts for deployment failures
- Track worker performance metrics

### 3. Database Migration Monitoring
- Monitor migration execution times
- Set up alerts for migration failures
- Track database schema changes

## Troubleshooting Common Issues

### Android Build Issues
```bash
# Test EAS authentication
eas whoami

# Test build locally
cd client
eas build --platform android --profile preview --local

# Check build status
eas build:list --platform android --limit 5
```

### Worker Deployment Issues
```bash
# Test Wrangler authentication
cd worker
wrangler whoami

# Test deployment locally
wrangler dev

# Check deployment status
wrangler deployments list
```

### Database Migration Issues
```bash
# Check migration files
ls -la drizzle/migrations/worker/

# Test migrations locally
cd worker
yarn db:migrate

# Check database status
wrangler d1 info my-d1-db
```

## Performance Optimization Tips

### 1. Cache Optimization
- Monitor cache hit rates in workflow logs
- Adjust cache keys if dependencies change frequently
- Use separate caches for different job types

### 2. Build Optimization
- Use parallel jobs where possible
- Optimize Docker images if using containerized builds
- Consider using self-hosted runners for faster builds

### 3. Deployment Optimization
- Use incremental deployments where possible
- Implement blue-green deployments for zero downtime
- Monitor deployment times and optimize accordingly

## Security Best Practices

### 1. Secret Management
- Rotate API tokens regularly
- Use minimal required permissions
- Never log secret values
- Use environment-specific secrets when possible

### 2. Access Control
- Limit workflow permissions to minimum required
- Use branch protection rules
- Implement code review requirements
- Monitor workflow access logs

### 3. Build Security
- Scan dependencies for vulnerabilities
- Use signed builds when possible
- Implement build artifact verification
- Monitor for suspicious activity

## Maintenance Tasks

### Weekly
- Review failed builds and optimize
- Check for dependency updates
- Monitor build performance metrics

### Monthly
- Rotate API tokens
- Review and update workflow configurations
- Clean up old build artifacts
- Update documentation

### Quarterly
- Review and optimize caching strategies
- Update build tools and dependencies
- Conduct security audit
- Review and update monitoring alerts
