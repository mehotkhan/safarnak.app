# GitHub Actions Workflows

This repository includes GitHub Actions workflows focused on building Android APKs for the Safarnak travel application.

## Workflows Overview

### 1. Build and Deploy (`build-and-deploy.yml`)

**Triggers:**
- Push to `master`/`main` branches
- Pull requests to `master`/`main` branches  
- Release publication

**Jobs:**

#### Android Build (`build-android`)
- Builds Android APK using native GitHub Actions (Java + Android SDK + Gradle)
- Uses Expo prebuild to generate native Android project
- Publishes APK as GitHub release asset (on releases)
- Uploads APK as build artifact (on pushes)
- Uses efficient caching for dependencies and Gradle builds

#### Build Summary (`build-summary`)
- Provides a summary of Android build results
- Shows build status and success/failure indicators

### 2. Development Build (`dev-build.yml`)

**Triggers:**
- Push to `develop`/`dev` branches
- Pull requests to `develop`/`dev`

**Jobs:**

#### Android Build (Development)
- Builds debug Android APK for development testing
- Uses native GitHub Actions with optimized caching
- Uploads APK as build artifact for 7 days

#### Type Checking
- Runs TypeScript type checking on client code
- Ensures code quality before builds

### 3. Database Migrations (`database-migrations.yml`)
- **Triggers**: Manual workflow dispatch only
- **Actions**: Runs database migrations on demand (currently disabled)

## Required Secrets

**No external secrets required for Android builds!**

The workflows use native GitHub Actions with:
- Java 17 + Android SDK + Gradle
- Expo prebuild to generate native Android project
- Completely self-contained builds

## Caching Strategy

The workflows implement efficient caching for:

1. **Node.js dependencies**: Cached using `actions/setup-node` with yarn cache
2. **Yarn dependencies**: Cached using `actions/cache` with yarn.lock hash
3. **Gradle dependencies**: Cached for faster Android builds
4. **Android SDK**: Cached for consistent build environment
5. **Build artifacts**: Cached between runs for faster subsequent builds

## Performance Optimizations

1. **Fast Android Builds**: Native Gradle builds with optimized caching
2. **Conditional Execution**: Jobs only run on relevant branches/events
3. **Efficient Caching**: Multiple cache layers for dependencies and build artifacts
4. **Minimal Dependencies**: Only installs what's needed for Android builds

## Build Artifacts

### Android APK
- **Release builds**: Attached to GitHub releases as downloadable assets
- **Development builds**: Available as GitHub Actions artifacts for 7 days
- **Naming**: `safarnak-android-{version}.apk` (releases) / `android-apk-dev` (development)

## Monitoring and Debugging

### Build Status
- Check the Actions tab in GitHub for build status
- Build summary provides quick overview of Android build results
- Failed builds include detailed error logs

### Common Issues

1. **Android Build Failures**: Check Java/Android SDK setup and Gradle configuration
2. **Expo Prebuild Issues**: Ensure all dependencies are properly installed
3. **Cache Issues**: Clear GitHub Actions cache if dependency issues persist

## Customization

### Adding New Jobs
1. Add job definition in workflow file
2. Update `build-summary` job dependencies
3. Add any required secrets to repository settings

### Modifying Build Configurations
- Update `client/android/app/build.gradle` for Android build settings
- Modify `client/eas.json` for Expo configuration
- Adjust Gradle wrapper properties for different Java versions

### Adding Tests
- Extend the `test` job with your testing framework
- Add test result reporting to build summary

## Security Considerations

- **No external API tokens required** for Android builds
- Build artifacts are only accessible to repository members
- No sensitive data is logged in workflow output
- Uses official GitHub Actions with verified sources

## Troubleshooting

### Android Build Issues
```bash
# Test Android build locally
cd client
expo prebuild --platform android --clean
cd android
./gradlew assembleRelease
```

### Worker Deployment Issues
```bash
# Worker deployment is currently disabled
# This section will be updated when worker builds are re-enabled
```

### Cache Issues
- Clear GitHub Actions cache in repository settings
- Or modify cache key to force cache refresh

## Future Enhancements

- [ ] Add iOS build support
- [ ] Integrate automated testing
- [ ] Add performance monitoring
- [ ] Re-enable Cloudflare Worker deployment
- [ ] Add security scanning
- [ ] Integrate with external monitoring services
