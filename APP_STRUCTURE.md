# Safarnak App - Complete Structure

## 🎯 New Architecture Overview

Complete restructuring following Expo Router best practices with clean URLs for web deployment.

## 📁 Directory Structure

```
app/
├── _layout.tsx                                    # Root layout with providers
│
├── (auth)/                                        # Auth group (URL: /auth)
│   ├── _layout.tsx                               # Auth stack layout
│   ├── welcome.tsx                               # Onboarding (URL: /auth/welcome)
│   ├── login.tsx                                 # Login page (URL: /auth/login)
│   └── register.tsx                              # Register page (URL: /auth/register)
│
└── (app)/                                         # Main app group with tabs
    ├── _layout.tsx                               # Tab bar layout (icon-only, modern)
    │
    ├── (feed)/                                    # Feed/Home tab
    │   ├── _layout.tsx                           # Stack navigation
    │   ├── index.tsx                             # Social feed (URL: /)
    │   └── [id].tsx                              # Post details (URL: /:id)
    │
    ├── (explore)/                                 # Explore/Search tab
    │   ├── _layout.tsx                           # Stack navigation
    │   ├── index.tsx                             # Search & filters (URL: /explore)
    │   ├── places/
    │   │   └── [id].tsx                          # Place details (URL: /explore/places/:id)
    │   └── tours/
    │       └── [id].tsx                          # Tour details (URL: /explore/tours/:id)
    │
    ├── (trips)/                                   # Trips tab
    │   ├── _layout.tsx                           # Stack navigation
    │   ├── index.tsx                             # Trip list (URL: /trips)
    │   ├── new.tsx                               # Create trip (URL: /trips/new)
    │   └── [id]/
    │       ├── index.tsx                         # Trip details (URL: /trips/:id)
    │       └── edit.tsx                          # Edit trip (URL: /trips/:id/edit)
    │
    └── (profile)/                                 # Profile tab
        ├── _layout.tsx                           # Stack navigation
        ├── index.tsx                             # Profile home (URL: /profile)
        ├── trips.tsx                             # My trips (URL: /profile/trips)
        ├── messages.tsx                          # Messages (URL: /profile/messages)
        └── settings.tsx                          # Settings (URL: /profile/settings)
```

## 🌐 URL Structure (Web)

### Auth Routes (Public)
- `/auth/welcome` - Onboarding/Welcome screen
- `/auth/login` - Login page
- `/auth/register` - Registration page

### App Routes (Protected)
- `/` - Feed (social posts from community)
- `/:id` - Post details with comments
- `/explore` - Search tours, places, and discover content
- `/explore/places/:id` - Place details page
- `/explore/tours/:id` - Tour details page
- `/trips` - User's trip list
- `/trips/new` - Create new trip (modal)
- `/trips/:id` - Trip details
- `/trips/:id/edit` - Edit trip (modal)
- `/profile` - User profile
- `/profile/trips` - User's trips list
- `/profile/messages` - Messages/notifications
- `/profile/settings` - App settings

## 📱 Tab Navigation (Icon-Only)

Modern bottom tabs with no labels:

1. **Home** (🏠) - Feed tab with social posts
2. **Explore** (🔍) - Search & discovery
3. **Create** (➕) - Trip management
4. **Profile** (👤) - User account

## 🎨 Features by Tab

### (feed) - Social Feed
- **index.tsx**: Instagram-style social feed
  - Posts from other users (trips, places, experiences)
  - Like, comment, share functionality
  - Category filters (all, trips, places, food, culture)
  - Pull-to-refresh
- **[id].tsx**: Post detail page
  - Full post content
  - Comments section
  - Like and bookmark actions

### (explore) - Search & Discovery
- **index.tsx**: Search and filter interface
  - Search bar with filters
  - Category pills (tours, places, popular, nearby)
  - Toggle between tours and places
  - Cards with ratings, reviews, distance
- **places/[id].tsx**: Place detail page
  - About, hours, tips
  - Ratings and reviews
  - Get directions
- **tours/[id].tsx**: Tour detail page
  - Tour description
  - Highlights and inclusions
  - Difficulty and duration
  - Pricing

### (trips) - Trip Management
- **index.tsx**: Trip list
  - All user-created trips
  - Status badges (in progress, completed)
  - Travelers and budget info
  - GraphQL integration (`useGetTripsQuery`)
