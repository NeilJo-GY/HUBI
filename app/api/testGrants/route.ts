// app/api/testGrants/route.ts
import { NextResponse } from 'next/server'
import { GrantService } from './services/grantService'

// 添加缓存控制
export const revalidate = 60; // 60秒的缓存时间

// 添加一个简单的内存缓存
let cachedData: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 60秒的缓存时间

export async function GET() {
    try {
        const now = Date.now();

        // 检查缓存是否有效
        if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
            return NextResponse.json(cachedData);
        }

        // 获取新数据
        const grants = await GrantService.getAllGrants();

        // 更新缓存
        cachedData = grants;
        lastFetchTime = now;

        return NextResponse.json(grants, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
            },
        });
    } catch (error) {
        console.error('Error in grants API:', error);

        // 如果缓存存在，在错误时返回缓存的数据
        if (cachedData) {
            console.log('Returning cached data due to error');
            return NextResponse.json(cachedData);
        }

        // 只有在没有缓存数据时才尝试同步
        try {
            await GrantService.syncAll();
            const grants = await GrantService.getAllGrants();

            // 更新缓存
            cachedData = grants;
            lastFetchTime = Date.now();

            return NextResponse.json(grants);
        } catch (syncError) {
            console.error('Error after sync attempt:', syncError);
            return NextResponse.json(
                {
                    error: 'Failed to fetch and sync grants',
                    details: syncError instanceof Error ? syncError.message : 'Unknown error'
                },
                { status: 500 }
            );
        }
    }
}

// POST 端点只用于手动触发同步
export async function POST() {
    try {
        await GrantService.syncAll();

        // 同步后清除缓存，强制下次 GET 请求获取新数据
        cachedData = null;
        lastFetchTime = 0;

        return NextResponse.json({
            message: 'Sync completed successfully',
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Error in grants sync API:', error);
        return NextResponse.json(
            { error: 'Sync failed' },
            { status: 500 }
        );
    }
}