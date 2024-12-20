import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type GrantReservationCount = {
  __typename?: 'GrantReservationCount';
  grantId: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  reservationCount: Scalars['BigInt']['output'];
};

export type GrantReservationCount_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GrantReservationCount_Filter>>>;
  grantId?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  grantId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_not?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GrantReservationCount_Filter>>>;
  reservationCount?: InputMaybe<Scalars['BigInt']['input']>;
  reservationCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reservationCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reservationCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reservationCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reservationCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reservationCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  reservationCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum GrantReservationCount_OrderBy {
  GrantId = 'grantId',
  Id = 'id',
  ReservationCount = 'reservationCount'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  grantReservationCount?: Maybe<GrantReservationCount>;
  grantReservationCounts: Array<GrantReservationCount>;
  reservation?: Maybe<Reservation>;
  reservations: Array<Reservation>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryGrantReservationCountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGrantReservationCountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GrantReservationCount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantReservationCount_Filter>;
};


export type QueryReservationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryReservationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Reservation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Reservation_Filter>;
};

export type Reservation = {
  __typename?: 'Reservation';
  grantId: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  reservedAmount: Scalars['BigInt']['output'];
  timestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  userAddress: Scalars['Bytes']['output'];
};

export type Reservation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Reservation_Filter>>>;
  grantId?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  grantId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_not?: InputMaybe<Scalars['BigInt']['input']>;
  grantId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Reservation_Filter>>>;
  reservedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  reservedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reservedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reservedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reservedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reservedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reservedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  reservedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Reservation_OrderBy {
  GrantId = 'grantId',
  Id = 'id',
  ReservedAmount = 'reservedAmount',
  Timestamp = 'timestamp',
  TransactionHash = 'transactionHash',
  UserAddress = 'userAddress'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  grantReservationCount?: Maybe<GrantReservationCount>;
  grantReservationCounts: Array<GrantReservationCount>;
  reservation?: Maybe<Reservation>;
  reservations: Array<Reservation>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionGrantReservationCountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGrantReservationCountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GrantReservationCount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantReservationCount_Filter>;
};


export type SubscriptionReservationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionReservationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Reservation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Reservation_Filter>;
};

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type ReservationFieldsFragment = { __typename?: 'Reservation', id: string, userAddress: any, grantId: any, reservedAmount: any, timestamp: any, transactionHash: any };

export type ReservationCountFieldsFragment = { __typename?: 'GrantReservationCount', id: string, grantId: any, reservationCount: any };

export type GetReservationsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy: Reservation_OrderBy;
  orderDirection: OrderDirection;
  where?: InputMaybe<Reservation_Filter>;
}>;


export type GetReservationsQuery = { __typename?: 'Query', reservations: Array<{ __typename?: 'Reservation', id: string, userAddress: any, grantId: any, reservedAmount: any, timestamp: any, transactionHash: any }> };

export type GrantReservationCountsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy: GrantReservationCount_OrderBy;
  orderDirection: OrderDirection;
  where?: InputMaybe<GrantReservationCount_Filter>;
}>;


export type GrantReservationCountsQuery = { __typename?: 'Query', grantReservationCounts: Array<{ __typename?: 'GrantReservationCount', id: string, grantId: any, reservationCount: any }> };

export const ReservationFieldsFragmentDoc = gql`
    fragment ReservationFields on Reservation {
  id
  userAddress
  grantId
  reservedAmount
  timestamp
  transactionHash
}
    `;
export const ReservationCountFieldsFragmentDoc = gql`
    fragment ReservationCountFields on GrantReservationCount {
  id
  grantId
  reservationCount
}
    `;
export const GetReservationsDocument = gql`
    query GetReservations($first: Int!, $skip: Int!, $orderBy: Reservation_orderBy!, $orderDirection: OrderDirection!, $where: Reservation_filter) {
  reservations(
    first: $first
    skip: $skip
    orderBy: $orderBy
    orderDirection: $orderDirection
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
    `;

/**
 * __useGetReservationsQuery__
 *
 * To run a query within a React component, call `useGetReservationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReservationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReservationsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetReservationsQuery(baseOptions: Apollo.QueryHookOptions<GetReservationsQuery, GetReservationsQueryVariables> & ({ variables: GetReservationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReservationsQuery, GetReservationsQueryVariables>(GetReservationsDocument, options);
      }
export function useGetReservationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReservationsQuery, GetReservationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReservationsQuery, GetReservationsQueryVariables>(GetReservationsDocument, options);
        }
export function useGetReservationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReservationsQuery, GetReservationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReservationsQuery, GetReservationsQueryVariables>(GetReservationsDocument, options);
        }
export type GetReservationsQueryHookResult = ReturnType<typeof useGetReservationsQuery>;
export type GetReservationsLazyQueryHookResult = ReturnType<typeof useGetReservationsLazyQuery>;
export type GetReservationsSuspenseQueryHookResult = ReturnType<typeof useGetReservationsSuspenseQuery>;
export type GetReservationsQueryResult = Apollo.QueryResult<GetReservationsQuery, GetReservationsQueryVariables>;
export const GrantReservationCountsDocument = gql`
    query grantReservationCounts($first: Int!, $skip: Int!, $orderBy: GrantReservationCount_orderBy!, $orderDirection: OrderDirection!, $where: GrantReservationCount_filter) {
  grantReservationCounts(
    first: $first
    skip: $skip
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
  ) {
    id
    grantId
    reservationCount
  }
}
    `;

/**
 * __useGrantReservationCountsQuery__
 *
 * To run a query within a React component, call `useGrantReservationCountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGrantReservationCountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGrantReservationCountsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGrantReservationCountsQuery(baseOptions: Apollo.QueryHookOptions<GrantReservationCountsQuery, GrantReservationCountsQueryVariables> & ({ variables: GrantReservationCountsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GrantReservationCountsQuery, GrantReservationCountsQueryVariables>(GrantReservationCountsDocument, options);
      }
export function useGrantReservationCountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GrantReservationCountsQuery, GrantReservationCountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GrantReservationCountsQuery, GrantReservationCountsQueryVariables>(GrantReservationCountsDocument, options);
        }
export function useGrantReservationCountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GrantReservationCountsQuery, GrantReservationCountsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GrantReservationCountsQuery, GrantReservationCountsQueryVariables>(GrantReservationCountsDocument, options);
        }
export type GrantReservationCountsQueryHookResult = ReturnType<typeof useGrantReservationCountsQuery>;
export type GrantReservationCountsLazyQueryHookResult = ReturnType<typeof useGrantReservationCountsLazyQuery>;
export type GrantReservationCountsSuspenseQueryHookResult = ReturnType<typeof useGrantReservationCountsSuspenseQuery>;
export type GrantReservationCountsQueryResult = Apollo.QueryResult<GrantReservationCountsQuery, GrantReservationCountsQueryVariables>;