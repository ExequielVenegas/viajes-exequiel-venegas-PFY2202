import { useEffect } from 'react';
import { HashRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Destinations from './pages/Destinations';
import Destination from './pages/Destination';
function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { document.title = `${pathname === '/' ? 'Destinos' : pathname.startsWith('/destinos/') ? 'Planifica tu viaje' : 'Página no encontrada'} | Rumbo`; window.scrollTo(0, 0); }, [pathname]);
  return <><a className="skip-link" href="#contenido" onClick={event => { event.preventDefault(); document.getElementById('contenido').focus(); }}>Saltar al contenido</a><header className="header"><Link className="brand" to="/" aria-label="Rumbo, ir al inicio"><span className="brand-icon" aria-hidden="true">R</span><span>Rumbo<small>AGENCIA DE VIAJES</small></span></Link><nav aria-label="Navegación principal"><NavLink to="/" end>Destinos</NavLink></nav></header><main id="contenido" tabIndex={-1}><p className="demo-notice">Catálogo de demostración: destinos reales, ofertas y disponibilidad simuladas. No se realizan reservas ni pagos.</p><Routes><Route path="/" element={<Destinations />} /><Route path="/destinos/:destinationId" element={<Destination />} /><Route path="*" element={<section className="request-state"><h1>Esta página no existe</h1><Link className="button" to="/">Ver destinos</Link></section>} /></Routes></main><footer><span>Rumbo Viajes</span><span>Ideas para tu próxima aventura.</span></footer></>;
}
export default function App() { return <HashRouter><Layout /></HashRouter>; }
