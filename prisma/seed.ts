import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const deptIT = await prisma.department.create({ data: { name: 'IT' } })
  const posManager = await prisma.position.create({ data: { name: 'Manager' } })
  const posStaff = await prisma.position.create({ data: { name: 'Staff' } })

  const passwordHash = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hris.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@hris.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  const pegawai = await prisma.user.upsert({
    where: { email: 'pegawai@hris.com' },
    update: {},
    create: {
      nip: '123456789',
      name: 'Budi Pekerja',
      email: 'pegawai@hris.com',
      password: passwordHash,
      role: 'PEGAWAI',
      gender: 'LAKI_LAKI',
      departmentId: deptIT.id,
      positionId: posStaff.id,
    },
  })

  console.log('Seeding selesai! ✅')
  console.log({ admin, pegawai })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })