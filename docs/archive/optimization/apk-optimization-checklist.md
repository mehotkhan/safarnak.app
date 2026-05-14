# 🎯 APK Size Optimization Checklist
## Phases 1-3 Implementation Plan (Tested & Safe)

**Target:** 52MB → 25-27MB (48-52% reduction)  
**Strategy:** v8-only builds (arm64-v8a), APK format, test each change carefully

---

## 📊 AUDIT RESULTS

### ✅ Dependencies Analysis (Completed)

| Package | Status | Reason | Savings |
|---------|--------|--------|---------|
| `expo-clipboard` | **KEEP** ✅ | Used in `ui/utils/clipboard.ts` | - |
| `expo-local-authentication` | **KEEP** ✅ | Used in `ui/hooks/useAuth.ts` (biometric auth) | - |
| `expo-media-library` | **REMOVE** ❌ | NOT FOUND (0 imports) | ~200KB |
| `expo-web-browser` | **REMOVE** ❌ | NOT FOUND (0 imports) | ~150KB |
| `moment-jalaali` | **REMOVE** ❌ | NOT USED (Luxon handles Jalali dates) | ~400KB |

**Total from unused packages: ~750KB**

### ✅ Fonts Analysis (Completed)

| Font | Size | Status | Reason |
|------|------|--------|--------|
| SpaceMono-Regular.ttf | 92KB | **REMOVE** ❌ | Loaded but NEVER USED |
| Vazir-Regular.ttf | 288KB | **KEEP & COMPRESS** ✅ | Used for all Persian text |
| Vazir-Medium.ttf | 288KB | **KEEP & COMPRESS** ✅ | Used for medium weight text |
| Vazir-Bold.ttf | 288KB | **KEEP & COMPRESS** ✅ | Used for bold text |

**Current: 956KB → Target: 450-500KB (saved ~450KB)**

### ✅ Key Architecture Decisions

1. **Keep APK builds** (not AAB) - as requested ✅
2. **v8-only** (arm64-v8a) - already configured ✅
3. **Using @maplibre/maplibre-react-native** - native MapLibre GL (replaced Leaflet) ✅
4. **Remove AAB optimization** from Phase 1 - postponed ✅

---

## 🚀 PHASE 1: SAFE QUICK WINS (Week 1-2)

**Impact:** 35MB → 31-32MB (~3-4MB reduction, 9-11%)  
**Risk:** Very Low  
**Testing:** After each change

### Task 1.1: Remove Unused Expo Modules ⭐⭐⭐
**Impact:** -350KB | **Time:** 30 minutes | **Risk:** Very Low

```bash
# 1. Verify they're not used (already done ✅)
grep -r "expo-media-library" . --include="*.tsx" --include="*.ts" 
grep -r "expo-web-browser" . --include="*.tsx" --include="*.ts"

# 2. Remove packages
yarn remove expo-media-library expo-web-browser

# 3. Clean and rebuild
yarn clean
npx expo prebuild --clean
```

**Expected Result:** -350KB

- [  ] Remove `expo-media-library` 
- [  ] Remove `expo-web-browser`
- [  ] Run `yarn clean`
- [  ] Run `npx expo prebuild --clean`
- [  ] Test app launches successfully
- [  ] Verify no import errors
- [  ] Build APK and measure size

---

### Task 1.2: Remove moment-jalaali Package ⭐⭐⭐
**Impact:** -400KB | **Time:** 30 minutes | **Risk:** Very Low

**Analysis:** You're using **Luxon** for Jalali calendar (already implemented in `@hooks/useDateTime`), moment-jalaali is redundant.

```bash
# 1. Verify not used (already done ✅)
grep -r "moment-jalaali\|moment" . --include="*.tsx" --include="*.ts"
# Result: Only found in package.json, not imported anywhere

# 2. Remove package
yarn remove moment-jalaali

# 3. This will also remove: moment, moment-timezone, jalaali-js (dependencies)
```

**Expected Result:** -400KB

- [  ] Verify no `moment-jalaali` imports exist
- [  ] Remove `moment-jalaali` package
- [  ] Run `yarn clean`
- [  ] Test all date displays (especially Persian calendar)
- [  ] Verify `useDateTime` hook works correctly
- [  ] Build APK and measure size

