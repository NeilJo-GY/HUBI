import { readContract, readContracts } from '@wagmi/core';
import { config } from '@/app/src/lib/wagmi';
import { pregrantABI, reservepregrantABI } from '@/app/src/lib/abi';
import { DBService } from '../services/dbService';
import { DBGrantData } from '@/app/api/testGrants/services/dbService';
import { formatEther } from 'viem';

const pregrantContract = {
  address: '0x32b5C3C43bEcadCdaF12dae12AB5FB2687326a9c',
  abi: pregrantABI,
  chainId: 11155111,
} as const;

const reservepregrantContract = {
  address: '0xc829A1C939EB5E9D441e61f4566a7322c0CE247f',
  abi: reservepregrantABI,
  chainId: 11155111,
} as const;

export async function syncGrantCycles(globalGrantId: number) {
  try {
    // 获取当前的 Grant ID
    const currentId = await readContract(config, {
      ...pregrantContract,
      functionName: 'getCurrentId',
    }) as bigint;

    // 获取静态数据（Amount）
    const amount = await readContract(config, {
      ...pregrantContract,
      functionName: 'getAmount',
    }) as bigint;

    console.log('Current Grant ID:', currentId);

    for (let i = 1; i < Number(currentId); i++) {
      // 获取每个 Grant 的时间戳和预留数量
      const [timestampsResult, reservationResult] = await readContracts(config, {
        contracts: [
          {
            ...pregrantContract,
            functionName: 'getGrantValidityPeriod',
            args: [BigInt(i)],
          },
          {
            ...reservepregrantContract,
            functionName: 'reservationCount',
            args: [BigInt(i)],
          },
        ],
      });

      const [startTimestamp, endTimestamp] =
        timestampsResult.status === 'success' ? (timestampsResult.result as [bigint, bigint]) : [BigInt(0), BigInt(0)];

      const reservationCount =
        reservationResult.status === 'success' ? (reservationResult.result as bigint) : BigInt(0);
      const grantTotalReserved = formatEther(reservationCount * amount);

      const grantCycle: DBGrantData = {
        grantId: i,
        globalGrantId,
        startTimestamp: Number(startTimestamp),
        endTimestamp: Number(endTimestamp),
        reservationCount: Number(reservationCount),
        grantTotalReserved
      }

      await DBService.upsertGrantCycle(grantCycle)

      console.log(`Grant ID ${i} synced: Start ${startTimestamp}, End ${endTimestamp}, ReservationCount ${reservationCount}, TotalReserved ${grantTotalReserved}`);
    }

    console.log('Grant cycles synced successfully.');
  } catch (error) {
    console.error('Error syncing grant cycles:', error);
    throw error;
  }
}