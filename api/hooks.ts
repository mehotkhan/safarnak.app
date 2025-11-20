import { Exact, Scalars, BookTourInput, CoordinatesInput, CreateLocationInput, CreatePlaceInput, CreatePostInput, CreateTourInput, CreateTripInput, UpdateLocationInput, UpdatePlaceInput, UpdateTourInput, UpdateTripInput, UpdateUserInput } from './types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AddMessageMutationVariables = Exact<{
  content: Scalars['String']['input'];
}>;


export type AddMessageMutation = { addMessage: { id: string, content: string, createdAt: string } };

export type BookTourMutationVariables = Exact<{
  input: BookTourInput;
}>;


export type BookTourMutation = { bookTour: { id: string, tourId: string, userId: string, participants: number, selectedDate: string, fullName: string, email: string, phone?: string | null, specialRequests?: string | null, totalPrice: number, status: string, createdAt: string } };

export type BookmarkPostMutationVariables = Exact<{
  postId: Scalars['ID']['input'];
}>;


export type BookmarkPostMutation = { bookmarkPost: boolean };

export type CheckUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type CheckUsernameQuery = { checkUsernameAvailability: boolean };

export type CreateCommentMutationVariables = Exact<{
  postId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
}>;


export type CreateCommentMutation = { createComment: { id: string, postId: string, userId: string, content: string, createdAt: string, user: { id: string, name: string, username: string, avatar?: string | null } } };

export type CreateLocationMutationVariables = Exact<{
  input: CreateLocationInput;
}>;


export type CreateLocationMutation = { createLocation: { id: string, name: string, country: string, description?: string | null, popularActivities: Array<string>, averageCost?: number | null, bestTimeToVisit?: string | null, population?: string | null, createdAt: string, updatedAt: string, coordinates: { latitude: number, longitude: number } } };

export type CreatePlaceMutationVariables = Exact<{
  input: CreatePlaceInput;
}>;


export type CreatePlaceMutation = { createPlace: { id: string, name: string, location: string, distance?: number | null, rating: number, reviews: number, type: string, isOpen: boolean, description: string, tips: Array<string>, phone?: string | null, website?: string | null, hours?: string | null, price?: number | null, locationId?: string | null, ownerId?: string | null, imageUrl?: string | null, createdAt: string, coordinates: { latitude: number, longitude: number } } };

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreatePostMutation = { createPost: { id: string, userId: string, content?: string | null, attachments: Array<string>, type?: string | null, relatedId?: string | null, commentsCount: number, reactionsCount: number, createdAt: string, user: { id: string, name: string, username: string, avatar?: string | null }, relatedEntity?:
      | { id: string, name: string, location: string, imageUrl?: string | null, placeDescription: string, placeCoordinates: { latitude: number, longitude: number } }
      | { id: string, title: string, location: string, price: number, rating: number, imageUrl?: string | null, tourDescription?: string | null, tourCoordinates?: { latitude: number, longitude: number } | null }
      | { id: string, destination?: string | null, startDate?: string | null, endDate?: string | null, preferences?: string | null, tripCoordinates?: { latitude: number, longitude: number } | null }
     | null } };

export type CreateReactionMutationVariables = Exact<{
  postId?: InputMaybe<Scalars['ID']['input']>;
  commentId?: InputMaybe<Scalars['ID']['input']>;
  emoji: Scalars['String']['input'];
}>;


export type CreateReactionMutation = { createReaction: { id: string, postId?: string | null, commentId?: string | null, userId: string, emoji: string, createdAt: string, user: { id: string, name: string, username: string } } };

export type CreateTourMutationVariables = Exact<{
  input: CreateTourInput;
}>;


export type CreateTourMutation = { createTour: { id: string, title: string, location: string, price: number, rating: number, reviews: number, duration: number, durationType: string, category: string, description?: string | null, shortDescription?: string | null, highlights: Array<string>, inclusions: Array<string>, maxParticipants?: number | null, minParticipants: number, difficulty: string, currency: string, imageUrl?: string | null, gallery: Array<string>, tags: Array<string>, isActive: boolean, isFeatured: boolean, createdAt: string, updatedAt: string, coordinates?: { latitude: number, longitude: number } | null } };

export type CreateTripMutationVariables = Exact<{
  input: CreateTripInput;
}>;


export type CreateTripMutation = { createTrip: { id: string, destination?: string | null, startDate?: string | null, endDate?: string | null, status: string, travelers: number, preferences?: string | null, accommodation?: string | null, aiReasoning?: string | null, coordinates?: { latitude: number, longitude: number } | null, waypoints?: Array<{ latitude: number, longitude: number, label?: string | null }> | null } };

export type DeleteLocationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLocationMutation = { deleteLocation: boolean };

export type DeletePlaceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePlaceMutation = { deletePlace: boolean };

export type DeleteReactionMutationVariables = Exact<{
  reactionId: Scalars['ID']['input'];
}>;


export type DeleteReactionMutation = { deleteReaction: boolean };

export type DeleteTourMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTourMutation = { deleteTour: boolean };

export type FeedNewEventsSubscriptionVariables = Exact<{
  filter?: InputMaybe<FeedFilter>;
}>;


export type FeedNewEventsSubscription = { feedNewEvents: Array<{ id: string, entityType: EntityType, entityId: string, verb: FeedVerb, visibility: Visibility, topics: Array<string>, createdAt: string, actor: { id: string, name: string, username: string, avatar?: string | null, createdAt: string }, entity:
      | { __typename: 'Location', id: string, name: string, country: string, createdAt: string }
      | { __typename: 'Place', id: string, name: string, type: string, location: string, createdAt: string }
      | { __typename: 'Post', id: string, userId: string, content?: string | null, commentsCount: number, reactionsCount: number, createdAt: string, comments: Array<{ id: string, content: string, createdAt: string, user: { id: string, name: string, avatar?: string | null } }>, reactions: Array<{ id: string, emoji: string, userId: string, createdAt: string, user: { id: string, name: string } }> }
      | { __typename: 'Tour', id: string, title: string, category: string, price: number, createdAt: string }
      | { __typename: 'Trip', id: string, userId: string, destination?: string | null, status: string, createdAt: string }
     }> };

export type FollowUserMutationVariables = Exact<{
  followeeId: Scalars['ID']['input'];
}>;


export type FollowUserMutation = { followUser: boolean };

export type GenerateAvatarMutationVariables = Exact<{
  style?: InputMaybe<Scalars['String']['input']>;
}>;


export type GenerateAvatarMutation = { generateAvatar: { id: string, name: string, username: string, avatar?: string | null, publicKey?: string | null, createdAt: string } };

export type GetAlertsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAlertsQuery = { getAlerts: Array<{ id: string, type: string, title: string, message: string, step?: number | null, totalSteps?: number | null, tripId?: string | null, userId: string, read?: boolean | null, createdAt: string }> };

export type GetBookmarksQueryVariables = Exact<{
  type?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetBookmarksQuery = { getBookmarks: Array<{ id: string, userId: string, postId?: string | null, tourId?: string | null, placeId?: string | null, createdAt: string, post?: { id: string, userId: string, content?: string | null, attachments: Array<string>, type?: string | null, relatedId?: string | null, commentsCount: number, reactionsCount: number, createdAt: string, user: { id: string, name: string, username: string, avatar?: string | null }, relatedEntity?:
        | { id: string, name: string, location: string, imageUrl?: string | null, placeCoordinates: { latitude: number, longitude: number } }
        | { id: string, title: string, location: string, imageUrl?: string | null, tourCoordinates?: { latitude: number, longitude: number } | null }
        | { id: string, destination?: string | null, tripCoordinates?: { latitude: number, longitude: number } | null }
       | null } | null, tour?: { id: string, title: string, location: string, price: number, rating: number, imageUrl?: string | null, category: string, createdAt: string } | null, place?: { id: string, name: string, location: string, rating: number, type: string, imageUrl?: string | null, createdAt: string } | null }> };

export type GetFeedQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FeedFilter>;
}>;


export type GetFeedQuery = { getFeed: { edges: Array<{ cursor: string, node: { id: string, entityType: EntityType, entityId: string, verb: FeedVerb, visibility: Visibility, topics: Array<string>, createdAt: string, actor: { id: string, name: string, username: string, avatar?: string | null, createdAt: string }, entity:
          | { __typename: 'Location', id: string, name: string, country: string, createdAt: string }
          | { __typename: 'Place', id: string, name: string, type: string, location: string, createdAt: string }
          | { __typename: 'Post', id: string, userId: string, content?: string | null, commentsCount: number, reactionsCount: number, createdAt: string, comments: Array<{ id: string, content: string, createdAt: string, user: { id: string, name: string, avatar?: string | null } }>, reactions: Array<{ id: string, emoji: string, userId: string, createdAt: string, user: { id: string, name: string } }> }
          | { __typename: 'Tour', id: string, title: string, category: string, price: number, createdAt: string }
          | { __typename: 'Trip', id: string, userId: string, destination?: string | null, status: string, createdAt: string }
         } }>, pageInfo: { endCursor?: string | null, hasNextPage: boolean } } };

export type GetFeedPreferencesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFeedPreferencesQuery = { getFeedPreferences: { entityTypes: Array<EntityType>, topics: Array<string>, followingOnly: boolean, circleOnly: boolean, mutedUserIds: Array<string> } };

export type GetFollowersQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetFollowersQuery = { getFollowers: Array<{ id: string, name: string, username: string, avatar?: string | null }> };

export type GetFollowingQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetFollowingQuery = { getFollowing: Array<{ id: string, name: string, username: string, avatar?: string | null }> };

export type GetLocationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLocationQuery = { getLocation?: { id: string, name: string, country: string, description?: string | null, popularActivities: Array<string>, averageCost?: number | null, bestTimeToVisit?: string | null, population?: string | null, createdAt: string, updatedAt: string, coordinates: { latitude: number, longitude: number } } | null };

export type GetLocationsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetLocationsQuery = { getLocations: Array<{ id: string, name: string, country: string, description?: string | null, popularActivities: Array<string>, averageCost?: number | null, bestTimeToVisit?: string | null, population?: string | null, createdAt: string, updatedAt: string, coordinates: { latitude: number, longitude: number } }> };

export type GetMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMessagesQuery = { getMessages: Array<{ id: string, content: string, createdAt: string }> };

export type GetMyDevicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyDevicesQuery = { getMyDevices: Array<{ id: string, deviceId: string, publicKey: string, type?: string | null, lastSeen: string, createdAt: string }> };

export type GetPlaceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPlaceQuery = { getPlace?: { id: string, name: string, location: string, distance?: number | null, rating: number, reviews: number, type: string, isOpen: boolean, description: string, tips: Array<string>, phone?: string | null, website?: string | null, hours?: string | null, price?: number | null, locationId?: string | null, ownerId?: string | null, imageUrl?: string | null, createdAt: string, coordinates: { latitude: number, longitude: number } } | null };

