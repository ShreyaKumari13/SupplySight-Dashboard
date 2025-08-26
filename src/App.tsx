import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Dashboard />
      </div>
    </ApolloProvider>
  );
}

export default App;