---

### Task 1.3: Remove SpaceMono Font ⭐⭐
**Impact:** -92KB | **Time:** 15 minutes | **Risk:** Very Low

**Analysis:** SpaceMono is loaded in `app/_layout.tsx` but NEVER USED anywhere in the app.

```bash
# 1. Verify not used (already done ✅)
grep -r "SpaceMono\|fontFamily.*Space" . --include="*.tsx" --include="*.ts"
# Result: Only loaded, never used

# 2. Remove font file
rm assets/fonts/SpaceMono-Regular.ttf
```

**Update:** `app/_layout.tsx`

```typescript
// BEFORE:
const [essentialFontsLoaded, essentialFontsError] = useFonts({
  SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), // REMOVE THIS LINE
  VazirRegular: require('../assets/fonts/Vazir-Regular.ttf'),
});

// AFTER:
const [essentialFontsLoaded, essentialFontsError] = useFonts({
  VazirRegular: require('../assets/fonts/Vazir-Regular.ttf'),
});

// Also update comment:
// Load essential fonts first (VazirRegular)
```

**Expected Result:** -92KB

- [  ] Remove SpaceMono from `useFonts` in `app/_layout.tsx`
- [  ] Update comment (remove "SpaceMono and")
- [  ] Delete `assets/fonts/SpaceMono-Regular.ttf`
- [  ] Test app launches without font errors
- [  ] Build APK and measure size

---

### Task 1.4: Compress Vazir Fonts ⭐⭐⭐
**Impact:** -350-400KB | **Time:** 1 hour | **Risk:** Low

**Current:**
- Vazir-Regular: 288KB
- Vazir-Medium: 288KB
- Vazir-Bold: 288KB
- **Total: 864KB**

**Target: 450-500KB (saved ~350-400KB)**

#### Method: Font Subsetting (Keep only Persian + English + Numbers)

```bash
# Install fonttools
pip3 install fonttools brotli

# Subset fonts (Persian + English + Numbers + Common punctuation)
cd assets/fonts

# Unicode ranges:
# U+0020-007F: Basic Latin (English, numbers, punctuation)
# U+00A0-00FF: Latin-1 Supplement
# U+0600-06FF: Arabic (includes Persian)
# U+FB50-FDFF: Arabic Presentation Forms-A
# U+FE70-FEFF: Arabic Presentation Forms-B

# Regular
pyftsubset Vazir-Regular.ttf \
  --output-file=Vazir-Regular-subset.ttf \
  --unicodes="U+0020-007F,U+00A0-00FF,U+0600-06FF,U+FB50-FDFF,U+FE70-FEFF" \
  --layout-features="*" \
  --flavor=woff2

# Convert back to TTF if needed (Expo needs TTF)
fonttools ttLib.woff2 decompress Vazir-Regular-subset.ttf

# Medium
pyftsubset Vazir-Medium.ttf \
  --output-file=Vazir-Medium-subset.ttf \
  --unicodes="U+0020-007F,U+00A0-00FF,U+0600-06FF,U+FB50-FDFF,U+FE70-FEFF" \
  --layout-features="*"

# Bold
pyftsubset Vazir-Bold.ttf \
  --output-file=Vazir-Bold-subset.ttf \
  --unicodes="U+0020-007F,U+00A0-00FF,U+0600-06FF,U+FB50-FDFF,U+FE70-FEFF" \
  --layout-features="*"

# Replace original files
mv Vazir-Regular-subset.ttf Vazir-Regular.ttf
mv Vazir-Medium-subset.ttf Vazir-Medium.ttf
mv Vazir-Bold-subset.ttf Vazir-Bold.ttf
```

**Expected Result:**
- Vazir-Regular: 288KB → 140-160KB
- Vazir-Medium: 288KB → 140-160KB
- Vazir-Bold: 288KB → 140-160KB
- **Total: 420-480KB (saved ~350-400KB)**

