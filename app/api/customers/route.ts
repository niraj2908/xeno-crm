import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const customers = await prisma.customer.findMany({
    include: { orders: { select: { amount: true } } },
    orderBy: { createdAt: "desc" },
  })

  const result = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    orderCount: c.orders.length,
    totalSpend: c.orders.reduce((sum, o) => sum + o.amount, 0),
    createdAt: c.createdAt,
  }))

  return NextResponse.json(result)
}
