import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { HashRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "../../scss/app.scss";
import Router from "./Router";
import ScrollToTop from "./ScrollToTop";
import { ApolloClient } from "apollo-client";
import { ApolloLink, from } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withClientState } from "apollo-link-state";
import { onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client";
import { ApolloProvider } from "react-apollo";
import resolvers from "../../handler/resolvers.local.js";
import { BASE_URL } from "../../handler/utils/constants";
import FallbackSpinner from "../../shared/components/FallbackSpinner";
import CookieConsent, { Cookies } from "react-cookie-consent";

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem("token") || null
    }
  }));

  return forward(operation);
});
const uploadLink = createUploadLink({
  uri: `${BASE_URL}/graphql`
});

const cache = new InMemoryCache({
  dataIdFromObject: object => object.id || null
});

const stateLink = withClientState({
  defaults: {
    isLoggedIn: {
      isLoggedIn: !!localStorage.getItem("token"),
      __typename: "IsLoggedIn"
    },
    KeyValue: {
      KeyValue: null,
      __typename: "KeyValue"
    }
  },
  cache
});

const errorLink = onError(
  ({ graphQLErrors, networkError, response, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations
          )}, Path: ${path}`
        )
      );
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }

    if (operation.operationName === "IgnoreErrorsQuery") {
      response.errors = null;
    }
  }
);

const client = new ApolloClient({
  link: from([errorLink, authMiddleware, stateLink, uploadLink]),
  resolvers,
  cache
});
export const clientLogout = () => client.cache.reset()
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loaded: false
    };
  }

  componentDidMount() {
    window.addEventListener("load", () => {
      this.setState({ loading: false });
      setTimeout(() => this.setState({ loaded: true }), 500);
    });
  }

  render() {
    const { loading } = this.state;
    Cookies.set("dash-entre", "done");
    return (
      <ApolloProvider client={client}>
        <HashRouter>
          <ScrollToTop>
            {loading && <FallbackSpinner />}
            <div>
              <Router />
            </div>
            <CookieConsent
              onAccept={() => { }}
              debug={false}
              enableDeclineButton
              declineButtonText="Refuser"
              buttonText="Accepter"
              buttonClasses="accept"
              declineButtonClasses="decline"
              onDecline={() => { }}>
              Ce site utilise des cookies pour améliorer l'expérience de
              l'utilisateur.
            </CookieConsent>
          </ScrollToTop>
        </HashRouter>
      </ApolloProvider>
    );
  }
}
export default hot(module)(App);
