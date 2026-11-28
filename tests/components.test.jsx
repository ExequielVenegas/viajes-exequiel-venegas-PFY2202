import { jest, describe, test, expect } from '@jest/globals';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RequestState from '../src/components/RequestState';
import { FlightCard, HotelCard } from '../src/components/TravelCards';
import { flights, hotels } from '../src/mocks/data.js';
describe('Estado de las peticiones', () => {
  test('informa la carga sin mostrar errores ni acciones', () => {
    render(<MemoryRouter><RequestState loading label="Buscando vuelos…" /></MemoryRouter>);
    expect(screen.getByRole('status')).toHaveTextContent('Buscando vuelos…');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  test('permite reintentar y ofrece volver a los destinos cuando hay un error', async () => {
    const retry = jest.fn();
    const user = userEvent.setup();
    render(<MemoryRouter><RequestState error="El servicio no responde." retry={retry} /></MemoryRouter>);
    expect(screen.getByRole('alert')).toHaveTextContent('El servicio no responde.');
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(retry).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'Ver destinos' })).toHaveAttribute('href', '/');
  });
  test('no agrega mensajes cuando la petición terminó correctamente', () => {
    const { container } = render(<RequestState loading={false} error={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
describe('Tarjetas de viaje', () => {
  test('presenta el vuelo con ruta, fechas, precio y asientos', () => {
    render(<FlightCard flight={flights[0]} />);
    const card = screen.getByRole('article');
    expect(within(card).getByRole('heading')).toHaveTextContent('Aerolínea Austral');
    expect(card).toHaveTextContent('Santiago (SCL) / Buenos Aires (EZE)');
    expect(card).toHaveTextContent('15 ene 2027');
    expect(card).toHaveTextContent('20 ene 2027');
    expect(card).toHaveTextContent('$189.990');
    expect(card).toHaveTextContent('8 asientos disponibles');
  });
  test('identifica un vuelo agotado', () => {
    render(<FlightCard flight={flights[1]} />);
    expect(screen.getByText('Agotado')).toBeInTheDocument();
    expect(screen.queryByText(/asientos disponibles/)).not.toBeInTheDocument();
  });
  test('presenta el hotel y calcula el total de la estadía', () => {
    render(<HotelCard hotel={hotels[0]} />);
    const card = screen.getByRole('article');
    expect(card).toHaveTextContent('Hotel Paseo del Río');
    expect(card).toHaveTextContent('Puerto Madero · 4 estrellas');
    expect(card).toHaveTextContent('5 habitaciones disponibles');
    expect(card).toHaveTextContent('$85.990');
    expect(card).toHaveTextContent('5 noches: $429.950 por habitación');
  });
  test('identifica un hotel sin habitaciones', () => {
    render(<HotelCard hotel={hotels[1]} />);
    expect(screen.getByText('Sin habitaciones')).toBeInTheDocument();
  });
});
