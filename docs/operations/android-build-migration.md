# Android Build System Cleanup & Optimization Plan

Goals
- Production builds: smaller APK/AAB size, faster builds, consistent IDs/signing.
- Local builds: `yarn android` always produces a debuggable build with a debug app ID.
- CI builds: always produce optimized release artifacts with stable production app ID.

Non-Goals
- No functional feature changes to the app.
- No changes to backend workflows beyond what’s required for client configuration.

Current State (Findings)
- Expo config (`app.config.js`)
  - Dynamically switches name/scheme/IDs based on `EAS_BUILD_PROFILE`.
  - Development (no profile) and `debug` → use `ir.mohet.safarnak_debug` and `safarnak-debug`.
  - `release` → uses production `ir.mohet.safarnak` and `safarnak`.
  - Calculates `versionCode` from semver: OK.
  - GraphQL URL resolved via `extra.graphqlUrl`: OK.
- EAS profiles (`eas.json`)
  - `debug` → `assembleDebug`, internal distribution; forces debug identifiers via env.
  - `release` → `assembleRelease`, production env.
  - `preview` → `assembleRelease`, alternate endpoints.
- Native Android project (`android/`)
  - `android/app/build.gradle` hardcodes:
    - `namespace 'ir.mohet.safarnak_debug'`
    - `applicationId 'ir.mohet.safarnak_debug'`
    - `release` signing uses the debug keystore (not production-appropriate).
  - Java package path under `ir/mohet/safarnak_debug/` ties MainActivity to debug package name.
  - Contains committed `debug.keystore` (should not be in VCS).
  - Extra `src/debugOptimized/` manifest exists (likely unnecessary).
- CI (`.github/workflows/build-and-deploy.yml`)
  - Does an Expo prebuild on version changes, then `./gradlew assembleRelease`.
  - Limits architectures to `arm64-v8a` for smaller APK: good for artifact size.
  - Uses production env variables; enforces `EAS_BUILD_PROFILE=release`.
  - Still relies on native project files and uses debug signing for release build (needs fixing).

High-Level Decisions
1) Ephemeral native project: Prefer not to keep `android/` as source-of-truth. Generate it with `npx expo prebuild` consistently (both locally and in CI).
2) Single source of truth for IDs and versioning: Continue to drive from `app.config.js` and profiles.
3) Different IDs for debug vs release:
   - Debug: `ir.mohet.safarnak_debug` via `applicationIdSuffix` or explicit ID.
   - Release: `ir.mohet.safarnak`.
4) Production signing:
   - Never use debug keystore for release.
   - Configure signing via secure secrets (EAS credentials or GitHub Actions secrets + Gradle env).
5) Size and performance:
   - Keep Hermes enabled.
   - Enable R8 minification and resource shrinking.
- Restrict ABIs to `arm64-v8a` across builds (no Play Store splits).
   - Strip debug symbols and unused locales where safe.
   - Prefer `bundleRelease` for store uploads (AAB), keep `assembleRelease` for GH artifacts.

Multi-Phase Migration Plan

Phase 0 – Inventory & Baseline
- Record current APK size and startup time on a representative device (arm64).
- Confirm Java/Kotlin plugin versions, AGP, and Gradle wrapper are up-to-date enough for RN 0.81/Expo 54.
- Acceptance:
  - Baseline APK size and cold start time documented.

Phase 1 – Ephemeralize Native Project
- Remove hardcoded IDs from `android/app/build.gradle` and MainActivity package paths by regenerating native using `expo prebuild`.
- Stop committing `android/` (add to `.gitignore`) and generate on demand:
  - Local: `yarn android` keeps working (Expo will use the existing native project if present; provide `yarn android:reset` to regenerate).
  - CI: always run `npx expo prebuild --platform android --no-install --clear`.
- Delete `android/app/debug.keystore` from repository; add to `.gitignore`.
- Remove unnecessary `src/debugOptimized/` if not required after re-prebuild.
- Acceptance:
  - Clean repo without committed keystore or debug package sources.
  - `yarn android` produces debug build with `_debug` ID via config.

Phase 2 – Expo Build Properties (authoritative optimization)
- Add `expo-build-properties` plugin in `app.config.js`:
  - Enable R8/Proguard for release.
  - Enable resource shrinking for release.
  - Set `packagingOptions` and `abiFilters` for CI builds (arm64 only).
  - Optional: `enableProguardInDebug=false`, `enableSeparateBuildPerCPUArchitecture=false` for local.