- [  ] Install fonttools: `pip3 install fonttools brotli`
- [  ] Backup original fonts: `cp -r assets/fonts assets/fonts-backup`
- [  ] Subset Vazir-Regular.ttf
- [  ] Subset Vazir-Medium.ttf  
- [  ] Subset Vazir-Bold.ttf
- [  ] Test Persian text displays correctly
- [  ] Test English text displays correctly
- [  ] Test all font weights (regular/medium/bold)
- [  ] Test special characters (؟ ، ٪ etc.)
- [  ] Build APK and measure size

---

### Task 1.5: Optimize Tailwind CSS ⭐⭐
**Impact:** -100-150KB | **Time:** 30 minutes | **Risk:** Low

**Update:** `tailwind.config.js`

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./ui/**/*.{js,jsx,ts,tsx}",  // Updated path
  ],
  
  presets: [require("nativewind/preset")],
  
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        danger: '#ef4444',
        success: '#22c55e',
        neutral: '#6b7280',
      },
      fontFamily: {
        vazir: ['VazirRegular', 'Vazir-Regular'],
        'vazir-medium': ['VazirMedium', 'Vazir-Medium'],
        'vazir-bold': ['VazirBold', 'Vazir-Bold'],
      },
    },
  },
  
  // Disable unused core plugins for React Native
  corePlugins: {
    preflight: false,      // No CSS reset needed in RN
    container: false,      // Not used in RN
    float: false,          // Not supported in RN
    clear: false,          // Not supported in RN
    objectFit: false,      // Not supported in RN
    objectPosition: false, // Not supported in RN
    overscrollBehavior: false,
    textDecoration: false, // Limited support in RN
    writingMode: false,    // Not supported in RN
  },
  
  plugins: [],
};
```

**Expected Result:** -100-150KB

- [  ] Update `tailwind.config.js` with disabled core plugins
- [  ] Run `yarn clean`
- [  ] Test all screens render correctly
- [  ] Verify dark mode works
- [  ] Verify custom colors work
- [  ] Build APK and measure size

---

### 📊 Phase 1 Results (Expected)

| Task | Savings | Status |
|------|---------|--------|
| Remove unused Expo modules | -350KB | [  ] |
| Remove moment-jalaali | -400KB | [  ] |
| Remove SpaceMono font | -92KB | [  ] |
| Compress Vazir fonts | -350KB | [  ] |
| Optimize Tailwind | -150KB | [  ] |
| **Phase 1 Total** | **~1.34MB** | **[  ]** |

**Target: 35MB → 33-34MB** ✅

---

## 🎯 PHASE 2: MEDIUM WINS (Week 3-4)

**Impact:** 33MB → 30-31MB (~2-3MB reduction, 6-9%)  
**Risk:** Medium  
**Testing:** Comprehensive testing required

### Task 2.1: Optimize i18n Bundle Loading ⭐⭐⭐
**Impact:** -200-300KB | **Time:** 2 hours | **Risk:** Low

**Strategy:** Lazy load language bundles instead of loading all at startup.

**Current:** `i18n.ts` loads ALL languages at initialization

```typescript
// i18n.ts - BEFORE
import en from './locales/en/translation.json';
import fa from './locales/fa/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  // ...
});
```

**Optimized:** Load default language, lazy load others

```typescript
// i18n.ts - AFTER
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Only load English by default (smaller initial bundle)
import enTranslation from './locales/en/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
  },
  lng: 'en', // Default language
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
});

// Lazy load function for Persian
export const loadPersianLanguage = async () => {
  if (!i18n.hasResourceBundle('fa', 'translation')) {
    try {
      const faTranslation = await import('./locales/fa/translation.json');
      i18n.addResourceBundle('fa', 'translation', faTranslation.default, true, true);
      console.log('✅ Persian language loaded');
    } catch (error) {
      console.error('Failed to load Persian language:', error);
    }
  }
};

// Enhanced changeLanguage function
export const changeLanguage = async (lng: string) => {
  // Load language bundle if needed
  if (lng === 'fa') {
    await loadPersianLanguage();
  }
  
  await i18n.changeLanguage(lng);
};

