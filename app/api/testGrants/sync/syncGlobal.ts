import { readContracts } from '@wagmi/core';
import { config } from '@/app/src/lib/wagmi';
import { pregrantABI, reservepregrantABI } from '@/app/src/lib/abi';
import { DBService } from '../services/dbService';
import { DBGlobalConfig } from '@/app/api/testGrants/services/dbService';
import { formatEther } from 'viem';

const pregrantContract = {
  address: '0x32b5C3C43bEcadCdaF12dae12AB5FB2687326a9c' as const,
  abi: pregrantABI,
  chainId: 11155111,
} as const;

const reservepregrantContract = {
  address: '0xc829A1C939EB5E9D441e61f4566a7322c0CE247f' as const,
  abi: reservepregrantABI,
  chainId: 11155111,
} as const;

export async function syncGlobalGrants() {
  try {
    const globalGrantId = 1; // 假设全局唯一的 globalGrantId 是 1

    const results = await readContracts(config, {
      contracts: [
        { ...pregrantContract, functionName: 'getLaunchDayTimestamp' },
        { ...pregrantContract, functionName: 'getAmount' },
        { ...reservepregrantContract, functionName: 'maxReservationsPerGrant' },
      ],
    });

    const [launchDayTimestampResult, amountResult, maxReservationsResult] = results;

    // 数据校验
    if (
      launchDayTimestampResult.status !== 'success' ||
      amountResult.status !== 'success' ||
      maxReservationsResult.status !== 'success'
    ) {
      console.error('Error: One or more contract reads failed');
      return;
    }

    const launchDayTimestamp = Number(launchDayTimestampResult.result);
    const amount = formatEther(amountResult.result as bigint); // 转换为字符串形式的ETH金额
    const maxReservationsPerGrant = Number(maxReservationsResult.result);

    const globalGrant: DBGlobalConfig = {
      id: globalGrantId,
      launchDayTimestamp,
      amount,
      maxReservationsPerGrant
    }

    await DBService.upsertGlobalGrant(globalGrant)

    console.log('Global grants synced successfully.');
    return globalGrantId; // 返回 globalGrantId
  } catch (error) {
    console.error('Error syncing global grants:', error);
    return null;
  }
}