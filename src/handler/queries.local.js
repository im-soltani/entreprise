import gql from "graphql-tag";

export const IS_LOGGED_IN = gql`
  query {
    isLoggedIn @client {
      isLoggedIn
    }
  }
`;
export const GET_KEYVALUE = gql`
  query {
    KeyValue @client {
      KeyValue
    }
  }
`;
