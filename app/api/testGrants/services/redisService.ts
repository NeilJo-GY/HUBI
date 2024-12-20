// app/api/grants/services/redisService.ts
import { getRedisClient } from '@/app/src/config/redis';
import { GrantData } from '@/app/src/contexts/types';

export class RedisService {
  static async setCurrentGrant(grant: GrantData) {
    const client = await getRedisClient();
    // 在存储前转换 BigInt
    const grantToStore = {
      ...grant,
      grantTotalReserved: grant.grantTotalReserved // 转换为 ETH 单位的字符串
    };

    await client.set(
      'current_grant',
      JSON.stringify(grantToStore),
      { EX: 86400 } // 1天过期
    )
  }

  static async getCurrentGrant(): Promise<GrantData | null> {
    const client = await getRedisClient();
    try {
      const data = await client.get('current_grant')
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error getting current grant:', error);
      throw error;
    }
  }
}