import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
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

export const LOGIN_MUTATION = gql`
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

export const GET_MESSAGES_QUERY = gql`
  query GetMessages {
    getMessages {
      id
      content
      createdAt
    }
  }
`;

export const ADD_MESSAGE_MUTATION = gql`
  mutation AddMessage($content: String!) {
    addMessage(content: $content) {
      id
      content
      createdAt
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      createdAt
    }
  }
`;
