// app/api/testGrants/services/grantService.ts
import { syncGlobalGrants } from '../sync/syncGlobal'
import { syncGrantCycles } from '../sync/syncCycles'
import { syncCurrentGrant } from '../sync/syncCurrent'
import { DBService } from './dbService'
import { RedisService } from './redisService'
import { GrantContextData, GrantData, GlobalConfig } from '@/app/src/contexts/types';
import { formatEther } from 'viem';

export class GrantService {
    static async syncAll() {
        try {
            console.log('Starting grant sync...')

            // 同步全局配置
            const globalGrantId = await syncGlobalGrants()
            if (!globalGrantId) {
                throw new Error('Failed to sync global grants')
            }

            // 同步历史周期
            await syncGrantCycles(globalGrantId)

            // 同步当前状态
            await syncCurrentGrant()

            console.log('All grants synced successfully')
        } catch (error) {
            console.error('Error in grant sync:', error)
            throw error
        }
    }

    static async getAllGrants(): Promise<GrantContextData> {
        try {
            // 获取所有必要数据
            const historyGrants = await DBService.getHistoryGrants()
            let currentGrant = await RedisService.getCurrentGrant();
            const globalConfig = await DBService.getGlobalConfig();

            // 如果没有当前 grant，尝试同步
            if (!currentGrant) {
                await this.syncAll();
                currentGrant = await RedisService.getCurrentGrant();
                if (!currentGrant) throw new Error('Failed to sync current grant');
            }
            if (!globalConfig) throw new Error('Global config not found');

            // 格式化数据
            const formattedCurrentGrant: GrantData = {
                grantId: Number(currentGrant.grantId),
                startTimestamp: Number(currentGrant.startTimestamp),
                endTimestamp: Number(currentGrant.endTimestamp),
                reservationCount: Number(currentGrant.reservationCount),
                grantTotalReserved: currentGrant.grantTotalReserved
            };

            // 计算下一个 grant
            const nextGrant: GrantData = {
                grantId: formattedCurrentGrant.grantId + 1,
                startTimestamp: formattedCurrentGrant.endTimestamp + 1,
                endTimestamp: formattedCurrentGrant.endTimestamp + 1 +
                    (formattedCurrentGrant.endTimestamp - formattedCurrentGrant.startTimestamp),
                reservationCount: 0,
                grantTotalReserved: '0'
            };

            // 安全地格式化数据，确保所有数值都有效
            const formatAmount = (amount: bigint | string | number | undefined): string => {
                if (typeof amount === 'undefined') return '0';
                if (typeof amount === 'bigint') return formatEther(amount);
                if (typeof amount === 'string') return amount;
                return amount.toString();
            };

            // 格式化历史数据
            const formattedHistoryGrants: GrantData[] = historyGrants.map(grant => ({
                grantId: Number(grant.grantId),
                startTimestamp: Number(grant.startTimestamp),
                endTimestamp: Number(grant.endTimestamp),
                reservationCount: Number(grant.reservationCount),
                grantTotalReserved: formatAmount(grant.grantTotalReserved)
            }));

            // 计算总预留金额
            const totalReserved = [...formattedHistoryGrants, formattedCurrentGrant]
                .reduce((sum, grant) => sum + Number(grant.grantTotalReserved), 0)
                .toString();

            return {
                currentGrant: formattedCurrentGrant,
                historyGrants: formattedHistoryGrants,
                nextGrant,
                globalConfig: {
                    amount: formatAmount(globalConfig.amount),
                    launchDayTimestamp: Number(globalConfig.launchDayTimestamp),
                    maxReservationsPerGrant: Number(globalConfig.maxReservationsPerGrant)
                },
                totalReserved
            };
        } catch (error) {
            console.error('Error getting all grants:', error);
            throw error;
        }
    }
}