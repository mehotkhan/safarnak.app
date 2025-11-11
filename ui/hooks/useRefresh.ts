import { useState, useCallback } from 'react';

/**
 * Pull-to-refresh hook - manages refreshing state and handler
 * 
 * @param refetch - Function to call when refreshing
 * @returns Object with refreshing state and onRefresh handler
 * 
 * @example
 * const { data, refetch } = useGetTripsQuery();
 * const { refreshing, onRefresh } = useRefresh(refetch);
 * 
 * <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
 */
export function useRefresh(refetch: () => Promise<any> | void) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return { refreshing, onRefresh };
}

