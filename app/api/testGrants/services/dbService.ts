// app/api/grants/services/dbService.ts
import { db } from '@/app/src/config/db';
import { GlobalConfig, GrantData } from '@/app/src/contexts/types';

// 扩展数据库使用的 GrantData 类型
export interface DBGlobalConfig extends GlobalConfig {
  id: number;
}

// 扩展数据库使用的 GrantData 类型
export interface DBGrantData extends GrantData {
  globalGrantId: number;
}

export class DBService {
  static async upsertGlobalGrant(grant: DBGlobalConfig) {
    await db.query(`
      INSERT INTO global_grants (id, amount, max_reservations_per_grant, launch_day_timestamp)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET 
        amount = $2,
        max_reservations_per_grant = $3,
        launch_day_timestamp = $4
    `, [grant.id, grant.amount, grant.maxReservationsPerGrant, grant.launchDayTimestamp]);
  }

  static async upsertGrantCycle(cycle: DBGrantData) {
    await db.query(`
      INSERT INTO grant_cycles 
        (grant_id, global_grant_id, start_timestamp, end_timestamp, reservation_count, total_reserved)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (grant_id) DO UPDATE SET
        start_timestamp = $3,
        end_timestamp = $4,
        reservation_count = $5,
        total_reserved = $6
    `, [
      cycle.grantId,
      cycle.globalGrantId,
      cycle.startTimestamp,
      cycle.endTimestamp,
      cycle.reservationCount,
      cycle.grantTotalReserved
    ]);
  }

  static async getHistoryGrants(): Promise<GrantData[]> {
    try {
      // 打印调试信息
      console.log('Fetching history grants from database...');

      const { rows } = await db.query(`
        SELECT 
          gc.grant_id as "grantId",
          gc.start_timestamp as "startTimestamp",
          gc.end_timestamp as "endTimestamp",
          gc.reservation_count as "reservationCount",
          gc.total_reserved as "totalReserved"
        FROM grant_cycles gc
        ORDER BY gc.grant_id ASC
      `);

      return rows.map(row => ({
        grantId: Number(row.grantId),
        startTimestamp: Number(row.startTimestamp),
        endTimestamp: Number(row.endTimestamp),
        reservationCount: Number(row.reservationCount),
        grantTotalReserved: row.totalReserved.toString()
      }));
    } catch (error) {
      console.error('Error fetching history grants:', error);
      throw error;
    }
  }

  static async getGlobalConfig(): Promise<DBGlobalConfig> {
    const { rows } = await db.query(`
          SELECT 
              amount,
              launch_day_timestamp
          FROM global_grants
          WHERE id = 1
          LIMIT 1
      `);

    if (rows.length === 0) {
      throw new Error('Global config not found');
    }

    return {
      id: 1,
      amount: rows[0].amount,
      launchDayTimestamp: Number(rows[0].launch_day_timestamp),
      maxReservationsPerGrant: 0, // This value is not stored in the global_grants table
    };
  }
}