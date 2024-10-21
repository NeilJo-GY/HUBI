// GrantContext.ts
import { createContext } from 'react';

export interface Grant {
  grantId: number;
  amount: string;
  startTimestamp: number;
  endTimestamp: number;
  reservationCount: number;
  reservedAmount: string;
  totalReserved: number;
  status: 'past' | 'current' | 'future';
}

export interface UserGrantStatus {
  grantId: number;
  accountAddress: string;
  reservedAmount: string;
}

interface GrantContextType {
  grants: Grant[] | null;
  currentId: number;
  userCurrentGrantStatus: UserGrantStatus | null;
  totalReservedAmount: number;
  userReservations: Record<number, number>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const GrantContext = createContext<GrantContextType>({
  grants: null,
  currentId: 0,
  userCurrentGrantStatus: null,
  totalReservedAmount: 0,
  userReservations: {},
  isLoading: true,
  error: null,
  refetch: () => {},
});

export default GrantContext;