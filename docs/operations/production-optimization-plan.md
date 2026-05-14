## Multi‑Phase Production Optimization Plan (Expo/React Native + CI)\n
This checklist is tailored to this repo’s stack (Expo ~54, RN 0.81, React 19.1, NativeWind v4, Apollo 3.8, Drizzle, Cloudflare Worker) and current configs (`app.config.js`, `metro.config.js`, `babel.config.js`, `android/gradle.properties`, `android/app/build.gradle`, `tailwind.config.js`, `api/client.ts`). It prioritizes impact and safety.\n
\n
### Legend\n
- [ ] not started - [~] in progress - [x] done\n
\n
---\n
\n
## Phase 0 — Quick Wins (safe, low effort)\n
\n
- [ ] Enable Gradle build cache for CI and local builds\n
  - Add to `android/gradle.properties`: `org.gradle.caching=true`\n
- [ ] Use Android App Bundle for production builds (smaller download via Play splits)\n
  - In `eas.json` release profile, use `buildType: \"app-bundle\"` instead of `apk`\n
- [ ] Gate dev-only libs from release\n
  - Move `expo-dev-client` to `devDependencies` and ensure no dev-client code runs in prod (`devClient: false` is already set in `app.config.js`)\n
- [ ] Keep Hermes on; confirm no source maps packaged in release\n
  - Already using Hermes and R8 full mode; ensure no debug mapping included in release artifacts\n
- [ ] Audit heavy deps not used at runtime\n
  - Review: `react-native-quick-crypto`, `react-native-worklets`, `react-native-webview` usages; remove if not essential\n
\n
---\n
\n
## Phase 1 — Runtime performance (user‑perceived speed)\n
\n
- [ ] Lists: migrate large/scrolling lists to FlashList\n
  - Replace `FlatList` in feed/trips/explore with `@shopify/flash-list` and set `estimatedItemSize`\n
- [ ] Navigation: ensure native screens are enabled\n
  - Expo Router typically enables `react-native-screens`; verify no opt‑outs; initialize early if needed\n
- [ ] Animations: reanimated where complex, `useNativeDriver` for basic animations\n
  - Avoid JS‑thread animations for long‑running transitions\n
- [ ] Memoization: `React.memo`, `useCallback`, `useMemo` on hot paths\n
  - Audit card components in `ui/cards/*` and list item renderers\n
- [ ] Image pipeline: migrate to `expo-image`\n
  - Benefits: decoding, caching, placeholders, priority; reduces jank on lists and detail screens\n
  - Replace `Image` usages incrementally in high‑traffic screens first\n
- [ ] Lazy load heavy features/screens\n
  - Map screen (MapLibre GL native) - already optimized, no WebView overhead\n
- [ ] Subscriptions on‑demand\n
  - In `@api` client, create `GraphQLWsLink` via dynamic import only when a subscription operation is first encountered (further reduces initial bundle + WS deps on cold start)\n
\n
---\n
\n
## Phase 2 — Bundle and APK size\n
\n
- [ ] Resource configs: verify density/locale filters are correct\n
  - `android/app/build.gradle` currently calls `resConfigs \"en\", \"fa\"` and separately `resConfigs \"xxhdpi\"`\n
  - Combine in one call or keep additive semantics; prefer Play splits via AAB over locking to a single density\n
- [ ] ABI filters: keep `arm64-v8a` only for prod (already set)\n
- [ ] R8/Proguard: keep aggressive but safe rules (already enabled)\n
  - Review custom rules for keep/assumenosideeffects; ensure no crashes from obfuscation of reflection users\n
- [ ] Metro/Babel minification: already dropping console & mangling; keep\n
  - Verify no dev logs left; ensure `babel-plugin-transform-remove-console` only in production\n
- [ ] WebP decode support vs. assets policy\n
  - `android/gradle.properties` has `expo.webp.enabled=false` but repo ships many `.webp` assets\n
  - Options:\n
    - Re‑enable WebP decode (`expo.webp.enabled=true`) for `<Image>` compatibility; or\n
    - Fully migrate to `expo-image` (preferred) which handles WebP efficiently and avoids Fresco toggles\n
- [ ] Fonts: keep minimal set (already 3 fonts). Consider subset/variable fonts if size still large\n
- [ ] Optional: strip unused locales at Java/Kotlin level (already filtering res `en`, `fa`)\n
\n
---\n
\n
## Phase 3 — Networking, caching, and data\n
\n
- [ ] Apollo tree‑shaking (already granular imports) — keep\n
- [ ] Persisted cache timing (already deferred 2s) — keep\n
- [ ] Consider MMKV for small key/value (tokens, flags)\n
  - Faster than AsyncStorage; keep `expo-secure-store` for secrets if needed\n
