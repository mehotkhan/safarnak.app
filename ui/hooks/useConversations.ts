import { useCallback, useEffect, useState } from 'react';
import { eq, desc, inArray } from 'drizzle-orm';

import {
  useMyConversationsQuery,
  useConversationMessagesPageQuery,
  useConversationMessagesSubscription,
  useSendMessageMutation,
  SendMessageDocument,
} from '@api';
import type { ConversationMessagesPageQuery } from '@api';
import { getLocalDB } from '@database/client';
import {
  cachedConversations,
  cachedConversationMembers,
  cachedChatMessages,
  cachedUsers,
} from '@database/schema';
import { createId } from '@database/utils';
import { useAppSelector } from '@ui/state/hooks';
import { enqueueOfflineMutation } from '@ui/state/middleware/offlineMiddleware';
import { encryptMessage, decryptMessage } from '@utils/conversationKeys';
import type { DeviceKeyPair } from '@state/slices/authSlice';

interface ConversationMember {
  id: string;
  name: string;
  username: string;
  avatar?: string | null;
}

type ApiConversation = {
  id: string;
  kind: string;
  tripId?: string | null;
  title?: string | null;
  lastMessageAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  members: Array<{ id: string; name?: string | null; username?: string | null; avatar?: string | null }>;
};

type ApiChatMessage = {
  id: string;
  conversationId: string;
  senderUserId: string;
  senderDeviceId: string;
  ciphertext: string;
  ciphertextMeta?: any;
  metadata?: any;
  type?: string | null;
  createdAt?: string | null;
};

export interface ConversationRecord {
  id: string;
  kind: string;
  tripId?: string | null;
  title?: string | null;
  lastMessageAt?: string | null;
  lastMessagePreview?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  members: ConversationMember[];
}

export interface ConversationMessageRecord {
  id: string;
  conversationId: string;
  senderUserId: string;
  senderDeviceId: string;
  ciphertext: string;
  ciphertextMeta?: any;
  metadata?: any;
  createdAt: string | null;
  type: string;
  pending: boolean;
  plaintext: string;
}

const parseJson = (value: string | null) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const mapConversationRow = (
  row: typeof cachedConversations.$inferSelect,
  members: ConversationMember[],
): ConversationRecord => ({
  id: row.id,
  kind: row.kind,
  tripId: row.tripId,
  title: row.title,
  lastMessageAt: row.lastMessageAt,
  lastMessagePreview: row.lastMessagePreview,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  members,
});

const mapMessageRow = (row: typeof cachedChatMessages.$inferSelect): ConversationMessageRecord => ({
  id: row.id,
  conversationId: row.conversationId,
  senderUserId: row.senderUserId,
  senderDeviceId: row.senderDeviceId,
  ciphertext: row.ciphertext,
  ciphertextMeta: parseJson(row.ciphertextMeta),
  metadata: parseJson(row.metadata),
  createdAt: row.createdAt,
  type: row.type || 'text',
  pending: Boolean(row.pending),
  plaintext: row.ciphertext,
});

async function persistConversations(conversations: ApiConversation[]) {
  if (!conversations?.length) return;
  const db = await getLocalDB();
  const now = Math.floor(Date.now() / 1000);

  for (const conversation of conversations) {
    await db
      .insert(cachedConversations)
      .values({
        id: conversation.id,
        kind: conversation.kind,
        tripId: conversation.tripId || null,
        title: conversation.title || null,
        lastMessageAt: conversation.lastMessageAt || null,
        createdAt: conversation.createdAt || new Date().toISOString(),
        updatedAt: conversation.updatedAt || new Date().toISOString(),
        cachedAt: now,
        lastSyncAt: now,
        pending: false,
      })
      .onConflictDoUpdate({
        target: cachedConversations.id,
        set: {
          kind: conversation.kind,
          tripId: conversation.tripId || null,
          title: conversation.title || null,
          lastMessageAt: conversation.lastMessageAt || null,
          updatedAt: conversation.updatedAt || new Date().toISOString(),
          lastSyncAt: now,
        },
      });
  }
}