export type GetPlacesQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPlacesQuery = { getPlaces: Array<{ id: string, name: string, location: string, distance?: number | null, rating: number, reviews: number, type: string, isOpen: boolean, description: string, tips: Array<string>, phone?: string | null, website?: string | null, hours?: string | null, price?: number | null, locationId?: string | null, ownerId?: string | null, imageUrl?: string | null, createdAt: string, coordinates: { latitude: number, longitude: number } }> };

export type GetPostQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPostQuery = { getPost?: { id: string, userId: string, content?: string | null, attachments: Array<string>, type?: string | null, relatedId?: string | null, commentsCount: number, reactionsCount: number, isBookmarked: boolean, createdAt: string, user: { id: string, name: string, username: string, avatar?: string | null }, relatedEntity?:
      | { id: string, name: string, location: string, imageUrl?: string | null, placeDescription: string, placeCoordinates: { latitude: number, longitude: number } }
      | { id: string, title: string, location: string, price: number, rating: number, imageUrl?: string | null, tourDescription?: string | null, tourCoordinates?: { latitude: number, longitude: number } | null }
      | { id: string, destination?: string | null, startDate?: string | null, endDate?: string | null, preferences?: string | null, tripCoordinates?: { latitude: number, longitude: number } | null }
     | null, comments: Array<{ id: string, userId: string, content: string, createdAt: string, user: { id: string, name: string, username: string, avatar?: string | null } }>, reactions: Array<{ id: string, userId: string, emoji: string, createdAt: string, user: { id: string, name: string, username: string } }> } | null };

export type GetPostsQueryVariables = Exact<{
  type?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPostsQuery = { getPosts: { totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean, nextOffset?: number | null, previousOffset?: number | null, posts: Array<{ id: string, userId: string, content?: string | null, attachments: Array<string>, type?: string | null, relatedId?: string | null, commentsCount: number, reactionsCount: number, isBookmarked: boolean, createdAt: string, user: { id: string, name: string, username: string, avatar?: string | null, createdAt: string }, relatedEntity?:
        | { id: string, name: string, location: string, imageUrl?: string | null, placeDescription: string, placeCoordinates: { latitude: number, longitude: number } }
        | { id: string, title: string, location: string, price: number, rating: number, imageUrl?: string | null, tourDescription?: string | null, tourCoordinates?: { latitude: number, longitude: number } | null }
        | { id: string, destination?: string | null, startDate?: string | null, endDate?: string | null, preferences?: string | null, tripCoordinates?: { latitude: number, longitude: number } | null }
       | null, comments: Array<{ id: string, userId: string, content: string, createdAt: string, user: { id: string, name: string, username: string, avatar?: string | null } }>, reactions: Array<{ id: string, userId: string, emoji: string, createdAt: string, user: { id: string, name: string, username: string } }> }> } };

export type GetTourQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTourQuery = { getTour?: { id: string, title: string, location: string, price: number, rating: number, reviews: number, duration: number, durationType: string, category: string, description?: string | null, shortDescription?: string | null, highlights: Array<string>, inclusions: Array<string>, maxParticipants?: number | null, minParticipants: number, difficulty: string, currency: string, imageUrl?: string | null, gallery: Array<string>, tags: Array<string>, isActive: boolean, isFeatured: boolean, createdAt: string, updatedAt: string, coordinates?: { latitude: number, longitude: number } | null } | null };

export type GetToursQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetToursQuery = { getTours: Array<{ id: string, title: string, location: string, price: number, rating: number, reviews: number, duration: number, durationType: string, category: string, description?: string | null, shortDescription?: string | null, highlights: Array<string>, inclusions: Array<string>, maxParticipants?: number | null, minParticipants: number, difficulty: string, currency: string, imageUrl?: string | null, gallery: Array<string>, tags: Array<string>, isActive: boolean, isFeatured: boolean, createdAt: string, updatedAt: string, coordinates?: { latitude: number, longitude: number } | null }> };

export type GetTrendingQueryVariables = Exact<{
  type: TrendingType;
  window: TimeWindow;
  entityTypes?: InputMaybe<Array<EntityType> | EntityType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetTrendingQuery = { getTrending: { window: TimeWindow, items: Array<{ key: string, label: string, score: number, delta?: number | null }> } };

export type GetTripQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTripQuery = { getTrip?: { id: string, destination?: string | null, startDate?: string | null, endDate?: string | null, status: string, travelers: number, preferences?: string | null, accommodation?: string | null, aiReasoning?: string | null, createdAt: string, updatedAt: string, itinerary?: Array<{ day: number, title: string, activities: Array<string> }> | null, coordinates?: { latitude: number, longitude: number } | null, waypoints?: Array<{ latitude: number, longitude: number, label?: string | null }> | null } | null };

export type GetTripsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTripsQuery = { getTrips: Array<{ id: string, destination?: string | null, startDate?: string | null, endDate?: string | null, status: string, travelers: number, preferences?: string | null, budget?: number | null, accommodation?: string | null, createdAt: string, updatedAt: string }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { getUser?: { id: string, name: string, username: string, avatar?: string | null, createdAt: string } | null };

export type IsFollowingQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type IsFollowingQuery = { isFollowing: boolean };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  deviceId: Scalars['String']['input'];
  publicKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type LoginMutation = { loginUser: { token: string, user: { id: string, name: string, username: string, createdAt: string } } };

export type LoginUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  deviceId: Scalars['String']['input'];
  publicKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type LoginUserMutation = { loginUser: { token: string, user: { id: string, name: string, username: string, createdAt: string } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me?: { id: string, name: string, username: string, email?: string | null, phone?: string | null, avatar?: string | null, publicKey?: string | null, createdAt: string } | null };

export type NewAlertsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewAlertsSubscription = { newAlerts: { id: string, type: string, title: string, message: string, step?: number | null, totalSteps?: number | null, tripId?: string | null, userId: string, read?: boolean | null, createdAt: string } };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String']['input'];
  publicKey: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  deviceId: Scalars['String']['input'];
}>;


export type RegisterMutation = { registerUser: { token: string, user: { id: string, name: string, username: string, createdAt: string } } };

export type RegisterUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  publicKey: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  deviceId: Scalars['String']['input'];
}>;


export type RegisterUserMutation = { registerUser: { token: string, user: { id: string, name: string, username: string, createdAt: string } } };

export type RequestChallengeMutationVariables = Exact<{
  username: Scalars['String']['input'];
  isRegister: Scalars['Boolean']['input'];
}>;


export type RequestChallengeMutation = { requestChallenge: string };

export type RevokeDeviceMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type RevokeDeviceMutation = { revokeDevice: boolean };

export type SearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  entityTypes?: InputMaybe<Array<EntityType> | EntityType>;
  topics?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchQuery = { search: { edges: Array<{ cursor: string, node: { id: string, entityType: EntityType, entityId: string, verb: FeedVerb, createdAt: string, visibility: Visibility, topics: Array<string>, actor: { id: string, username: string, name: string, avatar?: string | null }, entity:
          | { __typename: 'Location', id: string, name: string, country: string, createdAt: string }
          | { __typename: 'Place', id: string, name: string, type: string, location: string, createdAt: string }
          | { __typename: 'Post', id: string, userId: string, content?: string | null, createdAt: string }
          | { __typename: 'Tour', id: string, title: string, category: string, price: number, createdAt: string }
          | { __typename: 'Trip', id: string, userId: string, destination?: string | null, status: string, createdAt: string }
         } }>, pageInfo: { endCursor?: string | null, hasNextPage: boolean } } };

export type SearchSemanticQueryVariables = Exact<{
  query: Scalars['String']['input'];
  entityTypes?: InputMaybe<Array<EntityType> | EntityType>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchSemanticQuery = { searchSemantic: { edges: Array<{ cursor: string, node: { id: string, entityType: EntityType, entityId: string, verb: FeedVerb, createdAt: string, visibility: Visibility, topics: Array<string>, actor: { id: string, username: string, name: string, avatar?: string | null }, entity:
          | { __typename: 'Location', id: string, name: string, country: string, createdAt: string }
          | { __typename: 'Place', id: string, name: string, type: string, location: string, createdAt: string }
          | { __typename: 'Post', id: string, userId: string, content?: string | null, createdAt: string }
          | { __typename: 'Tour', id: string, title: string, category: string, price: number, createdAt: string }
          | { __typename: 'Trip', id: string, userId: string, destination?: string | null, status: string, createdAt: string }
         } }>, pageInfo: { endCursor?: string | null, hasNextPage: boolean } } };

export type SearchSuggestQueryVariables = Exact<{
  prefix: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchSuggestQuery = { searchSuggest: Array<string> };

export type TripUpdatesSubscriptionVariables = Exact<{
  tripId: Scalars['ID']['input'];
}>;


export type TripUpdatesSubscription = { tripUpdates: { id: string, tripId: string, type: string, title: string, message: string, step: number, totalSteps: number, status: string, data?: string | null, createdAt: string } };

export type UnfollowUserMutationVariables = Exact<{
  followeeId: Scalars['ID']['input'];
}>;


export type UnfollowUserMutation = { unfollowUser: boolean };

export type UpdateFeedPreferencesMutationVariables = Exact<{
  input: FeedFilter;
}>;


export type UpdateFeedPreferencesMutation = { updateFeedPreferences: { entityTypes: Array<EntityType>, topics: Array<string>, followingOnly: boolean, circleOnly: boolean, mutedUserIds: Array<string> } };

export type UpdateLocationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateLocationInput;
}>;


export type UpdateLocationMutation = { updateLocation: { id: string, name: string, country: string, description?: string | null, popularActivities: Array<string>, averageCost?: number | null, bestTimeToVisit?: string | null, population?: string | null, createdAt: string, updatedAt: string, coordinates: { latitude: number, longitude: number } } };

export type UpdatePlaceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdatePlaceInput;
}>;


export type UpdatePlaceMutation = { updatePlace: { id: string, name: string, location: string, distance?: number | null, rating: number, reviews: number, type: string, isOpen: boolean, description: string, tips: Array<string>, phone?: string | null, website?: string | null, hours?: string | null, price?: number | null, locationId?: string | null, ownerId?: string | null, imageUrl?: string | null, createdAt: string, coordinates: { latitude: number, longitude: number } } };

export type UpdateTourMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTourInput;
}>;


export type UpdateTourMutation = { updateTour: { id: string, title: string, location: string, price: number, rating: number, reviews: number, duration: number, durationType: string, category: string, description?: string | null, shortDescription?: string | null, highlights: Array<string>, inclusions: Array<string>, maxParticipants?: number | null, minParticipants: number, difficulty: string, currency: string, imageUrl?: string | null, gallery: Array<string>, tags: Array<string>, isActive: boolean, isFeatured: boolean, createdAt: string, updatedAt: string, coordinates?: { latitude: number, longitude: number } | null } };

export type UpdateTripMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTripInput;
}>;


