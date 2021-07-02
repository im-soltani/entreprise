export default {
  Query: {
    isLoggedIn: (_, {}, { getCacheKey }) =>
      getCacheKey({ __typename: "IsLoggedIn" }),
    KeyValue: (_, {}, { getCacheKey }) =>
      getCacheKey({ __typename: "KeyValue" })
  },
  Mutation: {
    setToken: (_, { token }, { cache }) => {
      localStorage.setItem("token", token);
      cache.writeData({
        data: {
          isLoggedIn: {
            __typename: "IsLoggedIn",
            isLoggedIn: !!token
          }
        }
      });
      return null;
    },
    setKeyName: (_, { KeyValue }, { cache }) => {
      cache.writeData({
        data: {
          KeyValue: {
            __typename: "KeyValue",
            KeyValue: KeyValue
          }
        }
      });
      return null;
    }
  }
};
