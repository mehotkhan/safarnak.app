# Safarnak App Build Configuration

This document explains how to build different versions of the Safarnak app for development and production.

## App Configurations

### Development (`safarnak-dev`)
- **App Name**: Safarnak Dev
- **Package**: com.mehotkhan.safarnak
- **Scheme**: safarnak-dev
- **GraphQL URL**: http://192.168.1.51:8787/graphql (local network)
- **Build Type**: Debug APK

### Preview (`safarnak-preview`)
- **App Name**: Safarnak Preview
- **Package**: com.mehotkhan.safarnak
- **Scheme**: safarnak-preview
- **GraphQL URL**: https://safarnak-worker.mehot1.workers.dev/graphql
- **Build Type**: Release APK

### Production (`safarnak-prod`)
- **App Name**: Safarnak
- **Package**: com.mehotkhan.safarnak
- **Scheme**: safarnak
- **GraphQL URL**: https://safarnak.mohet.ir/graphql
- **Build Type**: Release APK

## Build Methods

### 1. Using Build Script (Recommended)

```bash
# Development build
./scripts/build.sh dev

# Preview build
./scripts/build.sh preview

# Production build
./scripts/build.sh prod

# Start local development server
./scripts/build.sh local-dev
```

### 2. Using EAS Build

```bash
# Development build
eas build --profile development --platform android

# Preview build
eas build --profile preview --platform android

# Production build
eas build --profile production --platform android
```

### 3. Manual Build

```bash
# Navigate to client directory
cd client

# Generate Android project
npx expo prebuild --platform android --clean

# Build APK
cd android
./gradlew assembleDebug    # For development
./gradlew assembleRelease  # For production
```

## Environment Variables

The app uses environment variables to configure different builds:

- `APP_NAME`: Display name of the app
- `APP_SCHEME`: URL scheme for deep linking
- `GRAPHQL_URL`: GraphQL API endpoint

These are set in `client/eas.json` for each build profile.

## GraphQL URLs

### Development
- **Local Network**: http://192.168.1.51:8787/graphql
- **Usage**: For testing on local network devices
- **Requirements**: Worker running locally on port 8787

### Preview
- **Cloudflare Worker**: https://safarnak-worker.mehot1.workers.dev/graphql
- **Usage**: For testing with deployed worker
- **Requirements**: Worker deployed to Cloudflare

### Production
- **Custom Domain**: https://safarnak.mohet.ir/graphql
- **Usage**: Production deployment
- **Requirements**: Custom domain configured with Cloudflare

## GitHub Actions

The GitHub Actions workflow automatically builds production APKs when:
- Pushing to `master`/`main` branches
- Creating releases

The production build uses:
- **App Name**: Safarnak
- **GraphQL URL**: https://safarnak.mohet.ir/graphql
- **Build Type**: Release APK

## Troubleshooting

### GraphQL Connection Issues
1. **Development**: Ensure worker is running locally on port 8787
2. **Preview**: Check if worker is deployed to Cloudflare
3. **Production**: Verify custom domain is configured

### Build Issues
1. **Clean build**: Run `npx expo prebuild --platform android --clean`
2. **Clear cache**: Delete `client/android/.gradle` directory
3. **Check dependencies**: Run `yarn install` in client directory

### App Installation Issues
1. **Different schemes**: Each build uses different URL schemes
2. **Package conflicts**: All builds use same package name
3. **Uninstall previous**: Uninstall previous version before installing new one
