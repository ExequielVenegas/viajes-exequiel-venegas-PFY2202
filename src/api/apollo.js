import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
export function createTravelClient(uri) {
  return new ApolloClient({
    link: new HttpLink({ uri, fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }) }),
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: { watchQuery: { fetchPolicy: 'cache-first', notifyOnNetworkStatusChange: true } },
  });
}
