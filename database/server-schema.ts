/**
 * Server-only schema export for migrations
 * This file exports only server tables (excludes client cached tables)
 */

export {
  users,
  trips,
  tours,
  messages,
  subscriptions,
  userPreferences,
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
  // Relationships (for proper type inference)
  usersRelations,
  tripsRelations,
  toursRelations,
  messagesRelations,
  subscriptionsRelations,
  userPreferencesRelations,
  itinerariesRelations,
  plansRelations,
  postsRelations,
  commentsRelations,
  reactionsRelations,
  paymentsRelations,
  userSubscriptionsRelations,
  devicesRelations,
  notificationsRelations,
  locationsRelations,
  placesRelations,
  thoughtsRelations,
} from './schema';