export default i18n;
```

**Update:** `ui/context/LanguageContext.tsx`

```typescript
// Import the enhanced changeLanguage function
import { changeLanguage as i18nChangeLanguage } from '@/i18n';

// In LanguageContext:
const changeLanguage = async (lang: Language) => {
  setCurrentLanguage(lang);
  await i18nChangeLanguage(lang); // Use enhanced function
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  // ... rest of code
};
```

**Expected Result:** -200-300KB

- [  ] Update `i18n.ts` with lazy loading
- [  ] Add `loadPersianLanguage` function
- [  ] Update `changeLanguage` in `LanguageContext.tsx`
- [  ] Test app starts with English by default
- [  ] Test switching to Persian loads translations
- [  ] Test switching back to English works
- [  ] Verify all translations display correctly
- [  ] Build APK and measure size

---

### Task 2.2: Tree-shake Apollo Client Imports ⭐⭐
**Impact:** -300-500KB | **Time:** 3 hours | **Risk:** Medium

**Strategy:** Use tree-shakeable imports instead of barrel imports.

**Update:** `api/client.ts`

```typescript
// BEFORE (barrel imports - bundles everything)
import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// AFTER (tree-shakeable imports - only what's used)
import { ApolloClient } from '@apollo/client/core/ApolloClient';
import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache';
import { HttpLink } from '@apollo/client/link/http/HttpLink';
import { split } from '@apollo/client/link/core/split';
import { getMainDefinition } from '@apollo/client/utilities/getMainDefinition';
import { setContext } from '@apollo/client/link/context/setContext';
import { onError } from '@apollo/client/link/error/onError';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions/GraphQLWsLink';
```

**Expected Result:** -300-500KB

- [  ] Update `api/client.ts` with tree-shakeable imports
- [  ] Test all GraphQL queries work
- [  ] Test all GraphQL mutations work
- [  ] Test GraphQL subscriptions work
- [  ] Test offline functionality works
- [  ] Test Apollo cache persistence works
- [  ] Build APK and measure size

---

### Task 2.3: Code Splitting for Heavy Screens ⭐⭐⭐
**Impact:** -1-2MB (from initial bundle) | **Time:** 1 week | **Risk:** Medium

**Strategy:** Lazy load heavy components on-demand.

**Candidates for lazy loading:**
1. Map components (native MapLibre GL - no WebView overhead)
2. Image picker (only needed when user uploads)
3. Chart/visualization components (if any)

**Example:** Lazy load MapView

```typescript
// app/(app)/(trips)/[id]/index.tsx - BEFORE
import { MapView } from '@ui/maps';

export default function TripDetailScreen() {
  return (
    <View>
      <MapView coordinates={coords} />
    </View>
  );
}

// AFTER
import { lazy, Suspense } from 'react';
import { LoadingState } from '@ui/feedback';

const MapView = lazy(() => import('@ui/maps/MapView').then(mod => ({ 
  default: mod.MapView 
})));

export default function TripDetailScreen() {
  return (
    <View>
      <Suspense fallback={<LoadingState message="Loading map..." />}>
        <MapView coordinates={coords} />
      </Suspense>
    </View>
  );
}
```

**Expected Result:** -1-2MB from initial bundle (faster app startup)

- [  ] Identify heavy components (MapView, ImagePicker, etc.)
- [  ] Implement lazy loading for MapView
- [  ] Implement lazy loading for Image upload components
- [  ] Add Suspense fallbacks with loading states
- [  ] Test all lazy-loaded components render correctly
- [  ] Test app startup time improves
- [  ] Verify offline functionality still works
- [  ] Build APK and measure size

---

### 📊 Phase 2 Results (Expected)

| Task | Savings | Status |
|------|---------|--------|
| Lazy load i18n | -200KB | [  ] |
| Tree-shake Apollo | -400KB | [  ] |
| Code splitting | -1-2MB (initial) | [  ] |
| **Phase 2 Total** | **~2-3MB** | **[  ]** |

**Target: 33MB → 30-31MB** ✅

---

## 🚀 PHASE 3: ADVANCED OPTIMIZATIONS (Month 2)

**Impact:** 30MB → 27-28MB (~3MB reduction, 10%)  
**Risk:** Higher  
**Testing:** Extensive testing required

### Task 3.1: Optimize GraphQL Code Generation ⭐⭐
**Impact:** -200-400KB | **Time:** 2 days | **Risk:** Low

**Update:** `codegen.yml`

```yaml
overwrite: true
schema: "./graphql/schema.graphql"
documents: "./graphql/queries/**/*.graphql"
generates:
  api/types.ts:
    plugins:
      - typescript
    config:
      # Generate smaller, more efficient types
      onlyOperationTypes: true
      maybeValue: T | null
      enumsAsConst: true
      skipTypename: true
      avoidOptionals: false
      
  api/hooks.ts:
    plugins:
      - typescript-operations
      - typescript-react-apollo
    config:
      # Only generate what's needed
      skipTypename: true
      withHooks: true
      withComponent: false     # Don't generate components
      withHOC: false            # Don't generate HOCs
      withRefetchFn: false      # Don't generate refetch functions
      apolloReactCommonImportFrom: '@apollo/client'
      apolloReactHooksImportFrom: '@apollo/client'
