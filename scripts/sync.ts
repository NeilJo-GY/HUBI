import { GrantService } from '../app/api/testGrants/services/grantService.js';
import { getRedisClient, closeRedisConnection } from '../app/src/config/redis.js';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env' });

async function runSync() {
  let redisClient = null;

  try {
    console.log('Starting data sync...');

    // 确保Redis连接
    redisClient = await getRedisClient();

    // 执行同步
    await GrantService.syncAll();

    console.log('Data sync completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  } finally {
    // 确保 Redis 连接关闭
    if (redisClient) {
      await closeRedisConnection();
    }
  }
}

runSync();