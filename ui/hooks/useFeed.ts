import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ApolloError } from '@apollo/client';

import {
  useGetFeedQuery,
  useFeedNewEventsSubscription,
} from '@api';
import { useDateTime } from '@hooks/useDateTime';

type TimeFilterId = 'all' | 'today' | 'week' | 'month';

interface TimeFilter {
  id: TimeFilterId;
  label: string;
  days: number | null;
}

const TIME_FILTERS: TimeFilter[] = [
  { id: 'all', label: 'allTime', days: null },
  { id: 'today', label: 'today', days: 1 },
  { id: 'week', label: 'thisWeek', days: 7 },
  { id: 'month', label: 'thisMonth', days: 30 },
];

export interface FeedUser {
  id: string;
  name?: string | null;
  username?: string | null;
  avatar?: string | null;
  createdAt?: string | null;
}

export interface FeedItemEntity {
  id: string;
  userId: string;
  content?: string | null;
  comments?: any[];
  commentsCount: number;
  reactions?: any[];
  reactionsCount: number;
  createdAt?: string | null;
  type?: string | null;
  relatedId?: string | null;
  relatedEntity?: any;
  user: FeedUser;
}

export interface UseFeedOptions {
  limit?: number;
  entityTypes?: string[];
  initialTimeFilter?: TimeFilterId;
}

export interface UseFeedResult {
  items: FeedItemEntity[];
  loading: boolean;
  networkStatus: number;
  error: ApolloError | undefined;
  hasNextPage: boolean;
  loadingMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  endCursor?: string;
  selectedTimeFilter: TimeFilterId;
  setSelectedTimeFilter: (id: TimeFilterId) => void;
  filterBounds: { after?: string; before?: string };
  newItemsCount: number;
  showNew: () => void;
}

// Helper: transform GraphQL feed connection edges into flat items used by UI
function transformFeedEdgesToItems(edges: any[]): FeedItemEntity[] {
  return edges
    .map((e: any) => e?.node)
    .filter(Boolean)
    .filter((n: any) => n.entityType === 'POST')
    .map((n: any) => {
      const ent = n.entity || {};
      const actor = n.actor || {};
      
      // Ensure required fields exist to prevent crashes
      if (!ent.id || !ent.userId || !actor.id) {
        return null;
      }
      
      return {
        ...ent,
        id: ent.id,
        userId: ent.userId,
        content: ent.content,
        comments: ent.comments || [],
        commentsCount: ent.commentsCount || 0,
        reactions: ent.reactions || [],
        reactionsCount: ent.reactionsCount || 0,
        createdAt: ent.createdAt,
        user: {
          id: actor.id,
          name: actor.name,
          username: actor.username,
          avatar: actor.avatar,
          createdAt: actor.createdAt,
        },
      } as FeedItemEntity;
    })
    .filter((item): item is FeedItemEntity => item !== null);
}

