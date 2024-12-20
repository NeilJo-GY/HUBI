// hooks/useReservations.ts
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';
import { formatUnits } from 'viem';
import debounce from 'lodash/debounce';

import { GET_RESERVATIONS } from '@/app/src/graphql/queries';
import {
    GetReservationsQuery,
    GetReservationsQueryVariables,
    Reservation_OrderBy,
    OrderDirection,
    ReservationFieldsFragment,
} from '@/app/src/generated/graphql';

dayjs.extend(relativeTime);

// 定义接口
export interface ReservationType {
    userAddress: string;
    grantId: number;
    reservedAmount: string;
    timeAgo: string;
    addressLink: string;
    txLink: string;
    timestamp: number;
    transactionHash: `0x${string}`;
    linkColor: string;
}

// 定义颜色列表和获取随机颜色的函数
const linkColors = [
    '#1abc9c', // Turquoise
    '#2ecc71', // Emerald
    '#3498db', // Peter River
    '#9b59b6', // Amethyst
    '#34495e', // Wet Asphalt
    '#16a085', // Green Sea
    '#27ae60', // Nephritis
    '#2980b9', // Belize Hole
    '#8e44ad', // Wisteria
    '#2c3e50', // Midnight Blue
    '#f1c40f', // Sun Flower
    '#e67e22', // Carrot
    '#e74c3c', // Alizarin
    '#95a5a6', // Concrete
    '#f39c12', // Orange
    '#d35400', // Pumpkin
    '#c0392b', // Pomegranate
    '#7f8c8d', // Asbestos
];

function getRandomLinkColor(): string {
    return linkColors[Math.floor(Math.random() * linkColors.length)];
}

interface ReservationsOptions {
    first?: number;
    skip?: number;
    orderBy?: Reservation_OrderBy;
    orderDirection?: OrderDirection;
    grantId?: bigint;
    userAddress?: string;
    isCurrentGrant?: boolean;
}

export function useReservations(options?: ReservationsOptions) {
    const {
        first = 3,
        skip = 0,
        orderBy = Reservation_OrderBy.Timestamp,
        orderDirection = OrderDirection.Desc,
        grantId,
        userAddress,
        isCurrentGrant = false
    } = options || {};

    // 使用防抖包装数据刷新
    const debouncedRefetch = useMemo(
        () => debounce((refetchFn) => {
            console.time('query-execution');
            refetchFn().then(() => {
                console.timeEnd('query-execution');
            });
        }, 1000),
        []
    );

    // 定义查询变量，条件性地添加 grantId
    const variables: GetReservationsQueryVariables = {
        first,
        skip,
        orderBy,
        orderDirection,
        where: {
            ...(grantId && { grantId: grantId.toString() }),
            ...(userAddress && { userAddress: userAddress.toLowerCase() })
        }
    };

    // 使用 Apollo Client 的 useQuery 钩子发送 GraphQL 查询
    const { loading, error, data, refetch } = useQuery<GetReservationsQuery, GetReservationsQueryVariables>(
        GET_RESERVATIONS,
        {
            variables,
            pollInterval: isCurrentGrant ? 30000 : 0, // 每30秒轮询一次
            fetchPolicy: 'cache-and-network', // 根据需求调整
            errorPolicy: 'all', // 接收部分错误数据
        }
    );

    // 使用 useMemo 优化数据处理
    const reservations: ReservationType[] = useMemo(() => {
        if (loading || error || !data) return [];

        return data.reservations.map((reservation: ReservationFieldsFragment) => {
            const timestampMs = Number(reservation.timestamp) * 1000; // 转换为毫秒

            return {
                userAddress: reservation.userAddress,
                grantId: reservation.grantId,
                reservedAmount: formatUnits(BigInt(reservation.reservedAmount), 18),
                timeAgo: dayjs(timestampMs).fromNow(),
                addressLink: `https://sepolia.etherscan.io/address/${reservation.userAddress}`,
                txLink: `https://sepolia.etherscan.io/tx/${reservation.transactionHash}`,
                timestamp: timestampMs,
                transactionHash: reservation.transactionHash as `0x${string}`,
                linkColor: getRandomLinkColor(),
            };
        });
    }, [data, loading, error]);

    // 处理用户预订数据
    const userReservations = useMemo(() => {
        if (!userAddress || !reservations.length) return {};

        return reservations.reduce((acc, reservation) => {
            if (reservation.userAddress.toLowerCase() === userAddress.toLowerCase()) {
                const grantId = reservation.grantId;
                const reservedAmount = Number(reservation.reservedAmount);
                acc[grantId] = reservedAmount;
            }
            return acc;
        }, {} as Record<number, number>);
    }, [reservations, userAddress]);

    // 计算用户总预订金额
    const userTotalReserved = useMemo(() => {
        return Object.values(userReservations).reduce((sum, amount) => sum + amount, 0);
    }, [userReservations]);

    // 汇总统计数据
    const stats = useMemo(() => {
        if (!reservations.length) return {
            totalReservations: 0,
            uniqueUsers: new Set(),
            totalAmount: 0
        };

        return reservations.reduce((acc, reservation) => {
            acc.totalReservations++;
            acc.uniqueUsers.add(reservation.userAddress);
            acc.totalAmount += Number(reservation.reservedAmount);
            return acc;
        }, {
            totalReservations: 0,
            uniqueUsers: new Set<string>(),
            totalAmount: 0
        });
    }, [reservations]);

    return {
        // 基础数据
        reservations,
        loading,
        error,

        // 用户相关数据
        userReservations,
        userTotalReserved,

        // 统计数据
        stats: {
            totalReservations: stats.totalReservations,
            uniqueUsers: stats.uniqueUsers.size,
            totalAmount: stats.totalAmount
        },

        refresh: () => debouncedRefetch(refetch)
    };
}