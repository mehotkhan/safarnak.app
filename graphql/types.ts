// Shared TypeScript types for GraphQL
// These types are used by both client and server

export interface User {
  id: string;
  name: string;
  username: string;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}

// GraphQL Query/Mutation Types
export interface GetMessagesQuery {
  getMessages: Message[];
}

export interface MeQuery {
  me: User | null;
}

export interface RegisterMutation {
  register: AuthPayload;
}

export interface LoginMutation {
  login: AuthPayload;
}

export interface AddMessageMutation {
  addMessage: Message;
}

// Input Types
export interface RegisterInput {
  username: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface AddMessageInput {
  content: string;
}
