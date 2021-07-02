import gql from "graphql-tag";

export const SET_TOKEN = gql`
  mutation setToken($token: String = null) {
    setToken(token: $token) @client
  }
`;
export const SET_KEYVALUE = gql`
  mutation setKeyName($KeyValue: KeyValue = null) {
    setKeyName(KeyValue: $KeyValue) @client
  }
`;