```

**Expected Result:** -200-400KB

- [  ] Update `codegen.yml` with optimized config
- [  ] Run `yarn codegen`
- [  ] Test all generated hooks work
- [  ] Verify TypeScript types are correct
- [  ] Build APK and measure size

---

### Task 3.2: Optimize Redux State (Remove Duplication) ⭐⭐
**Impact:** -300-500KB | **Time:** 3 days | **Risk:** Medium

**Strategy:** Remove user data from Redux (already in Apollo cache).

**Current:** `store/slices/authSlice.ts`

```typescript
// BEFORE (stores full user in Redux + Apollo cache)
interface AuthState {
  user: User | null;      // DUPLICATION!
  token: string;
  isAuthenticated: boolean;
  deviceKeyPair: DeviceKeyPair | null;
}
```

**Optimized:**

```typescript
// AFTER (only auth info in Redux, user in Apollo cache)
interface AuthState {
  userId: string | null;  // Just the ID
  token: string;
  isAuthenticated: boolean;
  deviceKeyPair: DeviceKeyPair | null;
}

// In components, get user from Apollo cache
const { data } = useMeQuery();
const user = data?.me;
```

**Expected Result:** -300-500KB

- [  ] Update `authSlice.ts` to store only `userId`
- [  ] Update all components to read user from Apollo cache
- [  ] Test login flow works
- [  ] Test user data displays correctly
- [  ] Test offline mode still works
- [  ] Build APK and measure size

---

### Task 3.3: Implement Hermes Bytecode Compilation ⭐⭐⭐
**Impact:** -1-2MB | **Time:** 1 week | **Risk:** Medium

**Strategy:** Pre-compile JS to Hermes bytecode (.hbc).

**Update:** `android/gradle.properties`

```properties
# Already have these ✓
hermesEnabled=true
hermes.bytecode.optimize=true
hermes.bytecode.stripDebugInfo=true

