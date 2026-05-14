# 🎯 APK Size Reduction Master Plan
## Safarnak App - Comprehensive Optimization Strategy

**Current Status:** 52MB baseline → 35-40MB (after immediate fixes)  
**Target:** 25-30MB (30-42% total reduction)  
**Architecture:** Expo + React Native + GraphQL + Offline-first + arm64-v8a only

---

## 📊 Phase 1: IMMEDIATE WINS (Already Applied ✅)

### ✅ 1.1 Critical Fixes (Completed)
- **Resource shrinking enabled:** `android.enableShrinkResourcesInReleaseBuilds=true`
- **Splash images optimized:** 2.2MB → 528KB (saved ~1.7MB)
- **ProGuard/R8 advanced rules:** Aggressive code shrinking
- **Hermes optimization:** Bytecode optimization + debug info stripped
- **Source maps removed:** Production builds exclude maps
- **Metro minification:** Console removal + aggressive compression

**Result:** 52MB → 35-40MB ✅

---

## 🚀 Phase 2: QUICK WINS (High Impact, Low Effort)

### 2.1 Switch to Android App Bundle (.aab) ⭐
**Impact:** -10-15% (-3.5-5MB)  
**Effort:** 1 hour  
**Risk:** Low

**Why:** Google Play generates device-specific APKs from AAB, users only download what they need.

**Implementation:**
```json
// eas.json
{
  "build": {
    "release": {
      "android": {
        "buildType": "aab",  // Change from "apk"
        "gradleCommand": ":app:bundleRelease"  // Change from assembleRelease
      }
    }
  }
}
```

**Benefits:**
- Users download 10-15% smaller builds
- Google Play handles device optimization
- On-demand delivery of language packs (if configured)
- Dynamic feature modules (future)

**Comparison:**
```
APK (current): 35MB - ALL resources for ALL devices
AAB → APK: 30MB - ONLY resources for USER's device
```

---

### 2.2 Remove Redundant Dependency: moment-jalaali ⭐
**Impact:** -300-500KB  
**Effort:** 2 hours  
**Risk:** Medium (requires code changes)

**Problem:** You have BOTH `luxon` (^3.7.2) AND `moment-jalaali` (^0.10.4)

**Analysis:**
```bash
# Your current setup
luxon: 3.7.2           # Modern, already supports Jalali via Intl
moment-jalaali: 0.10.4 # Legacy Moment.js wrapper (REDUNDANT)
```

