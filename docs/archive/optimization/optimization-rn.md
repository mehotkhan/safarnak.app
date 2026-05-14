### React Native Code Optimization Checklist

- [ ] Switch heavy lists to FlashList
  - Replace FlatList in high-traffic screens with `@shopify/flash-list`, set `estimatedItemSize`.
- [ ] Migrate images to expo-image
  - Use `expo-image` for decoding/caching/placeholders and lower jank on scrollers.
- [ ] Lazy-load heavy features
  - Map screens use native MapLibre GL (no WebView) - already optimized ✅
- [ ] Memoize hot components
  - Add `React.memo`, `useCallback`, `useMemo` to item renderers and cards in `ui/cards/*`.
- [ ] Reanimated/native driver
  - Use `react-native-reanimated` for complex animations; set `useNativeDriver` for basic animated values.
- [ ] Subscriptions on demand
  - Delay `graphql-ws` link creation until the first subscription is executed to avoid WS code in cold paths.
- [ ] Keep Hermes, keep minifier settings
  - Already enabled; maintain current `babel` and `metro` production flags (console stripping, mangling).
- [ ] WebP strategy with expo-image
  - Prefer `expo-image` to avoid Fresco toggles; works well with existing `.webp` assets.

Unused packages audit (runtime) — candidates to remove or move
- [ ] Remove if not needed now (no imports found):
  - `expo-status-bar`
  - `expo-secure-store`
  - `expo-localization`
  - `expo-linking` (Expo Router handles linking internally)
  - `expo-system-ui`
  - `react-native-svg`
  - `react-native-svg-transformer`
  - `react-native-avoid-softinput`
  - `react-native-keyboard-controller`
- [ ] Consider moving to devDependencies:
  - `expo-dev-client`
- [ ] Keep (in use or required transitively):
  - `react-native-webview` (used for other WebView features, not maps)
  - `react-native-screens` (navigation)
  - `react-native-safe-area-context`
  - `expo-file-system` (used via `expo-file-system/next` in `ui/utils/mapTileCache.ts`)
  - `@expo/vector-icons`, `expo-font`
  - `expo-location`, `expo-image-picker`, `expo-clipboard`, `expo-constants`, `expo-splash-screen`, `expo-sqlite`
  - `react-native-quick-crypto`, `react-native-get-random-values`

Acceptance
- [ ] FlashList in feeds/trips/explore; smooth scroll verified
- [ ] `expo-image` in hot screens
- [ ] Map/webview features lazy-loaded
- [ ] No re-render hotspots in profiler


