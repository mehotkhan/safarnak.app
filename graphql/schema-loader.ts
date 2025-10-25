// Read GraphQL schema from .graphql file
// This is used by the worker to load the schema at runtime

export const readGraphQLSchema = (): string => {
  // In Cloudflare Workers, we need to read the file differently
  // For now, we'll inline the schema content
  // In production, you might want to bundle this differently

  return `type Query {
  getMessages: [Message!]!
  me: User
}

type Mutation {
  addMessage(content: String!): Message!
  register(username: String!, password: String!): AuthPayload!
  login(username: String!, password: String!): AuthPayload!
}

type Subscription {
  newMessages: Message!
}

type Message {
  id: ID!
  content: String!
  createdAt: String!
}

type User {
  id: ID!
  name: String!
  username: String!
  createdAt: String!
}

type AuthPayload {
  user: User!
  token: String!
}`;
};
