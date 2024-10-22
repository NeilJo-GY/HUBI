import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { formatUnits } from 'viem';
import { usePublicClient } from 'wagmi';
import { grantv1ABI, reservepregrantABI } from '@/app/lib/abi';
import { sepolia } from 'wagmi/chains';

const grantv1Address = '0x15e5449C5750B49F0B71dcCaBD87Cee81531bC82';
const reservepregrantAddress = '0x54940600c7EBb651940b14Af13c06043ae709774';

export const useGrantData = (userAddress?: string) => {
    const publicClient = usePublicClient({ chainId: sepolia.id })!;

    const currentIdQuery = useQuery({
        queryKey: ['currentId'],
        queryFn: async () => {
            const data = await publicClient.readContract({
                address: grantv1Address,
                abi: grantv1ABI,
                functionName: 'getCurrentId',
            });
            return Number(data);
        },
    });

    const grantQueries = useQueries({
        queries: (currentIdQuery.data ? [...Array(currentIdQuery.data + 1).keys()] : []).map(
            (grantId) => ({
                queryKey: ['grant', grantId, userAddress],
                queryFn: async () => {
                    const [amount, timestamps, reservationCount, reservedAmount] = await Promise.all([
                        publicClient.readContract({
                            address: grantv1Address,
                            abi: grantv1ABI,
                            functionName: 'getAmount',
                        }),
                        publicClient.readContract({
                            address: grantv1Address,
                            abi: grantv1ABI,
                            functionName: 'getGrantTimestamps',
                            args: [BigInt(grantId)],
                        }),
                        publicClient.readContract({
                            address: reservepregrantAddress,
                            abi: reservepregrantABI,
                            functionName: 'getReservationCount',
                            args: [BigInt(grantId)],
                        }),
                        userAddress
                            ? publicClient.readContract({
                                address: reservepregrantAddress,
                                abi: reservepregrantABI,
                                functionName: 'getReservedAmount',
                                args: [userAddress as `0x${string}`, BigInt(grantId)],
                            })
                            : Promise.resolve('0'),
                    ]);

                    return {
                        grantId,
                        amount: formatUnits(amount, 18),
                        startTimestamp: Number(timestamps[0]),
                        endTimestamp: Number(timestamps[1]),
                        reservationCount: Number(reservationCount),
                        reservedAmount: formatUnits(BigInt(reservedAmount), 18),
                        totalReserved: Number(formatUnits(amount, 18)) * Number(reservationCount),
                    };
                },
                enabled: !!currentIdQuery.data,
            })
        ),
    });

    // 使用 useMemo 来缓存计算结果
    const processedData = useMemo(() =>
        grantQueries
            .map((query) => query.data)
            .filter((data): data is NonNullable<typeof data> => data != null),
        [grantQueries]
    );

    const userReservations = useMemo(() =>
        userAddress
            ? Object.fromEntries(
                processedData.map((grant) => [grant.grantId, Number(grant.reservedAmount ?? 0)])
            )
            : {},
        [userAddress, processedData]
    );

    const totalReservedAmount = useMemo(() =>
        processedData.reduce(
            (total, grant) => total + Number(grant.reservedAmount ?? 0),
            0
        ),
        [processedData]
    );

    const userCurrentGrantStatus = useMemo(() =>
        userAddress && currentIdQuery.data
            ? processedData.find((grant) => grant.grantId === currentIdQuery.data)
                ? {
                    grantId: currentIdQuery.data,
                    accountAddress: userAddress,
                    reservedAmount: processedData.find((grant) => grant.grantId === currentIdQuery.data)?.reservedAmount ?? '0',
                }
                : null
            : null,
        [userAddress, currentIdQuery.data, processedData]
    );

    const refetch = useCallback(() => {
        currentIdQuery.refetch();
        grantQueries.forEach((query) => query.refetch());
    }, [currentIdQuery, grantQueries]);

    return {
        grants: processedData,
        currentId: currentIdQuery.data,
        userCurrentGrantStatus,
        totalReservedAmount,
        userReservations,
        isLoading: currentIdQuery.isLoading || grantQueries.some((query) => query.isLoading),
        isError: currentIdQuery.isError || grantQueries.some((query) => query.isError),
        error: currentIdQuery.error || grantQueries.find((query) => query.error)?.error,
        refetch,
    };
};