export type UpdateTripMutation = { updateTrip: { id: string, destination?: string | null, startDate?: string | null, endDate?: string | null, status: string, travelers: number, preferences?: string | null, accommodation?: string | null, aiReasoning?: string | null, createdAt: string, updatedAt: string, itinerary?: Array<{ day: number, title: string, activities: Array<string> }> | null, coordinates?: { latitude: number, longitude: number } | null, waypoints?: Array<{ latitude: number, longitude: number, label?: string | null }> | null } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { updateUser: { id: string, name: string, username: string, avatar?: string | null, publicKey?: string | null, createdAt: string } };


export const AddMessageDocument = gql`
    mutation AddMessage($content: String!) {
  addMessage(content: $content) {
    id
    content
    createdAt
  }
}
    `;

/**
 * __useAddMessageMutation__
 *
 * To run a mutation, you first call `useAddMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMessageMutation, { data, loading, error }] = useAddMessageMutation({
 *   variables: {
 *      content: // value for 'content'
 *   },
 * });
 */
export function useAddMessageMutation(baseOptions?: Apollo.MutationHookOptions<AddMessageMutation, AddMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMessageMutation, AddMessageMutationVariables>(AddMessageDocument, options);
      }
export type AddMessageMutationHookResult = ReturnType<typeof useAddMessageMutation>;
export type AddMessageMutationResult = Apollo.MutationResult<AddMessageMutation>;
export type AddMessageMutationOptions = Apollo.BaseMutationOptions<AddMessageMutation, AddMessageMutationVariables>;
export const BookTourDocument = gql`
    mutation BookTour($input: BookTourInput!) {
  bookTour(input: $input) {
    id
    tourId
    userId
    participants
    selectedDate
    fullName
    email
    phone
    specialRequests
    totalPrice
    status
    createdAt
  }
}
    `;

/**
 * __useBookTourMutation__
 *
 * To run a mutation, you first call `useBookTourMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBookTourMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bookTourMutation, { data, loading, error }] = useBookTourMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBookTourMutation(baseOptions?: Apollo.MutationHookOptions<BookTourMutation, BookTourMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BookTourMutation, BookTourMutationVariables>(BookTourDocument, options);
      }
export type BookTourMutationHookResult = ReturnType<typeof useBookTourMutation>;
export type BookTourMutationResult = Apollo.MutationResult<BookTourMutation>;
export type BookTourMutationOptions = Apollo.BaseMutationOptions<BookTourMutation, BookTourMutationVariables>;
export const BookmarkPostDocument = gql`
    mutation BookmarkPost($postId: ID!) {
  bookmarkPost(postId: $postId)
}
    `;

/**
 * __useBookmarkPostMutation__
 *
 * To run a mutation, you first call `useBookmarkPostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBookmarkPostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bookmarkPostMutation, { data, loading, error }] = useBookmarkPostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useBookmarkPostMutation(baseOptions?: Apollo.MutationHookOptions<BookmarkPostMutation, BookmarkPostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BookmarkPostMutation, BookmarkPostMutationVariables>(BookmarkPostDocument, options);
      }
export type BookmarkPostMutationHookResult = ReturnType<typeof useBookmarkPostMutation>;
export type BookmarkPostMutationResult = Apollo.MutationResult<BookmarkPostMutation>;
export type BookmarkPostMutationOptions = Apollo.BaseMutationOptions<BookmarkPostMutation, BookmarkPostMutationVariables>;
export const CheckUsernameDocument = gql`
    query CheckUsername($username: String!) {
  checkUsernameAvailability(username: $username)
}
    `;

/**
 * __useCheckUsernameQuery__
 *
 * To run a query within a React component, call `useCheckUsernameQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckUsernameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckUsernameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useCheckUsernameQuery(baseOptions: Apollo.QueryHookOptions<CheckUsernameQuery, CheckUsernameQueryVariables> & ({ variables: CheckUsernameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckUsernameQuery, CheckUsernameQueryVariables>(CheckUsernameDocument, options);
      }
export function useCheckUsernameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckUsernameQuery, CheckUsernameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckUsernameQuery, CheckUsernameQueryVariables>(CheckUsernameDocument, options);
        }
export function useCheckUsernameSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CheckUsernameQuery, CheckUsernameQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CheckUsernameQuery, CheckUsernameQueryVariables>(CheckUsernameDocument, options);
        }
export type CheckUsernameQueryHookResult = ReturnType<typeof useCheckUsernameQuery>;
export type CheckUsernameLazyQueryHookResult = ReturnType<typeof useCheckUsernameLazyQuery>;
export type CheckUsernameSuspenseQueryHookResult = ReturnType<typeof useCheckUsernameSuspenseQuery>;
export type CheckUsernameQueryResult = Apollo.QueryResult<CheckUsernameQuery, CheckUsernameQueryVariables>;
export const CreateCommentDocument = gql`
    mutation CreateComment($postId: ID!, $content: String!) {
  createComment(postId: $postId, content: $content) {
    id
    postId
    userId
    user {
      id
      name
      username
      avatar
    }
    content
    createdAt
  }
}
    `;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, options);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreateLocationDocument = gql`
    mutation CreateLocation($input: CreateLocationInput!) {
  createLocation(input: $input) {
    id
    name
    country
    description
    coordinates {
      latitude
      longitude
    }
    popularActivities
    averageCost
    bestTimeToVisit
    population
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useCreateLocationMutation__
 *
 * To run a mutation, you first call `useCreateLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLocationMutation, { data, loading, error }] = useCreateLocationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLocationMutation(baseOptions?: Apollo.MutationHookOptions<CreateLocationMutation, CreateLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLocationMutation, CreateLocationMutationVariables>(CreateLocationDocument, options);
      }
export type CreateLocationMutationHookResult = ReturnType<typeof useCreateLocationMutation>;
export type CreateLocationMutationResult = Apollo.MutationResult<CreateLocationMutation>;
export type CreateLocationMutationOptions = Apollo.BaseMutationOptions<CreateLocationMutation, CreateLocationMutationVariables>;
export const CreatePlaceDocument = gql`
    mutation CreatePlace($input: CreatePlaceInput!) {
  createPlace(input: $input) {
    id
    name
    location
    distance
    rating
    reviews
    type
    isOpen
    description
    tips
    coordinates {
      latitude
      longitude
    }
    phone
    website
    hours
    price
    locationId
    ownerId
    imageUrl
    createdAt
  }
}
    `;

/**
 * __useCreatePlaceMutation__
 *
 * To run a mutation, you first call `useCreatePlaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePlaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPlaceMutation, { data, loading, error }] = useCreatePlaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePlaceMutation(baseOptions?: Apollo.MutationHookOptions<CreatePlaceMutation, CreatePlaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePlaceMutation, CreatePlaceMutationVariables>(CreatePlaceDocument, options);
      }
export type CreatePlaceMutationHookResult = ReturnType<typeof useCreatePlaceMutation>;
export type CreatePlaceMutationResult = Apollo.MutationResult<CreatePlaceMutation>;
export type CreatePlaceMutationOptions = Apollo.BaseMutationOptions<CreatePlaceMutation, CreatePlaceMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    userId
    user {
      id
      name
      username
      avatar
    }
    content
    attachments
    type
    relatedId
    relatedEntity {
      ... on Trip {
        id
        destination
        startDate
        endDate
        preferences
        tripCoordinates: coordinates {
          latitude
          longitude
        }
      }
      ... on Tour {
        id
        title
        location
        price
        rating
        tourDescription: description
        imageUrl
        tourCoordinates: coordinates {
          latitude
          longitude
        }
      }
      ... on Place {
        id
        name
        location
        placeDescription: description
        imageUrl
        placeCoordinates: coordinates {
          latitude
          longitude
        }
      }
    }
    commentsCount
    reactionsCount
    createdAt
  }
}
    `;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const CreateReactionDocument = gql`
    mutation CreateReaction($postId: ID, $commentId: ID, $emoji: String!) {
  createReaction(postId: $postId, commentId: $commentId, emoji: $emoji) {
    id
    postId
    commentId
    userId
    user {
      id
      name
      username
    }
    emoji
    createdAt
  }
}
    `;

/**
 * __useCreateReactionMutation__
 *
 * To run a mutation, you first call `useCreateReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReactionMutation, { data, loading, error }] = useCreateReactionMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      commentId: // value for 'commentId'
 *      emoji: // value for 'emoji'
 *   },
 * });
 */
export function useCreateReactionMutation(baseOptions?: Apollo.MutationHookOptions<CreateReactionMutation, CreateReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReactionMutation, CreateReactionMutationVariables>(CreateReactionDocument, options);
      }
export type CreateReactionMutationHookResult = ReturnType<typeof useCreateReactionMutation>;
export type CreateReactionMutationResult = Apollo.MutationResult<CreateReactionMutation>;
export type CreateReactionMutationOptions = Apollo.BaseMutationOptions<CreateReactionMutation, CreateReactionMutationVariables>;
export const CreateTourDocument = gql`
    mutation CreateTour($input: CreateTourInput!) {
  createTour(input: $input) {
    id
    title
    location
    price
    rating
    reviews
    duration
    durationType
    category
    description
    shortDescription
    highlights
    inclusions
    maxParticipants
    minParticipants
    difficulty
    currency
    coordinates {
      latitude
      longitude
    }
    imageUrl
    gallery
    tags
    isActive
    isFeatured
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useCreateTourMutation__
 *
 * To run a mutation, you first call `useCreateTourMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTourMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTourMutation, { data, loading, error }] = useCreateTourMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTourMutation(baseOptions?: Apollo.MutationHookOptions<CreateTourMutation, CreateTourMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTourMutation, CreateTourMutationVariables>(CreateTourDocument, options);
      }
export type CreateTourMutationHookResult = ReturnType<typeof useCreateTourMutation>;
export type CreateTourMutationResult = Apollo.MutationResult<CreateTourMutation>;
export type CreateTourMutationOptions = Apollo.BaseMutationOptions<CreateTourMutation, CreateTourMutationVariables>;
export const CreateTripDocument = gql`
    mutation CreateTrip($input: CreateTripInput!) {
  createTrip(input: $input) {
    id
    destination
    startDate
    endDate
    status
    travelers
    preferences
    accommodation
    aiReasoning
    coordinates {
      latitude
      longitude
    }
    waypoints {
      latitude
      longitude
      label
    }
  }
}
    `;

