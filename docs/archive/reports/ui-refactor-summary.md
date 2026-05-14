# 🎨 Safarnak UI Refactor – Final Summary

**Project**: Safarnak Travel App  
**Scope**: Full client-side UI/UX refactor (tabs, screens, routes, translations, mock data)  
**Status**: ✅ Completed, lint + type-check clean

---

## 1. High-Level Overview

- **Tabs**: 4 → **5 tabs** with a clean information architecture:
  - **Home** (Feed)
  - **Explore**
  - **Create** (renamed from Trips)
  - **Notifications** (new)
  - **Me** (Profile / Account Center)
- **Goal**: Redesign only the **UI/UX layer** – all existing GraphQL/server logic preserved; new surfaces use **mock data**.
- **Key Outcomes**:
  - Consistent card-based design, filter chips, and empty/loading states
  - Full dark/light theme support
  - Full i18n coverage (English + Persian) for all new UI strings
  - No unused routes, broken links, or dead components

---

## 2. New Navigation Structure

### 2.1 Tabs & Route Groups

```text
app/
└── (app)/
    ├── (feed)/            # Home tab
    ├── (explore)/         # Explore tab
    ├── (create)/          # Create tab (was (trips))
    ├── (notifications)/   # NEW Notifications tab
    └── (profile)/         # Me tab (Account Center)
```

- `app/(app)/_layout.tsx`
  - Configures **5 Tabs** with Ionicons and translated labels.
  - `'(profile)'` is the **Me** tab entry.

### 2.2 Key New/Changed Routes

- **Home / Feed**
  - `app/(app)/(feed)/index.tsx` – Feed, with new "Travel Inspirations" entry point
  - `app/(app)/(feed)/inspirations.tsx` – Inspirations list (mock data)

- **Explore**
  - `app/(app)/(explore)/index.tsx` – Discover screen, now links to Shareable Trips
  - `app/(app)/(explore)/shareable-trips/index.tsx` – Shareable trips list (mock)
  - `app/(app)/(explore)/shareable-trips/[id].tsx` – Shareable trip detail with 3 tabs (Itinerary / Info / Map)

- **Create (renamed from Trips)**
  - Folder rename: `app/(app)/(trips)/` → `app/(app)/(create)/`
  - All internal routes updated from `/(app)/(trips)/…` → `/(app)/(create)/…`.
  - New management surfaces:
    - `app/(app)/(create)/my-shareable-trips.tsx` – Manage your public/private trips
    - `app/(app)/(create)/tours/[id]/group.tsx` – Tour members & presence
    - `app/(app)/(create)/tours/[id]/chat.tsx` – Tour group chat UI

- **Notifications (NEW tab)**
  - `app/(app)/(notifications)/_layout.tsx` – Stack layout
  - `app/(app)/(notifications)/index.tsx` – Notification center list
  - `app/(app)/(notifications)/[id].tsx` – Notification detail

- **Me (Profile / Account Center)**
  - `app/(app)/(profile)/_layout.tsx` – Stack with: `index`, `saved`, `history`, `subscription`, `payments`, `settings`
  - `app/(app)/(profile)/index.tsx` – New Account Center
  - `app/(app)/(profile)/saved.tsx` – Bookmarks (kept, GraphQL-powered)
  - `app/(app)/(profile)/history.tsx` – Travel history (rewritten to trips+tours)
  - `app/(app)/(profile)/subscription.tsx` – Subscription plans (kept)
  - `app/(app)/(profile)/payments.tsx` – Subscription invoices only (rewritten)
  - `app/(app)/(profile)/settings/*` – Settings stack (general, preferences, privacy, notifications, devices)

---

## 3. Profile / Me Tab – Final Design

### 3.1 Files Removed from Profile

Removed from `app/(app)/(profile)/` because they now belong elsewhere:

- `trips.tsx` → Responsibility moved to **Create tab**
- `messages.tsx`, `messages/[id].tsx` → Belong to **Notifications tab** (planned for future move)

All references to these routes were removed or pointed to Notifications/Create equivalents.

### 3.2 Account Center Home (`index.tsx`)

**Concept**: one clean scrollable "Account Center" page with three parts:

1. **User Header**
   - Avatar (icon or future photo)
   - Name + `@username`
   - Meta line: `Member since <year> · <active trips>` (computed from GraphQL `me` + `getTrips`).

2. **My Safarnak** section
   - Translation keys: `profile.sections.mySafarnak`
   - Items:
     - **Saved** → `/(app)/(profile)/saved`
     - **History** → `/(app)/(profile)/history`
     - **Subscription & billing** → `/(app)/(profile)/subscription`

3. **App & Security** section
   - Translation key: `profile.sections.appSecurity`
   - Items:
     - **Settings** → `/(app)/(profile)/settings`
     - **Devices & keys** → `/(app)/(profile)/settings/devices`
     - **Logout** → clears storage + Redux and routes to `/(auth)/welcome` / `/(auth)/login`.