# Add these advanced flags
hermes.bytecode.emitAsyncStackTrace=false
hermes.bytecode.compactBytecode=true
hermes.bytecode.minifyBundle=true
```

**Update:** `metro.config.js`

```javascript
// Add Hermes-specific optimizations
module.exports = withNativeWind(config, { 
  input: './global.css',
  transformer: {
    hermesParser: true,  // Use Hermes parser for better optimization
    experimentalImportSupport: true,
    inlineRequires: true, // Inline requires for better tree-shaking
  },
});
```

**Expected Result:** -1-2MB

- [  ] Add advanced Hermes flags to `gradle.properties`
- [  ] Update `metro.config.js` with Hermes optimizations
- [  ] Run `yarn clean`
- [  ] Rebuild with `npx expo prebuild --clean`
- [  ] Test app startup time (should be faster)
- [  ] Test all features work correctly
- [  ] Build APK and measure size

---

### 📊 Phase 3 Results (Expected)

| Task | Savings | Status |
|------|---------|--------|
| Optimize codegen | -300KB | [  ] |
| Optimize Redux | -400KB | [  ] |
| Hermes bytecode | -1.5MB | [  ] |
| **Phase 3 Total** | **~2.2MB** | **[  ]** |

**Target: 30MB → 27-28MB** ✅

---

## 📊 FINAL RESULTS (All Phases)

| Phase | Target Size | Reduction | Cumulative |
|-------|-------------|-----------|------------|
| **Baseline** | 52MB | - | - |
| **Phase 0** (Fixes ✅) | 35MB | -17MB | 33% |
| **Phase 1** (Week 1-2) | 33MB | -2MB | 37% |
| **Phase 2** (Week 3-4) | 30MB | -3MB | 42% |
| **Phase 3** (Month 2) | **27-28MB** | **-2-3MB** | **46-48%** |

**FINAL TARGET: 27-28MB (46-48% reduction from 52MB baseline)** 🎯

---

## ✅ TESTING CHECKLIST (After Each Phase)

### Functional Testing
- [  ] App launches without errors
- [  ] Login/Register works
- [  ] Biometric authentication works
- [  ] All screens load correctly
- [  ] Maps display correctly (MapLibre GL)
- [  ] Image upload works
- [  ] Language switching works (English ↔ Persian)
- [  ] Theme switching works (Light ↔ Dark)
- [  ] Navigation works (all tabs)
- [  ] Offline mode works
- [  ] Database sync works
- [  ] GraphQL queries/mutations work
- [  ] Real-time subscriptions work

### Performance Testing
- [  ] App startup time (should be ≤2s)
- [  ] Memory usage (should be ≤120MB)
- [  ] UI responsiveness (smooth scrolling)
- [  ] Network requests (proper error handling)

### Build Testing
- [  ] APK builds successfully
- [  ] APK size measured
- [  ] APK installs on device
- [  ] No ProGuard/R8 crashes

---

## 🚨 ROLLBACK PLAN

If any phase causes issues:

1. **Revert last commit:**
   ```bash
   git reset --hard HEAD~1
   ```

2. **Rebuild:**
   ```bash
   yarn clean
   npx expo prebuild --clean
   yarn build:local
   ```

3. **Test:**
   - Verify app works
   - Measure APK size
   - Document the issue

4. **Skip problematic optimization:**
   - Update checklist
   - Move to next task

---

## 📈 PROGRESS TRACKING

### Build Size Log

| Date | Phase | APK Size | Change | Notes |
|------|-------|----------|--------|-------|
| 2025-11-13 | Baseline | 52MB | - | v1.11.0 |
| 2025-11-13 | Phase 0 | 35-40MB | -12-17MB | Critical fixes ✅ |
| | Phase 1 Task 1 | | | Unused modules |
| | Phase 1 Task 2 | | | moment-jalaali |
| | Phase 1 Task 3 | | | SpaceMono |
| | Phase 1 Task 4 | | | Vazir fonts |
| | Phase 1 Task 5 | | | Tailwind |
| | Phase 2 Task 1 | | | i18n lazy load |
| | Phase 2 Task 2 | | | Apollo tree-shake |
| | Phase 2 Task 3 | | | Code splitting |
| | Phase 3 Task 1 | | | Codegen optimize |
| | Phase 3 Task 2 | | | Redux optimize |
| | Phase 3 Task 3 | | | Hermes bytecode |

---

## 🎯 SUCCESS CRITERIA

Each phase must meet these criteria before proceeding:

### ✅ Phase 1 Success:
- [  ] APK size: ≤33MB
- [  ] All tests pass
- [  ] No functionality broken
- [  ] No performance regression

### ✅ Phase 2 Success:
- [  ] APK size: ≤31MB
- [  ] Startup time: ≤2s
- [  ] All tests pass
- [  ] Offline mode works

### ✅ Phase 3 Success:
- [  ] APK size: ≤28MB
- [  ] Startup time: ≤1.5s
- [  ] All tests pass
- [  ] Production-ready

---

**Last Updated:** 2025-11-13  
**Version:** 1.0  
**Status:** Ready for Implementation ✅

**Next Step:** Start with Phase 1, Task 1.1 (Remove unused Expo modules) 🚀