/**
 * __useCreateTripMutation__
 *
 * To run a mutation, you first call `useCreateTripMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTripMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTripMutation, { data, loading, error }] = useCreateTripMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTripMutation(baseOptions?: Apollo.MutationHookOptions<CreateTripMutation, CreateTripMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTripMutation, CreateTripMutationVariables>(CreateTripDocument, options);
      }
export type CreateTripMutationHookResult = ReturnType<typeof useCreateTripMutation>;
export type CreateTripMutationResult = Apollo.MutationResult<CreateTripMutation>;
export type CreateTripMutationOptions = Apollo.BaseMutationOptions<CreateTripMutation, CreateTripMutationVariables>;
export const DeleteLocationDocument = gql`
    mutation DeleteLocation($id: ID!) {
  deleteLocation(id: $id)
}
    `;

/**
 * __useDeleteLocationMutation__
 *
 * To run a mutation, you first call `useDeleteLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLocationMutation, { data, loading, error }] = useDeleteLocationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLocationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLocationMutation, DeleteLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLocationMutation, DeleteLocationMutationVariables>(DeleteLocationDocument, options);
      }
export type DeleteLocationMutationHookResult = ReturnType<typeof useDeleteLocationMutation>;
export type DeleteLocationMutationResult = Apollo.MutationResult<DeleteLocationMutation>;
export type DeleteLocationMutationOptions = Apollo.BaseMutationOptions<DeleteLocationMutation, DeleteLocationMutationVariables>;
export const DeletePlaceDocument = gql`
    mutation DeletePlace($id: ID!) {
  deletePlace(id: $id)
}
    `;

/**
 * __useDeletePlaceMutation__
 *
 * To run a mutation, you first call `useDeletePlaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePlaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePlaceMutation, { data, loading, error }] = useDeletePlaceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePlaceMutation(baseOptions?: Apollo.MutationHookOptions<DeletePlaceMutation, DeletePlaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePlaceMutation, DeletePlaceMutationVariables>(DeletePlaceDocument, options);
      }
export type DeletePlaceMutationHookResult = ReturnType<typeof useDeletePlaceMutation>;
export type DeletePlaceMutationResult = Apollo.MutationResult<DeletePlaceMutation>;
export type DeletePlaceMutationOptions = Apollo.BaseMutationOptions<DeletePlaceMutation, DeletePlaceMutationVariables>;
export const DeleteReactionDocument = gql`
    mutation DeleteReaction($reactionId: ID!) {
  deleteReaction(reactionId: $reactionId)
}
    `;

/**
 * __useDeleteReactionMutation__
 *
 * To run a mutation, you first call `useDeleteReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReactionMutation, { data, loading, error }] = useDeleteReactionMutation({
 *   variables: {
 *      reactionId: // value for 'reactionId'
 *   },
 * });
 */
export function useDeleteReactionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReactionMutation, DeleteReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReactionMutation, DeleteReactionMutationVariables>(DeleteReactionDocument, options);
      }
export type DeleteReactionMutationHookResult = ReturnType<typeof useDeleteReactionMutation>;
export type DeleteReactionMutationResult = Apollo.MutationResult<DeleteReactionMutation>;
export type DeleteReactionMutationOptions = Apollo.BaseMutationOptions<DeleteReactionMutation, DeleteReactionMutationVariables>;
export const DeleteTourDocument = gql`
    mutation DeleteTour($id: ID!) {
  deleteTour(id: $id)
}
    `;

/**
 * __useDeleteTourMutation__
 *
 * To run a mutation, you first call `useDeleteTourMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTourMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTourMutation, { data, loading, error }] = useDeleteTourMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTourMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTourMutation, DeleteTourMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTourMutation, DeleteTourMutationVariables>(DeleteTourDocument, options);
      }
export type DeleteTourMutationHookResult = ReturnType<typeof useDeleteTourMutation>;
export type DeleteTourMutationResult = Apollo.MutationResult<DeleteTourMutation>;
export type DeleteTourMutationOptions = Apollo.BaseMutationOptions<DeleteTourMutation, DeleteTourMutationVariables>;
export const FeedNewEventsDocument = gql`
    subscription FeedNewEvents($filter: FeedFilter) {
  feedNewEvents(filter: $filter) {
    id
    entityType
    entityId
    verb
    visibility
    topics
    createdAt
    actor {
      id
      name
      username
      avatar
      createdAt
    }
    entity {
      __typename
      ... on Post {
        id
        userId
        content
        comments {
          id
          content
          createdAt
          user {
            id
            name
            avatar
          }
        }
        commentsCount
        reactions {
          id
          emoji
          userId
          createdAt
          user {
            id
            name
          }
        }
        reactionsCount
        createdAt
      }
      ... on Trip {
        id
        userId
        destination
        status
        createdAt
      }
      ... on Tour {
        id
        title
        category
        price
        createdAt
      }
      ... on Place {
        id
        name
        type
        location
        createdAt
      }
      ... on Location {
        id
        name
        country
        createdAt
      }
    }
  }
}
    `;

/**
 * __useFeedNewEventsSubscription__
 *
 * To run a query within a React component, call `useFeedNewEventsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useFeedNewEventsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedNewEventsSubscription({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useFeedNewEventsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<FeedNewEventsSubscription, FeedNewEventsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<FeedNewEventsSubscription, FeedNewEventsSubscriptionVariables>(FeedNewEventsDocument, options);
      }
export type FeedNewEventsSubscriptionHookResult = ReturnType<typeof useFeedNewEventsSubscription>;
export type FeedNewEventsSubscriptionResult = Apollo.SubscriptionResult<FeedNewEventsSubscription>;
export const FollowUserDocument = gql`
    mutation FollowUser($followeeId: ID!) {
  followUser(followeeId: $followeeId)
}
    `;

/**
 * __useFollowUserMutation__
 *
 * To run a mutation, you first call `useFollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followUserMutation, { data, loading, error }] = useFollowUserMutation({
 *   variables: {
 *      followeeId: // value for 'followeeId'
 *   },
 * });
 */
export function useFollowUserMutation(baseOptions?: Apollo.MutationHookOptions<FollowUserMutation, FollowUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FollowUserMutation, FollowUserMutationVariables>(FollowUserDocument, options);
      }
export type FollowUserMutationHookResult = ReturnType<typeof useFollowUserMutation>;
export type FollowUserMutationResult = Apollo.MutationResult<FollowUserMutation>;
export type FollowUserMutationOptions = Apollo.BaseMutationOptions<FollowUserMutation, FollowUserMutationVariables>;
export const GenerateAvatarDocument = gql`
    mutation GenerateAvatar($style: String) {
  generateAvatar(style: $style) {
    id
    name
    username
    avatar
    publicKey
    createdAt
  }
}
    `;

/**
 * __useGenerateAvatarMutation__
 *
 * To run a mutation, you first call `useGenerateAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateAvatarMutation, { data, loading, error }] = useGenerateAvatarMutation({
 *   variables: {
 *      style: // value for 'style'
 *   },
 * });
 */
export function useGenerateAvatarMutation(baseOptions?: Apollo.MutationHookOptions<GenerateAvatarMutation, GenerateAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateAvatarMutation, GenerateAvatarMutationVariables>(GenerateAvatarDocument, options);
      }
export type GenerateAvatarMutationHookResult = ReturnType<typeof useGenerateAvatarMutation>;
export type GenerateAvatarMutationResult = Apollo.MutationResult<GenerateAvatarMutation>;
export type GenerateAvatarMutationOptions = Apollo.BaseMutationOptions<GenerateAvatarMutation, GenerateAvatarMutationVariables>;
export const GetAlertsDocument = gql`
    query GetAlerts {
  getAlerts {
    id
    type
    title
    message
    step
    totalSteps
    tripId
    userId
    read
    createdAt
  }
}
    `;

