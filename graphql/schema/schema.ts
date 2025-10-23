export const typeDefs = /* GraphQL */ `
  type Query {
    getMessages: [Message!]!
    me: User
  }
  type Mutation {
    addMessage(content: String!): Message!
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
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
    email: String!
    createdAt: String!
  }
  type AuthPayload {
    user: User!
    token: String!
  }
`;
