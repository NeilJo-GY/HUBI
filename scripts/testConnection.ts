import { db } from '../app/src/config/db.js';
import { getRedisClient, closeRedisConnection } from '../app/src/config/redis.js';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env' });

async function testConnection() {
  try {
    // 测试 PostgreSQL 连接
    console.log('Testing database connection...');
    console.log('Connection URL:', process.env.POSTGRES_URL); // 添加这行来检查URL是否正确加载

    // 测试连接
    const result = await db.query('SELECT NOW()');
    console.log('Successfully connected to database');
    console.log('Query result:', result.rows[0]);

    // 测试 Redis
    console.log('Redis URL:', process.env.REDIS_URL);
    const redisClient = await getRedisClient();
    await redisClient.ping();
    console.log('Redis connected successfully');

    process.exit(0);
  } catch (error) {
    console.error('Connection test failed:', error);
    process.exit(1);
  } finally {
    // 清理连接
    await closeRedisConnection();
    await db.end();
  }
}

testConnection();