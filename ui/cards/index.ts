/**
 * Card Components
 * 
 * Shared card components for displaying trips, places, locations, posts, and feed items
 * Note: Tours are now unified into trips with isHosted flag
 */

export { TripCard } from './TripCard';
export type { TripCardProps } from './TripCard';

// TourCard removed - use TripCard with isHosted flag instead

export { PlaceCard } from './PlaceCard';
export type { PlaceCardProps } from './PlaceCard';

export { LocationCard } from './LocationCard';
export type { LocationCardProps } from './LocationCard';

export { PostCard } from './PostCard';
export type { PostCardProps } from './PostCard';

export { FeedItem } from './FeedItem';
export { default as MyTripCard } from './MyTripCard';
export type { MyTripCardProps } from './MyTripCard';
export type { FeedItemProps } from './FeedItem';
export { NotificationCard } from './NotificationCard';
export type { NotificationCardProps, NotificationType } from './NotificationCard';

