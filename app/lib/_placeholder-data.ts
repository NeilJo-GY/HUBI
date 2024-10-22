// 模拟 grant 数据
const grants = [
    {
        grantId: 1,
        startDate: '2024.09.20 00:00:00',
        endDate: '2024.09.26 23:59:59',
        addressCount: 10,
        totalReserved: 350,
        status: 'past', // 已完成，用户成功预留
        hasReserved: true, // 用户是否预留
        reservedAmount: 35, // 成功预留的UBI数量
    },
    {
        grantId: 2,
        startDate: '2024.09.20 00:00:00',
        endDate: '2024.09.26 23:59:59',
        addressCount: 10,
        totalReserved: 350,
        status: 'past', // 已完成，用户未预留
        hasReserved: false, // 用户未预留
    },
    {
        grantId: 3,
        startDate: '2024.09.20 00:00:00',
        endDate: '2024.09.26 23:59:59',
        addressCount: 10,
        totalReserved: 350,
        status: 'current', // 当前用户未预留
        hasReserved: false, // 用户尚未预留
    },
    {
        grantId: 4,
        startDate: '2024.09.20 00:00:00',
        endDate: '2024.09.26 23:59:59',
        addressCount: 10,
        totalReserved: 350,
        status: 'current', // 当前用户已预留
        hasReserved: true, // 用户已预留
        reservedAmount: 35, // 成功预留的UBI数量
    },
    {
        grantId: 5,
        startDate: '2024.09.20 00:00:00',
        endDate: '2024.09.26 23:59:59',
        addressCount: 0,
        totalReserved: 0,
        status: 'future', // 即将到来
        hasReserved: false, // 未预留
    },
];

// Sample data for recent reservations
const reservations = [
    "🚀 0x20...70 successfully reserved 35 UBI 8 secs ago.",
    "🚀 0x6d...8B successfully reserved 35 UBI 15 secs ago.",
    "🚀 0x81...0E successfully reserved 35 UBI 30 secs ago.",
    "🚀 0x86...E7 successfully reserved 35 UBI 30 secs ago.",
    "🚀 0x72...38 successfully reserved 35 UBI 56 secs ago."
]

module.exports = {
    grants,
    reservations,
  };