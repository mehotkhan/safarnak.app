export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Alert = {
  __typename?: 'Alert';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  read?: Maybe<Scalars['Boolean']['output']>;
  step?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  totalSteps?: Maybe<Scalars['Int']['output']>;
  tripId?: Maybe<Scalars['ID']['output']>;
  type: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type BookTourInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  participants: Scalars['Int']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  selectedDate: Scalars['String']['input'];
  specialRequests?: InputMaybe<Scalars['String']['input']>;
  tourId: Scalars['ID']['input'];
};

export type Booking = {
  __typename?: 'Booking';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  participants: Scalars['Int']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  selectedDate: Scalars['String']['output'];
  specialRequests?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalPrice: Scalars['Float']['output'];
  tourId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type Bookmark = {
  __typename?: 'Bookmark';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  place?: Maybe<Place>;
  placeId?: Maybe<Scalars['ID']['output']>;
  post?: Maybe<Post>;
  postId?: Maybe<Scalars['ID']['output']>;
  tour?: Maybe<Tour>;
  tourId?: Maybe<Scalars['ID']['output']>;
  userId: Scalars['ID']['output'];
};

export type Comment = {
  __typename?: 'Comment';
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  postId: Scalars['ID']['output'];
  user: User;
  userId: Scalars['ID']['output'];
};

export type Coordinates = {
  __typename?: 'Coordinates';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type CoordinatesInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type CreateLocationInput = {
  averageCost?: InputMaybe<Scalars['Float']['input']>;
  bestTimeToVisit?: InputMaybe<Scalars['String']['input']>;
  coordinates: CoordinatesInput;
  country: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  popularActivities?: InputMaybe<Array<Scalars['String']['input']>>;
  population?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePlaceInput = {
  coordinates: CoordinatesInput;
  description: Scalars['String']['input'];
  distance?: InputMaybe<Scalars['Float']['input']>;
  hours?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  location: Scalars['String']['input'];
  locationId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  tips?: InputMaybe<Array<Scalars['String']['input']>>;
  type: Scalars['String']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePostInput = {
  attachments?: InputMaybe<Array<Scalars['String']['input']>>;
  content?: InputMaybe<Scalars['String']['input']>;
  relatedId?: InputMaybe<Scalars['ID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTourInput = {
  category: Scalars['String']['input'];
  coordinates?: InputMaybe<CoordinatesInput>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  difficulty?: InputMaybe<Scalars['String']['input']>;
  duration: Scalars['Int']['input'];
  durationType?: InputMaybe<Scalars['String']['input']>;
  gallery?: InputMaybe<Array<Scalars['String']['input']>>;
  highlights?: InputMaybe<Array<Scalars['String']['input']>>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  inclusions?: InputMaybe<Array<Scalars['String']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  location: Scalars['String']['input'];
  maxParticipants?: InputMaybe<Scalars['Int']['input']>;
  minParticipants?: InputMaybe<Scalars['Int']['input']>;
  price: Scalars['Float']['input'];
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

export type CreateTripInput = {
  accommodation?: InputMaybe<Scalars['String']['input']>;
  budget?: InputMaybe<Scalars['Float']['input']>;
  destination?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  preferences?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  travelers: Scalars['Int']['input'];
};

export type Device = {
  __typename?: 'Device';
  createdAt: Scalars['String']['output'];
  deviceId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastSeen: Scalars['String']['output'];
  publicKey: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type ItineraryDay = {
  __typename?: 'ItineraryDay';
  activities: Array<Scalars['String']['output']>;
  day: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type Location = {
  __typename?: 'Location';
  averageCost?: Maybe<Scalars['Float']['output']>;
  bestTimeToVisit?: Maybe<Scalars['String']['output']>;
  coordinates: Coordinates;
  country: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  popularActivities: Array<Scalars['String']['output']>;
  population?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMessage: Message;
  bookTour: Booking;
  bookmarkPlace: Scalars['Boolean']['output'];
  bookmarkPost: Scalars['Boolean']['output'];
  bookmarkTour: Scalars['Boolean']['output'];
  createComment: Comment;
  createLocation: Location;
  createPlace: Place;
  createPost: Post;
  createReaction: Reaction;
  createTour: Tour;
  createTrip: Trip;
  deleteLocation: Scalars['Boolean']['output'];
  deletePlace: Scalars['Boolean']['output'];
  deleteReaction: Scalars['Boolean']['output'];
  deleteTour: Scalars['Boolean']['output'];
  deleteTrip: Scalars['Boolean']['output'];
  loginUser: AuthPayload;
  registerUser: AuthPayload;
  requestChallenge: Scalars['String']['output'];
  revokeDevice: Scalars['Boolean']['output'];
  updateLocation: Location;
  updatePlace: Place;
  updateTour: Tour;
  updateTrip: Trip;
  updateUser: User;
};


export type MutationAddMessageArgs = {
  content: Scalars['String']['input'];
};


export type MutationBookTourArgs = {
  input: BookTourInput;
};


export type MutationBookmarkPlaceArgs = {
  placeId: Scalars['ID']['input'];
};


export type MutationBookmarkPostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationBookmarkTourArgs = {
  tourId: Scalars['ID']['input'];
};


export type MutationCreateCommentArgs = {
  content: Scalars['String']['input'];
  postId: Scalars['ID']['input'];
};


export type MutationCreateLocationArgs = {
  input: CreateLocationInput;
};


export type MutationCreatePlaceArgs = {
  input: CreatePlaceInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateReactionArgs = {
  commentId?: InputMaybe<Scalars['ID']['input']>;
  emoji: Scalars['String']['input'];
  postId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationCreateTourArgs = {
  input: CreateTourInput;
};


export type MutationCreateTripArgs = {
  input: CreateTripInput;
};


export type MutationDeleteLocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePlaceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReactionArgs = {
  reactionId: Scalars['ID']['input'];
};


export type MutationDeleteTourArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTripArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginUserArgs = {
  deviceId: Scalars['String']['input'];
  publicKey?: InputMaybe<Scalars['String']['input']>;
  signature: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisterUserArgs = {
  deviceId: Scalars['String']['input'];
  publicKey: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRequestChallengeArgs = {
  isRegister: Scalars['Boolean']['input'];
  username: Scalars['String']['input'];
};


export type MutationRevokeDeviceArgs = {
  deviceId: Scalars['String']['input'];
};


export type MutationUpdateLocationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLocationInput;
};


export type MutationUpdatePlaceArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePlaceInput;
};


export type MutationUpdateTourArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTourInput;
};


export type MutationUpdateTripArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTripInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Place = {
  __typename?: 'Place';
  coordinates: Coordinates;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  distance?: Maybe<Scalars['Float']['output']>;
  hours?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isOpen: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  locationId?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  ownerId?: Maybe<Scalars['ID']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Int']['output']>;
  rating: Scalars['Float']['output'];
  reviews: Scalars['Int']['output'];
  tips: Array<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type Post = {
  __typename?: 'Post';
  attachments: Array<Scalars['String']['output']>;
  comments: Array<Comment>;
  commentsCount: Scalars['Int']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isBookmarked: Scalars['Boolean']['output'];
  reactions: Array<Reaction>;
  reactionsCount: Scalars['Int']['output'];
  relatedEntity?: Maybe<PostRelatedEntity>;
  relatedId?: Maybe<Scalars['ID']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  user: User;
  userId: Scalars['ID']['output'];
};

export type PostRelatedEntity = Place | Tour | Trip;

export type PostsConnection = {
  __typename?: 'PostsConnection';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
  posts: Array<Post>;
  previousOffset?: Maybe<Scalars['Int']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  checkUsernameAvailability: Scalars['Boolean']['output'];
  getAlerts: Array<Alert>;
  getBookmarks: Array<Bookmark>;
  getLocation?: Maybe<Location>;
  getLocations: Array<Location>;
  getMessages: Array<Message>;
  getMyDevices: Array<Device>;
  getPlace?: Maybe<Place>;
  getPlaces: Array<Place>;
  getPost?: Maybe<Post>;
  getPosts: PostsConnection;
  getTour?: Maybe<Tour>;
  getTours: Array<Tour>;
  getTrip?: Maybe<Trip>;
  getTrips: Array<Trip>;
  getUser?: Maybe<User>;
  me?: Maybe<User>;
};


export type QueryCheckUsernameAvailabilityArgs = {
  username: Scalars['String']['input'];
};


export type QueryGetBookmarksArgs = {
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetLocationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetLocationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPlaceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPlacesArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPostsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetTourArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetToursArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetTripArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTripsArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};

export type Reaction = {
  __typename?: 'Reaction';
  commentId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['String']['output'];
  emoji: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  postId?: Maybe<Scalars['ID']['output']>;
  user: User;
  userId: Scalars['ID']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newAlerts: Alert;
  newMessages: Message;
  tripUpdates: TripUpdate;
};


export type SubscriptionTripUpdatesArgs = {
  tripId: Scalars['ID']['input'];
};

export type Tour = {
  __typename?: 'Tour';
  category: Scalars['String']['output'];
  coordinates?: Maybe<Coordinates>;
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  difficulty: Scalars['String']['output'];
  duration: Scalars['Int']['output'];
  durationType: Scalars['String']['output'];
  gallery: Array<Scalars['String']['output']>;
  highlights: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  inclusions: Array<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isFeatured: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  maxParticipants?: Maybe<Scalars['Int']['output']>;
  minParticipants: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  rating: Scalars['Float']['output'];
  reviews: Scalars['Int']['output'];
  shortDescription?: Maybe<Scalars['String']['output']>;
  tags: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Trip = {
  __typename?: 'Trip';
  accommodation?: Maybe<Scalars['String']['output']>;
  aiReasoning?: Maybe<Scalars['String']['output']>;
  budget?: Maybe<Scalars['Float']['output']>;
  coordinates?: Maybe<Coordinates>;
  createdAt: Scalars['String']['output'];
  destination?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  itinerary?: Maybe<Array<ItineraryDay>>;
  preferences?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  travelers: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  waypoints?: Maybe<Array<Waypoint>>;
};

export type TripUpdate = {
  __typename?: 'TripUpdate';
  createdAt: Scalars['String']['output'];
  data?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
  step: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  totalSteps: Scalars['Int']['output'];
  tripId: Scalars['ID']['output'];
  type: Scalars['String']['output'];
};

export type UpdateLocationInput = {
  averageCost?: InputMaybe<Scalars['Float']['input']>;
  bestTimeToVisit?: InputMaybe<Scalars['String']['input']>;
  coordinates?: InputMaybe<CoordinatesInput>;
  country?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  popularActivities?: InputMaybe<Array<Scalars['String']['input']>>;
  population?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePlaceInput = {
  coordinates?: InputMaybe<CoordinatesInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  distance?: InputMaybe<Scalars['Float']['input']>;
  hours?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isOpen?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  locationId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  tips?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTourInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  coordinates?: InputMaybe<CoordinatesInput>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  difficulty?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  durationType?: InputMaybe<Scalars['String']['input']>;
  gallery?: InputMaybe<Array<Scalars['String']['input']>>;
  highlights?: InputMaybe<Array<Scalars['String']['input']>>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  inclusions?: InputMaybe<Array<Scalars['String']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  maxParticipants?: InputMaybe<Scalars['Int']['input']>;
  minParticipants?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTripInput = {
  accommodation?: InputMaybe<Scalars['String']['input']>;
  aiReasoning?: InputMaybe<Scalars['String']['input']>;
  budget?: InputMaybe<Scalars['Float']['input']>;
  destination?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  itinerary?: InputMaybe<Scalars['String']['input']>;
  preferences?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  travelers?: InputMaybe<Scalars['Int']['input']>;
  userMessage?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  avatarBase64?: InputMaybe<Scalars['String']['input']>;
  avatarMimeType?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  publicKey?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type Waypoint = {
  __typename?: 'Waypoint';
  label?: Maybe<Scalars['String']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};