async function persistConversationMembers(conversations: ApiConversation[]) {
  if (!conversations?.length) return;
  const db = await getLocalDB();
  const now = Math.floor(Date.now() / 1000);

  for (const conversation of conversations) {
    await db.delete(cachedConversationMembers).where(eq(cachedConversationMembers.conversationId, conversation.id));
    if (!conversation.members?.length) continue;

    await db.insert(cachedConversationMembers).values(
      conversation.members.map((member) => ({
        id: createId(),
        conversationId: conversation.id,
        userId: member.id,
        role: 'MEMBER',
        joinedAt: new Date().toISOString(),
        cachedAt: now,
        lastSyncAt: now,
        pending: false,
      })),
    );
  }
}

async function persistMessages(messages: ApiChatMessage[], deviceKeyPair?: DeviceKeyPair | null) {
  if (!messages?.length) return;
  const db = await getLocalDB();
  const now = Math.floor(Date.now() / 1000);

  for (const message of messages) {
    await db
      .insert(cachedChatMessages)
      .values({
        id: message.id,
        conversationId: message.conversationId,
        senderUserId: message.senderUserId,
        senderDeviceId: message.senderDeviceId,
        ciphertext: message.ciphertext,
        ciphertextMeta: message.ciphertextMeta ? JSON.stringify(message.ciphertextMeta) : null,
        metadata: message.metadata ? JSON.stringify(message.metadata) : null,
        type: message.type || 'text',
        createdAt: message.createdAt || new Date().toISOString(),
        cachedAt: now,
        lastSyncAt: now,
        pending: false,
      })
      .onConflictDoUpdate({
        target: cachedChatMessages.id,
        set: {
          ciphertext: message.ciphertext,
          ciphertextMeta: message.ciphertextMeta ? JSON.stringify(message.ciphertextMeta) : null,
          metadata: message.metadata ? JSON.stringify(message.metadata) : null,
          type: message.type || 'text',
          createdAt: message.createdAt || new Date().toISOString(),
          lastSyncAt: now,
          pending: false,
        },
      });

    const plaintext = deviceKeyPair
      ? await decryptMessage(
          message.conversationId,
          message.ciphertext,
          message.ciphertextMeta,
          deviceKeyPair,
        )
      : message.ciphertext;
    await updateConversationPreview(message.conversationId, plaintext, message.createdAt);
  }
}

async function updateConversationPreview(conversationId: string, preview: string, timestamp?: string | null) {
  const db = await getLocalDB();
  const nowIso = timestamp || new Date().toISOString();
  const now = Math.floor(Date.now() / 1000);
  await db
    .update(cachedConversations)
    .set({
      lastMessagePreview: preview,
      lastMessageAt: nowIso,
      updatedAt: nowIso,
      lastSyncAt: now,
      pending: false,
    })
    .where(eq(cachedConversations.id, conversationId));
}

async function readConversationsFromDb(): Promise<ConversationRecord[]> {
  const db = await getLocalDB();
  const rows = await db
    .select()
    .from(cachedConversations)
    .orderBy(desc(cachedConversations.lastMessageAt ?? cachedConversations.updatedAt ?? cachedConversations.cachedAt))
    .all();

  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.id);
  const memberRows = await db
    .select({
      conversationId: cachedConversationMembers.conversationId,
      userId: cachedConversationMembers.userId,
      role: cachedConversationMembers.role,
      username: cachedUsers.username,
      name: cachedUsers.name,
      avatar: cachedUsers.avatar,
    })
    .from(cachedConversationMembers)
    .leftJoin(cachedUsers, eq(cachedUsers.id, cachedConversationMembers.userId))
    .where(inArray(cachedConversationMembers.conversationId, ids));

  const membersMap = new Map<string, ConversationMember[]>();
  memberRows.forEach((row) => {
    const list = membersMap.get(row.conversationId) || [];
    list.push({
      id: row.userId,
      username: row.username || '',
      name: row.name || row.username || 'Unknown',
      avatar: row.avatar,
    });
    membersMap.set(row.conversationId, list);
  });

  return rows.map((row) => mapConversationRow(row, membersMap.get(row.id) || []));
}

