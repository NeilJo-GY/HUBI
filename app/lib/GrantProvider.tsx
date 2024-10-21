// GrantProvider.tsx
import React, { ReactNode, useMemo, useEffect, useState } from 'react';
import GrantContext, { Grant, UserGrantStatus } from './GrantContext';
import { useGrantData } from './useGrantData';
import { isEqual } from 'lodash';

interface GrantProviderProps {
    children: ReactNode;
    userAddress?: string;
}

export const GrantProvider: React.FC<GrantProviderProps> = ({ children, userAddress }) => {
    const {
        grants: rawGrants,
        currentId,
        userCurrentGrantStatus: rawUserCurrentGrantStatus,
        totalReservedAmount,
        userReservations,
        isLoading,
        isError,
        error,
        refetch
    } = useGrantData(userAddress);

    const [grants, setGrants] = useState<Grant[] | null>(null);
    const [userCurrentGrantStatus, setUserCurrentGrantStatus] = useState<UserGrantStatus | null>(null);

    useEffect(() => {
        if (rawGrants) {
            const processedGrants = rawGrants.map(grant => ({
                ...grant,
                status: grant.grantId === currentId ? 'current' :
                    grant.grantId < currentId ? 'past' : 'future'
            })) as Grant[];

            if (!isEqual(grants, processedGrants)) {
                setGrants(processedGrants);
            }
        } else {
            // 如果 rawGrants 为空，设置为 null
            setGrants(null);
        }
    }, [rawGrants, currentId, grants]);

    useEffect(() => {
        if (rawUserCurrentGrantStatus && userAddress) {
            if (!isEqual(userCurrentGrantStatus, rawUserCurrentGrantStatus)) {
                setUserCurrentGrantStatus(rawUserCurrentGrantStatus);
            }
        } else {
            // 如果用户未连接钱包，设置为 null
            setUserCurrentGrantStatus(null);
        }
    }, [rawUserCurrentGrantStatus, userCurrentGrantStatus, userAddress]);

    const contextValue = useMemo(() => ({
        grants,
        currentId,
        userCurrentGrantStatus,
        totalReservedAmount,
        userReservations,
        isLoading,
        error: isError ? error : null,
        refetch
    }), [grants, currentId, userCurrentGrantStatus, totalReservedAmount, userReservations, isLoading, isError, error, refetch]);

    return (
        <GrantContext.Provider value={contextValue}>
            {children}
        </GrantContext.Provider>
    );
};