import { render } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client/react';
import { createTravelClient } from '../../src/api/apollo.js';
import { DestinationsProvider } from '../../src/api/DestinationsContext';
import App from '../../src/App';
import { afterEach } from '@jest/globals';
const clients = [];
afterEach(() => { clients.splice(0).forEach(client => client.stop()); });
export function renderApp(path = '/') {
  window.history.replaceState(null, '', `/#${path}`);
  const client = createTravelClient('http://localhost:5173/graphql');
  clients.push(client);
  const view = render(<ApolloProvider client={client}><DestinationsProvider><App /></DestinationsProvider></ApolloProvider>);
  return { ...view, client };
}
