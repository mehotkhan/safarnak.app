// Shared GraphQL queries and mutations
// These are used by the client-side Apollo Client

export const REGISTER_MUTATION = /* GraphQL */ `
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      user {
        id
        name
        username
        createdAt
      }
      token
    }
  }
`;

export const LOGIN_MUTATION = /* GraphQL */ `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        name
        username
        createdAt
      }
      token
    }
  }
`;

export const GET_MESSAGES_QUERY = /* GraphQL */ `
  query GetMessages {
    getMessages {
      id
      content
      createdAt
    }
  }
`;

export const ADD_MESSAGE_MUTATION = /* GraphQL */ `
  mutation AddMessage($content: String!) {
    addMessage(content: $content) {
      id
      content
      createdAt
    }
  }
`;

export const ME_QUERY = /* GraphQL */ `
  query Me {
    me {
      id
      name
      username
      createdAt
    }
  }
`;
