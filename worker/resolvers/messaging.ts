import { GraphQLError } from 'graphql/error';
import {
  getServerDB,
  conversations,
  conversationMembers,
  chatMessages,
  chatInvites,
  users,
  profiles,
  trips,
  tripParticipants,
} from '@database/server';
import { createId } from '@database/utils';
import { and, desc, eq, inArray, lt, or } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import type { GraphQLContext } from '../types';
import { assertActiveUser } from '../utilities/auth/assertActiveUser';

const CONVERSATION_MESSAGES_TOPIC = 'CONVERSATION_MESSAGES';
const MAX_PAGE_SIZE = 200;

type ConversationRow = typeof conversations.$inferSelect;
type ChatMessageRow = typeof chatMessages.$inferSelect;

const parseJsonField = (value: string | null) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const normalizeJsonInput = (value: unknown): string | null => {
  if (value === undefined || value === null) {
    return null;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
};

const requireUserId = (context: GraphQLContext): string => {
  const userId = context.userId;
  if (!userId) {
    throw new GraphQLError('NOT_AUTHENTICATED');
  }
  return userId;
};

const mapUserFromRow = (row: {
  conversationId: string;
  userId: string;
  username: string;
  email: string | null;
  publicKey: string | null;
  status: string | null;
  createdAt: string | null;
  displayName: string | null;
  phone: string | null;
  avatarUrl: string | null;
}) => ({
  id: row.userId,
  name: row.displayName || row.username,
  username: row.username,
  email: row.email,
  phone: row.phone,
  avatar: row.avatarUrl,
  publicKey: row.publicKey,
  status: row.status || 'active',
  createdAt: row.createdAt || new Date().toISOString(),
});

const mapConversation = (row: ConversationRow, members: any[]) => ({
  id: row.id,
  kind: row.kind,
  tripId: row.tripId,
  title: row.title,
  lastMessageAt: row.lastMessageAt,
  members,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const mapMessageRow = (row: ChatMessageRow) => ({
  id: row.id,
  conversationId: row.conversationId,
  senderUserId: row.senderUserId,
  senderDeviceId: row.senderDeviceId,
  type: row.type || 'text',
  ciphertext: row.ciphertext,
  ciphertextMeta: parseJsonField(row.ciphertextMeta),
  metadata: parseJsonField(row.metadata),
  createdAt: row.createdAt,
});

const encodeMessageCursor = (row: ChatMessageRow) => {
  const base = `${row.createdAt || ''}::${row.id}`;
  return btoa(base);
};

const decodeMessageCursor = (cursor: string) => {
  try {
    const decoded = atob(cursor);
    const [createdAt, id] = decoded.split('::');
    return { createdAt, id };
  } catch (_error) {
    return { createdAt: null, id: null };
  }
};

export const ensureUserInConversation = async (
  db: ReturnType<typeof getServerDB>,
  userId: string,
  conversationId: string,
) => {
  const member = await db
    .select()
    .from(conversationMembers)
    .where(
      and(
        eq(conversationMembers.conversationId, conversationId),
        eq(conversationMembers.userId, userId),
      ),
    )
    .get();

  if (!member) {
    throw new GraphQLError('FORBIDDEN_CONVERSATION_ACCESS');
  }

  return member;
};

const fetchConversationMembers = async (
  db: ReturnType<typeof getServerDB>,
  conversationIds: string[],
) => {
  if (conversationIds.length === 0) {
    return new Map<string, any[]>();
  }

  const rows = await db
    .select({
      conversationId: conversationMembers.conversationId,
      userId: users.id,
      username: users.username,
      email: users.email,
      publicKey: users.publicKey,
      status: users.status,
      createdAt: users.createdAt,
      displayName: profiles.displayName,
      phone: profiles.phone,
      avatarUrl: profiles.avatarUrl,
    })
    .from(conversationMembers)
    .innerJoin(users, eq(users.id, conversationMembers.userId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(inArray(conversationMembers.conversationId, conversationIds))
    .all();

  const map = new Map<string, any[]>();
  for (const row of rows) {
    const existing = map.get(row.conversationId) || [];
    existing.push(mapUserFromRow(row));
    map.set(row.conversationId, existing);
  }

  return map;
};

const loadConversationById = async (
  db: ReturnType<typeof getServerDB>,
  conversationId: string,
) => {
  const conversation = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .get();
  if (!conversation) {
    throw new GraphQLError('CONVERSATION_NOT_FOUND');
  }
  const membersMap = await fetchConversationMembers(db, [conversationId]);
  return mapConversation(conversation, membersMap.get(conversationId) || []);
};

export const myConversationsResolver = async (
  _parent: unknown,
  _args: unknown,
  context: GraphQLContext,
) => {
  const userId = requireUserId(context);
  await assertActiveUser(context);
  const db = getServerDB(context.env.DB);

  const rows = await db
    .select({
      id: conversations.id,
      kind: conversations.kind,
      tripId: conversations.tripId,
      title: conversations.title,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
      lastMessageAt: conversations.lastMessageAt,
      createdBy: conversations.createdBy,
    })
    .from(conversationMembers)
    .innerJoin(conversations, eq(conversationMembers.conversationId, conversations.id))
    .where(eq(conversationMembers.userId, userId))
    .orderBy(desc(conversations.updatedAt))
    .all();

  if (rows.length === 0) {
    return [];
  }

  const ids = rows.map((row) => row.id);
  const membersByConversation = await fetchConversationMembers(db, ids);

  return rows.map((row) => mapConversation(row, membersByConversation.get(row.id) || []));
};

export const conversationMessagesPageResolver = async (
  _parent: unknown,
  args: { conversationId: string; cursor?: string | null; limit?: number | null },
  context: GraphQLContext,
) => {
  const userId = requireUserId(context);
  await assertActiveUser(context);
  const db = getServerDB(context.env.DB);

  await ensureUserInConversation(db, userId, args.conversationId);

  let condition = eq(chatMessages.conversationId, args.conversationId);
  if (typeof args.cursor === 'string' && args.cursor.length > 0) {
    const { createdAt: cursorCreatedAt, id: cursorId } = decodeMessageCursor(args.cursor);
    if (cursorCreatedAt) {
      const createdBefore = lt(chatMessages.createdAt, cursorCreatedAt);
      const sameTimestampOlderId = and(
        eq(chatMessages.createdAt, cursorCreatedAt),
        lt(chatMessages.id, cursorId ?? ''),
      )!;
      const cursorFilter = or(createdBefore, sameTimestampOlderId)!;
      condition = and(condition, cursorFilter)!;
    }
  }

  const pageSize = Math.min(Math.max(args.limit ?? 50, 1), MAX_PAGE_SIZE);

  const rows = await db
    .select()
    .from(chatMessages)
    .where(condition)
    .orderBy(desc(chatMessages.createdAt))
    .limit(pageSize + 1)
    .all();

  const hasNextPage = rows.length > pageSize;
  const limitedRows = hasNextPage ? rows.slice(0, pageSize) : rows;
  const edges = limitedRows.map((row) => ({
    cursor: encodeMessageCursor(row),
    node: mapMessageRow(row),
  }));

  const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

  return {
    edges,
    pageInfo: {
      endCursor,
      hasNextPage,
    },
  };
};

const collectTripConversationMembers = async (
  db: ReturnType<typeof getServerDB>,
  tripId: string,
  includeUserIds: Set<string>,
) => {
  const acceptedParticipants = await db
    .select({
      userId: tripParticipants.userId,
    })
    .from(tripParticipants)
    .where(
      and(
        eq(tripParticipants.tripId, tripId),
        eq(tripParticipants.joinStatus, 'ACCEPTED'),
      ),
    )
    .all();

  for (const participant of acceptedParticipants) {
    includeUserIds.add(participant.userId);
  }
};

const findExistingDmConversation = async (
  db: ReturnType<typeof getServerDB>,
  userId: string,
  otherUserId: string,
) => {
  const candidateConversations = await db
    .select({
      conversationId: conversations.id,
    })
    .from(conversationMembers)
    .innerJoin(conversations, eq(conversationMembers.conversationId, conversations.id))
    .where(and(eq(conversationMembers.userId, userId), eq(conversations.kind, 'DM')))
    .all();

  if (candidateConversations.length === 0) {
    return null;
  }

  const candidateIds = candidateConversations.map((row) => row.conversationId);

  const sharedConversation = await db
    .select({
      conversationId: conversationMembers.conversationId,
    })
    .from(conversationMembers)
    .where(
      and(
        inArray(conversationMembers.conversationId, candidateIds),
        eq(conversationMembers.userId, otherUserId),
      ),
    )
    .get();

  if (!sharedConversation) {
    return null;
  }

  return loadConversationById(db, sharedConversation.conversationId);
};

const findSelfConversation = async (db: ReturnType<typeof getServerDB>, userId: string) => {
  const existing = await db
    .select({
      conversationId: conversations.id,
    })
    .from(conversations)
    .where(and(eq(conversations.createdBy, userId), eq(conversations.kind, 'SELF')))
    .get();

  if (!existing) {
    return null;
  }

  return loadConversationById(db, existing.conversationId);
};

export const createConversationResolver = async (
  _parent: unknown,
  args: { dmWithUserId?: string | null; tripId?: string | null; title?: string | null },
  context: GraphQLContext,
) => {
  const userId = requireUserId(context);
  await assertActiveUser(context);
  const db = getServerDB(context.env.DB);

  if (!args.dmWithUserId && !args.tripId && !args.title) {
    throw new GraphQLError('MISSING_CONVERSATION_TARGET');
  }

  let targetDmUserId = args.dmWithUserId ?? null;
  let isSelfConversation = false;

  if (targetDmUserId) {
    if (targetDmUserId === userId) {
      isSelfConversation = true;
      const existingSelf = await findSelfConversation(db, userId);
      if (existingSelf) {
        return existingSelf;
      }
      targetDmUserId = null;
    } else {
      const existing = await findExistingDmConversation(db, userId, targetDmUserId);
      if (existing) {
        return existing;
      }
    }
  }

let kind: 'DM' | 'TRIP' | 'GROUP' | 'SELF' = 'GROUP';
  let tripId: string | null = null;
  let title = args.title || null;
  const memberIds = new Set<string>();
  memberIds.add(userId);

  if (isSelfConversation) {
    kind = 'SELF';
    title = title || 'Private conversation';
  } else if (targetDmUserId) {
    kind = 'DM';
    memberIds.add(targetDmUserId);
  } else if (args.tripId) {
    kind = 'TRIP';
    tripId = args.tripId;
    const trip = await db.select().from(trips).where(eq(trips.id, tripId)).get();
    if (!trip) {
      throw new GraphQLError('TRIP_NOT_FOUND');
    }
    if (trip.userId !== userId) {
      const participant = await db
        .select()
        .from(tripParticipants)
        .where(
          and(eq(tripParticipants.tripId, trip.id), eq(tripParticipants.userId, userId)),
        )
        .get();
      if (!participant || participant.joinStatus !== 'ACCEPTED') {
        throw new GraphQLError('FORBIDDEN_TRIP_CONVERSATION_ACCESS');
      }
    }
    memberIds.add(trip.userId);
    await collectTripConversationMembers(db, trip.id, memberIds);
    title = title || trip.title || 'Trip chat';
  }

  const [conversation] = await db
    .insert(conversations)
    .values({
      id: createId(),
      kind,
      tripId,
      title,
      createdBy: userId,
    })
    .returning();

  if (!conversation) {
    throw new GraphQLError('CONVERSATION_CREATE_FAILED');
  }

  const values: (typeof conversationMembers.$inferInsert)[] = Array.from(memberIds).map((memberId) => ({
    id: createId(),
    conversationId: conversation.id,
    userId: memberId,
  }));

  if (values.length > 0) {
    await db.insert(conversationMembers).values(values);
  }

  return loadConversationById(db, conversation.id);
};

export const sendMessageResolver = async (
  _parent: unknown,
  args: {
    conversationId: string;
    ciphertext: string;
    ciphertextMeta?: any;
    type?: string | null;
    metadata?: any;
  },
  context: GraphQLContext,
) => {
  const userId = requireUserId(context);
  const deviceId = context.deviceId;
  if (!deviceId) {
    throw new GraphQLError('DEVICE_ID_REQUIRED');
  }
  await assertActiveUser(context);
  const db = getServerDB(context.env.DB);

  await ensureUserInConversation(db, userId, args.conversationId);

  const [message] = await db
    .insert(chatMessages)
    .values({
      id: createId(),
      conversationId: args.conversationId,
      senderUserId: userId,
      senderDeviceId: deviceId,
      ciphertext: args.ciphertext,
      ciphertextMeta: normalizeJsonInput(args.ciphertextMeta),
      type: args.type || 'text',
      metadata: normalizeJsonInput(args.metadata),
    })
    .returning();

  if (!message) {
    throw new GraphQLError('MESSAGE_SEND_FAILED');
  }

  await db
    .update(conversations)
    .set({
      updatedAt: sql`(CURRENT_TIMESTAMP)`,
      lastMessageAt: message.createdAt,
    })
    .where(eq(conversations.id, args.conversationId));

  const mappedMessage = mapMessageRow(message);
  context.publish(CONVERSATION_MESSAGES_TOPIC, {
    conversationMessages: mappedMessage,
  });

  return mappedMessage;
};

export const createChatInviteResolver = async (
  _parent: unknown,
  args: { conversationId: string; toUserId: string; inviteCiphertext: string },
  context: GraphQLContext,
) => {
  const userId = requireUserId(context);
  await assertActiveUser(context);
  const db = getServerDB(context.env.DB);

  await ensureUserInConversation(db, userId, args.conversationId);

  if (userId === args.toUserId) {
    throw new GraphQLError('CANNOT_INVITE_SELF');
  }

  await db.insert(chatInvites).values({
    id: createId(),
    conversationId: args.conversationId,
    fromUserId: userId,
    toUserId: args.toUserId,
    inviteCiphertext: args.inviteCiphertext,
  });

  return true;
};

export const ackChatInviteResolver = async (
  _parent: unknown,
  args: { inviteId: string; acceptCiphertext: string },
  context: GraphQLContext,
) => {
  const userId = requireUserId(context);
  await assertActiveUser(context);
  const db = getServerDB(context.env.DB);

  const invite = await db.select().from(chatInvites).where(eq(chatInvites.id, args.inviteId)).get();

  if (!invite) {
    throw new GraphQLError('INVITE_NOT_FOUND');
  }

  if (invite.toUserId !== userId) {
    throw new GraphQLError('FORBIDDEN_INVITE_ACK');
  }

  const conversationId = invite.conversationId;
  if (!conversationId) {
    throw new GraphQLError('INVITE_CONVERSATION_MISSING');
  }

  await ensureUserInConversation(db, invite.fromUserId, conversationId);

  try {
    const newMember: typeof conversationMembers.$inferInsert = {
      id: createId(),
      conversationId,
      userId,
    };
    await db
      .insert(conversationMembers)
      .values(newMember)
      .onConflictDoNothing({
        target: [conversationMembers.conversationId, conversationMembers.userId],
      });
  } catch {
    // Ignore unique violations (already a member)
  }

  await db
    .update(chatInvites)
    .set({
      status: 'ACCEPTED',
      acceptCiphertext: args.acceptCiphertext,
      updatedAt: sql`(CURRENT_TIMESTAMP)`,
    })
    .where(eq(chatInvites.id, args.inviteId));

  return true;
};

