import { buildSchema, GraphQLError } from 'graphql';
import { destinations, flights, hotels } from './data.js';
export const schema = buildSchema(`
  type Flight {
    id: ID!
    airline: String!
    origin: String!
    arrival: String!
    departureDate: String!
    returnDate: String!
    price: Int!
    availableSeats: Int!
  }
  type Hotel {
    id: ID!
    name: String!
    area: String!
    stars: Int!
    pricePerNight: Int!
    checkIn: String!
    checkOut: String!
    availableRooms: Int!
  }
  type TravelOptions {
    destinationId: ID!
    flights: [Flight!]!
    hotels: [Hotel!]!
  }
  type Query {
    travelOptions(destinationId: ID!): TravelOptions!
  }
`);
export const rootValue = {
  travelOptions({ destinationId }) {
    if (!destinations.some(destination => destination.id === destinationId)) {
      throw new GraphQLError('El destino que buscas no existe.', { extensions: { code: 'NOT_FOUND' } });
    }
    return { destinationId, flights: flights.filter(flight => flight.destinationId === destinationId), hotels: hotels.filter(hotel => hotel.destinationId === destinationId) };
  },
};