**Implementation notes**:
- Uses shared components: `CustomText`, `ListItem`, `useMeQuery`, `useGetTripsQuery`, `useAppSelector`.
- Supports **pull-to-refresh** via `useRefresh` hook.
- Fully themed via `Colors.dark` / `Colors.light` and NativeWind classes.

### 3.3 Saved (`saved.tsx`)

- Kept as-is but conceptually aligned as **Saved content hub**:
  - Filters: Posts, Tours, Places
  - Uses GraphQL `useGetBookmarksQuery` with type argument (`posts` / `tours` / `places`).
  - Cards show:
    - Title / name / content
    - Optional image
    - Location line
    - Author + relative time (via `useDateTime`) for posts.
- Navigation from cards:
  - Posts → `/(app)/(feed)/[id]`
  - Tours → `/(app)/(feed)/tours/[id]` (legacy route kept)
  - Places → `/(app)/(feed)/places/[id]`

### 3.4 History (`history.tsx` – rewritten)

- Old behaviour: mixed **social activity** (posts, likes, stats).
- New behaviour: **travel-centric history** (past trips + tours only).
- Model:
  - `TravelHistoryItem` with `type: 'trip' | 'tour'`, `location`, `startDate`, `endDate`, `status`, `imageUrl`.
- UI:
  - Filter chips: **All / Trips / Tours** (using `explore.categories.*` translation keys).
  - Cards show:
    - Title
    - Location row with `location-outline`
    - Date range, e.g. `Jul 10–17, 2024`
    - Status badge: `Completed` / `Cancelled` via `trips.status.*` keys.
  - Tap behaviour (mock for now):
    - `trip` → `/(app)/(create)/{id}`
    - `tour` → `/(app)/(explore)/tours/{id}`

### 3.5 Subscription (`subscription.tsx`)

- Kept but cleaned up structure around **3 plans**: Free, Pro, Premium.
- Each plan card shows:
  - Name, price per month, AI quota text, feature bullets (translated keys like `subscription.features.*`).
  - Either **Current Plan** badge or **Select Plan** button.
- Local state drives `currentPlan`; later can be replaced by GraphQL.

### 3.6 Payments (`payments.tsx` – rewritten)

- Focused exclusively on **Safarnak subscription invoices**, not tours.
- Mock model:
  - `SubscriptionInvoice { id, date, plan, amount, currency, status, invoiceNumber }`.
- UI:
  - Filter chips: **All / Paid / Pending** using `payments.tabs.*` + `payments.status.*` keys.
  - Invoice card:
    - Plan label (via `subscription.plans.*`) + date
    - Status pill (colour-coded)
    - Amount + currency
    - Transaction/invoice id line.
- Fully localized and dark-mode-ready.

### 3.7 Settings (`settings/*`)

- Routing (`settings/_layout.tsx`):
  - Horizontal scroll header bar for: General (`index`), Preferences, Privacy, Notifications, Devices.

- **General (`settings/index.tsx`) – trimmed**
  - Now focuses on:
    - Language switcher (`LanguageSwitcher`)
    - Theme toggle (`ThemeToggle`)
    - Simple Map Cache controls (enable/disable + clear cache button)
    - Logout CTA using existing `clearAllUserData`, `persistor`, `logout`.
  - Removed heavy system diagnostics (DB stats, storage breakdown, live system status) to keep UX simple.

- **Preferences (`settings/preferences.tsx`)** – kept
  - Feed/AI preferences screen using GraphQL (`getFeedPreferences`, `updateFeedPreferences`).
  - Controls:
    - Following-only / close-friends-only toggles
    - Entity types chips (POST / TRIP / TOUR / PLACE / LOCATION)
    - Topics chips (manual + suggested + trending)
    - Muted users list.

- **Privacy (`settings/privacy.tsx`)** – kept
  - Series of `ToggleRow` items for public profile, activity status, location tracking, data sharing, analytics.

- **Notifications (`settings/notifications.tsx`)** – kept
  - Toggles for push, trip updates, tour bookings, messages, promotional, email notifications.

- **Devices (`settings/devices.tsx`)** – kept, critical for device keys
  - Shows current device and all other registered devices (from GraphQL).
  - Allows revoking non-current devices.
  - Uses `InfoBanner`, `CustomText`, `Ionicons` with full i18n.

---

## 4. Other New UI Surfaces

### 4.1 Home – Travel Inspirations

- File: `app/(app)/(feed)/inspirations.tsx`
- Features:
  - Horizontal filter chips (e.g. Nature, Adventure, Culture).
  - Card layout: image, title, location, tags, rating, difficulty.
  - CTA: **Use This Trip** (future integration with Create tab).

