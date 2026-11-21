export const destinations = [
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', region: 'Ciudad y cultura', description: 'Cafés de barrio, librerías y paseos junto al río.', activities: ['Recorrer San Telmo', 'Visitar el Teatro Colón', 'Pasear por Puerto Madero'] },
  { id: 'lima', name: 'Lima', country: 'Perú', region: 'Gastronomía y costa', description: 'Sabores, historia y atardeceres frente al Pacífico.', activities: ['Conocer el centro histórico', 'Pasear por Miraflores', 'Explorar Barranco'] },
  { id: 'rio', name: 'Río de Janeiro', country: 'Brasil', region: 'Playa y naturaleza', description: 'Playas, miradores y senderos rodeados de vegetación.', activities: ['Subir al Pan de Azúcar', 'Caminar por Copacabana', 'Visitar el Jardín Botánico'] },
  { id: 'puerto-varas', name: 'Puerto Varas', country: 'Chile', region: 'Lagos y volcanes', description: 'Paisajes del sur para recorrer sin prisa.', activities: ['Visitar los Saltos del Petrohué', 'Pasear junto al lago Llanquihue', 'Explorar el parque Vicente Pérez Rosales'] },
];
export const flights = [
  { id: 'ba-1', destinationId: 'buenos-aires', airline: 'Aerolínea Austral', origin: 'Santiago (SCL)', arrival: 'Buenos Aires (EZE)', departureDate: '2027-01-15', returnDate: '2027-01-20', price: 189990, availableSeats: 8 },
  { id: 'ba-2', destinationId: 'buenos-aires', airline: 'Vientos del Sur', origin: 'Santiago (SCL)', arrival: 'Buenos Aires (AEP)', departureDate: '2027-01-15', returnDate: '2027-01-20', price: 164990, availableSeats: 0 },
  { id: 'li-1', destinationId: 'lima', airline: 'Aerolínea Austral', origin: 'Santiago (SCL)', arrival: 'Lima (LIM)', departureDate: '2027-01-15', returnDate: '2027-01-20', price: 219990, availableSeats: 12 },
  { id: 'li-2', destinationId: 'lima', airline: 'Vientos del Sur', origin: 'Santiago (SCL)', arrival: 'Lima (LIM)', departureDate: '2027-01-15', returnDate: '2027-01-20', price: 249990, availableSeats: 4 },
  { id: 'ri-1', destinationId: 'rio', airline: 'Vientos del Sur', origin: 'Santiago (SCL)', arrival: 'Río de Janeiro (GIG)', departureDate: '2027-01-15', returnDate: '2027-01-20', price: 329990, availableSeats: 6 },
];
export const hotels = [
  { id: 'ba-h1', destinationId: 'buenos-aires', name: 'Hotel Paseo del Río', area: 'Puerto Madero', stars: 4, pricePerNight: 85990, checkIn: '2027-01-15', checkOut: '2027-01-20', availableRooms: 5 },
  { id: 'ba-h2', destinationId: 'buenos-aires', name: 'Posada del Centro', area: 'San Telmo', stars: 3, pricePerNight: 55990, checkIn: '2027-01-15', checkOut: '2027-01-20', availableRooms: 0 },
  { id: 'li-h1', destinationId: 'lima', name: 'Hotel Costa Serena', area: 'Miraflores', stars: 4, pricePerNight: 75990, checkIn: '2027-01-15', checkOut: '2027-01-20', availableRooms: 7 },
  { id: 'li-h2', destinationId: 'lima', name: 'Casa Barranco', area: 'Barranco', stars: 3, pricePerNight: 62990, checkIn: '2027-01-15', checkOut: '2027-01-20', availableRooms: 2 },
  { id: 'ri-h1', destinationId: 'rio', name: 'Hotel Brisa del Mar', area: 'Copacabana', stars: 4, pricePerNight: 99990, checkIn: '2027-01-15', checkOut: '2027-01-20', availableRooms: 3 },
  { id: 'pv-h1', destinationId: 'puerto-varas', name: 'Hostería del Lago', area: 'Costanera', stars: 3, pricePerNight: 68990, checkIn: '2027-01-15', checkOut: '2027-01-20', availableRooms: 4 },
];
