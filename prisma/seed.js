require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('.prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const passwordHash = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      email: 'admin@realityquest.com',
      username: 'admin',
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.username, '| Role:', admin.role);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
