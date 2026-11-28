import { createContext, useContext, useEffect, useState } from 'react';
import { createApiClient } from './restClient.js';
const DestinationsContext = createContext(null);
export function DestinationsProvider({ children }) {
  const [get] = useState(() => createApiClient(new URL(import.meta.env.BASE_URL, window.location.href)));
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ destinations: [], loading: true, error: null });
  useEffect(() => {
    let active = true;
    setState(current => ({ ...current, loading: true, error: null }));
    get('api/destinations', { refresh: attempt > 0 }).then(
      destinations => { if (active) setState({ destinations, loading: false, error: null }); },
      error => { if (active) setState({ destinations: [], loading: false, error }); },
    );
    return () => { active = false; };
  }, [attempt, get]);
  return <DestinationsContext.Provider value={{ ...state, retry: () => setAttempt(value => value + 1) }}>{children}</DestinationsContext.Provider>;
}
export function useDestinations() { return useContext(DestinationsContext); }
