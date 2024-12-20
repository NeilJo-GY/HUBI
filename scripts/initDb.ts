import { db } from '../app/src/config/db.js';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env' });

async function initDatabase() {
  try {
    console.log('Starting database initialization...');

    // 创建全局配置表
    await db.query(`
      CREATE TABLE IF NOT EXISTS global_grants (
        id INTEGER PRIMARY KEY,
        amount VARCHAR(255) NOT NULL,
        max_reservations_per_grant VARCHAR(255) NOT NULL,
        launch_day_timestamp BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created global_grants table');

    // 创建周期表
    await db.query(`
      CREATE TABLE IF NOT EXISTS grant_cycles (
        grant_id INTEGER PRIMARY KEY,
        global_grant_id INTEGER NOT NULL,
        start_timestamp BIGINT NOT NULL,
        end_timestamp BIGINT NOT NULL,
        reservation_count INTEGER NOT NULL,
        total_reserved NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (global_grant_id) REFERENCES global_grants(id)
      );
    `);
    console.log('Created grant_cycles table');

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();