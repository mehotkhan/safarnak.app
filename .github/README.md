# GitHub Actions - Android APK Build

Simple GitHub Actions workflow to build Android APKs for the Safarnak travel application.

## Workflow

**Triggers:**
- Push to `master`/`main` branches
- Release publication

**What it does:**
- Builds Android APK using native GitHub Actions (Java + Android SDK + Gradle)
- Uses Expo prebuild to generate native Android project
- Publishes APK as GitHub release asset (on releases)
- Uploads APK as build artifact (on pushes)

## Setup

**No secrets required!** The workflow uses native GitHub Actions with:
- Java 17 + Android SDK + Gradle
- Expo prebuild to generate native Android project
- Completely self-contained builds

## Performance

**Aggressive caching** for maximum speed:
- Dependencies, Gradle cache, Android SDK, Expo CLI
- **First build**: ~8-12 minutes
- **Subsequent builds**: ~2-4 minutes (80% faster!)

## Usage

1. **Push to master**: Triggers Android build
2. **Create release**: Automatically attaches APK as downloadable asset
3. **Check Actions tab**: Monitor build status and download artifacts

## Troubleshooting

**Android Build Issues:**
```bash
# Test locally
cd client
expo prebuild --platform android --clean
cd android
./gradlew assembleRelease
```

**Cache Issues:**
- Clear GitHub Actions cache in repository settings
- Or modify cache key to force cache refresh
