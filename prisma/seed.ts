import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      email: 'admin@realityquest.com',
      username: 'admin',
      passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('Admin user created:', admin.username, '| Role:', admin.role)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