/**
 * __useGetAlertsQuery__
 *
 * To run a query within a React component, call `useGetAlertsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAlertsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAlertsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAlertsQuery(baseOptions?: Apollo.QueryHookOptions<GetAlertsQuery, GetAlertsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAlertsQuery, GetAlertsQueryVariables>(GetAlertsDocument, options);
      }
export function useGetAlertsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAlertsQuery, GetAlertsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAlertsQuery, GetAlertsQueryVariables>(GetAlertsDocument, options);
        }
export function useGetAlertsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAlertsQuery, GetAlertsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAlertsQuery, GetAlertsQueryVariables>(GetAlertsDocument, options);
        }
export type GetAlertsQueryHookResult = ReturnType<typeof useGetAlertsQuery>;
export type GetAlertsLazyQueryHookResult = ReturnType<typeof useGetAlertsLazyQuery>;
export type GetAlertsSuspenseQueryHookResult = ReturnType<typeof useGetAlertsSuspenseQuery>;
export type GetAlertsQueryResult = Apollo.QueryResult<GetAlertsQuery, GetAlertsQueryVariables>;
export const GetBookmarksDocument = gql`
    query GetBookmarks($type: String) {
  getBookmarks(type: $type) {
    id
    userId
    postId
    tourId
    placeId
    post {
      id
      userId
      user {
        id
        name
        username
        avatar
      }
      content
      attachments
      type
      relatedId
      relatedEntity {
        ... on Trip {
          id
          destination
          tripCoordinates: coordinates {
            latitude
            longitude
          }
        }
        ... on Tour {
          id
          title
          location
          imageUrl
          tourCoordinates: coordinates {
            latitude
            longitude
          }
        }
        ... on Place {
          id
          name
          location
          imageUrl
          placeCoordinates: coordinates {
            latitude
            longitude
          }
        }
      }
      commentsCount
      reactionsCount
      createdAt
    }
    tour {
      id
      title
      location
      price
      rating
      imageUrl
      category
      createdAt
    }
    place {
      id
      name
      location
      rating
      type
      imageUrl
      createdAt
    }
    createdAt
  }
}
    `;

/**
 * __useGetBookmarksQuery__
 *
 * To run a query within a React component, call `useGetBookmarksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBookmarksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBookmarksQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useGetBookmarksQuery(baseOptions?: Apollo.QueryHookOptions<GetBookmarksQuery, GetBookmarksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookmarksQuery, GetBookmarksQueryVariables>(GetBookmarksDocument, options);
      }
export function useGetBookmarksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookmarksQuery, GetBookmarksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookmarksQuery, GetBookmarksQueryVariables>(GetBookmarksDocument, options);
        }
export function useGetBookmarksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBookmarksQuery, GetBookmarksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBookmarksQuery, GetBookmarksQueryVariables>(GetBookmarksDocument, options);
        }
export type GetBookmarksQueryHookResult = ReturnType<typeof useGetBookmarksQuery>;
export type GetBookmarksLazyQueryHookResult = ReturnType<typeof useGetBookmarksLazyQuery>;
export type GetBookmarksSuspenseQueryHookResult = ReturnType<typeof useGetBookmarksSuspenseQuery>;
export type GetBookmarksQueryResult = Apollo.QueryResult<GetBookmarksQuery, GetBookmarksQueryVariables>;
export const GetFeedDocument = gql`
    query GetFeed($first: Int = 20, $after: String, $filter: FeedFilter) {
  getFeed(first: $first, after: $after, filter: $filter) {
    edges {
      cursor
      node {
        id
        entityType
        entityId
        verb
        visibility
        topics
        createdAt
        actor {
          id
          name
          username
          avatar
          createdAt
        }
        entity {
          __typename
          ... on Post {
            id
            userId
            content
            comments {
              id
              content
              createdAt
              user {
                id
                name
                avatar
              }
            }
            commentsCount
            reactions {
              id
              emoji
              userId
              createdAt
              user {
                id
                name
              }
            }
            reactionsCount
            createdAt
          }
          ... on Trip {
            id
            userId
            destination
            status
            createdAt
          }
          ... on Tour {
            id
            title
            category
            price
            createdAt
          }
          ... on Place {
            id
            name
            type
            location
            createdAt
          }
          ... on Location {
            id
            name
            country
            createdAt
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    `;

/**
 * __useGetFeedQuery__
 *
 * To run a query within a React component, call `useGetFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeedQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetFeedQuery(baseOptions?: Apollo.QueryHookOptions<GetFeedQuery, GetFeedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFeedQuery, GetFeedQueryVariables>(GetFeedDocument, options);
      }
export function useGetFeedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFeedQuery, GetFeedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFeedQuery, GetFeedQueryVariables>(GetFeedDocument, options);
        }
export function useGetFeedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFeedQuery, GetFeedQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFeedQuery, GetFeedQueryVariables>(GetFeedDocument, options);
        }
export type GetFeedQueryHookResult = ReturnType<typeof useGetFeedQuery>;
export type GetFeedLazyQueryHookResult = ReturnType<typeof useGetFeedLazyQuery>;
export type GetFeedSuspenseQueryHookResult = ReturnType<typeof useGetFeedSuspenseQuery>;
export type GetFeedQueryResult = Apollo.QueryResult<GetFeedQuery, GetFeedQueryVariables>;
export const GetFeedPreferencesDocument = gql`
    query GetFeedPreferences {
  getFeedPreferences {
    entityTypes
    topics
    followingOnly
    circleOnly
    mutedUserIds
  }
}
    `;

/**
 * __useGetFeedPreferencesQuery__
 *
 * To run a query within a React component, call `useGetFeedPreferencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeedPreferencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeedPreferencesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFeedPreferencesQuery(baseOptions?: Apollo.QueryHookOptions<GetFeedPreferencesQuery, GetFeedPreferencesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFeedPreferencesQuery, GetFeedPreferencesQueryVariables>(GetFeedPreferencesDocument, options);
      }
export function useGetFeedPreferencesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFeedPreferencesQuery, GetFeedPreferencesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFeedPreferencesQuery, GetFeedPreferencesQueryVariables>(GetFeedPreferencesDocument, options);
        }
export function useGetFeedPreferencesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFeedPreferencesQuery, GetFeedPreferencesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFeedPreferencesQuery, GetFeedPreferencesQueryVariables>(GetFeedPreferencesDocument, options);
        }
export type GetFeedPreferencesQueryHookResult = ReturnType<typeof useGetFeedPreferencesQuery>;
export type GetFeedPreferencesLazyQueryHookResult = ReturnType<typeof useGetFeedPreferencesLazyQuery>;
export type GetFeedPreferencesSuspenseQueryHookResult = ReturnType<typeof useGetFeedPreferencesSuspenseQuery>;
export type GetFeedPreferencesQueryResult = Apollo.QueryResult<GetFeedPreferencesQuery, GetFeedPreferencesQueryVariables>;
export const GetFollowersDocument = gql`
    query GetFollowers($userId: ID!) {
  getFollowers(userId: $userId) {
    id
    name
    username
    avatar
  }
}
    `;

/**
 * __useGetFollowersQuery__
 *
 * To run a query within a React component, call `useGetFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowersQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFollowersQuery(baseOptions: Apollo.QueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables> & ({ variables: GetFollowersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
      }
export function useGetFollowersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
        }
export function useGetFollowersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
        }
export type GetFollowersQueryHookResult = ReturnType<typeof useGetFollowersQuery>;
export type GetFollowersLazyQueryHookResult = ReturnType<typeof useGetFollowersLazyQuery>;
export type GetFollowersSuspenseQueryHookResult = ReturnType<typeof useGetFollowersSuspenseQuery>;
export type GetFollowersQueryResult = Apollo.QueryResult<GetFollowersQuery, GetFollowersQueryVariables>;
export const GetFollowingDocument = gql`
    query GetFollowing($userId: ID!) {
  getFollowing(userId: $userId) {
    id
    name
    username
    avatar
  }
}
    `;

/**
 * __useGetFollowingQuery__
 *
 * To run a query within a React component, call `useGetFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowingQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFollowingQuery(baseOptions: Apollo.QueryHookOptions<GetFollowingQuery, GetFollowingQueryVariables> & ({ variables: GetFollowingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowingQuery, GetFollowingQueryVariables>(GetFollowingDocument, options);
      }
export function useGetFollowingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowingQuery, GetFollowingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowingQuery, GetFollowingQueryVariables>(GetFollowingDocument, options);
        }
export function useGetFollowingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFollowingQuery, GetFollowingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFollowingQuery, GetFollowingQueryVariables>(GetFollowingDocument, options);
        }
export type GetFollowingQueryHookResult = ReturnType<typeof useGetFollowingQuery>;
export type GetFollowingLazyQueryHookResult = ReturnType<typeof useGetFollowingLazyQuery>;
export type GetFollowingSuspenseQueryHookResult = ReturnType<typeof useGetFollowingSuspenseQuery>;
export type GetFollowingQueryResult = Apollo.QueryResult<GetFollowingQuery, GetFollowingQueryVariables>;
export const GetLocationDocument = gql`
    query GetLocation($id: ID!) {
  getLocation(id: $id) {
    id
    name
    country
    description
    coordinates {
      latitude
      longitude
    }
    popularActivities
    averageCost
    bestTimeToVisit
    population
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetLocationQuery__
 *
 * To run a query within a React component, call `useGetLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLocationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLocationQuery(baseOptions: Apollo.QueryHookOptions<GetLocationQuery, GetLocationQueryVariables> & ({ variables: GetLocationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLocationQuery, GetLocationQueryVariables>(GetLocationDocument, options);
      }
export function useGetLocationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLocationQuery, GetLocationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLocationQuery, GetLocationQueryVariables>(GetLocationDocument, options);
        }
export function useGetLocationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLocationQuery, GetLocationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLocationQuery, GetLocationQueryVariables>(GetLocationDocument, options);
        }
export type GetLocationQueryHookResult = ReturnType<typeof useGetLocationQuery>;
export type GetLocationLazyQueryHookResult = ReturnType<typeof useGetLocationLazyQuery>;
export type GetLocationSuspenseQueryHookResult = ReturnType<typeof useGetLocationSuspenseQuery>;
export type GetLocationQueryResult = Apollo.QueryResult<GetLocationQuery, GetLocationQueryVariables>;
export const GetLocationsDocument = gql`
    query GetLocations($limit: Int) {
  getLocations(limit: $limit) {
    id
    name
    country
    description
    coordinates {
      latitude
      longitude
    }
    popularActivities
    averageCost
    bestTimeToVisit
    population
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetLocationsQuery__
 *
 * To run a query within a React component, call `useGetLocationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLocationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLocationsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetLocationsQuery(baseOptions?: Apollo.QueryHookOptions<GetLocationsQuery, GetLocationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLocationsQuery, GetLocationsQueryVariables>(GetLocationsDocument, options);
      }
export function useGetLocationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLocationsQuery, GetLocationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLocationsQuery, GetLocationsQueryVariables>(GetLocationsDocument, options);
        }
export function useGetLocationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLocationsQuery, GetLocationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLocationsQuery, GetLocationsQueryVariables>(GetLocationsDocument, options);
        }
export type GetLocationsQueryHookResult = ReturnType<typeof useGetLocationsQuery>;
export type GetLocationsLazyQueryHookResult = ReturnType<typeof useGetLocationsLazyQuery>;
export type GetLocationsSuspenseQueryHookResult = ReturnType<typeof useGetLocationsSuspenseQuery>;
export type GetLocationsQueryResult = Apollo.QueryResult<GetLocationsQuery, GetLocationsQueryVariables>;
export const GetMessagesDocument = gql`
    query GetMessages {
  getMessages {
    id
    content
    createdAt
  }
}
    `;

/**
 * __useGetMessagesQuery__
 *
 * To run a query within a React component, call `useGetMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMessagesQuery(baseOptions?: Apollo.QueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
      }
export function useGetMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
        }
export function useGetMessagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
        }
export type GetMessagesQueryHookResult = ReturnType<typeof useGetMessagesQuery>;
export type GetMessagesLazyQueryHookResult = ReturnType<typeof useGetMessagesLazyQuery>;
export type GetMessagesSuspenseQueryHookResult = ReturnType<typeof useGetMessagesSuspenseQuery>;
export type GetMessagesQueryResult = Apollo.QueryResult<GetMessagesQuery, GetMessagesQueryVariables>;
export const GetMyDevicesDocument = gql`
    query GetMyDevices {
  getMyDevices {
    id
    deviceId
    publicKey
    type
    lastSeen
    createdAt
  }
}
    `;

/**
 * __useGetMyDevicesQuery__
 *
 * To run a query within a React component, call `useGetMyDevicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyDevicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyDevicesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyDevicesQuery(baseOptions?: Apollo.QueryHookOptions<GetMyDevicesQuery, GetMyDevicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyDevicesQuery, GetMyDevicesQueryVariables>(GetMyDevicesDocument, options);
      }
export function useGetMyDevicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyDevicesQuery, GetMyDevicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyDevicesQuery, GetMyDevicesQueryVariables>(GetMyDevicesDocument, options);
        }
export function useGetMyDevicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyDevicesQuery, GetMyDevicesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyDevicesQuery, GetMyDevicesQueryVariables>(GetMyDevicesDocument, options);
        }
export type GetMyDevicesQueryHookResult = ReturnType<typeof useGetMyDevicesQuery>;
export type GetMyDevicesLazyQueryHookResult = ReturnType<typeof useGetMyDevicesLazyQuery>;
export type GetMyDevicesSuspenseQueryHookResult = ReturnType<typeof useGetMyDevicesSuspenseQuery>;
export type GetMyDevicesQueryResult = Apollo.QueryResult<GetMyDevicesQuery, GetMyDevicesQueryVariables>;
export const GetPlaceDocument = gql`
    query GetPlace($id: ID!) {
  getPlace(id: $id) {
    id
    name
    location
    distance
    rating
    reviews
    type
    isOpen
    description
    tips
    coordinates {
      latitude
      longitude
    }
    phone
    website
    hours
    price
    locationId
    ownerId
    imageUrl
    createdAt
  }
}
    `;

/**
 * __useGetPlaceQuery__
 *
 * To run a query within a React component, call `useGetPlaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlaceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPlaceQuery(baseOptions: Apollo.QueryHookOptions<GetPlaceQuery, GetPlaceQueryVariables> & ({ variables: GetPlaceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPlaceQuery, GetPlaceQueryVariables>(GetPlaceDocument, options);
      }
export function useGetPlaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlaceQuery, GetPlaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPlaceQuery, GetPlaceQueryVariables>(GetPlaceDocument, options);
        }
export function useGetPlaceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPlaceQuery, GetPlaceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPlaceQuery, GetPlaceQueryVariables>(GetPlaceDocument, options);
        }
export type GetPlaceQueryHookResult = ReturnType<typeof useGetPlaceQuery>;
export type GetPlaceLazyQueryHookResult = ReturnType<typeof useGetPlaceLazyQuery>;
export type GetPlaceSuspenseQueryHookResult = ReturnType<typeof useGetPlaceSuspenseQuery>;
export type GetPlaceQueryResult = Apollo.QueryResult<GetPlaceQuery, GetPlaceQueryVariables>;
export const GetPlacesDocument = gql`
    query GetPlaces($category: String, $limit: Int) {
  getPlaces(category: $category, limit: $limit) {
    id
    name
    location
    distance
    rating
    reviews
    type
    isOpen
    description
    tips
    coordinates {
      latitude
      longitude
    }
    phone
    website
    hours
    price
    locationId
    ownerId
    imageUrl
    createdAt
  }
}
    `;

/**
 * __useGetPlacesQuery__
 *
 * To run a query within a React component, call `useGetPlacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlacesQuery({
 *   variables: {
 *      category: // value for 'category'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetPlacesQuery(baseOptions?: Apollo.QueryHookOptions<GetPlacesQuery, GetPlacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPlacesQuery, GetPlacesQueryVariables>(GetPlacesDocument, options);
      }
export function useGetPlacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlacesQuery, GetPlacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPlacesQuery, GetPlacesQueryVariables>(GetPlacesDocument, options);
        }
export function useGetPlacesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPlacesQuery, GetPlacesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPlacesQuery, GetPlacesQueryVariables>(GetPlacesDocument, options);
        }
export type GetPlacesQueryHookResult = ReturnType<typeof useGetPlacesQuery>;
export type GetPlacesLazyQueryHookResult = ReturnType<typeof useGetPlacesLazyQuery>;
export type GetPlacesSuspenseQueryHookResult = ReturnType<typeof useGetPlacesSuspenseQuery>;
export type GetPlacesQueryResult = Apollo.QueryResult<GetPlacesQuery, GetPlacesQueryVariables>;
export const GetPostDocument = gql`
    query GetPost($id: ID!) {
  getPost(id: $id) {
    id
    userId
    user {
      id
      name
      username
      avatar
    }
    content
    attachments
    type
    relatedId
    relatedEntity {
      ... on Trip {
        id
        destination
        startDate
        endDate
        preferences
        tripCoordinates: coordinates {
          latitude
          longitude
        }
      }
      ... on Tour {
        id
        title
        location
        price
        rating
        tourDescription: description
        imageUrl
        tourCoordinates: coordinates {
          latitude
          longitude
        }
      }
      ... on Place {
        id
        name
        location
        placeDescription: description
        imageUrl
        placeCoordinates: coordinates {
          latitude
          longitude
        }
      }
    }
    comments {
      id
      userId
      user {
        id
        name
        username
        avatar
      }
      content
      createdAt
    }
    commentsCount
    reactions {
      id
      userId
      user {
        id
        name
        username
      }
      emoji
      createdAt
    }
    reactionsCount
    isBookmarked
    createdAt
  }
}
    `;

/**
 * __useGetPostQuery__
 *
 * To run a query within a React component, call `useGetPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPostQuery(baseOptions: Apollo.QueryHookOptions<GetPostQuery, GetPostQueryVariables> & ({ variables: GetPostQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
      }
export function useGetPostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
        }
export function useGetPostSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
        }
export type GetPostQueryHookResult = ReturnType<typeof useGetPostQuery>;
export type GetPostLazyQueryHookResult = ReturnType<typeof useGetPostLazyQuery>;
export type GetPostSuspenseQueryHookResult = ReturnType<typeof useGetPostSuspenseQuery>;
export type GetPostQueryResult = Apollo.QueryResult<GetPostQuery, GetPostQueryVariables>;
export const GetPostsDocument = gql`
    query GetPosts($type: String, $limit: Int, $offset: Int, $after: String, $before: String) {
  getPosts(
    type: $type
    limit: $limit
    offset: $offset
    after: $after
    before: $before
  ) {
    posts {
      id
      userId
      user {
        id
        name
        username
        avatar
        createdAt
      }
      content
      attachments
      type
      relatedId
      relatedEntity {
        ... on Trip {
          id
          destination
          startDate
          endDate
          preferences
          tripCoordinates: coordinates {
            latitude
            longitude
          }
        }
        ... on Tour {
          id
          title
          location
          price
          rating
          tourDescription: description
          imageUrl
          tourCoordinates: coordinates {
            latitude
            longitude
          }
        }
        ... on Place {
          id
          name
          location
          placeDescription: description
          imageUrl
          placeCoordinates: coordinates {
            latitude
            longitude
          }
        }
      }
      comments {
        id
        userId
        user {
          id
          name
          username
          avatar
        }
        content
        createdAt
      }
      commentsCount
      reactions {
        id
        userId
        user {
          id
          name
          username
        }
        emoji
        createdAt
      }
      reactionsCount
      isBookmarked
      createdAt
    }
    totalCount
    hasNextPage
    hasPreviousPage
    nextOffset
    previousOffset
  }
}
    `;

/**
 * __useGetPostsQuery__
 *
 * To run a query within a React component, call `useGetPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsQuery({
 *   variables: {
 *      type: // value for 'type'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useGetPostsQuery(baseOptions?: Apollo.QueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
      }
export function useGetPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
        }
export function useGetPostsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
        }
export type GetPostsQueryHookResult = ReturnType<typeof useGetPostsQuery>;
export type GetPostsLazyQueryHookResult = ReturnType<typeof useGetPostsLazyQuery>;
export type GetPostsSuspenseQueryHookResult = ReturnType<typeof useGetPostsSuspenseQuery>;
export type GetPostsQueryResult = Apollo.QueryResult<GetPostsQuery, GetPostsQueryVariables>;
export const GetTourDocument = gql`
    query GetTour($id: ID!) {
  getTour(id: $id) {
    id
    title
    location
    price
    rating
    reviews
    duration
    durationType
    category
    description
    shortDescription
    highlights
    inclusions
    maxParticipants
    minParticipants
    difficulty
    currency
    coordinates {
      latitude
      longitude
    }
    imageUrl
    gallery
    tags
    isActive
    isFeatured
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetTourQuery__
 *
 * To run a query within a React component, call `useGetTourQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTourQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTourQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTourQuery(baseOptions: Apollo.QueryHookOptions<GetTourQuery, GetTourQueryVariables> & ({ variables: GetTourQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTourQuery, GetTourQueryVariables>(GetTourDocument, options);
      }
export function useGetTourLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTourQuery, GetTourQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTourQuery, GetTourQueryVariables>(GetTourDocument, options);
        }
export function useGetTourSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTourQuery, GetTourQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTourQuery, GetTourQueryVariables>(GetTourDocument, options);
        }
export type GetTourQueryHookResult = ReturnType<typeof useGetTourQuery>;
export type GetTourLazyQueryHookResult = ReturnType<typeof useGetTourLazyQuery>;
export type GetTourSuspenseQueryHookResult = ReturnType<typeof useGetTourSuspenseQuery>;
export type GetTourQueryResult = Apollo.QueryResult<GetTourQuery, GetTourQueryVariables>;
export const GetToursDocument = gql`
    query GetTours($category: String, $limit: Int) {
  getTours(category: $category, limit: $limit) {
    id
    title
    location
    price
    rating
    reviews
    duration
    durationType
    category
    description
    shortDescription
    highlights
    inclusions
    maxParticipants
    minParticipants
    difficulty
    currency
    coordinates {
      latitude
      longitude
    }
    imageUrl
    gallery
    tags
    isActive
    isFeatured
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetToursQuery__
 *
 * To run a query within a React component, call `useGetToursQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetToursQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetToursQuery({
 *   variables: {
 *      category: // value for 'category'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetToursQuery(baseOptions?: Apollo.QueryHookOptions<GetToursQuery, GetToursQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetToursQuery, GetToursQueryVariables>(GetToursDocument, options);
      }
export function useGetToursLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetToursQuery, GetToursQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetToursQuery, GetToursQueryVariables>(GetToursDocument, options);
        }
export function useGetToursSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetToursQuery, GetToursQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetToursQuery, GetToursQueryVariables>(GetToursDocument, options);
        }
export type GetToursQueryHookResult = ReturnType<typeof useGetToursQuery>;
export type GetToursLazyQueryHookResult = ReturnType<typeof useGetToursLazyQuery>;
export type GetToursSuspenseQueryHookResult = ReturnType<typeof useGetToursSuspenseQuery>;
export type GetToursQueryResult = Apollo.QueryResult<GetToursQuery, GetToursQueryVariables>;
export const GetTrendingDocument = gql`
    query GetTrending($type: TrendingType!, $window: TimeWindow!, $entityTypes: [EntityType!], $limit: Int = 10) {
  getTrending(
    type: $type
    window: $window
    entityTypes: $entityTypes
    limit: $limit
  ) {
    window
    items {
      key
      label
      score
      delta
    }
  }
}
    `;

/**
 * __useGetTrendingQuery__
 *
 * To run a query within a React component, call `useGetTrendingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrendingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrendingQuery({
 *   variables: {
 *      type: // value for 'type'
 *      window: // value for 'window'
 *      entityTypes: // value for 'entityTypes'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetTrendingQuery(baseOptions: Apollo.QueryHookOptions<GetTrendingQuery, GetTrendingQueryVariables> & ({ variables: GetTrendingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTrendingQuery, GetTrendingQueryVariables>(GetTrendingDocument, options);
      }
export function useGetTrendingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTrendingQuery, GetTrendingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTrendingQuery, GetTrendingQueryVariables>(GetTrendingDocument, options);
        }
export function useGetTrendingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTrendingQuery, GetTrendingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTrendingQuery, GetTrendingQueryVariables>(GetTrendingDocument, options);
        }
export type GetTrendingQueryHookResult = ReturnType<typeof useGetTrendingQuery>;
export type GetTrendingLazyQueryHookResult = ReturnType<typeof useGetTrendingLazyQuery>;
export type GetTrendingSuspenseQueryHookResult = ReturnType<typeof useGetTrendingSuspenseQuery>;
export type GetTrendingQueryResult = Apollo.QueryResult<GetTrendingQuery, GetTrendingQueryVariables>;
export const GetTripDocument = gql`
    query GetTrip($id: ID!) {
  getTrip(id: $id) {
    id
    destination
    startDate
    endDate
    status
    travelers
    preferences
    accommodation
    aiReasoning
    itinerary {
      day
      title
      activities
    }
    coordinates {
      latitude
      longitude
    }
    waypoints {
      latitude
      longitude
      label
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetTripQuery__
 *
 * To run a query within a React component, call `useGetTripQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTripQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTripQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTripQuery(baseOptions: Apollo.QueryHookOptions<GetTripQuery, GetTripQueryVariables> & ({ variables: GetTripQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTripQuery, GetTripQueryVariables>(GetTripDocument, options);
      }
export function useGetTripLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTripQuery, GetTripQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTripQuery, GetTripQueryVariables>(GetTripDocument, options);
        }
export function useGetTripSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTripQuery, GetTripQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTripQuery, GetTripQueryVariables>(GetTripDocument, options);
        }
export type GetTripQueryHookResult = ReturnType<typeof useGetTripQuery>;
export type GetTripLazyQueryHookResult = ReturnType<typeof useGetTripLazyQuery>;
export type GetTripSuspenseQueryHookResult = ReturnType<typeof useGetTripSuspenseQuery>;
export type GetTripQueryResult = Apollo.QueryResult<GetTripQuery, GetTripQueryVariables>;
export const GetTripsDocument = gql`
    query GetTrips($status: String) {
  getTrips(status: $status) {
    id
    destination
    startDate
    endDate
    status
    travelers
    preferences
    budget
    accommodation
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetTripsQuery__
 *
 * To run a query within a React component, call `useGetTripsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTripsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTripsQuery({
 *   variables: {
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetTripsQuery(baseOptions?: Apollo.QueryHookOptions<GetTripsQuery, GetTripsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTripsQuery, GetTripsQueryVariables>(GetTripsDocument, options);
      }
export function useGetTripsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTripsQuery, GetTripsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTripsQuery, GetTripsQueryVariables>(GetTripsDocument, options);
        }
export function useGetTripsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTripsQuery, GetTripsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTripsQuery, GetTripsQueryVariables>(GetTripsDocument, options);
        }
export type GetTripsQueryHookResult = ReturnType<typeof useGetTripsQuery>;
export type GetTripsLazyQueryHookResult = ReturnType<typeof useGetTripsLazyQuery>;
export type GetTripsSuspenseQueryHookResult = ReturnType<typeof useGetTripsSuspenseQuery>;
export type GetTripsQueryResult = Apollo.QueryResult<GetTripsQuery, GetTripsQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    username
    avatar
    createdAt
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const IsFollowingDocument = gql`
    query IsFollowing($userId: ID!) {
  isFollowing(userId: $userId)
}
    `;

/**
 * __useIsFollowingQuery__
 *
 * To run a query within a React component, call `useIsFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsFollowingQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useIsFollowingQuery(baseOptions: Apollo.QueryHookOptions<IsFollowingQuery, IsFollowingQueryVariables> & ({ variables: IsFollowingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsFollowingQuery, IsFollowingQueryVariables>(IsFollowingDocument, options);
      }
export function useIsFollowingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsFollowingQuery, IsFollowingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsFollowingQuery, IsFollowingQueryVariables>(IsFollowingDocument, options);
        }
export function useIsFollowingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<IsFollowingQuery, IsFollowingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<IsFollowingQuery, IsFollowingQueryVariables>(IsFollowingDocument, options);
        }
export type IsFollowingQueryHookResult = ReturnType<typeof useIsFollowingQuery>;
export type IsFollowingLazyQueryHookResult = ReturnType<typeof useIsFollowingLazyQuery>;
export type IsFollowingSuspenseQueryHookResult = ReturnType<typeof useIsFollowingSuspenseQuery>;
export type IsFollowingQueryResult = Apollo.QueryResult<IsFollowingQuery, IsFollowingQueryVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $signature: String!, $deviceId: String!, $publicKey: String) {
  loginUser(
    username: $username
    signature: $signature
    deviceId: $deviceId
    publicKey: $publicKey
  ) {
    user {
      id
      name
      username
      createdAt
    }
    token
  }
}
    `;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      signature: // value for 'signature'
 *      deviceId: // value for 'deviceId'
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LoginUserDocument = gql`
    mutation LoginUser($username: String!, $signature: String!, $deviceId: String!, $publicKey: String) {
  loginUser(
    username: $username
    signature: $signature
    deviceId: $deviceId
    publicKey: $publicKey
  ) {
    user {
      id
      name
      username
      createdAt
    }
    token
  }
}
    `;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *      signature: // value for 'signature'
 *      deviceId: // value for 'deviceId'
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    name
    username
    email
    phone
    avatar
    publicKey
    createdAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const NewAlertsDocument = gql`
    subscription NewAlerts {
  newAlerts {
    id
    type
    title
    message
    step
    totalSteps
    tripId
    userId
    read
    createdAt
  }
}
    `;

/**
 * __useNewAlertsSubscription__
 *
 * To run a query within a React component, call `useNewAlertsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewAlertsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewAlertsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewAlertsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewAlertsSubscription, NewAlertsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewAlertsSubscription, NewAlertsSubscriptionVariables>(NewAlertsDocument, options);
      }
export type NewAlertsSubscriptionHookResult = ReturnType<typeof useNewAlertsSubscription>;
export type NewAlertsSubscriptionResult = Apollo.SubscriptionResult<NewAlertsSubscription>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $publicKey: String!, $signature: String!, $deviceId: String!) {
  registerUser(
    username: $username
    publicKey: $publicKey
    signature: $signature
    deviceId: $deviceId
  ) {
    user {
      id
      name
      username
      createdAt
    }
    token
  }
}
    `;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      publicKey: // value for 'publicKey'
 *      signature: // value for 'signature'
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const RegisterUserDocument = gql`
    mutation RegisterUser($username: String!, $publicKey: String!, $signature: String!, $deviceId: String!) {
  registerUser(
    username: $username
    publicKey: $publicKey
    signature: $signature
    deviceId: $deviceId
  ) {
    user {
      id
      name
      username
      createdAt
    }
    token
  }
}
    `;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *      publicKey: // value for 'publicKey'
 *      signature: // value for 'signature'
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const RequestChallengeDocument = gql`
    mutation RequestChallenge($username: String!, $isRegister: Boolean!) {
  requestChallenge(username: $username, isRegister: $isRegister)
}
    `;

/**
 * __useRequestChallengeMutation__
 *
 * To run a mutation, you first call `useRequestChallengeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestChallengeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestChallengeMutation, { data, loading, error }] = useRequestChallengeMutation({
 *   variables: {
 *      username: // value for 'username'
 *      isRegister: // value for 'isRegister'
 *   },
 * });
 */