async function readConversationFromDb(conversationId?: string | null): Promise<ConversationRecord | null> {
  if (!conversationId) return null;
  const db = await getLocalDB();
  const row = await db.select().from(cachedConversations).where(eq(cachedConversations.id, conversationId)).get();
  if (!row) return null;

  const memberRows = await db
    .select({
      conversationId: cachedConversationMembers.conversationId,
      userId: cachedConversationMembers.userId,
      username: cachedUsers.username,
      name: cachedUsers.name,
      avatar: cachedUsers.avatar,
    })
    .from(cachedConversationMembers)
    .leftJoin(cachedUsers, eq(cachedUsers.id, cachedConversationMembers.userId))
    .where(eq(cachedConversationMembers.conversationId, conversationId));

  const members = memberRows.map((row) => ({
    id: row.userId,
    username: row.username || '',
    name: row.name || row.username || 'Unknown',
    avatar: row.avatar,
  }));

  return mapConversationRow(row, members);
}

async function readMessagesFromDb(
  conversationId?: string | null,
  deviceKeyPair?: DeviceKeyPair | null,
): Promise<ConversationMessageRecord[]> {
  if (!conversationId) return [];
  const db = await getLocalDB();
  const rows = await db
    .select()
    .from(cachedChatMessages)
    .where(eq(cachedChatMessages.conversationId, conversationId))
    .orderBy(desc(cachedChatMessages.createdAt ?? cachedChatMessages.cachedAt))
    .limit(200)
    .all();

  const mapped = rows.map(mapMessageRow).sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const decrypted = await Promise.all(
    mapped.map(async (message) => {
      if (!deviceKeyPair) {
        return { ...message, plaintext: message.ciphertext };
      }
      const plaintext = await decryptMessage(
        message.conversationId,
        message.ciphertext,
        message.ciphertextMeta,
        deviceKeyPair,
      );
      return { ...message, plaintext };
    }),
  );

  return decrypted;
}

