import { Exact, Scalars, CreateTripInput, UpdateTripInput } from './types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AddMessageMutationVariables = Exact<{
  content: Scalars['String']['input'];
}>;


export type AddMessageMutation = { __typename?: 'Mutation', addMessage: { __typename?: 'Message', id: string, content: string, createdAt: string } };

export type CheckUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type CheckUsernameQuery = { __typename?: 'Query', checkUsernameAvailability: boolean };

export type CreateTripMutationVariables = Exact<{
  input: CreateTripInput;
}>;


export type CreateTripMutation = { __typename?: 'Mutation', createTrip: { __typename?: 'Trip', id: string, destination?: string | null, startDate?: string | null, endDate?: string | null, status: string, travelers: number, preferences?: string | null, accommodation?: string | null, aiReasoning?: string | null, coordinates?: { __typename?: 'Coordinates', latitude: number, longitude: number } | null, waypoints?: Array<{ __typename?: 'Waypoint', latitude: number, longitude: number, label?: string | null }> | null } };

export type GetAlertsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAlertsQuery = { __typename?: 'Query', getAlerts: Array<{ __typename?: 'Alert', id: string, type: string, title: string, message: string, step?: number | null, totalSteps?: number | null, tripId?: string | null, userId: string, read?: boolean | null, createdAt: string }> };

export type GetMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMessagesQuery = { __typename?: 'Query', getMessages: Array<{ __typename?: 'Message', id: string, content: string, createdAt: string }> };

export type GetMyDevicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyDevicesQuery = { __typename?: 'Query', getMyDevices: Array<{ __typename?: 'Device', id: string, deviceId: string, publicKey: string, type?: string | null, lastSeen: string, createdAt: string }> };

export type GetTripQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTripQuery = { __typename?: 'Query', getTrip?: { __typename?: 'Trip', id: string, destination?: string | null, startDate?: string | null, endDate?: string | null, status: string, travelers: number, preferences?: string | null, accommodation?: string | null, aiReasoning?: string | null, createdAt: string, updatedAt: string, itinerary?: Array<{ __typename?: 'ItineraryDay', day: number, title: string, activities: Array<string> }> | null, coordinates?: { __typename?: 'Coordinates', latitude: number, longitude: number } | null, waypoints?: Array<{ __typename?: 'Waypoint', latitude: number, longitude: number, label?: string | null }> | null } | null };

export type GetTripsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTripsQuery = { __typename?: 'Query', getTrips: Array<{ __typename?: 'Trip', id: string, destination?: string | null, startDate?: string | null, endDate?: string | null, status: string, travelers: number, preferences?: string | null, budget?: number | null, accommodation?: string | null, createdAt: string, updatedAt: string }> };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  deviceId: Scalars['String']['input'];
  publicKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, name: string, username: string, createdAt: string } } };

export type LoginUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  deviceId: Scalars['String']['input'];
  publicKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, name: string, username: string, createdAt: string } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name: string, username: string, publicKey?: string | null, createdAt: string } | null };

export type NewAlertsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewAlertsSubscription = { __typename?: 'Subscription', newAlerts: { __typename?: 'Alert', id: string, type: string, title: string, message: string, step?: number | null, totalSteps?: number | null, tripId?: string | null, userId: string, read?: boolean | null, createdAt: string } };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String']['input'];
  publicKey: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  deviceId: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, name: string, username: string, createdAt: string } } };

export type RegisterUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  publicKey: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  deviceId: Scalars['String']['input'];
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, name: string, username: string, createdAt: string } } };

export type RequestChallengeMutationVariables = Exact<{
  username: Scalars['String']['input'];
  isRegister: Scalars['Boolean']['input'];
}>;


export type RequestChallengeMutation = { __typename?: 'Mutation', requestChallenge: string };

export type RevokeDeviceMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type RevokeDeviceMutation = { __typename?: 'Mutation', revokeDevice: boolean };

export type TripUpdatesSubscriptionVariables = Exact<{
  tripId: Scalars['ID']['input'];
}>;


export type TripUpdatesSubscription = { __typename?: 'Subscription', tripUpdates: { __typename?: 'TripUpdate', id: string, tripId: string, type: string, title: string, message: string, step: number, totalSteps: number, status: string, data?: string | null, createdAt: string } };

export type UpdateTripMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTripInput;
}>;


export type UpdateTripMutation = { __typename?: 'Mutation', updateTrip: { __typename?: 'Trip', id: string, destination?: string | null, startDate?: string | null, endDate?: string | null, status: string, travelers: number, preferences?: string | null, accommodation?: string | null, aiReasoning?: string | null, createdAt: string, updatedAt: string, itinerary?: Array<{ __typename?: 'ItineraryDay', day: number, title: string, activities: Array<string> }> | null, coordinates?: { __typename?: 'Coordinates', latitude: number, longitude: number } | null, waypoints?: Array<{ __typename?: 'Waypoint', latitude: number, longitude: number, label?: string | null }> | null } };


export const AddMessageDocument = gql`
    mutation AddMessage($content: String!) {
  addMessage(content: $content) {
    id
    content
    createdAt
  }
}
    `;
export type AddMessageMutationFn = Apollo.MutationFunction<AddMessageMutation, AddMessageMutationVariables>;

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
export type CreateTripMutationFn = Apollo.MutationFunction<CreateTripMutation, CreateTripMutationVariables>;

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
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

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
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

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
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

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
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

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
export type RequestChallengeMutationFn = Apollo.MutationFunction<RequestChallengeMutation, RequestChallengeMutationVariables>;

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
export type RevokeDeviceMutationFn = Apollo.MutationFunction<RevokeDeviceMutation, RevokeDeviceMutationVariables>;

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
export type UpdateTripMutationFn = Apollo.MutationFunction<UpdateTripMutation, UpdateTripMutationVariables>;

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