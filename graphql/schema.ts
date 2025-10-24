// Shared GraphQL schema definition
// This file contains the GraphQL schema that both client and server use

export const typeDefs = /* GraphQL */ `
  type Query {
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
  }
`;