- [ ] Type policies / cache redirects\n
  - Add light `typePolicies` to reduce over‑fetching on list/detail pairs when needed\n
\n
---\n
\n
## Phase 4 — CI (GitHub Actions) build speed\n
\n
- [ ] Add Android build workflow with robust caching\n
  - Cache: Yarn, Gradle wrapper, Gradle caches, AVD/NDK downloads where safe\n
  - Enable `org.gradle.caching=true` (Phase 0)\n
- [ ] Concurrency & path filters\n
  - Use `concurrency.group` to cancel superseded runs\n
  - Use `paths` filters to skip Android build when only `worker/**` changes (and vice‑versa)\n
- [ ] Split jobs by concern\n
  - JobA: Lint/Typecheck/Codegen; JobB: Android assemble (release)\n
- [ ] Prefer AAB in CI; keep debug APK for internal testing\n
  - Use matrix for `debug` (dev client) vs `release` (prod)\n
\n
Suggested workflow scaffold (excerpt):\n
\n
```yaml\n
name: android\n
on:\n
  push:\n
    branches: [main, master]\n
    paths:\n
      - 'android/**'\n
      - 'app/**'\n
      - 'ui/**'\n
      - 'api/**'\n
      - 'package.json'\n
      - 'yarn.lock'\n
  pull_request:\n
    paths:\n
      - 'android/**'\n
      - 'app/**'\n
      - 'ui/**'\n
      - 'api/**'\n
\n
jobs:\n
  build:\n
    runs-on: ubuntu-latest\n
    concurrency:\n
      group: android-${{ github.ref }}\n
      cancel-in-progress: true\n
    steps:\n
      - uses: actions/checkout@v4\n
      - uses: actions/setup-node@v4\n
        with:\n
          node-version: 20\n
          cache: 'yarn'\n
      - name: Cache Gradle\n
        uses: gradle/gradle-build-action@v3\n
        with:\n
          gradle-home-cache-cleanup: true\n
      - name: Install deps\n
        run: yarn --frozen-lockfile\n
      - name: Typecheck & Lint & Codegen\n
        run: |\n
          yarn codegen\n
          yarn lint\n
          npx tsc --noEmit\n
      - name: Assemble Release (AAB)\n
        env:\n
          NODE_ENV: production\n
        run: |\n
          cd android\n
          ./gradlew :app:bundleRelease --build-cache --parallel --max-workers=4 --stacktrace\n
```\n
\n
---\n
\n
## Phase 5 — Monitoring & guardrails\n
\n
- [ ] Track APK size over time\n
  - Emit `./android/app/build/outputs/apk/**` and `aab/**` sizes as CI artifacts; fail on > threshold delta\n
- [ ] Add bundle analysis step (Metro) on PRs touching client deps\n
  - Use `react-native-bundle-visualizer` or Metro’s `--assets-dest` + analyzer\n
- [ ] Collect startup/perf markers\n
  - Record `TTI`, initial route mount, first list render; keep a simple log for regression spotting\n
\n
---\n
\n
## Repo‑specific notes & flags\n
\n
- APK size work already in place (great): Hermes, R8 full mode, arm64 ABI only, console stripping, minifier tuning, NativeWind core plugin pruning\n
- Verify WebP strategy: assets are `.webp`, but `expo.webp.enabled=false`. Prefer migrating to `expo-image` (recommended), or re‑enable WebP decode\n
- Consider dynamic import for WebSocket link in `@api/client.ts` to avoid bundling WS client on cold start paths without subscriptions\n
- Prefer AAB delivery; density/ABI splits via Play are safer than locking `xxhdpi`\n
- Move infrequently used heavy screens (map/webview) behind dynamic imports\n
\n
---\n
\n
## Acceptance criteria (definition of done per phase)\n
\n
### Phase 0\n
- [ ] Gradle cache on; AAB enabled for release; dev‑only deps not included in prod\n
\n
### Phase 1\n
- [ ] FlashList deployed on main feeds; jank removed on scroll; map screen lazy‑loaded; `expo-image` on hot screens\n
\n
### Phase 2\n
- [ ] Confirmed correct resource filters; WebP decode policy resolved; no crashes from R8; APK/AAB reduced by measurable %\n
\n
### Phase 3\n
- [ ] Apollo cache behavior unchanged; optional MMKV adopted for small keys; no regressions offline\n
\n
### Phase 4\n
- [ ] CI cold build time reduced significantly with caching; concurrency cancels redundant runs; artifacts uploaded\n
\n
### Phase 5\n
- [ ] Size/perf regressions auto‑detected; basic startup metrics tracked\n
\n







