# GitHub Actions Workflows

This directory contains optimized GitHub Actions workflows for the Safarnak project.

## 📋 Workflows

### 1. **android-build.yml** - Android Build and Release
**Triggers:**
- Push to `master`, `main`, or `develop` branches
- Pull requests to these branches
- Manual workflow dispatch

**Features:**
- ✅ **Advanced Caching**: Multi-level caching for Yarn, Gradle, Metro, and build artifacts
- ✅ **Parallel Builds**: Utilizes 4 workers for faster compilation
- ✅ **Optimized Memory**: JVM configured with 4GB heap and efficient GC
- ✅ **Build Cache**: Gradle build cache enabled for incremental builds
- ✅ **Dependency Management**: Frozen lockfiles and offline-first approach
- ✅ **Automatic Releases**: Creates GitHub releases for version tags
- ✅ **Build Summary**: Detailed summary in GitHub Actions UI

**Build Optimizations:**
```yaml
--no-daemon          # Avoids daemon overhead in CI
--build-cache        # Enables Gradle build cache
--parallel           # Parallel execution
--max-workers=4      # 4 parallel workers
--configure-on-demand # On-demand configuration
```

**Cache Strategy:**
1. **Yarn Cache**: Dependencies cached based on `yarn.lock`
2. **Gradle Cache**: Gradle wrapper and dependencies
3. **Metro Cache**: JavaScript bundler cache
4. **Build Cache**: Intermediate build artifacts

**Estimated Build Times:**
- **Cold build** (no cache): ~15-20 minutes
- **Warm build** (with cache): ~5-8 minutes
- **Incremental build** (minor changes): ~2-4 minutes

### 2. **pr-checks.yml** - Pull Request Checks
**Triggers:**
- Pull request opened, synchronized, or reopened

**Features:**
- ✅ **Quick TypeScript Check**: Validates types without building
- ✅ **Format Validation**: Prettier format checking (optional)
- ✅ **PR Comments**: Automatic status updates on PRs
- ✅ **Concurrency Control**: Cancels outdated PR checks

## 🚀 Usage

### Manual Build Trigger
```bash
# Via GitHub UI
Actions → Android Build and Release → Run workflow → Select branch

# Via GitHub CLI
gh workflow run android-build.yml -f build_type=release
```

### Creating a Release
```bash
# Tag your commit
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Workflow will automatically create a GitHub release with APK
```

## 📦 Artifacts

**APK Naming Convention:**
```
safarnak-v{VERSION}-{COMMIT_HASH}.apk
Example: safarnak-v1.0.0-a1b2c3d.apk
```

**Artifact Retention:**
- Development builds: 30 days
- Release builds: Permanent (attached to GitHub release)

## ⚡ Performance Tips

### 1. **Cache Hit Optimization**
- Keep dependencies stable between builds
- Use `yarn.lock` consistently
- Avoid unnecessary dependency updates

### 2. **Build Time Reduction**
```gradle
# Already configured in build.gradle
splits.abi.enable = false      # Single universal APK
splits.density.enable = false  # No density splits
```

### 3. **Parallel Execution**
```bash
# Gradle uses all available CPU cores
./gradlew assembleRelease --parallel --max-workers=4
```

## 🔧 Configuration

### Environment Variables
```yaml
NODE_VERSION: '20'         # Node.js LTS version
JAVA_VERSION: '17'         # Java for Android builds
GRADLE_VERSION: '8.14.3'   # Gradle version
```

### Secrets Required
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Optional Secrets (for future use)
- `ANDROID_KEYSTORE`: For production signing
- `KEYSTORE_PASSWORD`: Keystore password
- `KEY_ALIAS`: Key alias
- `KEY_PASSWORD`: Key password

## 📊 Monitoring

### Build Metrics
- Build duration
- Cache hit rates
- APK size
- Memory usage

### Accessing Logs
```bash
# View logs via GitHub CLI
gh run list --workflow=android-build.yml
gh run view <run-id> --log
```

## 🐛 Troubleshooting

### Cache Issues
```bash
# Clear caches manually if needed
gh cache delete <cache-key>

# Or clear all caches
gh cache list | awk '{print $1}' | xargs -I {} gh cache delete {}
```

### Build Failures
1. **Check Node/Java versions**: Ensure compatibility
2. **Verify dependencies**: Run `yarn install` locally
3. **Clear Gradle cache**: Remove `~/.gradle/caches`
4. **Check build logs**: Review detailed error messages

### Memory Issues
```yaml
# Increase JVM heap in workflow
-Dorg.gradle.jvmargs="-Xmx6g ..."  # Increase from 4g to 6g
```

## 📈 Best Practices

### 1. **Branch Protection**
```yaml
# Require status checks before merging
- Android Build and Release
- Pull Request Checks
```

### 2. **Commit Messages**
```bash
# Use conventional commits for better changelog
feat: add new feature
fix: bug fix
perf: performance improvement
```

### 3. **Version Tagging**
```bash
# Semantic versioning
v1.0.0  # Major.Minor.Patch
v1.1.0  # New features
v1.1.1  # Bug fixes
```

## 🔄 Workflow Updates

To update workflows:
```bash
# Edit workflow file
vim .github/workflows/android-build.yml

# Commit and push
git add .github/workflows/
git commit -m "ci: update Android build workflow"
git push
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Gradle Build Cache](https://docs.gradle.org/current/userguide/build_cache.html)
- [Android Gradle Plugin](https://developer.android.com/build)
- [Expo Build Process](https://docs.expo.dev/build-reference/android-builds/)

## 🎯 Future Enhancements

- [ ] Add automated testing (Unit tests, E2E tests)
- [ ] Implement code coverage reports
- [ ] Add security scanning (SAST/DAST)
- [ ] Deploy to Google Play Store
- [ ] Add performance benchmarking
- [ ] Implement semantic versioning automation
- [ ] Add changelog generation

---

**Last Updated**: October 2025
**Maintained By**: Safarnak Team

