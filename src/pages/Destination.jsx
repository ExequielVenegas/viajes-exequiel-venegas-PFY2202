import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { useDestinations } from '../api/DestinationsContext';
import { GET_TRAVEL_OPTIONS } from '../api/queries.js';
import RequestState from '../components/RequestState';
import { FlightCard, HotelCard } from '../components/TravelCards';
export default function Destination() {
  const { destinationId } = useParams();
  return <DestinationView key={destinationId} destinationId={destinationId} />;
}
function DestinationView({ destinationId }) {
  const { destinations, loading, error, retry } = useDestinations();
  const destination = destinations.find(item => item.id === destinationId);
  if (loading || error) return <RequestState loading={loading} error={error?.message} retry={retry} label="Cargando destino…" />;
  if (!destination) return <section className="request-state"><h1>Destino no encontrado</h1><p>El destino que buscas no está en nuestro catálogo.</p><Link className="button" to="/">Ver destinos disponibles</Link></section>;
  return <><Link className="back-link" to="/">Todos los destinos</Link><section className="destination-intro"><p className="eyebrow">{destination.country}</p><h1>{destination.name}</h1><p>{destination.description}</p><ul className="activities">{destination.activities.map(activity => <li key={activity}>{activity}</li>)}</ul></section><TravelOptions destinationId={destinationId} /></>;
}
function TravelOptions({ destinationId }) {
  const { data, loading, error, refetch } = useQuery(GET_TRAVEL_OPTIONS, { variables: { destinationId } });
  const options = data?.travelOptions;
  return <><RequestState loading={loading} error={error ? 'No pudimos consultar los vuelos y hoteles. Comprueba tu conexión o inténtalo nuevamente.' : null} retry={() => { refetch().catch(() => {}); }} />{!loading && !error && options && <div className="travel-columns"><section aria-labelledby="flights-title"><div className="section-heading"><h2 id="flights-title">Vuelos</h2><span>Desde Santiago</span></div><div className="options-list">{options.flights.length ? options.flights.map(flight => <FlightCard key={flight.id} flight={flight} />) : <div className="empty-state"><h3>No hay vuelos disponibles</h3><p>Puedes revisar los alojamientos o explorar otro destino.</p><Link to="/">Explorar destinos</Link></div>}</div></section><section aria-labelledby="hotels-title"><div className="section-heading"><h2 id="hotels-title">Hoteles</h2><span>Estadías de 5 noches</span></div><div className="options-list">{options.hotels.length ? options.hotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />) : <div className="empty-state"><h3>No hay hoteles disponibles</h3><p>Puedes revisar los vuelos o explorar otro destino.</p><Link to="/">Explorar destinos</Link></div>}</div></section></div>}</>;
}
