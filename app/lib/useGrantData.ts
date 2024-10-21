// useGrantData.ts
import { useReadContracts } from 'wagmi';
import { config } from '@/app/lib/wagmi';
import { grantv1ABI, reservepregrantABI } from '@/app/lib/abi';
import { formatUnits } from 'viem';
import { useMemo, useCallback, useEffect } from 'react';

const sepoliaChainId = 11155111

const grantv1Contract = {
    address: '0x15e5449C5750B49F0B71dcCaBD87Cee81531bC82' as `0x${string}`,
    abi: grantv1ABI,
    chainId: sepoliaChainId,
} as const

const reservepregrantContract = {
    address: '0x54940600c7EBb651940b14Af13c06043ae709774' as `0x${string}`,
    abi: reservepregrantABI,
    chainId: sepoliaChainId,
} as const

export const useGrantData = (userAddress?: string) => {
    console.log("useGrantData called with userAddress:", userAddress);

    // First, we need to get the current grant ID
    const currentIdResult = useReadContracts({
        config: config,
        contracts: [
            {
                ...grantv1Contract,
                functionName: 'getCurrentId',
            },
        ],
    })

    const currentId = useMemo(() => {
        const id = currentIdResult.data?.[0] ? Number(currentIdResult.data[0].result) : 0;
        console.log("Raw currentId data:", currentIdResult.data?.[0]);
        console.log("Parsed Current ID:", id);
        if (isNaN(id)) {
            console.error("Failed to parse currentId, using default value 0");
            return 0;
        }
        return id;
    }, [currentIdResult.data])

    const grantIds = useMemo(() => {
        const ids = Array.from({ length: currentId + 2 }, (_, i) => i);
        console.log("Grant IDs:", ids);
        return ids;
    }, [currentId])

    const contracts = useMemo(() => grantIds.flatMap(grantId => [
        {
            ...grantv1Contract,
            functionName: 'getAmount',
            args: [] as const,
        },
        {
            ...grantv1Contract,
            functionName: 'getGrantTimestamps',
            args: [BigInt(grantId)] as const,
        },
        {
            ...reservepregrantContract,
            functionName: 'getReservationCount',
            args: [BigInt(grantId)] as const,
        },
        ...(userAddress ? [{
            ...reservepregrantContract,
            functionName: 'getReservedAmount',
            args: [userAddress, BigInt(grantId)] as const,
        }] : []),
    ]), [grantIds, userAddress]);

    const result = useReadContracts({
        config: config,
        contracts,
        allowFailure: false,
    })

    // 定义 refetch 函数
    const refetch = useCallback(() => {
        console.log("Refetching data...");
        currentIdResult.refetch()
        result.refetch()
    }, [currentIdResult, result])

    // 在这里添加 useEffect
    useEffect(() => {
        if (userAddress && currentId) {
            console.log("Refetching due to userAddress or currentId change");
            refetch();
        }
    }, [userAddress, currentId, refetch])

    const processData = useCallback((data: any[]) => {
        console.log("Processing data...");
        return grantIds.map((grantId, index) => {
            const baseIndex = index * (userAddress ? 4 : 3);
            const amount = data?.[baseIndex]
            const timestamps = data?.[baseIndex + 1]
            const reservationCount = data?.[baseIndex + 2]
            const reservedAmount = userAddress ? data?.[baseIndex + 3] : '0';

            const formattedAmount = amount ? formatUnits(amount, 18) : '0'
            const formattedReservedAmount = reservedAmount ? formatUnits(reservedAmount, 18) : '0'

            const grantData = {
                grantId,
                amount: formattedAmount,
                startTimestamp: timestamps ? Number(timestamps[0]) : 0,
                endTimestamp: timestamps ? Number(timestamps[1]) : 0,
                reservationCount: reservationCount ? Number(reservationCount) : 0,
                reservedAmount: formattedReservedAmount,
                totalReserved: Number(formattedAmount) * (reservationCount ? Number(reservationCount) : 0)
            };

            console.log(`Processed data for grant ${grantId}:`, grantData);

            return grantData;
        });
    }, [grantIds, userAddress]);

    const processedData = useMemo(() => {
        const data = result.data ? processData(result.data) : [];
        console.log("Processed data:", data);
        return data;
    }, [result.data, processData])

    const userReservations = useMemo(() => {
        if (!userAddress) {
            // 如果用户未连接钱包，返回空对象
            return {};
        }
        const reservations = processedData.reduce((acc, grant) => {
            acc[grant.grantId] = Number(grant.reservedAmount)
            return acc
        }, {} as Record<number, number>);
        console.log("User reservations:", reservations);
        return reservations;
    }, [processedData, userAddress])

    const totalReservedAmount = useMemo(() => {
        const total = processedData.reduce((total, grant) => total + Number(grant.reservedAmount), 0);
        console.log("Total reserved amount:", total);
        return total;
    }, [processedData])

    const userCurrentGrantStatus = useMemo(() => {
        if (!userAddress) {
            return null;
        }
        const currentGrant = processedData.find(grant => grant.grantId === currentId)
        const status = currentGrant ? {
            grantId: currentId,
            accountAddress: userAddress,
            reservedAmount: currentGrant.reservedAmount
        } : null;
        console.log("User current grant status:", status);
        return status;
    }, [processedData, currentId, userAddress])

    console.log("useGrantData return values:", {
        grants: processedData,
        currentId,
        userCurrentGrantStatus,
        totalReservedAmount,
        userReservations,
        isLoading: currentIdResult.isLoading || result.isLoading,
        isError: currentIdResult.isError || result.isError,
        error: currentIdResult.error || result.error,
    });

    return {
        grants: processedData,
        currentId,
        userCurrentGrantStatus,
        totalReservedAmount,
        userReservations,
        isLoading: currentIdResult.isLoading || result.isLoading,
        isError: currentIdResult.isError || result.isError,
        error: currentIdResult.error || result.error,
        refetch: useCallback(() => {
            currentIdResult.refetch()
            result.refetch()
        }, [currentIdResult, result])
    }
}