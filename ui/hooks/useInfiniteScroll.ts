import { useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  limit: number;
  hasNextPage: boolean;
  loading: boolean;
  fetchMore: (options: { variables: any }) => Promise<any>;
  getVariables: (offset: number) => any;
}

interface UseInfiniteScrollReturn {
  offset: number;
  loadMore: () => void;
  reset: () => void;
}

/**
 * Infinite scroll hook - manages pagination offset and load more functionality
 * 
 * @param options - Configuration object
 * @param options.limit - Number of items per page
 * @param options.hasNextPage - Whether there are more pages to load
 * @param options.loading - Whether a request is currently in progress
 * @param options.fetchMore - Apollo fetchMore function
 * @param options.getVariables - Function to generate variables for fetchMore based on offset
 * @returns Object with offset, loadMore function, and reset function
 * 
 * @example
 * const { offset, loadMore, reset } = useInfiniteScroll({
 *   limit: 20,
 *   hasNextPage: data?.getPosts?.hasNextPage || false,
 *   loading,
 *   fetchMore,
 *   getVariables: (offset) => ({
 *     type: postType,
 *     limit: 20,
 *     offset,
 *     after: dateFilter.after,
 *     before: dateFilter.before,
 *   }),
 * });
 * 
 * <FlatList onEndReached={loadMore} onEndReachedThreshold={0.5} />
 */
export function useInfiniteScroll({
  limit,
  hasNextPage,
  loading,
  fetchMore,
  getVariables,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const [offset, setOffset] = useState(0);

  const loadMore = useCallback(() => {
    if (!hasNextPage || loading) return;
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchMore({
      variables: getVariables(newOffset),
    });
  }, [hasNextPage, loading, offset, limit, fetchMore, getVariables]);

  const reset = useCallback(() => {
    setOffset(0);
  }, []);

  return { offset, loadMore, reset };
}