export function useMyConversations() {
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { loading, refetch } = useMyConversationsQuery({
    fetchPolicy: 'cache-and-network',
    onCompleted: (payload) => {
      if (payload?.myConversations) {
        persistConversations(payload.myConversations)
          .then(() => persistConversationMembers(payload.myConversations))
          .then(() => readConversationsFromDb().then(setConversations));
      }
    },
  });

  useEffect(() => {
    readConversationsFromDb().then(setConversations);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    conversations,
    loading,
    refreshing,
    refetch: handleRefresh,
  };
}

export function useConversation(conversationId?: string) {
  const [conversation, setConversation] = useState<ConversationRecord | null>(null);

  const reload = useCallback(() => {
    readConversationFromDb(conversationId).then(setConversation);
  }, [conversationId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { conversation, reload };
}

export function useConversationMessages(conversationId?: string, deviceKeyPair?: DeviceKeyPair | null) {
  const [messages, setMessages] = useState<ConversationMessageRecord[]>([]);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [paginationCursor, setPaginationCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setPaginationCursor(null);
    setHasMore(false);
    readMessagesFromDb(conversationId, deviceKeyPair).then(setMessages);
  }, [conversationId, deviceKeyPair]);

  const hasConversation = Boolean(conversationId);

  const applyConnectionPayload = useCallback(
    (connection?: ConversationMessagesPageQuery['conversationMessagesPage']) => {
      if (!conversationId || !connection) return;
      const nodes = connection.edges?.map((edge) => edge.node) ?? [];
      persistMessages(nodes, deviceKeyPair).then(() => {
        readMessagesFromDb(conversationId, deviceKeyPair).then(setMessages);
      });
      setPaginationCursor(connection.pageInfo?.endCursor ?? null);
      setHasMore(Boolean(connection.pageInfo?.hasNextPage));
    },
    [conversationId, deviceKeyPair],
  );

  const { loading: messagesLoading, refetch, fetchMore } = useConversationMessagesPageQuery({
    variables: { conversationId: conversationId || '', cursor: undefined, limit: 50 },
    skip: !hasConversation,
    fetchPolicy: 'network-only',
    onCompleted: (payload) => {
      applyConnectionPayload(payload?.conversationMessagesPage);
    },
  });

  useConversationMessagesSubscription({
    skip: !hasConversation,
    variables: { conversationId: conversationId || '' },
    onData: ({ data: subscriptionData }) => {
      const message = subscriptionData?.data?.conversationMessages;
      if (message) {
        persistMessages([message], deviceKeyPair).then(() => {
          readMessagesFromDb(conversationId, deviceKeyPair).then(setMessages);
        });
      }
    },
  });

  const reload = useCallback(() => {
    return readMessagesFromDb(conversationId, deviceKeyPair).then(setMessages);
  }, [conversationId, deviceKeyPair]);

  useEffect(() => {
    reload();
  }, [reload]);

  const loadMore = useCallback(async () => {
    if (!conversationId || !paginationCursor || !hasMore) {
      return;
    }
    setFetchingMore(true);
    try {
      const result = await fetchMore({
        variables: {
          conversationId,
          cursor: paginationCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult ?? prev,
      });
      applyConnectionPayload(result.data?.conversationMessagesPage);
    } finally {
      setFetchingMore(false);
    }
  }, [applyConnectionPayload, conversationId, fetchMore, hasMore, paginationCursor]);

  return {
    messages,
    loading: messagesLoading,
    refetch,
    loadMore,
    fetchingMore,
    reload,
    hasMore,
  };
}

export function useSendMessage(conversationId?: string) {
  const auth = useAppSelector((state) => state.auth);
  const [sendMessageMutation, mutationState] = useSendMessageMutation();

  const sendMessage = useCallback(
    async (plaintext: string, options?: { onLocalPersist?: () => void }) => {
      if (!conversationId) return;
      if (!auth.user || !auth.deviceKeyPair) {
        throw new Error('Not authenticated');
      }

      const db = await getLocalDB();
      const nowIso = new Date().toISOString();
      const now = Math.floor(Date.now() / 1000);
      const localId = createId();

      const { ciphertext, ciphertextMeta } = await encryptMessage(conversationId, plaintext, auth.deviceKeyPair);

      await db.insert(cachedChatMessages).values({
        id: localId,
        conversationId,
        senderUserId: auth.user.id,
        senderDeviceId: auth.deviceKeyPair.deviceId,
        ciphertext,
        ciphertextMeta: ciphertextMeta ? JSON.stringify(ciphertextMeta) : null,
        metadata: null,
        type: 'text',
        createdAt: nowIso,
        cachedAt: now,
        lastSyncAt: null,
        pending: true,
      });

      await updateConversationPreview(conversationId, plaintext, nowIso);
      options?.onLocalPersist?.();

      try {
        const result = await sendMessageMutation({
          variables: {
            conversationId,
            ciphertext,
            ciphertextMeta,
            metadata: null,
            type: 'text',
          },
        });

        await db.delete(cachedChatMessages).where(eq(cachedChatMessages.id, localId));
        if (result.data?.sendMessage) {
          await persistMessages([result.data.sendMessage], auth.deviceKeyPair);
        }
      } catch (error: any) {
        // Queue for offline retry
        await enqueueOfflineMutation({
          operationName: 'sendMessage',
          mutation: SendMessageDocument,
          variables: {
            conversationId,
            ciphertext,
            ciphertextMeta,
            metadata: null,
            type: 'text',
          },
        });
        if (__DEV__) {
          console.warn('Queued sendMessage for offline retry', error);
        }
        throw error;
      }
    },
    [auth.deviceKeyPair, auth.user, conversationId, sendMessageMutation],
  );

  return {
    sendMessage,
    sending: mutationState.loading,
  };
}