- **new.tsx**: Create new trip (modal)
  - AI-powered trip generation
  - Destination, dates, travelers
  - Preferences and budget
  - Accommodation options
- **[id]/index.tsx**: Trip details
  - AI reasoning
  - Day-by-day itinerary
  - Trip metadata
- **[id]/edit.tsx**: Edit trip (modal)
  - Update trip details
  - Save changes

### (profile) - User Profile
- **index.tsx**: Profile home
  - User info card
  - Subscription/AI quota card
  - Menu items (trips, messages)
  - Language & theme toggles
  - Logout button
- **trips.tsx**: User's trips list
  - All trips created by user
  - Quick access to trip details
- **messages.tsx**: Messages & notifications
  - User messages
  - Notifications
- **settings.tsx**: App settings
  - Notifications toggle
  - Location tracking
  - Account settings
  - Privacy controls
  - Data management
  - About info

## 🔄 Navigation Patterns

### Authentication Flow
```
1. App starts → AuthWrapper checks auth status
2. If authenticated → Navigate to /(app)/(feed)
3. If not authenticated → Navigate to /(auth)/welcome
4. User logs in/registers → Navigate to /(app)/(feed)
5. User logs out → Navigate to /(auth)/login
```

### Navigation Examples
```typescript
// Navigate to post detail
router.push(`/(app)/(feed)/${postId}`);

// Navigate to place detail
router.push(`/(app)/(explore)/places/${placeId}`);

// Navigate to create trip
router.push('/(app)/(trips)/new');

// Navigate to edit trip
router.push(`/(app)/(trips)/${tripId}/edit`);

// Navigate to settings
router.push('/(app)/(profile)/settings');

// Navigate to login
router.push('/(auth)/login');
```

## 🔐 Auth Integration

All auth handling preserved:
- ✅ Redux auth state (`isAuthenticated`, `user`, `token`)
- ✅ AsyncStorage persistence
- ✅ AuthWrapper guards protected routes
- ✅ Automatic redirects based on auth status
- ✅ GraphQL client auth headers

## 🌍 Internationalization

All pages support multi-language (English + Persian):
- ✅ Translation keys updated in `locales/en/translation.json`
- ✅ Translation keys updated in `locales/fa/translation.json`
- ✅ RTL support maintained
- ✅ LanguageContext and ThemeContext working

## 📊 Data Integration

### GraphQL Queries Used
- `useGetTripsQuery` - Fetch user trips (trips tab)
- `useMeQuery` - Fetch current user (profile)
- `useCreateTripMutation` - Create new trip
- Other queries ready for implementation

### Mock Data (for now)
- Posts in feed
- Tours in explore
- Places in explore
- Comments on posts

Ready to connect to real GraphQL endpoints when available.

## 🎨 UI Components

All pages use modern, consistent UI:
- **NativeWind v4** - Tailwind utility classes
- **Dark mode** - Fully supported across all screens
- **Custom components** - CustomText, CustomButton, InputField, etc.
- **Icons** - Ionicons from @expo/vector-icons
- **Modern styling** - Rounded corners, shadows, gradients

## 🚀 Next Steps

1. **Connect GraphQL Mutations**:
   - Posts (create, like, comment)
   - Places (fetch list, details)
   - Tours (fetch list, details)

2. **Implement Real Data**:
   - Replace mock data with real GraphQL queries
   - Add loading states
   - Add error handling

3. **Enhance Features**:
   - Image upload for posts
   - Real-time messaging
   - Push notifications
   - Payment integration

4. **Web Optimization**:
   - SEO meta tags
   - Social media previews
   - Responsive design tweaks

## ✅ Benefits

1. **Clean URLs** - SEO-friendly, human-readable URLs for web
2. **Hierarchical** - Proper nested navigation structure
3. **Scalable** - Easy to add new pages/features
4. **Modern** - Icon-only tabs, clean design
5. **Type-safe** - Full TypeScript support
6. **Multi-language** - English + Persian ready
7. **Dark mode** - Full support everywhere
8. **Auth-protected** - Secure route handling

---

**Version**: 0.9.2  
**Last Updated**: October 30, 2025  
**Structure Type**: Route Groups (Expo Router)

