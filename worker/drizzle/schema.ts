import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ============================================================================
// UNIFIED WORKER SCHEMA - All tables for the Safarnak travel app
// ============================================================================

// Users table - core user information
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  email: text('email').unique(),
  phone: text('phone'),
  avatar: text('avatar'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// Tours table - travel experiences and packages
export const tours = sqliteTable('tours', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  price: integer('price').notNull(), // Price in cents
  currency: text('currency').default('USD'),
  duration: integer('duration'), // Duration in hours
  durationType: text('duration_type').default('hours'), // hours, days, weeks
  location: text('location').notNull(),
  coordinates: text('coordinates'), // JSON: {lat, lng}
  category: text('category'), // adventure, cultural, nature, etc.
  difficulty: text('difficulty').default('easy'), // easy, medium, hard
  maxParticipants: integer('max_participants'),
  minParticipants: integer('min_participants').default(1),
  imageUrl: text('image_url'),
  gallery: text('gallery'), // JSON array of image URLs
  tags: text('tags'), // JSON array of tags
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// Bookings table - tour reservations
export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  tourId: integer('tour_id').references(() => tours.id),
  bookingDate: text('booking_date').notNull(), // ISO date string
  tourDate: text('tour_date').notNull(), // When the tour actually happens
  status: text('status').default('pending'), // pending, confirmed, cancelled, completed
  totalPrice: integer('total_price').notNull(), // Price in cents
  participants: integer('participants').default(1),
  specialRequests: text('special_requests'),
  notes: text('notes'),
  paymentStatus: text('payment_status').default('pending'), // pending, paid, refunded
  paymentMethod: text('payment_method'),
  paymentId: text('payment_id'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// Reviews table - tour feedback and ratings
export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  tourId: integer('tour_id').references(() => tours.id),
  bookingId: integer('booking_id').references(() => bookings.id),
  rating: integer('rating').notNull(), // 1-5 stars
  title: text('title'),
  comment: text('comment'),
  photos: text('photos'), // JSON array of photo URLs
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  helpful: integer('helpful').default(0), // Number of helpful votes
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// Messages table - real-time communication
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id),
  type: text('type').default('text'), // text, image, file, system
  metadata: text('metadata'), // JSON for additional data
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

// GraphQL subscriptions management
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  connectionId: text('connection_id').notNull(),
  connectionPoolId: text('connection_pool_id').notNull(),
  subscription: text('subscription').notNull(),
  topic: text('topic').notNull(),
  filter: text('filter'),
  userId: integer('user_id').references(() => users.id),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  expiresAt: text('expires_at'),
});

// Categories table - tour categories
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// Locations table - travel destinations
export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  country: text('country').notNull(),
  city: text('city'),
  coordinates: text('coordinates'), // JSON: {lat, lng}
  timezone: text('timezone'),
  currency: text('currency'),
  language: text('language'),
  description: text('description'),
  imageUrl: text('image_url'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// Tour guides table - tour guide information
export const guides = sqliteTable('guides', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  bio: text('bio'),
  experience: integer('experience'), // Years of experience
  languages: text('languages'), // JSON array of languages
  specialties: text('specialties'), // JSON array of specialties
  rating: integer('rating').default(0), // Average rating
  totalTours: integer('total_tours').default(0),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// Tour guide assignments
export const tourGuides = sqliteTable('tour_guides', {
  id: integer('id').primaryKey(),
  tourId: integer('tour_id').references(() => tours.id),
  guideId: integer('guide_id').references(() => guides.id),
  isPrimary: integer('is_primary', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

// User favorites - saved tours
export const favorites = sqliteTable('favorites', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  tourId: integer('tour_id').references(() => tours.id),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

// Notifications table
export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  type: text('type').notNull(), // booking, review, message, system
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: text('data'), // JSON for additional data
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

// System settings table
export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey(),
  key: text('key').unique().notNull(),
  value: text('value').notNull(),
  type: text('type').default('string'), // string, number, boolean, json
  description: text('description'),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// ============================================================================
// RELATIONSHIPS
// ============================================================================

// Define relationships for better type safety
export const usersRelations = {
  bookings: bookings,
  reviews: reviews,
  messages: messages,
  subscriptions: subscriptions,
  guides: guides,
  favorites: favorites,
  notifications: notifications,
};

export const toursRelations = {
  bookings: bookings,
  reviews: reviews,
  tourGuides: tourGuides,
  favorites: favorites,
};

export const bookingsRelations = {
  user: users,
  tour: tours,
  reviews: reviews,
};

export const reviewsRelations = {
  user: users,
  tour: tours,
  booking: bookings,
};

export const guidesRelations = {
  user: users,
  tourGuides: tourGuides,
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export all tables
export const schema = {
  users,
  tours,
  bookings,
  reviews,
  messages,
  subscriptions,
  categories,
  locations,
  guides,
  tourGuides,
  favorites,
  notifications,
  settings,
};

// Default export
export default schema;