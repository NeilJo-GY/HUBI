// app/api/grants/sync/cron.ts
import { CronJob } from 'cron'
import { GrantService } from '../services/grantService'

export function initGrantSyncCron() {
    // 每5分钟同步一次
    const job = new CronJob('*/5 * * * *', async () => {
        try {
            console.log('Starting scheduled grant sync...')
            await GrantService.syncAll()
            console.log('Scheduled grant sync completed')
        } catch (error) {
            console.error('Error in scheduled grant sync:', error)
        }
    })

    job.start()
}