**Solution:** Use Luxon exclusively (you're already using it!)

```typescript
// BEFORE (moment-jalaali):
import moment from 'moment-jalaali';
const jalaliDate = moment().format('jYYYY/jMM/jDD');

// AFTER (Luxon - you already have this pattern!):
import { DateTime } from 'luxon';
const jalaliDate = DateTime.now()
  .reconfigure({ outputCalendar: 'persian' })
  .toLocaleString({ locale: 'fa-IR' });
```

**Action Items:**
1. Audit codebase for `moment-jalaali` usage (grep)
2. Replace with Luxon (pattern already exists in `@hooks/useDateTime`)
3. Remove from `package.json`
4. Test all date displays

**Savings:** ~400KB

---

### 2.3 Optimize i18n Bundle ⭐
**Impact:** -200-400KB  
**Effort:** 1 hour  
**Risk:** Low

**Strategy:** Split language bundles and load on-demand

**Current Setup:**
```javascript
// i18n.ts - loads ALL languages at startup
import en from './locales/en/translation.json';
import fa from './locales/fa/translation.json';
```

**Optimized Setup:**
```javascript
// i18n.ts - lazy load languages
import i18n from 'i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en', // Start with English
  resources: {},
  
  // Lazy load language bundles
  backend: {
    loadPath: (lng) => require(`./locales/${lng}/translation.json`),
  },
});

// Load language on demand
export const changeLanguage = async (lng: string) => {
  if (!i18n.hasResourceBundle(lng, 'translation')) {
    const bundle = await import(`./locales/${lng}/translation.json`);
    i18n.addResourceBundle(lng, 'translation', bundle.default);
  }
  await i18n.changeLanguage(lng);
};
```

**Benefits:**
- Initial bundle only includes default language
- Other languages loaded when user switches
- Reduces initial APK size

**Savings:** ~200-300KB

---

### 2.4 Remove Unused Expo Modules
**Impact:** -500KB-1MB  
**Effort:** 2 hours  
**Risk:** Low

**Audit Your Expo Dependencies:**

Let me check which Expo modules you might not be using:

```bash
# Potentially unused (verify before removing):
expo-dev-client: ~6.0.16        # Only for development
expo-clipboard: ~8.0.7          # Check if used
expo-local-authentication: ^17.0.7  # Biometric auth - used?
expo-media-library: ~18.2.0     # Photo library - used?
expo-web-browser: ^15.0.8       # In-app browser - used?
```

**Action:** Create usage audit script:
```bash
# Check if module is imported anywhere
for module in expo-clipboard expo-local-authentication expo-media-library expo-web-browser; do
  echo "Checking $module..."
  grep -r "from '$module'" app/ components/ --include="*.tsx" --include="*.ts"
done
```

**Remove unused modules:**
```bash
yarn remove expo-clipboard  # If not used
yarn remove expo-local-authentication  # If not used
# ... etc
```

**Savings:** ~500KB-1MB

---

### 2.5 Compress Font Files ⭐
**Impact:** -200-400KB  
**Effort:** 30 minutes  
**Risk:** Very Low

**Your Current Fonts:**
```
assets/fonts/
├── SpaceMono-Regular.ttf  (~150KB)
├── Vazir-Bold.ttf         (~250KB)
├── Vazir-Medium.ttf       (~250KB)
└── Vazir-Regular.ttf      (~250KB)
```

**Optimization:**

1. **Remove SpaceMono if unused:**
```bash
# Check usage
grep -r "SpaceMono" . --include="*.tsx" --include="*.ts"
```

2. **Subset Vazir fonts** (keep only Persian + English glyphs):
```bash
# Install pyftsubset (fonttools)
pip install fonttools

# Subset fonts (Persian + English + numbers)
pyftsubset assets/fonts/Vazir-Regular.ttf \
  --output-file=assets/fonts/Vazir-Regular-subset.ttf \
  --unicodes="U+0020-007F,U+0600-06FF,U+FB50-FDFF,U+FE70-FEFF" \
  --layout-features="*" \
  --flavor=woff2

# Expected: ~250KB → ~120KB (52% reduction)
```

3. **Convert to WOFF2** (better compression):
```bash
# WOFF2 offers 30% better compression than TTF
fonttools ttLib.woff2 compress assets/fonts/Vazir-Regular.ttf
```

**Savings:** ~200-400KB (3 fonts × ~100KB each)

---

### 2.6 Optimize Tailwind CSS Bundle
**Impact:** -100-200KB  
**Effort:** 1 hour  
**Risk:** Low

**Strategy:** Purge unused Tailwind classes

**Current:** `tailwind.config.js` generates ALL utility classes

**Optimization:**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./ui/**/*.{js,jsx,ts,tsx}",  // Add if exists
  ],
  
  // Safelist only classes used dynamically
  safelist: [
    // Add classes used via string interpolation
    {
      pattern: /^(bg|text|border)-(primary|secondary|danger|success)/,
    },
  ],
  
  theme: {
    extend: {
      // Remove unused extended theme values
    }
  },
  
  // Disable unused core plugins
  corePlugins: {
    preflight: false,  // Don't need Tailwind reset in RN
    container: false,  // Not used in RN
    float: false,      // Not supported in RN
    clear: false,      // Not supported in RN
    // ... disable other unused plugins
  },
};
```

**Savings:** ~100-200KB

---

## 🎯 Phase 3: MEDIUM WINS (Medium Impact, Medium Effort)

### 3.1 Code Splitting by Route ⭐⭐
**Impact:** -2-3MB (reduces initial bundle)  
**Effort:** 1 week  
**Risk:** Medium

**Strategy:** Split large routes into separate chunks loaded on-demand

**Implementation:**

1. **Identify large routes:**
```bash
# Analyze bundle size by route
npx react-native-bundle-visualizer
```

2. **Lazy load heavy screens:**
```typescript
// app/(app)/(trips)/[id]/index.tsx
import { lazy, Suspense } from 'react';
import { LoadingState } from '@ui/feedback';

// Lazy load heavy components
const MapView = lazy(() => import('@ui/maps/MapView'));
const Timeline = lazy(() => import('@ui/display/Timeline'));

