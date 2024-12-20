// app/src/config/redis.ts
import { createClient } from 'redis';

// 创建一个单例 Redis 客户端
let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({
            url: process.env.REDIS_URL
        });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });
    }

    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    return redisClient;
}

export async function closeRedisConnection() {
    if (redisClient && redisClient.isOpen) {
        await redisClient.quit();
        redisClient = null;
    }
}