// RecentReservationList.tsx
'use client';

import React, { useMemo } from 'react';
import { ReservationType } from '@/app/src/hooks/useReservations';

interface RecentReservationListProps {
    reservations: ReservationType[];
}

const RecentReservationList: React.FC<RecentReservationListProps> = ({ reservations }) => {
    // 使用 useMemo 优化渲染性能
    const renderedReservations = useMemo(() => {
        if (!reservations || reservations.length === 0) {
            return (
                <p className="text-gray-400">No reservations found.</p>
            );
        }

        return reservations.map((reservation) => (
            <p
                key={reservation.transactionHash}
                className="text-base mb-2 text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis"
            >
                🎉{' '}
                <a
                    href={reservation.addressLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline cursor-pointer"
                    title={reservation.userAddress}
                    style={{ color: reservation.linkColor }} // 设置链接颜色
                >
                    {reservation.userAddress.slice(0, 4)}...{reservation.userAddress.slice(-2)}
                </a>{' '}
                successfully reserved {reservation.reservedAmount} UBI{' '}
                <a
                    href={reservation.txLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline cursor-pointer"
                    title="View Transaction"
                    style={{ color: reservation.linkColor }} // 设置链接颜色
                >
                    {reservation.timeAgo}
                </a>
            </p>
        ));
    }, [reservations]);


    return (
        <div className="mt-12 mb-8 text-left w-full max-w-lg bg-gray-900 rounded-lg px-4 py-2 shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-purple-400">Recent Reservations:</h3>
            {renderedReservations}
        </div>
    );
};

export default RecentReservationList;
