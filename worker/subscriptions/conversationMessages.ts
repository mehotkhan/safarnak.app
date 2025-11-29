import { subscribe } from 'graphql-workers-subscriptions';
import { GraphQLError } from 'graphql/error';

import { getServerDB } from '@database/server';
import { ensureUserInConversation } from '../resolvers/messaging';
import type { GraphQLContext } from '../types';

export const conversationMessages = {
  subscribe: async (
    parent: unknown,
    args: { conversationId: string },
    context: GraphQLContext,
    info: any,
  ) => {
    if (!context.userId) {
      throw new GraphQLError('NOT_AUTHENTICATED');
    }
    const db = getServerDB(context.env.DB);
    await ensureUserInConversation(db, context.userId, args.conversationId);
    const handler = subscribe('CONVERSATION_MESSAGES', {
      filter: (payload: any) => {
        const messageConversationId = payload?.conversationMessages?.conversationId;
        if (!messageConversationId) {
          return;
        }
        if (messageConversationId !== args.conversationId) {
          return;
        }
        return payload;
      },
    });
    return handler(parent, args, context, info);
  },
  resolve: (payload: any) => payload.conversationMessages,
};

