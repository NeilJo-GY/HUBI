// scripts/verifyData.ts
import { db } from '../app/src/config/db.js';
import { getRedisClient, closeRedisConnection } from '../app/src/config/redis.js';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env' });

async function verifyData() {
  let redisClient = null;

  try {
    console.log('Verifying database data...');

    // 查询全局配置
    const { rows: globalGrants } = await db.query('SELECT * FROM global_grants');
    console.log('\nGlobal Grants:', globalGrants);

    // 查询周期数据
    const { rows: grantCycles } = await db.query('SELECT * FROM grant_cycles');
    console.log('\nGrant Cycles:', grantCycles);

    // 查询Redis数据
    redisClient = await getRedisClient();
    const currentGrant = await redisClient.get('current_grant');
    console.log('\nCurrent Grant:', currentGrant ? JSON.parse(currentGrant) : null);

    console.log('\nVerification completed');
    process.exit(0);
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  } finally {
    // 确保 Redis 连接关闭
    if (redisClient) {
      await closeRedisConnection();
    }
  }
}

verifyData();