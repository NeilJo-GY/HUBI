// hooks/useGrantData.ts
import { useGrantContext } from '@/app/src/contexts/GrantContext';
import { useMemo } from 'react';

export const useGrantData = () => {
    // 获取数据库数据
    const { data, isLoading, error, refetch } = useGrantContext();

    // 合并数据
    const grants = useMemo(() => {
        if (!data?.currentGrant || !data?.historyGrants || !data?.globalConfig) {
            return null;
        }

        const allGrants = [
            ...data.historyGrants,
            data.currentGrant,
            data.nextGrant
        ].map(grant => ({
            grantId: grant.grantId,
            startTimestamp: grant.startTimestamp,
            endTimestamp: grant.endTimestamp,
            reservationCount: grant.reservationCount,
            grantTotalReserved: grant.grantTotalReserved,
            amount: data.globalConfig.amount,
        }));

        // console.log('Processed grants:', allGrants);
        return allGrants;
    }, [data]);

    return {
        grants,                                  // 所有周期数据（包含当前周期）
        currentGrant: data?.currentGrant,        // 当前周期数据
        historyGrants: data?.historyGrants,        // 历史周期数据
        totalReserved: data?.totalReserved,        // 所有周期的预留总额
        grantGlobalConfig: data?.globalConfig,         // 全局配置
        isLoading,
        error,
        refetch
    };
};