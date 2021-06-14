import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import apolloLogger from "apollo-link-logger";

import App from "./App";
function token() {
  localStorage.setItem("token", prompt("Введите токен", ""));
  window.location.reload();
}

const httpLink = new HttpLink({
  uri: "https://api.github.com/graphql",
  headers: {
    authorization: "Bearer " + localStorage.getItem("token")
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = ApolloLink.from([errorLink, apolloLogger, httpLink]);

const cache = new InMemoryCache({
  logger: console.log,
  loggerEnabled: true
});

const client = new ApolloClient({
  link,
  cache
});
ReactDOM.render(
  <ApolloProvider client={client}>
    <div align="center">
      <button onClick={() => token()}>Ввести токен</button>
    </div>

    <div align="center">
      {localStorage.getItem("token") !== null
        ? "Ваш токен: " + localStorage.getItem("token")
        : "Токен не введён"}
    </div>

    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
