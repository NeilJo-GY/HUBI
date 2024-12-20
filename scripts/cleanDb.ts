import { db } from '../app/src/config/db.js';
import { getRedisClient, closeRedisConnection } from '../app/src/config/redis.js';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env' });

async function cleanDatabase() {
  let redisClient = null; // 初始化 Redis 客户端变量
  try {
    console.log('Starting database cleanup...');

    // 清理 PostgreSQL 表
    await db.query('TRUNCATE TABLE grant_cycles CASCADE');
    await db.query('TRUNCATE TABLE global_grants CASCADE');
    console.log('PostgreSQL tables cleaned');

    // 清理 Redis
    redisClient = await getRedisClient();
    await redisClient.del('current_grant');
    console.log('Redis cleaned');

    console.log('Database cleanup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database cleanup failed:', error);
    process.exit(1);
  } finally {
    // 确保关闭 Redis 连接
    if (redisClient) {
      await closeRedisConnection();
    }
  }
}

cleanDatabase();