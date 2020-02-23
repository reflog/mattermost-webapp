// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {hot} from 'react-hot-loader/root';
import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route} from 'react-router-dom';

import {ApolloProvider} from '@apollo/react-hooks';
import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import {getMainDefinition} from 'apollo-utilities';
import {WebSocketLink} from '@apollo/link-ws';

import {split} from 'apollo-link';

import {makeAsyncComponent} from 'components/async_load';
import store from 'stores/redux_store.jsx';
import {browserHistory} from 'utils/browser_history';

const httpLink = new HttpLink({
    uri: 'http://localhost:5000/graphql', // use https for secure endpoint
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: 'ws://localhost:5000/graphql', // use wss for a secure endpoint
    options: {
        reconnect: true
    }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(

    // split based on operation type
    ({query}) => {
        const {kind, operation} = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
);

// Instantiate client
const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
});

const LazyRoot = React.lazy(() => import('components/root'));

const Root = makeAsyncComponent(LazyRoot);

class App extends React.Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <Router history={browserHistory}>
                        <Route
                            path='/'
                            component={Root}
                        />
                    </Router>
                </Provider>
            </ApolloProvider>);
    }
}

export default hot(App);
