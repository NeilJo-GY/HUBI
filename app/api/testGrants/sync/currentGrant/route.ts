import { NextResponse } from 'next/server';
import { syncCurrentGrant } from '../syncCurrent';

export async function POST() {
    try {
        // 调用核心逻辑，完成同步当前 Grant
        const currentGrant = await syncCurrentGrant();

        return NextResponse.json({
            message: 'Current grant synced successfully',
            data: currentGrant,
        });
    } catch (error: any) {
        console.error('Error syncing current grant:', error);
        return NextResponse.json(
            {
                error: 'Failed to sync current grant',
                details: error.message || 'Unknown error',
            },
            { status: 500 }
        );
    }
}