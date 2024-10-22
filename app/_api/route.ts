import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 读取所有用户记录
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