export default function TripDetailScreen() {
  return (
    <View>
      <Suspense fallback={<LoadingState />}>
        <MapView />
      </Suspense>
      
      <Suspense fallback={<LoadingState />}>
        <Timeline />
      </Suspense>
    </View>
  );
}
```

3. **Split by feature:**
```typescript
// Lazy load entire route groups
const TripsModule = lazy(() => import('./app/(app)/(trips)'));
const ProfileModule = lazy(() => import('./app/(app)/(profile)'));
```

**Benefits:**
- Smaller initial bundle
- Faster app startup
- Routes loaded on-demand

**Savings:** -2-3MB from initial bundle

---

### 3.2 Optimize Apollo Client Bundle ⭐⭐
**Impact:** -500KB-1MB  
**Effort:** 3 days  
**Risk:** Medium

**Problem:** Apollo Client bundles ALL features by default

**Solution 1: Use Apollo Client Lite**
```bash
yarn remove @apollo/client
yarn add @apollo/client-lite
```

**Solution 2: Tree-shake Apollo Client**
```javascript
// api/client.ts - BEFORE (imports everything)
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// AFTER (tree-shakeable imports)
import { ApolloClient } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';
import { HttpLink } from '@apollo/client/link/http';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
```

**Solution 3: Remove Unused Apollo Features**
```typescript
// Check if you're using these features:
// - Subscriptions (you are - keep)
// - Optimistic UI (check usage)
// - Polling queries (check usage)
// - Batch HTTP link (check usage)
```

**Savings:** ~500KB-1MB

---

### 3.3 ✅ COMPLETED: Replaced react-native-leaflet-view with MapLibre GL
**Impact:** -1-2MB (completed)  
**Status:** ✅ Done

**Solution Implemented:** Using `@maplibre/maplibre-react-native` (native MapLibre GL)

**Current Setup:**
```typescript
// ui/maps/MapView.tsx
import { MapView as MLMapView, PointAnnotation, Camera, UserLocation } from '@maplibre/maplibre-react-native';
```

**Benefits Achieved:**
- ✅ Native maps (no WebView overhead)
- ✅ Better performance
- ✅ Smaller bundle size (~1-2MB saved)
- ✅ Free tile sources (no API key required)
- ✅ Same props interface (backward compatible)
- ✅ Multiple map layers (standard, satellite, terrain)

**Migration:**
- ✅ Removed `react-native-leaflet-view` from package.json
- ✅ Rewrote MapView.tsx to use MapLibre
- ✅ All existing usages work without changes
- ✅ Updated documentation

**Option B: Static Map Images (for non-interactive maps)**
```typescript
// For static map displays only
const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},${zoom}/600x400?access_token=${token}`;

<Image source={{ uri: staticMapUrl }} style={styles.map} />
```

**Recommendation:** Use `react-native-maps` for interactive maps, static images for non-interactive displays.

**Savings:** ~1-2MB

---

### 3.4 Optimize GraphQL Code Generation
**Impact:** -200-500KB  
**Effort:** 2 days  
**Risk:** Low

**Problem:** GraphQL Codegen generates ALL types and hooks, including unused ones

**Solution: Configure selective generation**

```yaml
# codegen.yml
overwrite: true
schema: "./graphql/schema.graphql"
documents: "./graphql/queries/**/*.graphql"
generates:
  api/types.ts:
    plugins:
      - typescript
    config:
      # Only generate types that are actually used
      onlyOperationTypes: true
      # Don't generate Maybe<T> wrappers (use T | null instead)
      maybeValue: T | null
      # Use const enums (tree-shakeable)
      enumsAsConst: true
      # Don't generate input type constructors
      skipTypename: true
      
  api/hooks.ts:
    plugins:
      - typescript-operations
      - typescript-react-apollo
    config:
      # Don't generate unused result types
      skipTypename: true
      # Don't generate default props
      withHooks: true
      withComponent: false
      withHOC: false
```

**Savings:** ~200-500KB

---

### 3.5 Implement Dynamic Imports for Heavy Libraries
**Impact:** -1-2MB (from initial bundle)  
**Effort:** 3 days  
**Risk:** Low

**Strategy:** Load heavy libraries only when needed

**Targets:**
```typescript
// 1. react-native-reanimated (only needed for animations)
const Animated = React.lazy(() => import('react-native-reanimated'));

// 2. react-native-svg (only for SVG screens)
const SvgChart = React.lazy(() => import('./components/SvgChart'));

// 3. zod (validation - only on form screens)
const validateForm = async (data) => {
  const { z } = await import('zod');
  const schema = z.object({ /* ... */ });
  return schema.parse(data);
};
```

