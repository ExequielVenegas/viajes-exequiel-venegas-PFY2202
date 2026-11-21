import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { createTravelClient } from './api/apollo.js';
import { DestinationsProvider } from './api/DestinationsContext';
import App from './App';
import './styles.css';
const root = createRoot(document.getElementById('root'));
async function start() {
  try {
    const { worker } = await import('./mocks/browser.js');
    const base = new URL(import.meta.env.BASE_URL, window.location.href);
    await worker.start({ serviceWorker: { url: new URL('mockServiceWorker.js', base).href }, onUnhandledRequest: 'bypass', quiet: true });
    const client = createTravelClient(new URL('graphql', base).href);
    root.render(<React.StrictMode><ApolloProvider client={client}><DestinationsProvider><App /></DestinationsProvider></ApolloProvider></React.StrictMode>);
  } catch {
    root.render(<main className="startup-error"><h1>No pudimos abrir el catálogo</h1><p>Recarga la página para volver a intentar la conexión.</p><button className="button" onClick={() => window.location.reload()}>Reintentar</button></main>);
  }
}
start();
