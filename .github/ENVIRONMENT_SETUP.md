# GitHub Actions Environment Setup Guide

## Required Secrets Configuration

**No external secrets required for Android builds!**

The workflows use native GitHub Actions with:
- **Java 17**: Provided by GitHub Actions
- **Android SDK**: Installed via `android-actions/setup-android`
- **Gradle**: Uses project's Gradle wrapper
- **Expo Prebuild**: Generates native Android project locally

## Environment Variables (Optional)

### For Enhanced Logging
- `EXPO_DEBUG`: Set to `1` for verbose Expo CLI output
- `WRANGLER_LOG_LEVEL`: Set to `debug` for verbose Wrangler output

### For Custom Build Configurations
- `ANDROID_BUILD_TYPE`: Override build type (default: `release` for production, `debug` for dev)
- `GRADLE_OPTS`: Additional Gradle options for build optimization

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

### Android Build Types (Native Gradle)
- **`release`**: Production-ready APK for releases
- **`debug`**: Development APK for testing
- **Build profiles**: Configured in `client/android/app/build.gradle`
- **Signing**: Uses debug keystore for development, release keystore for production

### Worker Environments (Currently Disabled)
- **Worker deployment is currently disabled**
- **Configuration**: Stored in `worker/wrangler.toml` for future use

## Monitoring and Alerts

### 1. Build Status Monitoring
- Set up notifications for failed builds
- Monitor build times and optimize if needed
- Track artifact download counts

### 2. Deployment Monitoring (Currently Disabled)
- Worker deployment monitoring is currently disabled
- Will be re-enabled when worker builds are restored

### 3. Database Migration Monitoring (Currently Disabled)
- Database migration monitoring is currently disabled
- Will be re-enabled when worker builds are restored

## Troubleshooting Common Issues

### Android Build Issues
```bash
# Test native Android build locally
cd client
expo prebuild --platform android --clean
cd android
./gradlew assembleRelease

# For debug builds
./gradlew assembleDebug
```

### Worker Deployment Issues (Currently Disabled)
```bash
# Worker deployment is currently disabled
# This section will be updated when worker builds are re-enabled
```

### Database Migration Issues (Currently Disabled)
```bash
# Database migrations are currently disabled
# This section will be updated when worker builds are re-enabled
```

## Performance Optimization Tips

### 1. Cache Optimization
- Monitor cache hit rates in workflow logs
- Adjust cache keys if dependencies change frequently
- Use separate caches for different job types

### 2. Build Optimization
- Use parallel jobs where possible (currently Android-only)
- Optimize Gradle build configuration
- Monitor build times and optimize accordingly

### 3. Deployment Optimization (Currently Disabled)
- Deployment optimization is currently disabled
- Will be re-enabled when worker builds are restored

## Security Best Practices

### 1. Secret Management (Currently Not Applicable)
- **No external secrets required** for Android builds
- Uses GitHub Actions built-in authentication
- No API tokens to manage or rotate

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
- Review and update workflow configurations
- Clean up old build artifacts
- Update documentation
- Monitor build performance metrics

### Quarterly
- Review and optimize caching strategies
- Update build tools and dependencies
- Conduct security audit
- Review and update monitoring alerts
