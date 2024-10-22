// hooks/useReservations.ts
import { useState, useEffect, useCallback } from 'react';
import { useWatchContractEvent, usePublicClient } from 'wagmi';
import { reservepregrantABI } from '@/app/lib/abi';
import { formatUnits, Log, AbiEvent, decodeEventLog } from 'viem';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { sepolia } from 'wagmi/chains';

dayjs.extend(relativeTime);

export interface Reservation {
    id: number;
    userAddress: string;
    grantId: number;
    reservedAmount: string;
    timeAgo: string;
    addressLink: string;
    txLink: string;
    timestamp: number; // 添加时间戳用于排序
    transactionHash: `0x${string}`; // 修改类型为 `0x${string}`
    linkColor: string; // 添加 linkColor 属性
    createdAt: Date;
}

export function useReservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const publicClient = usePublicClient({ chainId: sepolia.id })!;

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

    // Function to generate Etherscan links
    const generateEtherscanLink = useCallback((type: 'address' | 'tx', value: string) => {
        const baseUrl = 'https://sepolia.etherscan.io';
        return type === 'address'
            ? `${baseUrl}/address/${value}`
            : `${baseUrl}/tx/${value}`;
    }, []);

    const formatTimeAgo = useCallback((timestamp: number) => {
        return dayjs(timestamp).fromNow();
    }, []);

    // Function to handle new logs
    const handleNewLogs = useCallback(
        async (logs: Log[]) => {
            if (!logs.length) return;
            console.log('New logs!', logs);

            const newReservations = await Promise.all(logs.map(async (log: Log) => {
                try {
                    const { transactionHash } = log;
                    if (!transactionHash) {
                        console.error('Transaction hash is null:', log);
                        return null;
                    }

                    // Fetch the transaction to get the block number
                    const tx = await publicClient.getTransaction({ hash: transactionHash });
                    if (!tx || !tx.blockNumber) return null;

                    const block = await publicClient.getBlock({ blockNumber: tx.blockNumber });
                    if (!block) return null;

                    const timestamp = Number(block.timestamp) * 1000;

                    // Decode the event log with specified eventName
                    const decodedLog = decodeEventLog({
                        abi: reservepregrantABI,
                        data: log.data,
                        topics: log.topics,
                        eventName: 'TokensReserved', // 指定事件名称
                    });

                    const { user, grantId, amount } = decodedLog.args;

                    // Create new reservation object
                    return {
                        userAddress: user as string,
                        grantId: Number(grantId),
                        reservedAmount: formatUnits(amount as bigint, 18),
                        timeAgo: formatTimeAgo(timestamp),
                        addressLink: generateEtherscanLink('address', user as string),
                        txLink: generateEtherscanLink('tx', transactionHash),
                        timestamp,
                        transactionHash: `0x${transactionHash.replace(/^0x/, '')}` as `0x${string}`,
                        linkColor: getRandomLinkColor(),
                        createdAt: new Date(timestamp),
                    };
                } catch (error) {
                    console.error('Error processing log:', error);
                    return null;
                }
            }));

            const validReservations = newReservations.filter(
                (res): res is Reservation => res !== null && res !== undefined
            );

            setReservations((prev) => {
                // Merge and remove duplicates based on transactionHash
                const combined = [...validReservations, ...prev];
                const uniqueReservations = combined.reduce<Reservation[]>((acc, current) => {
                    if (!acc.find((res) => res.transactionHash === current.transactionHash)) {
                        acc.push(current);
                    }
                    return acc;
                }, []);

                // Sort by timestamp and return latest 3 records
                return uniqueReservations.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);
            });
        },
        [publicClient, generateEtherscanLink, formatTimeAgo]
    );

    // Fetch past events when the component mounts
    useEffect(() => {
        const fetchReservationsFromDB = async () => {
            try {
                const response = await fetch('/app/api/reservations');
                const data: Reservation[] = await response.json();
                setReservations(data);
            } catch (error) {
                console.error('Error fetching reservations from DB:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReservationsFromDB();
    }, []);

    // Watch for contract events
    useWatchContractEvent({
        address: '0x54940600c7EBb651940b14Af13c06043ae709774',
        abi: reservepregrantABI,
        eventName: 'TokensReserved',
        onLogs: handleNewLogs,
        onError(error) {
            console.error('Error watching contract event:', error);
        },
    });

    return { reservations, isLoading };
}