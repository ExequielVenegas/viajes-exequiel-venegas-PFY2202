import { describe, test, expect } from '@jest/globals';
import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { server } from './support/server.js';
import { renderApp } from './support/renderApp';
import { destinations } from '../src/mocks/data.js';
async function openDestination(user, name) {
  const heading = await screen.findByRole('heading', { name, exact: true });
  await user.click(within(heading.closest('article')).getByRole('link', { name: 'Ver vuelos y hoteles' }));
}
describe('Catálogo REST de destinos', () => {
  test('muestra la carga y después los destinos con países, actividades y enlaces', async () => {
    renderApp();
    expect(screen.getByRole('status')).toHaveTextContent('Cargando destinos');
    const title = await screen.findByRole('heading', { name: 'Buenos Aires', exact: true });
    const card = title.closest('article');
    expect(card).toHaveTextContent('Argentina');
    expect(card).toHaveTextContent('Recorrer San Telmo');
    expect(within(card).getByRole('link')).toHaveAttribute('href', '#/destinos/buenos-aires');
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(document.title).toBe('Destinos | Rumbo');
  });
  test('informa cuando no hay destinos', async () => {
    server.use(http.get('*/api/destinations', () => HttpResponse.json([])));
    renderApp();
    expect(await screen.findByRole('heading', { name: 'No hay destinos disponibles' })).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
  test('muestra un fallo REST y vuelve a consultar al reintentar', async () => {
    server.use(http.get('*/api/destinations', () => HttpResponse.json({}, { status: 500 }), { once: true }));
    const user = userEvent.setup();
    renderApp();
    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos consultar el catálogo');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Lima', exact: true })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  test('permite recuperarse de un error de red', async () => {
    server.use(http.get('*/api/destinations', () => HttpResponse.error(), { once: true }));
    const user = userEvent.setup();
    renderApp();
    expect(await screen.findByRole('alert')).toHaveTextContent('Comprueba tu conexión');
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByRole('heading', { name: 'Buenos Aires', exact: true })).toBeInTheDocument();
  });
});
describe('Opciones de viaje GraphQL', () => {
  test('navega al destino y presenta vuelos y hoteles con su disponibilidad', async () => {
    const user = userEvent.setup();
    renderApp();
    await openDestination(user, 'Buenos Aires');
    expect(screen.getByRole('status')).toHaveTextContent('Cargando información del viaje');
    const flights = await screen.findByRole('region', { name: 'Vuelos', exact: true });
    expect(flights).toHaveTextContent('8 asientos disponibles');
    expect(flights).toHaveTextContent('Agotado');
    expect(flights).toHaveTextContent('$189.990');
    const hotels = screen.getByRole('region', { name: 'Hoteles', exact: true });
    expect(hotels).toHaveTextContent('Hotel Paseo del Río');
    expect(hotels).toHaveTextContent('Sin habitaciones');
    expect(hotels).toHaveTextContent('5 noches: $429.950');
    expect(window.location.hash).toBe('#/destinos/buenos-aires');
    expect(document.title).toBe('Planifica tu viaje | Rumbo');
  });
  test('vuelve al listado y actualiza las opciones al seleccionar otro destino', async () => {
    const user = userEvent.setup();
    renderApp('/destinos/buenos-aires');
    await screen.findByRole('heading', { name: 'Hotel Paseo del Río' });
    await user.click(screen.getByRole('link', { name: 'Todos los destinos' }));
    await openDestination(user, 'Lima');
    expect(await screen.findByRole('heading', { name: 'Hotel Costa Serena' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Hotel Paseo del Río' })).not.toBeInTheDocument();
    expect(window.location.hash).toBe('#/destinos/lima');
  });
  test('mantiene los hoteles cuando no existen vuelos', async () => {
    renderApp('/destinos/puerto-varas');
    expect(await screen.findByRole('heading', { name: 'No hay vuelos disponibles' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Hostería del Lago' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explorar destinos' })).toHaveAttribute('href', '#/');
  });
  test('informa si un destino no tiene alojamientos', async () => {
    server.use(http.post('*/graphql', () => HttpResponse.json({ data: { travelOptions: { destinationId: 'rio', flights: [], hotels: [] } } })));
    renderApp('/destinos/rio');
    expect(await screen.findByRole('heading', { name: 'No hay hoteles disponibles' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'No hay vuelos disponibles' })).toBeInTheDocument();
  });
  test('gestiona errores HTTP de GraphQL y recupera los datos al reintentar', async () => {
    server.use(http.post('*/graphql', () => HttpResponse.json({}, { status: 503 }), { once: true }));
    const user = userEvent.setup();
    renderApp('/destinos/lima');
    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos consultar los vuelos y hoteles');
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Hotel Costa Serena' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  test('gestiona errores GraphQL aunque la respuesta HTTP sea exitosa', async () => {
    server.use(http.post('*/graphql', () => HttpResponse.json({ errors: [{ message: 'Servicio no disponible', extensions: { code: 'INTERNAL_SERVER_ERROR' } }] })));
    renderApp('/destinos/rio');
    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos consultar los vuelos y hoteles');
    expect(screen.queryByRole('region', { name: 'Hoteles' })).not.toBeInTheDocument();
  });
  test('reutiliza las respuestas de REST y Apollo al volver a un destino', async () => {
    let restRequests = 0;
    let graphqlRequests = 0;
    server.use(
      http.get('*/api/destinations', () => { restRequests++; return HttpResponse.json(destinations); }),
      http.post('*/graphql', async () => { graphqlRequests++; await delay(30); return HttpResponse.json({ data: { travelOptions: { destinationId: 'lima', flights: [], hotels: [] } } }); }),
    );
    const user = userEvent.setup();
    renderApp();
    await openDestination(user, 'Lima');
    await screen.findByRole('heading', { name: 'No hay hoteles disponibles' });
    await user.click(screen.getByRole('link', { name: 'Todos los destinos' }));
    await openDestination(user, 'Lima');
    await screen.findByRole('heading', { name: 'No hay hoteles disponibles' });
    expect(restRequests).toBe(1);
    expect(graphqlRequests).toBe(1);
  });
});
describe('Navegación y accesibilidad', () => {
  test('maneja un identificador de destino inexistente', async () => {
    renderApp('/destinos/no-existe');
    expect(await screen.findByRole('heading', { name: 'Destino no encontrado' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver destinos disponibles' })).toHaveAttribute('href', '#/');
  });
  test('muestra errores REST también cuando se abre directamente un destino', async () => {
    server.use(http.get('*/api/destinations', () => HttpResponse.json({}, { status: 500 })));
    renderApp('/destinos/lima');
    expect(screen.getByRole('status')).toHaveTextContent('Cargando destino');
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
  test('una ruta desconocida permite volver al catálogo', async () => {
    const user = userEvent.setup();
    renderApp('/otra-ruta');
    expect(screen.getByRole('heading', { name: 'Esta página no existe' })).toBeInTheDocument();
    expect(document.title).toBe('Página no encontrada | Rumbo');
    await user.click(screen.getByRole('link', { name: 'Ver destinos' }));
    expect(await screen.findByRole('heading', { name: 'Destinos para explorar' })).toBeInTheDocument();
  });
  test('el enlace de salto lleva el foco al contenido sin cambiar la ruta', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('link', { name: 'Saltar al contenido' }));
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus());
    expect(window.location.hash).toBe('#/');
    await screen.findByRole('heading', { name: 'Buenos Aires', exact: true });
  });
});
