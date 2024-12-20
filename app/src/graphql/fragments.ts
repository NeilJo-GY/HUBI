// src/graphql/fragments.ts
import { gql } from '@apollo/client';

export const RESERVATION_FIELDS = gql`
  fragment ReservationFields on Reservation {
    id
    userAddress
    grantId
    reservedAmount
    timestamp
    transactionHash
  }
`;

export const RESERVATIONCOUNT_FIELDS = gql`
  fragment ReservationCountFields on GrantReservationCount {
    id
    grantId
    reservationCount
  }
`;