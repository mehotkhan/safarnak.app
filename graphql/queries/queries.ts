// These queries will be wrapped with gql tag in the client
// The worker only needs the schema, not these queries

export const REGISTER_MUTATION = /* GraphQL */ `
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      user {
        id
        name
        email
        createdAt
      }
      token
    }
  }
`;

export const LOGIN_MUTATION = /* GraphQL */ `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        name
        email
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
      email
      createdAt
    }
  }
`;
