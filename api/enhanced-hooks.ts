/**
 * Enhanced Hooks with Automatic Drizzle Sync
 * 
 * Wraps auto-generated hooks to automatically sync Apollo cache to Drizzle.
 * This ensures all GraphQL operations are cached in Drizzle for offline access.
 * 
 * Usage:
 *   import { useMeQuery, useGetTripsQuery } from '@api';
 *   // These hooks automatically sync to Drizzle after queries complete
 */

import { useEffect } from 'react';
import { QueryHookOptions, MutationHookOptions, QueryResult, MutationTuple, OperationVariables } from '@apollo/client';
import { client } from './client';
import { syncApolloToDrizzle } from '@drizzle/client';
// Import generated hooks as functions
import {
  useMeQuery as useMeQueryRaw,
  useGetTripsQuery as useGetTripsQueryRaw,
  useGetTripQuery as useGetTripQueryRaw,
  useGetMessagesQuery as useGetMessagesQueryRaw,
  useLoginMutation as useLoginMutationRaw,
  useRegisterMutation as useRegisterMutationRaw,
  useAddMessageMutation as useAddMessageMutationRaw,
  useCreateTripMutation as useCreateTripMutationRaw,
} from './hooks';
// Import types
import type {
  MeQuery,
  MeQueryVariables,
  GetTripsQuery,
  GetTripsQueryVariables,
  GetTripQuery,
  GetTripQueryVariables,
  GetMessagesQuery,
  GetMessagesQueryVariables,
  LoginMutation,
  LoginMutationVariables,
  RegisterMutation,
  RegisterMutationVariables,
  AddMessageMutation,
  AddMessageMutationVariables,
  CreateTripMutation,
  CreateTripMutationVariables,
} from './hooks';

/**
 * Sync Apollo cache to Drizzle after query/mutation completes
 * This runs in the background and doesn't block the UI
 */
const syncToDrizzle = async () => {
  try {
    const cache = client.cache.extract();
    if (Object.keys(cache).length > 0) {
      await syncApolloToDrizzle(cache);
      if (__DEV__) {
        console.log('✅ Synced Apollo cache to Drizzle');
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('⚠️ Failed to sync Apollo cache to Drizzle:', error);
    }
  }
};

/**
 * Enhanced Query Hook Wrapper
 * Automatically syncs to Drizzle after query completes
 */
function enhanceQueryHook<TData, TVariables extends OperationVariables = OperationVariables>(
  useQueryHook: (
    baseOptions?: QueryHookOptions<TData, TVariables>
  ) => QueryResult<TData, TVariables>
) {
  return (baseOptions?: QueryHookOptions<TData, TVariables>) => {
    // Use cache-and-network by default for better offline support
    // This returns cached data immediately, then updates from network
    const fetchPolicy = baseOptions?.fetchPolicy || 'cache-and-network';
    
    const result = useQueryHook({
      ...baseOptions,
      fetchPolicy,
      // Keep errorPolicy to allow partial data on errors (for offline)
      errorPolicy: baseOptions?.errorPolicy || 'all',
      onCompleted: async (data) => {
        // Call original onCompleted if provided
        if (baseOptions?.onCompleted) {
          await baseOptions.onCompleted(data);
        }
        // Sync to Drizzle after query completes
        await syncToDrizzle();
      },
      onError: (error) => {
        // Call original onError if provided
        if (baseOptions?.onError) {
          baseOptions.onError(error);
        }
        // Still try to sync on error (might have partial cache)
        syncToDrizzle().catch(() => {
          // Ignore sync errors on query errors
        });
      },
    });

    // Also sync when data changes (for cache updates)
    useEffect(() => {
      if (result.data && !result.loading) {
        syncToDrizzle().catch(() => {
          // Ignore sync errors
        });
      }
    }, [result.data, result.loading]);

    return result;
  };
}

/**
 * Enhanced Mutation Hook Wrapper
 * Automatically syncs to Drizzle after mutation completes
 */
function enhanceMutationHook<TData, TVariables extends OperationVariables = OperationVariables>(
  useMutationHook: (
    baseOptions?: MutationHookOptions<TData, TVariables>
  ) => MutationTuple<TData, TVariables>
) {
  return (baseOptions?: MutationHookOptions<TData, TVariables>) => {
    const [mutate, mutationResult] = useMutationHook({
      ...baseOptions,
      onCompleted: async (data) => {
        // Call original onCompleted if provided
        if (baseOptions?.onCompleted) {
          await baseOptions.onCompleted(data);
        }
        // Sync to Drizzle after mutation completes
        await syncToDrizzle();
      },
      onError: (error) => {
        // Call original onError if provided
        if (baseOptions?.onError) {
          baseOptions.onError(error);
        }
        // Still try to sync on error (might have partial cache)
        syncToDrizzle().catch(() => {
          // Ignore sync errors on mutation errors
        });
      },
    });

    // Also sync when data changes (for cache updates)
    useEffect(() => {
      if (mutationResult.data && !mutationResult.loading) {
        syncToDrizzle().catch(() => {
          // Ignore sync errors
        });
      }
    }, [mutationResult.data, mutationResult.loading]);

    return [mutate, mutationResult] as MutationTuple<TData, TVariables>;
  };
}

// Export enhanced hooks with automatic Drizzle sync
export const useMeQuery = enhanceQueryHook<MeQuery, MeQueryVariables>(useMeQueryRaw);
export const useGetTripsQuery = enhanceQueryHook<GetTripsQuery, GetTripsQueryVariables>(useGetTripsQueryRaw);
export const useGetMessagesQuery = enhanceQueryHook<GetMessagesQuery, GetMessagesQueryVariables>(useGetMessagesQueryRaw);

// useGetTripQuery has a special signature - handle it separately
export function useGetTripQuery(
  baseOptions: QueryHookOptions<GetTripQuery, GetTripQueryVariables> & ({ variables: GetTripQueryVariables; skip?: boolean } | { skip: boolean })
) {
  // Use cache-and-network for better offline support
  const fetchPolicy = baseOptions?.fetchPolicy || 'cache-and-network';
  
  const result = useGetTripQueryRaw({
    ...baseOptions,
    fetchPolicy,
    errorPolicy: baseOptions?.errorPolicy || 'all', // Allow partial data
    onCompleted: async (data) => {
      if (baseOptions?.onCompleted) {
        await baseOptions.onCompleted(data);
      }
      await syncToDrizzle();
    },
    onError: (error) => {
      if (baseOptions?.onError) {
        baseOptions.onError(error);
      }
      syncToDrizzle().catch(() => {});
    },
  });

  useEffect(() => {
    if (result.data && !result.loading) {
      syncToDrizzle().catch(() => {});
    }
  }, [result.data, result.loading]);

  return result;
}

export const useLoginMutation = enhanceMutationHook<LoginMutation, LoginMutationVariables>(useLoginMutationRaw);
export const useRegisterMutation = enhanceMutationHook<RegisterMutation, RegisterMutationVariables>(useRegisterMutationRaw);
export const useAddMessageMutation = enhanceMutationHook<AddMessageMutation, AddMessageMutationVariables>(useAddMessageMutationRaw);
export const useCreateTripMutation = enhanceMutationHook<CreateTripMutation, CreateTripMutationVariables>(useCreateTripMutationRaw);

// Re-export all types and other exports from hooks.ts (lazy queries, suspense queries, etc.)
export * from './hooks';

