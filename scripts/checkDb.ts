// scripts/checkDb.ts

import { db } from '../app/src/config/db.js';
import { getRedisClient, closeRedisConnection } from '../app/src/config/redis.js';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env' });

async function checkConnections() {
  let redisClient = null;

  try {
    // 检查PostgreSQL连接
    const pgClient = await db.connect();
    console.log('PostgreSQL connected successfully');
    pgClient.release();

    // 检查Redis连接
    redisClient = await getRedisClient();
    await redisClient.ping();
    console.log('Redis connected successfully');

    process.exit(0);
  } catch (error) {
    console.error('Database connection check failed:', error);
    process.exit(1);
  } finally {
    await db.end();
    // 确保 Redis 连接关闭
    if (redisClient) {
      await closeRedisConnection();
    }
  }
}

checkConnections();