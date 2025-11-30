import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ApolloError } from '@apollo/client';

import {
  useGetFeedQuery,
  useFeedNewEventsSubscription,
  GetFeedDocument,
} from '@api';
import { client } from '@api';
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
  initialLoading: boolean;
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

  const hasLoadedCachedData = useRef(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [_queuedEvents, setQueuedEvents] = useState<any[]>([]);
  const [newItemsCount, setNewItemsCount] = useState(0);

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

  // Load cached data from Apollo cache immediately on first mount (offline-first)
  useEffect(() => {
    if (hasLoadedCachedData.current) return;

    let attempts = 0;
    const maxAttempts = 5;
    const attemptInterval = 100; // ms

    const tryLoadCache = () => {
      attempts += 1;
      try {
        const cachedData = client.readQuery({
          query: GetFeedDocument,
          variables: {
            first: limit,
            after: undefined,
            filter: {
              entityTypes: entityTypes as any,
              createdAtAfter: filterBounds.after,
              createdAtBefore: filterBounds.before,
            },
          },
        });

        if (cachedData?.getFeed?.edges) {
          const cachedItems = transformFeedEdgesToItems(
            cachedData.getFeed.edges,
          );
          if (cachedItems.length > 0) {
            setItems(cachedItems);
            setEndCursor(cachedData.getFeed.pageInfo?.endCursor || undefined);
            setHasNextPage(
              Boolean(cachedData.getFeed.pageInfo?.hasNextPage),
            );
            hasLoadedCachedData.current = true;
            setInitialLoading(false);
            return;
          }
        }
      } catch {
        // Cache miss or not ready yet
      }

      if (attempts < maxAttempts) {
        setTimeout(tryLoadCache, attemptInterval);
      } else {
        setInitialLoading(false);
      }
    };

    tryLoadCache();
    // We intentionally ignore filterBounds/entityTypes to avoid restarting attempts on every change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const {
    data,
    loading,
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

  // When filter bounds change, reset list and attempt to read cached data synchronously
  useEffect(() => {
    hasLoadedCachedData.current = false;
    setItems([]);
    setEndCursor(undefined);
    setHasNextPage(false);
    setInitialLoading(true);

    try {
      const cachedData = client.readQuery({
        query: GetFeedDocument,
        variables: {
          first: limit,
          after: undefined,
          filter: {
            entityTypes: entityTypes as any,
            createdAtAfter: filterBounds.after,
            createdAtBefore: filterBounds.before,
          },
        },
      });

      if (cachedData?.getFeed?.edges) {
        const cachedItems = transformFeedEdgesToItems(cachedData.getFeed.edges);
        if (cachedItems.length > 0) {
          setItems(cachedItems);
          setEndCursor(cachedData.getFeed.pageInfo?.endCursor || undefined);
          setHasNextPage(
            Boolean(cachedData.getFeed.pageInfo?.hasNextPage),
          );
          hasLoadedCachedData.current = true;
          setInitialLoading(false);
        } else {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    } catch {
      setInitialLoading(false);
    }

    apolloRefetch({
      first: limit,
      after: undefined,
      filter: {
        entityTypes: entityTypes as any,
        createdAtAfter: filterBounds.after,
        createdAtBefore: filterBounds.before,
      },
    } as any).catch(() => {
      // network error will be surfaced via `error`
    });
  }, [filterBounds.after, filterBounds.before, apolloRefetch, entityTypes, limit]);

  // Update list whenever query data changes
  useEffect(() => {
    if (!data?.getFeed) return;
    const edges = data.getFeed.edges || [];
    const newItems = transformFeedEdgesToItems(edges);

    if (newItems.length > 0) {
      setItems(newItems);
      setInitialLoading(false);
    }

    setEndCursor(data.getFeed.pageInfo?.endCursor || undefined);
    setHasNextPage(Boolean(data.getFeed.pageInfo?.hasNextPage));
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
      initialLoading,
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
      initialLoading,
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