**Implementation:**
```typescript
// app/(app)/(profile)/index.tsx
import { lazy, Suspense } from 'react';

// Heavy components loaded on-demand
const ImagePicker = lazy(() => import('expo-image-picker').then(mod => ({
  default: () => <ImagePickerComponent module={mod} />
})));

const QRCodeScanner = lazy(() => import('./components/QRCodeScanner'));

export default function ProfileScreen() {
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  return (
    <View>
      {showImagePicker && (
        <Suspense fallback={<LoadingState />}>
          <ImagePicker />
        </Suspense>
      )}
    </View>
  );
}
```

**Savings:** ~1-2MB from initial bundle

---

## 🔬 Phase 4: ADVANCED OPTIMIZATIONS (High Impact, High Effort)

### 4.1 Implement Partial Hydration for Offline Data ⭐⭐⭐
**Impact:** -3-5MB (reduces cached data size)  
**Effort:** 2 weeks  
**Risk:** Medium

**Problem:** Your offline-first architecture caches ENTIRE GraphQL responses

**Current Setup:**
```typescript
// api/cache-storage.ts
// Stores complete Apollo cache in SQLite
// Includes ALL fields from ALL queries
```

**Solution: Selective field caching**

```typescript
// api/cache-storage.ts - Enhanced
export class DrizzleCacheStorage {
  async setItem(key: string, value: string) {
    const parsed = JSON.parse(value);
    const entityType = this.extractEntityType(key);
    
    // Cache only essential fields for offline access
    const essentialFields = this.getEssentialFields(entityType);
    const optimized = this.filterFields(parsed, essentialFields);
    
    // Store minimal data
    await db.insert(cacheTable).values({
      key,
      value: JSON.stringify(optimized),  // Smaller payload
      cachedAt: Date.now(),
    });
  }
  
  getEssentialFields(entityType: string): string[] {
    // Define essential fields per type
    const essentials = {
      User: ['id', 'username', 'avatar'],  // No bio, preferences, etc.
      Trip: ['id', 'title', 'startDate', 'endDate'],  // No full details
      Post: ['id', 'content', 'createdAt', 'userId'],  // No reactions, comments
    };
    return essentials[entityType] || [];
  }
}
```

**Benefits:**
- Smaller SQLite database
- Faster cache reads/writes
- Lower memory usage
- Still works offline

**Savings:** ~3-5MB (cache data reduction)

---

### 4.2 Switch to Hermes Bytecode Bundles ⭐⭐⭐
**Impact:** -2-4MB  
**Effort:** 1 week  
**Risk:** Medium

**Current:** JavaScript bundle is minified but still text-based

**Solution:** Pre-compile to Hermes bytecode (`.hbc` files)

```groovy
// android/app/build.gradle
android {
    defaultConfig {
        // Enable Hermes bytecode compilation
        extraPackagerArgs = [
            "--transformer", "node_modules/react-native/scripts/hermes-transform.js",
            "--output-type", "hbc"  // Output Hermes bytecode
        ]
    }
}
```

```properties
# android/gradle.properties (already have these ✓)
hermes.bytecode.optimize=true
hermes.bytecode.stripDebugInfo=true

# Add these:
hermes.bytecode.emitAsyncStackTrace=false
hermes.bytecode.compactBytecode=true
```

**Benefits:**
- Smaller bundle (bytecode vs minified JS)
- Faster parsing (no JS parsing needed)
- Better runtime performance

**Savings:** ~2-4MB

---

### 4.3 Implement Feature Flags for Optional Features
**Impact:** -2-3MB (per feature)  
**Effort:** 2 weeks  
**Risk:** High

**Strategy:** Make expensive features optional and load on-demand

**Candidates:**
1. **Social Features** (posts, feed, reactions)
2. **Map Features** (interactive maps)
3. **Media Features** (image upload, gallery)
4. **Advanced Search** (filters, suggestions)

**Implementation:**
```typescript
// constants/features.ts
export const FEATURES = {
  SOCIAL: __DEV__ || process.env.FEATURE_SOCIAL === 'true',
  MAPS: __DEV__ || process.env.FEATURE_MAPS === 'true',
  MEDIA: __DEV__ || process.env.FEATURE_MEDIA === 'true',
  ADVANCED_SEARCH: __DEV__ || process.env.FEATURE_SEARCH === 'true',
};

// app/(app)/(feed)/_layout.tsx
import { FEATURES } from '@constants/features';

if (!FEATURES.SOCIAL) {
  // Show "Coming soon" or redirect
  return <ComingSoon feature="Social Feed" />;
}

// Lazy load social module
const FeedModule = lazy(() => import('./index'));
```

