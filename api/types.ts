export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
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

export type BookTourInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  participants: Scalars['Int']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  selectedDate: Scalars['String']['input'];
  specialRequests?: InputMaybe<Scalars['String']['input']>;
  tourId: Scalars['ID']['input'];
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

/** Feed types and connections for home stream */
export type EntityType =
  | 'LOCATION'
  | 'PLACE'
  | 'POST'
  | 'TOUR'
  | 'TRIP';

export type FeedFilter = {
  circleOnly?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtAfter?: InputMaybe<Scalars['String']['input']>;
  createdAtBefore?: InputMaybe<Scalars['String']['input']>;
  entityTypes?: InputMaybe<Array<EntityType>>;
  followingOnly?: InputMaybe<Scalars['Boolean']['input']>;
  mutedUserIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  topics?: InputMaybe<Array<Scalars['String']['input']>>;
  visibility?: InputMaybe<Array<Visibility>>;
};

export type FeedVerb =
  | 'CREATED'
  | 'UPDATED';

export type TimeWindow =
  | 'D1'
  | 'H1'
  | 'M5';

/** Trending types and windows */
export type TrendingType =
  | 'ENTITY'
  | 'PLACE'
  | 'TOPIC'
  | 'USER';

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

export type Visibility =
  | 'CIRCLE'
  | 'FOLLOWERS'
  | 'PUBLIC';
