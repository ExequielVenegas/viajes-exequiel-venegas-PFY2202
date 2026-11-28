const lifetime = 60_000;
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
export function createApiClient(baseUrl) {
  const cache = new Map();
  const pending = new Map();
  return function getResource(path, { refresh = false } = {}) {
    const url = new URL(path, baseUrl).href;
    if (pending.has(url)) return pending.get(url);
    const stored = cache.get(url);
    if (!refresh && stored && Date.now() - stored.time < lifetime) return Promise.resolve(stored.data);
    const request = (async () => {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(10_000), headers: { Accept: 'application/json' } });
        if (!response.ok) {
          const message = response.status === 404 ? 'No encontramos la información del destino.' : response.status >= 500 ? 'No pudimos consultar el catálogo. Inténtalo nuevamente.' : 'No se pudo completar la consulta.';
          throw new ApiError(message, response.status);
        }
        const data = await response.json();
        cache.set(url, { data, time: Date.now() });
        return data;
      } catch (error) {
        if (error instanceof ApiError) throw error;
        if (error.name === 'TimeoutError') throw new ApiError('La consulta está tardando demasiado. Vuelve a intentarlo.', 0);
        throw new ApiError('No pudimos conectar con el catálogo. Comprueba tu conexión y vuelve a intentarlo.', 0);
      } finally {
        pending.delete(url);
      }
    })();
    pending.set(url, request);
    return request;
  };
}