**Distribution Strategy:**
1. **Lite APK:** Core features only (25MB)
2. **Full APK:** All features (35MB)
3. **User choice:** Download features in-app

**Savings:** ~2-3MB per optional feature

---

### 4.4 Optimize Redux Store Size
**Impact:** -500KB-1MB  
**Effort:** 1 week  
**Risk:** Medium

**Problem:** Redux state may include redundant data already in Apollo cache

**Analysis:**
```typescript
// Check Redux state size
// store/slices/authSlice.ts
interface AuthState {
  user: User | null;  // Also in Apollo cache?
  token: string;
  isAuthenticated: boolean;
}
```

**Solution: Minimize Redux, leverage Apollo cache**

```typescript
// BEFORE: Store user in Redux
const user = useAppSelector(state => state.auth.user);

// AFTER: Read from Apollo cache
const { data } = useMeQuery();
const user = data?.me;
```

**Keep in Redux:**
- Authentication state (token, isAuthenticated)
- UI state (theme, language)
- Temporary state (forms, modals)

**Move to Apollo cache:**
- User profile
- Trips data
- Posts data

**Savings:** ~500KB-1MB

---

### 4.5 Implement Asset CDN for Large Media
**Impact:** -5-10MB (removes bundled assets)  
**Effort:** 1 week  
**Risk:** Low

**Problem:** Images bundled in APK

**Solution: Load from CDN on-demand**

```typescript
// constants/assets.ts
const CDN_URL = 'https://cdn.safarnak.app';

export const ASSETS = {
  onboarding: {
    welcome1: `${CDN_URL}/onboarding/welcome1.webp`,
    welcome2: `${CDN_URL}/onboarding/welcome2.webp`,
    welcome3: `${CDN_URL}/onboarding/welcome3.webp`,
    welcome4: `${CDN_URL}/onboarding/welcome4.webp`,
    welcome5: `${CDN_URL}/onboarding/welcome5.webp`,
  },
  auth: {
    login: `${CDN_URL}/auth/login.webp`,
    register: `${CDN_URL}/auth/register.webp`,
  },
};

// app/(auth)/welcome.tsx
import { ASSETS } from '@constants/assets';

<Image
  source={{ uri: ASSETS.onboarding.welcome1 }}
  style={styles.image}
/>
```

**With caching:**
```typescript
import * as FileSystem from 'expo-file-system';

const cachedImageUrl = async (url: string) => {
  const filename = url.split('/').pop();
  const fileUri = `${FileSystem.cacheDirectory}${filename}`;
  
  // Check if cached
  const info = await FileSystem.getInfoAsync(fileUri);
  if (info.exists) return fileUri;
  
  // Download and cache
  await FileSystem.downloadAsync(url, fileUri);
  return fileUri;
};
```

**Benefits:**
- Much smaller APK
- Images load on-demand
- Easy to update images without APK update

**Savings:** ~5-10MB (current: 444KB onboarding + auth images, but can remove more)

---

## 📊 Phase 5: EXPERIMENTAL (Future Optimizations)

### 5.1 Implement Module Federation
**Impact:** -10-15MB  
**Effort:** 1 month  
**Risk:** Very High

Share modules between app and web version.

### 5.2 Use JSI Modules for Heavy Operations
**Impact:** Better performance, indirect size benefits  
**Effort:** 2 months  
**Risk:** Very High

Replace JS-based heavy operations with JSI native modules.

### 5.3 Implement Incremental Updates
**Impact:** 90% smaller updates  
**Effort:** 1 month  
**Risk:** High

Use CodePush or Expo Updates for JS-only updates.

---

## 📈 IMPLEMENTATION ROADMAP

### Week 1-2: Quick Wins
- [ ] Switch to AAB builds
- [ ] Remove moment-jalaali
- [ ] Optimize i18n bundles
- [ ] Audit and remove unused Expo modules
- [ ] Compress fonts
- [ ] Optimize Tailwind config

**Expected Result:** 35MB → 30MB (-5MB, 14% reduction)