export function useRequestChallengeMutation(baseOptions?: Apollo.MutationHookOptions<RequestChallengeMutation, RequestChallengeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestChallengeMutation, RequestChallengeMutationVariables>(RequestChallengeDocument, options);
      }
export type RequestChallengeMutationHookResult = ReturnType<typeof useRequestChallengeMutation>;
export type RequestChallengeMutationResult = Apollo.MutationResult<RequestChallengeMutation>;
export type RequestChallengeMutationOptions = Apollo.BaseMutationOptions<RequestChallengeMutation, RequestChallengeMutationVariables>;
export const RevokeDeviceDocument = gql`
    mutation RevokeDevice($deviceId: String!) {
  revokeDevice(deviceId: $deviceId)
}
    `;

/**
 * __useRevokeDeviceMutation__
 *
 * To run a mutation, you first call `useRevokeDeviceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeDeviceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeDeviceMutation, { data, loading, error }] = useRevokeDeviceMutation({
 *   variables: {
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useRevokeDeviceMutation(baseOptions?: Apollo.MutationHookOptions<RevokeDeviceMutation, RevokeDeviceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RevokeDeviceMutation, RevokeDeviceMutationVariables>(RevokeDeviceDocument, options);
      }
export type RevokeDeviceMutationHookResult = ReturnType<typeof useRevokeDeviceMutation>;
export type RevokeDeviceMutationResult = Apollo.MutationResult<RevokeDeviceMutation>;
export type RevokeDeviceMutationOptions = Apollo.BaseMutationOptions<RevokeDeviceMutation, RevokeDeviceMutationVariables>;
export const SearchDocument = gql`
    query Search($query: String!, $entityTypes: [EntityType!], $topics: [String!], $first: Int = 20, $after: String) {
  search(
    query: $query
    entityTypes: $entityTypes
    topics: $topics
    first: $first
    after: $after
  ) {
    edges {
      cursor
      node {
        id
        entityType
        entityId
        verb
        createdAt
        visibility
        topics
        actor {
          id
          username
          name
          avatar
        }
        entity {
          __typename
          ... on Post {
            id
            userId
            content
            createdAt
          }
          ... on Trip {
            id
            userId
            destination
            status
            createdAt
          }
          ... on Tour {
            id
            title
            category
            price
            createdAt
          }
          ... on Place {
            id
            name
            type
            location
            createdAt
          }
          ... on Location {
            id
            name
            country
            createdAt
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    `;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *      entityTypes: // value for 'entityTypes'
 *      topics: // value for 'topics'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables> & ({ variables: SearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export function useSearchSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchSuspenseQueryHookResult = ReturnType<typeof useSearchSuspenseQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
export const SearchSemanticDocument = gql`
    query SearchSemantic($query: String!, $entityTypes: [EntityType!], $first: Int = 20, $after: String) {
  searchSemantic(
    query: $query
    entityTypes: $entityTypes
    first: $first
    after: $after
  ) {
    edges {
      cursor
      node {
        id
        entityType
        entityId
        verb
        createdAt
        visibility
        topics
        actor {
          id
          username
          name
          avatar
        }
        entity {
          __typename
          ... on Post {
            id
            userId
            content
            createdAt
          }
          ... on Trip {
            id
            userId
            destination
            status
            createdAt
          }
          ... on Tour {
            id
            title
            category
            price
            createdAt
          }
          ... on Place {
            id
            name
            type
            location
            createdAt
          }
          ... on Location {
            id
            name
            country
            createdAt
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    `;

/**
 * __useSearchSemanticQuery__
 *
 * To run a query within a React component, call `useSearchSemanticQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSemanticQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSemanticQuery({
 *   variables: {
 *      query: // value for 'query'
 *      entityTypes: // value for 'entityTypes'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useSearchSemanticQuery(baseOptions: Apollo.QueryHookOptions<SearchSemanticQuery, SearchSemanticQueryVariables> & ({ variables: SearchSemanticQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchSemanticQuery, SearchSemanticQueryVariables>(SearchSemanticDocument, options);
      }
export function useSearchSemanticLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchSemanticQuery, SearchSemanticQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchSemanticQuery, SearchSemanticQueryVariables>(SearchSemanticDocument, options);
        }
export function useSearchSemanticSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchSemanticQuery, SearchSemanticQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchSemanticQuery, SearchSemanticQueryVariables>(SearchSemanticDocument, options);
        }
export type SearchSemanticQueryHookResult = ReturnType<typeof useSearchSemanticQuery>;
export type SearchSemanticLazyQueryHookResult = ReturnType<typeof useSearchSemanticLazyQuery>;
export type SearchSemanticSuspenseQueryHookResult = ReturnType<typeof useSearchSemanticSuspenseQuery>;
export type SearchSemanticQueryResult = Apollo.QueryResult<SearchSemanticQuery, SearchSemanticQueryVariables>;
export const SearchSuggestDocument = gql`
    query SearchSuggest($prefix: String!, $limit: Int = 10) {
  searchSuggest(prefix: $prefix, limit: $limit)
}
    `;

/**
 * __useSearchSuggestQuery__
 *
 * To run a query within a React component, call `useSearchSuggestQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSuggestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSuggestQuery({
 *   variables: {
 *      prefix: // value for 'prefix'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchSuggestQuery(baseOptions: Apollo.QueryHookOptions<SearchSuggestQuery, SearchSuggestQueryVariables> & ({ variables: SearchSuggestQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchSuggestQuery, SearchSuggestQueryVariables>(SearchSuggestDocument, options);
      }
export function useSearchSuggestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchSuggestQuery, SearchSuggestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchSuggestQuery, SearchSuggestQueryVariables>(SearchSuggestDocument, options);
        }
export function useSearchSuggestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchSuggestQuery, SearchSuggestQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchSuggestQuery, SearchSuggestQueryVariables>(SearchSuggestDocument, options);
        }
export type SearchSuggestQueryHookResult = ReturnType<typeof useSearchSuggestQuery>;
export type SearchSuggestLazyQueryHookResult = ReturnType<typeof useSearchSuggestLazyQuery>;
export type SearchSuggestSuspenseQueryHookResult = ReturnType<typeof useSearchSuggestSuspenseQuery>;
export type SearchSuggestQueryResult = Apollo.QueryResult<SearchSuggestQuery, SearchSuggestQueryVariables>;
export const TripUpdatesDocument = gql`
    subscription TripUpdates($tripId: ID!) {
  tripUpdates(tripId: $tripId) {
    id
    tripId
    type
    title
    message
    step
    totalSteps
    status
    data
    createdAt
  }
}
    `;

/**
 * __useTripUpdatesSubscription__
 *
 * To run a query within a React component, call `useTripUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTripUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTripUpdatesSubscription({
 *   variables: {
 *      tripId: // value for 'tripId'
 *   },
 * });
 */
