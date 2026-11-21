export const money = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
export function date(value) { return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`)); }
export function nights(checkIn, checkOut) { return Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000); }
