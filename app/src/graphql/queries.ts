// src/graphql/queries.ts
import { gql } from '@apollo/client';
import { RESERVATION_FIELDS, RESERVATIONCOUNT_FIELDS } from './fragments';

export const GET_RESERVATIONS = gql`
  query GetReservations(
    $first: Int!,
    $skip: Int!,
    $orderBy: Reservation_orderBy!,
    $orderDirection: OrderDirection!
    $where: Reservation_filter
  ) {
    reservations(
      first: $first,
      skip: $skip,
      orderBy: $orderBy,
      orderDirection: $orderDirection,
      where: $where
    ) {
      id
      userAddress
      grantId
      reservedAmount
      timestamp
      transactionHash
    }
  }
  ${RESERVATION_FIELDS}
`;

export const GET_GRANTRESERVATIONCOUNTS = gql`
  query grantReservationCounts(
    $first: Int!,
    $skip: Int!,
    $orderBy: GrantReservationCount_orderBy!,
    $orderDirection: OrderDirection!,
    $where: GrantReservationCount_filter
  ) {
    grantReservationCounts(
      first: $first,
      skip: $skip,
      orderBy: $orderBy,
      orderDirection: $orderDirection,
      where: $where
    ) {
      id
      grantId
      reservationCount
    }
  }
  ${RESERVATIONCOUNT_FIELDS}
`;