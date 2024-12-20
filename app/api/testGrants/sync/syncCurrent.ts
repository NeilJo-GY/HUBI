import { readContract, readContracts } from '@wagmi/core';
import { config } from '@/app/src/lib/wagmi';
import { pregrantABI } from '@/app/src/lib/abi';
import { RedisService } from '../services/redisService';
import { GrantData } from '@/app/src/contexts/types';
import { formatEther } from 'viem';
import { GraphQLClient } from 'graphql-request';

// 定义 GraphQL 响应类型
interface GrantReservationCount {
  grantId: string;
  reservationCount: string;
}

interface GraphQLResponse {
  grantReservationCounts: GrantReservationCount[];
}

// 合约配置
const pregrantContract = {
  address: '0x32b5C3C43bEcadCdaF12dae12AB5FB2687326a9c' as const,
  abi: pregrantABI,
  chainId: 11155111,
} as const;

// GraphQL 配置
const GRAPH_API_URL = 'https://api.studio.thegraph.com/query/92345/hubi/version/latest';
const graphQLClient = new GraphQLClient(GRAPH_API_URL);

// GraphQL 查询
const GRANT_RESERVATION_COUNT_QUERY = `
  query getGrantReservationCount($grantId: String!) {
    grantReservationCounts(
      where: { grantId: $grantId }
      first: 1
    ) {
      grantId
      reservationCount
    }
  }
`;

async function fetchReservationCount(grantId: string): Promise<number> {
  try {
    const data = await graphQLClient.request<GraphQLResponse>(GRANT_RESERVATION_COUNT_QUERY, {
      grantId: grantId,
    });

    return Number(data.grantReservationCounts[0]?.reservationCount || '0');
  } catch (error) {
    console.error('Error fetching from GraphQL:', error);
    throw error;
  }
}

/**
 * 从链上获取当前的 Grant 数据并存储到 Redis
 */
export async function syncCurrentGrant() {
  try {
    // 1. 从链上批量获取当前状态数据
    const contractsResult = await readContracts(config, {
      contracts: [
        {
          ...pregrantContract,
          functionName: 'getCurrentId',
        },
        {
          ...pregrantContract,
          functionName: 'getAmount',
        }
      ],
    });

    const [currentIdResult, amountResult] = contractsResult;

    if (!currentIdResult.result || !amountResult.result) {
      throw new Error('Failed to fetch contract data');
    }

    const currentId = currentIdResult.result as bigint;
    const amount = amountResult.result as bigint;

    // 2. 获取时间戳
    const timestampsResult = await readContract(config, {
      ...pregrantContract,
      functionName: 'getGrantValidityPeriod',
      args: [currentId],
    }) as [bigint, bigint];

    const [startTimestamp, endTimestamp] = timestampsResult;

    // 3. 从 TheGraph 获取预留数量
    const reservationCount = await fetchReservationCount(currentId.toString());

    // 4. 构建当前Grant数据
    const currentGrant: GrantData = {
      grantId: Number(currentId),
      startTimestamp: Number(startTimestamp),
      endTimestamp: Number(endTimestamp),
      reservationCount: Number(reservationCount),
      grantTotalReserved: formatEther(BigInt(reservationCount) * amount)
    };

    // 5. 存储到Redis
    await RedisService.setCurrentGrant(currentGrant)

    console.log('Current grant cached successfully:', currentGrant);

    return currentGrant;
  } catch (error) {
    console.error('Error fetching and caching current grant:', error);
    throw error;
  }
}