- Acceptance:
  - Release builds minified and shrunk.
  - CI artifacts are arm64-only and significantly smaller.

Phase 3 – IDs, Flavors, and Signing
- Keep IDs driven by `app.config.js`:
  - Debug/Development: `ir.mohet.safarnak_debug`, scheme `safarnak-debug`.
  - Release: `ir.mohet.safarnak`, scheme `safarnak`.
- Signing:
  - Configure production keystore in CI via env secrets or use EAS managed credentials.
  - Ensure `release` build type uses release keystore, not debug.
- Acceptance:
  - CI-produced releases are signed with production keystore.
  - `adb install` works without overwrite conflicts between debug and release apps.

Phase 4 – CI Simplification & Speed
- Always prebuild with `EAS_BUILD_PROFILE=release` in CI.
- Use Gradle caching and `--no-daemon` judiciously; keep `--parallel`, `--build-cache`.
- For GH artifacts (no Play):
  - Build `assembleRelease` with `-PreactNativeArchitectures=arm64-v8a`.
  - No AAB; APK only for testers.
- Upload `mapping.txt` for deobfuscation (if Proguard/R8 enabled).
- Acceptance:
  - CI runtime stable and predictable.
  - Artifacts smaller vs baseline; mapping is available.

Phase 5 – Size-Focused Tweaks
- Verify Hermes bytecode is enabled (default with Expo RN 0.81).
- Strip unused resources and locales:
  - Configure `resConfig` or keep default if app needs multiple locales.
  - Ensure no large test/dummy assets ship in release.
- Confirm `android:extractNativeLibs=false` default on Android 6+ for smaller APKs.
- Optional: Play Store splits (AAB) for optimal delivery.
- Acceptance:
  - APK size reduced meaningfully (target: < 25–30 MB if feasible).

Phase 6 – Documentation & Rollback
- Document scripts and environment expectations.
- Provide rollbacks:
  - `yarn android:reset` to regenerate `android/`.
  - `yarn clean` to clear caches/builds.
- Acceptance:
  - Onboarding doc lets any dev build debug locally and CI produce release.

Proposed Config Changes (to be implemented in later PRs)

1) Add build-properties plugin in `app.config.js`
```ts
plugins: [
  'expo-router',
  'expo-localization',
  [
    'expo-location',
    {
      locationAlwaysAndWhenInUsePermission: `Allow ${appName} to use your location.`,
      locationAlwaysPermission: `Allow ${appName} to use your location.`,
      locationWhenInUsePermission: `Allow ${appName} to use your location.`,
      isAndroidBackgroundLocationEnabled: true,
    },
  ],
  [
    'expo-build-properties',
    {
      android: {
        enableProguardInReleaseBuilds: true,
        enableShrinkResourcesInReleaseBuilds: true,
        // Keep Hermes enabled by default with Expo
        // Optional: restrict ABIs for CI artifacts; leave full for AAB
        abiFilters: ['arm64-v8a'],
        // Extra Proguard rules can be provided inline if needed
        // extraProguardRules: '...'
      },
    },
  ],
],
```

2) Package scripts
```json
{
  "scripts": {
    "android": "expo run:android",
    "android:newarch": "NEW_ARCH=1 expo run:android",
    "android:reset": "rm -rf android && npx expo prebuild --platform android --no-install",
    "build:debug": "eas build --profile debug --platform android",
    "build:release": "eas build --profile release --platform android"
  }
}
```

3) CI (high level)
- Ensure:
  - `npx expo prebuild --platform android --no-install --clear`
  - `EAS_BUILD_PROFILE=release`
  - `./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a`
  - Upload `mapping.txt` from `app/build/outputs/mapping/release`.
  - Optionally: also run `./gradlew bundleRelease` to publish AAB to Play later.

Security & Hygiene
- Remove `android/app/debug.keystore` from Git. Add to `.gitignore`.
- Never commit production keystores.
- Production signing via:
  - EAS credentials (recommended), or
  - Encrypted secrets in GitHub Actions (keystore, alias, passwords).

Local v8-only builds
- `yarn android` now sets `REACT_NATIVE_ANDROID_ARCHITECTURES=arm64-v8a` to keep local builds v8-only too.

Final Build Checklist (v8-only, no Play)

