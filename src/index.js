/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import {ThemeProvider} from 'styled-components';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink, createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {onError} from 'apollo-link-error';
import setCookie from 'set-cookie-parser';
import {ApolloLink} from 'apollo-link';
import {ApolloProvider} from '@apollo/react-hooks';
import App from './App';
import {name as appName} from '../app.json';
import {darkTheme} from './helpers/themes';

import {API_URL} from 'react-native-dotenv';
import asyncCookie from './helpers/asyncCookie';

const httpLink = createHttpLink({
  uri: `${API_URL}/graphql`,
  credentials: 'include',
});

const responseLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(result => {
    const {headers} = operation.getContext().response;
    console.info(headers, result);
    const combinedCookieHeader = headers.get('set-cookie');
    asyncCookie.putTokenInStorage(combinedCookieHeader);
    return result;
  });
});

const link = responseLink.concat(httpLink);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const Root = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => Root);