export function useFeed(options: UseFeedOptions = {}): UseFeedResult {
  const {
    limit = 20,
    entityTypes = ['POST'],
    initialTimeFilter = 'all',
  } = options;

  const { getNow } = useDateTime();

  const [selectedTimeFilter, setSelectedTimeFilter] =
    useState<TimeFilterId>(initialTimeFilter);

  const [filterBounds, setFilterBounds] = useState<{
    after?: string;
    before?: string;
  }>({ after: undefined, before: undefined });

  const [items, setItems] = useState<FeedItemEntity[]>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [_queuedEvents, setQueuedEvents] = useState<any[]>([]);
  const [newItemsCount, setNewItemsCount] = useState(0);
  const isFirstMount = useRef(true);

  // Compute stable time window bounds when filter changes
  useEffect(() => {
    const filter = TIME_FILTERS.find((f) => f.id === selectedTimeFilter);
    if (!filter || !filter.days) {
      setFilterBounds({ after: undefined, before: undefined });
      return;
    }
    const now = getNow();
    const afterIso = now.minus({ days: filter.days }).toISO() || undefined;
    setFilterBounds({ after: afterIso, before: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeFilter]);

  // Cache is now restored before components mount, so Apollo will automatically
  // read from cache first. No need for manual cache reading attempts.

  const {
    data,
    loading,
    networkStatus,
    error,
    refetch: apolloRefetch,
    fetchMore,
  } = useGetFeedQuery({
    variables: {
      first: limit,
      after: undefined,
      filter: {
        entityTypes: entityTypes as any,
        createdAtAfter: filterBounds.after,
        createdAtBefore: filterBounds.before,
      },
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  } as any);

  // When filter bounds change, reset list
  // Apollo will automatically re-run the query when variables change (cache-and-network policy)
  useEffect(() => {
    // Skip on initial mount - let the query run naturally
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Reset list when filter changes - Apollo will automatically refetch with new variables
    setItems([]);
    setEndCursor(undefined);
    setHasNextPage(false);
  }, [filterBounds.after, filterBounds.before]);

  // Update list whenever query data changes
  // With cache-and-network, this will fire immediately with cached data, then again with network data
  useEffect(() => {
    if (!data?.getFeed) return;
    
    try {
      const edges = data.getFeed.edges || [];
      const newItems = transformFeedEdgesToItems(edges);

      if (newItems.length > 0) {
        setItems(newItems);
      }

      setEndCursor(data.getFeed.pageInfo?.endCursor || undefined);
      setHasNextPage(Boolean(data.getFeed.pageInfo?.hasNextPage));
    } catch (error) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error('Error transforming feed data:', error);
      }
      // Don't crash - just keep existing items
    }
  }, [data]);

  // Subscribe to new events and queue them (banner-style)
  useFeedNewEventsSubscription({
    variables: { filter: { entityTypes: entityTypes as any } },
    onData: ({ data: subscriptionPayload }: { data?: any }) => {
      try {
        const incoming = (subscriptionPayload?.data as any)?.feedNewEvents || [];
        if (!Array.isArray(incoming) || incoming.length === 0) return;

        setQueuedEvents((prev) => {
          const existingIds = new Set(items.map((p) => p.id));
          const queuedIds = new Set(prev.map((ev) => ev.entityId));
          const add = incoming.filter(
            (ev: any) =>
              ev.entityType === 'POST' &&
              !existingIds.has(ev.entityId) &&
              !queuedIds.has(ev.entityId),
          );
          const merged = [...prev, ...add];
          setNewItemsCount(Math.min(9, merged.length));
          return merged.slice(-50);
        });
      } catch {
        // ignore
      }
    },
  } as any);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasNextPage || !endCursor) return;
    try {
      setLoadingMore(true);
      const res = await fetchMore({
        variables: {
          first: limit,
          after: endCursor,
          filter: {
            entityTypes: entityTypes as any,
            createdAtAfter: filterBounds.after,
            createdAtBefore: filterBounds.before,
          },
        },
      } as any);

      const edges = (res?.data as any)?.getFeed?.edges || [];
      const next = edges
        .map((e: any) => e?.node)
        .filter(Boolean)
        .filter((n: any) => n.entityType === 'POST')
        .map((n: any) => {
          const ent = n.entity || {};
          return {
            ...ent,
            id: ent.id,
            userId: ent.userId,
            content: ent.content,
            createdAt: ent.createdAt,
          } as FeedItemEntity;
        });

      if (next.length) {
        setItems((prev) => [...prev, ...next]);
      }
      setEndCursor((res?.data as any)?.getFeed?.pageInfo?.endCursor);
      setHasNextPage(
        Boolean((res?.data as any)?.getFeed?.pageInfo?.hasNextPage),
      );
    } finally {
      setLoadingMore(false);
    }
  }, [
    endCursor,
    entityTypes,
    fetchMore,
    filterBounds.after,
    filterBounds.before,
    hasNextPage,
    limit,
    loadingMore,
  ]);

  const showNew = useCallback(() => {
    setQueuedEvents((prev) => {
      const take = prev.slice(0, 3);
      const rest = prev.slice(3);
      const mapped = take.map((n: any) => {
        const ent = n.entity || {};
        const actor = n.actor || {};
        return {
          ...ent,
          id: ent.id,
          userId: ent.userId,
          content: ent.content,
          comments: ent.comments || [],
          commentsCount: ent.commentsCount || 0,
          reactions: ent.reactions || [],
          reactionsCount: ent.reactionsCount || 0,
          createdAt: ent.createdAt,
          user: {
            id: actor.id,
            name: actor.name,
            username: actor.username,
            avatar: actor.avatar,
            createdAt: actor.createdAt,
          },
        } as FeedItemEntity;
      });

      setItems((cur) => {
        const ids = new Set(cur.map((p) => p.id));
        const toPrepend = mapped.filter((m) => !ids.has(m.id));
        return [...toPrepend, ...cur];
      });

      const remaining = Math.min(9, rest.length);
      setNewItemsCount(remaining);
      return rest;
    });
  }, []);

  const refetch = useCallback(async () => {
    await apolloRefetch({
      first: limit,
      after: undefined,
      filter: {
        entityTypes: entityTypes as any,
        createdAtAfter: filterBounds.after,
        createdAtBefore: filterBounds.before,
      },
    } as any);
  }, [apolloRefetch, entityTypes, filterBounds.after, filterBounds.before, limit]);

  const result: UseFeedResult = useMemo(
    () => ({
      items,
      loading,
      networkStatus: networkStatus || 0,
      error: error as ApolloError | undefined,
      hasNextPage,
      loadingMore,
      loadMore,
      refetch,
      endCursor,
      selectedTimeFilter,
      setSelectedTimeFilter,
      filterBounds,
      newItemsCount,
      showNew,
    }),
    [
      items,
      loading,
      networkStatus,
      error,
      hasNextPage,
      loadingMore,
      loadMore,
      refetch,
      endCursor,
      selectedTimeFilter,
      filterBounds,
      newItemsCount,
      showNew,
    ],
  );

  return result;
}


