// RecentReservationList.tsx
import React, { useMemo } from 'react';
import { useReservations } from '@/app/lib/useReservations2';

export default function RecentReservationList() {
    const { reservations, isLoading } = useReservations();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (reservations.length === 0) {
        return (
            <div className="mt-12 mb-8 text-left w-full max-w-lg bg-gray-900 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-purple-400">Recent Reservations:</h3>
                <p className="text-gray-400">No reservations found.</p>
            </div>
        );
    }

    const renderedReservations = useMemo(
        () =>
            reservations.map((reservation) => (
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
            )),
        [reservations]
    );

    return (
        <div className="mt-12 mb-8 text-left w-full max-w-lg bg-gray-900 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Recent Reservations:</h3>
            {renderedReservations}
        </div>
    );
}