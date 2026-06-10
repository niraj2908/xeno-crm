import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const customers = [
    { name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', phone: '+91-9876543210' },
    { name: 'Priya Patel', email: 'priya.patel@gmail.com', phone: '+91-9823456781' },
    { name: 'Rohit Verma', email: 'rohit.verma@gmail.com', phone: '+91-9712345678' },
    { name: 'Sneha Iyer', email: 'sneha.iyer@gmail.com', phone: '+91-9634567890' },
    { name: 'Karan Mehta', email: 'karan.mehta@gmail.com', phone: '+91-9556789012' },
    { name: 'Anjali Singh', email: 'anjali.singh@gmail.com', phone: '+91-9478901234' },
    { name: 'Vikram Nair', email: 'vikram.nair@gmail.com', phone: '+91-9390123456' },
    { name: 'Pooja Gupta', email: 'pooja.gupta@gmail.com', phone: '+91-9212345678' },
    { name: 'Amit Joshi', email: 'amit.joshi@gmail.com', phone: '+91-9134567890' },
    { name: 'Deepika Reddy', email: 'deepika.reddy@gmail.com', phone: '+91-9056789012' },
    { name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', phone: '+91-8978901234' },
    { name: 'Nisha Bhat', email: 'nisha.bhat@gmail.com', phone: '+91-8890123456' },
    { name: 'Suresh Pillai', email: 'suresh.pillai@gmail.com', phone: '+91-8812345678' },
    { name: 'Kavya Menon', email: 'kavya.menon@gmail.com', phone: '+91-8734567890' },
    { name: 'Arjun Chopra', email: 'arjun.chopra@gmail.com', phone: '+91-8656789012' },
    { name: 'Meera Saxena', email: 'meera.saxena@gmail.com', phone: '+91-8578901234' },
    { name: 'Nikhil Rao', email: 'nikhil.rao@gmail.com', phone: '+91-8490123456' },
    { name: 'Divya Agarwal', email: 'divya.agarwal@gmail.com', phone: '+91-8312345678' },
    { name: 'Sanjay Tiwari', email: 'sanjay.tiwari@gmail.com', phone: '+91-8234567890' },
    { name: 'Ritu Malhotra', email: 'ritu.malhotra@gmail.com', phone: '+91-8156789012' },
  ]

  for (const customer of customers) {
    const created = await prisma.customer.upsert({
      where: { email: customer.email },
      update: {},
      create: customer,
    })

    // Create 1-5 orders per customer
    const orderCount = Math.floor(Math.random() * 5) + 1
    for (let i = 0; i < orderCount; i++) {
      const daysAgo = Math.floor(Math.random() * 120)
      await prisma.order.create({
        data: {
          customerId: created.id,
          amount: Math.floor(Math.random() * 9000) + 500,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        },
      })
    }
  }

  console.log('✅ Seed complete — 20 customers with orders created')
}

main().catch(console.error).finally(() => prisma.$disconnect())
