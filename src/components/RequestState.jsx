import { Link } from 'react-router-dom';
export default function RequestState({ loading, error, retry, label = 'Cargando información del viaje…' }) {
  if (loading) return <div className="request-state" role="status"><span className="spinner" aria-hidden="true" />{label}</div>;
  if (!error) return null;
  return <div className="request-state error" role="alert"><h2>No pudimos cargar la información</h2><p>{error}</p><div className="actions"><button className="button" onClick={retry}>Reintentar</button><Link to="/">Ver destinos</Link></div></div>;
}
