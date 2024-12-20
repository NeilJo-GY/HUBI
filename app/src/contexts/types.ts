// app/src/contexts/types.ts

export interface GlobalConfig {
    amount: string;           // 每个周期的预留金额
    launchDayTimestamp: number; // 启动时间戳
    maxReservationsPerGrant: number; // 每个周期最大预留次数
}

export interface GrantData {
    grantId: number;
    startTimestamp: number;
    endTimestamp: number;
    reservationCount: number;
    grantTotalReserved: string; // 格式化后的ETH金额
}

export interface GrantContextData {
    historyGrants: GrantData[];
    currentGrant: GrantData;
    nextGrant: GrantData;
    globalConfig: GlobalConfig;
    totalReserved: string;    // 所有周期的预留总额
}