- [x] Assets generated with 15% padding from non-transparent source:
  - [x] `assets/images/icon.png` (1024x1024, transparent)
  - [x] `assets/images/adaptive-icon.png` (1024x1024, transparent)
  - [x] `assets/images/splash-icon.png` (3000x3000, white)
  - [x] Regenerate with `yarn assets:generate` when logo changes
- [x] Expo config set to use generated assets:
  - [x] `expo.icon` → `./assets/images/icon.png`
  - [x] `android.adaptiveIcon.foregroundImage` → `./assets/images/adaptive-icon.png`
  - [x] `splash.image` → `./assets/images/splash-icon.png`
- [x] Performance optimizations enabled via `expo-build-properties`:
  - [x] `enableProguardInReleaseBuilds: true`
  - [x] `enableShrinkResourcesInReleaseBuilds: true`
  - [x] `abiFilters: ['arm64-v8a']` (v8-only)
  - [x] Hermes enabled (default in Expo RN 0.81)
- [x] IDs and schemes:
  - [x] Debug/dev: `ir.mohet.safarnak_debug` / `safarnak-debug`
  - [x] Release: `ir.mohet.safarnak` / `safarnak`
- [x] Scripts:
  - [x] `yarn android` (v8-only) installs debug
  - [x] `yarn android:reset` regenerates native project
- [x] CI (GitHub Actions):
  - [x] Prebuild clean with `EAS_BUILD_PROFILE=release`
  - [x] Build `assembleRelease` with `-PreactNativeArchitectures=arm64-v8a`
  - [x] Upload `mapping.txt` artifact
  - [x] Upload release APK artifact
- [x] Signing:
  - [x] For testers-only: debug signing acceptable
  - [x] Optional production signing: prepared via GitHub Secrets (see CI step)
- [ ] Targets:
  - [ ] APK size ≤ baseline − 20% (goal < 25–30 MB if feasible)
  - [ ] Cold start time ≤ baseline

Build Results (2025‑11‑12)
- Debug APK (arm64‑v8a only, debug signed): 79 MB
  - Path: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK (arm64‑v8a only, minified + shrink, debug signing locally): 46 MB
  - Path: `android/app/build/outputs/apk/release/app-release.apk`
- R8 artifacts:
  - `mapping.txt`: 35 MB at `android/app/build/outputs/mapping/release/mapping.txt`
  - `resources.txt`, `configuration.txt`, `usage.txt`, `seeds.txt` present

Notes
- Size target still open: current release APK is 46 MB; further reductions may require:
  - Removing heavy optional libs, limiting locales, auditing bundled assets, or moving some functionality to on-demand downloads.
- CI will upload `mapping.txt` automatically for each release build. For production signing, add keystore secrets in GitHub and rebuild.

Acceptance Metrics
- Size: Production APK ≤ baseline − 20% (target < 25–30 MB if feasible).
- Startup: Cold start time not worse than baseline; aim for ≤ baseline.
- CI: Stable build time; deterministic artifacts; signed and shrinked.

Assets (Logo & Splash) Pipeline
- Source logo: non-transparent logo in `design/logo-beta.png` (or the latest non-transparent source).
- Generation:
  - Use ImageMagick `convert` to generate icon and splash with 15% padding (content area ≈70% of canvas).
  - Outputs:
    - `assets/images/icon.png` → 1024x1024, square canvas, transparent background.
    - `assets/images/adaptive-icon.png` → 1024x1024, transparent foreground (Expo uses `android.adaptiveIcon.backgroundColor`).
    - `assets/images/splash-icon.png` → 3000x3000, white background, centered logo, high resolution.
- Script:
  - `yarn assets:generate` runs `scripts/generate-icons.sh`.
- App config:
  - Keep `expo.icon`, `android.adaptiveIcon.foregroundImage`, and `splash.image` pointing to the generated assets.
- Acceptance:
  - Crisp icon on all densities and a high-quality splash with no hard crop and 15% padding.

Open Questions for Confirmation
- Is Play Store distribution in scope now (AAB), or keep GitHub APK-only for testers?
- Any native modules requiring persistent `android/` customization? If yes, we will encapsulate diffs via `expo-build-properties` or `prebuild` config plugin patches.
- Are multiple locales required in the shipped APK? If not, we can limit `resConfigs` for further size gains.

Next Steps
- Approve this plan.
- Implement Phase 1–3 in a single PR.
- Measure size/time deltas and iterate with Phase 5 tweaks if needed.


