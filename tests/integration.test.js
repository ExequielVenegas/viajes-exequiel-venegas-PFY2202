import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { setupServer } from 'msw/node';
import { http, HttpResponse, delay } from 'msw';
import { print } from 'graphql';
import { handlers } from '../src/mocks/handlers.js';
import { GET_TRAVEL_OPTIONS } from '../src/api/queries.js';
import { createTravelClient } from '../src/api/apollo.js';
import { createApiClient } from '../src/api/restClient.js';
const server = setupServer(...handlers);
before(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
after(() => server.close());
const endpoint = 'http://localhost:5173/graphql';
async function query(destinationId, source = print(GET_TRAVEL_OPTIONS)) {
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: source, variables: { destinationId } }) });
  return response.json();
}
test('REST entrega destinos con país y actividades', async () => {
  const result = await fetch('http://localhost:5173/api/destinations').then(response => response.json());
  assert.equal(result.length, 4);
  assert.ok(result.every(destination => destination.country && destination.activities.length > 0));
});
test('GraphQL obtiene vuelos y hoteles del destino con precios, fechas y disponibilidad', async () => {
  const result = await query('buenos-aires');
  assert.equal(result.errors, undefined);
  const options = result.data.travelOptions;
  assert.equal(options.destinationId, 'buenos-aires');
  assert.equal(options.flights.length, 2);
  assert.equal(options.hotels.length, 2);
  assert.ok(options.flights.every(flight => flight.price > 0 && flight.departureDate && flight.returnDate && flight.availableSeats >= 0));
  assert.ok(options.hotels.every(hotel => hotel.pricePerNight > 0 && hotel.checkIn && hotel.checkOut && hotel.availableRooms >= 0));
  assert.ok(options.flights.some(flight => flight.availableSeats === 0));
  assert.ok(options.hotels.some(hotel => hotel.availableRooms === 0));
});
test('cambiar el destino devuelve exclusivamente sus opciones', async () => {
  const result = await query('lima');
  assert.ok(result.data.travelOptions.flights.every(flight => flight.arrival.includes('Lima')));
  assert.equal(result.data.travelOptions.hotels.length, 2);
});
test('el esquema devuelve solo los campos solicitados', async () => {
  const result = await query('lima', 'query Small($destinationId: ID!) { travelOptions(destinationId: $destinationId) { hotels { name } } }');
  assert.deepEqual(Object.keys(result.data.travelOptions), ['hotels']);
  assert.deepEqual(Object.keys(result.data.travelOptions.hotels[0]), ['name']);
});
test('un destino sin vuelos conserva los hoteles', async () => {
  const result = await query('puerto-varas');
  assert.deepEqual(result.data.travelOptions.flights, []);
  assert.equal(result.data.travelOptions.hotels.length, 1);
});
test('un destino inexistente devuelve un error GraphQL', async () => {
  const result = await query('no-existe');
  assert.equal(result.errors[0].extensions.code, 'NOT_FOUND');
});
test('el esquema rechaza campos que no existen', async () => {
  const result = await query('lima', 'query Invalid { campoInexistente }');
  assert.ok(result.errors.length > 0);
});
test('Apollo reutiliza la consulta y recupera después de un error de servidor', async () => {
  const client = createTravelClient(endpoint);
  try {
    const options = { query: GET_TRAVEL_OPTIONS, variables: { destinationId: 'rio' } };
    await client.query(options);
    server.use(http.post('*/graphql', () => HttpResponse.json({}, { status: 500 })));
    assert.equal((await client.query(options)).data.travelOptions.destinationId, 'rio');
    await assert.rejects(client.query({ ...options, fetchPolicy: 'network-only' }));
    server.resetHandlers();
    assert.equal((await client.query({ ...options, fetchPolicy: 'network-only' })).data.travelOptions.destinationId, 'rio');
  } finally { client.stop(); }
});
test('REST controla errores de conexión y permite reintentar', async () => {
  const get = createApiClient('http://localhost:5173/');
  server.use(http.get('*/api/destinations', () => HttpResponse.error(), { once: true }));
  await assert.rejects(get('api/destinations'), error => error.status === 0);
  assert.equal((await get('api/destinations', { refresh: true })).length, 4);
});
test('REST comparte consultas simultáneas y conserva resultados recientes', async () => {
  const get = createApiClient('http://localhost:5173/dedup/');
  let requests = 0;
  server.use(http.get('*/api/destinations', async () => { requests++; await delay(20); return HttpResponse.json([]); }));
  await Promise.all([get('api/destinations'), get('api/destinations')]);
  await get('api/destinations');
  assert.equal(requests, 1);
});