### 4.2 Explore – Shareable Trips

- List: `app/(app)/(explore)/shareable-trips/index.tsx`
  - Filter chips (Duration, Budget, Style, Season).
  - Shows stats like `used`, `saved`, `views` using `stats.*` translation keys.

- Detail: `app/(app)/(explore)/shareable-trips/[id].tsx`
  - Tabs: **Itinerary / Info / Map**.
  - Rich mock itinerary data.

### 4.3 Create – My Shareable Trips & Tour Group/Chat

- **My Shareable Trips** – `app/(app)/(create)/my-shareable-trips.tsx`
  - Cards with:
    - Title, visibility (public/private) badge
    - Stats: total uses, views, saved (now localized via `stats.totalUses`, `stats.totalViews`, `stats.saved`).

- **Tour Group** – `app/(app)/(create)/tours/[id]/group.tsx`
  - Member list with online/offline chips using new `stats.online` / `stats.offline` keys.

- **Tour Chat** – `app/(app)/(create)/tours/[id]/chat.tsx`
  - Chat bubbles, message list, text input; everything currently backed by mock messages.

### 4.4 Notifications Tab

- List: `app/(app)/(notifications)/index.tsx`
  - Filter chips: All / Social / Trip / Tour / System.
  - Per-notification cards with icon, title, body, timestamp, unread indicator.

- Detail: `app/(app)/(notifications)/[id].tsx`
  - Full content, actions: mark as read, delete, navigate to related route.

---

## 5. i18n & Translations

### 5.1 Strategy

- All visible text **must** go through `react-i18next` with namespaced keys:
  - `feed.*`, `explore.*`, `create.*`, `notifications.*`, `me.*`, `profile.*`, `settings.*`, `stats.*`, `systemStatus.*`.
- No hardcoded strings allowed in new UI; where absolutely needed, `defaultValue` is used as a fallback only.

### 5.2 Notable New Keys

- `profile.sections.mySafarnak` – section title on Account Center
- `profile.sections.appSecurity` – section title on Account Center
- `stats.*` – new utility namespace:
  - `stats.totalUses`, `stats.totalViews`, `stats.used`, `stats.saved`, `stats.views`, `stats.online`, `stats.offline`
- Numerous keys under:
  - `feed.inspirations.*`
  - `explore.shareableTrips.*`
  - `create.myShareableTrips.*`
  - `notifications.*`
  - `me.*`, `profile.*`

Both **English** (`locales/en/translation.json`) and **Farsi** (`locales/fa/translation.json`) were updated in lockstep.

---

## 6. Mock Data & Centralization

- All shared mock data lives in `constants/mockData.ts`:
  - Notifications, inspirational trips, shareable trips, my shareable trips, tour group members, chat messages, history items, etc.
- Screen-level components import from this file instead of inlining long arrays.
- This makes it trivial to swap mocks with real GraphQL queries in a future backend phase.

---

## 7. Code Quality & Deep Scan Results

- **Global ESLint**: 0 errors, 0 warnings.
- **TypeScript (`tsc --noEmit`)**: no type errors.
- **Deep route & usage scan** (see `DEEP_SCAN_RESULTS.md`):
  - All `router.push` targets now point to valid routes.
  - All legacy `/(app)/(trips)/…` paths migrated to `/(app)/(create)/…`.
  - Profile messages/trips routes removed from code paths.
  - No unused imports flagged in `app/(app)`.

---

## 8. How to Use This Document

- As a **developer guide** to understand the new client-side UI architecture.
- As a **mapping** when wiring GraphQL/resolvers later:
  - Each mock-based screen has a clear future query/mutation/subscription path (see `REFACTOR_COMPLETE.md` for a more backend-focused TODO list).
- As a **QA reference**:
  - Pair this file with `TESTING_CHECKLIST.md` and `QUICK_START.md` when doing manual device testing.

---

## 9. Quick Pointers for Future Work

- **Backend integration**:
  - Home inspirations, Shareable Trips, My Shareable Trips, Tour Group/Chat, Notifications, and History all expect future GraphQL operations.
- **Notifications/messages move**:
  - The conceptual inbox now belongs under `(notifications)`; you can port the old `(profile)/messages` logic there later.
- **Profile extensions**:
  - If you later add inline profile editing, keep it as a dedicated screen (e.g. `(profile)/edit.tsx`), not inside the Account Center home.

---

**File**: `docs/UI_REFACTOR_SUMMARY.md`  
**Source docs merged**: `REFACTOR_COMPLETE.md`, `PROFILE_REFACTOR_SUMMARY.md`, `DEEP_SCAN_RESULTS.md`, `QUICK_START.md`, `TESTING_CHECKLIST.md`, `PROFILE_ROUTE_ANALYSIS.md` (relevant parts)
