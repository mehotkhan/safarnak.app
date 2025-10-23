export interface User {
  id: string;
  name: string;
  email: string;
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

// Query types
export interface GetMessagesQuery {
  getMessages: Message[];
}

export interface MeQuery {
  me: User | null;
}

// Mutation types
export interface RegisterMutation {
  register: AuthPayload;
}

export interface LoginMutation {
  login: AuthPayload;
}

export interface AddMessageMutation {
  addMessage: Message;
}

// Mutation input types
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AddMessageInput {
  content: string;
}
