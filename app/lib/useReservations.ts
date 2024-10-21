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
    userAddress: string;
    grantId: number;
    reservedAmount: string;
    timeAgo: string;
    addressLink: string;
    txLink: string;
    timestamp: number; // 添加时间戳用于排序
    transactionHash: `0x${string}`; // 修改类型为 `0x${string}`
    linkColor: string; // 添加 linkColor 属性
}

export function useReservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
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
                    const transactionHash = log.transactionHash;
                    if (!transactionHash) {
                        console.error('Transaction hash is null:', log);
                        return null;
                    }

                    // Fetch the transaction to get the block number
                    const tx = await publicClient.getTransaction({
                        hash: transactionHash,
                    });
                    if (!tx) {
                        console.error('Transaction not found:', transactionHash);
                        return null;
                    }

                    // Fetch the block to get the timestamp
                    const blockNumber = tx.blockNumber;
                    if (!blockNumber) {
                        console.error('Block number is null:', tx);
                        return null;
                    }

                    const block = await publicClient.getBlock({
                        blockNumber: blockNumber,
                    });
                    if (!block) {
                        console.error('Block not found:', blockNumber);
                        return null;
                    }

                    const timestamp = Number(block.timestamp) * 1000; // Convert to milliseconds

                    // Decode the event log with specified eventName
                    const decodedLog = decodeEventLog({
                        abi: reservepregrantABI,
                        data: log.data,
                        topics: log.topics,
                        eventName: 'TokensReserved', // 指定事件名称
                    });

                    const { user, grantId, amount } = decodedLog.args;

                    return {
                        userAddress: user as string,
                        grantId: Number(grantId),
                        reservedAmount: formatUnits(amount as bigint, 18),
                        timeAgo: formatTimeAgo(timestamp),
                        addressLink: generateEtherscanLink('address', user as string),
                        txLink: generateEtherscanLink('tx', transactionHash),
                        timestamp, // 添加时间戳
                        transactionHash, // 添加交易哈希
                        linkColor: getRandomLinkColor(), // 分配随机颜色
                    };
                } catch (error) {
                    console.error('Error processing log:', error);
                    return null;
                }
            }));

            const validReservations = newReservations.filter(
                (res): res is Reservation => res !== null && res !== undefined
            );

            setReservations(prev => {
                // 合并新旧记录
                const combined: Reservation[] = [...validReservations, ...prev];

                // 去除重复记录，基于 transactionHash
                const uniqueReservations = combined.reduce<Reservation[]>((acc, current: Reservation) => {
                    const exists = acc.find(res => res.transactionHash === current.transactionHash);
                    if (!exists) {
                        acc.push(current);
                    }
                    return acc;
                }, []);

                // 按照时间戳从新到旧排序
                uniqueReservations.sort((a, b) => b.timestamp - a.timestamp);

                // 截取前3条记录
                const updated = uniqueReservations.slice(0, 3);

                return updated;
            });
        },
        [publicClient, generateEtherscanLink, formatTimeAgo]
    );

    // Fetch past events when the component mounts
    useEffect(() => {
        const fetchPastEvents = async () => {
            try {
                // 获取 TokensReserved 事件的 ABI 定义
                const tokensReservedEvent = reservepregrantABI.find(
                    (item) => item.type === 'event' && item.name === 'TokensReserved'
                ) as AbiEvent;

                const logs = await publicClient.getLogs({
                    address: '0x54940600c7EBb651940b14Af13c06043ae709774',
                    event: tokensReservedEvent,
                    fromBlock: BigInt(0), // Adjust the starting block if needed
                    toBlock: 'latest',
                });

                // 按照区块号和日志索引排序，确保顺序正确
                const sortedLogs = logs.sort((a, b) => {
                    if (b.blockNumber !== a.blockNumber) {
                        return Number(b.blockNumber - a.blockNumber);
                    } else {
                        return (b.logIndex || 0) - (a.logIndex || 0);
                    }
                });

                // Handle the fetched logs
                await handleNewLogs(sortedLogs);
            } catch (error) {
                console.error('Error fetching past events:', error);
            }
        };

        fetchPastEvents();
    }, [publicClient, handleNewLogs]);

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

    return reservations;
}