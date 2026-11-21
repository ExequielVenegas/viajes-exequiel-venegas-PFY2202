import { money, date, nights } from '../format.js';
export function FlightCard({ flight }) {
  return <article className="option-card"><div className="card-heading"><h3>{flight.airline}</h3><span className={`badge ${flight.availableSeats ? '' : 'unavailable'}`}>{flight.availableSeats ? `${flight.availableSeats} asientos disponibles` : 'Agotado'}</span></div><p className="route">{flight.origin} / {flight.arrival}</p><dl><div><dt>Ida</dt><dd>{date(flight.departureDate)}</dd></div><div><dt>Regreso</dt><dd>{date(flight.returnDate)}</dd></div></dl><p className="price">{money.format(flight.price)} <small>por persona · ida y vuelta</small></p></article>;
}
export function HotelCard({ hotel }) {
  const stay = nights(hotel.checkIn, hotel.checkOut);
  return <article className="option-card"><div className="card-heading"><h3>{hotel.name}</h3><span className={`badge ${hotel.availableRooms ? '' : 'unavailable'}`}>{hotel.availableRooms ? `${hotel.availableRooms} habitaciones disponibles` : 'Sin habitaciones'}</span></div><p className="route">{hotel.area} · {hotel.stars} estrellas</p><dl><div><dt>Entrada</dt><dd>{date(hotel.checkIn)}</dd></div><div><dt>Salida</dt><dd>{date(hotel.checkOut)}</dd></div></dl><p className="price">{money.format(hotel.pricePerNight)} <small>por habitación / noche</small></p><p className="stay-total">{stay} noches: {money.format(hotel.pricePerNight * stay)} por habitación</p></article>;
}
