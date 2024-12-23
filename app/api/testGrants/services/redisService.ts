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

    let retries = 3; // 最多重试 3 次
    while (retries > 0) {
      try {
        await client.set('current_grant', JSON.stringify(grantToStore), { EX: 86400 });
        console.log('Successfully set current grant in Redis:', grantToStore);
        break; // 成功后退出循环
      } catch (error) {
        retries -= 1;
        console.error(`Error setting current grant, retries left: ${retries}`, error);
        if (retries === 0) throw error; // 超过重试次数抛出错误
      }
    }
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