### Week 3-4: Medium Wins
- [ ] Implement code splitting for routes
- [ ] Optimize Apollo Client bundle
- [ ] Optimize GraphQL codegen
- [ ] Dynamic imports for heavy libraries

**Expected Result:** 30MB → 27MB (-3MB, 10% reduction)

### Month 2: Advanced Optimizations
- [ ] Evaluate react-native-maps migration
- [ ] Implement partial hydration
- [ ] Switch to Hermes bytecode bundles
- [ ] Optimize Redux store

**Expected Result:** 27MB → 25MB (-2MB, 7% reduction)

### Month 3: Asset Optimization
- [ ] Implement feature flags
- [ ] Set up asset CDN
- [ ] Implement on-demand asset loading

**Expected Result:** 25MB → 22-23MB (-2-3MB, 8-12% reduction)

---

## 🎯 FINAL TARGET

| Phase | Size | Reduction | Cumulative |
|-------|------|-----------|------------|
| **Baseline** | 52MB | - | - |
| **Phase 1** (✅ Done) | 35-40MB | -12-17MB | 23-33% |
| **Phase 2** (Quick Wins) | 30MB | -5MB | 42% |
| **Phase 3** (Medium Wins) | 27MB | -3MB | 48% |
| **Phase 4** (Advanced) | 25MB | -2MB | 52% |
| **Phase 5** (Asset CDN) | **22-23MB** | **-2-3MB** | **55-58%** |

**FINAL TARGET: 22-25MB (55-58% reduction from 52MB baseline)** 🎉

---

## ⚠️ CRITICAL CONSIDERATIONS

### Performance vs Size Trade-offs

**DON'T sacrifice:**
- ✅ App startup time
- ✅ UI responsiveness
- ✅ Offline functionality
- ✅ Core features

**SAFE to optimize:**
- ✅ Initial download size
- ✅ On-demand feature loading
- ✅ Asset delivery via CDN
- ✅ Unused code/resources

### Testing Strategy

**Before each optimization:**
1. Benchmark current APK size
2. Benchmark app startup time
3. Benchmark memory usage
4. Test offline functionality

**After each optimization:**
1. Verify APK size reduction
2. Verify no performance regression
3. Test all features work
4. Test on low-end devices

### Rollback Plan

Each phase should be:
- Committed separately
- Tagged for easy rollback
- Tested thoroughly before proceeding

---

## 🔧 MONITORING & MAINTENANCE

### Track APK Size Over Time

```bash
# Add to CI/CD pipeline
# .github/workflows/build.yml
- name: Analyze APK size
  run: |
    APK_SIZE=$(du -h android/app/build/outputs/apk/release/*.apk | awk '{print $1}')
    echo "APK_SIZE=$APK_SIZE" >> $GITHUB_ENV
    echo "📦 APK Size: $APK_SIZE" >> $GITHUB_STEP_SUMMARY
```

### Set Size Budgets

```json
// package.json
{
  "size-budget": {
    "apk": {
      "max": "30MB",
      "warn": "28MB"
    }
  }
}
```

### Regular Audits

- **Monthly:** Review dependencies
- **Quarterly:** Analyze bundle composition
- **Per release:** Run APK Analyzer

---

## 📚 REFERENCES & TOOLS

### Analysis Tools
- **APK Analyzer:** Android Studio → Build → Analyze APK
- **Bundle Visualizer:** `npx react-native-bundle-visualizer`
- **Source Map Explorer:** Analyze JS bundle composition

### Documentation
- [Android App Size Optimization](https://developer.android.com/topic/performance/reduce-apk-size)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Expo Build Properties](https://docs.expo.dev/versions/latest/sdk/build-properties/)
- [Hermes Optimization](https://hermesengine.dev/)

---

## ✅ ACTION PLAN SUMMARY

**Start with Phase 2 (Quick Wins)** - low risk, high reward:

1. **This Week:**
   - Switch to AAB builds (15 min)
   - Remove moment-jalaali (2 hours)
   - Audit unused Expo modules (1 hour)

2. **Next Week:**
   - Implement i18n lazy loading (2 hours)
   - Compress fonts (30 min)
   - Optimize Tailwind config (1 hour)

3. **Measure Results:**
   - Build APK
   - Compare sizes
   - Test performance

**Expected Week 1-2 Result: 35MB → 30MB (-14% reduction)** 🎯

---

*Last Updated: 2025-11-13*  
*Version: 1.0*  
*Status: Ready for Implementation*

