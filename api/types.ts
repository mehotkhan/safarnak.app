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

export type Coordinates = {
  __typename?: 'Coordinates';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
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

export type ItineraryDay = {
  __typename?: 'ItineraryDay';
  activities: Array<Scalars['String']['output']>;
  day: Scalars['Int']['output'];
  title: Scalars['String']['output'];
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
  bookmarkPlace: Scalars['Boolean']['output'];
  bookmarkTour: Scalars['Boolean']['output'];
  createTrip: Trip;
  deleteTrip: Scalars['Boolean']['output'];
  login: AuthPayload;
  register: AuthPayload;
  updateTrip: Trip;
};


export type MutationAddMessageArgs = {
  content: Scalars['String']['input'];
};


export type MutationBookmarkPlaceArgs = {
  placeId: Scalars['ID']['input'];
};


export type MutationBookmarkTourArgs = {
  tourId: Scalars['ID']['input'];
};


export type MutationCreateTripArgs = {
  input: CreateTripInput;
};


export type MutationDeleteTripArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateTripArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTripInput;
};

export type Place = {
  __typename?: 'Place';
  category: Scalars['String']['output'];
  coordinates: Coordinates;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  distance?: Maybe<Scalars['Float']['output']>;
  hours?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isOpen: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  rating: Scalars['Float']['output'];
  reviews: Scalars['Int']['output'];
  tips: Array<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getAlerts: Array<Alert>;
  getMessages: Array<Message>;
  getPlace?: Maybe<Place>;
  getPlaces: Array<Place>;
  getTour?: Maybe<Tour>;
  getTours: Array<Tour>;
  getTrip?: Maybe<Trip>;
  getTrips: Array<Trip>;
  me?: Maybe<User>;
};


export type QueryGetPlaceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPlacesArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
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
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  difficulty: Scalars['String']['output'];
  duration: Scalars['Int']['output'];
  highlights: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  inclusions: Array<Scalars['String']['output']>;
  location: Scalars['String']['output'];
  maxParticipants: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  rating: Scalars['Float']['output'];
  reviews: Scalars['Int']['output'];
  title: Scalars['String']['output'];
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

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type Waypoint = {
  __typename?: 'Waypoint';
  label?: Maybe<Scalars['String']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};
