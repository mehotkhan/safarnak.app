import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

 
// Users table - core user information
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  email: text('email').unique(),
  phone: text('phone'),
  avatar: text('avatar'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// Tours table - travel experiences and packages
export const tours = sqliteTable('tours', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  price: integer('price').notNull(), // Price in USD (stored as cents)
  currency: text('currency').default('USD'),
  rating: integer('rating').default(0), // stored as integer (4.5 * 10 = 45)
  reviews: integer('reviews').default(0),
  duration: integer('duration').notNull(), // Duration in days
  durationType: text('duration_type').default('days'),
  location: text('location').notNull(),
  coordinates: text('coordinates'),
  category: text('category').notNull(),
  difficulty: text('difficulty').default('easy'),
  highlights: text('highlights'), // JSON string array
  inclusions: text('inclusions'), // JSON string array
  maxParticipants: integer('max_participants'),
  minParticipants: integer('min_participants').default(1),
  imageUrl: text('image_url'),
  gallery: text('gallery'),
  tags: text('tags'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// Messages table - real-time communication
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id),
  type: text('type').default('text'),
  metadata: text('metadata'),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
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
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  expiresAt: text('expires_at'),
});

// Additional tables

export const userPreferences = sqliteTable('user_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  interests: text('interests'),
  budgetRange: text('budget_range'),
  travelStyle: text('travel_style'),
  preferredDestinations: text('preferred_destinations'),
  dietaryRestrictions: text('dietary_restrictions'),
  embedding: text('embedding'),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const trips = sqliteTable('trips', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title'),
  destination: text('destination'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  budget: integer('budget'),
  travelers: integer('travelers').default(1),
  preferences: text('preferences'),
  accommodation: text('accommodation'),
  status: text('status').default('in_progress'), // 'in_progress', 'completed', 'cancelled'
  aiReasoning: text('ai_reasoning'),
  itinerary: text('itinerary'), // JSON string
  coordinates: text('coordinates'), // JSON string: {latitude, longitude}
  aiGenerated: integer('ai_generated', { mode: 'boolean' }).default(true),
  metadata: text('metadata'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const itineraries = sqliteTable('itineraries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('trip_id').references(() => trips.id).notNull(),
  day: integer('day').notNull(),
  activities: text('activities'),
  accommodations: text('accommodations'),
  transport: text('transport'),
  notes: text('notes'),
  costEstimate: integer('cost_estimate'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const plans = sqliteTable('plans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('trip_id').references(() => trips.id),
  mapData: text('map_data'),
  details: text('details'),
  aiOutput: text('ai_output'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  content: text('content'),
  attachments: text('attachments'),
  type: text('type'),
  relatedId: integer('related_id'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').references(() => posts.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const reactions = sqliteTable('reactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').references(() => posts.id),
  commentId: integer('comment_id').references(() => comments.id),
  userId: integer('user_id').references(() => users.id).notNull(),
  emoji: text('emoji').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const userSubscriptions = sqliteTable('user_subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  tier: text('tier').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  active: integer('active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  tourId: integer('tour_id').references(() => tours.id),
  subscriptionId: integer('subscription_id').references(() => userSubscriptions.id),
  transactionId: text('transaction_id').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').default('IRR'),
  status: text('status').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const devices = sqliteTable('devices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  deviceId: text('device_id').unique().notNull(),
  type: text('type'),
  lastSeen: text('last_seen').default(sql`(CURRENT_TIMESTAMP)`),
});

export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  data: text('data'),
  read: integer('read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
  country: text('country').notNull(),
  coordinates: text('coordinates'),
  description: text('description'),
  popularActivities: text('popular_activities'),
  averageCost: integer('average_cost'),
  embedding: text('embedding'),
  imageUrl: text('image_url'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const places = sqliteTable('places', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  location: text('location').notNull(),
  locationId: integer('location_id').references(() => locations.id),
  distance: integer('distance'), // in km
  rating: integer('rating').default(0), // stored as integer (4.5 * 10 = 45)
  reviews: integer('reviews').default(0),
  type: text('type').notNull(), // category
  description: text('description'),
  tips: text('tips'), // JSON string array
  isOpen: integer('is_open', { mode: 'boolean' }).default(true),
  hours: text('hours'), // JSON string
  phone: text('phone'),
  website: text('website'),
  price: integer('price'),
  ownerId: integer('owner_id').references(() => users.id),
  coordinates: text('coordinates'), // JSON string: {latitude, longitude}
  embedding: text('embedding'),
  imageUrl: text('image_url'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const thoughts = sqliteTable('thoughts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('trip_id').references(() => trips.id).notNull(),
  step: text('step').notNull(),
  data: text('data'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// ============================================================================
// RELATIONSHIPS
// ============================================================================

export const usersRelations = relations(users, ({ many, one }) => ({
  messages: many(messages),
  subscriptions: many(subscriptions),
  preferences: one(userPreferences),
  trips: many(trips),
  tours: many(tours),
  posts: many(posts),
  comments: many(comments),
  reactions: many(reactions),
  payments: many(payments),
  userSubscriptions: many(userSubscriptions),
  devices: many(devices),
  notifications: many(notifications),
  places: many(places),
}));

export const toursRelations = relations(tours, ({ many }) => ({
  payments: many(payments),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, { fields: [messages.userId], references: [users.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, { fields: [userPreferences.userId], references: [users.id] }),
}));

export const tripsRelations = relations(trips, ({ many, one }) => ({
  user: one(users, { fields: [trips.userId], references: [users.id] }),
  itineraries: many(itineraries),
  plans: many(plans),
  messages: many(messages),
  thoughts: many(thoughts),
}));

export const itinerariesRelations = relations(itineraries, ({ one }) => ({
  trip: one(trips, { fields: [itineraries.tripId], references: [trips.id] }),
}));

export const plansRelations = relations(plans, ({ one }) => ({
  trip: one(trips, { fields: [plans.tripId], references: [trips.id] }),
}));

export const postsRelations = relations(posts, ({ many, one }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(comments),
  reactions: many(reactions),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));

export const reactionsRelations = relations(reactions, ({ one }) => ({
  post: one(posts, { fields: [reactions.postId], references: [posts.id] }),
  comment: one(comments, { fields: [reactions.commentId], references: [comments.id] }),
  user: one(users, { fields: [reactions.userId], references: [users.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  tour: one(tours, { fields: [payments.tourId], references: [tours.id] }),
  subscription: one(userSubscriptions, { fields: [payments.subscriptionId], references: [userSubscriptions.id] }),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one, many }) => ({
  user: one(users, { fields: [userSubscriptions.userId], references: [users.id] }),
  payments: many(payments),
}));

export const devicesRelations = relations(devices, ({ one }) => ({
  user: one(users, { fields: [devices.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  places: many(places),
}));

export const placesRelations = relations(places, ({ one }) => ({
  location: one(locations, { fields: [places.locationId], references: [locations.id] }),
  owner: one(users, { fields: [places.ownerId], references: [users.id] }),
}));

export const thoughtsRelations = relations(thoughts, ({ one }) => ({
  trip: one(trips, { fields: [thoughts.tripId], references: [trips.id] }),
}));

// ============================================================================
// EXPORTS
// ============================================================================

export const schema = {
  users,
  tours,
  messages,
  subscriptions,
  userPreferences,
  trips,
  itineraries,
  plans,
  posts,
  comments,
  reactions,
  payments,
  userSubscriptions,
  devices,
  notifications,
  locations,
  places,
  thoughts,
};

export default schema;
