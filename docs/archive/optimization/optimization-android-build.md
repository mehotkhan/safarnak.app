### Android Build & CI Optimization Checklist

- [ ] Enable Gradle build cache
  - Add to `android/gradle.properties`: `org.gradle.caching=true`
- [ ] Keep Hermes + R8 full mode + resource shrink
  - Already enabled in `gradle.properties` and `app/build.gradle` (keep as-is).
- [ ] Only arm64-v8a (v8) build for GitHub APK
  - Already enforced via `reactNativeArchitectures=arm64-v8a` and `ndk { abiFilters 'arm64-v8a' }`.
  - CI step: `./gradlew :app:assembleRelease` will produce arm64-only APK.
- [ ] Prefer AAB for Play Store
  - Use `:app:bundleRelease` for store delivery; APK only for GitHub artifacts.
- [ ] Concurrency and path filters in CI
  - Cancel superseded runs; trigger Android build only when client/android files change.
- [ ] Strong caching in CI
  - Cache Yarn, Gradle wrapper, and Gradle caches; set `--build-cache` and `--parallel`.
- [ ] WebP policy
  - Since assets are WebP, prefer `expo-image` pipeline (RN side) and keep Fresco extras disabled.

Example GitHub Actions steps (APK, arm64-v8a only is already configured)

```yaml
jobs:
  android-apk:
    runs-on: ubuntu-latest
    concurrency:
      group: android-${{ github.ref }}
      cancel-in-progress: true
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'yarn'
      - uses: gradle/gradle-build-action@v3
        with:
          gradle-home-cache-cleanup: true
      - name: Install dependencies
        run: yarn --frozen-lockfile
      - name: Build arm64-v8a APK (Release)
        env:
          NODE_ENV: production
        run: |
          cd android
          ./gradlew :app:assembleRelease --build-cache --parallel --max-workers=4 --stacktrace
      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: safarnak-arm64-v8a-apk
          path: android/app/build/outputs/apk/release/*.apk
```

Acceptance
- [ ] CI APK artifact is arm64-v8a only
- [ ] Play Store deliverable uses AAB
- [ ] Cold CI build time reduced via caching