export function useTripUpdatesSubscription(baseOptions: Apollo.SubscriptionHookOptions<TripUpdatesSubscription, TripUpdatesSubscriptionVariables> & ({ variables: TripUpdatesSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TripUpdatesSubscription, TripUpdatesSubscriptionVariables>(TripUpdatesDocument, options);
      }
export type TripUpdatesSubscriptionHookResult = ReturnType<typeof useTripUpdatesSubscription>;
export type TripUpdatesSubscriptionResult = Apollo.SubscriptionResult<TripUpdatesSubscription>;
export const UnfollowUserDocument = gql`
    mutation UnfollowUser($followeeId: ID!) {
  unfollowUser(followeeId: $followeeId)
}
    `;

/**
 * __useUnfollowUserMutation__
 *
 * To run a mutation, you first call `useUnfollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfollowUserMutation, { data, loading, error }] = useUnfollowUserMutation({
 *   variables: {
 *      followeeId: // value for 'followeeId'
 *   },
 * });
 */
export function useUnfollowUserMutation(baseOptions?: Apollo.MutationHookOptions<UnfollowUserMutation, UnfollowUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnfollowUserMutation, UnfollowUserMutationVariables>(UnfollowUserDocument, options);
      }
export type UnfollowUserMutationHookResult = ReturnType<typeof useUnfollowUserMutation>;
export type UnfollowUserMutationResult = Apollo.MutationResult<UnfollowUserMutation>;
export type UnfollowUserMutationOptions = Apollo.BaseMutationOptions<UnfollowUserMutation, UnfollowUserMutationVariables>;
export const UpdateFeedPreferencesDocument = gql`
    mutation UpdateFeedPreferences($input: FeedFilter!) {
  updateFeedPreferences(input: $input) {
    entityTypes
    topics
    followingOnly
    circleOnly
    mutedUserIds
  }
}
    `;

/**
 * __useUpdateFeedPreferencesMutation__
 *
 * To run a mutation, you first call `useUpdateFeedPreferencesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFeedPreferencesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFeedPreferencesMutation, { data, loading, error }] = useUpdateFeedPreferencesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateFeedPreferencesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFeedPreferencesMutation, UpdateFeedPreferencesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFeedPreferencesMutation, UpdateFeedPreferencesMutationVariables>(UpdateFeedPreferencesDocument, options);
      }
export type UpdateFeedPreferencesMutationHookResult = ReturnType<typeof useUpdateFeedPreferencesMutation>;
export type UpdateFeedPreferencesMutationResult = Apollo.MutationResult<UpdateFeedPreferencesMutation>;
export type UpdateFeedPreferencesMutationOptions = Apollo.BaseMutationOptions<UpdateFeedPreferencesMutation, UpdateFeedPreferencesMutationVariables>;
export const UpdateLocationDocument = gql`
    mutation UpdateLocation($id: ID!, $input: UpdateLocationInput!) {
  updateLocation(id: $id, input: $input) {
    id
    name
    country
    description
    coordinates {
      latitude
      longitude
    }
    popularActivities
    averageCost
    bestTimeToVisit
    population
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useUpdateLocationMutation__
 *
 * To run a mutation, you first call `useUpdateLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationMutation, { data, loading, error }] = useUpdateLocationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLocationMutation, UpdateLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLocationMutation, UpdateLocationMutationVariables>(UpdateLocationDocument, options);
      }
export type UpdateLocationMutationHookResult = ReturnType<typeof useUpdateLocationMutation>;
export type UpdateLocationMutationResult = Apollo.MutationResult<UpdateLocationMutation>;
export type UpdateLocationMutationOptions = Apollo.BaseMutationOptions<UpdateLocationMutation, UpdateLocationMutationVariables>;
export const UpdatePlaceDocument = gql`
    mutation UpdatePlace($id: ID!, $input: UpdatePlaceInput!) {
  updatePlace(id: $id, input: $input) {
    id
    name
    location
    distance
    rating
    reviews
    type
    isOpen
    description
    tips
    coordinates {
      latitude
      longitude
    }
    phone
    website
    hours
    price
    locationId
    ownerId
    imageUrl
    createdAt
  }
}
    `;

/**
 * __useUpdatePlaceMutation__
 *
 * To run a mutation, you first call `useUpdatePlaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePlaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePlaceMutation, { data, loading, error }] = useUpdatePlaceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePlaceMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePlaceMutation, UpdatePlaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePlaceMutation, UpdatePlaceMutationVariables>(UpdatePlaceDocument, options);
      }
export type UpdatePlaceMutationHookResult = ReturnType<typeof useUpdatePlaceMutation>;
export type UpdatePlaceMutationResult = Apollo.MutationResult<UpdatePlaceMutation>;
export type UpdatePlaceMutationOptions = Apollo.BaseMutationOptions<UpdatePlaceMutation, UpdatePlaceMutationVariables>;
export const UpdateTourDocument = gql`
    mutation UpdateTour($id: ID!, $input: UpdateTourInput!) {
  updateTour(id: $id, input: $input) {
    id
    title
    location
    price
    rating
    reviews
    duration
    durationType
    category
    description
    shortDescription
    highlights
    inclusions
    maxParticipants
    minParticipants
    difficulty
    currency
    coordinates {
      latitude
      longitude
    }
    imageUrl
    gallery
    tags
    isActive
    isFeatured
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useUpdateTourMutation__
 *
 * To run a mutation, you first call `useUpdateTourMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTourMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTourMutation, { data, loading, error }] = useUpdateTourMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTourMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTourMutation, UpdateTourMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTourMutation, UpdateTourMutationVariables>(UpdateTourDocument, options);
      }
export type UpdateTourMutationHookResult = ReturnType<typeof useUpdateTourMutation>;
export type UpdateTourMutationResult = Apollo.MutationResult<UpdateTourMutation>;
export type UpdateTourMutationOptions = Apollo.BaseMutationOptions<UpdateTourMutation, UpdateTourMutationVariables>;
export const UpdateTripDocument = gql`
    mutation UpdateTrip($id: ID!, $input: UpdateTripInput!) {
  updateTrip(id: $id, input: $input) {
    id
    destination
    startDate
    endDate
    status
    travelers
    preferences
    accommodation
    aiReasoning
    itinerary {
      day
      title
      activities
    }
    coordinates {
      latitude
      longitude
    }
    waypoints {
      latitude
      longitude
      label
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useUpdateTripMutation__
 *
 * To run a mutation, you first call `useUpdateTripMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTripMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTripMutation, { data, loading, error }] = useUpdateTripMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTripMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTripMutation, UpdateTripMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTripMutation, UpdateTripMutationVariables>(UpdateTripDocument, options);
      }
export type UpdateTripMutationHookResult = ReturnType<typeof useUpdateTripMutation>;
export type UpdateTripMutationResult = Apollo.MutationResult<UpdateTripMutation>;
export type UpdateTripMutationOptions = Apollo.BaseMutationOptions<UpdateTripMutation, UpdateTripMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    name
    username
    avatar
    publicKey
    createdAt
  }
}
    `;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;