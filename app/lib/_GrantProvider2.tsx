// GrantProvider.tsx
import React, { ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GrantContext, { Grant, UserGrantStatus } from './GrantContext';
import { useGrantData } from './useGrantData';

const queryClient = new QueryClient();

interface GrantProviderProps {
    children: ReactNode;
    userAddress?: string;
}

export const GrantProvider: React.FC<GrantProviderProps> = ({ children, userAddress }) => {
    const grantData = useGrantData(userAddress);

    const contextValue = useMemo(() => ({
        ...grantData,
        grants: grantData.grants?.map((grant): Grant => ({
            ...grant,
            status: grant.grantId === grantData.currentId ? 'current' :
                grant.grantId < grantData.currentId ? 'past' : 'future'
        })) || null,
    }), [grantData]);

    return (
        <QueryClientProvider client={queryClient}>
            <GrantContext.Provider value={contextValue}>
                {children}
            </GrantContext.Provider>
        </QueryClientProvider>
    );
};