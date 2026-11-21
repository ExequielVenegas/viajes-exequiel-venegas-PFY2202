import { gql } from '@apollo/client';
export const GET_TRAVEL_OPTIONS = gql`
  query GetTravelOptions($destinationId: ID!) {
    travelOptions(destinationId: $destinationId) {
      destinationId
      flights {
        id
        airline
        origin
        arrival
        departureDate
        returnDate
        price
        availableSeats
      }
      hotels {
        id
        name
        area
        stars
        pricePerNight
        checkIn
        checkOut
        availableRooms
      }
    }
  }
`;
